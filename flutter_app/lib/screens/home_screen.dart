import 'package:flutter/material.dart';
import '../services/api_service.dart';
import '../models/models.dart';
import 'bills_screen.dart';
import 'visitor_pass_screen.dart';
import 'water_iot_screen.dart';
import 'gate_terminal_screen.dart';
import 'complaints_screen.dart';
import 'notices_screen.dart';
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
  List<DeliveryModel> _deliveries = [];
  List<WaterTankModel> _tanks = [];

  @override
  void initState() {
    super.initState();
    _loadDashboardData();
  }

  Future<void> _loadDashboardData() async {
    setState(() => _loading = true);
    final results = await Future.wait([
      _api.getSociety(_societyId),
      _api.getInvoices(_currentUnit),
      _api.getDeliveries(_currentUnit),
      _api.getWaterTanks(),
    ]);

    setState(() {
      _society = results[0] as SocietyModel?;
      _invoices = results[1] as List<InvoiceModel>;
      _deliveries = results[2] as List<DeliveryModel>;
      _tanks = results[3] as List<WaterTankModel>;
      _loading = false;
    });
  }

  void _showSosAlert() {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('🚨 SOS Panic alert sent to Gate 01 Guard Station!'),
        backgroundColor: Colors.redAccent,
        duration: Duration(seconds: 4),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final primaryColor = const Color(0xFF059669); // Emerald Forest
    final activeInvoice = _invoices.isNotEmpty
        ? _invoices.firstWhere((i) => i.status == 'Pending', orElse: () => _invoices.first)
        : null;

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0.5,
        title: Row(
          children: [
            Container(
              width: 38,
              height: 38,
              decoration: BoxDecoration(
                color: primaryColor,
                borderRadius: BorderRadius.circular(12),
              ),
              child: Center(
                child: Text(
                  _society?.logoEmblem ?? 'PG',
                  style: const TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.w900,
                    fontSize: 16,
                  ),
                ),
              ),
            ),
            const SizedBox(width: 10),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  _society?.name ?? 'Palm Greens Residency',
                  style: const TextStyle(
                    color: Color(0xFF0F172A),
                    fontSize: 14,
                    fontWeight: FontWeight.w800,
                  ),
                ),
                Text(
                  'Unit $_currentUnit · Tower B',
                  style: const TextStyle(
                    color: Color(0xFF64748B),
                    fontSize: 11,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ],
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh, color: Color(0xFF334155)),
            onPressed: _loadDashboardData,
          ),
          IconButton(
            icon: const Icon(Icons.security, color: Color(0xFF2563EB)),
            tooltip: 'Guard Terminal Mode',
            onPressed: () {
              Navigator.push(context, MaterialPageRoute(builder: (_) => const GateTerminalScreen()));
            },
          ),
        ],
      ),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : RefreshIndicator(
              onRefresh: _loadDashboardData,
              child: ListView(
                padding: const EdgeInsets.all(16),
                children: [
                  // Maintenance Due Card
                  if (activeInvoice != null)
                    Container(
                      padding: const EdgeInsets.all(18),
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          colors: [primaryColor, const Color(0xFF047857)],
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                        ),
                        borderRadius: BorderRadius.circular(24),
                        boxShadow: [
                          BoxShadow(
                            color: primaryColor.withOpacity(0.25),
                            blurRadius: 16,
                            offset: const Offset(0, 8),
                          ),
                        ],
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.between,
                            children: [
                              Text(
                                activeInvoice.billingPeriod,
                                style: const TextStyle(color: Colors.white70, fontSize: 12),
                              ),
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                decoration: BoxDecoration(
                                  color: Colors.white.withOpacity(0.2),
                                  borderRadius: BorderRadius.circular(12),
                                ),
                                child: Text(
                                  activeInvoice.status == 'Paid' ? 'PAID ✓' : 'DUE SOON',
                                  style: const TextStyle(
                                    color: Colors.white,
                                    fontSize: 10,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 10),
                          const Text(
                            'Payable Maintenance',
                            style: TextStyle(color: Colors.white70, fontSize: 12),
                          ),
                          const SizedBox(height: 2),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.between,
                            children: [
                              Text(
                                activeInvoice.status == 'Paid' ? '₹0.00' : '₹${activeInvoice.totalAmount.toStringAsFixed(0)}',
                                style: const TextStyle(
                                  color: Colors.white,
                                  fontSize: 28,
                                  fontWeight: FontWeight.w900,
                                ),
                              ),
                              ElevatedButton(
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: Colors.white,
                                  foregroundColor: primaryColor,
                                  shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(14),
                                  ),
                                ),
                                onPressed: () {
                                  Navigator.push(
                                    context,
                                    MaterialPageRoute(builder: (_) => BillsScreen(currentUnit: _currentUnit)),
                                  ).then((_) => _loadDashboardData());
                                },
                                child: Text(activeInvoice.status == 'Paid' ? 'View Receipt' : 'Pay via UPI'),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),

                  const SizedBox(height: 20),

                  // Quick Action Grid
                  Row(
                    children: [
                      Expanded(
                        child: _buildActionTile(
                          icon: Icons.qr_code_2,
                          color: const Color(0xFF2563EB),
                          title: 'Passes',
                          subtitle: 'Pre-Approve',
                          onTap: () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (_) => VisitorPassScreen(
                                  currentUnit: _currentUnit,
                                  societyId: _societyId,
                                ),
                              ),
                            ).then((_) => _loadDashboardData());
                          },
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: _buildActionTile(
                          icon: Icons.receipt_long,
                          color: const Color(0xFF7C3AED),
                          title: 'Bills',
                          subtitle: 'Pay Dues',
                          onTap: () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(builder: (_) => BillsScreen(currentUnit: _currentUnit)),
                            ).then((_) => _loadDashboardData());
                          },
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: _buildActionTile(
                          icon: Icons.water_drop,
                          color: const Color(0xFF0284C7),
                          title: 'Water IoT',
                          subtitle: 'Telemetry',
                          onTap: () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(builder: (_) => const WaterIotScreen()),
                            );
                          },
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: _buildActionTile(
                          icon: Icons.warning_amber_rounded,
                          color: const Color(0xFFE11D48),
                          title: 'SOS',
                          subtitle: 'Emergency',
                          onTap: _showSosAlert,
                        ),
                      ),
                    ],
                  ),

                  const SizedBox(height: 12),

                  // Second Row of Quick Actions
                  Row(
                    children: [
                      Expanded(
                        child: _buildActionTile(
                          icon: Icons.support_agent,
                          color: const Color(0xFFD97706),
                          title: 'Helpdesk',
                          subtitle: 'Complaints',
                          onTap: () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (_) => ComplaintsScreen(
                                  unit: _currentUnit,
                                  societyId: _societyId,
                                ),
                              ),
                            );
                          },
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: _buildActionTile(
                          icon: Icons.campaign_rounded,
                          color: const Color(0xFF9333EA),
                          title: 'Notices',
                          subtitle: 'Circulars',
                          onTap: () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(builder: (_) => const NoticesScreen()),
                            );
                          },
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: _buildActionTile(
                          icon: Icons.security,
                          color: const Color(0xFF059669),
                          title: 'Gate Pass',
                          subtitle: 'Security',
                          onTap: () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(builder: (_) => const GateTerminalScreen()),
                            );
                          },
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: _buildActionTile(
                          icon: Icons.admin_panel_settings,
                          color: const Color(0xFF0F172A),
                          title: 'Society',
                          subtitle: 'Admin',
                          onTap: () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(builder: (_) => const SocietyPanelScreen()),
                            );
                          },
                        ),
                      ),
                    ],
                  ),

                  const SizedBox(height: 24),

                  // Water Tank Live Overview Tile
                  if (_tanks.isNotEmpty)
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(color: const Color(0xFFE2E8F0)),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.between,
                            children: [
                              Row(
                                children: const [
                                  Icon(Icons.waves, color: Color(0xFF0284C7), size: 18),
                                  SizedBox(width: 6),
                                  Text(
                                    'IoT Water Level Monitor',
                                    style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
                                  ),
                                ],
                              ),
                              TextButton(
                                onPressed: () {
                                  Navigator.push(
                                    context,
                                    MaterialPageRoute(builder: (_) => const WaterIotScreen()),
                                  );
                                },
                                child: const Text('View All >', style: TextStyle(fontSize: 12)),
                              ),
                            ],
                          ),
                          const SizedBox(height: 6),
                          ClipRRect(
                            borderRadius: BorderRadius.circular(8),
                            child: LinearProgressIndicator(
                              value: _tanks.first.levelPercentage / 100.0,
                              minHeight: 12,
                              backgroundColor: const Color(0xFFE0F2FE),
                              color: const Color(0xFF0284C7),
                            ),
                          ),
                          const SizedBox(height: 8),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.between,
                            children: [
                              Text(
                                '${_tanks.first.name}: ${_tanks.first.levelPercentage}%',
                                style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600),
                              ),
                              Text(
                                '${_tanks.first.currentLitres.toString()} Litres',
                                style: const TextStyle(fontSize: 12, color: Color(0xFF64748B)),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),

                  const SizedBox(height: 20),

                  // Deliveries Registered
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(color: const Color(0xFFE2E8F0)),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.between,
                          children: [
                            const Text(
                              'Pre-Approved Courier Deliveries',
                              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                            ),
                            Text(
                              '${_deliveries.length} Logged',
                              style: const TextStyle(fontSize: 12, color: Color(0xFF059669), fontWeight: FontWeight.bold),
                            ),
                          ],
                        ),
                        const SizedBox(height: 12),
                        if (_deliveries.isEmpty)
                          const Padding(
                            padding: EdgeInsets.symmetric(vertical: 12),
                            child: Text(
                              'No pending courier passes today. Click "Pre-Approve" above.',
                              style: TextStyle(color: Color(0xFF94A3B8), fontSize: 12),
                            ),
                          )
                        else
                          ..._deliveries.map(
                            (d) => Container(
                              margin: const EdgeInsets.only(bottom: 8),
                              padding: const EdgeInsets.all(12),
                              decoration: BoxDecoration(
                                color: const Color(0xFFF8FAFC),
                                borderRadius: BorderRadius.circular(14),
                              ),
                              child: Row(
                                mainAxisAlignment: MainAxisAlignment.between,
                                children: [
                                  Row(
                                    children: [
                                      Container(
                                        padding: const EdgeInsets.all(8),
                                        decoration: BoxDecoration(
                                          color: const Color(0xFFEFF6FF),
                                          borderRadius: BorderRadius.circular(10),
                                        ),
                                        child: const Icon(Icons.delivery_dining, color: Color(0xFF2563EB), size: 20),
                                      ),
                                      const SizedBox(width: 10),
                                      Column(
                                        crossAxisAlignment: CrossAxisAlignment.start,
                                        children: [
                                          Text(d.carrier, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                                          Text('Passcode: ${d.passcode}', style: const TextStyle(fontSize: 11, color: Color(0xFF64748B))),
                                        ],
                                      ),
                                    ],
                                  ),
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                    decoration: BoxDecoration(
                                      color: const Color(0xFFDCFCE7),
                                      borderRadius: BorderRadius.circular(8),
                                    ),
                                    child: Text(
                                      d.status,
                                      style: const TextStyle(color: Color(0xFF15803D), fontSize: 10, fontWeight: FontWeight.bold),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
    );
  }

  Widget _buildActionTile({
    required IconData icon,
    required Color color,
    required String title,
    required String subtitle,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(16),
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 8),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: const Color(0xFFE2E8F0)),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.02),
              blurRadius: 6,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Column(
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: color.withOpacity(0.1),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(icon, color: color, size: 22),
            ),
            const SizedBox(height: 8),
            Text(
              title,
              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12),
            ),
            Text(
              subtitle,
              style: const TextStyle(color: Color(0xFF94A3B8), fontSize: 10),
            ),
          ],
        ),
      ),
    );
  }
}
