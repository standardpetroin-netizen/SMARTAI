# 🚀 smartaisociety - Hostinger VPS KVM2 Deployment Guide

Yeh guide Hostinger VPS **KVM 2 Plan** (2 vCPU Cores, 8 GB RAM, 100 GB NVMe Disk) par **smartaisociety** ka full backend aur SQL database setup karne ke liye hai.

---

## 📋 Pre-requisites (Hostinger VPS)
- Hostinger VPS OS: **Ubuntu 22.04 LTS / 24.04 LTS** ya **Debian 12**
- SSH Access (PuTTY / Terminal: `ssh root@YOUR_HOSTINGER_VPS_IP`)

---

## ⚡ Method 1: 1-Click Auto Install Script

Apne Hostinger VPS terminal mein login karein aur yeh command run karein:

```bash
# Clone the repository
git clone https://github.com/your-username/smartaisociety.git /var/www/smartaisociety
cd /var/www/smartaisociety/hostinger_deploy

# Make script executable & run
chmod +x deploy_kvm2.sh
./deploy_kvm2.sh
```

---

## 🛠️ Method 2: Manual Step-by-Step Setup

### Step 1: Install Node.js 20 & MySQL Server
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git nginx mysql-server ufw

# Install Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 and tsx runner globally
sudo npm install -g pm2 tsx
```

### Step 2: Import SQL Database Schema & Data
smartaisociety purely SQL-based relational architecture use karta hai:

```bash
# MySQL login karke schema import karein
sudo mysql < hostinger_deploy/smartaisociety_hostinger.sql

# Test database tables
sudo mysql -e "USE smartaisociety_db; SHOW TABLES;"
```

Output mein yeh 13 SQL tables dikhenge:
- `societies` (Multi-tenant master)
- `residents` (Units and flat owners)
- `utility_invoices` (Maintenance & DG dues ledger)
- `complaints` (Helpdesk tickets)
- `society_notices` (Circulars & announcements)
- `facility_bookings` (Clubhouse & pool slots)
- `society_staff` (Committee members & technicians)
- `deliveries` (Courier gate passes)
- `premises_visitors` (Visitor log)
- `guard_checkpoints` (NFC/QR patrol rounds)
- `water_tanks` (IoT water reservoir telemetry)
- `water_pumps` (IoT motor switches)
- `water_audit_logs` (Audit history)

### Step 3: Start Node.js / Express Backend
```bash
cd /var/www/smartaisociety
npm install
npm run build

# Start using PM2
pm2 start server.ts --name "smartaisociety" --interpreter tsx
pm2 save
pm2 startup
```

### Step 4: Configure Nginx & Free SSL (Let's Encrypt)
```bash
# Copy Nginx config
sudo cp hostinger_deploy/nginx_smartaisociety.conf /etc/nginx/sites-available/smartaisociety
sudo ln -s /etc/nginx/sites-available/smartaisociety /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx

# Install Free SSL Certificate
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d *.yourdomain.com
```

---

## 📱 Connecting Mobile Flutter App to VPS Backend
Apne Flutter mobile app mein `flutter_app/lib/config/api_config.dart` file kholein aur `baseUrl` ko apne VPS domain ya IP se point karein:

```dart
class ApiConfig {
  static const String baseUrl = 'https://yourdomain.com'; // ya 'http://YOUR_VPS_IP:3000'
}
```

Phir mobile app build karein:
- **Android APK**: `flutter build apk --release`
- **iOS App**: `flutter build ipa --release`
