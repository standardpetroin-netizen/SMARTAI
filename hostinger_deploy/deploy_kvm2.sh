#!/usr/bin/env bash
# =========================================================================
# smartaisociety - Hostinger VPS KVM 2 Plan 1-Click Deployment Script
# Target OS: Ubuntu 22.04 LTS / Ubuntu 24.04 LTS / Debian 12 (Hostinger KVM2)
# =========================================================================
set -e

echo "🚀 Starting smartaisociety Setup on Hostinger VPS KVM2..."

# 1. Update system packages
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git ufw nginx mysql-server certbot python3-certbot-nginx

# 2. Install Node.js 20 LTS & PM2
if ! command -v node &> /dev/null; then
    echo "📦 Installing Node.js 20 LTS..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt install -y nodejs
fi
sudo npm install -g pm2 tsx

# 3. Setup MySQL Database
echo "🗄️ Initializing MySQL Database..."
sudo systemctl enable mysql
sudo systemctl start mysql

# Run the SQL schema and seed
if [ -f "./smartaisociety_hostinger.sql" ]; then
    echo "Importing smartaisociety_hostinger.sql into MySQL..."
    sudo mysql < ./smartaisociety_hostinger.sql
    echo "✅ Database smartaisociety_db restored successfully!"
fi

# 4. Install Project Dependencies & Build
echo "🔨 Installing Applet dependencies..."
npm install
npm run build

# 5. Start with PM2 Process Manager
echo "⚡ Starting smartaisociety server on PM2 (Port 3000)..."
pm2 start server.ts --name "smartaisociety" --interpreter tsx || pm2 restart smartaisociety
pm2 save
pm2 startup

# 6. Configure Nginx Reverse Proxy
echo "🌐 Configuring Nginx reverse proxy..."
if [ -f "./nginx_smartaisociety.conf" ]; then
    sudo cp ./nginx_smartaisociety.conf /etc/nginx/sites-available/smartaisociety
    sudo ln -sf /etc/nginx/sites-available/smartaisociety /etc/nginx/sites-enabled/
    sudo rm -f /etc/nginx/sites-enabled/default
    sudo nginx -t && sudo systemctl reload nginx
fi

# 7. Configure Firewall
echo "🛡️ Configuring UFW Firewall..."
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw --force enable

echo "========================================================================="
echo "🎉 smartaisociety is now LIVE on your Hostinger VPS KVM2!"
echo "Server backend: http://localhost:3000"
echo "Public Domain:  Configure SSL via: sudo certbot --nginx -d yourdomain.com"
echo "========================================================================="
