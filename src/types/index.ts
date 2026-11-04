export interface SocietyConfig {
  id: string;
  name: string;
  subdomain: string;
  customDomain: string;
  isCustomDomainActive: boolean;
  registrationNumber: string;
  gstin?: string;
  address: string;
  city: string;
  pincode: string;
  totalFlats: number;
  totalBlocks: number;
  primaryColor: string;
  secondaryColor: string;
  logoEmblem: string;
  adminName: string;
  adminEmail: string;
  adminPhone: string;
  adminRole: 'President' | 'Secretary' | 'Treasurer' | 'Estate Manager';
  temporaryPassword?: string;
  credentialsIssued: boolean;
  sslStatus: 'active' | 'provisioning' | 'pending';
  edgeRoutingStatus: 'routed' | 'propagating' | 'idle';
  createdAt: string;
}

export interface ResidentRecord {
  id: string;
  unit: string;
  block: string;
  ownerName: string;
  residentType: 'Owner' | 'Tenant';
  phone: string;
  email: string;
  parkingSlot: string;
  hasPets: boolean;
  status: 'active' | 'pending_verification';
}

export interface GuardCheckpoint {
  id: string;
  name: string;
  location: string;
  nfcTagId: string;
  qrPayload: string;
  requiredTimeWindow: string;
  status: 'cleared' | 'pending' | 'missed';
  lastScannedTime?: string;
  scannedBy?: string;
  geofenceCoordinates: {
    lat: number;
    lng: number;
    radiusMeters: number;
  };
}

export interface WasteAuditRecord {
  unit: string;
  collectedAt: string;
  collectorName: string;
  segregationStatus: 'perfect' | 'mixed' | 'hazardous_flag' | 'door_locked';
  dryWeightKg: number;
  wetWeightKg: number;
  penaltyAssessed: boolean;
  notes: string;
}

export interface MaintenanceTicket {
  ticketId: string;
  unit: string;
  category: 'Plumbing' | 'Electrical' | 'Elevator' | 'Civil';
  issue: string;
  loggedAt: string;
  technicianName: string;
  status: 'In Progress' | 'Awaiting OTP' | 'Resolved';
  otpCode: string;
  photoUploaded: boolean;
  slaRemainingMinutes: number;
}

export interface NotificationRule {
  id: string;
  title: string;
  description: string;
  channels: ('push' | 'sms' | 'ivr' | 'whatsapp')[];
  enabled: boolean;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

/* =========================================================================
   Utility Billing & Ledger Types
   ========================================================================= */
export interface UtilityInvoice {
  id: string;
  unit: string;
  residentName: string;
  billingPeriod: string;
  dueDate: string;
  status: 'Paid' | 'Pending' | 'Overdue';
  societyMaintenance: {
    amount: number;
    ratePerSqFt: number;
    areaSqFt: number;
    description: string;
  };
  propertyTax: {
    amount: number;
    municipalQuarter: string;
    assessmentNo: string;
  };
  electricityMeter: {
    previousReading: number;
    currentReading: number;
    unitsConsumed: number;
    gridRate: number;
    dgUnitsConsumed: number;
    dgRate: number;
    totalAmount: number;
  };
  waterUtility: {
    baselineLitres: number;
    actualLitres: number;
    ratePerKl: number;
    consumptionSurcharge: number;
    totalAmount: number;
  };
  totalAmount: number;
  paidAt?: string;
  paymentMethod?: 'UPI' | 'Credit Card' | 'Net Banking';
  transactionId?: string;
  receiptHash?: string;
}

/* =========================================================================
   Delivery & Visitor Geofence Types
   ========================================================================= */
export type CarrierType = 
  | 'Zomato' 
  | 'Swiggy' 
  | 'Amazon' 
  | 'Blinkit' 
  | 'Dunzo' 
  | 'BlueDart' 
  | 'Flipkart' 
  | 'Other';

export interface DeliveryEntry {
  id: string;
  unit: string;
  carrier: CarrierType;
  passcode: string;
  permission: 'Leave at Gate' | 'Allow to Doorstep';
  notes: string;
  expectedWindow: string;
  status: 'Expected' | 'At Security Gate' | 'Delivered';
  createdAt: string;
  admittedAt?: string;
  agentName?: string;
  agentPhone?: string;
}

export interface PremisesVisitor {
  id: string;
  name: string;
  company: string;
  unit: string;
  entryTime: string;
  purpose: 'Delivery' | 'Guest' | 'Cab' | 'Service Staff';
  vehicleNumber?: string;
  status: 'Inside' | 'Exited';
  entryGate: string;
}

/* =========================================================================
   IoT Water & Motor Management Types
   ========================================================================= */
export interface WaterTank {
  id: 'ug_sump' | 'oht_tower_a' | 'oht_tower_b';
  name: string;
  location: string;
  capacityLitres: number;
  currentLitres: number;
  levelPercentage: number;
  sensorType: string;
  sensorHealth: 'Optimal' | 'Calibrating' | 'Signal Low';
  lastSensorPing: string;
  status: 'normal' | 'low' | 'critical_high' | 'full';
  alarmTriggered?: boolean;
}

export interface WaterPump {
  id: 'borewell_1' | 'booster_2';
  name: string;
  type: string;
  sourceTankId: 'ug_sump';
  targetTankId: 'oht_tower_a' | 'oht_tower_b';
  state: 'RUNNING' | 'IDLE' | 'AUTO_TRIPPED';
  flowRateLpm: number;
  powerKw: number;
  voltageV: number;
  lastStateChanged: string;
}

export interface WaterAuditLog {
  id: string;
  timestamp: string;
  action: 'PUMP_ON' | 'PUMP_OFF' | 'AUTO_TRIP_SHUTOFF' | 'LOW_LEVEL_ALARM' | 'FULL_LEVEL_ALARM';
  pumpName: string;
  tankName: string;
  levelPercentage: number;
  operator: string;
  triggerType: 'Manual Staff Switch' | 'IoT Automated Failsafe' | 'Threshold Event';
  auditFlag?: string;
}

/* =========================================================================
   Society Panel & Resident Helpdesk SQL Types
   ========================================================================= */
export interface Complaint {
  id: string;
  societyId: string;
  unit: string;
  residentName: string;
  category: 'Plumbing' | 'Electrical' | 'Elevator' | 'Security' | 'Gardening' | 'Civil' | 'Other';
  title: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  status: 'Open' | 'In Progress' | 'Resolved';
  assignedTo?: string;
  resolutionNotes?: string;
  createdAt: string;
  resolvedAt?: string;
}

export interface SocietyNotice {
  id: string;
  societyId: string;
  title: string;
  category: 'General' | 'Maintenance' | 'Event' | 'Emergency' | 'Meeting';
  content: string;
  priority: 'Normal' | 'Important' | 'Urgent';
  postedBy: string;
  validUntil: string;
  createdAt: string;
}

export interface FacilityBooking {
  id: string;
  societyId: string;
  unit: string;
  residentName: string;
  facilityName: 'Clubhouse Party Hall' | 'Tennis Court' | 'Swimming Pool Slot' | 'Badminton Court' | 'Community Garden';
  bookingDate: string;
  timeSlot: string;
  status: 'Confirmed' | 'Pending' | 'Cancelled';
  feeAmount: number;
  createdAt: string;
}

export interface SocietyStaff {
  id: string;
  societyId: string;
  name: string;
  role: 'President' | 'Secretary' | 'Treasurer' | 'Estate Manager' | 'Chief Security' | 'Senior Electrician' | 'Master Plumber';
  phone: string;
  email: string;
  status: 'Active' | 'On Leave';
  shift: 'Morning' | 'General' | 'Night';
}

/* =========================================================================
   Security & Guard Management, OTP Gate Access, Panic Alerts & AI Face Check
   ========================================================================= */
export interface SecurityAlert {
  id: string;
  societyId: string;
  guardId: string;
  guardName: string;
  alertType: 'FORCED_ENTRY' | 'INTRUDER_UNAUTHORIZED' | 'PANIC_ALARM' | 'GEOFENCE_BREACH' | 'FACIAL_VERIFICATION_FAILED';
  severity: 'CRITICAL' | 'HIGH' | 'WARNING';
  location: string;
  description: string;
  intruderDetails?: {
    vehicleNumber?: string;
    personCount?: number;
    description?: string;
    photoUrl?: string;
  };
  status: 'ACTIVE' | 'ACKNOWLEDGED' | 'RESOLVED';
  createdAt: string;
  resolvedAt?: string;
  resolvedBy?: string;
}

export interface VisitorInvitePass {
  id: string;
  societyId: string;
  unit: string;
  residentName: string;
  residentPhone?: string;
  visitorName: string;
  visitorPhone: string;
  visitorType: 'Guest' | 'Delivery' | 'Cab' | 'Service Staff' | 'Vendor';
  company?: string;
  otpCode: string; // 4- or 6-digit OTP code to verify at gate
  vehicleNumber?: string;
  validFrom: string;
  validUntil: string;
  status: 'Pending_Verification' | 'Admitted' | 'Expired' | 'Rejected';
  admittedAt?: string;
  admittedByGuard?: string;
  entryGate?: string;
  createdAt: string;
}

export interface FacialLandmarks {
  eyeDistance: number;
  noseToChinRatio: number;
  faceWidthToHeightRatio: number;
  eyeToMouthRatio: number;
  jawCurvatureScore: number;
  confidenceScore: number;
}

export interface GuardDutyProfile {
  id: string;
  societyId: string;
  name: string;
  badgeNumber: string;
  phone: string;
  assignedGate: string;
  isOnline: boolean; // On-Duty (Online) vs Off-Duty (Offline)
  dutyShift: 'Morning (06:00 - 14:00)' | 'Evening (14:00 - 22:00)' | 'Night (22:00 - 06:00)';
  shiftStartedAt?: string;
  currentLat: number;
  currentLng: number;
  isWithinGeofence: boolean;
  distanceFromPostMeters: number;
  lastGpsPing: string;
  masterPhotoUrl: string; // Stored reference master photo in Society Panel
  registeredAt: string;
  lastFaceVerifiedAt: string;
  nextVerificationDueMinutes: number;
  faceVerificationStatus: 'VERIFIED' | 'DUE_SOON' | 'EXPIRED_ALERT' | 'FAILED';
  lastVerificationConfidence?: number;
  batteryLevel?: number;
}

export interface GuardFaceVerificationLog {
  id: string;
  societyId: string;
  guardId: string;
  guardName: string;
  capturedPhotoUrl: string;
  masterPhotoUrl: string;
  matchScore: number; // 0 to 100%
  status: 'PASSED' | 'FAILED';
  verificationNotes: string;
  verifiedAt: string;
  operatorType: 'AUTO_AI_MATCH' | 'MANUAL_SUPERVISOR_OVERRIDE';
}

export interface GuardShiftAssignment {
  id: string;
  societyId: string;
  guardId: string;
  guardName: string;
  badgeNumber: string;
  shiftType: 'Morning' | 'Evening' | 'Night' | 'Relief';
  shiftTiming: string; // e.g. '06:00 - 14:00'
  assignedPost: string; // 'Gate 01 Main Barrier', 'Gate 02 Service Bay', 'Perimeter Patrol'
  effectiveDate: string;
  status: 'ACTIVE_ON_DUTY' | 'SCHEDULED' | 'OFF_DUTY_REST';
  autoDutySync: boolean;
  assignedBy: string;
  notes?: string;
  createdAt: string;
}

/* =========================================================================
   Autonomous Drone Surveillance & Aerial Audit Types
   ========================================================================= */
export interface DroneFlightLog {
  id: string;
  societyId: string;
  missionId: string;
  missionType: 'PERIMETER_BREACH_RESPONSE' | 'SCHEDULED_AERIAL_PATROL' | 'THERMAL_NIGHT_SCAN' | 'ROOFTOP_BLINDSPOT_SURVEY';
  triggerSource: string;
  droneCallsign: string;
  droneModel: string;
  startTime: string;
  endTime: string;
  durationSeconds: number;
  perimeterZone: string;
  maxAltitudeMeters: number;
  avgSpeedKmh: number;
  batteryStartPct: number;
  batteryEndPct: number;
  threatDetected: boolean;
  threatType?: string;
  thermalSignatureDetected: boolean;
  maxHeatTempCelsius?: number;
  verificationStatus: 'INVESTIGATING' | 'THREAT_CONFIRMED' | 'DETERRED_STROBE_ACTIVATED' | 'FALSE_ALARM' | 'VERIFIED_CLEARED';
  gpsCoordinatesPath: string; // GeoJSON or comma-separated waypoints
  videoArchiveUrl: string;
  guardAlerted: string;
  rwaReviewed: boolean;
  rwaRemarks?: string;
  createdAt: string;
}

export interface DroneScheduledPatrol {
  id: string;
  societyId: string;
  patrolName: string;
  patrolTime: string;
  frequency: string;
  flightPath: string;
  sensorPayload: string;
  altitudeM: number;
  status: 'Active' | 'Paused';
  lastRun?: string;
  nextRun: string;
}

export interface DroneLiveTelemetry {
  callsign: string;
  model: string;
  status: 'DOCKED_CHARGING' | 'PREFLIGHT_SPIN' | 'RAPID_DISPATCH' | 'PATROLLING_PERIMETER' | 'HOVERING_INSPECTION' | 'RETURNING_TO_DOCK';
  batteryPct: number;
  altitudeMeters: number;
  speedKmh: number;
  latitude: number;
  longitude: number;
  currentZone: string;
  activeSensors: string[];
  thermalMode: 'OPTICAL_4K' | 'FLIR_IRONBOW' | 'FLIR_WHITE_HOT' | 'IR_NIGHT_VISION';
  strobeDeterrentActive: boolean;
  acousticSirenActive: boolean;
  dockStation: string;
  lastUpdated: string;
}

export interface DroneIncidentAlert {
  id: string;
  societyId: string;
  timestamp: string;
  triggerSensor: string;
  location: string;
  threatLevel: 'CRITICAL_BREACH' | 'SUSPICIOUS_MOTION' | 'THERMAL_ANOMALY';
  etaSeconds: number;
  droneStatus: string;
  thermalReadingCelsius: number;
  targetClassification: string;
  isVerified: boolean;
  actionTaken?: string;
}

export type DroneManufacturer = 
  | 'DJI Enterprise' 
  | 'Garuda Aerospace'
  | 'Skydio Autonomous' 
  | 'ideaForge' 
  | 'Autel Robotics' 
  | 'Asteria Aerospace' 
  | 'Open-PX4 / MAVLink';

export interface DronePresetModel {
  manufacturer: DroneManufacturer;
  model: string;
  country: string;
  tagline: string;
  defaultProtocol: 'DJI_CLOUD_API' | 'GARUDA_FLEETLINK' | 'SKYDIO_FLEET_REST' | 'IDEAFORGE_MAVLINK' | 'AUTEL_SKYCOMMAND' | 'ASTERIA_SKYDECK' | 'MAVLINK_UDP';
  maxFlightTimeMinutes: number;
  maxWindResistanceMps: number;
  cameraPayload: string;
  thermalSensor: string;
  dockSupport: boolean;
  strobeLumen: number;
  sirenDb: number;
  recommendedUse: string;
  sampleEndpoint: string;
  sampleRtsp: string;
  features: string[];
}

export interface ColonyDroneConnection {
  id: string;
  societyId: string;
  manufacturer: DroneManufacturer;
  modelName: string;
  serialNumber: string;
  callsign: string;
  connectionProtocol: 'DJI_CLOUD_API' | 'GARUDA_FLEETLINK' | 'SKYDIO_FLEET_REST' | 'IDEAFORGE_MAVLINK' | 'AUTEL_SKYCOMMAND' | 'ASTERIA_SKYDECK' | 'MAVLINK_UDP';
  apiEndpointOrHost: string;
  apiKeyOrToken: string;
  apiSecretOrPin?: string;
  rtspVideoStreamUrl: string;
  webrtcSignalUrl?: string;
  dockStationId: string;
  telemetryPort: number;
  rthLatitude: number;
  rthLongitude: number;
  rthAltitudeMeters: number;
  geofenceRadiusMeters: number;
  isConnected: boolean;
  connectionStatus: 'ONLINE_TELEMETRY_LINKED' | 'CONNECTING_HANDSHAKE' | 'OFFLINE_DISCONNECTED' | 'AUTHENTICATION_ERROR';
  pingLatencyMs: number;
  signalStrengthPct: number;
  firmwareVersion: string;
  lastHeartbeat: string;
  notes?: string;
}

export * from './photos';


