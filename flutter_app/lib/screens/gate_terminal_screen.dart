import 'dart:async';
import 'package:flutter/material.dart';
import '../services/api_service.dart';
import '../models/models.dart';

class GateTerminalScreen extends StatefulWidget {
  const GateTerminalScreen({Key? key}) : super(key: key);

  @override
  State<GateTerminalScreen> createState() => _GateTerminalScreenState();
}

class _GateTerminalScreenState extends State<GateTerminalScreen> {
  final ApiService _api = ApiService();
  bool _loading = true;

  // Guard Duty & Profile
  GuardProfileModel? _guardProfile;
  bool _isOnline = true;
  bool _isWithinGeofence = true;
  int _distanceMeters = 3;

  // Hourly Face Verification Timer
  int _secondsRemaining = 52 * 60; // 52 minutes remaining
  Timer? _countdownTimer;
  bool _faceVerified = true;
  double _lastConfidence = 96.4;

  // Visitor OTP verification
  final TextEditingController _otpController = TextEditingController();
  bool _isVerifyingOtp = false;
  Map<String, dynamic>? _otpResult;

  // Visitors list
  List<VisitorModel> _visitors = [];

  // Emergency Alert state
  bool _isSendingAlert = false;
  bool _alertActive = false;
  String _activeAlertMessage = '';

  @override
  void initState() {
    super.initState();
    _loadInitialData();
    _startHourlyTimer();
  }

  @override
  void dispose() {
    _countdownTimer?.cancel();
    _otpController.dispose();
    super.dispose();
  }

  void _startHourlyTimer() {
    _countdownTimer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (mounted) {
        setState(() {
          if (_secondsRemaining > 0) {
            _secondsRemaining--;
          } else {
            // Timer expired without facial verification! Auto-alert society panel
            _faceVerified = false;
            _alertActive = true;
            _activeAlertMessage = 'Hourly face check expired! Society Panel notified.';
          }
        });
      }
    });
  }

  Future<void> _loadInitialData() async {
    setState(() => _loading = true);
    final profile = await _api.getGuardProfile();
    final visitors = await _api.getVisitors();
    setState(() {
      _guardProfile = profile ??
          GuardProfileModel(
            id: 'guard_01',
            name: 'Head Constable Ram Singh',
            assignedGate: 'Main Gate 01 Plaza',
            badgeNumber: 'GD-8902',
            isOnline: true,
            currentLat: 12.9352,
            currentLng: 77.6245,
            isWithinGeofence: true,
            distanceFromPostMeters: 3,
            masterPhotoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
            faceVerificationStatus: 'VERIFIED',
            lastVerificationConfidence: 96.4,
          );
      _isOnline = _guardProfile!.isOnline;
      _isWithinGeofence = _guardProfile!.isWithinGeofence;
      _distanceMeters = _guardProfile!.distanceFromPostMeters;
      _visitors = visitors;
      _loading = false;
    });
  }

  // Toggle Guard On/Off Duty
  Future<void> _toggleDutyStatus(bool newStatus) async {
    setState(() => _isOnline = newStatus);
    await _api.setGuardDutyStatus('guard_01', newStatus);
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(newStatus ? '✓ On Duty (Online) - Gate Active' : 'Off Duty (Offline) - Gate Logged Out'),
        backgroundColor: newStatus ? const Color(0xFF059669) : const Color(0xFF64748B),
      ),
    );
  }

  // Verify Visitor OTP Code
  Future<void> _handleVerifyOtp() async {
    final code = _otpController.text.trim();
    if (code.length < 4) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please enter 4-digit visitor OTP code'), backgroundColor: Colors.orange),
      );
      return;
    }

    setState(() {
      _isVerifyingOtp = true;
      _otpResult = null;
    });

    final res = await _api.verifyVisitorOtp(
      otpCode: code,
      guardName: _guardProfile?.name ?? 'Guard Ram Singh',
      gate: _guardProfile?.assignedGate ?? 'Gate 01',
    );

    setState(() {
      _isVerifyingOtp = false;
      _otpResult = res;
    });

    if (res['success'] == true) {
      _otpController.clear();
      final freshVisitors = await _api.getVisitors();
      setState(() => _visitors = freshVisitors);
    }
  }

  // Trigger Panic / Forced Entry Alert
  Future<void> _showForcedEntryDialog() async {
    final vehicleCtrl = TextEditingController(text: 'DL-08-BK-4091');
    final descCtrl = TextEditingController(text: 'Black SUV forcibly sped through barrier without resident OTP authorization.');

    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (ctx) {
        return AlertDialog(
          backgroundColor: const Color(0xFF1E293B),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
          title: Row(
            children: const [
              Icon(Icons.warning_amber_rounded, color: Colors.redAccent, size: 28),
              SizedBox(width: 10),
              Expanded(
                child: Text('FORCED ENTRY PANIC ALARM', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16)),
              ),
            ],
          ),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'This will instantly sound alarms and notify the Resident App and Society Panel simultaneously!',
                style: TextStyle(color: Color(0xFF94A3B8), fontSize: 12),
              ),
              const SizedBox(height: 14),
              TextField(
                controller: vehicleCtrl,
                style: const TextStyle(color: Colors.white),
                decoration: const InputDecoration(
                  labelText: 'Vehicle Plate / Description',
                  labelStyle: TextStyle(color: Color(0xFF94A3B8)),
                  enabledBorder: OutlineInputBorder(borderSide: BorderSide(color: Color(0xFF475569))),
                  focusedBorder: OutlineInputBorder(borderSide: BorderSide(color: Colors.redAccent)),
                ),
              ),
              const SizedBox(height: 10),
              TextField(
                controller: descCtrl,
                maxLines: 2,
                style: const TextStyle(color: Colors.white),
                decoration: const InputDecoration(
                  labelText: 'Incident Notes',
                  labelStyle: TextStyle(color: Color(0xFF94A3B8)),
                  enabledBorder: OutlineInputBorder(borderSide: BorderSide(color: Color(0xFF475569))),
                  focusedBorder: OutlineInputBorder(borderSide: BorderSide(color: Colors.redAccent)),
                ),
              ),
            ],
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(ctx),
              child: const Text('Cancel', style: TextStyle(color: Colors.white70)),
            ),
            ElevatedButton.icon(
              icon: const Icon(Icons.emergency, color: Colors.white),
              label: const Text('DISPATCH SIREN ALARM', style: TextStyle(fontWeight: FontWeight.bold)),
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.redAccent,
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              ),
              onPressed: () async {
                Navigator.pop(ctx);
                setState(() => _isSendingAlert = true);

                await _api.triggerSecurityAlert(
                  societyId: 'soc_pg_982',
                  guardId: 'guard_01',
                  guardName: _guardProfile?.name ?? 'Guard Ram Singh',
                  alertType: 'FORCED_ENTRY',
                  severity: 'CRITICAL',
                  location: 'Main Gate 01 Plaza',
                  description: descCtrl.text,
                  intruderDetails: {
                    'vehicleNumber': vehicleCtrl.text,
                    'notes': descCtrl.text,
                  },
                );

                setState(() {
                  _isSendingAlert = false;
                  _alertActive = true;
                  _activeAlertMessage = 'Forced entry alarm active! Resident App & Society Panel sirens triggered.';
                });
              },
            ),
          ],
        );
      },
    );
  }

  // Facial Biometric Verification Modal
  void _openFaceVerificationDialog() {
    bool scanning = false;
    double? confidence;
    String status = 'idle';

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: const Color(0xFF0F172A),
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(28))),
      builder: (ctx) {
        return StatefulBuilder(
          builder: (ctx, setModalState) {
            return Padding(
              padding: const EdgeInsets.all(24),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Container(
                    width: 48,
                    height: 5,
                    decoration: BoxDecoration(color: const Color(0xFF334155), borderRadius: BorderRadius.circular(10)),
                  ),
                  const SizedBox(height: 16),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text(
                        'Hourly Facial Verification',
                        style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 18),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(
                          color: const Color(0xFF1E293B),
                          borderRadius: BorderRadius.circular(8),
                          border: Border.all(color: const Color(0xFF334155)),
                        ),
                        child: const Text('AI Bone Analysis', style: TextStyle(color: Color(0xFF38BDF8), fontSize: 11, fontWeight: FontWeight.bold)),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    'Facial feature biometric geometry (eye distance, jaw ratio) will be compared against the Society Panel master photo. Attire, uniform and hair changes are ignored.',
                    style: TextStyle(color: Color(0xFF94A3B8), fontSize: 12),
                  ),
                  const SizedBox(height: 20),

                  // Camera Preview / Scanning Area
                  Container(
                    height: 220,
                    width: double.infinity,
                    decoration: BoxDecoration(
                      color: const Color(0xFF1E293B),
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(
                        color: status == 'passed'
                            ? Colors.green
                            : status == 'failed'
                                ? Colors.redAccent
                                : const Color(0xFF38BDF8),
                        width: 2,
                      ),
                    ),
                    child: Stack(
                      alignment: Alignment.center,
                      children: [
                        ClipRRect(
                          borderRadius: BorderRadius.circular(18),
                          child: Image.network(
                            _guardProfile?.masterPhotoUrl ?? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
                            fit: BoxFit.cover,
                            width: double.infinity,
                            height: double.infinity,
                          ),
                        ),
                        Container(
                          decoration: BoxDecoration(
                            color: Colors.black.withOpacity(0.3),
                            borderRadius: BorderRadius.circular(18),
                          ),
                        ),
                        // Biometric Crosshair / Landmark overlay
                        Container(
                          width: 140,
                          height: 170,
                          decoration: BoxDecoration(
                            border: Border.all(
                              color: status == 'passed' ? Colors.green : const Color(0xFF38BDF8),
                              width: 2,
                            ),
                            borderRadius: BorderRadius.circular(16),
                          ),
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Row(
                                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                children: const [
                                  Icon(Icons.crop_free, color: Color(0xFF38BDF8), size: 20),
                                  Icon(Icons.crop_free, color: Color(0xFF38BDF8), size: 20),
                                ],
                              ),
                              if (scanning)
                                const CircularProgressIndicator(color: Color(0xFF38BDF8)),
                              Row(
                                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                children: const [
                                  Icon(Icons.crop_free, color: Color(0xFF38BDF8), size: 20),
                                  Icon(Icons.crop_free, color: Color(0xFF38BDF8), size: 20),
                                ],
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 16),
                  if (confidence != null)
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                      decoration: BoxDecoration(
                        color: status == 'passed' ? const Color(0xFF064E3B) : const Color(0xFF7F1D1D),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Text(
                        status == 'passed'
                            ? '✓ Biometric Match: ${confidence!.toStringAsFixed(1)}% - Verified On Duty!'
                            : '✗ Match Score: ${confidence!.toStringAsFixed(1)}% (<80%) - Alert Dispatched to Society Panel',
                        style: TextStyle(
                          color: status == 'passed' ? Colors.greenAccent : Colors.redAccent,
                          fontWeight: FontWeight.bold,
                          fontSize: 13,
                        ),
                      ),
                    ),

                  const SizedBox(height: 20),
                  Row(
                    children: [
                      Expanded(
                        child: OutlinedButton(
                          style: OutlinedButton.styleFrom(
                            foregroundColor: Colors.white,
                            side: const BorderSide(color: Color(0xFF475569)),
                            padding: const EdgeInsets.symmetric(vertical: 14),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                          ),
                          onPressed: () => Navigator.pop(ctx),
                          child: const Text('Close'),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: ElevatedButton.icon(
                          icon: const Icon(Icons.camera_alt),
                          label: Text(scanning ? 'Matching...' : 'Scan & Verify'),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: const Color(0xFF0284C7),
                            foregroundColor: Colors.white,
                            padding: const EdgeInsets.symmetric(vertical: 14),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                          ),
                          onPressed: scanning
                              ? null
                              : () async {
                                  setModalState(() {
                                    scanning = true;
                                    status = 'scanning';
                                  });

                                  // Call API
                                  final res = await _api.verifyGuardFaceHourly(
                                    guardId: 'guard_01',
                                    capturedPhotoUrl: _guardProfile?.masterPhotoUrl ?? '',
                                    facialLandmarks: {
                                      'eyeDistance': 0.44,
                                      'noseToChinRatio': 0.59,
                                      'faceWidthToHeightRatio': 0.76,
                                    },
                                    simulateMismatch: false,
                                  );

                                  final score = (res['matchScore'] is num) ? (res['matchScore'] as num).toDouble() : 96.4;
                                  final isOk = res['success'] == true;

                                  setModalState(() {
                                    scanning = false;
                                    confidence = score;
                                    status = isOk ? 'passed' : 'failed';
                                  });

                                  setState(() {
                                    _faceVerified = isOk;
                                    _lastConfidence = score;
                                    if (isOk) {
                                      _secondsRemaining = 3600; // Reset 60 min
                                    }
                                  });
                                },
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 10),
                ],
              ),
            );
          },
        );
      },
    );
  }

  String _formatTimer(int totalSecs) {
    final mins = totalSecs ~/ 60;
    final secs = totalSecs % 60;
    return '${mins.toString().padLeft(2, '0')}:${secs.toString().padLeft(2, '0')}';
  }

  @override
  Widget build(BuildContext context) {
    if (_loading) {
      return const Scaffold(
        backgroundColor: Color(0xFF0F172A),
        body: Center(child: CircularProgressIndicator(color: Colors.blueAccent)),
      );
    }

    return Scaffold(
      backgroundColor: const Color(0xFF0F172A),
      appBar: AppBar(
        backgroundColor: const Color(0xFF1E293B),
        foregroundColor: Colors.white,
        elevation: 0,
        title: Row(
          children: [
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
              decoration: BoxDecoration(
                color: const Color(0xFF059669),
                borderRadius: BorderRadius.circular(8),
              ),
              child: const Text('GATE 01', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
            ),
            const SizedBox(width: 10),
            const Text('Smart Guard App', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 17)),
          ],
        ),
        actions: [
          // On Duty / Off Duty Toggle Switch
          Row(
            children: [
              Text(
                _isOnline ? 'ON DUTY' : 'OFF DUTY',
                style: TextStyle(
                  color: _isOnline ? Colors.greenAccent : const Color(0xFF94A3B8),
                  fontSize: 11,
                  fontWeight: FontWeight.bold,
                ),
              ),
              Switch(
                value: _isOnline,
                activeColor: Colors.greenAccent,
                activeTrackColor: const Color(0xFF064E3B),
                inactiveThumbColor: const Color(0xFF64748B),
                inactiveTrackColor: const Color(0xFF334155),
                onChanged: _toggleDutyStatus,
              ),
            ],
          ),
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // ACTIVE EMERGENCY ALARM BANNER (IF FIRED)
          if (_alertActive)
            Container(
              margin: const EdgeInsets.only(bottom: 16),
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: Colors.redAccent.withOpacity(0.2),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: Colors.redAccent),
              ),
              child: Row(
                children: [
                  const Icon(Icons.campaign, color: Colors.redAccent, size: 28),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Text(
                      _activeAlertMessage,
                      style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13),
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.close, color: Colors.white70, size: 18),
                    onPressed: () => setState(() => _alertActive = false),
                  ),
                ],
              ),
            ),

          // GUARD PROFILE & HOURLY FACIAL VERIFICATION CARD
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: const Color(0xFF1E293B),
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: const Color(0xFF334155)),
            ),
            child: Column(
              children: [
                Row(
                  children: [
                    Stack(
                      children: [
                        ClipRRect(
                          borderRadius: BorderRadius.circular(14),
                          child: Image.network(
                            _guardProfile?.masterPhotoUrl ?? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
                            width: 54,
                            height: 54,
                            fit: BoxFit.cover,
                          ),
                        ),
                        Positioned(
                          right: 0,
                          bottom: 0,
                          child: Container(
                            width: 14,
                            height: 14,
                            decoration: BoxDecoration(
                              color: _isOnline ? Colors.green : Colors.grey,
                              shape: BoxShape.circle,
                              border: Border.all(color: const Color(0xFF1E293B), width: 2),
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(width: 14),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              Text(
                                _guardProfile?.name ?? 'Head Constable Ram Singh',
                                style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 15),
                              ),
                              const SizedBox(width: 6),
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                decoration: BoxDecoration(
                                  color: const Color(0xFF334155),
                                  borderRadius: BorderRadius.circular(6),
                                ),
                                child: Text(
                                  _guardProfile?.badgeNumber ?? 'GD-8902',
                                  style: const TextStyle(color: Color(0xFF94A3B8), fontSize: 10, fontWeight: FontWeight.bold),
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 4),
                          Text(
                            _guardProfile?.assignedGate ?? 'Main Gate 01 Plaza',
                            style: const TextStyle(color: Color(0xFF94A3B8), fontSize: 12),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 14),
                const Divider(color: Color(0xFF334155), height: 1),
                const SizedBox(height: 12),

                // Geofencing & Hourly Face Countdown Row
                Row(
                  children: [
                    // Geofence status
                    Expanded(
                      child: Container(
                        padding: const EdgeInsets.all(10),
                        decoration: BoxDecoration(
                          color: const Color(0xFF0F172A),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text('GPS GEOFENCE', style: TextStyle(color: Color(0xFF64748B), fontSize: 9, fontWeight: FontWeight.bold)),
                            const SizedBox(height: 4),
                            Row(
                              children: [
                                Icon(
                                  _isWithinGeofence ? Icons.check_circle : Icons.error,
                                  color: _isWithinGeofence ? Colors.greenAccent : Colors.redAccent,
                                  size: 14,
                                ),
                                const SizedBox(width: 5),
                                Text(
                                  _isWithinGeofence ? 'Inside (±${_distanceMeters}m)' : 'Breach Alert',
                                  style: TextStyle(
                                    color: _isWithinGeofence ? Colors.greenAccent : Colors.redAccent,
                                    fontSize: 11,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(width: 10),
                    // Hourly Face Countdown
                    Expanded(
                      child: Container(
                        padding: const EdgeInsets.all(10),
                        decoration: BoxDecoration(
                          color: const Color(0xFF0F172A),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text('NEXT FACE CHECK', style: TextStyle(color: Color(0xFF64748B), fontSize: 9, fontWeight: FontWeight.bold)),
                            const SizedBox(height: 4),
                            Row(
                              children: [
                                const Icon(Icons.timer_outlined, color: Color(0xFF38BDF8), size: 14),
                                const SizedBox(width: 5),
                                Text(
                                  _formatTimer(_secondsRemaining),
                                  style: const TextStyle(color: Color(0xFF38BDF8), fontSize: 12, fontWeight: FontWeight.bold, fontFamily: 'monospace'),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),

                const SizedBox(height: 12),
                SizedBox(
                  width: double.infinity,
                  height: 40,
                  child: ElevatedButton.icon(
                    icon: const Icon(Icons.face, size: 18),
                    label: Text(
                      _faceVerified ? 'Hourly Facial Match (Verified ${_lastConfidence.toStringAsFixed(1)}%)' : 'Verify Face Now (Required)',
                      style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold),
                    ),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: _faceVerified ? const Color(0xFF0369A1) : Colors.amber[700],
                      foregroundColor: Colors.white,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                    onPressed: _openFaceVerificationDialog,
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(height: 16),

          // VISITOR OTP VERIFICATION CARD
          Container(
            padding: const EdgeInsets.all(18),
            decoration: BoxDecoration(
              color: const Color(0xFF1E293B),
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: const Color(0xFF334155)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: const [
                    Text('Visitor Gate Access Verification', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 15)),
                    Icon(Icons.pin, color: Colors.blueAccent),
                  ],
                ),
                const SizedBox(height: 6),
                const Text(
                  'Enter the 4-digit OTP shown by visitor (generated by resident app).',
                  style: TextStyle(color: Color(0xFF94A3B8), fontSize: 12),
                ),
                const SizedBox(height: 14),
                Row(
                  children: [
                    Expanded(
                      child: TextField(
                        controller: _otpController,
                        keyboardType: TextInputType.number,
                        maxLength: 6,
                        style: const TextStyle(color: Colors.white, fontSize: 20, letterSpacing: 8, fontWeight: FontWeight.bold),
                        decoration: InputDecoration(
                          counterText: '',
                          hintText: '• • • •',
                          hintStyle: const TextStyle(color: Color(0xFF64748B), letterSpacing: 8),
                          filled: true,
                          fillColor: const Color(0xFF0F172A),
                          contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                          border: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: const BorderSide(color: Color(0xFF334155))),
                          enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: const BorderSide(color: Color(0xFF334155))),
                          focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: const BorderSide(color: Colors.blueAccent)),
                        ),
                      ),
                    ),
                    const SizedBox(width: 12),
                    SizedBox(
                      height: 52,
                      child: ElevatedButton.icon(
                        icon: _isVerifyingOtp
                            ? const SizedBox(width: 16, height: 16, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                            : const Icon(Icons.check_circle_outline),
                        label: const Text('VERIFY', style: TextStyle(fontWeight: FontWeight.bold)),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF059669),
                          foregroundColor: Colors.white,
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                        ),
                        onPressed: _isVerifyingOtp ? null : _handleVerifyOtp,
                      ),
                    ),
                  ],
                ),

                // Quick sample OTP chip buttons for easy testing
                const SizedBox(height: 10),
                Wrap(
                  spacing: 8,
                  children: ['7842', '9104', '4218', '6031'].map((code) {
                    return ActionChip(
                      backgroundColor: const Color(0xFF334155),
                      label: Text('OTP: $code', style: const TextStyle(color: Colors.white70, fontSize: 11)),
                      onPressed: () {
                        _otpController.text = code;
                        _handleVerifyOtp();
                      },
                    );
                  }).toList(),
                ),

                // Verification Result Card
                if (_otpResult != null) ...[
                  const SizedBox(height: 14),
                  Container(
                    padding: const EdgeInsets.all(14),
                    decoration: BoxDecoration(
                      color: _otpResult!['success'] == true ? const Color(0xFF064E3B) : const Color(0xFF7F1D1D),
                      borderRadius: BorderRadius.circular(14),
                      border: Border.all(
                        color: _otpResult!['success'] == true ? Colors.greenAccent : Colors.redAccent,
                      ),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Icon(
                              _otpResult!['success'] == true ? Icons.verified : Icons.cancel,
                              color: _otpResult!['success'] == true ? Colors.greenAccent : Colors.redAccent,
                              size: 20,
                            ),
                            const SizedBox(width: 8),
                            Text(
                              _otpResult!['success'] == true ? 'GATE CLEARANCE GRANTED' : 'ACCESS DENIED',
                              style: TextStyle(
                                color: _otpResult!['success'] == true ? Colors.greenAccent : Colors.redAccent,
                                fontWeight: FontWeight.bold,
                                fontSize: 13,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 6),
                        Text(
                          _otpResult!['message'] ?? '',
                          style: const TextStyle(color: Colors.white, fontSize: 12),
                        ),
                        if (_otpResult!['invite'] != null) ...[
                          const SizedBox(height: 8),
                          Text(
                            'Visitor: ${_otpResult!['invite']['visitor_name']} • Flat: ${_otpResult!['invite']['unit']}',
                            style: const TextStyle(color: Colors.white70, fontSize: 11, fontWeight: FontWeight.bold),
                          ),
                        ],
                      ],
                    ),
                  ),
                ],
              ],
            ),
          ),

          const SizedBox(height: 16),

          // FORCED ENTRY / INTRUSION PANIC BUTTON
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFF7F1D1D), Color(0xFF991B1B)],
              ),
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: Colors.redAccent),
              boxShadow: [
                BoxShadow(
                  color: Colors.red.withOpacity(0.2),
                  blurRadius: 10,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: const [
                    Text('Emergency Intrusion Alarm', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 15)),
                    Icon(Icons.shield_outlined, color: Colors.white),
                  ],
                ),
                const SizedBox(height: 6),
                const Text(
                  'If an unauthorized visitor forcibly tries to enter without valid OTP clearance, immediately hit the alert button to warn residents and society management.',
                  style: TextStyle(color: Colors.white70, fontSize: 12),
                ),
                const SizedBox(height: 14),
                SizedBox(
                  width: double.infinity,
                  height: 48,
                  child: ElevatedButton.icon(
                    icon: const Icon(Icons.notification_important, color: Colors.white),
                    label: const Text('TRIGGER FORCED ENTRY ALERT', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.red,
                      foregroundColor: Colors.white,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                    ),
                    onPressed: _showForcedEntryDialog,
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(height: 20),

          // VISITORS CURRENTLY INSIDE PREMISES
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Logged Inside Society (${_visitors.length})',
                style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 15),
              ),
              IconButton(
                icon: const Icon(Icons.refresh, color: Colors.blueAccent, size: 20),
                onPressed: () async {
                  final v = await _api.getVisitors();
                  setState(() => _visitors = v);
                },
              ),
            ],
          ),
          const SizedBox(height: 10),

          ..._visitors.map((v) {
            return Container(
              margin: const EdgeInsets.only(bottom: 10),
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: const Color(0xFF1E293B),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: const Color(0xFF334155)),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(v.name, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14)),
                      const SizedBox(height: 3),
                      Text('Unit: ${v.unit} • ${v.visitorType}', style: const TextStyle(color: Color(0xFF94A3B8), fontSize: 12)),
                      if (v.vehicleNumber.isNotEmpty)
                        Text(v.vehicleNumber, style: const TextStyle(color: Color(0xFF64748B), fontSize: 11, fontFamily: 'monospace')),
                    ],
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: const Color(0xFF064E3B),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Text(v.status, style: const TextStyle(color: Colors.greenAccent, fontSize: 11, fontWeight: FontWeight.bold)),
                  ),
                ],
              ),
            );
          }),
        ],
      ),
    );
  }
}
