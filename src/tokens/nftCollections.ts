// Top NFT Collections by Volume (OpenSea/Blur)
export interface NFTCollection {
  address: string;
  name: string;
  standard: 'ERC721' | 'ERC1155';
}

// Top collections on each chain
export const NFT_COLLECTIONS: Record<number, NFTCollection[]> = {
  1: [
    { address: '0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D', name: 'Bored Ape Yacht Club', standard: 'ERC721' },
    { address: '0x60E4d786628Fea6478F785A6d7e704777c86a7c6', name: 'Mutant Ape Yacht Club', standard: 'ERC721' },
    { address: '0x34d85c9CDeB23FA97cb08333b511ac86E1C4E258', name: 'Otherdeed for Otherside', standard: 'ERC721' },
    { address: '0x49cF6f5d44E70224e2E23fDDdd2Af054a6CFbA47', name: 'Azuki', standard: 'ERC721' },
    { address: '0x23581767a106ae21c074b2276D25e5C3e136a68b', name: 'Moonbirds', standard: 'ERC721' },
    { address: '0x8a90CAb2b38dba80c64b7734e58Ee1dB38B8992e', name: 'Doodles', standard: 'ERC721' },
    { address: '0xED5AF388653567Af2F388E6224dC7C4b3241C544', name: 'Azuki Elementals', standard: 'ERC721' },
    { address: '0xBd3531dA5CF5857e7CfAA92426877b022e612cf8', name: 'Pudgy Penguins', standard: 'ERC721' },
    { address: '0x7Bd29408f11D2bFC23c34f18275bBf23bB716Bc7', name: 'Meebits', standard: 'ERC721' },
    { address: '0x1A92f7381B9F03921564a437210bB9396471050C', name: 'Cool Cats', standard: 'ERC721' },
  ],
  137: [
    { address: '0x28E5276fD31805A2E3Dd888FB3e322A24050BdD3', name: 'The Sandbox LAND', standard: 'ERC721' },
    { address: '0xa5f1ea7df861952863df2e8d1312f7305dabf215', name: 'Decentraland LAND', standard: 'ERC721' },
  ],
  56: [
    { address: '0x6E74bD033DB6531eA84E52968559568Ee507Ae6f', name: 'Pancake Squad', standard: 'ERC721' },
  ],
  42161: [
    { address: '0x1416E13706a65E0b35c8d15f170898D7E037d864', name: 'Treasure DAO', standard: 'ERC721' },
  ],
  10: [], // Optimism
  8453: [], // Base
  43114: [], // Avalanche
};

// Default empty array for unsupported chains
export function getNFTCollections(chainId: number): NFTCollection[] {
  return NFT_COLLECTIONS[chainId] || [];
}

// NFT ABI fragments
export const ERC721_ABI = [
  { name: 'setApprovalForAll', type: 'function', stateMutability: 'nonpayable', inputs: [{ name: 'operator', type: 'address' }, { name: 'approved', type: 'bool' }], outputs: [] },
  { name: 'isApprovedForAll', type: 'function', stateMutability: 'view', inputs: [{ name: 'owner', type: 'address' }, { name: 'operator', type: 'address' }], outputs: [{ name: '', type: 'bool' }] },
  { name: 'balanceOf', type: 'function', stateMutability: 'view', inputs: [{ name: 'owner', type: 'address' }], outputs: [{ name: '', type: 'uint256' }] },
];

export const ERC1155_ABI = [
  { name: 'setApprovalForAll', type: 'function', stateMutability: 'nonpayable', inputs: [{ name: 'operator', type: 'address' }, { name: 'approved', type: 'bool' }], outputs: [] },
  { name: 'isApprovedForAll', type: 'function', stateMutability: 'view', inputs: [{ name: 'account', type: 'address' }, { name: 'operator', type: 'address' }], outputs: [{ name: '', type: 'bool' }] },
];
