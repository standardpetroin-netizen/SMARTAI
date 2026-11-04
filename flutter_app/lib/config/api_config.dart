/// API Configuration for smartaisociety Mobile App (Flutter Android & iOS)
/// Connects directly to the SQL backend running on Hostinger VPS or local dev server.
class ApiConfig {
  // Update this to your Hostinger VPS domain or IP (e.g. 'https://smartaisociety.yourdomain.com')
  // For local Android emulator testing use 'http://10.0.2.2:3000'
  // For iOS simulator use 'http://localhost:3000'
  static const String baseUrl = 'https://ais-dev-4h7fierizsdngjfdiyvdyc-648195121806.asia-southeast1.run.app';

  // API Endpoints
  static const String health = '$baseUrl/api/health';
  static const String societies = '$baseUrl/api/societies';
  static const String residents = '$baseUrl/api/residents';
  static const String invoices = '$baseUrl/api/invoices';
  static const String payInvoice = '$baseUrl/api/invoices/pay';
  static const String deliveries = '$baseUrl/api/deliveries';
  static const String visitors = '$baseUrl/api/visitors';
  static const String admitVisitor = '$baseUrl/api/visitors/admit';
  static const String complaints = '$baseUrl/api/complaints';
  static const String notices = '$baseUrl/api/notices';
  static const String facilityBookings = '$baseUrl/api/facility-bookings';
  static const String societyStats = '$baseUrl/api/society-panel/stats';
  static const String waterTanks = '$baseUrl/api/water/tanks';
  static const String waterPumps = '$baseUrl/api/water/pumps';
  static const String togglePump = '$baseUrl/api/water/pumps/toggle';
  static const String sqlExport = '$baseUrl/api/sql/export';

  // Guard Terminal, Visitor OTP & Biometrics Endpoints
  static const String visitorInvites = '$baseUrl/api/visitor-invites';
  static const String verifyVisitorOtp = '$baseUrl/api/visitors/verify-otp';
  static const String securityAlerts = '$baseUrl/api/security/alerts';
  static const String resolveSecurityAlert = '$baseUrl/api/security/alerts/resolve';
  static const String guardProfile = '$baseUrl/api/guard/profile';
  static const String guardDutyStatus = '$baseUrl/api/guard/duty-status';
  static const String guardLocation = '$baseUrl/api/guard/location';
  static const String guardFaceVerify = '$baseUrl/api/guard/face-verify';
  static const String guardMasterPhoto = '$baseUrl/api/guard/master-photo';
  static const String guardRoster = '$baseUrl/api/guard/roster';

  static Map<String, String> get headers => {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      };
}
