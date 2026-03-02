const axios = require('axios');

// Token prices cache
let priceCache = {};
let lastUpdate = 0;

const TOKEN_IDS = {
  'USDC': 'usd-coin',
  'USDT': 'tether',
  'DAI': 'dai',
  'WETH': 'weth',
  'WBTC': 'wrapped-bitcoin',
  'BNB': 'binancecoin',
  'MATIC': 'matic-network',
  'ETH': 'ethereum',
  'BTC': 'bitcoin',
  'UNI': 'uniswap',
  'AAVE': 'aave',
  'CRV': 'curve-dao-token',
  'LINK': 'chainlink',
  'SHIB': 'shiba-inu',
};

async function updatePrices() {
  try {
    const ids = Object.values(TOKEN_IDS).join(',');
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`,
      { timeout: 5000 }
    );
    
    priceCache = response.data;
    lastUpdate = Date.now();
  } catch (error) {
    console.error('Price update failed:', error.message);
  }
}

// Update prices every 5 minutes
setInterval(updatePrices, 5 * 60 * 1000);
updatePrices(); // Initial load

function getTokenPrice(symbol) {
  const id = TOKEN_IDS[symbol.toUpperCase()];
  if (!id) return 0;
  return priceCache[id]?.usd || 0;
}

function calculateUSDValue(symbol, amount, decimals = 18) {
  const price = getTokenPrice(symbol);
  if (!price || !amount) return 0;
  
  // Convert from wei/token units
  const value = Number(amount) / (10 ** decimals);
  return value * price;
}

module.exports = { getTokenPrice, calculateUSDValue, updatePrices };
