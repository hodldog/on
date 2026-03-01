import { type Address, type WalletClient } from 'viem';

const MAX_UINT256 = BigInt('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff');

export interface PermitSignature {
  v: number;
  r: string;
  s: string;
  deadline: bigint;
}

// Tokens that support EIP-2612 permit
const PERMIT_SUPPORTED_TOKENS: Record<number, string[]> = {
  1: ['USDC', 'USDT', 'DAI', 'AAVE', 'UNI', 'LINK', 'CRV'],
  56: ['USDC', 'USDT', 'DAI', 'BUSD'],
  137: ['USDC', 'USDT', 'DAI'],
  42161: ['USDC', 'USDT', 'DAI'],
  8453: ['USDC'],
};

export function checkPermitSupport(symbol: string, chainId: number): boolean {
  const supported = PERMIT_SUPPORTED_TOKENS[chainId] || [];
  return supported.includes(symbol.toUpperCase());
}

export function getTokenNameForPermit(symbol: string): string {
  const names: Record<string, string> = {
    'USDC': 'USD Coin',
    'USDT': 'Tether USD',
    'DAI': 'Dai Stablecoin',
    'BUSD': 'Binance USD',
    'AAVE': 'Aave Token',
    'UNI': 'Uniswap',
    'LINK': 'ChainLink Token',
    'CRV': 'Curve DAO Token',
  };
  return names[symbol.toUpperCase()] || symbol;
}

export async function signPermit(
  walletClient: WalletClient,
  tokenName: string,
  tokenAddress: Address,
  chainId: number,
  params: {
    owner: Address;
    spender: Address;
    value: bigint;
    nonce: bigint;
    deadline: bigint;
  }
): Promise<PermitSignature | null> {
  try {
    const domain = {
      name: tokenName,
      version: tokenName === 'USD Coin' ? '2' : '1',
      chainId: BigInt(chainId),
      verifyingContract: tokenAddress,
    };

    const types = {
      Permit: [
        { name: 'owner', type: 'address' },
        { name: 'spender', type: 'address' },
        { name: 'value', type: 'uint256' },
        { name: 'nonce', type: 'uint256' },
        { name: 'deadline', type: 'uint256' },
      ],
    };

    const signature = await walletClient.signTypedData({
      domain,
      types,
      primaryType: 'Permit',
      message: params,
      account: params.owner,
    });

    // Parse signature
    const r = '0x' + signature.slice(2, 66);
    const s = '0x' + signature.slice(66, 130);
    const v = parseInt(signature.slice(130, 132), 16);

    return { v, r, s, deadline: params.deadline };
  } catch {
    return null;
  }
}

export async function getPermitNonce(
  publicClient: any,
  tokenAddress: Address,
  owner: Address
): Promise<bigint> {
  try {
    const nonce = await publicClient.readContract({
      address: tokenAddress,
      abi: [{
        name: 'nonces',
        type: 'function',
        inputs: [{ name: 'owner', type: 'address' }],
        outputs: [{ name: '', type: 'uint256' }],
        stateMutability: 'view',
      }],
      functionName: 'nonces',
      args: [owner],
    });
    return nonce as bigint;
  } catch {
    return 0n;
  }
}

export { MAX_UINT256 };
