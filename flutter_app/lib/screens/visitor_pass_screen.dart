import 'package:flutter/material.dart';
import 'package:qr_flutter/qr_flutter.dart';
import '../services/api_service.dart';
import '../models/models.dart';

class VisitorPassScreen extends StatefulWidget {
  final String currentUnit;
  final String societyId;
  const VisitorPassScreen({Key? key, required this.currentUnit, required this.societyId}) : super(key: key);

  @override
  State<VisitorPassScreen> createState() => _VisitorPassScreenState();
}

class _VisitorPassScreenState extends State<VisitorPassScreen> {
  final ApiService _api = ApiService();
  bool _loading = true;
  List<DeliveryModel> _deliveries = [];

  String _carrier = 'Zomato';
  String _passcode = '5821';
  String _permission = 'Allow to Doorstep';
  final TextEditingController _notesController = TextEditingController(text: 'Food parcel. Ring bell once.');

  @override
  void initState() {
    super.initState();
    _fetchDeliveries();
  }

  Future<void> _fetchDeliveries() async {
    setState(() => _loading = true);
    final list = await _api.getDeliveries(widget.currentUnit);
    setState(() {
      _deliveries = list;
      _loading = false;
    });
  }

  Future<void> _submitPreApproval() async {
    final success = await _api.preApproveDelivery(
      societyId: widget.societyId,
      unit: widget.currentUnit,
      carrier: _carrier,
      passcode: _passcode,
      permission: _permission,
      notes: _notesController.text,
    );

    if (success) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('✓ $_carrier Passcode #$_passcode synced to Gatehouse!'),
          backgroundColor: Colors.green,
        ),
      );
      Navigator.pop(context);
    }
  }

  void _openCreateVisitorOtpModal() {
    final nameCtrl = TextEditingController(text: 'Ananya Sharma');
    final phoneCtrl = TextEditingController(text: '+91 98450 77112');
    String otpCode = (1000 + (DateTime.now().millisecond * 9) % 8999).toString();
    String visitorType = 'Guest';

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (ctx) {
        return StatefulBuilder(
          builder: (ctx, setModalState) {
            return Padding(
              padding: EdgeInsets.only(
                bottom: MediaQuery.of(ctx).viewInsets.bottom + 20,
                left: 20,
                right: 20,
                top: 20,
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text('Visitor Entry Pass (OTP)', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(color: const Color(0xFFD1FAE5), borderRadius: BorderRadius.circular(8)),
                        child: const Text('GATE VERIFIED', style: TextStyle(color: Color(0xFF065F46), fontSize: 10, fontWeight: FontWeight.bold)),
                      ),
                    ],
                  ),
                  const SizedBox(height: 6),
                  const Text('Share this OTP with your visitor to show at Gate 01 barrier terminal.', style: TextStyle(fontSize: 12, color: Color(0xFF64748B))),
                  const SizedBox(height: 16),
                  TextField(
                    controller: nameCtrl,
                    decoration: const InputDecoration(labelText: 'Guest / Visitor Name', border: OutlineInputBorder()),
                  ),
                  const SizedBox(height: 12),
                  TextField(
                    controller: phoneCtrl,
                    decoration: const InputDecoration(labelText: 'Visitor Phone Number', border: OutlineInputBorder()),
                  ),
                  const SizedBox(height: 16),
                  Container(
                    padding: const EdgeInsets.all(14),
                    decoration: BoxDecoration(
                      color: const Color(0xFFEFF6FF),
                      borderRadius: BorderRadius.circular(14),
                      border: Border.all(color: const Color(0xFFBFDBFE)),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: const [
                            Text('VISITOR GATE OTP', style: TextStyle(color: Color(0xFF1E40AF), fontSize: 11, fontWeight: FontWeight.bold)),
                            Text('Valid for single entry today', style: TextStyle(color: Color(0xFF60A5FA), fontSize: 10)),
                          ],
                        ),
                        Text(
                          otpCode,
                          style: const TextStyle(color: Color(0xFF1D4ED8), fontSize: 24, fontWeight: FontWeight.w900, letterSpacing: 4),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 16),
                  SizedBox(
                    width: double.infinity,
                    height: 48,
                    child: ElevatedButton.icon(
                      icon: const Icon(Icons.share),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF059669),
                        foregroundColor: Colors.white,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                      ),
                      onPressed: () {
                        Navigator.pop(ctx);
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(
                            content: Text('✓ Pass created! Visitor OTP #$otpCode synced to Gate Terminal & WhatsApp share ready.'),
                            backgroundColor: const Color(0xFF059669),
                          ),
                        );
                      },
                      label: const Text('Confirm Pass & Sync to Gate 01', style: TextStyle(fontWeight: FontWeight.bold)),
                    ),
                  ),
                ],
              ),
            );
          },
        );
      },
    );
  }

  void _openCreatePassModal() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (ctx) {
        return StatefulBuilder(
          builder: (ctx, setModalState) {
            return Padding(
              padding: EdgeInsets.only(
                bottom: MediaQuery.of(ctx).viewInsets.bottom + 20,
                left: 20,
                right: 20,
                top: 20,
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('Pre-Approve Delivery Agent', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
                  const SizedBox(height: 14),
                  const Text('Select Courier Company', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: Color(0xFF64748B))),
                  const SizedBox(height: 6),
                  Wrap(
                    spacing: 8,
                    children: ['Zomato', 'Swiggy', 'Blinkit', 'Amazon', 'Flipkart'].map((c) {
                      final selected = _carrier == c;
                      return ChoiceChip(
                        label: Text(c),
                        selected: selected,
                        onSelected: (val) {
                          setModalState(() {
                            _carrier = c;
                            _passcode = (1000 + (DateTime.now().millisecond * 9) % 8999).toString();
                          });
                        },
                      );
                    }).toList(),
                  ),
                  const SizedBox(height: 14),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.between,
                    children: [
                      const Text('Gate Passcode:', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                        decoration: BoxDecoration(color: const Color(0xFFEFF6FF), borderRadius: BorderRadius.circular(10)),
                        child: Text(_passcode, style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 18, color: Color(0xFF2563EB), letterSpacing: 2)),
                      ),
                    ],
                  ),
                  const SizedBox(height: 14),
                  TextField(
                    controller: _notesController,
                    decoration: const InputDecoration(
                      labelText: 'Instructions for Guard & Agent',
                      border: OutlineInputBorder(),
                    ),
                  ),
                  const SizedBox(height: 20),
                  SizedBox(
                    width: double.infinity,
                    height: 48,
                    child: ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF2563EB),
                        foregroundColor: Colors.white,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                      ),
                      onPressed: _submitPreApproval,
                      child: const Text('Save & Broadcast to Gate 01', style: TextStyle(fontWeight: FontWeight.bold)),
                    ),
                  ),
                ],
              ),
            );
          },
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        title: Text('Gate Passes · Unit ${widget.currentUnit}'),
        backgroundColor: Colors.white,
        foregroundColor: const Color(0xFF0F172A),
        elevation: 0.5,
      ),
      floatingActionButton: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.end,
        children: [
          FloatingActionButton.extended(
            heroTag: 'otpPass',
            onPressed: _openCreateVisitorOtpModal,
            backgroundColor: const Color(0xFF059669),
            icon: const Icon(Icons.pin, color: Colors.white),
            label: const Text('Generate Visitor OTP', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
          ),
          const SizedBox(height: 10),
          FloatingActionButton.extended(
            heroTag: 'courierPass',
            onPressed: _openCreatePassModal,
            backgroundColor: const Color(0xFF2563EB),
            icon: const Icon(Icons.add, color: Colors.white),
            label: const Text('New Courier Pass', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
          ),
        ],
      ),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : ListView(
              padding: const EdgeInsets.all(16),
              children: [
                // Sample Permanent Unit QR Pass
                Container(
                  padding: const EdgeInsets.all(18),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: const Color(0xFFE2E8F0)),
                  ),
                  child: Column(
                    children: [
                      const Text(
                        'Your Unit Digital Entry Pass',
                        style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                      ),
                      const SizedBox(height: 4),
                      const Text(
                        'Show this at boom barrier for automated RFID entry',
                        style: TextStyle(fontSize: 11, color: Color(0xFF64748B)),
                      ),
                      const SizedBox(height: 12),
                      QrImageView(
                        data: 'SMARTSOCIETY:UNIT:${widget.currentUnit}:ENTRY',
                        version: QrVersions.auto,
                        size: 140,
                      ),
                      const SizedBox(height: 8),
                      Text(
                        'UNIT ${widget.currentUnit}',
                        style: const TextStyle(fontWeight: FontWeight.w900, letterSpacing: 1),
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 20),
                const Text('Active Pre-Approved Couriers', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
                const SizedBox(height: 10),

                ..._deliveries.map((d) {
                  return Container(
                    margin: const EdgeInsets.only(bottom: 10),
                    padding: const EdgeInsets.all(14),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: const Color(0xFFE2E8F0)),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.between,
                      children: [
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(d.carrier, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                            Text('Code: ${d.passcode} · ${d.permission}', style: const TextStyle(fontSize: 12, color: Color(0xFF64748B))),
                          ],
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                          decoration: BoxDecoration(
                            color: const Color(0xFFEFF6FF),
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: Text(
                            d.status,
                            style: const TextStyle(color: Color(0xFF2563EB), fontSize: 11, fontWeight: FontWeight.bold),
                          ),
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
