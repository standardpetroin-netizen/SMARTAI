import React, { useState } from 'react';
import { useCivicOps } from '../context/CivicOpsContext';
import { 
  Radio, 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  Eye, 
  Video, 
  Camera, 
  Zap, 
  Calendar, 
  Plus, 
  CheckCircle2, 
  Clock, 
  Battery, 
  Compass, 
  Play, 
  Pause, 
  Maximize2, 
  X, 
  Thermometer, 
  Sparkles, 
  Layers, 
  MapPin, 
  FileSpreadsheet, 
  Check, 
  SlidersHorizontal,
  ChevronRight,
  RotateCw,
  Search,
  Filter,
  Flame,
  Volume2,
  Cpu,
  Activity,
  Gauge,
  Server,
  Key,
  Lock,
  Wifi,
  AlertCircle,
  Crosshair,
  Navigation,
  Power,
  RefreshCw,
  Send,
  Satellite,
  Shield,
  Smartphone,
  ExternalLink
} from 'lucide-react';
import { Facility3DViewer } from './Facility3DViewer';
import { DroneLiveMonitoringDeck } from './DroneLiveMonitoringDeck';
import { DroneFlightLog, DroneScheduledPatrol, DronePresetModel, ColonyDroneConnection } from '../types';

export const DroneSurveillanceView: React.FC = () => {
  const {
    societyConfig,
    droneTelemetry,
    droneFlightLogs,
    droneScheduledPatrols,
    activeDroneIncident,
    dispatchDroneIncident,
    triggerDroneDeterrent,
    addDroneScheduledPatrol,
    toggleDroneScheduledPatrol,
    reviewDroneFlightLog,
    setDroneThermalMode,
    colonyDroneConnection,
    dronePresets,
    saveDroneConnection,
    testDroneConnection,
    disconnectDrone,
    executeDroneFlightCommand,
    showToast,
  } = useCivicOps();

  // Sub-Navigation Tabs inside Drone Module - Defaults to Live Monitoring Deck
  const [selectedSubTab, setSelectedSubTab] = useState<'live_monitoring' | 'fleet_connect' | 'cockpit' | 'thermal' | 'telemetry_matrix' | 'scheduled' | 'audit'>('live_monitoring');
  const [isSimulatingBreach, setIsSimulatingBreach] = useState(false);
  const [isDeterrentActive, setIsDeterrentActive] = useState(false);
  
  // Drone Configuration & Connection States
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [selectedPresetForConfig, setSelectedPresetForConfig] = useState<DronePresetModel | null>(null);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionTestResult, setConnectionTestResult] = useState<{
    success: boolean;
    pingMs: number;
    satellites: number;
    signalStrengthPct: number;
    diagnostics: { step: number; label: string; status: string; detail: string }[];
    message: string;
  } | null>(null);

  // Form Fields for Drone Connection Credentials
  const [formManufacturer, setFormManufacturer] = useState<string>(colonyDroneConnection.manufacturer);
  const [formModelName, setFormModelName] = useState<string>(colonyDroneConnection.modelName);
  const [formSerialNumber, setFormSerialNumber] = useState<string>(colonyDroneConnection.serialNumber);
  const [formCallsign, setFormCallsign] = useState<string>(colonyDroneConnection.callsign);
  const [formProtocol, setFormProtocol] = useState<string>(colonyDroneConnection.connectionProtocol);
  const [formApiEndpoint, setFormApiEndpoint] = useState<string>(colonyDroneConnection.apiEndpointOrHost);
  const [formApiKey, setFormApiKey] = useState<string>(colonyDroneConnection.apiKeyOrToken);
  const [formApiSecret, setFormApiSecret] = useState<string>(colonyDroneConnection.apiSecretOrPin || '');
  const [formRtspUrl, setFormRtspUrl] = useState<string>(colonyDroneConnection.rtspVideoStreamUrl);
  const [formDockId, setFormDockId] = useState<string>(colonyDroneConnection.dockStationId);
  const [formTelemetryPort, setFormTelemetryPort] = useState<number>(colonyDroneConnection.telemetryPort);
  const [formRthLat, setFormRthLat] = useState<number>(colonyDroneConnection.rthLatitude);
  const [formRthLng, setFormRthLng] = useState<number>(colonyDroneConnection.rthLongitude);
  const [formRthAlt, setFormRthAlt] = useState<number>(colonyDroneConnection.rthAltitudeMeters);
  const [formGeofence, setFormGeofence] = useState<number>(colonyDroneConnection.geofenceRadiusMeters);
  const [formNotes, setFormNotes] = useState<string>(colonyDroneConnection.notes || '');

  // Modals for Logs and Patrols
  const [selectedVideoLog, setSelectedVideoLog] = useState<DroneFlightLog | null>(null);
  const [selectedReviewLog, setSelectedReviewLog] = useState<DroneFlightLog | null>(null);
  const [reviewRemarks, setReviewRemarks] = useState('');
  const [isNewPatrolModalOpen, setIsNewPatrolModalOpen] = useState(false);

  // New Patrol Form States
  const [newPatrolName, setNewPatrolName] = useState('');
  const [newPatrolTime, setNewPatrolTime] = useState('02:00 AM');
  const [newFrequency, setNewFrequency] = useState('Daily Nightly');
  const [newFlightPath, setNewFlightPath] = useState('North Boundary Wall -> East Gate -> Shrubbery Blindspots');
  const [newSensorPayload, setNewSensorPayload] = useState('Optical 4K + FLIR Thermal + 12000lm Strobe');
  const [newAltitudeM, setNewAltitudeM] = useState(45);

  // Filters for Audit Log
  const [auditFilter, setAuditFilter] = useState<'ALL' | 'THREAT' | 'REVIEWED' | 'PENDING'>('ALL');
  const [auditSearch, setAuditSearch] = useState('');

  // Handle Preset Selection for Configuration
  const handleOpenConfigurePreset = (preset: DronePresetModel) => {
    setSelectedPresetForConfig(preset);
    setFormManufacturer(preset.manufacturer);
    setFormModelName(preset.model);
    setFormProtocol(preset.defaultProtocol);
    setFormApiEndpoint(preset.sampleEndpoint);
    setFormRtspUrl(preset.sampleRtsp);
    setFormSerialNumber(`${preset.manufacturer.slice(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}-RTK`);
    setFormCallsign(`SKY-${preset.manufacturer.split(' ')[0].toUpperCase()}-01`);
    setFormApiKey(`${preset.manufacturer.slice(0, 4).toLowerCase()}_api_live_${Math.random().toString(36).substring(2, 10)}`);
    setFormApiSecret(`sec_${Math.random().toString(36).substring(2, 8)}`);
    setConnectionTestResult(null);
    setIsConfigModalOpen(true);
  };

  // Quick Auto-Fill Recommended Production Preset
  const handleApplyPresetValues = () => {
    if (!selectedPresetForConfig) return;
    setFormApiEndpoint(selectedPresetForConfig.sampleEndpoint);
    setFormRtspUrl(selectedPresetForConfig.sampleRtsp);
    setFormDockId(`DOCK-ROOF-${selectedPresetForConfig.manufacturer.slice(0, 3).toUpperCase()}-01`);
    setFormNotes(`Selected by ${societyConfig.name} RWA Committee: ${selectedPresetForConfig.recommendedUse}`);
    showToast('Preset Applied', `Loaded recommended parameters for ${selectedPresetForConfig.model}`, 'info');
  };

  // Run Connection Handshake Diagnostic
  const handleRunDiagnosticTest = async () => {
    setIsTestingConnection(true);
    setConnectionTestResult(null);
    try {
      const result = await testDroneConnection({
        manufacturer: formManufacturer as any,
        modelName: formModelName,
        serialNumber: formSerialNumber,
        apiKeyOrToken: formApiKey,
        apiEndpointOrHost: formApiEndpoint,
        rtspVideoStreamUrl: formRtspUrl,
      });
      setConnectionTestResult(result);
    } catch {
      showToast('Handshake Diagnostic Warning', 'Telemetry bridge simulated with fallback parameters.', 'warning');
    } finally {
      setIsTestingConnection(false);
    }
  };

  // Save Drone Connection to Database
  const handleSaveConnection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formManufacturer || !formModelName || !formSerialNumber) return;

    await saveDroneConnection({
      manufacturer: formManufacturer as any,
      modelName: formModelName,
      serialNumber: formSerialNumber,
      callsign: formCallsign,
      connectionProtocol: formProtocol as any,
      apiEndpointOrHost: formApiEndpoint,
      apiKeyOrToken: formApiKey,
      apiSecretOrPin: formApiSecret,
      rtspVideoStreamUrl: formRtspUrl,
      dockStationId: formDockId,
      telemetryPort: Number(formTelemetryPort),
      rthLatitude: Number(formRthLat),
      rthLongitude: Number(formRthLng),
      rthAltitudeMeters: Number(formRthAlt),
      geofenceRadiusMeters: Number(formGeofence),
      notes: formNotes,
      isConnected: true,
      connectionStatus: 'ONLINE_TELEMETRY_LINKED',
    });

    setIsConfigModalOpen(false);
    setSelectedSubTab('cockpit');
  };

  // Handle Simulate Rapid Breach Response (< 5 min SLA)
  const handleTriggerSimulatedBreach = async () => {
    setIsSimulatingBreach(true);
    await dispatchDroneIncident(
      'PIR Laser Tripwire #04 (North Boundary Wall)',
      'North Perimeter & Shrubbery Blindspots (Pillar 14)',
      'Unauthorized Human Heat Signature (36.8°C)'
    );
    setTimeout(() => {
      setIsSimulatingBreach(false);
    }, 2500);
  };

  // Handle Active Deterrence (Strobe & Siren)
  const handleTriggerDeterrent = async () => {
    setIsDeterrentActive(true);
    await triggerDroneDeterrent(true, true);
    setTimeout(() => {
      setIsDeterrentActive(false);
    }, 4500);
  };

  // Handle Save New Scheduled Patrol
  const handleCreatePatrol = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPatrolName) return;

    await addDroneScheduledPatrol({
      societyId: societyConfig.id,
      patrolName: newPatrolName,
      patrolTime: newPatrolTime,
      frequency: newFrequency,
      flightPath: newFlightPath,
      sensorPayload: newSensorPayload,
      altitudeM: Number(newAltitudeM),
      status: 'Active',
      nextRun: `Tonight ${newPatrolTime}`
    });

    setNewPatrolName('');
    setIsNewPatrolModalOpen(false);
  };

  // Handle RWA Investigation Review Submission
  const handleSubmitRwaReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReviewLog) return;

    await reviewDroneFlightLog(selectedReviewLog.id, reviewRemarks || 'Certified and cleared by RWA Security Committee.');
    setSelectedReviewLog(null);
    setReviewRemarks('');
  };

  // Filtered audit logs
  const filteredAuditLogs = droneFlightLogs.filter((log) => {
    if (auditFilter === 'THREAT' && !log.threatDetected) return false;
    if (auditFilter === 'REVIEWED' && !log.rwaReviewed) return false;
    if (auditFilter === 'PENDING' && log.rwaReviewed) return false;
    if (auditSearch) {
      const q = auditSearch.toLowerCase();
      return (
        log.missionId.toLowerCase().includes(q) ||
        log.perimeterZone.toLowerCase().includes(q) ||
        log.triggerSource.toLowerCase().includes(q) ||
        log.verificationStatus.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* =========================================================================
          TOP COMMAND HERO BANNER: BRAND EMBLEM & REAL-TIME CONNECTION STATUS
          ========================================================================= */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 rounded-3xl p-6 text-white border border-slate-800 shadow-xl relative overflow-hidden">
        {/* Ambient atmospheric glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl text-left">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                AUTONOMOUS DRONE SURVEILLANCE SUITE
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
                SLA: &lt; 5 MIN LAUNCH
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-purple-950/80 text-purple-300 border border-purple-500/30">
                CLOUD AUDIT LINKED
              </span>
            </div>

            <div className="flex items-center gap-3 pt-1">
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                {colonyDroneConnection.modelName}
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Managed directly from {societyConfig.name} panel. Colony chooses manufacturer ({colonyDroneConnection.manufacturer}), provides cloud API credentials, and establishes encrypted RTK telemetry for &lt; 5 min SLA autonomous perimeter breach intercepts and FLIR night sweeps.
            </p>
          </div>

          {/* Quick Action Dispatch & Deterrent Controls */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setSelectedSubTab('fleet_connect')}
              className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold text-xs rounded-2xl border border-cyan-500/30 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
              title="Select Drone Manufacturer & Configure Credentials"
            >
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>Switch / Configure Drone</span>
            </button>

            <button
              onClick={handleTriggerSimulatedBreach}
              disabled={isSimulatingBreach}
              className="px-4 py-3 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-extrabold text-xs rounded-2xl shadow-lg shadow-rose-600/30 transition-all flex items-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
              title="Test rapid incident response: launches drone within 5-min SLA and broadcasts live alerts"
            >
              <ShieldAlert className={`w-4 h-4 ${isSimulatingBreach ? 'animate-bounce' : ''}`} />
              <span>{isSimulatingBreach ? 'Launching Drone...' : 'Simulate Laser Breach Alert'}</span>
            </button>

            <button
              onClick={handleTriggerDeterrent}
              className="px-4 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-2xl shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
              title="Engage 12,000-lumen strobe deterrent & 110dB acoustic siren"
            >
              <Zap className={`w-4 h-4 text-slate-950 ${isDeterrentActive ? 'animate-spin' : ''}`} />
              <span>{isDeterrentActive ? 'Strobe & Siren Flashing!' : 'Active Deterrence (Strobe)'}</span>
            </button>
          </div>
        </div>

        {/* Live Flight Telemetry & Hardware Strip */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-left">
          <div className="bg-slate-900/80 border border-slate-800 p-2.5 rounded-xl backdrop-blur-xs">
            <span className="text-[10px] font-mono text-slate-400 block uppercase">Brand & Callsign</span>
            <span className="text-xs font-mono font-extrabold text-cyan-300 truncate block">
              {colonyDroneConnection.manufacturer} · {colonyDroneConnection.callsign}
            </span>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-2.5 rounded-xl backdrop-blur-xs">
            <span className="text-[10px] font-mono text-slate-400 block uppercase">Telemetry Link</span>
            <span className="text-xs font-mono font-extrabold text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              {colonyDroneConnection.isConnected ? `ONLINE (${colonyDroneConnection.pingLatencyMs}ms)` : 'STANDBY'}
            </span>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-2.5 rounded-xl backdrop-blur-xs">
            <span className="text-[10px] font-mono text-slate-400 block uppercase">Battery Reserve</span>
            <span className="text-xs font-mono font-extrabold text-amber-300 flex items-center gap-1">
              <Battery className="w-3.5 h-3.5 text-amber-400" />
              {droneTelemetry.batteryPct}% (6S LiPo)
            </span>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-2.5 rounded-xl backdrop-blur-xs">
            <span className="text-[10px] font-mono text-slate-400 block uppercase">Altitude / Speed</span>
            <span className="text-xs font-mono font-extrabold text-white">
              {droneTelemetry.altitudeMeters}m · {droneTelemetry.speedKmh} km/h
            </span>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-2.5 rounded-xl backdrop-blur-xs">
            <span className="text-[10px] font-mono text-slate-400 block uppercase">RTK Satellites</span>
            <span className="text-xs font-mono font-extrabold text-emerald-300 flex items-center gap-1">
              <Satellite className="w-3.5 h-3.5 text-emerald-400" />
              26 Satellites (Fixed RTK)
            </span>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-2.5 rounded-xl backdrop-blur-xs">
            <span className="text-[10px] font-mono text-slate-400 block uppercase">Base Helipad Dock</span>
            <span className="text-xs font-mono font-bold text-slate-200 truncate block">
              {colonyDroneConnection.dockStationId}
            </span>
          </div>
        </div>
      </div>

      {/* =========================================================================
          NAVIGATION TABS
          ========================================================================= */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200">
        {[
          { id: 'live_monitoring', label: 'Live Monitoring Deck', icon: Activity, badge: '● LIVE' },
          { id: 'fleet_connect', label: 'Colony Drone Fleet & Credentials', icon: Cpu, badge: 'Connect' },
          { id: 'cockpit', label: '3D Perimeter Twin & Air Cockpit', icon: Layers },
          { id: 'thermal', label: 'Nighttime FLIR Thermal Vision', icon: Thermometer },
          { id: 'telemetry_matrix', label: 'Live Telemetry Matrix & Dock Health', icon: Gauge },
          { id: 'scheduled', label: `Scheduled Patrols (${droneScheduledPatrols.length})`, icon: Calendar },
          { id: 'audit', label: `Flight Audit Logs (${droneFlightLogs.length})`, icon: FileSpreadsheet },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = selectedSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSelectedSubTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200/80'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-extrabold ${
                  tab.id === 'live_monitoring'
                    ? 'bg-emerald-500 text-white animate-pulse'
                    : 'bg-blue-100 text-blue-700'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* =========================================================================
          SUB-TAB 0: LIVE MONITORING DECK (REAL-TIME TELEMETRY, VIDEO HUD & FLIGHT PATH)
          ========================================================================= */}
      {selectedSubTab === 'live_monitoring' && (
        <DroneLiveMonitoringDeck />
      )}

      {/* =========================================================================
          SUB-TAB 1: COLONY DRONE FLEET SELECTION & API CREDENTIALS CONNECTION
          ========================================================================= */}
      {selectedSubTab === 'fleet_connect' && (
        <div className="space-y-6 text-left">
          {/* Active Drone Connection Details Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-slate-900 text-cyan-400 flex items-center justify-center shrink-0 shadow-md">
                  <Radio className="w-7 h-7 animate-pulse" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-blue-100 text-blue-800 border border-blue-200">
                      CURRENTLY CONNECTED DRONE
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                      {colonyDroneConnection.connectionStatus}
                    </span>
                    <span className="text-xs font-mono text-slate-500">
                      Ping: <strong>{colonyDroneConnection.pingLatencyMs}ms</strong> · Signal: <strong>{colonyDroneConnection.signalStrengthPct}%</strong>
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                    {colonyDroneConnection.modelName}
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Manufacturer: <strong>{colonyDroneConnection.manufacturer}</strong> · S/N: <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-800">{colonyDroneConnection.serialNumber}</code> · Protocol: <strong>{colonyDroneConnection.connectionProtocol}</strong>
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handleRunDiagnosticTest}
                  disabled={isTestingConnection}
                  className="px-4 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs rounded-xl border border-blue-200 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <Activity className={`w-4 h-4 ${isTestingConnection ? 'animate-spin' : ''}`} />
                  <span>{isTestingConnection ? 'Testing Diagnostic...' : 'Test Connection Link'}</span>
                </button>
                <button
                  onClick={() => {
                    const preset = dronePresets.find(p => p.manufacturer === colonyDroneConnection.manufacturer) || dronePresets[0];
                    handleOpenConfigurePreset(preset);
                  }}
                  className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <Key className="w-4 h-4 text-cyan-400" />
                  <span>Edit Credentials</span>
                </button>
                <button
                  onClick={disconnectDrone}
                  className="px-3.5 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl border border-rose-200 transition-all cursor-pointer"
                  title="Disconnect Drone from Colony"
                >
                  Disconnect
                </button>
              </div>
            </div>

            {/* Connection Telemetry Parameters Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-5 text-xs">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Cloud API Endpoint</span>
                <span className="font-mono font-semibold text-slate-800 truncate block mt-0.5" title={colonyDroneConnection.apiEndpointOrHost}>
                  {colonyDroneConnection.apiEndpointOrHost || 'Direct MAVLink Bridge'}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">API Key / Cloud Secret</span>
                <span className="font-mono font-semibold text-slate-800 flex items-center gap-1 mt-0.5">
                  <Lock className="w-3 h-3 text-slate-400" />
                  ••••••••{colonyDroneConnection.apiKeyOrToken.slice(-4) || 'AUTH'}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Live RTSP Video Stream</span>
                <span className="font-mono font-semibold text-slate-800 truncate block mt-0.5" title={colonyDroneConnection.rtspVideoStreamUrl}>
                  {colonyDroneConnection.rtspVideoStreamUrl || 'RTSP feed online'}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Helipad Safe RTH Geofence</span>
                <span className="font-mono font-semibold text-slate-800 block mt-0.5">
                  {colonyDroneConnection.rthAltitudeMeters}m Alt · {colonyDroneConnection.geofenceRadiusMeters}m Radius
                </span>
              </div>
            </div>

            {/* Diagnostic Terminal View if test run */}
            {connectionTestResult && (
              <div className="mt-5 p-4 bg-slate-950 rounded-2xl border border-slate-800 text-white font-mono text-xs space-y-2">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    {connectionTestResult.message}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Ping: {connectionTestResult.pingMs}ms · Satellites: {connectionTestResult.satellites} · Signal: {connectionTestResult.signalStrengthPct}%
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 pt-1 text-[11px]">
                  {connectionTestResult.diagnostics.map((diag) => (
                    <div key={diag.step} className="bg-slate-900 p-2 rounded-lg border border-slate-800 flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-slate-200 block">{diag.label}</span>
                        <span className="text-slate-400 text-[10px]">{diag.detail}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Section Heading: Select Drone Manufacturer */}
          <div className="space-y-1">
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-blue-600" />
              <span>Colony Drone Selection: Choose Your Society's Quadcopter Manufacturer</span>
            </h3>
            <p className="text-xs text-slate-600">
              Colony committees can choose whichever company's drone they prefer. Our panel securely accepts the drone's API credentials, dock ID, and live stream URL to connect instantly.
            </p>
          </div>

          {/* Manufacturer Presets Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {dronePresets.map((preset) => {
              const isCurrent = colonyDroneConnection.manufacturer === preset.manufacturer;
              return (
                <div
                  key={preset.manufacturer}
                  className={`bg-white rounded-3xl p-5 border transition-all flex flex-col justify-between relative shadow-xs ${
                    isCurrent
                      ? 'border-blue-500 ring-2 ring-blue-500/20 bg-blue-50/20'
                      : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                          {preset.country}
                        </span>
                        <h4 className="text-base font-black text-slate-900 mt-1">
                          {preset.manufacturer}
                        </h4>
                        <p className="text-xs font-bold text-blue-600">
                          {preset.model}
                        </p>
                      </div>

                      {isCurrent && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300">
                          ACTIVE
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {preset.tagline}
                    </p>

                    {/* Specs Pills */}
                    <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 font-mono">
                      <div className="bg-slate-50 p-2 rounded-xl border border-slate-200/80">
                        <span className="text-[9px] text-slate-400 block uppercase">Max Endurance</span>
                        <span className="font-extrabold text-slate-800">{preset.maxFlightTimeMinutes} Mins</span>
                      </div>
                      <div className="bg-slate-50 p-2 rounded-xl border border-slate-200/80">
                        <span className="text-[9px] text-slate-400 block uppercase">Wind Resistance</span>
                        <span className="font-extrabold text-slate-800">{preset.maxWindResistanceMps} m/s</span>
                      </div>
                      <div className="bg-slate-50 p-2 rounded-xl border border-slate-200/80 col-span-2">
                        <span className="text-[9px] text-slate-400 block uppercase">Camera & FLIR Thermal</span>
                        <span className="font-semibold text-slate-800 truncate block">{preset.cameraPayload}</span>
                      </div>
                    </div>

                    {/* Feature Tags */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {preset.features.map((feat) => (
                        <span key={feat} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium">
                          {feat}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100">
                    <button
                      onClick={() => handleOpenConfigurePreset(preset)}
                      className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        isCurrent
                          ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20'
                          : 'bg-slate-900 hover:bg-slate-800 text-white'
                      }`}
                    >
                      <Key className="w-3.5 h-3.5 text-cyan-300" />
                      <span>{isCurrent ? 'Reconfigure Credentials' : `Select & Enter Credentials`}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =========================================================================
          SUB-TAB 2: 3D DIGITAL TWIN & FLIGHT COCKPIT
          ========================================================================= */}
      {selectedSubTab === 'cockpit' && (
        <div className="space-y-6 text-left">
          {/* Active Incident Alert Banner if breach is underway */}
          {activeDroneIncident && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left shadow-sm animate-pulse">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-md">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-rose-600 text-white">
                      PERIMETER BREACH ACTIVE
                    </span>
                    <span className="text-xs font-bold text-slate-900">{activeDroneIncident.location}</span>
                  </div>
                  <p className="text-xs text-rose-800 mt-1">
                    Triggered by: <strong>{activeDroneIncident.triggerSensor}</strong>. Drone ETA to coordinates: <strong>{activeDroneIncident.etaSeconds}s</strong>. FLIR body heat: <strong>{activeDroneIncident.thermalReadingCelsius}°C</strong>.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  onClick={handleTriggerDeterrent}
                  className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer"
                >
                  Fire 12,000lm Strobe
                </button>
                <button
                  onClick={() => showToast('Perimeter Secured', 'Intruder deterred. Guard Team Alpha deployed to boundary.', 'success')}
                  className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold rounded-xl transition-all cursor-pointer"
                >
                  Mark Cleared
                </button>
              </div>
            </div>
          )}

          {/* Interactive Tactical Flight Command Control Bar */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-blue-600" />
                  <span>Tactical Flight Dispatch Controls ({colonyDroneConnection.modelName})</span>
                </h4>
                <p className="text-xs text-slate-500">
                  Command flight waypoints, hold position for detailed inspection, or order immediate return-to-home.
                </p>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-mono bg-slate-100 text-slate-700 px-2.5 py-1 rounded-xl">
                  Flight Mode: <strong className="text-blue-600">{droneTelemetry.status}</strong>
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <button
                onClick={() => executeDroneFlightCommand('TAKEOFF', { zone: 'Perimeter Boundary Air Corridor', altitude: 45, speed: 28 })}
                className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <Play className="w-3.5 h-3.5 text-emerald-400" />
                <span>Launch Takeoff</span>
              </button>

              <button
                onClick={() => executeDroneFlightCommand('HOVER')}
                className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <Pause className="w-3.5 h-3.5 text-amber-500" />
                <span>Hover & Hold</span>
              </button>

              <button
                onClick={() => executeDroneFlightCommand('PATROL_ZONE', { zone: 'North Boundary Wall (Pillar 14)', altitude: 42, speed: 30 })}
                className="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <Crosshair className="w-3.5 h-3.5 text-blue-600" />
                <span>Patrol North Wall</span>
              </button>

              <button
                onClick={() => executeDroneFlightCommand('PATROL_ZONE', { zone: 'East Gate 02 Service Bay', altitude: 38, speed: 26 })}
                className="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <Crosshair className="w-3.5 h-3.5 text-blue-600" />
                <span>Patrol East Gate</span>
              </button>

              <button
                onClick={() => executeDroneFlightCommand('PATROL_ZONE', { zone: 'Clubhouse Roof Helipad Nest', altitude: 55, speed: 22 })}
                className="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <Crosshair className="w-3.5 h-3.5 text-blue-600" />
                <span>Patrol Clubhouse Roof</span>
              </button>

              <button
                onClick={() => executeDroneFlightCommand('RTH')}
                className="px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <RotateCw className="w-3.5 h-3.5 text-amber-600" />
                <span>Return to Home (RTH)</span>
              </button>

              <button
                onClick={handleTriggerDeterrent}
                className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer active:scale-95 ml-auto"
              >
                <Zap className="w-3.5 h-3.5 text-amber-300" />
                <span>Strobe & Siren</span>
              </button>
            </div>
          </div>

          {/* Main 3D Canvas Box + HUD telemetry */}
          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-500 animate-ping" />
                  Interactive Digital Twin · Aerial Perimeter Feed
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-0.5">
                  Boundary Wall, Clubhouse Terrace & Blindspots Simulation
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-2xs">
                  Orbit: 45m AGL · 360° LiDAR Sweep
                </span>
              </div>
            </div>

            {/* Embedded Aerial Surveillance Photographic Feed */}
            <div className="relative w-full h-80 sm:h-[460px] rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-md group">
              <img
                src="https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=1600&q=85"
                alt="Autonomous Aerial Perimeter Surveillance"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-black/30 pointer-events-none" />

              {/* Optical HUD Crosshairs & Telemetry */}
              <div className="absolute top-4 left-4 flex items-center gap-2 bg-slate-950/80 border border-rose-500/50 px-3 py-1.5 rounded-xl backdrop-blur-md text-white">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                <span className="text-[11px] font-mono font-bold text-rose-300">
                  REAL-TIME PERIMETER AIR FEED · 4K OPTICAL + FLIR
                </span>
              </div>

              <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-xl text-white font-mono text-[11px] flex items-center gap-3">
                <span className="text-cyan-300">ALT: 45.2m AGL</span>
                <span className="text-slate-500">|</span>
                <span className="text-emerald-400">BATTERY: 84%</span>
                <span className="text-slate-500">|</span>
                <span className="text-amber-400">SAT: 18 FIX</span>
              </div>

              {/* Center Crosshair Target Overlay */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-32 h-32 border border-white/20 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-rose-500 rounded-full" />
                </div>
              </div>

              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-[11px] font-mono text-slate-200 bg-slate-950/80 border border-slate-800 p-3 rounded-xl backdrop-blur-md">
                <span>SECTOR: NORTH PERIMETER WALL · GPS 12.9248° N, 77.6745° E</span>
                <span className="text-emerald-400 font-bold">ALL WAYPOINTS SECURE · TRIPWIRE ARMED</span>
              </div>
            </div>

            {/* 3 Value Pillars under 3D Scene */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left pt-2">
              <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
                <div className="flex items-center gap-2 text-rose-600 mb-1.5 font-bold text-xs">
                  <Clock className="w-4 h-4" />
                  <span>5-Minute SLA Rapid Launch</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Upon any PIR sensor or CCTV tripwire trigger, the autonomous drone launches from its rooftop helipad within seconds, arriving at any perimeter coordinate in under 5 minutes.
                </p>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
                <div className="flex items-center gap-2 text-indigo-600 mb-1.5 font-bold text-xs">
                  <Eye className="w-4 h-4" />
                  <span>Zero Ground Blindspots</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Fixed ground cameras have dead zones behind boundary trees and terrace parapets. The drone’s elevated aerial angle provides unobstructed optical and infrared line-of-sight.
                </p>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
                <div className="flex items-center gap-2 text-emerald-600 mb-1.5 font-bold text-xs">
                  <Zap className="w-4 h-4" />
                  <span>Active Deterrence Mechanism</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  High-intensity 12,000-lumen pulsed strobe beams and 110dB acoustic sirens disorient intruders immediately, creating a psychological barrier that halts trespassing in progress.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SUB-TAB 3: NIGHTTIME FLIR THERMAL SURVEILLANCE
          ========================================================================= */}
      {selectedSubTab === 'thermal' && (
        <div className="space-y-6 text-left">
          <div className="bg-slate-950 text-white rounded-3xl p-6 border border-slate-800 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-rose-950 text-rose-300 border border-rose-800 flex items-center gap-1.5 w-fit">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                  FLIR BOSON RADIOMETRIC SENSOR STREAM
                </span>
                <h3 className="text-xl font-black text-white mt-2">
                  Nighttime Thermal Heat Signature & Human Detection
                </h3>
                <p className="text-xs text-slate-400">
                  Infrared thermography penetrates dense boundary bushes, shadows, and darkness, revealing living trespasser body temperatures (36.8°C - 37.5°C).
                </p>
              </div>

              {/* Thermal Mode Switcher */}
              <div className="flex flex-wrap items-center gap-2 bg-slate-900 p-1.5 rounded-2xl border border-slate-800">
                {[
                  { mode: 'OPTICAL_4K' as const, label: 'Optical 4K UHD' },
                  { mode: 'FLIR_IRONBOW' as const, label: 'FLIR Ironbow (Heatmap)' },
                  { mode: 'FLIR_WHITE_HOT' as const, label: 'FLIR White-Hot' },
                  { mode: 'IR_NIGHT_VISION' as const, label: 'IR Night Vision (Green)' },
                ].map((item) => (
                  <button
                    key={item.mode}
                    onClick={() => setDroneThermalMode(item.mode)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                      droneTelemetry.thermalMode === item.mode
                        ? 'bg-rose-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Video Viewport Stage with Target Lock Overlays */}
            <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 h-96 sm:h-[480px]">
              <video
                src="https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-city-traffic-at-night-41544-large.mp4"
                autoPlay
                loop
                muted
                playsInline
                className={`w-full h-full object-cover ${
                  droneTelemetry.thermalMode === 'FLIR_IRONBOW'
                    ? 'filter contrast-150 saturate-200 hue-rotate-180 invert-20'
                    : droneTelemetry.thermalMode === 'FLIR_WHITE_HOT'
                    ? 'filter grayscale contrast-200'
                    : droneTelemetry.thermalMode === 'IR_NIGHT_VISION'
                    ? 'filter sepia(100%) hue-rotate(90deg) contrast(150%)'
                    : ''
                }`}
              />

              {/* HUD Target Lock Bounding Box */}
              <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 border-2 border-rose-500 rounded-lg p-3 bg-rose-500/10 backdrop-blur-2xs animate-pulse">
                <div className="flex items-center justify-between gap-4 text-[11px] font-mono font-bold text-rose-300">
                  <span className="flex items-center gap-1">
                    <Crosshair className="w-3.5 h-3.5 text-rose-400" />
                    TARGET ACQUIRED: HUMAN
                  </span>
                  <span className="bg-rose-950 px-1.5 py-0.5 rounded text-rose-300 border border-rose-700">
                    36.8°C LOCK
                  </span>
                </div>
                <div className="text-[10px] font-mono text-slate-300 mt-1">
                  Zone: North Perimeter Bougainvillea Shrubbery · Distance: 34m
                </div>
              </div>

              {/* Corner OSD Telemetry HUD */}
              <div className="absolute top-4 left-4 font-mono text-xs text-cyan-300 bg-slate-950/80 p-3 rounded-xl border border-slate-800 space-y-1">
                <div>ALT: <strong className="text-white">{droneTelemetry.altitudeMeters}M AGL</strong></div>
                <div>SPD: <strong className="text-white">{droneTelemetry.speedKmh} KM/H</strong></div>
                <div>BAT: <strong className="text-amber-400">{droneTelemetry.batteryPct}%</strong></div>
                <div>PALETTE: <strong className="text-rose-400">{droneTelemetry.thermalMode}</strong></div>
              </div>

              {/* Active Deterrent Overlay Indicator */}
              {droneTelemetry.strobeDeterrentActive && (
                <div className="absolute inset-0 bg-white/30 animate-ping pointer-events-none" />
              )}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SUB-TAB 4: REAL-TIME TELEMETRY MATRIX & DOCK HEALTH
          ========================================================================= */}
      {selectedSubTab === 'telemetry_matrix' && (
        <div className="space-y-6 text-left">
          {/* Hardware Subsystems Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-bold uppercase">6S LiPo Battery Array</span>
                <Battery className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-3xl font-black text-slate-900 font-mono">{droneTelemetry.batteryPct}%</p>
              <div className="space-y-1 text-[11px] text-slate-600 font-mono pt-1">
                <div className="flex justify-between"><span>Voltage:</span><strong className="text-slate-800">22.84 V</strong></div>
                <div className="flex justify-between"><span>Cell Delta:</span><strong className="text-emerald-600">&lt; 0.02 V (Balanced)</strong></div>
                <div className="flex justify-between"><span>Pack Temp:</span><strong className="text-slate-800">28.4°C (Normal)</strong></div>
                <div className="flex justify-between"><span>Flight Left:</span><strong className="text-blue-600">~41 Mins</strong></div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-bold uppercase">4x Brushless ESC Motors</span>
                <Cpu className="w-4 h-4 text-blue-600" />
              </div>
              <p className="text-3xl font-black text-slate-900 font-mono">5,400 <span className="text-sm font-bold text-slate-400">RPM</span></p>
              <div className="space-y-1 text-[11px] text-slate-600 font-mono pt-1">
                <div className="flex justify-between"><span>Motor Temp:</span><strong className="text-slate-800">36.2°C</strong></div>
                <div className="flex justify-between"><span>Thrust Margin:</span><strong className="text-emerald-600">68% Reserve</strong></div>
                <div className="flex justify-between"><span>Vibration Level:</span><strong className="text-slate-800">0.04 g (Optimal)</strong></div>
                <div className="flex justify-between"><span>Propeller Health:</span><strong className="text-emerald-600">100% Certified</strong></div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-bold uppercase">Centimeter RTK GNSS</span>
                <Satellite className="w-4 h-4 text-purple-600" />
              </div>
              <p className="text-3xl font-black text-slate-900 font-mono">26 <span className="text-sm font-bold text-slate-400">SATS</span></p>
              <div className="space-y-1 text-[11px] text-slate-600 font-mono pt-1">
                <div className="flex justify-between"><span>Fix State:</span><strong className="text-emerald-600">RTK Fixed</strong></div>
                <div className="flex justify-between"><span>HDOP Precision:</span><strong className="text-slate-800">0.6 cm</strong></div>
                <div className="flex justify-between"><span>Compass Mag:</span><strong className="text-slate-800">0% Interference</strong></div>
                <div className="flex justify-between"><span>Baro Altitude:</span><strong className="text-slate-800">1013.2 hPa</strong></div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-bold uppercase">Automated Dock Station</span>
                <Server className="w-4 h-4 text-cyan-600" />
              </div>
              <p className="text-3xl font-black text-slate-900 font-mono">1,200 <span className="text-sm font-bold text-slate-400">W</span></p>
              <div className="space-y-1 text-[11px] text-slate-600 font-mono pt-1">
                <div className="flex justify-between"><span>Hatch Seal:</span><strong className="text-emerald-600">Weatherproof IP55</strong></div>
                <div className="flex justify-between"><span>Charge Cycle:</span><strong className="text-blue-600">Rapid Induction</strong></div>
                <div className="flex justify-between"><span>Rain Sensor:</span><strong className="text-slate-800">Dry (0 mm/h)</strong></div>
                <div className="flex justify-between"><span>Anemometer:</span><strong className="text-slate-800">7.2 km/h NW</strong></div>
              </div>
            </div>
          </div>

          {/* Connected Drone Protocol Spec Sheet */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h4 className="text-base font-black text-slate-900 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-blue-600" />
              <span>Telemetry Bridge Configuration & Cloud Handshake Parameters</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1.5">
                <span className="text-slate-500 font-bold block uppercase text-[10px]">Cloud Telemetry Protocol</span>
                <p className="font-extrabold text-slate-900">{colonyDroneConnection.connectionProtocol}</p>
                <p className="text-[11px] text-slate-600 font-sans">
                  Bi-directional encrypted WebSocket and TLS REST telemetry channel.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1.5">
                <span className="text-slate-500 font-bold block uppercase text-[10px]">Fail-Safe RTH Coordinates</span>
                <p className="font-extrabold text-slate-900">
                  {colonyDroneConnection.rthLatitude}° N, {colonyDroneConnection.rthLongitude}° E
                </p>
                <p className="text-[11px] text-slate-600 font-sans">
                  Automated return on low battery (&lt; 20%) or radio link loss.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1.5">
                <span className="text-slate-500 font-bold block uppercase text-[10px]">Firmware Version & RTK Base</span>
                <p className="font-extrabold text-slate-900">{colonyDroneConnection.firmwareVersion}</p>
                <p className="text-[11px] text-slate-600 font-sans">
                  Signed and verified firmware for commercial society air space.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SUB-TAB 5: SCHEDULED AERIAL PATROLS
          ========================================================================= */}
      {selectedSubTab === 'scheduled' && (
        <div className="space-y-6 text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-black text-slate-900">Automated Society Aerial Patrol Missions</h3>
              <p className="text-xs text-slate-500">Autonomous patrol routines executed on schedule by rooftop dock drone.</p>
            </div>

            <button
              onClick={() => setIsNewPatrolModalOpen(true)}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-blue-600/20 flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Add Scheduled Mission</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {droneScheduledPatrols.map((patrol) => (
              <div
                key={patrol.id}
                className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-mono font-bold text-blue-600 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200">
                      {patrol.patrolTime}
                    </span>
                    <button
                      onClick={() => toggleDroneScheduledPatrol(patrol.id, patrol.status === 'Active' ? 'Paused' : 'Active')}
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                        patrol.status === 'Active'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {patrol.status}
                    </button>
                  </div>

                  <h4 className="text-sm font-black text-slate-900">{patrol.patrolName}</h4>
                  <p className="text-xs text-slate-500">{patrol.frequency} · Altitude: <strong>{patrol.altitudeM}m</strong></p>

                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 text-[11px] font-mono text-slate-700">
                    <span className="text-[9px] text-slate-400 block uppercase">Flight Waypoints:</span>
                    {patrol.flightPath}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>Next: <strong className="text-slate-800">{patrol.nextRun}</strong></span>
                  <button
                    onClick={() => {
                      executeDroneFlightCommand('TAKEOFF', { zone: patrol.flightPath, altitude: patrol.altitudeM, speed: 28 });
                      showToast('Mission Dispatched', `Drone executing "${patrol.patrolName}" now.`, 'info');
                    }}
                    className="text-xs font-bold text-blue-600 hover:text-blue-800 cursor-pointer"
                  >
                    Run Mission Now →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          SUB-TAB 6: DRONE FLIGHT AUDIT LOGS & RWA SIGN-OFF
          ========================================================================= */}
      {selectedSubTab === 'audit' && (
        <div className="space-y-6 text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-black text-slate-900">Drone Flight Mission Audit Logs</h3>
              <p className="text-xs text-slate-500">Every autonomous dispatch is geo-referenced and stored in secure cloud logs.</p>
            </div>

            {/* Filter and search */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Search mission ID, zone..."
                value={auditSearch}
                onChange={(e) => setAuditSearch(e.target.value)}
                className="p-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600/30 w-48 sm:w-60"
              />
              <select
                value={auditFilter}
                onChange={(e) => setAuditFilter(e.target.value as any)}
                className="p-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600/30"
              >
                <option value="ALL">All Missions</option>
                <option value="THREAT">Threats Detected</option>
                <option value="PENDING">Pending Review</option>
                <option value="REVIEWED">RWA Certified</option>
              </select>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Mission ID</th>
                    <th className="py-3 px-4">Type / Trigger</th>
                    <th className="py-3 px-4">Zone</th>
                    <th className="py-3 px-4">Duration & Alt</th>
                    <th className="py-3 px-4">Thermal Status</th>
                    <th className="py-3 px-4">RWA Review</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredAuditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-mono font-extrabold text-blue-600">
                        {log.missionId}
                        <span className="block text-[10px] text-slate-400 font-normal">{log.startTime}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-slate-800 block">{log.triggerSource}</span>
                        <span className="text-[10px] text-slate-500">{log.missionType}</span>
                      </td>
                      <td className="py-3 px-4 text-slate-700 font-medium">
                        {log.perimeterZone}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-600">
                        {Math.floor(log.durationSeconds / 60)}m {log.durationSeconds % 60}s · {log.maxAltitudeMeters}m
                      </td>
                      <td className="py-3 px-4">
                        {log.threatDetected ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200 flex items-center gap-1 w-fit">
                            <Flame className="w-3 h-3 text-rose-600" />
                            {log.maxHeatTempCelsius}°C Heat
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1 w-fit">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Clean Sweep
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {log.rwaReviewed ? (
                          <span className="text-emerald-700 font-bold text-[11px] flex items-center gap-1">
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            Certified
                          </span>
                        ) : (
                          <span className="text-amber-600 font-bold text-[11px]">Pending Review</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedVideoLog(log)}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg cursor-pointer flex items-center gap-1"
                          >
                            <Video className="w-3.5 h-3.5" />
                            <span>Play Video</span>
                          </button>
                          {!log.rwaReviewed && (
                            <button
                              onClick={() => setSelectedReviewLog(log)}
                              className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg cursor-pointer"
                            >
                              Review
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 1: CONFIGURE DRONE CREDENTIALS & HANDSHAKE CONNECTION WIZARD
          ========================================================================= */}
      {isConfigModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs text-left">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full p-6 space-y-5 animate-in fade-in zoom-in-95 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
                  Colony Drone API Setup & Authentication
                </span>
                <h3 className="text-lg font-black text-slate-900">
                  Connect {formManufacturer} ({formModelName})
                </h3>
              </div>
              <button 
                onClick={() => setIsConfigModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveConnection} className="space-y-4 text-xs">
              <div className="bg-blue-50/70 p-3.5 rounded-2xl border border-blue-200 flex items-start justify-between gap-3">
                <div>
                  <p className="text-blue-900 font-bold">Colony Self-Service Configuration</p>
                  <p className="text-[11px] text-blue-700 mt-0.5">
                    Enter the drone’s serial number and API keys below. Our panel will establish the encrypted telemetry link with the drone base.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleApplyPresetValues}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shrink-0 cursor-pointer shadow-xs"
                >
                  Auto-fill Preset
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Quadcopter Callsign</label>
                  <input
                    type="text"
                    required
                    value={formCallsign}
                    onChange={(e) => setFormCallsign(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600/30"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Aircraft Serial Number (S/N)*</label>
                  <input
                    type="text"
                    required
                    value={formSerialNumber}
                    onChange={(e) => setFormSerialNumber(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600/30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Connection Protocol</label>
                  <select
                    value={formProtocol}
                    onChange={(e) => setFormProtocol(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-600/30"
                  >
                    <option value="DJI_CLOUD_API">DJI Cloud API / FlightHub 2</option>
                    <option value="GARUDA_FLEETLINK">Garuda FleetLink (BharatDrone RTK)</option>
                    <option value="SKYDIO_FLEET_REST">Skydio Fleet REST & Autonomy API</option>
                    <option value="IDEAFORGE_MAVLINK">ideaForge BlueSky GCS Stream</option>
                    <option value="AUTEL_SKYCOMMAND">Autel SkyCommand Center API</option>
                    <option value="ASTERIA_SKYDECK">Asteria SkyDeck Platform</option>
                    <option value="MAVLINK_UDP">Open MAVLink v2 Telemetry UDP</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Dock Station ID</label>
                  <input
                    type="text"
                    value={formDockId}
                    onChange={(e) => setFormDockId(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600/30"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Cloud API Endpoint or Host IP</label>
                <input
                  type="text"
                  required
                  value={formApiEndpoint}
                  onChange={(e) => setFormApiEndpoint(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-600/30"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">API Key / Token*</label>
                  <input
                    type="password"
                    required
                    value={formApiKey}
                    onChange={(e) => setFormApiKey(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-600/30"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Security PIN / Secret (Optional)</label>
                  <input
                    type="password"
                    value={formApiSecret}
                    onChange={(e) => setFormApiSecret(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-600/30"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">RTSP Video Stream URL</label>
                <input
                  type="text"
                  value={formRtspUrl}
                  onChange={(e) => setFormRtspUrl(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-600/30"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-600 block mb-1">RTH Latitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={formRthLat}
                    onChange={(e) => setFormRthLat(Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-600 block mb-1">RTH Longitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={formRthLng}
                    onChange={(e) => setFormRthLng(Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-600 block mb-1">Safe Transit Alt (m)</label>
                  <input
                    type="number"
                    value={formRthAlt}
                    onChange={(e) => setFormRthAlt(Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-600 block mb-1">Geofence (m)</label>
                  <input
                    type="number"
                    value={formGeofence}
                    onChange={(e) => setFormGeofence(Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                  />
                </div>
              </div>

              {/* Handshake Diagnostic Test Section */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleRunDiagnosticTest}
                  disabled={isTestingConnection}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer"
                >
                  <Activity className={`w-3.5 h-3.5 ${isTestingConnection ? 'animate-spin' : ''}`} />
                  <span>{isTestingConnection ? 'Testing Link...' : 'Test Connection Handshake'}</span>
                </button>

                {connectionTestResult && (
                  <span className="text-emerald-600 font-bold text-xs flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    Handshake Verified! (Ping: {connectionTestResult.pingMs}ms)
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsConfigModalOpen(false)}
                  className="flex-1 py-2.5 border border-slate-200 text-slate-600 text-xs font-bold rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-blue-600/30 cursor-pointer"
                >
                  Save & Connect Drone in SQL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: VIDEO LOG PLAYBACK
          ========================================================================= */}
      {selectedVideoLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xs text-left">
          <div className="bg-slate-950 text-white rounded-3xl border border-slate-800 shadow-2xl max-w-2xl w-full p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-mono text-cyan-400 font-bold uppercase">
                  MISSION ARCHIVE PLAYBACK: {selectedVideoLog.missionId}
                </span>
                <h3 className="text-base font-black text-white mt-0.5">{selectedVideoLog.perimeterZone}</h3>
              </div>
              <button
                onClick={() => setSelectedVideoLog(null)}
                className="p-1 text-slate-400 hover:text-white rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="rounded-2xl overflow-hidden bg-black aspect-video border border-slate-800">
              <video
                src={selectedVideoLog.videoArchiveUrl}
                controls
                autoPlay
                className="w-full h-full object-cover"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono text-slate-300">
              <div className="bg-slate-900 p-2 rounded-xl">Altitude: {selectedVideoLog.maxAltitudeMeters}m</div>
              <div className="bg-slate-900 p-2 rounded-xl">Duration: {selectedVideoLog.durationSeconds}s</div>
              <div className="bg-slate-900 p-2 rounded-xl">Status: {selectedVideoLog.verificationStatus}</div>
              <div className="bg-slate-900 p-2 rounded-xl">Heat: {selectedVideoLog.maxHeatTempCelsius || 'Ambient'}°C</div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 3: RWA INVESTIGATION REVIEW & CERTIFICATION
          ========================================================================= */}
      {selectedReviewLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs text-left">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-slate-900">RWA Security Committee Review</h3>
              <button
                onClick={() => setSelectedReviewLog(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Certify mission <strong>{selectedReviewLog.missionId}</strong> at <strong>{selectedReviewLog.perimeterZone}</strong> in the society security ledger.
            </p>

            <form onSubmit={handleSubmitRwaReview} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Investigation Findings & Action Taken*</label>
                <textarea
                  required
                  rows={3}
                  value={reviewRemarks}
                  onChange={(e) => setReviewRemarks(e.target.value)}
                  placeholder="e.g. Verified by RWA Security Convener. Perimeter fence reinforced and guard patrols increased."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-600/30"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedReviewLog(null)}
                  className="flex-1 py-2.5 border border-slate-200 text-slate-600 text-xs font-bold rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-emerald-600/20 cursor-pointer"
                >
                  Certify in SQL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 4: NEW SCHEDULED PATROL
          ========================================================================= */}
      {isNewPatrolModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs text-left">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-slate-900">Schedule New Aerial Patrol</h3>
              <button
                onClick={() => setIsNewPatrolModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePatrol} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Mission / Patrol Name*</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 03:00 AM West Wall & Sub-Basement Trench Sweep"
                  value={newPatrolName}
                  onChange={(e) => setNewPatrolName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-600/30"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Time (IST)</label>
                  <input
                    type="text"
                    required
                    placeholder="03:00 AM"
                    value={newPatrolTime}
                    onChange={(e) => setNewPatrolTime(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-600/30"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Altitude (Meters)</label>
                  <input
                    type="number"
                    min={20}
                    max={120}
                    value={newAltitudeM}
                    onChange={(e) => setNewAltitudeM(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-600/30"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Flight Path Waypoints</label>
                <input
                  type="text"
                  required
                  value={newFlightPath}
                  onChange={(e) => setNewFlightPath(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-600/30"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Sensor & Deterrent Payload</label>
                <input
                  type="text"
                  required
                  value={newSensorPayload}
                  onChange={(e) => setNewSensorPayload(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-600/30"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewPatrolModalOpen(false)}
                  className="flex-1 py-2.5 border border-slate-200 text-slate-600 text-xs font-bold rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-blue-600/20 cursor-pointer"
                >
                  Save Schedule in SQL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
