import 'dart:convert';
import 'package:http/http.dart' as http;
import '../config/api_config.dart';
import '../models/models.dart';

class ApiService {
  static final ApiService _instance = ApiService._internal();
  factory ApiService() => _instance;
  ApiService._internal();

  /// Check backend connection health
  Future<bool> checkHealth() async {
    try {
      final response = await http.get(Uri.parse(ApiConfig.health)).timeout(const Duration(seconds: 4));
      return response.statusCode == 200;
    } catch (_) {
      return false;
    }
  }

  /// Get active society branding & config
  Future<SocietyModel?> getSociety(String societyId) async {
    try {
      final response = await http.get(Uri.parse('${ApiConfig.societies}/$societyId'));
      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        return SocietyModel.fromJson(data);
      }
    } catch (e) {
      print('Error fetching society: $e');
    }
    return null;
  }

  /// Fetch utility ledger bills for unit
  Future<List<InvoiceModel>> getInvoices(String unit) async {
    try {
      final response = await http.get(Uri.parse('${ApiConfig.invoices}?unit=$unit'));
      if (response.statusCode == 200) {
        final List list = json.decode(response.body);
        return list.map((item) => InvoiceModel.fromJson(item)).toList();
      }
    } catch (e) {
      print('Error fetching invoices: $e');
    }
    return [];
  }

  /// Pay invoice via UPI/Card to backend SQL ledger
  Future<bool> payInvoice(String invoiceId, String paymentMethod) async {
    try {
      final response = await http.post(
        Uri.parse(ApiConfig.payInvoice),
        headers: ApiConfig.headers,
        body: json.encode({
          'invoice_id': invoiceId,
          'payment_method': paymentMethod,
        }),
      );
      return response.statusCode == 200;
    } catch (e) {
      print('Error paying invoice: $e');
      return false;
    }
  }

  /// Fetch delivery history
  Future<List<DeliveryModel>> getDeliveries(String unit) async {
    try {
      final response = await http.get(Uri.parse('${ApiConfig.deliveries}?unit=$unit'));
      if (response.statusCode == 200) {
        final List list = json.decode(response.body);
        return list.map((item) => DeliveryModel.fromJson(item)).toList();
      }
    } catch (e) {
      print('Error fetching deliveries: $e');
    }
    return [];
  }

  /// Pre-approve delivery courier entry
  Future<bool> preApproveDelivery({
    required String societyId,
    required String unit,
    required String carrier,
    required String passcode,
    required String permission,
    required String notes,
  }) async {
    try {
      final response = await http.post(
        Uri.parse(ApiConfig.deliveries),
        headers: ApiConfig.headers,
        body: json.encode({
          'society_id': societyId,
          'unit': unit,
          'carrier': carrier,
          'passcode': passcode,
          'permission': permission,
          'notes': notes,
          'expected_window': 'Expected in 30 mins',
        }),
      );
      return response.statusCode == 201 || response.statusCode == 200;
    } catch (e) {
      print('Error pre-approving delivery: $e');
      return false;
    }
  }

  /// Fetch active visitors logged inside society
  Future<List<VisitorModel>> getVisitors() async {
    try {
      final response = await http.get(Uri.parse(ApiConfig.visitors));
      if (response.statusCode == 200) {
        final List list = json.decode(response.body);
        return list.map((item) => VisitorModel.fromJson(item)).toList();
      }
    } catch (e) {
      print('Error fetching visitors: $e');
    }
    return [];
  }

  /// Admit visitor from security gate terminal
  Future<bool> admitVisitor({
    required String societyId,
    required String unit,
    required String visitorName,
    required String visitorPhone,
    required String purpose,
    String? vehicleNumber,
    String entryGate = 'Gate 01',
  }) async {
    try {
      final response = await http.post(
        Uri.parse(ApiConfig.admitVisitor),
        headers: ApiConfig.headers,
        body: json.encode({
          'society_id': societyId,
          'unit': unit,
          'visitor_name': visitorName,
          'visitor_phone': visitorPhone,
          'visitor_type': purpose,
          'vehicle_number': vehicleNumber ?? '',
          'entry_gate': entryGate,
        }),
      );
      return response.statusCode == 201 || response.statusCode == 200;
    } catch (e) {
      print('Error admitting visitor: $e');
      return false;
    }
  }

  /// Fetch complaints for unit or society
  Future<List<ComplaintModel>> getComplaints({String? unit}) async {
    try {
      final url = unit != null ? '${ApiConfig.complaints}?unit=$unit' : ApiConfig.complaints;
      final response = await http.get(Uri.parse(url));
      if (response.statusCode == 200) {
        final List list = json.decode(response.body);
        return list.map((item) => ComplaintModel.fromJson(item)).toList();
      }
    } catch (e) {
      print('Error fetching complaints: $e');
    }
    return [];
  }

  /// Submit new complaint
  Future<bool> createComplaint({
    required String societyId,
    required String unit,
    required String residentName,
    required String category,
    required String title,
    required String description,
    required String priority,
  }) async {
    try {
      final response = await http.post(
        Uri.parse(ApiConfig.complaints),
        headers: ApiConfig.headers,
        body: json.encode({
          'society_id': societyId,
          'unit': unit,
          'resident_name': residentName,
          'category': category,
          'title': title,
          'description': description,
          'priority': priority,
        }),
      );
      return response.statusCode == 201 || response.statusCode == 200;
    } catch (e) {
      print('Error creating complaint: $e');
      return false;
    }
  }

  /// Fetch society circulars and notices
  Future<List<NoticeModel>> getNotices() async {
    try {
      final response = await http.get(Uri.parse(ApiConfig.notices));
      if (response.statusCode == 200) {
        final List list = json.decode(response.body);
        return list.map((item) => NoticeModel.fromJson(item)).toList();
      }
    } catch (e) {
      print('Error fetching notices: $e');
    }
    return [];
  }

  /// Fetch facility bookings
  Future<List<FacilityBookingModel>> getFacilityBookings({String? unit}) async {
    try {
      final url = unit != null ? '${ApiConfig.facilityBookings}?unit=$unit' : ApiConfig.facilityBookings;
      final response = await http.get(Uri.parse(url));
      if (response.statusCode == 200) {
        final List list = json.decode(response.body);
        return list.map((item) => FacilityBookingModel.fromJson(item)).toList();
      }
    } catch (e) {
      print('Error fetching bookings: $e');
    }
    return [];
  }

  /// Reserve facility
  Future<bool> createFacilityBooking({
    required String societyId,
    required String unit,
    required String residentName,
    required String facilityName,
    required String bookingDate,
    required String timeSlot,
    double feeAmount = 0.0,
  }) async {
    try {
      final response = await http.post(
        Uri.parse(ApiConfig.facilityBookings),
        headers: ApiConfig.headers,
        body: json.encode({
          'society_id': societyId,
          'unit': unit,
          'resident_name': residentName,
          'facility_name': facilityName,
          'booking_date': bookingDate,
          'time_slot': timeSlot,
          'fee_amount': feeAmount,
        }),
      );
      return response.statusCode == 201 || response.statusCode == 200;
    } catch (e) {
      print('Error booking facility: $e');
      return false;
    }
  }

  /// Fetch IoT water tank levels
  Future<List<WaterTankModel>> getWaterTanks() async {
    try {
      final response = await http.get(Uri.parse(ApiConfig.waterTanks));
      if (response.statusCode == 200) {
        final List list = json.decode(response.body);
        return list.map((item) => WaterTankModel.fromJson(item)).toList();
      }
    } catch (e) {
      print('Error fetching water tanks: $e');
    }
    return [];
  }

  /// Toggle water pump motor relay
  Future<bool> toggleWaterPump(String pumpId, {String operator = 'Mobile App Staff'}) async {
    try {
      final response = await http.post(
        Uri.parse(ApiConfig.togglePump),
        headers: ApiConfig.headers,
        body: json.encode({
          'pump_id': pumpId,
          'operator': operator,
        }),
      );
      return response.statusCode == 200;
    } catch (e) {
      print('Error toggling water pump: $e');
      return false;
    }
  }

  /// Verify visitor entry OTP at gate terminal
  Future<Map<String, dynamic>> verifyVisitorOtp({
    required String otpCode,
    String guardName = 'Head Constable Ram Singh',
    String gate = 'Main Gate 01 Plaza',
  }) async {
    try {
      final response = await http.post(
        Uri.parse(ApiConfig.verifyVisitorOtp),
        headers: ApiConfig.headers,
        body: json.encode({
          'otp_code': otpCode,
          'guard_name': guardName,
          'gate': gate,
        }),
      );
      if (response.statusCode == 200) {
        return json.decode(response.body);
      }
      return {'success': false, 'message': 'Invalid or expired OTP code'};
    } catch (e) {
      print('Error verifying OTP: $e');
      return {'success': false, 'message': 'Connection error'};
    }
  }

  /// Trigger emergency forced entry / intrusion alert
  Future<bool> triggerSecurityAlert({
    required String societyId,
    required String guardId,
    required String guardName,
    required String alertType,
    required String severity,
    required String location,
    required String description,
    Map<String, dynamic>? intruderDetails,
  }) async {
    try {
      final response = await http.post(
        Uri.parse(ApiConfig.securityAlerts),
        headers: ApiConfig.headers,
        body: json.encode({
          'society_id': societyId,
          'guard_id': guardId,
          'guard_name': guardName,
          'alert_type': alertType,
          'severity': severity,
          'location': location,
          'description': description,
          'intruder_details': intruderDetails ?? {},
        }),
      );
      return response.statusCode == 201 || response.statusCode == 200;
    } catch (e) {
      print('Error triggering security alert: $e');
      return false;
    }
  }

  /// Fetch active security alerts
  Future<List<SecurityAlertModel>> getSecurityAlerts() async {
    try {
      final response = await http.get(Uri.parse(ApiConfig.securityAlerts));
      if (response.statusCode == 200) {
        final List list = json.decode(response.body);
        return list.map((item) => SecurityAlertModel.fromJson(item)).toList();
      }
    } catch (e) {
      print('Error fetching security alerts: $e');
    }
    return [];
  }

  /// Fetch guard profile & duty status
  Future<GuardProfileModel?> getGuardProfile({String guardId = 'guard_01'}) async {
    try {
      final response = await http.get(Uri.parse('${ApiConfig.guardProfile}?guard_id=$guardId'));
      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        return GuardProfileModel.fromJson(data);
      }
    } catch (e) {
      print('Error fetching guard profile: $e');
    }
    return null;
  }

  /// Set guard online / offline duty status
  Future<bool> setGuardDutyStatus(String guardId, bool isOnline) async {
    try {
      final response = await http.post(
        Uri.parse(ApiConfig.guardDutyStatus),
        headers: ApiConfig.headers,
        body: json.encode({
          'guard_id': guardId,
          'is_online': isOnline,
        }),
      );
      return response.statusCode == 200;
    } catch (e) {
      print('Error setting duty status: $e');
      return false;
    }
  }

  /// Update guard GPS tracking coordinates
  Future<bool> updateGuardLocation(String guardId, double lat, double lng) async {
    try {
      final response = await http.post(
        Uri.parse(ApiConfig.guardLocation),
        headers: ApiConfig.headers,
        body: json.encode({
          'guard_id': guardId,
          'lat': lat,
          'lng': lng,
        }),
      );
      return response.statusCode == 200;
    } catch (e) {
      print('Error updating guard location: $e');
      return false;
    }
  }

  /// Execute hourly facial biometric feature verification
  Future<Map<String, dynamic>> verifyGuardFaceHourly({
    required String guardId,
    required String capturedPhotoUrl,
    required Map<String, dynamic> facialLandmarks,
    bool simulateMismatch = false,
  }) async {
    try {
      final response = await http.post(
        Uri.parse(ApiConfig.guardFaceVerify),
        headers: ApiConfig.headers,
        body: json.encode({
          'guard_id': guardId,
          'captured_photo_url': capturedPhotoUrl,
          'facial_landmarks': facialLandmarks,
          'simulate_mismatch': simulateMismatch,
        }),
      );
      if (response.statusCode == 200) {
        return json.decode(response.body);
      }
      return {'success': false, 'message': 'Verification failed'};
    } catch (e) {
      print('Error verifying guard face: $e');
      return {'success': false, 'message': 'Network error'};
    }
  }

  /// Update guard master photo reference in Society Panel & Guard profile
  Future<bool> updateGuardMasterPhoto(String guardId, String newPhotoUrl) async {
    try {
      final response = await http.post(
        Uri.parse(ApiConfig.guardMasterPhoto),
        headers: ApiConfig.headers,
        body: json.encode({
          'guard_id': guardId,
          'master_photo_url': newPhotoUrl,
        }),
      );
      return response.statusCode == 200;
    } catch (e) {
      print('Error updating master photo: $e');
      return false;
    }
  }
}
