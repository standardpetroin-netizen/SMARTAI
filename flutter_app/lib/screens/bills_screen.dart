import 'package:flutter/material.dart';
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
  bool _paying = false;

  @override
  void initState() {
    super.initState();
    _fetchBills();
  }

  Future<void> _fetchBills() async {
    setState(() => _loading = true);
    final list = await _api.getInvoices(widget.currentUnit);
    setState(() {
      _invoices = list;
      _loading = false;
    });
  }

  Future<void> _processPayment(String invoiceId) async {
    setState(() => _paying = true);
    final success = await _api.payInvoice(invoiceId, 'UPI');
    setState(() => _paying = false);

    if (success) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('✓ Payment of ₹4,250 confirmed in SQL ledger! Digital receipt issued.'),
          backgroundColor: Colors.green,
        ),
      );
      _fetchBills();
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Payment failed. Check your network or retry.'),
          backgroundColor: Colors.redAccent,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        title: Text('Utility Ledger · Unit ${widget.currentUnit}'),
        backgroundColor: Colors.white,
        foregroundColor: const Color(0xFF0F172A),
        elevation: 0.5,
      ),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : ListView(
              padding: const EdgeInsets.all(16),
              children: [
                ..._invoices.map((inv) => _buildInvoiceCard(inv)),
              ],
            ),
    );
  }

  Widget _buildInvoiceCard(InvoiceModel inv) {
    final isPaid = inv.status == 'Paid';
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: const Color(0xFFE2E8F0)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.02),
            blurRadius: 10,
            offset: const Offset(0, 4),
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
                inv.billingPeriod,
                style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: isPaid ? const Color(0xFFDCFCE7) : const Color(0xFFFEF3C7),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Text(
                  inv.status.toUpperCase(),
                  style: TextStyle(
                    color: isPaid ? const Color(0xFF15803D) : const Color(0xFFB45309),
                    fontSize: 11,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          const Divider(),
          const SizedBox(height: 6),
          _buildLineItem('Society Maintenance (Rate: ₹3.2/sq.ft)', '₹2,400.00'),
          _buildLineItem('DG Power Electricity Backup', '₹1,100.00'),
          _buildLineItem('Water Utility & Sewage Treatment', '₹750.00'),
          const SizedBox(height: 6),
          const Divider(),
          const SizedBox(height: 8),
          Row(
            mainAxisAlignment: MainAxisAlignment.between,
            children: [
              const Text('Total Bill Amount', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
              Text('₹${inv.totalAmount.toStringAsFixed(2)}', style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 18, color: Color(0xFF0F172A))),
            ],
          ),
          const SizedBox(height: 14),
          if (!isPaid)
            SizedBox(
              width: double.infinity,
              height: 48,
              child: ElevatedButton.icon(
                icon: _paying ? const SizedBox(width: 18, height: 18, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2)) : const Icon(Icons.payment),
                label: Text(_paying ? 'Processing UPI...' : 'Pay ₹${inv.totalAmount.toStringAsFixed(0)} via UPI / NetBanking'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF059669),
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                ),
                onPressed: _paying ? null : () => _processPayment(inv.id),
              ),
            )
          else
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: const Color(0xFFF1F5F9),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Row(
                children: [
                  const Icon(Icons.check_circle, color: Color(0xFF059669), size: 20),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      'Receipt: ${inv.receiptHash ?? "REC-8842"}\nSettled via UPI',
                      style: const TextStyle(fontSize: 11, color: Color(0xFF334155)),
                    ),
                  ),
                ],
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildLineItem(String title, String amount) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.between,
        children: [
          Text(title, style: const TextStyle(fontSize: 12, color: Color(0xFF64748B))),
          Text(amount, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: Color(0xFF1E293B))),
        ],
      ),
    );
  }
}
