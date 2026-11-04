import React, { useState, useEffect, useRef } from 'react';
import { 
  MapPin, 
  Navigation, 
  ShieldCheck, 
  AlertTriangle, 
  Radio, 
  Crosshair, 
  Layers, 
  Maximize2, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw,
  Compass,
  Footprints,
  Eye,
  CheckCircle2,
  Signal,
  BatteryCharging
} from 'lucide-react';
import { useCivicOps } from '../context/CivicOpsContext';

interface GuardGeofenceMapProps {
  interactive?: boolean;
  className?: string;
  showOtherGuards?: boolean;
}

export const GuardGeofenceMap: React.FC<GuardGeofenceMapProps> = ({
  interactive = true,
  className = '',
  showOtherGuards = true,
}) => {
  const { 
    guardProfile, 
    guardRoster, 
    guardGeofence, 
    updateGuardLocation,
    triggerSecurityAlert,
    societyConfig,
    showToast
  } = useCivicOps();

  // Map view styling mode
  const [mapStyle, setMapStyle] = useState<'blueprint' | 'satellite' | 'street'>('blueprint');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [showCheckpoints, setShowCheckpoints] = useState<boolean>(true);
  const [showPatrolPath, setShowPatrolPath] = useState<boolean>(true);
  const [simulatedHeading, setSimulatedHeading] = useState<number>(45);

  // SVG dimensions
  const viewBoxWidth = 800;
  const viewBoxHeight = 520;

  // Society compound center
  const centerPoint = { x: 400, y: 260 };

  // Convert GPS coordinates or simulated offsets to SVG coordinates
  // Gate 01 is located at (400, 390) near south perimeter
  // If isWithinGeofence is true, guard is near Gate 01 (x: 400 + driftX, y: 390 + driftY)
  // If breached, guard coordinates are outside boundary (e.g., x: 400, y: 490)
  const [guardPos, setGuardPos] = useState<{ x: number; y: number }>({
    x: guardGeofence.isWithinGeofence ? 400 : 400,
    y: guardGeofence.isWithinGeofence ? 390 : 495,
  });

  // Track position changes when context changes
  useEffect(() => {
    if (guardGeofence.isWithinGeofence) {
      setGuardPos({ x: 400, y: 390 });
    } else {
      setGuardPos({ x: 400, y: 498 }); // Outside perimeter boundary
    }
  }, [guardGeofence.isWithinGeofence]);

  // Handle map click to reposition guard for simulation
  const handleMapClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!interactive) return;

    const svgRect = e.currentTarget.getBoundingClientRect();
    const clickX = ((e.clientX - svgRect.left) / svgRect.width) * viewBoxWidth;
    const clickY = ((e.clientY - svgRect.top) / svgRect.height) * viewBoxHeight;

    // Check if clicked point is inside society geofence polygon (box roughly 160-640 x, 100-430 y)
    const isInside = clickX >= 160 && clickX <= 640 && clickY >= 100 && clickY <= 430;
    const distFromGate = Math.round(Math.hypot(clickX - 400, clickY - 390) / 3.2);

    setGuardPos({ x: clickX, y: clickY });

    // Derive simulated GPS coordinates based on SVG click offset
    const baseLat = 12.9279;
    const baseLng = 77.6828;
    const newLat = baseLat + (260 - clickY) * 0.00003;
    const newLng = baseLng + (clickX - 400) * 0.00003;

    updateGuardLocation(
      Number(newLat.toFixed(5)),
      Number(newLng.toFixed(5)),
      isInside,
      distFromGate
    );

    if (!isInside && guardGeofence.isWithinGeofence) {
      showToast(
        '⚠️ Geofence Perimeter Breach Detected!',
        `Guard moved outside approved society boundary (+${distFromGate}m away). Breach alarm raised.`,
        'alert'
      );
      triggerSecurityAlert({
        societyId: societyConfig.id,
        guardId: guardProfile.id,
        guardName: `${guardProfile.name} (${guardProfile.assignedGate})`,
        alertType: 'GEOFENCE_BREACH',
        severity: 'HIGH',
        location: `Boundary Perimeter (Coordinates: ${newLat.toFixed(4)}, ${newLng.toFixed(4)})`,
        description: `Guard device drifted ${distFromGate}m outside geofence boundary. Unattended gate alert triggered.`,
      });
    } else if (isInside && !guardGeofence.isWithinGeofence) {
      showToast(
        '✓ Guard Returned to Perimeter',
        `Guard position verified within geofence boundaries (±${distFromGate}m from post).`,
        'success'
      );
    }
  };

  // Reset to Gate 01 Post
  const handleSnapToGate = () => {
    setGuardPos({ x: 400, y: 390 });
    updateGuardLocation(12.9279, 77.6828, true, 3);
    showToast('Guard Position Centered', 'Snap to Gate 01 Main Boom Barrier post (±3m Inside).', 'info');
  };

  // Force Drift Outside
  const handleDriftOutside = () => {
    setGuardPos({ x: 400, y: 498 });
    updateGuardLocation(12.9248, 77.6745, false, 86);
    showToast('Simulated Drift Triggered', 'Guard moved 86m outside gatehouse perimeter!', 'alert');
    triggerSecurityAlert({
      societyId: societyConfig.id,
      guardId: guardProfile.id,
      guardName: `${guardProfile.name} (${guardProfile.assignedGate})`,
      alertType: 'GEOFENCE_BREACH',
      severity: 'HIGH',
      location: 'Outside South Perimeter Gate',
      description: 'Guard device drifted outside active society geofence boundary.',
    });
  };

  // Key Checkpoints inside Society
  const checkpoints = [
    { id: 'cp_1', name: 'Gate 01 Boom Barrier', x: 400, y: 390, icon: 'barrier' },
    { id: 'cp_2', name: 'Gate 02 Delivery Bay', x: 620, y: 340, icon: 'gate' },
    { id: 'cp_3', name: 'Tower A Lobby Core', x: 280, y: 200, icon: 'tower' },
    { id: 'cp_4', name: 'Tower B Lobby Core', x: 520, y: 200, icon: 'tower' },
    { id: 'cp_5', name: 'Clubhouse & Pool Deck', x: 400, y: 150, icon: 'club' },
    { id: 'cp_6', name: 'STP Plant & DG Bay', x: 220, y: 360, icon: 'utility' },
    { id: 'cp_7', name: 'North Watch Pillar #4', x: 400, y: 100, icon: 'pillar' },
  ];

  return (
    <div className={`bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm flex flex-col ${className}`}>
      {/* Top Map HUD & Telemetry Header */}
      <div className="p-4 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-500/50 flex items-center justify-center text-blue-400 shrink-0">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-extrabold text-sm tracking-tight text-white flex items-center gap-1.5">
                <span>Real-Time Geofence Radar</span>
                <span className="text-[10px] font-mono bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2 py-0.5 rounded-full font-bold">
                  LIVE GPS HUD
                </span>
              </h4>
              <span
                className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                  guardGeofence.isWithinGeofence
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                    : 'bg-rose-500/20 text-rose-400 border-rose-500/40 animate-pulse'
                }`}
              >
                {guardGeofence.isWithinGeofence ? '● INSIDE GEOFENCE' : '▲ PERIMETER BREACH'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono mt-0.5 flex items-center gap-2 flex-wrap">
              <span>Lat: {guardProfile.currentLat.toFixed(4)}°N</span>
              <span>•</span>
              <span>Lng: {guardProfile.currentLng.toFixed(4)}°E</span>
              <span>•</span>
              <span>Offset: ±{guardGeofence.distanceMeters}m</span>
              <span>•</span>
              <span className="text-slate-300 flex items-center gap-1">
                <Signal className="w-3 h-3 text-emerald-400" /> HDOP 0.8
              </span>
            </p>
          </div>
        </div>

        {/* View Controls & Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Map Style Selector */}
          <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700 text-xs font-bold">
            {(['blueprint', 'satellite', 'street'] as const).map((style) => (
              <button
                key={style}
                onClick={() => setMapStyle(style)}
                className={`px-2.5 py-1 rounded-lg capitalize transition-colors cursor-pointer text-[11px] ${
                  mapStyle === style
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {style}
              </button>
            ))}
          </div>

          {/* Quick Simulation Buttons */}
          <button
            onClick={handleSnapToGate}
            className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
            title="Snap to Gate 01 barrier"
          >
            <Crosshair className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Center Post</span>
          </button>

          <button
            onClick={handleDriftOutside}
            className="px-2.5 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-bold rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
            title="Test drift outside geofence boundary"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            <span className="hidden sm:inline">Simulate Drift</span>
          </button>
        </div>
      </div>

      {/* SVG Canvas Map Area */}
      <div 
        className={`relative w-full h-[400px] overflow-hidden select-none cursor-crosshair transition-colors duration-500 ${
          mapStyle === 'satellite'
            ? 'bg-[#0f172a]'
            : mapStyle === 'street'
            ? 'bg-[#e2e8f0]'
            : 'bg-[#060c18]'
        }`}
      >
        <svg
          viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
          className="w-full h-full"
          onClick={handleMapClick}
        >
          <defs>
            {/* Blueprint Grid Pattern */}
            <pattern id="blueprintGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path 
                d="M 40 0 L 0 0 0 40" 
                fill="none" 
                stroke={mapStyle === 'street' ? '#cbd5e1' : 'rgba(30, 58, 138, 0.25)'} 
                strokeWidth="1" 
              />
            </pattern>

            {/* Radar Scan Gradient */}
            <radialGradient id="radarSweep" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
              <stop offset="70%" stopColor="#3b82f6" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
            </radialGradient>

            {/* Geofence Breach Pulse Gradient */}
            <radialGradient id="breachGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.5" />
              <stop offset="60%" stopColor="#f43f5e" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#f43f5e" stopOpacity="0" />
            </radialGradient>

            {/* Neon Geofence Glow Filter */}
            <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background Grid */}
          <rect width={viewBoxWidth} height={viewBoxHeight} fill="url(#blueprintGrid)" />

          {/* Surrounding Roads & Public Access */}
          <path
            d="M 40 460 Q 400 480 760 460"
            fill="none"
            stroke={mapStyle === 'street' ? '#94a3b8' : '#1e293b'}
            strokeWidth="38"
            strokeLinecap="round"
          />
          <path
            d="M 40 460 Q 400 480 760 460"
            fill="none"
            stroke={mapStyle === 'street' ? '#f8fafc' : '#334155'}
            strokeWidth="2"
            strokeDasharray="8 8"
          />
          <text 
            x="400" 
            y="488" 
            textAnchor="middle" 
            fill={mapStyle === 'street' ? '#64748b' : '#64748b'} 
            fontSize="10" 
            fontFamily="monospace"
            fontWeight="bold"
          >
            SARJAPUR MAIN ROAD (PUBLIC ACCESS ARTERIAL)
          </text>

          {/* Outer Geofence Tolerance Buffer Zone (Dashed) */}
          <rect
            x="130"
            y="70"
            width="540"
            height="380"
            rx="36"
            fill="none"
            stroke={guardGeofence.isWithinGeofence ? 'rgba(56, 189, 248, 0.25)' : 'rgba(244, 63, 94, 0.3)'}
            strokeWidth="1.5"
            strokeDasharray="6 6"
          />

          {/* Official Society Compound Perimeter (GEOFENCE BOUNDARY POLYGON) */}
          <rect
            x="160"
            y="95"
            width="480"
            height="330"
            rx="28"
            fill={
              mapStyle === 'satellite'
                ? 'rgba(15, 23, 42, 0.7)'
                : mapStyle === 'street'
                ? '#f1f5f9'
                : 'rgba(10, 25, 47, 0.75)'
            }
            stroke={guardGeofence.isWithinGeofence ? '#10b981' : '#f43f5e'}
            strokeWidth="3"
            filter="url(#neonGlow)"
          />

          {/* Geofence Boundary Label */}
          <g transform="translate(180, 118)">
            <rect x="0" y="0" width="170" height="20" rx="6" fill="rgba(0, 0, 0, 0.6)" />
            <text x="8" y="14" fill="#34d399" fontSize="10" fontWeight="bold" fontFamily="monospace">
              GEOFENCE PERIMETER: ±250m
            </text>
          </g>

          {/* Society Campus Buildings & Amenities Layout */}
          {/* Central Park / Green Lawn */}
          <rect
            x="320"
            y="210"
            width="160"
            height="130"
            rx="20"
            fill={mapStyle === 'street' ? '#dcfce7' : 'rgba(16, 185, 129, 0.12)'}
            stroke={mapStyle === 'street' ? '#86efac' : 'rgba(16, 185, 129, 0.3)'}
            strokeWidth="1.5"
          />
          <text 
            x="400" 
            y="280" 
            textAnchor="middle" 
            fill={mapStyle === 'street' ? '#15803d' : '#10b981'} 
            fontSize="11" 
            fontWeight="bold"
          >
            Central Green Lawn
          </text>

          {/* Tower A Block */}
          <g transform="translate(200, 160)">
            <rect
              width="100"
              height="90"
              rx="14"
              fill={mapStyle === 'street' ? '#ffffff' : 'rgba(30, 41, 59, 0.9)'}
              stroke={mapStyle === 'street' ? '#cbd5e1' : '#3b82f6'}
              strokeWidth="2"
            />
            <text x="50" y="45" textAnchor="middle" fill={mapStyle === 'street' ? '#0f172a' : '#ffffff'} fontSize="12" fontWeight="black">
              TOWER A
            </text>
            <text x="50" y="62" textAnchor="middle" fill="#64748b" fontSize="9" fontFamily="monospace">
              14 FLOORS
            </text>
          </g>

          {/* Tower B Block */}
          <g transform="translate(500, 160)">
            <rect
              width="100"
              height="90"
              rx="14"
              fill={mapStyle === 'street' ? '#ffffff' : 'rgba(30, 41, 59, 0.9)'}
              stroke={mapStyle === 'street' ? '#cbd5e1' : '#3b82f6'}
              strokeWidth="2"
            />
            <text x="50" y="45" textAnchor="middle" fill={mapStyle === 'street' ? '#0f172a' : '#ffffff'} fontSize="12" fontWeight="black">
              TOWER B
            </text>
            <text x="50" y="62" textAnchor="middle" fill="#64748b" fontSize="9" fontFamily="monospace">
              14 FLOORS
            </text>
          </g>

          {/* Clubhouse & Swimming Pool */}
          <g transform="translate(340, 115)">
            <rect
              width="120"
              height="55"
              rx="12"
              fill={mapStyle === 'street' ? '#e0f2fe' : 'rgba(14, 165, 233, 0.15)'}
              stroke="#0284c7"
              strokeWidth="1.5"
            />
            <text x="60" y="32" textAnchor="middle" fill="#0284c7" fontSize="10" fontWeight="bold">
              Clubhouse & Pool
            </text>
          </g>

          {/* Utility STP / DG Yard */}
          <g transform="translate(180, 330)">
            <rect
              width="80"
              height="60"
              rx="10"
              fill={mapStyle === 'street' ? '#fef3c7' : 'rgba(245, 158, 11, 0.12)'}
              stroke="#d97706"
              strokeWidth="1"
            />
            <text x="40" y="34" textAnchor="middle" fill="#d97706" fontSize="9" fontWeight="bold">
              STP & DG Bay
            </text>
          </g>

          {/* Patrol Route Polyline */}
          {showPatrolPath && (
            <path
              d="M 400 390 L 620 340 L 550 200 L 400 130 L 250 200 L 220 360 Z"
              fill="none"
              stroke="rgba(56, 189, 248, 0.4)"
              strokeWidth="2"
              strokeDasharray="4 4"
            />
          )}

          {/* Checkpoint Nodes */}
          {showCheckpoints && checkpoints.map((cp) => (
            <g key={cp.id} transform={`translate(${cp.x}, ${cp.y})`}>
              <circle r="6" fill="#0284c7" stroke="#ffffff" strokeWidth="2" />
              <text 
                x="0" 
                y="-10" 
                textAnchor="middle" 
                fill={mapStyle === 'street' ? '#1e293b' : '#94a3b8'} 
                fontSize="9" 
                fontFamily="sans-serif"
                fontWeight="600"
              >
                {cp.name}
              </text>
            </g>
          ))}

          {/* Gate 01 Boom Barrier Entry Portal */}
          <g transform="translate(370, 410)">
            <rect x="0" y="0" width="60" height="24" rx="8" fill="#2563eb" />
            <text x="30" y="16" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="black">
              GATE 01
            </text>
          </g>

          {/* Gate 02 Service Gate Portal */}
          <g transform="translate(630, 325)">
            <rect x="0" y="0" width="55" height="22" rx="6" fill="#475569" />
            <text x="27" y="15" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">
              GATE 02
            </text>
          </g>

          {/* Secondary Guard on Duty (Guard Deepesh Das at Gate 02) */}
          {showOtherGuards && guardRoster.filter(g => g.id !== guardProfile.id && g.isOnline).map((otherG) => (
            <g key={otherG.id} transform="translate(635, 335)" className="cursor-pointer">
              <circle r="12" fill="rgba(16, 185, 129, 0.25)" className="animate-ping" />
              <circle r="8" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
              <rect x="-35" y="12" width="70" height="16" rx="4" fill="rgba(15, 23, 42, 0.85)" />
              <text x="0" y="24" textAnchor="middle" fill="#34d399" fontSize="8" fontWeight="bold">
                {otherG.name.split(' ')[0]} (On Duty)
              </text>
            </g>
          ))}

          {/* CURRENT GUARD PERSONNEL REAL-TIME GPS MARKER */}
          <g transform={`translate(${guardPos.x}, ${guardPos.y})`}>
            {/* Accuracy / Radial Buffer Halo */}
            <circle
              r="28"
              fill={guardGeofence.isWithinGeofence ? 'url(#radarSweep)' : 'url(#breachGlow)'}
              className={guardGeofence.isWithinGeofence ? '' : 'animate-ping'}
            />

            {/* Radar Pulsing Wave Ring */}
            <circle
              r="18"
              fill="none"
              stroke={guardGeofence.isWithinGeofence ? '#38bdf8' : '#f43f5e'}
              strokeWidth="2"
              opacity="0.8"
              className="animate-pulse"
            />

            {/* Directional Heading Cone */}
            <path
              d="M 0 0 L -8 -22 L 8 -22 Z"
              fill={guardGeofence.isWithinGeofence ? '#38bdf8' : '#f43f5e'}
              opacity="0.8"
            />

            {/* Guard Pin Center Badge */}
            <circle
              r="12"
              fill={guardGeofence.isWithinGeofence ? '#2563eb' : '#e11d48'}
              stroke="#ffffff"
              strokeWidth="2.5"
              className="shadow-lg"
            />

            {/* Guard Icon or Shield Inside Pin */}
            <circle r="5" fill="#ffffff" />

            {/* Floating Live Nameplate Card */}
            <g transform="translate(0, -32)">
              <rect
                x="-65"
                y="-14"
                width="130"
                height="24"
                rx="6"
                fill={guardGeofence.isWithinGeofence ? 'rgba(15, 23, 42, 0.95)' : 'rgba(225, 29, 72, 0.95)'}
                stroke={guardGeofence.isWithinGeofence ? '#38bdf8' : '#ffffff'}
                strokeWidth="1.5"
              />
              <text
                x="0"
                y="2"
                textAnchor="middle"
                fill="#ffffff"
                fontSize="10"
                fontWeight="black"
              >
                {guardProfile.name}
              </text>
            </g>

            {/* Floating Distance Badge */}
            <g transform="translate(0, 24)">
              <rect
                x="-40"
                y="-6"
                width="80"
                height="16"
                rx="4"
                fill="rgba(0, 0, 0, 0.8)"
              />
              <text
                x="0"
                y="6"
                textAnchor="middle"
                fill={guardGeofence.isWithinGeofence ? '#34d399' : '#fda4af'}
                fontSize="9"
                fontFamily="monospace"
                fontWeight="bold"
              >
                {guardGeofence.isWithinGeofence ? `Inside (±${guardGeofence.distanceMeters}m)` : `BREACH (+${guardGeofence.distanceMeters}m)`}
              </text>
            </g>
          </g>
        </svg>

        {/* Real-time Watermark & Coordinates Overlay at Bottom-Left */}
        <div className="absolute bottom-3 left-3 bg-black/75 backdrop-blur-xs text-white p-2.5 rounded-2xl border border-white/10 text-[10px] font-mono space-y-1 z-10 pointer-events-none">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold">GEOFENCE RADAR v2.4</span>
            <span className="text-slate-400">100Hz TELEMETRY</span>
          </div>
          <p className="text-slate-300">
            Anchor: {societyConfig.name} Barrier Gatehouse
          </p>
          <p className="text-slate-400">
            Click anywhere on map to simulate guard movement
          </p>
        </div>

        {/* Legend Overlay at Bottom-Right */}
        <div className="absolute bottom-3 right-3 bg-black/75 backdrop-blur-xs text-white p-2 rounded-2xl border border-white/10 text-[10px] space-y-1 z-10 hidden sm:block">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-emerald-400 inline-block" />
            <span className="text-slate-300">Society Geofence Barrier</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" />
            <span className="text-slate-300">Active Guard Pin</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
            <span className="text-slate-300">Other Guards On Duty</span>
          </div>
        </div>
      </div>

      {/* Bottom Telemetry Footer Status */}
      <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-medium">Terminal Device:</span>
            <strong className="text-slate-800 font-mono">Rugged Guard Tablet #01</strong>
          </div>
          <div className="flex items-center gap-1.5">
            <BatteryCharging className="w-3.5 h-3.5 text-emerald-600" />
            <span className="font-bold text-slate-700">{guardProfile.batteryLevel || 91}% Charged</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">Shift:</span>
            <span className="font-bold text-blue-700">{guardProfile.dutyShift}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-500">
            {guardGeofence.isWithinGeofence
              ? '✓ Guard coordinates match assigned barrier post.'
              : '⚠️ Perimeter boundary breach recorded in SQL logs!'}
          </span>
        </div>
      </div>
    </div>
  );
};
