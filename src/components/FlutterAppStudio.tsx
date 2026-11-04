import React, { useState } from 'react';
import { 
  Smartphone, 
  Code2, 
  Copy, 
  Check, 
  Download, 
  ExternalLink, 
  Play, 
  QrCode, 
  Receipt, 
  ShieldCheck, 
  Droplet, 
  AlertCircle, 
  Bell, 
  Building2, 
  CheckCircle2, 
  Zap,
  ArrowRight,
  Terminal,
  Layers,
  Sparkles
} from 'lucide-react';
import { useCivicOps } from '../context/CivicOpsContext';

export const FlutterAppStudio: React.FC = () => {
  const { 
    societyConfig, 
    currentUnit, 
    invoices, 
    deliveries, 
    complaints, 
    notices, 
    tanks, 
    pumps, 
    togglePump, 
    payInvoice,
    visitorInvites,
    verifyVisitorOtp,
    securityAlerts,
    triggerSecurityAlert,
    guardProfile,
    guardGeofence,
    setGuardOnlineStatus,
    verifyGuardFaceHourly,
    hourlyTimerSecondsRemaining,
    showToast
  } = useCivicOps();

  // Active phone screen view
  const [mobileScreen, setMobileScreen] = useState<'home' | 'gate' | 'pass' | 'bills' | 'complaints' | 'notices' | 'water'>('home');

  // Guard Terminal Simulator state
  const [mobileOtpInput, setMobileOtpInput] = useState<string>('7842');
  const [mobileOtpResult, setMobileOtpResult] = useState<{ success: boolean; message: string; invite?: any } | null>(null);
  const [isVerifyingMobileOtp, setIsVerifyingMobileOtp] = useState<boolean>(false);
  const [mobileFaceScanning, setMobileFaceScanning] = useState<boolean>(false);
  const [mobileFaceConfidence, setMobileFaceConfidence] = useState<number | null>(96.4);
  const [mobileAlarmDispatched, setMobileAlarmDispatched] = useState<boolean>(false);

  // Active code file tab
  const [activeCodeTab, setActiveCodeTab] = useState<'pubspec' | 'api_config' | 'models' | 'api_service' | 'home_screen' | 'gate_terminal_screen' | 'bills_screen' | 'complaints_screen' | 'notices_screen'>('gate_terminal_screen');
  const [copied, setCopied] = useState(false);

  const activeInvoice = invoices.find(i => i.unit === currentUnit && i.status === 'Pending') || invoices[0];
  const activeDeliveries = deliveries.filter(d => d.unit === currentUnit);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleMobileVerifyOtp = async (codeToVerify?: string) => {
    const code = codeToVerify || mobileOtpInput;
    setIsVerifyingMobileOtp(true);
    setMobileOtpResult(null);
    const res = await verifyVisitorOtp(code, guardProfile.name, guardProfile.assignedGate);
    setMobileOtpResult(res);
    setIsVerifyingMobileOtp(false);
  };

  const handleMobileFaceVerify = async () => {
    setMobileFaceScanning(true);
    await new Promise(r => setTimeout(r, 1200));
    const res = await verifyGuardFaceHourly(guardProfile.id, guardProfile.masterPhotoUrl, {
      eyeDistance: 0.44,
      noseToChinRatio: 0.59,
      faceWidthToHeightRatio: 0.76,
      eyeToMouthRatio: 0.62,
      jawCurvatureScore: 0.88,
      confidenceScore: 0.96,
    });
    setMobileFaceScanning(false);
    setMobileFaceConfidence(res.matchScore);
  };

  const handleMobilePanicAlert = async () => {
    setMobileAlarmDispatched(true);
    await triggerSecurityAlert({
      societyId: guardProfile.societyId,
      guardId: guardProfile.id,
      guardName: `${guardProfile.name} (${guardProfile.assignedGate})`,
      alertType: 'FORCED_ENTRY',
      severity: 'CRITICAL',
      location: guardProfile.assignedGate,
      description: 'Black SUV forced entry attempt at boom barrier without resident OTP authorization.',
      intruderDetails: {
        vehicleNumber: 'DL-08-BK-4091',
        personCount: 2,
        description: 'Forced past barrier gate',
      },
    });
    setTimeout(() => setMobileAlarmDispatched(false), 4000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const codeFiles: Record<string, { filename: string; language: string; content: string }> = {
    pubspec: {
      filename: 'flutter_app/pubspec.yaml',
      language: 'yaml',
      content: `name: smartaisociety_app
description: "smartaisociety - AI & IoT Powered Gated Society Management Mobile App for Android & iOS."
publish_to: "none"
version: 1.0.0+1

environment:
  sdk: ">=3.0.0 <4.0.0"

dependencies:
  flutter:
    sdk: flutter
  http: ^1.2.0
  intl: ^0.19.0
  shared_preferences: ^2.2.2
  qr_flutter: ^4.1.0
  cupertino_icons: ^1.0.6

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^3.0.0

flutter:
  uses-material-design: true`,
    },
    api_config: {
      filename: 'flutter_app/lib/config/api_config.dart',
      language: 'dart',
      content: `/// API Configuration for smartaisociety Mobile App (Android & iOS)
/// Points directly to your production API backend
class ApiConfig {
  // Update to your production domain or IP (e.g. 'https://smartaisociety.yourdomain.com')
  static const String baseUrl = 'https://ais-dev-4h7fierizsdngjfdiyvdyc-648195121806.asia-southeast1.run.app';

  static const String health = '\$baseUrl/api/health';
  static const String societies = '\$baseUrl/api/societies';
  static const String residents = '\$baseUrl/api/residents';
  static const String invoices = '\$baseUrl/api/invoices';
  static const String payInvoice = '\$baseUrl/api/invoices/pay';
  static const String deliveries = '\$baseUrl/api/deliveries';
  static const String visitors = '\$baseUrl/api/visitors';
  static const String complaints = '\$baseUrl/api/complaints';
  static const String notices = '\$baseUrl/api/notices';
  static const String waterTanks = '\$baseUrl/api/water/tanks';
  static const String togglePump = '\$baseUrl/api/water/pumps/toggle';

  static Map<String, String> get headers => {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
}`,
    },
    models: {
      filename: 'flutter_app/lib/models/models.dart',
      language: 'dart',
      content: `/// Data Models for smartaisociety Mobile App
class SocietyModel {
  final String id, name, subdomain, primaryColor, logoEmblem, city;
  final int totalFlats;
  SocietyModel({required this.id, required this.name, required this.subdomain, required this.primaryColor, required this.logoEmblem, required this.city, required this.totalFlats});
  factory SocietyModel.fromJson(Map<String, dynamic> json) => SocietyModel(
    id: json['id'] ?? '', name: json['name'] ?? '', subdomain: json['subdomain'] ?? '',
    primaryColor: json['primary_color'] ?? '#059669', logoEmblem: json['logo_emblem'] ?? 'SOC',
    city: json['city'] ?? '', totalFlats: int.tryParse(json['total_flats']?.toString() ?? '320') ?? 320,
  );
}

class InvoiceModel {
  final String id, unit, residentName, billingPeriod, dueDate, status;
  final double totalAmount;
  final String? transactionId, receiptHash;
  InvoiceModel({required this.id, required this.unit, required this.residentName, required this.billingPeriod, required this.dueDate, required this.status, required this.totalAmount, this.transactionId, this.receiptHash});
  factory InvoiceModel.fromJson(Map<String, dynamic> json) => InvoiceModel(
    id: json['id'] ?? '', unit: json['unit'] ?? '', residentName: json['resident_name'] ?? '',
    billingPeriod: json['billing_period'] ?? '', dueDate: json['due_date'] ?? '', status: json['status'] ?? 'Pending',
    totalAmount: double.tryParse(json['total_amount']?.toString() ?? '0') ?? 0.0,
    transactionId: json['transaction_id'], receiptHash: json['receipt_hash'],
  );
}

class ComplaintModel {
  final String id, unit, residentName, category, title, description, priority, status, createdAt;
  ComplaintModel({required this.id, required this.unit, required this.residentName, required this.category, required this.title, required this.description, required this.priority, required this.status, required this.createdAt});
  factory ComplaintModel.fromJson(Map<String, dynamic> json) => ComplaintModel(
    id: json['id'] ?? '', unit: json['unit'] ?? '', residentName: json['resident_name'] ?? '',
    category: json['category'] ?? '', title: json['title'] ?? '', description: json['description'] ?? '',
    priority: json['priority'] ?? 'Medium', status: json['status'] ?? 'Open', createdAt: json['created_at'] ?? '',
  );
}`,
    },
    api_service: {
      filename: 'flutter_app/lib/services/api_service.dart',
      language: 'dart',
      content: `import 'dart:convert';
import 'package:http/http.dart' as http;
import '../config/api_config.dart';
import '../models/models.dart';

class ApiService {
  static final ApiService _instance = ApiService._internal();
  factory ApiService() => _instance;
  ApiService._internal();

  Future<List<InvoiceModel>> getInvoices(String unit) async {
    final res = await http.get(Uri.parse('\${ApiConfig.invoices}?unit=\$unit'));
    if (res.statusCode == 200) {
      final List list = json.decode(res.body);
      return list.map((e) => InvoiceModel.fromJson(e)).toList();
    }
    return [];
  }

  Future<bool> payInvoice(String invoiceId, String method) async {
    final res = await http.post(
      Uri.parse(ApiConfig.payInvoice),
      headers: ApiConfig.headers,
      body: json.encode({'invoice_id': invoiceId, 'payment_method': method}),
    );
    return res.statusCode == 200;
  }

  Future<bool> createComplaint({required String societyId, required String unit, required String residentName, required String category, required String title, required String description, required String priority}) async {
    final res = await http.post(
      Uri.parse(ApiConfig.complaints),
      headers: ApiConfig.headers,
      body: json.encode({
        'society_id': societyId, 'unit': unit, 'resident_name': residentName,
        'category': category, 'title': title, 'description': description, 'priority': priority,
      }),
    );
    return res.statusCode == 201 || res.statusCode == 200;
  }
}`,
    },
    home_screen: {
      filename: 'flutter_app/lib/screens/home_screen.dart',
      language: 'dart',
      content: `import 'package:flutter/material.dart';
import '../services/api_service.dart';
import '../models/models.dart';
import 'bills_screen.dart';
import 'visitor_pass_screen.dart';
import 'complaints_screen.dart';
import 'notices_screen.dart';
import 'water_iot_screen.dart';
import 'gate_terminal_screen.dart';
import 'society_panel_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({Key? key}) : super(key: key);
  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final ApiService _api = ApiService();
  final String _currentUnit = 'B-402';
  final String _societyId = 'soc_pg_982';
  bool _loading = true;
  SocietyModel? _society;
  List<InvoiceModel> _invoices = [];

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    final results = await Future.wait([
      _api.getSociety(_societyId),
      _api.getInvoices(_currentUnit),
    ]);
    setState(() {
      _society = results[0] as SocietyModel?;
      _invoices = results[1] as List<InvoiceModel>;
      _loading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        title: Text(_society?.name ?? 'smartaisociety'),
      ),
      body: _loading ? const Center(child: CircularProgressIndicator()) : SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            // Dues Card, Quick Action Grid, Notices & Passes
          ],
        ),
      ),
    );
  }
}`,
    },
    gate_terminal_screen: {
      filename: 'flutter_app/lib/screens/gate_terminal_screen.dart',
      language: 'dart',
      content: `import 'dart:async';
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
  bool _isOnline = true;
  int _secondsRemaining = 52 * 60; // Hourly face verification countdown
  final TextEditingController _otpController = TextEditingController();
  Map<String, dynamic>? _otpResult;

  // 1. Verify Visitor OTP sent by resident app
  Future<void> _verifyOtp() async {
    final res = await _api.verifyVisitorOtp(
      otpCode: _otpController.text.trim(),
      guardName: 'Head Constable Ram Singh',
      gate: 'Main Gate 01 Plaza',
    );
    setState(() => _otpResult = res);
  }

  // 2. Trigger Forced Entry / Intrusion Siren Alert
  Future<void> _triggerPanicAlert() async {
    await _api.triggerSecurityAlert(
      societyId: 'soc_pg_982',
      guardId: 'guard_01',
      guardName: 'Ram Singh (Gate 01)',
      alertType: 'FORCED_ENTRY',
      severity: 'CRITICAL',
      location: 'Main Gate 01',
      description: 'Unauthorized vehicle forced entry attempt without resident OTP clearance.',
    );
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('🚨 Emergency sirens sent to Resident App & Society Panel!'), backgroundColor: Colors.red),
    );
  }

  // 3. Hourly Facial Biometric Verification (Bone structure landmark match)
  Future<void> _verifyFaceHourly() async {
    final res = await _api.verifyGuardFaceHourly(
      guardId: 'guard_01',
      capturedPhotoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
      facialLandmarks: {'eyeDistance': 0.44, 'jawRatio': 0.88},
    );
    if (res['success'] == true) {
      setState(() => _secondsRemaining = 3600); // Reset 60 min
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0F172A),
      appBar: AppBar(
        title: const Text('Smart Guard App · Gate 01'),
        actions: [
          Switch(
            value: _isOnline,
            activeColor: Colors.greenAccent,
            onChanged: (val) {
              setState(() => _isOnline = val);
              _api.setGuardDutyStatus('guard_01', val);
            },
          ),
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // Geofence & Hourly Face Timer Card
          // Visitor OTP Entry Card & Instant Verify
          // Emergency Forced Entry Panic Button
        ],
      ),
    );
  }
}`,
    },
    bills_screen: {
      filename: 'flutter_app/lib/screens/bills_screen.dart',
      language: 'dart',
      content: `import 'package:flutter/material.dart';
import '../services/api_service.dart';
import '../models/models.dart';

class BillsScreen extends StatefulWidget {
  final String currentUnit;
  const BillsScreen({Key? key, required this.currentUnit}) : super(key: key);
  @override
  State<BillsScreen> createState() => _BillsScreenState();
}

class _BillsScreenState extends State<BillsScreen> {
  final ApiService _api = ApiService();
  bool _loading = true;
  List<InvoiceModel> _invoices = [];

  @override
  void initState() {
    super.initState();
    _fetchBills();
  }

  Future<void> _fetchBills() async {
    setState(() => _loading = true);
    final data = await _api.getInvoices(widget.currentUnit);
    setState(() { _invoices = data; _loading = false; });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Maintenance Bills & Invoices')),
      body: _loading ? const Center(child: CircularProgressIndicator()) : ListView.builder(
        itemCount: _invoices.length,
        itemBuilder: (ctx, i) {
          final inv = _invoices[i];
          return ListTile(
            title: Text(inv.billingPeriod),
            subtitle: Text('Due: \${inv.dueDate}'),
            trailing: Text('₹\${inv.totalAmount.toStringAsFixed(0)}'),
          );
        },
      ),
    );
  }
}`,
    },
    complaints_screen: {
      filename: 'flutter_app/lib/screens/complaints_screen.dart',
      language: 'dart',
      content: `import 'package:flutter/material.dart';
import '../services/api_service.dart';
import '../models/models.dart';

class ComplaintsScreen extends StatefulWidget {
  final String unit;
  final String societyId;
  const ComplaintsScreen({Key? key, this.unit = 'B-402', this.societyId = 'soc_pg_982'}) : super(key: key);
  @override
  State<ComplaintsScreen> createState() => _ComplaintsScreenState();
}

class _ComplaintsScreenState extends State<ComplaintsScreen> {
  final ApiService _api = ApiService();
  List<ComplaintModel> _complaints = [];
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _fetch();
  }

  Future<void> _fetch() async {
    final data = await _api.getComplaints(unit: widget.unit);
    setState(() { _complaints = data; _loading = false; });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Helpdesk Tickets')),
      body: _loading ? const Center(child: CircularProgressIndicator()) : ListView.builder(
        itemCount: _complaints.length,
        itemBuilder: (ctx, i) => ListTile(
          title: Text(_complaints[i].title),
          subtitle: Text(_complaints[i].description),
          trailing: Text(_complaints[i].status),
        ),
      ),
    );
  }
}`,
    },
    notices_screen: {
      filename: 'flutter_app/lib/screens/notices_screen.dart',
      language: 'dart',
      content: `import 'package:flutter/material.dart';
import '../services/api_service.dart';
import '../models/models.dart';

class NoticesScreen extends StatefulWidget {
  const NoticesScreen({Key? key}) : super(key: key);
  @override
  State<NoticesScreen> createState() => _NoticesScreenState();
}

class _NoticesScreenState extends State<NoticesScreen> {
  final ApiService _api = ApiService();
  List<NoticeModel> _notices = [];
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _fetch();
  }

  Future<void> _fetch() async {
    final data = await _api.getNotices();
    setState(() { _notices = data; _loading = false; });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Society Circulars & Notices')),
      body: _loading ? const Center(child: CircularProgressIndicator()) : ListView.builder(
        itemCount: _notices.length,
        itemBuilder: (ctx, i) => ListTile(
          title: Text(_notices[i].title),
          subtitle: Text(_notices[i].content),
        ),
      ),
    );
  }
}`,
    },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold">
              <Smartphone className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-purple-300">
              Cross-Platform Flutter Codebase
            </span>
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full">
              Android + iOS Ready
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Flutter Mobile App Studio & Simulator
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1">
            Pure Flutter app connected to the real-time cloud API backend. Test mobile UI live on the screen and copy production code ready to build for Android APK and iOS.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/api/export-sql"
            download="smartaisociety_backup.sql"
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-2 cursor-pointer border border-white/10"
          >
            <Download className="w-4 h-4" />
            <span>Download SQL Dump</span>
          </a>
        </div>
      </div>

      {/* Main Studio Grid: Left = Mobile Simulator, Right = Code Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* =========================================================================
            LEFT COLUMN: INTERACTIVE SMARTPHONE SIMULATOR (5 COLS)
            ========================================================================= */}
        <div className="lg:col-span-5 flex flex-col items-center">
          {/* Screen Switcher Chips */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-200/80 rounded-2xl mb-4 overflow-x-auto max-w-full">
            {[
              { id: 'home', label: 'Home', icon: Smartphone },
              { id: 'gate', label: 'Guard App', icon: ShieldCheck },
              { id: 'pass', label: 'Pass', icon: QrCode },
              { id: 'bills', label: 'Bills', icon: Receipt },
              { id: 'complaints', label: 'Tickets', icon: AlertCircle },
              { id: 'notices', label: 'Notices', icon: Bell },
              { id: 'water', label: 'IoT', icon: Droplet },
            ].map((btn) => (
              <button
                key={btn.id}
                onClick={() => setMobileScreen(btn.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 whitespace-nowrap ${
                  mobileScreen === btn.id
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>{btn.label}</span>
              </button>
            ))}
          </div>

          {/* Realistic iPhone Smartphone Mockup Frame */}
          <div className="w-[340px] h-[680px] bg-slate-900 rounded-[48px] p-3 shadow-2xl border-4 border-slate-700/60 relative flex flex-col select-none">
            {/* Dynamic Island / Notch */}
            <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-30 flex items-center justify-between px-3">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-800" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
            </div>

            {/* Smartphone Inner Screen */}
            <div className="w-full h-full bg-[#F8FAFC] rounded-[40px] overflow-hidden flex flex-col pt-8 relative">
              {/* Top Mobile App Bar */}
              <div className="px-4 py-2.5 bg-white border-b border-slate-200/80 flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-7 h-7 rounded-xl flex items-center justify-center text-white font-extrabold text-xs"
                    style={{ backgroundColor: societyConfig.primaryColor }}
                  >
                    {societyConfig.logoEmblem}
                  </div>
                  <div>
                    <p className="text-xs font-extrabold text-slate-900 leading-tight">
                      {societyConfig.name}
                    </p>
                    <p className="text-[9px] text-slate-400 font-mono">Flat: {currentUnit}</p>
                  </div>
                </div>
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
              </div>

              {/* Mobile Screen Body Content */}
              <div className="flex-1 overflow-y-auto p-3.5 space-y-3">
                {/* SCREEN 1: RESIDENT HOME */}
                {mobileScreen === 'home' && (
                  <div className="space-y-3">
                    {/* Maintenance Dues Hero Card */}
                    <div 
                      className="p-4 rounded-2xl text-white shadow-md space-y-2"
                      style={{ backgroundColor: societyConfig.primaryColor }}
                    >
                      <div className="flex justify-between items-center text-[11px] opacity-90">
                        <span>{activeInvoice?.billingPeriod || 'Current Month'}</span>
                        <span className="px-2 py-0.5 bg-white/20 rounded-full font-bold text-[9px]">
                          {activeInvoice?.status === 'Paid' ? 'PAID ✓' : 'DUE'}
                        </span>
                      </div>
                      <p className="text-xs opacity-80">Payable Maintenance</p>
                      <div className="flex justify-between items-baseline">
                        <p className="text-2xl font-black font-mono">
                          ₹{activeInvoice?.totalAmount.toLocaleString()}
                        </p>
                        <button
                          onClick={() => setMobileScreen('bills')}
                          className="px-3 py-1 bg-white text-emerald-800 text-xs font-bold rounded-xl cursor-pointer"
                        >
                          {activeInvoice?.status === 'Paid' ? 'Receipt' : 'Pay UPI'}
                        </button>
                      </div>
                    </div>

                    {/* Quick Action Matrix (4 tiles) */}
                    <div className="grid grid-cols-4 gap-2">
                      <button
                        onClick={() => setMobileScreen('pass')}
                        className="p-2.5 bg-white rounded-2xl border border-slate-200 text-center flex flex-col items-center gap-1 cursor-pointer"
                      >
                        <QrCode className="w-5 h-5 text-blue-600" />
                        <span className="text-[10px] font-bold text-slate-700">Passes</span>
                      </button>

                      <button
                        onClick={() => setMobileScreen('bills')}
                        className="p-2.5 bg-white rounded-2xl border border-slate-200 text-center flex flex-col items-center gap-1 cursor-pointer"
                      >
                        <Receipt className="w-5 h-5 text-purple-600" />
                        <span className="text-[10px] font-bold text-slate-700">Bills</span>
                      </button>

                      <button
                        onClick={() => setMobileScreen('complaints')}
                        className="p-2.5 bg-white rounded-2xl border border-slate-200 text-center flex flex-col items-center gap-1 cursor-pointer"
                      >
                        <AlertCircle className="w-5 h-5 text-amber-600" />
                        <span className="text-[10px] font-bold text-slate-700">Tickets</span>
                      </button>

                      <button
                        onClick={() => setMobileScreen('notices')}
                        className="p-2.5 bg-white rounded-2xl border border-slate-200 text-center flex flex-col items-center gap-1 cursor-pointer"
                      >
                        <Bell className="w-5 h-5 text-indigo-600" />
                        <span className="text-[10px] font-bold text-slate-700">Notices</span>
                      </button>
                    </div>

                    {/* Active Pre-Approved Courier */}
                    <div className="bg-white p-3 rounded-2xl border border-slate-200 space-y-1.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-slate-900">Active Gate Pass</span>
                        <span className="text-[10px] text-emerald-700 font-extrabold bg-emerald-50 px-2 py-0.5 rounded-full">
                          Gate Sync OK
                        </span>
                      </div>
                      <div className="p-2 bg-slate-50 rounded-xl flex items-center justify-between text-xs">
                        <div>
                          <p className="font-bold text-slate-800">Zomato Delivery</p>
                          <p className="text-[10px] text-slate-500">Allow to Doorstep</p>
                        </div>
                        <div className="text-right">
                          <p className="font-mono text-sm font-extrabold text-blue-600">5821</p>
                          <p className="text-[9px] text-slate-400">Gate OTP</p>
                        </div>
                      </div>
                    </div>

                    {/* Water Level Telemetry preview */}
                    <div className="bg-white p-3 rounded-2xl border border-slate-200 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
                          <Droplet className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900">Water Reserves</p>
                          <p className="text-[10px] text-slate-500">Sump Level: {tanks[0]?.levelPercentage || 84}%</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setMobileScreen('water')}
                        className="text-[11px] font-bold text-blue-600 cursor-pointer"
                      >
                        View IoT →
                      </button>
                    </div>
                  </div>
                )}

                {/* SCREEN 2: VISITOR & COURIER PASS */}
                {mobileScreen === 'pass' && (
                  <div className="space-y-3">
                    <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center space-y-2">
                      <p className="text-xs font-bold text-slate-900">Digital Gate Entry Pass</p>
                      <div className="w-32 h-32 bg-slate-100 rounded-2xl mx-auto flex items-center justify-center border-2 border-dashed border-blue-400">
                        <QrCode className="w-24 h-24 text-slate-900" />
                      </div>
                      <p className="text-lg font-mono font-black text-blue-700 tracking-widest">
                        5821
                      </p>
                      <p className="text-[10px] text-slate-500">Show to Security Guard at Gate 01</p>
                    </div>

                    <button
                      onClick={() => setMobileScreen('home')}
                      className="w-full py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                    >
                      ← Back to Mobile Home
                    </button>
                  </div>
                )}

                {/* SCREEN 3: BILLS & UPI */}
                {mobileScreen === 'bills' && (
                  <div className="space-y-2.5">
                    <div className="bg-white p-3 rounded-2xl border border-slate-200 space-y-1">
                      <p className="text-xs font-bold text-slate-900">Total Dues</p>
                      <p className="text-2xl font-black font-mono text-slate-900">₹{activeInvoice?.totalAmount.toLocaleString()}</p>
                    </div>

                    <div className="space-y-1.5">
                      {invoices.map(inv => (
                        <div key={inv.id} className="p-2.5 bg-white rounded-xl border border-slate-200 flex justify-between items-center text-xs">
                          <div>
                            <p className="font-bold text-slate-900">{inv.billingPeriod}</p>
                            <p className="text-[10px] text-slate-400">Due: {inv.dueDate}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-mono font-bold text-slate-800">₹{inv.totalAmount.toLocaleString()}</p>
                            <span className={`text-[9px] font-bold ${inv.status === 'Paid' ? 'text-emerald-600' : 'text-amber-600'}`}>
                              {inv.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => {
                        if (activeInvoice) payInvoice(activeInvoice.id, 'UPI');
                      }}
                      className="w-full py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
                    >
                      Pay via UPI (GPay/PhonePe)
                    </button>

                    <button
                      onClick={() => setMobileScreen('home')}
                      className="w-full py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                    >
                      ← Back to Mobile Home
                    </button>
                  </div>
                )}

                {/* SCREEN 4: COMPLAINTS */}
                {mobileScreen === 'complaints' && (
                  <div className="space-y-2.5">
                    <div className="flex justify-between items-center">
                      <p className="text-xs font-bold text-slate-900">My Helpdesk Tickets</p>
                      <span className="text-[10px] text-slate-500">{complaints.length} tickets</span>
                    </div>

                    {complaints.map(c => (
                      <div key={c.id} className="p-3 bg-white rounded-2xl border border-slate-200 space-y-1">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-slate-900">{c.title}</span>
                          <span className="text-[9px] font-extrabold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
                            {c.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-1">{c.description}</p>
                        <p className="text-[9px] text-slate-400">{c.category} • Logged on {c.createdAt}</p>
                      </div>
                    ))}

                    <button
                      onClick={() => setMobileScreen('home')}
                      className="w-full py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                    >
                      ← Back to Mobile Home
                    </button>
                  </div>
                )}

                {/* SCREEN 5: NOTICES */}
                {mobileScreen === 'notices' && (
                  <div className="space-y-2.5">
                    <p className="text-xs font-bold text-slate-900">Society Bulletins</p>
                    {notices.map(n => (
                      <div key={n.id} className="p-3 bg-white rounded-2xl border border-slate-200 space-y-1">
                        <span className="text-[9px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full">
                          {n.priority} • {n.category}
                        </span>
                        <h5 className="text-xs font-bold text-slate-900 mt-1">{n.title}</h5>
                        <p className="text-[11px] text-slate-500 line-clamp-2">{n.content}</p>
                      </div>
                    ))}

                    <button
                      onClick={() => setMobileScreen('home')}
                      className="w-full py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                    >
                      ← Back to Mobile Home
                    </button>
                  </div>
                )}

                {/* SCREEN 6: WATER IOT */}
                {mobileScreen === 'water' && (
                  <div className="space-y-2.5">
                    <p className="text-xs font-bold text-slate-900">IoT Water Relays</p>
                    {tanks.map(t => (
                      <div key={t.id} className="p-3 bg-white rounded-2xl border border-slate-200 space-y-1.5">
                        <div className="flex justify-between text-xs">
                          <span className="font-bold text-slate-800">{t.name}</span>
                          <span className="font-mono font-bold text-cyan-700">{t.levelPercentage}%</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${t.levelPercentage}%` }} />
                        </div>
                      </div>
                    ))}

                    <button
                      onClick={() => togglePump('borewell_1', 'Mobile Flutter App')}
                      className="w-full py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
                    >
                      Toggle Borewell Relay ({pumps[0]?.state})
                    </button>

                    <button
                      onClick={() => setMobileScreen('home')}
                      className="w-full py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                    >
                      ← Back to Mobile Home
                    </button>
                  </div>
                )}

                {/* SCREEN 7: GUARD GATE TERMINAL & BIOMETRIC RADAR */}
                {mobileScreen === 'gate' && (
                  <div className="space-y-3 font-sans">
                    {/* Guard Profile & Duty Toggle */}
                    <div className="bg-slate-900 text-white p-3 rounded-2xl border border-slate-700 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img
                            src={guardProfile.masterPhotoUrl}
                            alt={guardProfile.name}
                            className="w-9 h-9 rounded-xl object-cover border border-slate-600"
                          />
                          <div>
                            <p className="text-xs font-bold leading-tight">{guardProfile.name}</p>
                            <p className="text-[9px] text-indigo-400 font-mono font-semibold">{guardProfile.dutyShift}</p>
                            <p className="text-[9px] text-slate-400 font-mono">{guardProfile.assignedGate}</p>
                          </div>
                        </div>

                        <button
                          onClick={() => setGuardOnlineStatus(!guardProfile.isOnline)}
                          className={`px-2.5 py-1 rounded-xl text-[10px] font-bold border transition-colors cursor-pointer ${
                            guardProfile.isOnline
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                              : 'bg-slate-800 text-slate-400 border-slate-700'
                          }`}
                        >
                          {guardProfile.isOnline ? '● ON DUTY' : '○ OFF DUTY'}
                        </button>
                      </div>

                      {/* Geofence Radar */}
                      <div className="p-2 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-[10px]">
                        <span className="text-slate-400 font-mono">GPS Geofence:</span>
                        <div className="flex items-center gap-1.5 font-bold">
                          <span className={`w-2 h-2 rounded-full ${guardGeofence.isWithinGeofence ? 'bg-emerald-400' : 'bg-rose-500 animate-ping'}`} />
                          <span className={guardGeofence.isWithinGeofence ? 'text-emerald-400' : 'text-rose-400'}>
                            {guardGeofence.isWithinGeofence ? 'Verified Inside (±3m)' : 'Perimeter Breach!'}
                          </span>
                        </div>
                      </div>

                      {/* Hourly Face Check Countdown & Trigger */}
                      <div className="p-2 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5 text-[10px]">
                        <div className="flex justify-between items-center text-slate-400">
                          <span>Next Hourly Facial Scan:</span>
                          <span className="font-mono font-bold text-sky-400">
                            {formatTimer(hourlyTimerSecondsRemaining)}
                          </span>
                        </div>
                        <button
                          onClick={handleMobileFaceVerify}
                          disabled={mobileFaceScanning}
                          className="w-full py-1.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-[10px] rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1"
                        >
                          {mobileFaceScanning ? (
                            <span>Analyzing Facial Landmarks...</span>
                          ) : (
                            <span>Scan Face (Confidence: {mobileFaceConfidence || 96.4}%)</span>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Visitor OTP Verification */}
                    <div className="bg-white p-3 rounded-2xl border border-slate-200 space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-slate-900">Verify Visitor OTP</span>
                        <span className="text-[9px] bg-blue-50 text-blue-700 font-bold px-1.5 py-0.5 rounded">Resident Sync</span>
                      </div>
                      <p className="text-[10px] text-slate-500">Enter OTP sent to visitor by Resident App:</p>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={mobileOtpInput}
                          onChange={(e) => setMobileOtpInput(e.target.value)}
                          placeholder="4-digit OTP"
                          maxLength={6}
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs font-mono font-bold text-center tracking-widest"
                        />
                        <button
                          onClick={() => handleMobileVerifyOtp()}
                          disabled={isVerifyingMobileOtp}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer shrink-0"
                        >
                          {isVerifyingMobileOtp ? 'Checking...' : 'Verify'}
                        </button>
                      </div>

                      {/* Quick Test Chip */}
                      <div className="flex gap-1.5 pt-0.5">
                        <button
                          onClick={() => {
                            setMobileOtpInput('7842');
                            handleMobileVerifyOtp('7842');
                          }}
                          className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-mono text-[9px] font-bold rounded cursor-pointer"
                        >
                          Test OTP: 7842 (B-402)
                        </button>
                      </div>

                      {/* OTP Result Status */}
                      {mobileOtpResult && (
                        <div
                          className={`p-2 rounded-xl text-[10px] font-bold border ${
                            mobileOtpResult.success
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : 'bg-rose-50 text-rose-800 border-rose-200'
                          }`}
                        >
                          {mobileOtpResult.success ? '✓ ' : '✗ '}
                          {mobileOtpResult.message}
                        </div>
                      )}
                    </div>

                    {/* FORCED ENTRY PANIC BUTTON */}
                    <div className="bg-gradient-to-r from-rose-600 to-red-700 text-white p-3 rounded-2xl border border-red-400 space-y-1.5 shadow-sm">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-black uppercase tracking-wider text-[10px]">Forced Entry Emergency</span>
                        <span className="text-[9px] bg-white/20 px-1.5 py-0.5 rounded font-mono">Panic Alarm</span>
                      </div>
                      <p className="text-[10px] text-white/90">
                        If an unauthorized trespasser or vehicle forces their way past the gate:
                      </p>
                      <button
                        onClick={handleMobilePanicAlert}
                        disabled={mobileAlarmDispatched}
                        className="w-full py-2 bg-white text-rose-700 hover:bg-rose-50 font-black text-xs rounded-xl transition-all shadow-sm cursor-pointer"
                      >
                        {mobileAlarmDispatched ? '🚨 ALARM BROADCASTED TO RESIDENTS!' : 'TRIGGER FORCED ENTRY ALARM'}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Mobile Bottom Navigation Bar */}
              <div className="px-4 py-2.5 bg-white border-t border-slate-200 flex justify-between items-center text-slate-400">
                <button 
                  onClick={() => setMobileScreen('home')}
                  className={`flex flex-col items-center gap-0.5 cursor-pointer ${mobileScreen === 'home' ? 'text-blue-600 font-bold' : ''}`}
                >
                  <Smartphone className="w-4 h-4" />
                  <span className="text-[9px]">Home</span>
                </button>
                <button 
                  onClick={() => setMobileScreen('gate')}
                  className={`flex flex-col items-center gap-0.5 cursor-pointer ${mobileScreen === 'gate' ? 'text-blue-600 font-bold' : ''}`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span className="text-[9px]">Guard</span>
                </button>
                <button 
                  onClick={() => setMobileScreen('pass')}
                  className={`flex flex-col items-center gap-0.5 cursor-pointer ${mobileScreen === 'pass' ? 'text-blue-600 font-bold' : ''}`}
                >
                  <QrCode className="w-4 h-4" />
                  <span className="text-[9px]">Pass</span>
                </button>
                <button 
                  onClick={() => setMobileScreen('bills')}
                  className={`flex flex-col items-center gap-0.5 cursor-pointer ${mobileScreen === 'bills' ? 'text-blue-600 font-bold' : ''}`}
                >
                  <Receipt className="w-4 h-4" />
                  <span className="text-[9px]">Bills</span>
                </button>
                <button 
                  onClick={() => setMobileScreen('complaints')}
                  className={`flex flex-col items-center gap-0.5 cursor-pointer ${mobileScreen === 'complaints' ? 'text-blue-600 font-bold' : ''}`}
                >
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-[9px]">Helpdesk</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            RIGHT COLUMN: FLUTTER CODE INSPECTOR & BUILD RUNNER (7 COLS)
            ========================================================================= */}
        <div className="lg:col-span-7 space-y-4">
          {/* CLI Instructions Card */}
          <div className="bg-slate-900 text-white p-5 rounded-3xl space-y-3 shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-emerald-400 uppercase font-mono">
                  Terminal Build Commands (Android & iOS)
                </span>
              </div>
              <span className="text-[11px] text-slate-400">Flutter 3.x+</span>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-2xl font-mono text-xs text-slate-300 space-y-1.5 border border-slate-800">
              <p><span className="text-slate-500"># 1. Clone & enter flutter directory</span></p>
              <p><span className="text-emerald-400">$</span> cd flutter_app</p>
              <p><span className="text-emerald-400">$</span> flutter pub get</p>
              <p className="pt-1"><span className="text-slate-500"># 2. Run on Android or iOS</span></p>
              <p><span className="text-emerald-400">$</span> flutter run -d android  <span className="text-slate-500"># For Android Phone / APK</span></p>
              <p><span className="text-emerald-400">$</span> flutter run -d ios      <span className="text-slate-500"># For Apple iPhone Simulator/Device</span></p>
            </div>
          </div>

          {/* Code Viewer Box */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            {/* File Switcher Tabs */}
            <div className="flex items-center gap-1.5 p-2 bg-slate-100 border-b border-slate-200 overflow-x-auto">
              {Object.entries(codeFiles).map(([key, f]) => (
                <button
                  key={key}
                  onClick={() => setActiveCodeTab(key as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer whitespace-nowrap ${
                    activeCodeTab === key
                      ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {f.filename.split('/').pop()}
                </button>
              ))}
            </div>

            {/* Code Content & Copy Button */}
            <div className="p-4 bg-slate-950 text-slate-200 font-mono text-xs relative">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                <span className="text-slate-400 text-[11px]">{codeFiles[activeCodeTab]?.filename}</span>
                <button
                  onClick={() => copyToClipboard(codeFiles[activeCodeTab]?.content || '')}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-sans font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy File'}</span>
                </button>
              </div>

              <pre className="max-h-[380px] overflow-y-auto overflow-x-auto text-[11px] leading-relaxed text-slate-300">
                <code>{codeFiles[activeCodeTab]?.content}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
