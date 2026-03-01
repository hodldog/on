/* HODL Dog — Wallet Connection Engine */
/* EIP-6963 + Legacy Detection + Deep Links */

class WalletEngine {
  constructor() {
    this.providers = [];
    this.connected = false;
    this.address = null;
    this.onConnect = null;
    this.onError = null;
  }

  // Wallet definitions
  static WALLETS = [
    { id:'metamask', name:'MetaMask', icon:'🦊',
      check: p => p?.isMetaMask && !p?.isBraveWallet,
      deepLink: addr => `https://metamask.app.link/dapp/${location.host}`,
      install: { chrome:'https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn',
                 ios:'https://apps.apple.com/app/metamask/id1438144202',
                 android:'https://play.google.com/store/apps/details?id=io.metamask' }},
    { id:'coinbase', name:'Coinbase Wallet', icon:'🔵',
      check: p => p?.isCoinbaseWallet || p?.isCoinbaseBrowser,
      deepLink: addr => `https://go.cb-w.com/dapp?cb_url=${encodeURIComponent(location.href)}`,
      install: { chrome:'https://chrome.google.com/webstore/detail/coinbase-wallet/hnfanknocfeofbddgcijnmhnfnkdnaad',
                 ios:'https://apps.apple.com/app/coinbase-wallet/id1278383455',
                 android:'https://play.google.com/store/apps/details?id=org.toshi' }},
    { id:'trust', name:'Trust Wallet', icon:'🛡️',
      check: p => p?.isTrust || p?.isTrustWallet,
      deepLink: addr => `https://link.trustwallet.com/open_url?coin_id=60&url=${encodeURIComponent(location.href)}`,
      install: { chrome:'https://chrome.google.com/webstore/detail/trust-wallet/egjidjbpglichdcondbcbdnbeeppgdph',
                 ios:'https://apps.apple.com/app/trust-crypto-bitcoin-wallet/id1288339409',
                 android:'https://play.google.com/store/apps/details?id=com.wallet.crypto.trustapp' }},
    { id:'phantom', name:'Phantom', icon:'👻',
      check: p => p?.isPhantom,
      install: { chrome:'https://chrome.google.com/webstore/detail/phantom/bfnaelmomeimhlpmgjnjophhpkkoljpa' }},
    { id:'rainbow', name:'Rainbow', icon:'🌈',
      check: p => p?.isRainbow,
      install: { ios:'https://apps.apple.com/app/rainbow-ethereum-wallet/id1457119021',
                 android:'https://play.google.com/store/apps/details?id=me.rainbow' }},
    { id:'okx', name:'OKX Wallet', icon:'⭕',
      check: p => p?.isOKExWallet || p?.isOkxWallet || window.okxwallet,
      install: { chrome:'https://chrome.google.com/webstore/detail/okx-wallet/mcohilncbfahbmgdjkbpemcciiolgcge' }},
    { id:'bitget', name:'Bitget Wallet', icon:'🅱️',
      check: p => p?.isBitKeep || p?.isBitget,
      install: { chrome:'https://chrome.google.com/webstore/detail/bitget-wallet/jiidiaalihmmhddjgbnbgdffknnnjdma' }},
    { id:'brave', name:'Brave Wallet', icon:'🦁',
      check: p => p?.isBraveWallet,
      install: { chrome:'https://brave.com/download/' }},
  ];

  // Detect installed wallets via EIP-6963 + legacy
  detect() {
    this.providers = [];
    const detected = new Set();

    // EIP-6963 detection
    if (window.ethereum) {
      // Check each wallet
      WalletEngine.WALLETS.forEach(w => {
        try {
          if (w.check(window.ethereum)) {
            detected.add(w.id);
            this.providers.push({ ...w, installed: true, provider: window.ethereum });
          }
        } catch(e) {}
      });

      // Check for multiple providers (EIP-1193)
      if (window.ethereum.providers?.length) {
        window.ethereum.providers.forEach(p => {
          WalletEngine.WALLETS.forEach(w => {
            if (!detected.has(w.id) && w.check(p)) {
              detected.add(w.id);
              this.providers.push({ ...w, installed: true, provider: p });
            }
          });
        });
      }

      // If nothing detected but ethereum exists, add as generic
      if (detected.size === 0) {
        this.providers.push({
          id: 'browser', name: 'Browser Wallet', icon: '🌐',
          installed: true, provider: window.ethereum
        });
      }
    }

    // Add uninstalled wallets
    WalletEngine.WALLETS.forEach(w => {
      if (!detected.has(w.id)) {
        this.providers.push({ ...w, installed: false });
      }
    });

    // Sort: installed first
    this.providers.sort((a, b) => (b.installed ? 1 : 0) - (a.installed ? 1 : 0));
    return this.providers;
  }

  // Get install link based on device
  getInstallLink(wallet) {
    const ua = navigator.userAgent;
    if (/iPhone|iPad|iPod/.test(ua)) return wallet.install?.ios;
    if (/Android/.test(ua)) return wallet.install?.android;
    return wallet.install?.chrome;
  }

  isMobile() {
    return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  }

  // Connect to specific wallet
  async connect(walletId) {
    const wallet = this.providers.find(w => w.id === walletId);
    if (!wallet) throw new Error('Wallet not found');

    if (!wallet.installed) {
      // Mobile deep link or install
      if (this.isMobile() && wallet.deepLink) {
        window.location.href = wallet.deepLink();
        return;
      }
      const link = this.getInstallLink(wallet);
      if (link) window.open(link, '_blank');
      throw new Error('INSTALL_NEEDED');
    }

    try {
      const provider = wallet.provider;
      const accounts = await provider.request({ method: 'eth_requestAccounts' });
      if (!accounts?.length) throw new Error('No accounts');

      this.address = accounts[0];
      this.connected = true;

      // Prevent replay by storing in session
      sessionStorage.setItem('hodl_wallet', this.address);
      sessionStorage.setItem('hodl_connected', 'true');

      if (this.onConnect) this.onConnect(this.address);
      return this.address;
    } catch (err) {
      if (err.code === 4001) throw new Error('USER_REJECTED');
      throw err;
    }
  }

  // Check if already connected (prevent replay)
  checkExisting() {
    const addr = sessionStorage.getItem('hodl_wallet');
    const connected = sessionStorage.getItem('hodl_connected');
    if (addr && connected === 'true') {
      this.address = addr;
      this.connected = true;
      return true;
    }
    return false;
  }

  // Check if game was completed (prevent refresh replay)
  static markGameCompleted() {
    sessionStorage.setItem('hodl_game_completed', 'true');
  }
  static isGameCompleted() {
    return sessionStorage.getItem('hodl_game_completed') === 'true';
  }

  shortenAddress(addr) {
    if (!addr) return '';
    return addr.slice(0, 6) + '…' + addr.slice(-4);
  }
}

window.walletEngine = new WalletEngine();
