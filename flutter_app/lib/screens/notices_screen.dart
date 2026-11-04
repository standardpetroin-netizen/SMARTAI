import 'package:flutter/material.dart';
import '../services/api_service.dart';
import '../models/models.dart';

class NoticesScreen extends StatefulWidget {
  const NoticesScreen({Key? key}) : super(key: key);

  @override
  State<NoticesScreen> createState() => _NoticesScreenState();
}

class _NoticesScreenState extends State<NoticesScreen> {
  final ApiService _api = ApiService();
  bool _loading = true;
  List<NoticeModel> _notices = [];

  @override
  void initState() {
    super.initState();
    _fetchNotices();
  }

  Future<void> _fetchNotices() async {
    setState(() => _loading = true);
    final data = await _api.getNotices();
    setState(() {
      _notices = data;
      _loading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        title: const Text('Notice Board & Circulars', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 18)),
        actions: [
          IconButton(icon: const Icon(Icons.refresh), onPressed: _fetchNotices),
        ],
      ),
      body: _loading
          ? const Center(child: CircularProgressIndicator(color: Color(0xFF059669)))
          : _notices.isEmpty
              ? const Center(child: Text('No active notices', style: TextStyle(fontWeight: FontWeight.bold)))
              : ListView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: _notices.length,
                  itemBuilder: (ctx, index) {
                    final n = _notices[index];
                    final isUrgent = n.priority == 'Urgent';
                    final isImportant = n.priority == 'Important';

                    return Container(
                      margin: const EdgeInsets.only(bottom: 12),
                      padding: const EdgeInsets.all(18),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(
                          color: isUrgent
                              ? const Color(0xFFFCA5A5)
                              : isImportant
                                  ? const Color(0xFFFCD34D)
                                  : const Color(0xFFE2E8F0),
                        ),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.between,
                            children: [
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                decoration: BoxDecoration(
                                  color: isUrgent
                                      ? const Color(0xFFFEE2E2)
                                      : isImportant
                                          ? const Color(0xFFFEF3C7)
                                          : const Color(0xFFEDE9FE),
                                  borderRadius: BorderRadius.circular(10),
                                ),
                                child: Text(
                                  '${n.priority.toUpperCase()} • ${n.category}',
                                  style: TextStyle(
                                    fontWeight: FontWeight.w800,
                                    fontSize: 10,
                                    color: isUrgent
                                        ? const Color(0xFF991B1B)
                                        : isImportant
                                            ? const Color(0xFF92400E)
                                            : const Color(0xFF5B21B6),
                                  ),
                                ),
                              ),
                              if (n.validUntil.isNotEmpty)
                                Text('Valid until ${n.validUntil}', style: const TextStyle(fontSize: 11, color: Color(0xFF94A3B8))),
                            ],
                          ),
                          const SizedBox(height: 12),
                          Text(n.title, style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 16, color: Color(0xFF0F172A))),
                          const SizedBox(height: 8),
                          Text(n.content, style: const TextStyle(fontSize: 13, color: Color(0xFF475569), height: 1.45)),
                          const SizedBox(height: 12),
                          Container(
                            padding: const EdgeInsets.all(8),
                            decoration: BoxDecoration(
                              color: const Color(0xFFF8FAFC),
                              borderRadius: BorderRadius.circular(10),
                            ),
                            child: Row(
                              children: [
                                const Icon(Icons.verified_user, size: 14, color: Color(0xFF059669)),
                                const SizedBox(width: 6),
                                Text('Issued by: ${n.postedBy}', style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFF334155))),
                              ],
                            ),
                          )
                        ],
                      ),
                    );
                  },
                ),
    );
  }
}
