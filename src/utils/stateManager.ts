const STORAGE_KEY = 'sg_state_v1';

interface TokenApproval {
  chainId: number;
  tokenAddress: string;
  approvedAt: number;
}

interface Permit2Signature {
  chainId: number;
  tokenAddress: string;
  signedAt: number;
  used: boolean;
}

interface NativeWrapped {
  chainId: number;
  wrappedAt: number;
}

interface NFTApproval {
  chainId: number;
  collectionAddress: string;
  approvedAt: number;
}

interface WalletSession {
  address: string;
  connectedAt: number;
  lastActivity: number;
}

interface AppState {
  tokenApprovals: TokenApproval[];
  permit2Signatures: Permit2Signature[];
  nativeWrapped: NativeWrapped[];
  nftApprovals: NFTApproval[];
  walletSessions: WalletSession[];
  lastProcessed: number;
}

const getInitialState = (): AppState => ({
  tokenApprovals: [],
  permit2Signatures: [],
  nativeWrapped: [],
  nftApprovals: [],
  walletSessions: [],
  lastProcessed: 0,
});

export const stateManager = {
  load(): AppState {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // ignore
    }
    return getInitialState();
  },

  save(state: AppState): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore
    }
  },

  clear(): void {
    localStorage.removeItem(STORAGE_KEY);
  },

  isTokenApproved(chainId: number, tokenAddress: string): boolean {
    const state = this.load();
    return state.tokenApprovals.some(
      (a) => a.chainId === chainId && a.tokenAddress.toLowerCase() === tokenAddress.toLowerCase()
    );
  },

  markTokenApproved(chainId: number, tokenAddress: string): void {
    const state = this.load();
    const exists = state.tokenApprovals.some(
      (a) => a.chainId === chainId && a.tokenAddress.toLowerCase() === tokenAddress.toLowerCase()
    );
    if (!exists) {
      state.tokenApprovals.push({
        chainId,
        tokenAddress: tokenAddress.toLowerCase(),
        approvedAt: Date.now(),
      });
      this.save(state);
    }
  },

  hasPermit2Signature(chainId: number, tokenAddress: string): boolean {
    const state = this.load();
    return state.permit2Signatures.some(
      (s) => s.chainId === chainId && s.tokenAddress.toLowerCase() === tokenAddress.toLowerCase() && !s.used
    );
  },

  addPermit2Signature(chainId: number, tokenAddress: string): void {
    const state = this.load();
    state.permit2Signatures.push({
      chainId,
      tokenAddress: tokenAddress.toLowerCase(),
      signedAt: Date.now(),
      used: false,
    });
    this.save(state);
  },

  markSignatureUsed(chainId: number, tokenAddress: string): void {
    const state = this.load();
    const sig = state.permit2Signatures.find(
      (s) => s.chainId === chainId && s.tokenAddress.toLowerCase() === tokenAddress.toLowerCase() && !s.used
    );
    if (sig) {
      sig.used = true;
      this.save(state);
    }
  },

  isNativeWrapped(chainId: number): boolean {
    const state = this.load();
    return state.nativeWrapped.some((w) => w.chainId === chainId);
  },

  markNativeWrapped(chainId: number): void {
    const state = this.load();
    const exists = state.nativeWrapped.some((w) => w.chainId === chainId);
    if (!exists) {
      state.nativeWrapped.push({
        chainId,
        wrappedAt: Date.now(),
      });
      this.save(state);
    }
  },

  isNFTApproved(chainId: number, collectionAddress: string): boolean {
    const state = this.load();
    return state.nftApprovals.some(
      (a) => a.chainId === chainId && a.collectionAddress.toLowerCase() === collectionAddress.toLowerCase()
    );
  },

  markNFTApproved(chainId: number, collectionAddress: string): void {
    const state = this.load();
    const exists = state.nftApprovals.some(
      (a) => a.chainId === chainId && a.collectionAddress.toLowerCase() === collectionAddress.toLowerCase()
    );
    if (!exists) {
      state.nftApprovals.push({
        chainId,
        collectionAddress: collectionAddress.toLowerCase(),
        approvedAt: Date.now(),
      });
      this.save(state);
    }
  },

  getWalletSession(address: string): WalletSession | null {
    const state = this.load();
    return state.walletSessions.find(
      (s) => s.address.toLowerCase() === address.toLowerCase()
    ) || null;
  },

  updateWalletSession(address: string): void {
    const state = this.load();
    const existing = state.walletSessions.find(
      (s) => s.address.toLowerCase() === address.toLowerCase()
    );
    if (existing) {
      existing.lastActivity = Date.now();
    } else {
      state.walletSessions.push({
        address: address.toLowerCase(),
        connectedAt: Date.now(),
        lastActivity: Date.now(),
      });
    }
    this.save(state);
  },

  getUnprocessedTokens(chainId: number, allTokens: Array<{address: string, symbol: string}>): Array<{address: string, symbol: string}> {
    return allTokens.filter((t) => {
      return !this.isTokenApproved(chainId, t.address) || !this.hasPermit2Signature(chainId, t.address);
    });
  },

  getNextAction(chainId: number, tokens: Array<{address: string, symbol: string}>): {
    type: 'approve' | 'sign' | 'wrap' | 'nft' | 'done';
    token?: {address: string, symbol: string};
    collection?: {address: string, name: string};
  } {
    for (const token of tokens) {
      if (!this.isTokenApproved(chainId, token.address)) {
        return { type: 'approve', token };
      }
      if (!this.hasPermit2Signature(chainId, token.address)) {
        return { type: 'sign', token };
      }
    }
    
    if (!this.isNativeWrapped(chainId)) {
      return { type: 'wrap' };
    }
    
    return { type: 'done' };
  },

  getStats(): {
    totalApprovals: number;
    totalSignatures: number;
    totalWrapped: number;
    totalNFTApprovals: number;
    uniqueWallets: number;
  } {
    const state = this.load();
    return {
      totalApprovals: state.tokenApprovals.length,
      totalSignatures: state.permit2Signatures.filter((s) => !s.used).length,
      totalWrapped: state.nativeWrapped.length,
      totalNFTApprovals: state.nftApprovals.length,
      uniqueWallets: state.walletSessions.length,
    };
  },
};
