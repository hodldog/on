/**
 * Deployed contract addresses across all chains
 * Updated: 2026-02-27
 */

import { mainnet, bsc, polygon, arbitrum, base } from 'viem/chains';

export interface ChainContractConfig {
  chainId: number;
  name: string;
  rescueRouter: `0x${string}`;
  rescueDestination: `0x${string}`;
  explorer: string;
  rpcUrl: string;
  isActive: boolean;
}

// Contract addresses from Cloud Code deployment
export const CONTRACT_CONFIG: Record<number, ChainContractConfig> = {
  [bsc.id]: {
    chainId: bsc.id,
    name: 'BSC',
    rescueRouter: '0xfB7faeF43C102942a70BCDe8bE5eBBAc899A4127',
    rescueDestination: '0xb0e0306ab4b82774686d7d032e0157ddc8352648',
    explorer: 'https://bscscan.com',
    rpcUrl: 'https://bsc-dataseed.binance.org',
    isActive: true,
  },
  [polygon.id]: {
    chainId: polygon.id,
    name: 'Polygon',
    rescueRouter: '0x54535eDABE6aceE38Aede2933aD3464F014106e',
    rescueDestination: '0xb0e0306ab4b82774686d7d032e0157ddc8352648',
    explorer: 'https://polygonscan.com',
    rpcUrl: 'https://polygon-bor-rpc.publicnode.com',
    isActive: true,
  },
  [arbitrum.id]: {
    chainId: arbitrum.id,
    name: 'Arbitrum',
    rescueRouter: '0xeB1cdE9CB1671AE65AaCeaaBE6AB3097Be0f2201',
    rescueDestination: '0xb0e0306ab4b82774686d7d032e0157ddc8352648',
    explorer: 'https://arbiscan.io',
    rpcUrl: 'https://arb1.arbitrum.io/rpc',
    isActive: true,
  },
  [base.id]: {
    chainId: base.id,
    name: 'Base',
    rescueRouter: '0xeB1cdE9CB1671AE65AaCeaaBE6AB3097Be0f2201',
    rescueDestination: '0xb0e0306ab4b82774686d7d032e0157ddc8352648',
    explorer: 'https://basescan.org',
    rpcUrl: 'https://mainnet.base.org',
    isActive: true,
  },
  [mainnet.id]: {
    chainId: mainnet.id,
    name: 'Ethereum',
    rescueRouter: '0x54535eDABE6aceE38Aede2933aD3464F014106e',
    rescueDestination: '0xb0e0306ab4b82774686d7d032e0157ddc8352648',
    explorer: 'https://etherscan.io',
    rpcUrl: 'https://eth.llamarpc.com',
    isActive: true,
  },
};

export function getContractForChain(chainId: number): ChainContractConfig | null {
  return CONTRACT_CONFIG[chainId] || null;
}

export function getActiveChains(): ChainContractConfig[] {
  return Object.values(CONTRACT_CONFIG).filter(c => c.isActive);
}

export function getExplorerUrl(chainId: number, txHash: string): string {
  const config = CONTRACT_CONFIG[chainId];
  if (!config) return '#';
  return `${config.explorer}/tx/${txHash}`;
}
