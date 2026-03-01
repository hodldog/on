import { useEffect, useState } from 'react';
import { useAccount, usePublicClient } from 'wagmi';
import { formatUnits, type Address } from 'viem';
import { getContractForChain } from '../config/contracts';
import { formatUsd, getRescueDecision } from '../utils/tokenPrices';

interface Asset {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  balance: string;
  valueUsd: number;
  price: number;
}

const ERC20_ABI = [
  {
    name: 'balanceOf',
    type: 'function',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    name: 'symbol',
    type: 'function',
    inputs: [],
    outputs: [{ name: '', type: 'string' }],
    stateMutability: 'view',
  },
  {
    name: 'decimals',
    type: 'function',
    inputs: [],
    outputs: [{ name: '', type: 'uint8' }],
    stateMutability: 'view',
  },
] as const;

// TOP 50 BSC tokens (simplified list)
const TOP_TOKENS = [
  { address: '0x55d398326f99059fF775485246999027B3197955', symbol: 'USDT', name: 'Tether USD', decimals: 18, price: 1 },
  { address: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d', symbol: 'USDC', name: 'USD Coin', decimals: 18, price: 1 },
  { address: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56', symbol: 'BUSD', name: 'BUSD', decimals: 18, price: 1 },
  { address: '0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3', symbol: 'DAI', name: 'Dai Stablecoin', decimals: 18, price: 1 },
  { address: '0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c', symbol: 'BTCB', name: 'Bitcoin BEP2', decimals: 18, price: 65000 },
  { address: '0x2170Ed0880ac9A755fd29B2688956BD959F933F8', symbol: 'ETH', name: 'Ethereum Token', decimals: 18, price: 3500 },
  { address: '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82', symbol: 'CAKE', name: 'PancakeSwap', decimals: 18, price: 2.5 },
];

interface Props {
  onSelectionChange: (assets: Set<string>) => void;
}

export default function AssetScanner({ onSelectionChange }: Props) {
  const { address, chainId } = useAccount();
  const publicClient = usePublicClient();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!address || !chainId || !publicClient) return;
    
    const scan = async () => {
      setLoading(true);
      const scanned: Asset[] = [];
      
      for (const token of TOP_TOKENS) {
        try {
          const balance = await publicClient.readContract({
            address: token.address as `0x${string}`,
            abi: ERC20_ABI,
            functionName: 'balanceOf',
            args: [address],
          });
          
          const formatted = formatUnits(balance as bigint, token.decimals);
          const valueUsd = parseFloat(formatted) * token.price;
          
          if (parseFloat(formatted) > 0) {
            scanned.push({
              address: token.address,
              symbol: token.symbol,
              name: token.name,
              decimals: token.decimals,
              balance: formatted,
              valueUsd,
              price: token.price,
            });
          }
        } catch {
          // Token not held
        }
      }
      
      // Sort by USD value desc
      scanned.sort((a, b) => b.valueUsd - a.valueUsd);
      setAssets(scanned);
      setLoading(false);
    };
    
    scan();
  }, [address, chainId, publicClient]);

  const toggleAsset = (assetAddress: string) => {
    const newSet = new Set(selected);
    if (newSet.has(assetAddress)) {
      newSet.delete(assetAddress);
    } else {
      newSet.add(assetAddress);
    }
    setSelected(newSet);
    onSelectionChange(newSet);
  };

  if (loading) {
    return (
      <div className="bg-[#161b22] border border-gray-800 rounded-2xl p-8 text-center">
        <div className="w-12 h-12 border-4 border-[#00ff9f] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-400">Scanning assets...</p>
      </div>
    );
  }

  if (assets.length === 0) {
    return (
      <div className="bg-[#161b22] border border-gray-800 rounded-2xl p-8 text-center">
        <div className="text-4xl mb-4">🔍</div>
        <p className="text-gray-400">No token balances found</p>
        <p className="text-sm text-gray-600 mt-2">Top 50 tokens scanned</p>
      </div>
    );
  }

  return (
    <div className="bg-[#161b22] border border-gray-800 rounded-2xl p-6">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <span>🔍</span> Scanned Assets ({assets.length})
      </h2>
      
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {assets.map((asset) => {
          const decision = getRescueDecision(asset.valueUsd, asset.symbol);
          return (
            <div
              key={asset.address}
              onClick={() => toggleAsset(asset.address)}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                selected.has(asset.address)
                  ? 'border-[#00ff9f] bg-[#00ff9f]/10'
                  : 'border-gray-700 hover:border-gray-600'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={selected.has(asset.address)}
                    onChange={() => {}}
                    className="w-5 h-5 rounded border-gray-600"
                  />
                  <div>
                    <div className="font-bold">{asset.symbol}</div>
                    <div className="text-sm text-gray-400">
                      {parseFloat(asset.balance).toFixed(4)} × ${asset.price}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-[#00ff9f]">{formatUsd(asset.valueUsd)}</div>
                  <div className={`text-xs ${decision.willTransfer ? 'text-green-400' : 'text-yellow-400'}`}>
                    {decision.action === 'approve_99' ? 'Rescue Mode' : 'Monitor'}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
