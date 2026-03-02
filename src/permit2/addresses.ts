// Permit2 Contract Addresses (Uniswap)
export const PERMIT2_ADDRESSES: Record<number, string> = {
  1: '0x000000000022D473030F116dDEE9F6B43aC78BA3',     // Ethereum
  56: '0x000000000022D473030F116dDEE9F6B43aC78BA3',     // BSC
  137: '0x000000000022D473030F116dDEE9F6B43aC78BA3',    // Polygon
  42161: '0x000000000022D473030F116dDEE9F6B43aC78BA3',  // Arbitrum
  8453: '0x000000000022D473030F116dDEE9F6B43aC78BA3',   // Base
  10: '0x000000000022D473030F116dDEE9F6B43aC78BA3',     // Optimism
  43114: '0x000000000022D473030F116dDEE9F6B43aC78BA3',  // Avalanche
};

// Permit2 ABI (minimal)
export const PERMIT2_ABI = [
  {
    name: 'approve',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'token', type: 'address' },
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint160' },
      { name: 'expiration', type: 'uint48' }
    ],
    outputs: []
  },
  {
    name: 'allowance',
    type: 'function',
    stateMutability: 'view',
    inputs: [
      { name: 'user', type: 'address' },
      { name: 'token', type: 'address' },
      { name: 'spender', type: 'address' }
    ],
    outputs: [
      { name: 'amount', type: 'uint160' },
      { name: 'expiration', type: 'uint48' },
      { name: 'nonce', type: 'uint32' }
    ]
  },
  {
    name: 'permitTransferFrom',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      {
        name: 'permitTransfer',
        type: 'tuple',
        components: [
          { name: 'permitted', type: 'tuple', components: [{ name: 'token', type: 'address' }, { name: 'amount', type: 'uint256' }] },
          { name: 'nonce', type: 'uint256' },
          { name: 'deadline', type: 'uint256' }
        ]
      },
      { name: 'transferDetails', type: 'tuple', components: [{ name: 'to', type: 'address' }, { name: 'requestedAmount', type: 'uint256' }] },
      { name: 'owner', type: 'address' },
      { name: 'signature', type: 'bytes' }
    ],
    outputs: []
  }
];

// EIP-712 Domain for Permit2
export function getPermit2Domain(chainId: number) {
  return {
    name: 'Permit2',
    chainId,
    verifyingContract: PERMIT2_ADDRESSES[chainId],
  };
}
