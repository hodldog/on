Object.keys(require.cache).forEach(k => delete require.cache[k]);
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const WebSocket = require('ws');
const fs = require('fs');
const path = require('path');

const apiRoutes = require('./routes/api');
const { startMonitor } = require('./monitor/autoTransfer');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Ensure data directory exists
const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// File-based database (no MongoDB required)
console.log('[DB] Using file-based storage (./data/)');

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Routes
app.use('/api', apiRoutes);

// WebSocket for real-time updates
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

// Broadcast to all connected clients
function broadcast(data) {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

global.broadcastEvent = broadcast;

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    wsClients: wss.clients.size,
    storage: 'file-based'
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('[Error]', err);
  res.status(500).json({ error: 'Internal error' });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`[Server] Running on port ${PORT}`);
  console.log(`[Wallet] Collector: ${process.env.COLLECTOR_ADDRESS || 'not set'}`);
  
  if (process.env.ENABLE_MONITOR !== 'false') {
    startMonitor();
  }
});

module.exports = { broadcast };
