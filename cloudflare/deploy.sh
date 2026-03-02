#!/bin/bash
# Deploy to Cloudflare Workers

echo "Deploying StealthGuard to Cloudflare Workers..."

# Check wrangler
if ! command -v wrangler &> /dev/null; then
    echo "Installing wrangler..."
    npm install -g wrangler
fi

# Login if needed
wrangler whoami || wrangler login

# Deploy worker
cd "$(dirname "$0")"
wrangler deploy worker.js --name stealthguard-api

echo "Done!"
echo "Worker URL: https://stealthguard-api.YOUR-SUBDOMAIN.workers.dev"
