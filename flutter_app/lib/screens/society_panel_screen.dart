import 'package:flutter/material.dart';
import '../services/api_service.dart';
import '../models/models.dart';

class SocietyPanelScreen extends StatefulWidget {
  final String societyId;

  const SocietyPanelScreen({Key? key, this.societyId = 'soc_pg_982'}) : super(key: key);

  @override
  State<SocietyPanelScreen> createState() => _SocietyPanelScreenState();
}

class _SocietyPanelScreenState extends State<SocietyPanelScreen> {
  final ApiService _api = ApiService();
  bool _loading = true;
  SocietyModel? _society;
  List<ComplaintModel> _complaints = [];
  List<VisitorModel> _visitors = [];
  List<WaterTankModel> _tanks = [];

  @override
  void initState() {
    super.initState();
    _fetchAdminData();
  }

  Future<void> _fetchAdminData() async {
    setState(() => _loading = true);
    final results = await Future.wait([
      _api.getSociety(widget.societyId),
      _api.getComplaints(),
      _api.getVisitors(),
      _api.getWaterTanks(),
    ]);

    setState(() {
      _society = results[0] as SocietyModel?;
      _complaints = results[1] as List<ComplaintModel>;
      _visitors = results[2] as List<VisitorModel>;
      _tanks = results[3] as List<WaterTankModel>;
      _loading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        title: const Text('Society Admin Panel', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 18)),
        actions: [
          IconButton(icon: const Icon(Icons.refresh), onPressed: _fetchAdminData),
        ],
      ),
      body: _loading
          ? const Center(child: CircularProgressIndicator(color: Color(0xFF059669)))
          : SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Society Identity Banner
                  Container(
                    padding: const EdgeInsets.all(18),
                    decoration: BoxDecoration(
                      color: const Color(0xFF0F172A),
                      borderRadius: BorderRadius.circular(24),
                    ),
                    child: Row(
                      children: [
                        Container(
                          width: 48,
                          height: 48,
                          decoration: BoxDecoration(
                            color: const Color(0xFF059669),
                            borderRadius: BorderRadius.circular(16),
                          ),
                          child: Center(
                            child: Text(
                              _society?.logoEmblem ?? 'PG',
                              style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w900, fontSize: 18),
                            ),
                          ),
                        ),
                        const SizedBox(width: 14),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                _society?.name ?? 'Palm Greens Residency',
                                style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w800, fontSize: 16),
                              ),
                              const SizedBox(height: 4),
                              const Text(
                                'Hostinger VPS SQL Engine • Multi-Tenant',
                                style: TextStyle(color: Color(0xFF94A3B8), fontSize: 12),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 20),
                  const Text('Overview Metrics', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 16)),
                  const SizedBox(height: 12),

                  Row(
                    children: [
                      Expanded(
                        child: Container(
                          padding: const EdgeInsets.all(16),
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(20),
                            border: Border.all(color: const Color(0xFFE2E8F0)),
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Text('Total Flats', style: TextStyle(color: Color(0xFF64748B), fontSize: 12, fontWeight: FontWeight.bold)),
                              const SizedBox(height: 4),
                              Text('${_society?.totalFlats ?? 320}', style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 22, color: Color(0xFF0F172A))),
                            ],
                          ),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Container(
                          padding: const EdgeInsets.all(16),
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(20),
                            border: Border.all(color: const Color(0xFFE2E8F0)),
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Text('Open Tickets', style: TextStyle(color: Color(0xFF64748B), fontSize: 12, fontWeight: FontWeight.bold)),
                              const SizedBox(height: 4),
                              Text('${_complaints.where((c) => c.status != 'Resolved').length}', style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 22, color: Color(0xFFE11D48))),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),

                  const SizedBox(height: 20),
                  const Text('Active Visitors Inside', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 16)),
                  const SizedBox(height: 10),

                  ..._visitors.map((v) => Container(
                        margin: const EdgeInsets.only(bottom: 8),
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
                                Text(v.name, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                                Text('Unit ${v.unit} • ${v.visitorType}', style: const TextStyle(color: Color(0xFF64748B), fontSize: 12)),
                              ],
                            ),
                            Text(v.entryTime, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: Color(0xFF059669))),
                          ],
                        ),
                      )),
                ],
              ),
            ),
    );
  }
}
