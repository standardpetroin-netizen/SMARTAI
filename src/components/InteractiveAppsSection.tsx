import React from 'react';
import { useSmartAISociety, AppViewMode } from '../context/SmartAISocietyContext';
import { 
  Smartphone, 
  ShieldCheck, 
  Droplet, 
  Sliders, 
  ArrowRight, 
  Building2, 
  Radio,
  Sparkles,
  Zap,
  CheckCircle2,
  Lock
} from 'lucide-react';

export const InteractiveAppsSection: React.FC = () => {
  const { setActiveView, isSubscribed, openSubscriptionModal, setActiveSocietyPanelTab } = useSmartAISociety();

  const apps = [
    {
      id: 'society_panel' as const,
      name: 'Society Admin Panel',
      badge: '★ Primary RWA Control Hub',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300 font-black',
      icon: Building2,
      iconColor: 'bg-emerald-500 text-white border-emerald-600 shadow-md shadow-emerald-500/20',
      description: 'The master operational headquarters for RWA management committees: flats roster, guard duty shift handover, billing ledger in SQL, helpdesk tickets, and drone logs.',
      highlights: [
        'Real-time resident flats directory synced with SQL',
        'Automated guard shift rotation & vigilance tracking',
        'Bulk maintenance invoices & automated receipt generation',
        'Official society notice circulars broadcast',
      ],
      featured: true,
      actionText: 'Launch Society Panel',
      actionColor: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/30 ring-2 ring-emerald-500/20',
    },
    {
      id: 'society_panel' as const,
      name: 'Autonomous Drone Command',
      badge: 'AI 360° Aerial Patrol',
      badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
      icon: Radio,
      iconColor: 'bg-rose-50 text-rose-600 border-rose-200',
      description: 'Autonomous air sentinel with < 5 min SLA rapid perimeter tripwire breach intercept, FLIR thermal night detection, and automated geo-referenced flight logs.',
      highlights: [
        '< 5-Min SLA rapid breach dispatch & verification',
        'Nighttime FLIR thermal sensor & heat tracking',
        '12,000lm strobe lights & 110dB siren active deterrence',
        'Timestamped & geo-referenced video audit logs',
      ],
      featured: false,
      actionText: 'Launch Drone Command',
      actionColor: 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/20',
    },
    {
      id: 'resident' as const,
      name: 'Resident Mobile App',
      badge: 'Unit B-402 Portal',
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
      icon: Smartphone,
      iconColor: 'bg-purple-50 text-purple-600 border-purple-200',
      description: 'Utility bills, 1-tap UPI payments with GSTIN receipts, dynamic gate passes, helpdesk tickets, and amenity reservations.',
      highlights: [
        'Multi-utility ledger (Electricity DG, Water, CAM)',
        '1-tap UPI, Card, Net Banking payments',
        'Visitor OTP generation & delivery admittance',
      ],
      featured: false,
      actionText: 'Launch Resident App',
      actionColor: 'bg-purple-600 hover:bg-purple-700 text-white shadow-purple-600/20',
    },
    {
      id: 'guard' as const,
      name: 'Smart Gate Security Terminal',
      badge: 'Gate 01 Main Plaza',
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
      icon: ShieldCheck,
      iconColor: 'bg-blue-50 text-blue-600 border-blue-200',
      description: 'Geofenced guard station terminal with real-time GPS radar visualization. Verifies courier OTPs, scans visitor plates, and receives drone breach alerts.',
      highlights: [
        'Real-time GPS geofence radar perimeter tracking',
        '1-Tap courier verification with gate passcodes',
        'Live Autonomous Drone tripwire breach alerts',
      ],
      featured: false,
      actionText: 'Launch Gate Terminal',
      actionColor: 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20',
    },
    {
      id: 'water' as const,
      name: 'Automated IoT Water Ops',
      badge: 'Real-Time Telemetry',
      badgeColor: 'bg-cyan-100 text-cyan-800 border-cyan-200',
      icon: Droplet,
      iconColor: 'bg-cyan-50 text-cyan-600 border-cyan-200',
      description: 'Ultrasonic sensors monitor Underground Sumps and Overhead Tanks. Dispatches sirens and triggers automatic pump relays.',
      highlights: [
        'Live percentage & volume in Litres via MQTT push',
        'Automated 3-minute failsafe hardware cutoff trip',
        'Borewell & booster pump switches with audit trail',
      ],
      featured: false,
      actionText: 'Launch Water Monitor',
      actionColor: 'bg-cyan-600 hover:bg-cyan-700 text-white shadow-cyan-600/20',
    },
    {
      id: 'provisioning' as const,
      name: 'Site Admin (Master Console)',
      badge: 'Master Console',
      badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      icon: Sliders,
      iconColor: 'bg-indigo-50 text-indigo-600 border-indigo-200',
      description: 'Multi-tenant command center with raw SQL query runner, schema diagnostics, database backup downloads, and deployment scripts.',
      highlights: [
        'Multi-tenant cluster & server diagnostics',
        'Interactive SQL runner against database tables',
        '1-click export of complete database SQL dump',
      ],
      featured: false,
      actionText: 'Launch Site Admin',
      actionColor: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20',
    },
  ];

  return (
    <section id="apps" className="py-20 px-6 bg-slate-50 border-y border-slate-200 text-slate-900 relative">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          {!isSubscribed ? (
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 border border-amber-300 text-amber-950 text-xs font-black uppercase tracking-wider mb-1">
              <Lock className="w-3.5 h-3.5 text-amber-700" />
              <span>Priority Subscription Required For Full Feature Access</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-950 text-xs font-black uppercase tracking-wider mb-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Society Priority Subscription Active</span>
            </div>
          )}
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Explore Live Apps &{' '}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 bg-clip-text text-transparent">
              Society Command Suite
            </span>
          </h2>
          <p className="text-slate-600 text-base leading-relaxed">
            Click into any role below to experience the real-time interaction between committee admins, residents, security guards, autonomous surveillance drones, and unified cloud infrastructure.
          </p>
        </div>

        {/* 6 Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {apps.map((app, idx) => {
            const Icon = app.icon;

            return (
              <div
                key={idx}
                className={`rounded-3xl p-7 border transition-all flex flex-col justify-between space-y-6 group relative overflow-hidden ${
                  app.featured
                    ? 'bg-gradient-to-b from-emerald-50/50 via-white to-white border-emerald-300 shadow-md ring-2 ring-emerald-400/30'
                    : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-lg'
                }`}
              >
                {app.featured && (
                  <div className="absolute top-0 right-0 w-28 h-28 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
                )}

                <div className="space-y-4 relative z-10">
                  {/* Top Icon & Badge */}
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${app.iconColor}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={`text-[11px] font-bold px-3 py-1 rounded-full border ${app.badgeColor}`}>
                      {app.badge}
                    </span>
                  </div>

                  {/* App Name & Description */}
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {app.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      {app.description}
                    </p>
                  </div>

                  {/* Feature Highlights */}
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    {app.highlights.map((h, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-600">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="leading-tight">{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Launch Button */}
                <button
                  onClick={() => {
                    if (!isSubscribed) {
                      openSubscriptionModal(app.name, app.id);
                    } else {
                      if (app.actionText === 'Launch Drone Command') {
                        setActiveSocietyPanelTab('drone');
                      }
                      setActiveView(app.id);
                    }
                  }}
                  className={`w-full py-3 px-4 rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95 ${app.actionColor}`}
                >
                  {!isSubscribed && <Lock className="w-3.5 h-3.5 text-white/90" />}
                  <span>{app.actionText}</span>
                  {!isSubscribed ? (
                    <span className="text-[10px] bg-black/20 px-2 py-0.5 rounded-full uppercase tracking-wider font-mono">
                      Pay on Priority
                    </span>
                  ) : (
                    <ArrowRight className="w-4 h-4" />
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
