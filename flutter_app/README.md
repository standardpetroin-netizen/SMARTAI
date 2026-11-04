# smartaisociety - Cross-Platform Flutter Mobile App (Android & iOS)

This is the complete production Flutter mobile app codebase for **smartaisociety**, connecting directly to your SQL backend on your Hostinger VPS KVM2 plan.

---

## 📱 Features Included
- **Resident Dashboard**: Real-time maintenance ledger dues, one-tap UPI / NetBanking settlement.
- **Gate Courier Passes**: Pre-approve Zomato, Swiggy, Blinkit, and Amazon deliveries with instant 4-digit passcode generation and broadcast to Gate 01.
- **Smart Visitor Terminal**: Security guards can record visitor entries, vehicle plates, and ring the resident app intercom.
- **IoT Water & Pump Telemetry**: Ultrasonic gauges for Underground Sump & Overhead Tanks with live motor toggle.
- **SOS Emergency Panic Button**: Instant priority push to guardhouse terminals.

---

## 🚀 How to Run the Flutter App Locally

### 1. Prerequisites
- Install Flutter SDK (Version >= 3.0.0): https://flutter.dev/docs/get-started/install
- Android Studio (for Android) or Xcode (for iOS on macOS)

### 2. Install Dependencies
```bash
cd flutter_app
flutter pub get
```

### 3. Connect to Your Hostinger VPS Backend
Open `lib/config/api_config.dart` and update the `baseUrl` with your Hostinger VPS domain or IP:
```dart
static const String baseUrl = 'http://YOUR_HOSTINGER_VPS_IP:3000';
// Or if you configured SSL / domain:
// static const String baseUrl = 'https://app.yourdomain.com';
```

### 4. Run on Connected Device / Simulator
```bash
# Run on Android Emulator or connected phone:
flutter run

# Run on iOS Simulator (macOS only):
flutter run -d iPhone
```

---

## 📦 How to Build Production Android APK & iOS Bundle

### Build Android APK (Ready for Google Play Store or direct APK installation):
```bash
flutter build apk --release
```
The output file will be generated at:
`build/app/outputs/flutter-apk/app-release.apk`

### Build Android App Bundle (AAB for Google Play):
```bash
flutter build appbundle --release
```

### Build iOS (Requires Mac & Xcode):
```bash
flutter build ipa --release
```

---

## 🖥️ How to Deploy Backend & SQL on Hostinger VPS (KVM2 Plan)

### Step 1: Connect to your Hostinger VPS via SSH
```bash
ssh root@YOUR_HOSTINGER_VPS_IP
```

### Step 2: Install Node.js 20 & MySQL/MariaDB
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs mariadb-server git
npm install -g pm2
```

### Step 3: Import the SQL Schema
Download `smartaisociety_hostinger.sql` from your app's SQL Studio or `/api/sql/export` endpoint, then run:
```bash
mysql -u root -p < smartaisociety_hostinger.sql
```

### Step 4: Clone and Start Backend with PM2
```bash
git clone <your-repo> smartaisociety-backend
cd smartaisociety-backend
npm install
pm2 start server.ts --name "smartaisociety" --interpreter tsx
pm2 startup
pm2 save
```

Your backend and SQL database are now running 24/7 on your Hostinger VPS KVM2 server!
