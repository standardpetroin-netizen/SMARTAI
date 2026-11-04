import React, { useState, useEffect } from 'react';
import { useCivicOps } from '../context/CivicOpsContext';
import { 
  Activity, 
  Battery, 
  Compass, 
  Navigation, 
  Crosshair, 
  Satellite, 
  Cpu, 
  Flame, 
  ShieldAlert, 
  Zap, 
  Video, 
  Camera, 
  RotateCw, 
  Pause, 
  Play, 
  Thermometer, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Sliders, 
  Maximize2,
  MapPin,
  Eye,
  Disc
} from 'lucide-react';

interface Waypoint {
  id: string;
  name: string;
  altitudeM: number;
  lat: number;
  lng: number;
  status: 'COMPLETED' | 'ACTIVE' | 'PENDING';
}

export const DroneLiveMonitoringDeck: React.FC = () => {
  const {
    droneTelemetry,
    colonyDroneConnection,
    activeDroneIncident,
    dispatchDroneIncident,
    triggerDroneDeterrent,
    setDroneThermalMode,
    executeDroneFlightCommand,
    showToast,
  } = useCivicOps();

  // Local simulated states for dynamic live telemetry
  const [liveSeconds, setLiveSeconds] = useState(0);
  const [altitudeOffset, setAltitudeOffset] = useState(0);
  const [speedOffset, setSpeedOffset] = useState(0);
  const [isRecording, setIsRecording] = useState(true);
  const [snapshotFlash, setSnapshotFlash] = useState(false);
  const [showBoundingBoxes, setShowBoundingBoxes] = useState(true);
  const [showReticle, setShowReticle] = useState(true);

  // Flight path waypoints around residential society perimeter
  const waypoints: Waypoint[] = [
    { id: 'WP-01', name: 'Clubhouse Helipad Dock (Base)', altitudeM: 0, lat: 12.9282, lng: 77.6831, status: 'COMPLETED' },
    { id: 'WP-02', name: 'West Wall & Sub-Basement', altitudeM: 35, lat: 12.9275, lng: 77.6815, status: 'COMPLETED' },
    { id: 'WP-03', name: 'North Wall Pillar 14 (Bougainvillea)', altitudeM: 45, lat: 12.9288, lng: 77.6828, status: 'ACTIVE' },
    { id: 'WP-04', name: 'East Gate 02 Service Bay', altitudeM: 38, lat: 12.9292, lng: 77.6845, status: 'PENDING' },
    { id: 'WP-05', name: 'Tower A-D Terrace Solar Inverter', altitudeM: 55, lat: 12.9284, lng: 77.6839, status: 'PENDING' },
    { id: 'WP-06', name: 'RTH Return Landing Circuit', altitudeM: 15, lat: 12.9282, lng: 77.6831, status: 'PENDING' },
  ];

  // Dynamic live clock and jitter simulator
  useEffect(() => {
    const timer = setInterval(() => {
      setLiveSeconds((prev) => prev + 1);
      // Subtle realistic micro-telemetry fluctuations
      setAltitudeOffset(Number(((Math.sin(Date.now() / 1500) * 0.4)).toFixed(1)));
      setSpeedOffset(Number(((Math.cos(Date.now() / 2000) * 0.8)).toFixed(1)));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const currentAlt = (droneTelemetry.altitudeMeters + altitudeOffset).toFixed(1);
  const currentSpeed = Math.max(0, droneTelemetry.speedKmh + speedOffset).toFixed(1);

  const handleTakeSnapshot = () => {
    setSnapshotFlash(true);
    showToast('Telemetry Snapshot Captured', `Archive frame saved with GPS tag: 12.9282°N, 77.6831°E (${currentAlt}m AGL)`, 'success');
    setTimeout(() => setSnapshotFlash(false), 300);
  };

  return (
    <div className="space-y-6 text-left">
      {/* Top Telemetry Header Bar */}
      <div className="bg-slate-900 text-white rounded-3xl p-5 border border-slate-800 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center font-bold">
            <Activity className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-500/40 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                LIVE TELEMETRY STREAM
              </span>
              <span className="text-xs font-mono text-slate-400">
                S/N: <strong className="text-slate-200">{colonyDroneConnection.serialNumber}</strong>
              </span>
            </div>
            <h3 className="text-lg font-black text-white mt-0.5">
              {colonyDroneConnection.manufacturer} {colonyDroneConnection.modelName} · Callsign: {colonyDroneConnection.callsign}
            </h3>
          </div>
        </div>

        {/* Quick Operations Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => executeDroneFlightCommand('HOVER')}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            <Pause className="w-3.5 h-3.5 text-amber-400" />
            <span>Hover</span>
          </button>
          <button
            onClick={() => executeDroneFlightCommand('RTH')}
            className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            <RotateCw className="w-3.5 h-3.5 text-amber-400" />
            <span>RTH</span>
          </button>
          <button
            onClick={() => triggerDroneDeterrent(true, true)}
            className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-sm shadow-rose-600/30"
          >
            <Zap className="w-3.5 h-3.5 text-amber-300" />
            <span>Strobe & Siren</span>
          </button>
          <button
            onClick={() => dispatchDroneIncident('Tripwire Laser #04', 'North Perimeter Bougainvillea', 'Unauthorized Intruder')}
            className="px-3 py-1.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Simulate Breach</span>
          </button>
        </div>
      </div>

      {/* Main Operations Deck: Video Feed Overlay (Left) + Flight Path Radar (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* =========================================================================
            LEFT PANEL: REAL-TIME VIDEO FEED OVERLAY WITH HUD
            ========================================================================= */}
        <div className="lg:col-span-7 space-y-3">
          <div className="bg-slate-950 rounded-3xl p-3 border border-slate-800 shadow-xl relative overflow-hidden">
            {/* Camera & Overlay Controls */}
            <div className="flex items-center justify-between px-3 py-2 border-b border-slate-800/80 text-xs font-mono text-slate-300 mb-2">
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 text-rose-500 font-bold">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                  {isRecording ? 'LIVE REC' : 'FEED ACTIVE'}
                </span>
                <span className="text-slate-500">|</span>
                <span>RTSP H.265 · 4K @ 60 FPS</span>
                <span className="text-slate-500">|</span>
                <span>14.8 Mbps</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowBoundingBoxes(!showBoundingBoxes)}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${showBoundingBoxes ? 'bg-cyan-900 text-cyan-300 border border-cyan-500/40' : 'bg-slate-800 text-slate-400'}`}
                >
                  AI Targets: {showBoundingBoxes ? 'ON' : 'OFF'}
                </button>
                <button
                  onClick={() => setShowReticle(!showReticle)}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${showReticle ? 'bg-cyan-900 text-cyan-300 border border-cyan-500/40' : 'bg-slate-800 text-slate-400'}`}
                >
                  HUD Reticle
                </button>
              </div>
            </div>

            {/* Video Canvas Stage with Overlays */}
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-black border border-slate-800/80">
              {/* Camera Flash effect when taking snapshot */}
              {snapshotFlash && (
                <div className="absolute inset-0 bg-white z-50 pointer-events-none transition-opacity duration-300" />
              )}

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

              {/* Center Tactical Crosshairs & Artificial Horizon Reticle */}
              {showReticle && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  {/* Artificial horizon pitch bars */}
                  <div className="relative w-48 h-48 border border-cyan-500/20 rounded-full flex items-center justify-center">
                    <div className="w-16 h-0.5 bg-cyan-400/80" />
                    <div className="w-2 h-2 rounded-full border-2 border-cyan-400 absolute" />
                    <div className="w-16 h-0.5 bg-cyan-400/80" />
                    {/* Pitch ladders */}
                    <div className="absolute -top-6 w-8 h-0.5 bg-cyan-400/50" />
                    <div className="absolute -bottom-6 w-8 h-0.5 bg-cyan-400/50" />
                  </div>
                </div>
              )}

              {/* Overlaid AI Target Detection Bounding Boxes */}
              {showBoundingBoxes && (
                <>
                  {/* Target 1: Human Intruder Heat Signature */}
                  <div className="absolute top-[28%] left-[45%] border-2 border-rose-500 bg-rose-500/10 rounded-lg p-2 animate-pulse pointer-events-none shadow-lg">
                    <div className="flex items-center gap-1.5 text-[10px] font-mono font-black text-rose-300 bg-rose-950/80 px-1.5 py-0.5 rounded border border-rose-700">
                      <Crosshair className="w-3 h-3 text-rose-400" />
                      <span>TARGET #01: HUMAN INTRUDER (36.8°C)</span>
                    </div>
                    <div className="text-[9px] font-mono text-slate-200 mt-1 space-y-0.5 bg-slate-950/60 p-1 rounded">
                      <div>Zone: North Boundary Shrubbery (Pillar 14)</div>
                      <div>Dist: 34.2m · Threat: HIGH · Conf: 97.4%</div>
                    </div>
                  </div>

                  {/* Target 2: Resident Vehicle at East Gate */}
                  <div className="absolute bottom-[22%] right-[12%] border border-cyan-400 bg-cyan-500/10 rounded-lg p-1.5 pointer-events-none">
                    <div className="flex items-center gap-1 text-[9px] font-mono font-bold text-cyan-300 bg-slate-950/80 px-1 py-0.5 rounded">
                      <span>VEHICLE: KA-03-MG-4122 (RESIDENT)</span>
                    </div>
                    <div className="text-[9px] font-mono text-slate-300 mt-0.5">Speed: 14 km/h · Authorized</div>
                  </div>
                </>
              )}

              {/* Top-Left OSD Telemetry HUD */}
              <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-xs p-2.5 rounded-xl border border-slate-800 text-[11px] font-mono text-slate-200 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-cyan-400 font-bold">ALT:</span>
                  <span className="font-extrabold text-white">{currentAlt} M AGL</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-cyan-400 font-bold">SPD:</span>
                  <span className="font-extrabold text-white">{currentSpeed} KM/H</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-cyan-400 font-bold">HDG:</span>
                  <span className="text-amber-300 font-bold">312° (NW)</span>
                </div>
              </div>

              {/* Top-Right OSD GNSS & Sensor Telemetry */}
              <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-xs p-2.5 rounded-xl border border-slate-800 text-[11px] font-mono text-slate-200 space-y-1 text-right">
                <div className="flex items-center justify-end gap-1.5 text-emerald-400 font-bold">
                  <Satellite className="w-3.5 h-3.5" />
                  <span>26 SATS (RTK FIXED)</span>
                </div>
                <div className="text-slate-300 text-[10px]">
                  12.9288° N, 77.6828° E
                </div>
                <div className="text-rose-400 font-bold text-[10px]">
                  MODE: {droneTelemetry.thermalMode}
                </div>
              </div>

              {/* Bottom HUD Bar on Video */}
              <div className="absolute bottom-3 inset-x-3 bg-slate-950/85 backdrop-blur-xs p-2 rounded-xl border border-slate-800 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 text-amber-300 font-bold">
                    <Battery className="w-4 h-4 text-amber-400" />
                    <span>{droneTelemetry.batteryPct}% (22.84V)</span>
                  </div>
                  <span className="text-slate-500 hidden sm:inline">|</span>
                  <span className="text-slate-300 hidden sm:inline text-[11px]">
                    Est. Flight Left: <strong className="text-cyan-300">~38 Mins</strong>
                  </span>
                </div>

                {/* Video action overlays */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleTakeSnapshot}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-lg text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-all active:scale-95"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Snapshot</span>
                  </button>
                  <button
                    onClick={() => {
                      const modes: ('OPTICAL_4K' | 'FLIR_IRONBOW' | 'FLIR_WHITE_HOT' | 'IR_NIGHT_VISION')[] = [
                        'OPTICAL_4K', 'FLIR_IRONBOW', 'FLIR_WHITE_HOT', 'IR_NIGHT_VISION'
                      ];
                      const next = modes[(modes.indexOf(droneTelemetry.thermalMode) + 1) % modes.length];
                      setDroneThermalMode(next);
                    }}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-rose-300 rounded-lg text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-all active:scale-95"
                  >
                    <Thermometer className="w-3.5 h-3.5" />
                    <span>Cycle Palette</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            RIGHT PANEL: INTERACTIVE FLIGHT PATH RADAR & MISSION MAP
            ========================================================================= */}
        <div className="lg:col-span-5 space-y-3">
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold text-blue-600 uppercase tracking-wider block">
                  RTK Vector Navigation
                </span>
                <h4 className="text-base font-black text-slate-900 flex items-center gap-1.5">
                  <Navigation className="w-4 h-4 text-blue-600" />
                  <span>Perimeter Flight Path Radar</span>
                </h4>
              </div>

              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-xl bg-blue-50 text-blue-700 border border-blue-200">
                Waypoints: 3/6 Active
              </span>
            </div>

            {/* Tactical Vector Radar SVG Stage */}
            <div className="relative aspect-square sm:h-72 w-full rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center p-3">
              <svg className="w-full h-full" viewBox="0 0 300 300">
                {/* Concentric radar range circles */}
                <circle cx="150" cy="150" r="130" fill="none" stroke="#1e293b" strokeWidth="1" strokeDasharray="3 3" />
                <circle cx="150" cy="150" r="90" fill="none" stroke="#1e293b" strokeWidth="1" />
                <circle cx="150" cy="150" r="50" fill="none" stroke="#1e293b" strokeWidth="1" strokeDasharray="2 2" />

                {/* Radar axis crosslines */}
                <line x1="150" y1="10" x2="150" y2="290" stroke="#1e293b" strokeWidth="1" />
                <line x1="10" y1="150" x2="290" y2="150" stroke="#1e293b" strokeWidth="1" />

                {/* Colony Boundary Wall Polygon (Green dashed border) */}
                <polygon
                  points="45,45 255,45 265,255 35,255"
                  fill="rgba(56, 189, 248, 0.04)"
                  stroke="#0284c7"
                  strokeWidth="1.5"
                  strokeDasharray="4 2"
                />

                {/* Tower blocks footprint */}
                <rect x="70" y="70" width="40" height="40" rx="4" fill="#334155" />
                <text x="90" y="94" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="monospace">TWR A</text>

                <rect x="190" y="70" width="40" height="40" rx="4" fill="#334155" />
                <text x="210" y="94" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="monospace">TWR B</text>

                <rect x="70" y="190" width="40" height="40" rx="4" fill="#334155" />
                <text x="90" y="214" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="monospace">TWR C</text>

                <rect x="190" y="190" width="40" height="40" rx="4" fill="#334155" />
                <text x="210" y="214" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="monospace">TWR D</text>

                {/* Central Clubhouse & Roof Helipad Base Dock */}
                <circle cx="150" cy="150" r="16" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />
                <text x="150" y="154" fill="#38bdf8" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="monospace">H</text>

                {/* Flight Path Route Trajectory Polyline */}
                <polyline
                  points="150,150 45,210 135,45 255,140 200,90"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="2"
                  strokeLinecap="round"
                />

                {/* Waypoint 1 (Dock) */}
                <circle cx="150" cy="150" r="4" fill="#22c55e" />
                {/* Waypoint 2 (West) */}
                <circle cx="45" cy="210" r="4" fill="#22c55e" />
                {/* Waypoint 3 (North - ACTIVE TARGET) */}
                <circle cx="135" cy="45" r="7" fill="none" stroke="#f43f5e" strokeWidth="2" className="animate-ping" />
                <circle cx="135" cy="45" r="4" fill="#f43f5e" />
                {/* Waypoint 4 (East Gate) */}
                <circle cx="255" cy="140" r="4" fill="#64748b" />
                {/* Waypoint 5 (Solar Terrace) */}
                <circle cx="200" cy="90" r="4" fill="#64748b" />

                {/* Animated Drone Position Marker at Waypoint 3 */}
                <g transform="translate(135, 45)">
                  {/* Directional Heading Cone */}
                  <polygon points="0,-18 -10,12 10,12" fill="rgba(56, 189, 248, 0.3)" />
                  {/* Drone Quadcopter Body */}
                  <circle cx="0" cy="0" r="5" fill="#0284c7" stroke="#ffffff" strokeWidth="1.5" />
                  <line x1="-8" y1="-8" x2="8" y2="8" stroke="#38bdf8" strokeWidth="1.5" />
                  <line x1="8" y1="-8" x2="-8" y2="8" stroke="#38bdf8" strokeWidth="1.5" />
                </g>
              </svg>

              {/* Radar Corner Coordinates Tag */}
              <div className="absolute bottom-2 left-2 text-[10px] font-mono text-cyan-400 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800">
                P3: 12.9288° N · 77.6828° E (45m)
              </div>
            </div>

            {/* Waypoint Steps List */}
            <div className="space-y-1.5 text-xs font-mono">
              {waypoints.slice(0, 4).map((wp, idx) => (
                <div
                  key={wp.id}
                  className={`p-2 rounded-xl flex items-center justify-between border ${
                    wp.status === 'ACTIVE'
                      ? 'bg-rose-50 border-rose-300 text-rose-900 font-bold'
                      : wp.status === 'COMPLETED'
                      ? 'bg-slate-50 border-slate-200 text-slate-700'
                      : 'bg-white border-slate-100 text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-slate-200 text-slate-800 flex items-center justify-center text-[10px] font-bold">
                      {idx + 1}
                    </span>
                    <span className="truncate max-w-[170px]">{wp.name}</span>
                  </div>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                    wp.status === 'ACTIVE' ? 'bg-rose-600 text-white animate-pulse' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {wp.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          BOTTOM TELEMETRY MATRIX DECK (BATTERY, SENSORS, POWER, DOCK HEALTH)
          ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Battery Subsystem Card */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">6S LiPo Battery Subsystem</span>
            <Battery className="w-4 h-4 text-emerald-600" />
          </div>

          <div className="space-y-1">
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-black text-slate-900 font-mono">{droneTelemetry.batteryPct}%</span>
              <span className="text-xs font-mono font-bold text-emerald-600">22.84 V (Healthy)</span>
            </div>
            {/* Visual Battery Level Bar */}
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                style={{ width: `${droneTelemetry.batteryPct}%` }}
              />
            </div>
          </div>

          <div className="space-y-1 text-[11px] font-mono text-slate-600 pt-1 border-t border-slate-100">
            <div className="flex justify-between">
              <span>Cell Delta:</span>
              <strong className="text-emerald-700">&lt; 0.02V Balanced</strong>
            </div>
            <div className="flex justify-between">
              <span>Discharge Power:</span>
              <strong className="text-slate-800">324 W (14.2 A)</strong>
            </div>
            <div className="flex justify-between">
              <span>Pack Temp:</span>
              <strong className="text-slate-800">28.6°C (Optimal)</strong>
            </div>
            <div className="flex justify-between">
              <span>Time Remaining:</span>
              <strong className="text-blue-600 font-bold">~38 Mins 20s</strong>
            </div>
          </div>
        </div>

        {/* Flight Kinematics & Aerodynamics */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Flight Dynamics & Aero</span>
            <Compass className="w-4 h-4 text-blue-600" />
          </div>

          <div className="space-y-1">
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-black text-slate-900 font-mono">{currentAlt}<span className="text-sm font-bold text-slate-400">m</span></span>
              <span className="text-xs font-mono font-bold text-blue-600">{currentSpeed} km/h</span>
            </div>
            <p className="text-[11px] text-slate-500 font-sans">
              Barometric reference: 1013.2 hPa · Ceiling limit: 120m AGL
            </p>
          </div>

          <div className="space-y-1 text-[11px] font-mono text-slate-600 pt-1 border-t border-slate-100">
            <div className="flex justify-between">
              <span>Vertical Climb Rate:</span>
              <strong className="text-slate-800">+0.4 m/s</strong>
            </div>
            <div className="flex justify-between">
              <span>Attitude (Pitch/Roll):</span>
              <strong className="text-slate-800">-2.4° / +1.1°</strong>
            </div>
            <div className="flex justify-between">
              <span>Wind Speed at Alt:</span>
              <strong className="text-emerald-700">7.2 km/h (Stable)</strong>
            </div>
            <div className="flex justify-between">
              <span>GNSS Precision:</span>
              <strong className="text-purple-600">RTK Fixed (0.6 cm)</strong>
            </div>
          </div>
        </div>

        {/* Payloads & Deterrent Status */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Sensors & Deterrent Array</span>
            <Eye className="w-4 h-4 text-rose-600" />
          </div>

          <div className="space-y-1">
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-slate-900 font-mono">FLIR Boson</span>
              <span className="text-xs font-mono font-bold text-rose-600">640x512 Core</span>
            </div>
            <p className="text-[11px] text-slate-500 font-sans">
              Radiometric thermal tracking body heat across boundary wall
            </p>
          </div>

          <div className="space-y-1 text-[11px] font-mono text-slate-600 pt-1 border-t border-slate-100">
            <div className="flex justify-between">
              <span>Optical Zoom:</span>
              <strong className="text-slate-800">4K UHD (20x Optical)</strong>
            </div>
            <div className="flex justify-between">
              <span>Laser Altimeter:</span>
              <strong className="text-emerald-700">Locked (45.18m)</strong>
            </div>
            <div className="flex justify-between">
              <span>12,000lm Strobe:</span>
              <strong className="text-amber-600 font-bold">Armed / Standby</strong>
            </div>
            <div className="flex justify-between">
              <span>110dB Siren:</span>
              <strong className="text-slate-800">Ready for Intercept</strong>
            </div>
          </div>
        </div>

        {/* Base Dock & Environmental Health */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Automated Roof Dock</span>
            <Cpu className="w-4 h-4 text-cyan-600" />
          </div>

          <div className="space-y-1">
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-slate-900 font-mono">DOCK-01</span>
              <span className="text-xs font-mono font-bold text-emerald-600">Standby Ready</span>
            </div>
            <p className="text-[11px] text-slate-500 font-sans truncate">
              {colonyDroneConnection.dockStationId}
            </p>
          </div>

          <div className="space-y-1 text-[11px] font-mono text-slate-600 pt-1 border-t border-slate-100">
            <div className="flex justify-between">
              <span>Motorized Roof Hatch:</span>
              <strong className="text-emerald-700">Weatherproof Sealed</strong>
            </div>
            <div className="flex justify-between">
              <span>Fast-Charge Station:</span>
              <strong className="text-slate-800">1200W Induction Ready</strong>
            </div>
            <div className="flex justify-between">
              <span>Base Anemometer:</span>
              <strong className="text-slate-800">4.1 knots (Clear)</strong>
            </div>
            <div className="flex justify-between">
              <span>Rain Precipitation:</span>
              <strong className="text-emerald-700">0.0 mm/hr (Dry)</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
