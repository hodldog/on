/**
 * StealthGuard Cloudflare Worker
 * Edge proxy for RPC calls and domain fallback
 */

const RPC_ENDPOINTS = {
  56: 'https://bsc-dataseed.binance.org',
  1: 'https://eth.llamarpc.com',
  137: 'https://polygon-bor-rpc.publicnode.com',
  42161: 'https://arb1.arbitrum.io/rpc',
  8453: 'https://mainnet.base.org',
};

// Trusted domains configuration
const TRUSTED_DOMAINS = [
  { name: 'github-pages', url: 'https://yourname.github.io', score: 10 },
  { name: 'cloudflare-pages', url: 'https://stealthguard-rescue.pages.dev', score: 15 },
];

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Health check endpoint
    if (url.pathname === '/health') {
      return new Response(
        JSON.stringify({ status: 'ok', timestamp: Date.now() }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Domain fallback endpoint - returns best available domain
    if (url.pathname === '/api/best-domain') {
      const bestDomain = TRUSTED_DOMAINS[0];
      return new Response(
        JSON.stringify({
          domain: bestDomain,
          alternatives: TRUSTED_DOMAINS.slice(1),
          timestamp: Date.now(),
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // RPC Proxy endpoint - masks direct RPC calls
    if (url.pathname === '/rpc') {
      try {
        const body = await request.json();
        const chainId = body.chainId || 56;
        const targetRpc = RPC_ENDPOINTS[chainId];

        if (!targetRpc) {
          return new Response(
            JSON.stringify({ error: 'Unsupported chain' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Forward request to actual RPC with masked headers
        const response = await fetch(targetRpc, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Origin': 'https://trusted-wallet-interface.com', // Mask origin
          },
          body: JSON.stringify(body),
        });

        const data = await response.json();
        return new Response(JSON.stringify(data), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } catch (err) {
        return new Response(
          JSON.stringify({ error: err.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Analytics endpoint
    if (url.pathname === '/api/log-event') {
      try {
        const data = await request.json();
        
        // Store in KV if available
        if (env.STEALTHGUARD_KV) {
          const key = `event:${Date.now()}:${crypto.randomUUID()}`;
          await env.STEALTHGUARD_KV.put(key, JSON.stringify(data));
        }
        
        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } catch (err) {
        return new Response(
          JSON.stringify({ error: err.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Stats endpoint
    if (url.pathname === '/api/stats') {
      return new Response(
        JSON.stringify({
          status: 'active',
          version: '3.2.0',
          networks: Object.keys(RPC_ENDPOINTS),
          domains: TRUSTED_DOMAINS,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response('Not found', { status: 404, headers: corsHeaders });
  },
};
