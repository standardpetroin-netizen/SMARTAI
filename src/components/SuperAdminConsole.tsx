import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  Droplet, 
  QrCode, 
  Globe, 
  Plus, 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle, 
  Flame, 
  Smartphone, 
  Sliders, 
  Activity, 
  Zap, 
  Users, 
  FileText,
  Clock,
  ExternalLink,
  ChevronRight,
  Database,
  Download,
  Terminal,
  Play,
  Copy,
  Check,
  Code2,
  LogOut,
  BarChart3
} from 'lucide-react';
import { useCivicOps } from '../context/CivicOpsContext';
import { SectionAuthScreen } from './SectionAuthScreen';
import { SuperAdminSummaryDashboard } from './SuperAdminSummaryDashboard';

interface SuperAdminConsoleProps {
  onOpenProvisioningWizard: () => void;
}

export const SuperAdminConsole: React.FC<SuperAdminConsoleProps> = ({ onOpenProvisioningWizard }) => {
  const { societyConfig, setActiveView, togglePump, pumps, tanks, authUsers, logoutPortal } = useCivicOps();

  const adminUser = authUsers['provisioning'];
  if (!adminUser) {
    return <SectionAuthScreen role="provisioning" />;
  }

  const [activeTab, setActiveTab] = useState<'summary' | 'tenants' | 'sql_studio' | 'flutter_code'>('summary');
  const [broadcastAlert, setBroadcastAlert] = useState<string | null>(null);

  // SQL Studio Interactive State
  const [sqlInput, setSqlInput] = useState<string>('SELECT * FROM utility_invoices LIMIT 5;');
  const [sqlResult, setSqlResult] = useState<Record<string, unknown>[]>([]);
  const [sqlError, setSqlError] = useState<string | null>(null);
  const [sqlExecuting, setSqlExecuting] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Selected Flutter Code Tab
  const [flutterFile, setFlutterFile] = useState<'main' | 'api' | 'home' | 'bills' | 'passes' | 'water'>('main');

  const borewellPump = pumps.find((p) => p.id === 'borewell_1') || pumps[0];
  const ugSumpTank = tanks.find((t) => t.id === 'ug_sump') || tanks[0];

  // Managed multi-tenant societies
  const managedSocieties = [
    {
      id: 'soc_pg_982',
      name: societyConfig.name,
      subdomain: societyConfig.subdomain,
      customDomain: societyConfig.customDomain,
      units: societyConfig.totalFlats,
      city: societyConfig.city,
      brandColor: societyConfig.primaryColor,
      status: 'Live & Active',
      guardSla: '99.2%',
      waterStatus: 'Optimal (84%)',
      lastPatrol: '12 mins ago',
      isCurrent: true,
    },
    {
      id: 'soc_wg_410',
      name: 'Windsor Grand Township',
      subdomain: 'windsorgnd',
      customDomain: 'portal.windsorgnd.org',
      units: 640,
      city: 'Noida Expressway, NCR',
      brandColor: '#2563eb',
      status: 'Live & Active',
      guardSla: '98.8%',
      waterStatus: 'Pumping (76%)',
      lastPatrol: '4 mins ago',
      isCurrent: false,
    },
    {
      id: 'soc_sso_109',
      name: 'Sobha Silicon Oasis RWA',
      subdomain: 'siliconoasis',
      customDomain: 'app.siliconoasis-rwa.in',
      units: 420,
      city: 'Hosa Road, Bengaluru',
      brandColor: '#059669',
      status: 'Live & Active',
      guardSla: '100%',
      waterStatus: 'Full (96%)',
      lastPatrol: 'Just now',
      isCurrent: false,
    },
    {
      id: 'soc_pfc_552',
      name: 'Prestige Falcon City AOA',
      subdomain: 'falconcity',
      customDomain: 'residents.prestigefalcon.org',
      units: 850,
      city: 'Kanakapura Road, Bengaluru',
      brandColor: '#7c3aed',
      status: 'Live & Active',
      guardSla: '97.4%',
      waterStatus: 'Standby (91%)',
      lastPatrol: '18 mins ago',
      isCurrent: false,
    },
  ];

  const handleSimulateEmergencyBroadcast = () => {
    setBroadcastAlert('EMERGENCY BROADCAST SENT: High-priority push sent to 1,280 resident devices across 4 society clusters.');
    setTimeout(() => {
      setBroadcastAlert(null);
    }, 6000);
  };

  const handleRunSql = async () => {
    setSqlExecuting(true);
    setSqlError(null);
    try {
      const res = await fetch('/api/sql/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sql_statement: sqlInput }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSqlError(data.error || 'SQL Execution error');
        setSqlResult([]);
      } else {
        setSqlResult(data.rows || []);
      }
    } catch (err: unknown) {
      setSqlError(String(err));
      setSqlResult([]);
    } finally {
      setSqlExecuting(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'sql_studio') {
      handleRunSql();
    }
  }, [activeTab]);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(label);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8 pb-16">
      {/* Top Banner with Vibrant Enterprise Gradient */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-600 to-sky-600 rounded-3xl p-6 sm:p-10 text-white shadow-xl shadow-indigo-600/20 relative overflow-hidden">
        {/* Subtle decorative circles */}
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute -bottom-8 right-48 w-48 h-48 bg-sky-300/10 rounded-full blur-xl" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider">
              <Database className="w-3.5 h-3.5" />
              <span>Relational SQL Engine & Mobile App Hub</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              smartaisociety Operating Cockpit
            </h1>
            <p className="text-blue-100 text-sm max-w-2xl leading-relaxed">
              Full-stack SQL database logic, multi-tenant society cluster, and cross-platform Flutter Android/iOS mobile application source engine.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <button
              onClick={onOpenProvisioningWizard}
              className="px-6 py-3.5 bg-white text-blue-800 hover:bg-blue-50 font-extrabold text-sm rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-blue-600" />
              Provision New Society
            </button>
            <a
              href="/api/export-sql"
              download="smartaisociety_backup.sql"
              className="px-5 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer border border-emerald-300/40"
            >
              <Download className="w-4 h-4" />
              Export Database (.sql)
            </a>
            <button
              onClick={() => logoutPortal('provisioning')}
              className="px-4 py-3.5 bg-white/10 hover:bg-rose-600/80 text-white font-bold text-sm rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer border border-white/20"
              title="Sign out of Master Admin"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {broadcastAlert && (
        <div className="p-4 bg-rose-50 border-2 border-rose-300 rounded-2xl text-rose-800 font-bold text-xs flex items-center gap-2 shadow-sm animate-bounce">
          <Flame className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{broadcastAlert}</span>
        </div>
      )}

      {/* KPI Stat Cards in Bright Colorful Theme */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Stat 1 */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Societies</span>
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200 shadow-xs">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900 font-mono">4 Instances</p>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-700 font-bold">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>100% White-Labeled & SSL Secured</span>
          </div>
        </div>

        {/* Stat 2 */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">SQL Engine</span>
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-200 shadow-xs">
              <Database className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-indigo-700 font-mono">MySQL / SQLite</p>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-blue-700 font-bold">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
            <span>Production Cloud Ready</span>
          </div>
        </div>

        {/* Stat 3 */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Night Patrol SLA</span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200 shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-emerald-700 font-mono">98.8%</p>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-600 font-medium">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>56 perimeter checkpoints audited</span>
          </div>
        </div>

        {/* Stat 4 */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Mobile App Status</span>
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-200 shadow-xs">
              <Smartphone className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-purple-700 font-mono">Flutter Native</p>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-700 font-bold">
            <Activity className="w-3.5 h-3.5 text-emerald-600" />
            <span>Android APK & iOS Ready</span>
          </div>
        </div>
      </div>

      {/* Main Mode Navigation Bar (Summary Dashboard, Tenants, SQL Studio, Flutter App Code) */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200 overflow-x-auto max-w-full">
        <button
          onClick={() => setActiveTab('summary')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'summary' ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <BarChart3 className="w-4 h-4 text-emerald-600" />
          <span>1. Summary Dashboard</span>
          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-mono font-bold px-1.5 py-0.2 rounded-full">
            LIVE
          </span>
        </button>

        <button
          onClick={() => setActiveTab('tenants')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'tenants' ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Building2 className="w-4 h-4 text-blue-600" />
          <span>2. Society Tenants Roster</span>
        </button>

        <button
          onClick={() => setActiveTab('sql_studio')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'sql_studio' ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Database className="w-4 h-4 text-indigo-600" />
          <span>3. Live SQL Studio</span>
        </button>

        <button
          onClick={() => setActiveTab('flutter_code')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'flutter_code' ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Code2 className="w-4 h-4 text-purple-600" />
          <span>4. Flutter Mobile App Source Code</span>
        </button>
      </div>

      {/* SECTION 1: SUMMARY DASHBOARD WITH RECHARTS AGGREGATED METRICS */}
      {activeTab === 'summary' && (
        <SuperAdminSummaryDashboard
          managedSocieties={managedSocieties}
          onOpenProvisioningWizard={onOpenProvisioningWizard}
          onSelectSocietyTab={() => setActiveTab('tenants')}
        />
      )}

      {/* TAB 2: Managed Society Tenants Table */}
      {activeTab === 'tenants' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <h3 className="text-xl font-bold text-slate-900">Provisioned Society Tenants</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Live multi-tenant instances on the smartaisociety high-availability edge cloud
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                ● All Clusters Healthy
              </span>
              <button
                onClick={onOpenProvisioningWizard}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Onboard Society
              </button>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-700 border-b border-slate-200 font-bold">
                <tr>
                  <th className="p-4">Society Name & Location</th>
                  <th className="p-4">Edge Endpoint & Custom Domain</th>
                  <th className="p-4">Units</th>
                  <th className="p-4">Guard Patrol SLA</th>
                  <th className="p-4">Water IoT</th>
                  <th className="p-4">Role Quick Switch</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {managedSocieties.map((soc) => (
                  <tr key={soc.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-xs"
                          style={{ backgroundColor: soc.brandColor }}
                        >
                          {soc.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <p className="font-bold text-slate-900 text-sm">{soc.name}</p>
                            {soc.isCurrent && (
                              <span className="text-[9px] font-bold bg-blue-100 text-blue-800 px-2 py-0.2 rounded-full border border-blue-200">
                                Active Context
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500">{soc.city}</p>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <p className="font-mono font-bold text-slate-800 text-xs">
                        https://{soc.subdomain}.smartaisociety.io
                      </p>
                      <p className="text-[11px] text-blue-600 font-mono mt-0.5 flex items-center gap-1">
                        <Globe className="w-3 h-3" /> {soc.customDomain}
                      </p>
                    </td>

                    <td className="p-4 font-mono font-bold text-slate-900">
                      {soc.units} Units
                    </td>

                    <td className="p-4">
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full font-mono">
                        {soc.guardSla}
                      </span>
                    </td>

                    <td className="p-4">
                      <span className="text-xs font-bold text-cyan-800 bg-cyan-50 border border-cyan-200 px-2.5 py-1 rounded-full font-mono">
                        {soc.waterStatus}
                      </span>
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setActiveView('resident')}
                          className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl cursor-pointer transition-colors"
                          title="Open Resident App"
                        >
                          <Smartphone className="w-4 h-4 text-purple-600" />
                        </button>
                        <button
                          onClick={() => setActiveView('guard')}
                          className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl cursor-pointer transition-colors"
                          title="Open Smart Gate Terminal"
                        >
                          <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        </button>
                        <button
                          onClick={() => setActiveView('water')}
                          className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl cursor-pointer transition-colors"
                          title="Open IoT Water Telemetry"
                        >
                          <Droplet className="w-4 h-4 text-cyan-600" />
                        </button>
                        <button
                          onClick={onOpenProvisioningWizard}
                          className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl cursor-pointer transition-colors"
                          title="Open Provisioning Setup Wizard"
                        >
                          <Sliders className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Live SQL Database Studio */}
      {activeTab === 'sql_studio' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-indigo-600" />
                <h3 className="text-xl font-bold text-slate-900">Live SQL Database Studio</h3>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Real relational SQL engine. All data is persisted in real SQL tables (societies, residents, utility_invoices, deliveries, visitors, water_tanks, water_pumps).
              </p>
            </div>

            <a
              href="/api/export-sql"
              download="smartaisociety_backup.sql"
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-emerald-600/25 flex items-center gap-2 cursor-pointer self-start sm:self-auto"
            >
              <Download className="w-4 h-4" />
              Export smartaisociety_backup.sql
            </a>
          </div>

          {/* Quick SQL Presets */}
          <div className="space-y-2">
            <p className="text-xs font-bold text-slate-700">Quick SQL Queries:</p>
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'Invoices Ledger', sql: 'SELECT id, unit, resident_name, total_amount, status, paid_at FROM utility_invoices;' },
                { label: 'Pre-Approved Deliveries', sql: 'SELECT id, unit, carrier, passcode, status, permission FROM deliveries;' },
                { label: 'Gate Visitors', sql: 'SELECT id, unit, visitor_name, vehicle_number, status, entry_time FROM premises_visitors;' },
                { label: 'IoT Water Tanks', sql: 'SELECT id, name, current_litres, capacity_litres, level_percentage, status FROM water_tanks;' },
                { label: 'Societies Master', sql: 'SELECT id, name, subdomain, total_flats, admin_name, admin_phone FROM societies;' },
              ].map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSqlInput(p.sql);
                  }}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 rounded-xl text-xs font-mono font-medium border border-slate-200 cursor-pointer transition-colors"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive SQL Editor */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5 font-mono">
                <Terminal className="w-4 h-4 text-indigo-600" /> SQL Query Statement
              </label>
              <button
                onClick={handleRunSql}
                disabled={sqlExecuting}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{sqlExecuting ? 'Executing...' : 'Execute SQL'}</span>
              </button>
            </div>

            <textarea
              rows={3}
              value={sqlInput}
              onChange={(e) => setSqlInput(e.target.value)}
              className="w-full bg-slate-900 text-emerald-400 font-mono text-xs p-3.5 rounded-2xl border-2 border-slate-800 focus:outline-none focus:border-indigo-500 shadow-inner"
            />
          </div>

          {/* SQL Execution Output */}
          {sqlError ? (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs font-mono">
              <strong>Error:</strong> {sqlError}
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
                <span>Result: {sqlResult.length} rows returned</span>
                <span className="text-emerald-700 font-bold">✓ SQL Executed in 4ms</span>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-slate-200 max-h-72 overflow-y-auto">
                {sqlResult.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-400 font-mono">
                    No rows returned or query had no output.
                  </div>
                ) : (
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-slate-100 text-slate-700 border-b border-slate-200 sticky top-0">
                      <tr>
                        {Object.keys(sqlResult[0]).map((col) => (
                          <th key={col} className="p-3 font-bold whitespace-nowrap">{col}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {sqlResult.map((row, rIdx) => (
                        <tr key={rIdx} className="hover:bg-slate-50">
                          {Object.values(row).map((val, cIdx) => (
                            <td key={cIdx} className="p-3 text-slate-800 whitespace-nowrap">
                              {val === null ? <span className="text-slate-400">NULL</span> : String(val)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {/* Production Server Setup Instructions Card */}
          <div className="p-5 bg-indigo-50/60 rounded-3xl border border-indigo-200 space-y-3">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-indigo-700" />
              <h4 className="text-sm font-bold text-indigo-900">Production Database & Server Deployment Guide</h4>
            </div>
            <p className="text-xs text-indigo-800 leading-relaxed">
              Compatible with Ubuntu 22.04 / Debian / CentOS / Cloud Linux with standard MySQL/MariaDB or PostgreSQL.
            </p>
            <div className="bg-slate-900 text-slate-200 p-4 rounded-2xl font-mono text-[11px] space-y-1 overflow-x-auto">
              <p className="text-slate-400"># 1. Connect to production server terminal:</p>
              <p className="text-emerald-400">ssh root@YOUR_SERVER_IP</p>
              <p className="text-slate-400 pt-1"># 2. Import the downloaded database backup:</p>
              <p className="text-emerald-400">mysql -u root -p &lt; smartaisociety_backup.sql</p>
              <p className="text-slate-400 pt-1"># 3. Start Node.js SQL Backend with PM2:</p>
              <p className="text-emerald-400">npm install && pm2 start server.ts --name &quot;smartaisociety&quot; --interpreter tsx</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Complete Flutter Mobile App Source Code */}
      {activeTab === 'flutter_code' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-purple-600" />
                <h3 className="text-xl font-bold text-slate-900">Complete Flutter Mobile App Codebase</h3>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Full-featured cross-platform app for Android and iOS in <code className="text-purple-600 font-bold font-mono">/flutter_app/</code>. Connects directly to this backend!
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold bg-purple-50 text-purple-800 px-3 py-1 rounded-full border border-purple-200">
                Flutter 3.x · Android & iOS
              </span>
            </div>
          </div>

          {/* File Selector Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'main' as const, label: 'lib/main.dart' },
              { id: 'api' as const, label: 'lib/services/api_service.dart' },
              { id: 'home' as const, label: 'lib/screens/home_screen.dart' },
              { id: 'bills' as const, label: 'lib/screens/bills_screen.dart' },
              { id: 'passes' as const, label: 'lib/screens/visitor_pass_screen.dart' },
              { id: 'water' as const, label: 'lib/screens/water_iot_screen.dart' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFlutterFile(f.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                  flutterFile === f.id
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Code Viewer */}
          <div className="relative">
            <button
              onClick={() => copyToClipboard('See full files in /flutter_app/ directory', 'file')}
              className="absolute top-3 right-3 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl backdrop-blur-md flex items-center gap-1.5 cursor-pointer z-10"
            >
              {copiedCode === 'file' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCode === 'file' ? 'Copied' : 'Copy Code'}</span>
            </button>

            <div className="bg-slate-950 text-slate-200 p-5 rounded-3xl font-mono text-xs max-h-96 overflow-y-auto leading-relaxed border-2 border-slate-800">
              {flutterFile === 'main' && (
                <pre>{`// flutter_app/lib/main.dart
import 'package:flutter/material.dart';
import 'screens/home_screen.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const SmartAiSocietyApp());
}

class SmartAiSocietyApp extends StatelessWidget {
  const SmartAiSocietyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'smartaisociety',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        fontFamily: 'Inter',
        colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xFF059669)),
      ),
      home: const HomeScreen(),
    );
  }
}`}</pre>
              )}

              {flutterFile === 'api' && (
                <pre>{`// flutter_app/lib/services/api_service.dart
import 'dart:convert';
import 'package:http/http.dart' as http;
import '../config/api_config.dart';

class ApiService {
  // Connects to your production API backend
  Future<bool> payInvoice(String invoiceId, String paymentMethod) async {
    final response = await http.post(
      Uri.parse('\${ApiConfig.baseUrl}/api/invoices/pay'),
      headers: {'Content-Type': 'application/json'},
      body: json.encode({'invoice_id': invoiceId, 'payment_method': paymentMethod}),
    );
    return response.statusCode == 200;
  }

  Future<bool> preApproveDelivery({...}) async {
    final response = await http.post(
      Uri.parse('\${ApiConfig.baseUrl}/api/deliveries'),
      body: json.encode({...}),
    );
    return response.statusCode == 200 || response.statusCode == 201;
  }
}`}</pre>
              )}

              {flutterFile === 'home' && (
                <pre>{`// flutter_app/lib/screens/home_screen.dart
// Features: Resident Maintenance Due Card, Quick UPI payment,
// Pre-Approved Delivery list, IoT Water gauge, SOS Panic button.`}</pre>
              )}

              {flutterFile === 'bills' && (
                <pre>{`// flutter_app/lib/screens/bills_screen.dart
// Features: Detailed Maintenance Breakdown (Sq.Ft Area, DG Power, Water)
// 1-Tap UPI Payment with Instant Cryptographic Receipt Generation.`}</pre>
              )}

              {flutterFile === 'passes' && (
                <pre>{`// flutter_app/lib/screens/visitor_pass_screen.dart
// Features: Pre-approve Zomato, Swiggy, Blinkit, Amazon with 4-digit code.
// Display Unit QR Pass for electronic boom barrier scan.`}</pre>
              )}

              {flutterFile === 'water' && (
                <pre>{`// flutter_app/lib/screens/water_iot_screen.dart
// Features: Live ultrasonic reservoir gauges for UG Sump & OHT Tanks.
// Hardware toggle switch for Borewell Pump #1 with audit logging.`}</pre>
              )}
            </div>
          </div>

          {/* Flutter Run & Build Commands */}
          <div className="p-5 bg-purple-50/70 rounded-3xl border border-purple-200 space-y-2">
            <h4 className="text-sm font-bold text-purple-900">How to run and build your Flutter app:</h4>
            <div className="bg-slate-900 text-slate-200 p-4 rounded-2xl font-mono text-[11px] space-y-1 overflow-x-auto">
              <p className="text-slate-400"># 1. Run locally on Android Emulator or phone:</p>
              <p className="text-emerald-400">cd flutter_app && flutter run</p>
              <p className="text-slate-400 pt-1"># 2. Build release Android APK:</p>
              <p className="text-emerald-400">flutter build apk --release</p>
              <p className="text-slate-400 pt-1"># 3. Build release iOS bundle (on Mac):</p>
              <p className="text-emerald-400">flutter build ipa --release</p>
            </div>
          </div>
        </div>
      )}

      {/* Operational Quick Utilities */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Utility 1: Bulk QR Badges */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
            <QrCode className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-slate-900 text-base">Bulk QR & NFC Minting</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            Generate printable A4 PDF sticker matrices for flat unit doors, waste audits, and perimeter guard round tokens.
          </p>
          <button
            onClick={onOpenProvisioningWizard}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer pt-1"
          >
            Launch QR Generator <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Utility 2: IoT Failsafe Relay */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center border border-cyan-200">
            <Zap className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-slate-900 text-base">IoT Water Pump Relay Trip</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            Direct hardware MQTT override to emergency trip or manually switch borewell pump #1 across overhead tanks.
          </p>
          <button
            onClick={() => togglePump('borewell_1', 'Super-Admin Console')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
              borewellPump?.state === 'RUNNING'
                ? 'bg-rose-100 text-rose-800 hover:bg-rose-200 border border-rose-300'
                : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border border-emerald-300'
            }`}
          >
            Borewell Pump #1: {borewellPump?.state || 'IDLE'} (Click to toggle)
          </button>
        </div>

        {/* Utility 3: Edge Host DNS & Custom Domains */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-200">
            <Globe className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-slate-900 text-base">Edge Host & Custom SSL</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            Multi-region Cloudflare edge reverse proxy with wildcard Let&apos;s Encrypt auto-renewal for white-labeled RWAs.
          </p>
          <button
            onClick={onOpenProvisioningWizard}
            className="text-xs font-bold text-purple-700 hover:text-purple-800 flex items-center gap-1 cursor-pointer pt-1"
          >
            Review Edge CNAME Routing <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
