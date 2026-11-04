import 'package:flutter/material.dart';
import '../services/api_service.dart';
import '../models/models.dart';

class WaterIotScreen extends StatefulWidget {
  const WaterIotScreen({Key? key}) : super(key: key);

  @override
  State<WaterIotScreen> createState() => _WaterIotScreenState();
}

class _WaterIotScreenState extends State<WaterIotScreen> {
  final ApiService _api = ApiService();
  bool _loading = true;
  List<WaterTankModel> _tanks = [];
  bool _pumpRunning = true;

  @override
  void initState() {
    super.initState();
    _fetchWaterData();
  }

  Future<void> _fetchWaterData() async {
    setState(() => _loading = true);
    final tanks = await _api.getWaterTanks();
    setState(() {
      _tanks = tanks;
      _loading = false;
    });
  }

  Future<void> _togglePump() async {
    final success = await _api.toggleWaterPump('borewell_1', 'Mobile App User (B-402)');
    if (success) {
      setState(() => _pumpRunning = !_pumpRunning);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(_pumpRunning ? 'Borewell Pump #1 is now RUNNING' : 'Borewell Pump #1 turned OFF'),
          backgroundColor: _pumpRunning ? Colors.green : Colors.orange,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        title: const Text('IoT Water & Pump Telemetry'),
        backgroundColor: Colors.white,
        foregroundColor: const Color(0xFF0F172A),
        elevation: 0.5,
      ),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : ListView(
              padding: const EdgeInsets.all(16),
              children: [
                // Pump Control Relay Card
                Container(
                  padding: const EdgeInsets.all(18),
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(
                      colors: [Color(0xFF0284C7), Color(0xFF0369A1)],
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                    borderRadius: BorderRadius.circular(24),
                    boxShadow: [
                      BoxShadow(
                        color: const Color(0xFF0284C7).withOpacity(0.3),
                        blurRadius: 12,
                        offset: const Offset(0, 6),
                      ),
                    ],
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.between,
                        children: [
                          const Text('Submersible Pump #1', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16)),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                            decoration: BoxDecoration(
                              color: _pumpRunning ? const Color(0xFF22C55E) : Colors.white24,
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: Text(
                              _pumpRunning ? 'ACTIVE PUMPING' : 'IDLE / STANDBY',
                              style: const TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 10),
                      const Text('Flow Rate: 180 LPM · Auto-cutoff at 95% full', style: TextStyle(color: Colors.white70, fontSize: 12)),
                      const SizedBox(height: 16),
                      SizedBox(
                        width: double.infinity,
                        height: 44,
                        child: ElevatedButton(
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.white,
                            foregroundColor: const Color(0xFF0284C7),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                          ),
                          onPressed: _togglePump,
                          child: Text(_pumpRunning ? 'Turn Off Motor' : 'Start Motor'),
                        ),
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 20),
                const Text('Reservoirs & Tanks', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
                const SizedBox(height: 10),

                ..._tanks.map((tank) {
                  return Container(
                    margin: const EdgeInsets.only(bottom: 12),
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(18),
                      border: Border.all(color: const Color(0xFFE2E8F0)),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.between,
                          children: [
                            Text(tank.name, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                            Text('${tank.levelPercentage}%', style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 16, color: Color(0xFF0284C7))),
                          ],
                        ),
                        Text(tank.location, style: const TextStyle(fontSize: 11, color: Color(0xFF64748B))),
                        const SizedBox(height: 10),
                        ClipRRect(
                          borderRadius: BorderRadius.circular(8),
                          child: LinearProgressIndicator(
                            value: tank.levelPercentage / 100.0,
                            minHeight: 10,
                            backgroundColor: const Color(0xFFE0F2FE),
                            color: const Color(0xFF0284C7),
                          ),
                        ),
                        const SizedBox(height: 8),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.between,
                          children: [
                            Text('${tank.currentLitres} / ${tank.capacityLitres} L', style: const TextStyle(fontSize: 11, color: Color(0xFF64748B))),
                            Text('Sensor: ${tank.sensorHealth}', style: const TextStyle(fontSize: 11, color: Color(0xFF059669), fontWeight: FontWeight.bold)),
                          ],
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
