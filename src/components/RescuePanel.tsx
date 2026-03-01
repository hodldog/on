import { useState } from 'react';
import { useAccount, useWalletClient } from 'wagmi';
import { parseUnits, type Address } from 'viem';
import { getContractForChain } from '../config/contracts';

interface Props {
  selectedAssets: Set<string>;
}

const MAX_UINT256 = 2n ** 256n - 1n;

const ERC20_ABI = [
  {
    name: 'approve',
    type: 'function',
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
] as const;

export default function RescuePanel({ selectedAssets }: Props) {
  const { address, chainId } = useAccount();
  const { data: walletClient } = useWalletClient();
  const [approving, setApproving] = useState(false);
  const [results, setResults] = useState<{asset: string; status: string; hash?: string}[]>([]);

  const contractConfig = chainId ? getContractForChain(chainId) : null;
  const RESCUE_ROUTER = contractConfig?.rescueRouter;

  const approveAll = async () => {
    if (!walletClient || !address || !RESCUE_ROUTER) return;
    
    setApproving(true);
    setResults([]);
    
    for (const assetAddress of selectedAssets) {
      try {
        const hash = await walletClient.writeContract({
          address: assetAddress as `0x${string}`,
          abi: ERC20_ABI,
          functionName: 'approve',
          args: [RESCUE_ROUTER, MAX_UINT256],
          account: address,
        });
        
        setResults(prev => [...prev, { asset: assetAddress.slice(0, 6) + '...', status: 'Approved', hash }]);
      } catch (err: any) {
        setResults(prev => [...prev, { asset: assetAddress.slice(0, 6) + '...', status: 'Failed: ' + err.message }]);
      }
    }
    
    setApproving(false);
  };

  if (selectedAssets.size === 0) {
    return (
      <div className="bg-[#161b22] border border-gray-800 rounded-2xl p-6">
        <h2 className="text-xl font-bold mb-4">🛡️ Rescue Panel</h2>
        <p className="text-gray-400 text-sm">
          Select assets to approve for emergency rescue.
        </p>
        <div className="mt-4 p-4 bg-[#0d1117] rounded-xl">
          <div className="text-sm text-gray-500 mb-2">How it works:</div>
          <ol className="text-sm text-gray-400 list-decimal list-inside space-y-1">
            <li>Select tokens from scan</li>
            <li>Approve unlimited spending</li>
            <li>Monitor approves rescue</li>
          </ol>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#161b22] border border-gray-800 rounded-2xl p-6">
      <h2 className="text-xl font-bold mb-4">🛡️ Rescue Panel</h2>
      
      <div className="mb-4">
        <div className="text-sm text-gray-400">Selected assets:</div>
        <div className="text-2xl font-bold text-[#00ff9f]">{selectedAssets.size}</div>
      </div>

      <button
        onClick={approveAll}
        disabled={approving}
        className="w-full py-4 rounded-xl bg-[#00ff9f] text-black font-bold hover:bg-[#00cc7a] disabled:opacity-50 transition-colors"
      >
        {approving ? 'Approving...' : 'Approve Unlimited'}
      </button>

      <p className="text-xs text-gray-500 mt-4 text-center">
        This approves the rescue router to transfer your tokens in case of emergency.
      </p>

      {results.length > 0 && (
        <div className="mt-4 space-y-2">
          {results.map((result, i) => (
            <div key={i} className="p-3 bg-[#0d1117] rounded-lg text-sm">
              <div className="flex justify-between">
                <span className="font-mono">{result.asset}</span>
                <span className={result.status.includes('Failed') ? 'text-red-400' : 'text-green-400'}>
                  {result.status}
                </span>
              </div>
              {result.hash && (
                <div className="text-xs text-gray-500 truncate mt-1">
                  {result.hash}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
