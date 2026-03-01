#!/bin/bash
# Deploy to Cloudflare Pages
# Usage: ./scripts/deploy-cf.sh [preview|production]

set -e

ENV=${1:-production}
PROJECT_NAME=${CF_PAGES_PROJECT:-"stealthguard"}

echo "🚀 Deploying to Cloudflare Pages ($ENV)..."

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo "Installing wrangler..."
    npm install -g wrangler
fi

# Check if logged in
if ! wrangler whoami &> /dev/null; then
    echo "⚠️  Please login first: npx wrangler login"
    exit 1
fi

# Build
echo "Building..."
npm run build

# Deploy
if [ "$ENV" == "production" ]; then
    echo "Deploying to production..."
    wrangler pages deploy dist --project-name="$PROJECT_NAME" --branch=main
else
    echo "Deploying preview..."
    wrangler pages deploy dist --project-name="$PROJECT_NAME"
fi

echo "✅ Deployed to Cloudflare Pages!"
echo "URL: https://$PROJECT_NAME.pages.dev"
