import { useState, useCallback } from 'react';
import { useAccount, useWalletClient, usePublicClient } from 'wagmi';
import { parseUnits, type Address } from 'viem';
import { getContractForChain } from '../config/contracts';

interface RescueStatus {
  status: 'idle' | 'approving' | 'approved' | 'failed';
  txHash?: string;
  error?: string;
}

export function useAutoRescue() {
  const { address, chainId } = useAccount();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  
  const [status, setStatus] = useState<RescueStatus>({ status: 'idle' });

  const approveToken = useCallback(async (
    tokenAddress: Address,
    amount: bigint
  ): Promise<string | null> => {
    if (!walletClient || !address || !chainId) {
      throw new Error('Wallet not connected');
    }

    const config = getContractForChain(chainId);
    if (!config) {
      throw new Error('Unsupported chain');
    }

    setStatus({ status: 'approving' });

    try {
      const hash = await walletClient.writeContract({
        address: tokenAddress,
        abi: [{
          name: 'approve',
          type: 'function',
          inputs: [
            { name: 'spender', type: 'address' },
            { name: 'amount', type: 'uint256' },
          ],
          outputs: [{ name: '', type: 'bool' }],
          stateMutability: 'nonpayable',
        }],
        functionName: 'approve',
        args: [config.rescueRouter, amount],
        account: address,
      });

      setStatus({ status: 'approved', txHash: hash });
      return hash;
    } catch (err: any) {
      setStatus({ status: 'failed', error: err.message });
      return null;
    }
  }, [walletClient, address, chainId]);

  return {
    approveToken,
    status,
    isApproving: status.status === 'approving',
  };
}
