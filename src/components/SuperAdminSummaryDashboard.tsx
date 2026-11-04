import React, { useState } from 'react';
import { 
  Building2, 
  Users, 
  Clock, 
  ShieldCheck, 
  Droplet, 
  ArrowUpRight, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  Activity, 
  RefreshCw, 
  Smartphone, 
  Check, 
  X, 
  Sparkles,
  MapPin,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Sliders
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  AreaChart, 
  Area, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';

export interface ManagedSocietyItem {
  id: string;
  name: string;
  subdomain: string;
  customDomain: string;
  units: number;
  city: string;
  brandColor: string;
  status: string;
  guardSla: string;
  waterStatus: string;
  lastPatrol: string;
  isCurrent?: boolean;
}

export interface ProvisioningRequestItem {
  id: string;
  societyName: string;
  city: string;
  units: number;
  applicantName: string;
  applicantRole: string;
  applicantPhone: string;
  applicantEmail: string;
  packageTier: string;
  submittedAt: string;
  status: 'Pending Verification' | 'DNS Setup' | 'Approved' | 'Rejected';
  notes: string;
}

interface SuperAdminSummaryDashboardProps {
  managedSocieties: ManagedSocietyItem[];
  onOpenProvisioningWizard: () => void;
  onSelectSocietyTab: () => void;
}

export const SuperAdminSummaryDashboard: React.FC<SuperAdminSummaryDashboardProps> = ({
  managedSocieties,
  onOpenProvisioningWizard,
  onSelectSocietyTab,
}) => {
  // Time filter state
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Managed provisioning requests pipeline
  const [provisioningQueue, setProvisioningQueue] = useState<ProvisioningRequestItem[]>([
    {
      id: 'req_ss_301',
      societyName: 'Silver Springs Luxury Condominium',
      city: 'Pune, Maharashtra',
      units: 480,
      applicantName: 'Col. Rajesh Bakshi (Retd.)',
      applicantRole: 'RWA President',
      applicantPhone: '+91 98231 44550',
      applicantEmail: 'president@silversprings-rwa.in',
      packageTier: 'Enterprise White-Label + Drone',
      submittedAt: 'Today, 02:40 AM',
      status: 'Pending Verification',
      notes: 'Requested custom domain residents.silverspringspune.org and 2 guard gate tablets.',
    },
    {
      id: 'req_dch_302',
      societyName: 'DLF Cyber Heights Residency',
      city: 'Gurugram, NCR',
      units: 720,
      applicantName: 'Ms. Sunita Kapoor',
      applicantRole: 'Management Committee Secretary',
      applicantPhone: '+91 99100 88712',
      applicantEmail: 'secretary@dlfcyberheights.org',
      packageTier: 'Standard Enterprise',
      submittedAt: 'Yesterday, 04:15 PM',
      status: 'DNS Setup',
      notes: 'Waiting for TXT record verification on edge proxy for dlfcyberheights.org.',
    },
    {
      id: 'req_pm_303',
      societyName: 'Puravankara Green Meadows AOA',
      city: 'Whitefield, Bengaluru',
      units: 360,
      applicantName: 'Dr. Vivek Ramanathan',
      applicantRole: 'Treasurer',
      applicantPhone: '+91 98450 11299',
      applicantEmail: 'accounts@greenmeadows-aoa.in',
      packageTier: 'Enterprise White-Label + IoT Water',
      submittedAt: '2 days ago',
      status: 'Pending Verification',
      notes: 'Requested 4 ultrasonic tank sensors and automated borehole relays.',
    },
  ]);

  // Selected request modal / review
  const [selectedRequest, setSelectedRequest] = useState<ProvisioningRequestItem | null>(null);

  // Calculate real-time aggregated metrics
  const totalFlats = managedSocieties.reduce((acc, s) => acc + s.units, 0);
  const totalEstimatedResidents = Math.round(totalFlats * 3.4);
  const activeSocietiesCount = managedSocieties.length;
  const pendingRequestsCount = provisioningQueue.filter(r => r.status !== 'Approved' && r.status !== 'Rejected').length;
  
  // Aggregate guard SLA
  const avgGuardSla = (
    managedSocieties.reduce((acc, s) => acc + parseFloat(s.guardSla.replace('%', '')), 0) / managedSocieties.length
  ).toFixed(1);

  // Recharts Chart Data 1: Resident & Unit distribution by Society
  const societyDistributionData = managedSocieties.map((s) => ({
    name: s.name.length > 16 ? s.name.substring(0, 14) + '...' : s.name,
    fullName: s.name,
    units: s.units,
    residents: Math.round(s.units * 3.4),
    activeAppUsers: Math.round(s.units * 2.8),
    city: s.city,
  }));

  // Recharts Chart Data 2: Resident Growth & Active Mobile Sessions Timeline
  const activityTrendData = [
    { period: 'Day 1', activeSessions: 1240, gatePasses: 340, billPayments: 85 },
    { period: 'Day 5', activeSessions: 1480, gatePasses: 410, billPayments: 120 },
    { period: 'Day 10', activeSessions: 1820, gatePasses: 520, billPayments: 195 },
    { period: 'Day 15', activeSessions: 2150, gatePasses: 610, billPayments: 380 },
    { period: 'Day 20', activeSessions: 2490, gatePasses: 740, billPayments: 420 },
    { period: 'Day 25', activeSessions: 2880, gatePasses: 890, billPayments: 510 },
    { period: 'Current', activeSessions: 3240, gatePasses: 980, billPayments: 640 },
  ];

  // Recharts Chart Data 3: Deployment Lifecycle Pipeline (Pie Chart)
  const pipelineStatusData = [
    { name: 'Active Live Installations', value: activeSocietiesCount, color: '#2563eb' },
    { name: 'Pending Verification', value: provisioningQueue.filter(r => r.status === 'Pending Verification').length, color: '#f59e0b' },
    { name: 'DNS & Edge Setup', value: provisioningQueue.filter(r => r.status === 'DNS Setup').length, color: '#06b6d4' },
    { name: 'Sandbox Demos', value: 2, color: '#8b5cf6' },
  ];

  // Handler to approve a pending request
  const handleApproveRequest = (id: string) => {
    setProvisioningQueue(prev => prev.map(req => {
      if (req.id === id) {
        return { ...req, status: 'Approved' };
      }
      return req;
    }));
    setSelectedRequest(null);
  };

  // Handler to reject a request
  const handleRejectRequest = (id: string) => {
    setProvisioningQueue(prev => prev.map(req => {
      if (req.id === id) {
        return { ...req, status: 'Rejected' };
      }
      return req;
    }));
    setSelectedRequest(null);
  };

  const handleRefreshMetrics = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* =========================================================================
          SECTION HEADER WITH REFRESH & CONTROLS
          ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-mono font-bold text-emerald-700 uppercase tracking-wider">
              Real-Time Aggregated Cluster Telemetry
            </span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
            Cluster Summary Dashboard
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Holistic cross-society multi-tenant metrics, provisioning pipeline queues, and active resident app engagement.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto flex-wrap">
          {/* Time range toggle */}
          <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-bold">
            {(['7d', '30d', '90d'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  timeRange === range
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {range.toUpperCase()}
              </button>
            ))}
          </div>

          <button
            onClick={handleRefreshMetrics}
            disabled={isRefreshing}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer border border-slate-200 shadow-2xs"
            title="Refresh aggregated telemetry"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-blue-600 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Sync</span>
          </button>

          <button
            onClick={onOpenProvisioningWizard}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-blue-600/25 active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Provisioning</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          KEY AGGREGATED METRICS - 4 HIGH-IMPACT CARDS
          ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Metric 1: Total Active Residents */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Active Residents
            </span>
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200 shadow-2xs group-hover:scale-105 transition-transform">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900 font-mono tabular-nums">
            {totalEstimatedResidents.toLocaleString()}
          </p>
          <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-slate-100">
            <span className="text-slate-500 font-medium">Across {totalFlats.toLocaleString()} units</span>
            <span className="inline-flex items-center gap-0.5 text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full font-mono text-[11px]">
              <TrendingUp className="w-3 h-3" />
              +18.4% MoM
            </span>
          </div>
        </div>

        {/* Metric 2: Active Society Installations */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Active Society Installations
            </span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200 shadow-2xs group-hover:scale-105 transition-transform">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900 font-mono tabular-nums">
            {activeSocietiesCount} Clusters
          </p>
          <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-slate-100">
            <span className="text-slate-500 font-medium">100% Isolated Tenants</span>
            <span className="inline-flex items-center gap-1 text-emerald-700 font-bold font-mono text-[11px]">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              100% SSL &amp; Edge Active
            </span>
          </div>
        </div>

        {/* Metric 3: Pending Provisioning Requests */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Pending Provisioning
            </span>
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200 shadow-2xs group-hover:scale-105 transition-transform">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-amber-600 font-mono tabular-nums">
            {pendingRequestsCount} Pending
          </p>
          <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-slate-100">
            <span className="text-slate-500 font-medium">In Onboarding Pipeline</span>
            <span className="text-amber-800 font-bold bg-amber-100 px-2 py-0.5 rounded-full text-[10px] font-mono">
              Action Required
            </span>
          </div>
        </div>

        {/* Metric 4: Multi-Cluster SLA & IoT Health */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Fleet Guard &amp; IoT SLA
            </span>
            <div className="w-10 h-10 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center border border-cyan-200 shadow-2xs group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-cyan-700 font-mono tabular-nums">
            {avgGuardSla}%
          </p>
          <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-slate-100">
            <span className="text-slate-500 font-medium">56 GPS Geofence checkpoints</span>
            <span className="text-emerald-700 font-bold font-mono text-[11px]">
              Optimal
            </span>
          </div>
        </div>
      </div>

      {/* =========================================================================
          RECHARTS VISUALIZATION GRIDS
          ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Chart (7 cols): Resident & Unit Density Distribution */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" />
                <span>Active Residents &amp; Units Across Managed Societies</span>
              </h3>
              <p className="text-xs text-slate-500">
                Aggregated flat inventory vs active resident app accounts per installation
              </p>
            </div>
            <button
              onClick={onSelectSocietyTab}
              className="text-xs text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1 cursor-pointer self-start sm:self-auto"
            >
              <span>View Roster</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* BarChart Container */}
          <div className="h-[280px] w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={societyDistributionData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }}
                  axisLine={{ stroke: '#e2e8f0' }}
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fill: '#64748b', fontSize: 11 }}
                  axisLine={{ stroke: '#e2e8f0' }}
                  tickLine={false}
                />
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-slate-900 text-white p-3 rounded-2xl shadow-xl border border-slate-700 text-xs space-y-1.5 font-sans">
                          <p className="font-extrabold text-cyan-300 text-sm">{data.fullName}</p>
                          <p className="text-slate-300 font-mono text-[11px]">{data.city}</p>
                          <div className="pt-1.5 border-t border-slate-700/80 space-y-1 font-mono text-xs">
                            <div className="flex items-center justify-between gap-4">
                              <span className="text-slate-400">Total Units:</span>
                              <span className="font-bold text-white">{data.units}</span>
                            </div>
                            <div className="flex items-center justify-between gap-4">
                              <span className="text-slate-400">Estimated Residents:</span>
                              <span className="font-bold text-emerald-400">{data.residents}</span>
                            </div>
                            <div className="flex items-center justify-between gap-4">
                              <span className="text-slate-400">Active Mobile Apps:</span>
                              <span className="font-bold text-blue-400">{data.activeAppUsers}</span>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend 
                  verticalAlign="top" 
                  align="right" 
                  wrapperStyle={{ paddingBottom: 12, fontSize: 11, fontWeight: 600 }} 
                />
                <Bar 
                  dataKey="residents" 
                  name="Est. Residents" 
                  fill="#2563eb" 
                  radius={[6, 6, 0, 0]} 
                  maxBarSize={36} 
                />
                <Bar 
                  dataKey="units" 
                  name="Total Flats" 
                  fill="#06b6d4" 
                  radius={[6, 6, 0, 0]} 
                  maxBarSize={36} 
                />
                <Bar 
                  dataKey="activeAppUsers" 
                  name="Active App Users" 
                  fill="#10b981" 
                  radius={[6, 6, 0, 0]} 
                  maxBarSize={36} 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Chart (5 cols): Deployment Lifecycle Pipeline (Pie Chart) */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <Building2 className="w-4 h-4 text-indigo-600" />
              <span>Society Installation Pipeline</span>
            </h3>
            <p className="text-xs text-slate-500">
              Distribution of live vs onboarding society instances
            </p>
          </div>

          {/* Donut Chart Container */}
          <div className="h-[280px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pipelineStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pipelineStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0];
                      return (
                        <div className="bg-slate-900 text-white p-2.5 rounded-xl shadow-lg border border-slate-700 text-xs">
                          <p className="font-bold text-cyan-300">{data.name}</p>
                          <p className="font-mono text-sm font-extrabold mt-0.5">{data.value} Societies</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  layout="horizontal"
                  wrapperStyle={{ fontSize: 11, fontWeight: 600, paddingTop: 10 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* =========================================================================
          CHART ROW 2: ACTIVE RESIDENT APP SESSIONS TREND (AREA CHART)
          ========================================================================= */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-600" />
              <span>Real-Time Resident Activity &amp; Gate Interactions Trend</span>
            </h3>
            <p className="text-xs text-slate-500">
              Aggregated daily active resident sessions, courier gate passes, and instant UPI bill settlements
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
            <span className="w-2 h-2 rounded-full bg-blue-500" /> Active Sessions
            <span className="w-2 h-2 rounded-full bg-cyan-400 ml-2" /> Visitor Passes
            <span className="w-2 h-2 rounded-full bg-emerald-500 ml-2" /> Dues Settled
          </div>
        </div>

        <div className="h-[250px] w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={activityTrendData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <defs>
                <linearGradient id="colorSessions" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0}/>
                </linearGradient>
                <linearGradient id="colorPasses" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0}/>
                </linearGradient>
                <linearGradient id="colorBills" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis 
                dataKey="period" 
                tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }}
                axisLine={{ stroke: '#e2e8f0' }}
                tickLine={false}
              />
              <YAxis 
                tick={{ fill: '#64748b', fontSize: 11 }}
                axisLine={{ stroke: '#e2e8f0' }}
                tickLine={false}
              />
              <Tooltip 
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-slate-900 text-white p-3 rounded-2xl shadow-xl border border-slate-700 text-xs space-y-1.5 font-sans">
                        <p className="font-extrabold text-cyan-300">{label}</p>
                        <div className="space-y-1 font-mono text-xs">
                          {payload.map((entry, idx) => (
                            <div key={idx} className="flex items-center justify-between gap-4">
                              <span style={{ color: entry.color }}>{entry.name}:</span>
                              <span className="font-bold text-white tabular-nums">{entry.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area 
                type="monotone" 
                dataKey="activeSessions" 
                name="App Sessions" 
                stroke="#2563eb" 
                strokeWidth={2.5}
                fillOpacity={1} 
                fill="url(#colorSessions)" 
              />
              <Area 
                type="monotone" 
                dataKey="gatePasses" 
                name="Visitor Passes" 
                stroke="#06b6d4" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorPasses)" 
              />
              <Area 
                type="monotone" 
                dataKey="billPayments" 
                name="Bill Payments" 
                stroke="#10b981" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorBills)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* =========================================================================
          PENDING PROVISIONING REQUESTS QUEUE TABLE
          ========================================================================= */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <h3 className="text-xl font-bold text-slate-900">
                Pending Provisioning &amp; Onboarding Queue
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Incoming RWA committee onboarding submissions awaiting DNS verification, legal KYC review, or cloud deployment
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
              {pendingRequestsCount} Pending Action
            </span>
          </div>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 border-b border-slate-200 font-bold">
              <tr>
                <th className="p-4">Society Name &amp; Location</th>
                <th className="p-4">Applicant &amp; Role</th>
                <th className="p-4">Units</th>
                <th className="p-4">Tier Plan</th>
                <th className="p-4">Current Status</th>
                <th className="p-4 text-right">Review &amp; Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {provisioningQueue.map((req) => (
                <tr key={req.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4">
                    <div>
                      <p className="font-bold text-slate-900 text-sm">{req.societyName}</p>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{req.city}</span>
                      </p>
                    </div>
                  </td>

                  <td className="p-4">
                    <div>
                      <p className="font-bold text-slate-800">{req.applicantName}</p>
                      <p className="text-[11px] text-blue-600 font-medium">{req.applicantRole}</p>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">{req.applicantPhone}</p>
                    </div>
                  </td>

                  <td className="p-4 font-mono font-bold text-slate-900">
                    {req.units} Flats
                  </td>

                  <td className="p-4">
                    <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-xl">
                      {req.packageTier}
                    </span>
                  </td>

                  <td className="p-4">
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full font-mono border ${
                      req.status === 'Approved'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                        : req.status === 'Rejected'
                        ? 'bg-rose-50 text-rose-700 border-rose-300'
                        : req.status === 'DNS Setup'
                        ? 'bg-cyan-50 text-cyan-800 border-cyan-300'
                        : 'bg-amber-50 text-amber-800 border-amber-300'
                    }`}>
                      ● {req.status}
                    </span>
                  </td>

                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {req.status !== 'Approved' && req.status !== 'Rejected' ? (
                        <>
                          <button
                            onClick={() => handleApproveRequest(req.id)}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1 cursor-pointer active:scale-95"
                            title="Approve and provision cluster immediately"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={() => setSelectedRequest(req)}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                            title="Inspect application details"
                          >
                            <span>Inspect</span>
                          </button>
                        </>
                      ) : (
                        <span className="text-xs font-bold text-slate-400 font-mono">
                          {req.status === 'Approved' ? '✓ Deployed' : '✗ Closed'}
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* =========================================================================
          INSPECT MODAL FOR PENDING PROVISIONING APPLICATION
          ========================================================================= */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 sm:p-7 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Review Provisioning Dossier</h3>
                  <p className="text-xs text-slate-500 font-mono">{selectedRequest.id}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedRequest(null)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Society Profile</span>
                <p className="font-extrabold text-slate-900 text-sm">{selectedRequest.societyName}</p>
                <p className="text-slate-600">{selectedRequest.city} · {selectedRequest.units} Residential Flats</p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-0.5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Applicant</span>
                  <p className="font-bold text-slate-900">{selectedRequest.applicantName}</p>
                  <p className="text-blue-600 font-medium">{selectedRequest.applicantRole}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-0.5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Contact</span>
                  <p className="font-mono text-slate-800">{selectedRequest.applicantPhone}</p>
                  <p className="text-slate-500 truncate">{selectedRequest.applicantEmail}</p>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Technical Notes</span>
                <p className="text-slate-700 leading-relaxed">{selectedRequest.notes}</p>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-100">
              <button
                onClick={() => handleRejectRequest(selectedRequest.id)}
                className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl transition-colors cursor-pointer border border-rose-200"
              >
                Reject Application
              </button>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={() => handleApproveRequest(selectedRequest.id)}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Approve &amp; Deploy Cluster</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
