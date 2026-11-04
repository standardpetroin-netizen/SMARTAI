import 'package:flutter/material.dart';
import '../services/api_service.dart';
import '../models/models.dart';

class ComplaintsScreen extends StatefulWidget {
  final String unit;
  final String societyId;

  const ComplaintsScreen({
    Key? key,
    this.unit = 'B-402',
    this.societyId = 'soc_pg_982',
  }) : super(key: key);

  @override
  State<ComplaintsScreen> createState() => _ComplaintsScreenState();
}

class _ComplaintsScreenState extends State<ComplaintsScreen> {
  final ApiService _api = ApiService();
  bool _loading = true;
  List<ComplaintModel> _complaints = [];

  final _titleController = TextEditingController();
  final _descController = TextEditingController();
  String _selectedCategory = 'Plumbing';
  String _selectedPriority = 'Medium';

  final List<String> _categories = [
    'Plumbing',
    'Electrical',
    'Elevator',
    'Security',
    'Civil',
    'Gardening',
    'Other'
  ];

  @override
  void initState() {
    super.initState();
    _fetchComplaints();
  }

  Future<void> _fetchComplaints() async {
    setState(() => _loading = true);
    final data = await _api.getComplaints(unit: widget.unit);
    setState(() {
      _complaints = data;
      _loading = false;
    });
  }

  void _showNewTicketSheet() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
      ),
      builder: (ctx) => StatefulBuilder(
        builder: (ctx, setSheetState) => Padding(
          padding: EdgeInsets.only(
            top: 24,
            left: 20,
            right: 20,
            bottom: MediaQuery.of(ctx).viewInsets.bottom + 24,
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.between,
                children: [
                  const Text(
                    'Raise Helpdesk Ticket',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.w800,
                      color: Color(0xFF0F172A),
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.close),
                    onPressed: () => Navigator.pop(ctx),
                  )
                ],
              ),
              const SizedBox(height: 16),
              const Text('Category', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
              const SizedBox(height: 8),
              Wrap(
                spacing: 8,
                children: _categories.map((cat) {
                  final isSelected = _selectedCategory == cat;
                  return ChoiceChip(
                    label: Text(cat),
                    selected: isSelected,
                    onSelected: (val) {
                      if (val) setSheetState(() => _selectedCategory = cat);
                    },
                    selectedColor: const Color(0xFF059669),
                    labelStyle: TextStyle(
                      color: isSelected ? Colors.white : const Color(0xFF334155),
                      fontWeight: FontWeight.w600,
                      fontSize: 12,
                    ),
                  );
                }).toList(),
              ),
              const SizedBox(height: 16),
              TextField(
                controller: _titleController,
                decoration: InputDecoration(
                  labelText: 'Issue Title',
                  hintText: 'e.g. Bathroom geyser leaking',
                  filled: true,
                  fillColor: const Color(0xFFF8FAFC),
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(16)),
                ),
              ),
              const SizedBox(height: 12),
              TextField(
                controller: _descController,
                maxLines: 3,
                decoration: InputDecoration(
                  labelText: 'Description',
                  hintText: 'Provide details about the issue...',
                  filled: true,
                  fillColor: const Color(0xFFF8FAFC),
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(16)),
                ),
              ),
              const SizedBox(height: 20),
              SizedBox(
                width: double.infinity,
                height: 50,
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF059669),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                  ),
                  onPressed: () async {
                    if (_titleController.text.isEmpty || _descController.text.isEmpty) return;
                    Navigator.pop(ctx);
                    final success = await _api.createComplaint(
                      societyId: widget.societyId,
                      unit: widget.unit,
                      residentName: 'Sameer Verma',
                      category: _selectedCategory,
                      title: _titleController.text.trim(),
                      description: _descController.text.trim(),
                      priority: _selectedPriority,
                    );
                    _titleController.clear();
                    _descController.clear();
                    if (success) {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                          content: Text('Ticket logged successfully in SQL backend!'),
                          backgroundColor: Color(0xFF059669),
                        ),
                      );
                      _fetchComplaints();
                    }
                  },
                  child: const Text(
                    'Submit Ticket',
                    style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: Colors.white),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        title: const Text('Maintenance & Helpdesk', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 18)),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _fetchComplaints,
          )
        ],
      ),
      floatingActionButton: FloatingActionButton.extended(
        backgroundColor: const Color(0xFF059669),
        icon: const Icon(Icons.add, color: Colors.white),
        label: const Text('New Ticket', style: TextStyle(fontWeight: FontWeight.bold, color: Colors.white)),
        onPressed: _showNewTicketSheet,
      ),
      body: _loading
          ? const Center(child: CircularProgressIndicator(color: Color(0xFF059669)))
          : _complaints.isEmpty
              ? Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.check_circle_outline, size: 64, color: Colors.grey.shade400),
                      const SizedBox(height: 12),
                      const Text('No complaints logged', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                      const SizedBox(height: 4),
                      Text('Everything is running smoothly in unit ${widget.unit}', style: TextStyle(color: Colors.grey.shade600, fontSize: 13)),
                    ],
                  ),
                )
              : ListView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: _complaints.length,
                  itemBuilder: (ctx, index) {
                    final c = _complaints[index];
                    final isResolved = c.status == 'Resolved';
                    final isInProgress = c.status == 'In Progress';

                    return Container(
                      margin: const EdgeInsets.only(bottom: 12),
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(color: const Color(0xFFE2E8F0)),
                        boxShadow: [
                          BoxConstraints.tightFor(height: 1).constrain(
                            BoxDecoration(boxShadow: [
                              BoxShadow(color: Colors.black.withOpacity(0.02), blurRadius: 4, offset: const Offset(0, 2))
                            ]),
                          ) as BoxShadow
                        ],
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
                                  color: const Color(0xFFF1F5F9),
                                  borderRadius: BorderRadius.circular(10),
                                ),
                                child: Text(
                                  '${c.category} • ${c.priority}',
                                  style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 11, color: Color(0xFF475569)),
                                ),
                              ),
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                decoration: BoxDecoration(
                                  color: isResolved
                                      ? const Color(0xFFDCFCE7)
                                      : isInProgress
                                          ? const Color(0xFFDBEAFE)
                                          : const Color(0xFFFEF3C7),
                                  borderRadius: BorderRadius.circular(10),
                                ),
                                child: Text(
                                  c.status,
                                  style: TextStyle(
                                    fontWeight: FontWeight.w800,
                                    fontSize: 11,
                                    color: isResolved
                                        ? const Color(0xFF166534)
                                        : isInProgress
                                            ? const Color(0xFF1E40AF)
                                            : const Color(0xFF92400E),
                                  ),
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 10),
                          Text(c.title, style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 15, color: Color(0xFF0F172A))),
                          const SizedBox(height: 6),
                          Text(c.description, style: const TextStyle(color: Color(0xFF64748B), fontSize: 13, height: 1.4)),
                          if (c.assignedTo != null) ...[
                            const SizedBox(height: 10),
                            Container(
                              padding: const EdgeInsets.all(8),
                              decoration: BoxDecoration(
                                color: const Color(0xFFF8FAFC),
                                borderRadius: BorderRadius.circular(10),
                              ),
                              child: Row(
                                children: [
                                  const Icon(Icons.person, size: 16, color: Color(0xFF059669)),
                                  const SizedBox(width: 6),
                                  Text('Assigned to: ${c.assignedTo}', style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600)),
                                ],
                              ),
                            ),
                          ],
                          const SizedBox(height: 8),
                          Text('Logged on ${c.createdAt}', style: const TextStyle(fontSize: 11, color: Color(0xFF94A3B8))),
                        ],
                      ),
                    );
                  },
                ),
    );
  }
}
