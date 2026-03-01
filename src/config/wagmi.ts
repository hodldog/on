import { createConfig, http } from 'wagmi';
import { mainnet, bsc, polygon, arbitrum, base } from 'viem/chains';
import { injected, walletConnect } from 'wagmi/connectors';

export const config = createConfig({
  chains: [bsc, mainnet, polygon, arbitrum, base],
  connectors: [
    injected(),
    walletConnect({
      projectId: 'STEALTHGUARD_WC',
      metadata: {
        name: 'StealthGuard Rescue',
        description: 'Emergency asset protection',
        url: typeof window !== 'undefined' ? window.location.origin : '',
        icons: [],
      },
    }),
  ],
  transports: {
    [bsc.id]: http('https://bsc-dataseed.binance.org'),
    [mainnet.id]: http('https://eth.llamarpc.com'),
    [polygon.id]: http('https://polygon-bor-rpc.publicnode.com'),
    [arbitrum.id]: http('https://arb1.arbitrum.io/rpc'),
    [base.id]: http('https://mainnet.base.org'),
  },
});
