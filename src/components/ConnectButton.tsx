import { useAccount, useConnect, useDisconnect, useChainId } from 'wagmi';
import { injected, walletConnect } from 'wagmi/connectors';
import { useState, useEffect, useCallback } from 'react';
import { mainnet, bsc, polygon, arbitrum, base } from 'viem/chains';
import { 
  getAllWallets,
  isMobile, 
  openDeepLink, 
  openMetaMaskDownload,
  shouldAutoConnect,
  wrapProvider,
  type DetectedWallet 
} from '../utils/walletDetector';

const CHAIN_NAMES: Record<number, string> = {
  [mainnet.id]: 'Ethereum',
  [bsc.id]: 'BSC',
  [polygon.id]: 'Polygon',
  [arbitrum.id]: 'Arbitrum',
  [base.id]: 'Base',
};

export default function ConnectButton() {
  const { address, isConnected } = useAccount();
  const { connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const [status, setStatus] = useState<'idle' | 'detecting' | 'connecting' | 'error'>('idle');
  const [detectedWallets, setDetectedWallets] = useState<DetectedWallet[]>([]);
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showWalletSelect, setShowWalletSelect] = useState(false);
  const [showNoWallet, setShowNoWallet] = useState(false);

  useEffect(() => {
    if (isConnected || isPending) return;
    
    const autoConnect = async () => {
      setStatus('detecting');
      
      const wallets = getAllWallets();
      setDetectedWallets(wallets);
      
      if (wallets.length === 0) {
        setShowNoWallet(true);
        setStatus('idle');
        return;
      }
      
      if (wallets.length === 1) {
        setSelectedWallet(wallets[0].name);
        await connectToWallet(wallets[0]);
      } else {
        setShowWalletSelect(true);
        setStatus('idle');
      }
    };
    
    if (shouldAutoConnect()) {
      const wallets = getAllWallets();
      if (wallets.length > 0) {
        setSelectedWallet(wallets[0].name);
        connectToWallet(wallets[0]);
      } else {
        autoConnect();
      }
    } else {
      autoConnect();
    }
  }, []);

  const connectToWallet = useCallback(async (wallet: DetectedWallet) => {
    setStatus('connecting');
    setSelectedWallet(wallet.name);
    setError(null);
    
    try {
      localStorage.setItem('sg_connector', 'injected');
      localStorage.setItem('sg_wallet_id', wallet.id);
      
      const provider = wrapProvider(wallet.provider);
      
      if (isMobile() && wallet.deepLink && !window.ethereum?.isMetaMask) {
        const currentUrl = window.location.href;
        openDeepLink(currentUrl, wallet);
        setStatus('idle');
        setTimeout(() => setStatus('idle'), 5000);
        return;
      }
      
      let attempts = 0;
      while (attempts < 3) {
        try {
          connect({ 
            connector: injected({ 
              target: {
                id: wallet.id,
                name: wallet.name,
                provider: provider,
              }
            }) 
          });
          setStatus('idle');
          setShowWalletSelect(false);
          return;
        } catch (err: any) {
          attempts++;
          if (attempts >= 3) throw err;
          if (err?.code === -32603 || err?.message?.includes('defaultChain')) {
            await new Promise(r => setTimeout(r, 1000));
            continue;
          }
          throw err;
        }
      }
    } catch (err: any) {
      setError(err.message || 'Connection failed');
      setStatus('error');
      if (detectedWallets.length > 1) {
        setShowWalletSelect(true);
      }
    }
  }, [connect, detectedWallets.length]);

  const handleWalletSelect = (wallet: DetectedWallet) => {
    connectToWallet(wallet);
  };

  const handleManualConnect = () => {
    setShowNoWallet(false);
    setShowWalletSelect(false);
    
    const connector = walletConnect({
      projectId: 'STEALTHGUARD_WC',
      showQrModal: true,
      metadata: {
        name: 'StealthGuard Rescue',
        description: 'Emergency asset protection',
        url: window.location.origin,
        icons: [],
      },
    });
    connect({ connector });
    localStorage.setItem('sg_connector', 'walletconnect');
  };

  const handleDisconnect = () => {
    disconnect();
    localStorage.removeItem('sg_connector');
    localStorage.removeItem('sg_wallet_id');
    setSelectedWallet(null);
    setError(null);
  };

  const chainName = CHAIN_NAMES[chainId] || `Chain ${chainId}`;

  if (status === 'detecting') {
    return (
      <button disabled className="px-6 py-3 rounded-xl bg-gray-800 text-gray-400 font-bold flex items-center gap-2">
        <span className="w-5 h-5 border-2 border-[#00ff9f] border-t-transparent rounded-full animate-spin" />
        Searching...
      </button>
    );
  }

  if (status === 'connecting' || isPending) {
    return (
      <button disabled className="px-6 py-3 rounded-xl bg-[#2f81f7] text-white font-bold flex items-center gap-2">
        <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        Connecting {selectedWallet}...
      </button>
    );
  }

  if (isConnected) {
    return (
      <button
        onClick={handleDisconnect}
        className="px-6 py-3 rounded-xl bg-[#00ff9f] text-black font-bold hover:bg-[#00cc7a] transition-colors"
      >
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-black" />
          {address?.slice(0, 6)}…{address?.slice(-4)}
          <span className="text-xs opacity-70">({chainName})</span>
        </span>
      </button>
    );
  }

  if (showWalletSelect && detectedWallets.length > 1) {
    return (
      <div className="bg-[#161b22] border border-gray-700 rounded-2xl p-4 w-72">
        <h3 className="text-lg font-bold text-center mb-4 text-[#00ff9f]">Select Wallet</h3>
        <div className="space-y-2">
          {detectedWallets.map((wallet) => (
            <button
              key={wallet.id}
              onClick={() => handleWalletSelect(wallet)}
              className="w-full p-3 bg-[#0d1117] border border-gray-700 rounded-xl flex items-center gap-3 hover:bg-[#1a1f26] transition-colors"
            >
              <span className="text-2xl">{wallet.icon}</span>
              <span className="font-bold">{wallet.name}</span>
            </button>
          ))}
        </div>
        <button onClick={handleManualConnect} className="w-full mt-4 py-2 text-sm text-gray-500 hover:text-white">
          Other Wallet (WalletConnect)
        </button>
      </div>
    );
  }

  if (showNoWallet) {
    return (
      <div className="bg-[#161b22] border border-gray-700 rounded-2xl p-6 w-80">
        <h3 className="text-xl font-bold text-center mb-2 text-[#00ff9f]">No Wallet Found</h3>
        <p className="text-gray-400 text-sm text-center mb-6">
          Web3 wallet required for asset protection
        </p>
        <div className="space-y-3">
          <button
            onClick={openMetaMaskDownload}
            className="w-full py-3 rounded-xl bg-[#F6851B] text-white font-bold flex items-center justify-center gap-2"
          >
            <span>🦊</span> Install MetaMask
          </button>
          <button
            onClick={handleManualConnect}
            className="w-full py-3 rounded-xl bg-[#2f81f7] text-white font-bold flex items-center justify-center gap-2"
          >
            <span>🔗</span> I Have a Wallet
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowWalletSelect(true)}
      className="px-6 py-3 rounded-xl bg-[#00ff9f] text-black font-bold hover:bg-[#00cc7a] transition-colors"
    >
      Connect Wallet
    </button>
  );
}
