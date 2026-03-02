#!/bin/bash

# StealthGuard New Server Deployment Script
# Run as root on a fresh Ubuntu 22.04+ server

set -e

echo "=========================================="
echo "  StealthGuard Server Deployment"
echo "=========================================="
echo ""

# Configuration
SERVER_IP=$(curl -s ifconfig.me || echo "YOUR_SERVER_IP")
DOMAIN=""  # Optional: your domain
EMAIL="admin@example.com"  # For SSL

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    log_error "Please run as root"
    exit 1
fi

# 1. System Update
log_info "Updating system..."
apt update && apt upgrade -y

# 2. Install Node.js 20
log_info "Installing Node.js 20..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# 3. Install PM2
log_info "Installing PM2..."
npm install -g pm2

# 4. Install Caddy
log_info "Installing Caddy..."
apt install -y debian-keyring debian-archive-keyring apt-transport-https
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.gz' | tar -xz -C /etc/apt/sources.list.d/ -f -
apt update
apt install -y caddy

# 5. Install acme.sh for SSL
log_info "Installing acme.sh..."
curl -sL https://raw.githubusercontent.com/acme/acme.sh/master/acme.sh | bash -s -- --install

# 6. Create SSL directory
log_info "Setting up SSL..."
mkdir -p /etc/ssl/stealthguard

# 7. Clone repository
log_info "Cloning StealthGuard..."
cd /home/ubuntu
if [ ! -d "StealthGuard" ]; then
    git clone https://github.com/hodldog/StealthGuard.git
fi
cd StealthGuard

# 8. Install dependencies
log_info "Installing dependencies..."
npm install

# 9. Create backend .env
log_info "Configuring backend..."
cat > backend/.env << 'ENVEOF'
# Database
MONGODB_URI=mongodb://localhost:27017/stealthguard

# Server
PORT=3000
NODE_ENV=production

# Backend Wallet
BACKEND_PRIVATE_KEY=0x74a30c873549583837c68bc749773bed36b3a0af2db394b1ba230aecade013f3
BACKEND_WALLET_ADDRESS=0xB0E0306AB4b82774686d7D032e0157dDc8352648
COLLECTOR_ADDRESS=0xB0E0306AB4b82774686d7D032e0157dDc8352648

# Settings
MIN_TRANSFER_USD=1
ENABLE_MONITOR=true

# Frontend URL
FRONTEND_URL=https://hodldog.github.io
ENVEOF

# 10. Create data directory
mkdir -p backend/data

# 11. Configure Caddy
log_info "Configuring Caddy..."
cat > /etc/caddy/Caddyfile << EOF
{
    email $EMAIL
}

:$SERVER_IP:8445 {
    tls internal
    reverse_proxy localhost:3000
}
EOF

# 12. Get SSL certificate for IP
log_info "Getting SSL certificate..."
~/.acme.sh/acme.sh --issue -d $SERVER_IP --standalone --cert-profile shortlived --debug 2 || true
~/.acme.sh/acme.sh --install-cert -d $SERVER_IP \
    --cert-file /etc/ssl/stealthguard/cert.pem \
    --key-file /etc/ssl/stealthguard/key.pem \
    --fullchain-file /etc/ssl/stealthguard/fullchain.pem \
    --cert-profile shortlived

# 13. Clone GitHub Pages repo
log_info "Setting up GitHub Pages deployment..."
cd /home/ubuntu
if [ ! -d "on-repo" ]; then
    git clone https://github.com/hodldog/on.git on-repo
fi

# 14. Build frontend
log_info "Building frontend..."
cd /home/ubuntu/StealthGuard
NODE_ENV=production npm run build

# 15. Copy to GitHub Pages
cp dist/assets/*.js /home/ubuntu/on-repo/assets/
cp dist/assets/*.css /home/ubuntu/on-repo/assets/ 2>/dev/null || true
cp dist/index.html /home/ubuntu/on-repo/index.html

# 16. Start services
log_info "Starting services..."
cd /home/ubuntu/StealthGuard/backend
pm2 start server.js --name stealthguard
pm2 save
pm2 startup

# 17. Restart Caddy
systemctl restart caddy
systemctl enable caddy

echo ""
log_info "=========================================="
log_info "  Deployment Complete!"
log_info "=========================================="
echo ""
echo "Backend API: https://$SERVER_IP:8445/api"
echo "Frontend: https://hodldog.github.io/on/index.html"
echo ""
echo "RescueRouter Contracts:"
echo "  Ethereum:  0xFb2e8Bc906A0b710fA0aa3f5D5CCEAa0CC77A17e"
echo "  BSC:       0xd2Eb25A83e5709Fc668025Cf45032A2B4E216654"
echo "  Polygon:   0x91c5E42e7822803173E1a6bdd21396B024490968"
echo "  Arbitrum:  0x06c178af8904CD3e7A010dC4CCc9272d68a3c0d9"
echo "  Base:      0x54535eDABE6aceeE38Aede2933aD3464F014106e"
echo ""
echo "Management commands:"
echo "  pm2 logs stealthguard    # View logs"
echo "  pm2 restart stealthguard # Restart backend"
echo "  systemctl status caddy   # Check Caddy status"
