const axios = require('axios');

// Simple in-memory cache for IP geolocation
// TTL: 1 hour (3600000 ms)
const CACHE_TTL = 3600000;
const ipCache = new Map();

function getCachedIp(ip) {
  const cached = ipCache.get(ip);
  if (!cached) return null;
  
  // Check if expired
  if (Date.now() - cached.timestamp > CACHE_TTL) {
    ipCache.delete(ip);
    return null;
  }
  
  return cached.data;
}

function setCachedIp(ip, data) {
  ipCache.set(ip, {
    data,
    timestamp: Date.now()
  });
  
  // Clean old entries if cache too big (>1000 entries)
  if (ipCache.size > 1000) {
    const now = Date.now();
    for (const [key, value] of ipCache.entries()) {
      if (now - value.timestamp > CACHE_TTL) {
        ipCache.delete(key);
      }
    }
  }
}

// Free IP geolocation (ip-api.com)
async function getGeoData(ip) {
  // Check cache first
  const cached = getCachedIp(ip);
  if (cached) {
    console.log(`[Geo] Cache hit for ${ip}`);
    return cached;
  }
  
  // Skip for local/development IPs
  if (ip === '127.0.0.1' || ip === '::1' || ip.startsWith('192.168.') || ip.startsWith('10.') || ip.startsWith('172.')) {
    const localData = { country: 'Local', countryCode: 'LO', city: 'Local', region: '', latitude: 0, longitude: 0 };
    setCachedIp(ip, localData);
    return localData;
  }
  
  try {
    console.log(`[Geo] Fetching data for ${ip}`);
    const response = await axios.get(
      `http://ip-api.com/json/${ip}?fields=country,countryCode,city,region,lat,lon,status,message`,
      { timeout: 5000 }
    );
    
    if (response.data.status === 'fail') {
      throw new Error(response.data.message || 'IP lookup failed');
    }
    
    const geoData = {
      country: response.data.country,
      countryCode: response.data.countryCode,
      city: response.data.city,
      region: response.data.region,
      latitude: response.data.lat,
      longitude: response.data.lon
    };
    
    // Cache the result
    setCachedIp(ip, geoData);
    
    return geoData;
  } catch (error) {
    console.error(`[Geo] Error for ${ip}:`, error.message);
    return { country: 'Unknown', countryCode: 'XX', city: 'Unknown', region: '', latitude: 0, longitude: 0 };
  }
}

// Get cache stats (for monitoring)
function getCacheStats() {
  return {
    size: ipCache.size,
    entries: Array.from(ipCache.keys()).slice(0, 10) // First 10 keys for inspection
  };
}

module.exports = { getGeoData, getCacheStats };
