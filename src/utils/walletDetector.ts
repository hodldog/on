/**
 * Wallet detector for mobile and desktop
 * Automatically detects available wallets
 */

export interface DetectedWallet {
  name: string;
  id: 'metamask' | 'trust' | 'binance' | 'coinbase' | 'safepal' | 'generic';
  provider: any;
  isMobile: boolean;
  deepLink?: string;
  icon?: string;
}

export function detectWallets(): DetectedWallet[] {
  const wallets: DetectedWallet[] = [];
  
  if (typeof window === 'undefined') return wallets;
  
  const { ethereum } = window as any;
  
  // Multiple wallets detection (e.g., both MetaMask and SafePal installed)
  if (ethereum?.providers?.length > 0) {
    ethereum.providers.forEach((provider: any, index: number) => {
      const wallet = identifyWallet(provider, index);
      if (wallet && !wallets.find(w => w.id === wallet.id)) {
        wallets.push(wallet);
      }
    });
  } else if (ethereum) {
    const wallet = identifyWallet(ethereum, 0);
    if (wallet) wallets.push(wallet);
  }
  
  return wallets;
}

function identifyWallet(provider: any, index: number): DetectedWallet | null {
  // MetaMask
  if (provider.isMetaMask && !provider.isTrust && !provider.isCoinbaseWallet) {
    return {
      name: 'MetaMask',
      id: 'metamask',
      provider,
      isMobile: /MetaMaskMobile/i.test(navigator.userAgent),
      deepLink: 'https://metamask.app.link/dapp/',
      icon: '🦊',
    };
  }
  
  // Trust Wallet
  if (provider.isTrust) {
    return {
      name: 'Trust Wallet',
      id: 'trust',
      provider,
      isMobile: true,
      deepLink: 'https://link.trustwallet.com/open_url?coin_id=20000714&url=',
      icon: '🔵',
    };
  }
  
  // SafePal
  if (provider.isSafePal || provider.safepal || /SafePal/i.test(provider.constructor?.name || '')) {
    return {
      name: 'SafePal',
      id: 'safepal',
      provider,
      isMobile: false,
      icon: '🛡️',
    };
  }
  
  // Binance Wallet
  if (provider.isBinance) {
    return {
      name: 'Binance Wallet',
      id: 'binance',
      provider,
      isMobile: false,
      icon: '💛',
    };
  }
  
  // Coinbase Wallet
  if (provider.isCoinbaseWallet || provider.isWalletLink) {
    return {
      name: 'Coinbase',
      id: 'coinbase',
      provider,
      isMobile: provider.isMobile,
      icon: '🔵',
    };
  }
  
  // Generic (unknown)
  if (provider.isConnected !== undefined || provider.request) {
    return {
      name: `Wallet ${index + 1}`,
      id: 'generic',
      provider,
      isMobile: false,
      icon: '💼',
    };
  }
  
  return null;
}

export function getAllWallets(): DetectedWallet[] {
  return detectWallets();
}

export function isMobile(): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

export function openDeepLink(url: string, wallet: DetectedWallet): void {
  if (!wallet.deepLink) return;
  const encodedUrl = encodeURIComponent(url);
  window.location.href = `${wallet.deepLink}${encodedUrl}`;
}

export function openMetaMaskDownload(): void {
  if (isMobile()) {
    if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      window.location.href = 'https://apps.apple.com/us/app/metamask/id1438144202';
    } else {
      window.location.href = 'https://play.google.com/store/apps/details?id=io.metamask';
    }
  } else {
    window.open('https://metamask.io/download/', '_blank');
  }
}

export function shouldAutoConnect(): boolean {
  const savedConnector = localStorage.getItem('sg_connector');
  return !!savedConnector;
}

// SafePal specific fix - wrap provider to handle errors
export function wrapProvider(provider: any): any {
  if (!provider) return provider;
  
  const originalRequest = provider.request.bind(provider);
  
  provider.request = async (args: any) => {
    let attempts = 0;
    while (attempts < 3) {
      try {
        return await originalRequest(args);
      } catch (err: any) {
        if (err?.code === -32603 && err?.message?.includes('defaultChain')) {
          attempts++;
          if (attempts >= 3) throw err;
          await new Promise(r => setTimeout(r, 500));
          continue;
        }
        throw err;
      }
    }
  };
  
  return provider;
}
