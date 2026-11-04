import React, { useState } from 'react';
import { Award, ChevronRight, X, CheckCircle } from 'lucide-react';

interface CaseStudy {
  id: string;
  badge: string;
  badgeColor: string;
  title: string;
  location: string;
  units: number;
  summary: string;
  keyMetric: string;
  metricLabel: string;
  outcome: string;
  presidentQuote: string;
  author: string;
  role: string;
  implementationDetails: string[];
}

const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'windsor-grand',
    badge: '720 Units · Mumbai Suburbs',
    badgeColor: 'text-blue-700 bg-blue-50 border-blue-200',
    title: 'Windsor Grand Township',
    location: 'Kandivali East, Mumbai',
    units: 720,
    summary:
      'Switched from physical paper registries to our digital guard patrol system. Over 4 perimeter breaches were prevented in month one through automated missed-checkpoint alarms.',
    keyMetric: '100%',
    metricLabel: 'Patrol Auditability',
    outcome: 'Eliminated guard sleep-ins with mandatory geofenced NFC scans across 18 perimeter points.',
    presidentQuote:
      'The control room alerts gave us real-time eyes on the night guards. For the first time in 8 years, our committee had zero blind spots along the canal boundary.',
    author: 'Cmdr. Ashok Nair (Retd.)',
    role: 'Security Committee Chairman, Windsor Grand RWA',
    implementationDetails: [
      '18 Weatherproof NFC tokens deployed across boundary fence and pump rooms',
      'Automated 10-minute missed checkpoint alert to night patrol supervisor',
      'Zero cellular reception offline caching in basement parking levels',
      'Daily automated PDF duty report dispatched at 06:00 AM to managing committee',
    ],
  },
  {
    id: 'prestige-heights',
    badge: '1,250 Units · Bangalore Tech Corridor',
    badgeColor: 'text-purple-700 bg-purple-50 border-purple-200',
    title: 'Prestige Heights Condominiums',
    location: 'Outer Ring Road, Bengaluru',
    units: 1250,
    summary:
      'Full white-label deployment under their custom domain. Door-to-door QR waste segregation tracking increased dry/wet waste compliance from 54% to 96% within 60 days.',
    keyMetric: '+42%',
    metricLabel: 'Waste Segregation Surge',
    outcome: 'Saved ₹1.8 Lakhs per month in municipal unsegregated landfill fines.',
    presidentQuote:
      'Residents take pride when the app opens with our own prestige logo and domain. The doorstep QR scan eliminated all disputes between housekeeping staff and flat owners.',
    author: 'Dr. Madhavan Krishnan',
    role: 'RWA President, Prestige Heights AOA',
    implementationDetails: [
      '1,250 customized weatherproof QR badges printed and affixed outside unit doorways',
      'Doorstep scan logged in <2 seconds per unit by 14 housekeeping staff',
      'Auto-tagging ₹250 penalty on flat maintenance ledger for recurring unsegregated wet waste',
      'Live composting yield analytics shared on digital noticeboards',
    ],
  },
  {
    id: 'solitaire-meadows',
    badge: '480 Units · Pune Commercial & Residential',
    badgeColor: 'text-amber-800 bg-amber-50 border-amber-200',
    title: 'Solitaire Meadows RWA',
    location: 'Baner-Pashan Link Road, Pune',
    units: 480,
    summary:
      'Unified maintenance fee collections with auto-generated PDF receipts. Reduced unpaid defaulters from ₹38 Lakhs down to zero within two quarterly billing cycles.',
    keyMetric: 'Zero',
    metricLabel: 'Maintenance Defaulters',
    outcome: 'Accelerated fund recovery from 82 days average down to 4.2 days via WhatsApp reminders.',
    presidentQuote:
      'The automated branded receipts with society GST registration and instant reconciliations saved our treasurer over 40 hours of manual bookkeeping every quarter.',
    author: 'Sunil Shirodkar',
    role: 'Hon. Treasurer, Solitaire Meadows Committee',
    implementationDetails: [
      'Seamless multi-bank payment gateway with 0% UPI transaction surcharge',
      'Instant GST-compliant PDF receipts with digital cryptographic verification hash',
      'Automated staggered WhatsApp reminder sequence 5 days before due date',
      'Full bank statement auto-reconciliation mapped to unit flat numbers',
    ],
  },
];

export const CaseStudies: React.FC = () => {
  const [selectedCase, setSelectedCase] = useState<CaseStudy | null>(null);

  return (
    <section id="portfolio" className="py-20 bg-white px-6 border-b border-slate-200 text-slate-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-xs uppercase font-bold tracking-widest text-blue-600 mb-2">Proven Track Record</p>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Trusted by Leading{' '}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 bg-clip-text text-transparent">
              Townships & RWAs
            </span>
          </h2>
          <p className="text-slate-600 mt-3 text-base">
            Real outcomes from societies that transitioned from manual spreadsheets and fragmented apps to smartaisociety.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {CASE_STUDIES.map((item) => (
            <div
              key={item.id}
              className="bg-slate-50 border border-slate-200 rounded-3xl overflow-hidden hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between p-7 group cursor-pointer"
              onClick={() => setSelectedCase(item)}
            >
              <div>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${item.badgeColor}`}>
                  {item.badge}
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-4 group-hover:text-blue-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-600 mt-2.5 leading-relaxed">{item.summary}</p>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1.5">
                  Result: <strong className="text-emerald-700 font-bold">{item.keyMetric} {item.metricLabel}</strong>
                </span>
                <span className="text-blue-600 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  View Study <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Deep-Dive Case Study Modal in Unified Dark Theme */}
      {selectedCase && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl relative text-white">
            <button
              onClick={() => setSelectedCase(null)}
              className="absolute top-6 right-6 text-slate-400 hover:text-white p-2 rounded-xl bg-slate-800 cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${selectedCase.badgeColor}`}>
                {selectedCase.badge}
              </span>
              <span className="text-xs text-slate-400">· {selectedCase.location}</span>
            </div>

            <h3 className="text-2xl font-bold text-white mt-2">{selectedCase.title}</h3>

            <div className="mt-6 p-5 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-between">
              <div>
                <p className="text-xs text-emerald-300 font-medium">Key Verified Impact</p>
                <p className="text-3xl font-extrabold text-emerald-400 font-mono tabular-nums mt-0.5">
                  {selectedCase.keyMetric}
                </p>
                <p className="text-xs text-emerald-300 font-semibold">{selectedCase.metricLabel}</p>
              </div>
              <div className="text-right max-w-xs">
                <p className="text-xs text-slate-400">Outcome</p>
                <p className="text-xs text-slate-200 font-medium mt-1 leading-relaxed">{selectedCase.outcome}</p>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="text-sm font-bold text-slate-900 mb-3">Deployment Architecture</h4>
              <ul className="space-y-2.5 text-xs text-slate-700">
                {selectedCase.implementationDetails.map((detail, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <p className="text-xs italic text-slate-700 leading-relaxed">&ldquo;{selectedCase.presidentQuote}&rdquo;</p>
              <div className="mt-3 text-xs">
                <p className="font-bold text-slate-900">{selectedCase.author}</p>
                <p className="text-slate-500">{selectedCase.role}</p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedCase(null)}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl cursor-pointer"
              >
                Close Case Study
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
