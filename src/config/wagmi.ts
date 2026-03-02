import { createConfig, http } from 'wagmi';
import { mainnet, bsc, polygon, arbitrum, base } from 'viem/chains';
import { injected } from 'wagmi/connectors';

export const config = createConfig({
  chains: [bsc, mainnet, polygon, arbitrum, base],
  connectors: [
    injected({ 
      target: 'metaMask',
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
