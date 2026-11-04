/// Data Models for smartaisociety Flutter App

class SocietyModel {
  final String id;
  final String name;
  final String subdomain;
  final String primaryColor;
  final String logoEmblem;
  final String city;
  final int totalFlats;

  SocietyModel({
    required this.id,
    required this.name,
    required this.subdomain,
    required this.primaryColor,
    required this.logoEmblem,
    required this.city,
    required this.totalFlats,
  });

  factory SocietyModel.fromJson(Map<String, dynamic> json) {
    return SocietyModel(
      id: json['id']?.toString() ?? '',
      name: json['name']?.toString() ?? 'Society',
      subdomain: json['subdomain']?.toString() ?? 'app',
      primaryColor: json['primary_color']?.toString() ?? '#059669',
      logoEmblem: json['logo_emblem']?.toString() ?? 'SOC',
      city: json['city']?.toString() ?? 'Bengaluru',
      totalFlats: int.tryParse(json['total_flats']?.toString() ?? '320') ?? 320,
    );
  }
}

class InvoiceModel {
  final String id;
  final String unit;
  final String residentName;
  final String billingPeriod;
  final String dueDate;
  final String status;
  final double totalAmount;
  final String? transactionId;
  final String? receiptHash;

  InvoiceModel({
    required this.id,
    required this.unit,
    required this.residentName,
    required this.billingPeriod,
    required this.dueDate,
    required this.status,
    required this.totalAmount,
    this.transactionId,
    this.receiptHash,
  });

  factory InvoiceModel.fromJson(Map<String, dynamic> json) {
    return InvoiceModel(
      id: json['id']?.toString() ?? '',
      unit: json['unit']?.toString() ?? 'B-402',
      residentName: json['resident_name']?.toString() ?? 'Resident',
      billingPeriod: json['billing_period']?.toString() ?? 'Current Month',
      dueDate: json['due_date']?.toString() ?? '',
      status: json['status']?.toString() ?? 'Pending',
      totalAmount: double.tryParse(json['total_amount']?.toString() ?? '0') ?? 0.0,
      transactionId: json['transaction_id']?.toString(),
      receiptHash: json['receipt_hash']?.toString(),
    );
  }
}

class DeliveryModel {
  final String id;
  final String unit;
  final String carrier;
  final String passcode;
  final String status;
  final String permission;
  final String notes;

  DeliveryModel({
    required this.id,
    required this.unit,
    required this.carrier,
    required this.passcode,
    required this.status,
    required this.permission,
    required this.notes,
  });

  factory DeliveryModel.fromJson(Map<String, dynamic> json) {
    return DeliveryModel(
      id: json['id']?.toString() ?? '',
      unit: json['unit']?.toString() ?? '',
      carrier: json['carrier']?.toString() ?? 'Courier',
      passcode: json['passcode']?.toString() ?? '0000',
      status: json['status']?.toString() ?? 'Pre-Approved',
      permission: json['permission']?.toString() ?? 'Allow to Doorstep',
      notes: json['notes']?.toString() ?? '',
    );
  }
}

class VisitorModel {
  final String id;
  final String unit;
  final String name;
  final String visitorType;
  final String vehicleNumber;
  final String status;
  final String entryTime;

  VisitorModel({
    required this.id,
    required this.unit,
    required this.name,
    required this.visitorType,
    required this.vehicleNumber,
    required this.status,
    required this.entryTime,
  });

  factory VisitorModel.fromJson(Map<String, dynamic> json) {
    return VisitorModel(
      id: json['id']?.toString() ?? '',
      unit: json['unit']?.toString() ?? '',
      name: json['visitor_name']?.toString() ?? 'Guest',
      visitorType: json['visitor_type']?.toString() ?? 'Guest',
      vehicleNumber: json['vehicle_number']?.toString() ?? '',
      status: json['status']?.toString() ?? 'Inside',
      entryTime: json['entry_time']?.toString() ?? 'Just now',
    );
  }
}

class WaterTankModel {
  final String id;
  final String name;
  final String location;
  final int capacityLitres;
  final int currentLitres;
  final int levelPercentage;
  final String sensorHealth;

  WaterTankModel({
    required this.id,
    required this.name,
    required this.location,
    required this.capacityLitres,
    required this.currentLitres,
    required this.levelPercentage,
    required this.sensorHealth,
  });

  factory WaterTankModel.fromJson(Map<String, dynamic> json) {
    return WaterTankModel(
      id: json['id']?.toString() ?? '',
      name: json['name']?.toString() ?? 'Water Tank',
      location: json['location']?.toString() ?? '',
      capacityLitres: int.tryParse(json['capacity_litres']?.toString() ?? '100000') ?? 100000,
      currentLitres: int.tryParse(json['current_litres']?.toString() ?? '80000') ?? 80000,
      levelPercentage: int.tryParse(json['level_percentage']?.toString() ?? '80') ?? 80,
      sensorHealth: json['sensor_health']?.toString() ?? 'Optimal',
    );
  }
}

class ComplaintModel {
  final String id;
  final String unit;
  final String residentName;
  final String category;
  final String title;
  final String description;
  final String priority;
  final String status;
  final String? assignedTo;
  final String? resolutionNotes;
  final String createdAt;

  ComplaintModel({
    required this.id,
    required this.unit,
    required this.residentName,
    required this.category,
    required this.title,
    required this.description,
    required this.priority,
    required this.status,
    this.assignedTo,
    this.resolutionNotes,
    required this.createdAt,
  });

  factory ComplaintModel.fromJson(Map<String, dynamic> json) {
    return ComplaintModel(
      id: json['id']?.toString() ?? '',
      unit: json['unit']?.toString() ?? '',
      residentName: json['resident_name']?.toString() ?? 'Resident',
      category: json['category']?.toString() ?? 'General',
      title: json['title']?.toString() ?? '',
      description: json['description']?.toString() ?? '',
      priority: json['priority']?.toString() ?? 'Medium',
      status: json['status']?.toString() ?? 'Open',
      assignedTo: json['assigned_to']?.toString(),
      resolutionNotes: json['resolution_notes']?.toString(),
      createdAt: json['created_at']?.toString() ?? 'Just now',
    );
  }
}

class NoticeModel {
  final String id;
  final String title;
  final String category;
  final String content;
  final String priority;
  final String postedBy;
  final String validUntil;
  final String createdAt;

  NoticeModel({
    required this.id,
    required this.title,
    required this.category,
    required this.content,
    required this.priority,
    required this.postedBy,
    required this.validUntil,
    required this.createdAt,
  });

  factory NoticeModel.fromJson(Map<String, dynamic> json) {
    return NoticeModel(
      id: json['id']?.toString() ?? '',
      title: json['title']?.toString() ?? '',
      category: json['category']?.toString() ?? 'General',
      content: json['content']?.toString() ?? '',
      priority: json['priority']?.toString() ?? 'Normal',
      postedBy: json['posted_by']?.toString() ?? 'Managing Committee',
      validUntil: json['valid_until']?.toString() ?? '',
      createdAt: json['created_at']?.toString() ?? '',
    );
  }
}

class FacilityBookingModel {
  final String id;
  final String unit;
  final String residentName;
  final String facilityName;
  final String bookingDate;
  final String timeSlot;
  final String status;
  final double feeAmount;

  FacilityBookingModel({
    required this.id,
    required this.unit,
    required this.residentName,
    required this.facilityName,
    required this.bookingDate,
    required this.timeSlot,
    required this.status,
    required this.feeAmount,
  });

  factory FacilityBookingModel.fromJson(Map<String, dynamic> json) {
    return FacilityBookingModel(
      id: json['id']?.toString() ?? '',
      unit: json['unit']?.toString() ?? '',
      residentName: json['resident_name']?.toString() ?? '',
      facilityName: json['facility_name']?.toString() ?? '',
      bookingDate: json['booking_date']?.toString() ?? '',
      timeSlot: json['time_slot']?.toString() ?? '',
      status: json['status']?.toString() ?? 'Confirmed',
      feeAmount: double.tryParse(json['fee_amount']?.toString() ?? '0') ?? 0.0,
    );
  }
}

class VisitorInviteModel {
  final String id;
  final String unit;
  final String residentName;
  final String visitorName;
  final String visitorPhone;
  final String visitorType;
  final String otpCode;
  final String? vehicleNumber;
  final String status;
  final String createdAt;

  VisitorInviteModel({
    required this.id,
    required this.unit,
    required this.residentName,
    required this.visitorName,
    required this.visitorPhone,
    required this.visitorType,
    required this.otpCode,
    this.vehicleNumber,
    required this.status,
    required this.createdAt,
  });

  factory VisitorInviteModel.fromJson(Map<String, dynamic> json) {
    return VisitorInviteModel(
      id: json['id']?.toString() ?? '',
      unit: json['unit']?.toString() ?? '',
      residentName: json['resident_name']?.toString() ?? '',
      visitorName: json['visitor_name']?.toString() ?? '',
      visitorPhone: json['visitor_phone']?.toString() ?? '',
      visitorType: json['visitor_type']?.toString() ?? 'Guest',
      otpCode: json['otp_code']?.toString() ?? '',
      vehicleNumber: json['vehicle_number']?.toString(),
      status: json['status']?.toString() ?? 'Pending_Verification',
      createdAt: json['created_at']?.toString() ?? '',
    );
  }
}

class SecurityAlertModel {
  final String id;
  final String guardName;
  final String alertType;
  final String severity;
  final String location;
  final String description;
  final String status;
  final String createdAt;

  SecurityAlertModel({
    required this.id,
    required this.guardName,
    required this.alertType,
    required this.severity,
    required this.location,
    required this.description,
    required this.status,
    required this.createdAt,
  });

  factory SecurityAlertModel.fromJson(Map<String, dynamic> json) {
    return SecurityAlertModel(
      id: json['id']?.toString() ?? '',
      guardName: json['guard_name']?.toString() ?? 'Gate Guard',
      alertType: json['alert_type']?.toString() ?? 'FORCED_ENTRY',
      severity: json['severity']?.toString() ?? 'CRITICAL',
      location: json['location']?.toString() ?? 'Gate 01',
      description: json['description']?.toString() ?? '',
      status: json['status']?.toString() ?? 'ACTIVE',
      createdAt: json['created_at']?.toString() ?? 'Just now',
    );
  }
}

class GuardProfileModel {
  final String id;
  final String name;
  final String assignedGate;
  final String badgeNumber;
  final bool isOnline;
  final double currentLat;
  final double currentLng;
  final bool isWithinGeofence;
  final int distanceFromPostMeters;
  final String masterPhotoUrl;
  final String faceVerificationStatus;
  final double lastVerificationConfidence;

  GuardProfileModel({
    required this.id,
    required this.name,
    required this.assignedGate,
    required this.badgeNumber,
    required this.isOnline,
    required this.currentLat,
    required this.currentLng,
    required this.isWithinGeofence,
    required this.distanceFromPostMeters,
    required this.masterPhotoUrl,
    required this.faceVerificationStatus,
    required this.lastVerificationConfidence,
  });

  factory GuardProfileModel.fromJson(Map<String, dynamic> json) {
    return GuardProfileModel(
      id: json['id']?.toString() ?? '',
      name: json['name']?.toString() ?? 'Guard',
      assignedGate: json['assigned_gate']?.toString() ?? 'Gate 01',
      badgeNumber: json['badge_number']?.toString() ?? 'GD-001',
      isOnline: json['is_online'] == true || json['is_online'] == 1,
      currentLat: (json['current_lat'] is num) ? (json['current_lat'] as num).toDouble() : 12.9352,
      currentLng: (json['current_lng'] is num) ? (json['current_lng'] as num).toDouble() : 77.6245,
      isWithinGeofence: json['is_within_geofence'] == true || json['is_within_geofence'] == 1,
      distanceFromPostMeters: int.tryParse(json['distance_from_post_meters']?.toString() ?? '0') ?? 0,
      masterPhotoUrl: json['master_photo_url']?.toString() ?? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
      faceVerificationStatus: json['face_verification_status']?.toString() ?? 'VERIFIED',
      lastVerificationConfidence: (json['last_verification_confidence'] is num) ? (json['last_verification_confidence'] as num).toDouble() : 96.5,
    );
  }
}

