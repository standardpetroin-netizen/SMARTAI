import React, { useState } from 'react';
import { useCivicOps } from '../context/CivicOpsContext';
import { Radio, ShieldAlert, Zap, X, ChevronRight, Thermometer, Battery, Eye } from 'lucide-react';

interface DroneInfo {
  id: string;
  callsign: string;
  model: string;
  role: string;
  altitudeM: number;
  batteryPct: number;
  speedKmh: number;
  thermalTemp: string;
  status: string;
  sensor: string;
}

export const AnimatedFlyingDrones: React.FC = () => {
  const { setActiveView } = useCivicOps();
  const [selectedDrone, setSelectedDrone] = useState<DroneInfo | null>(null);

  const dronesData: DroneInfo[] = [
    {
      id: 'drone-1',
      callsign: 'SENTINEL-01',
      model: 'AeroGuard 4K-FLIR Autonomous Quad',
      role: 'Skyline Perimeter High-Rise Orbit',
      altitudeM: 48,
      batteryPct: 94,
      speedKmh: 31.4,
      thermalTemp: '36.8°C (Normal)',
      status: 'AIRBORNE ORBIT',
      sensor: '4K Optical + FLIR Boson 640'
    },
    {
      id: 'drone-2',
      callsign: 'FLIR-SCOUT-02',
      model: 'NightVision AeroGuard Mk II',
      role: 'Dense Shrubbery & Blindspot Night Scan',
      altitudeM: 32,
      batteryPct: 89,
      speedKmh: 24.8,
      thermalTemp: '37.1°C (Heat Track Active)',
      status: 'THERMAL SWEEP',
      sensor: 'FLIR Ironbow + LIDAR Altimeter'
    },
    {
      id: 'drone-3',
      callsign: 'GATE-SENTINEL-03',
      model: 'AeroGuard Rapid Intercept Unit',
      role: 'Main Gate & East Barrier Compound Overwatch',
      altitudeM: 26,
      batteryPct: 96,
      speedKmh: 18.2,
      thermalTemp: '36.4°C (Clear)',
      status: 'HOVERING INTERCEPT',
      sensor: '12,000lm Strobe + Optical Zoom'
    },
    {
      id: 'drone-4',
      callsign: 'RECON-04',
      model: 'Boundary Falcon 360',
      role: 'Boundary Wall North Sector Patrol',
      altitudeM: 38,
      batteryPct: 82,
      speedKmh: 28.5,
      thermalTemp: '36.6°C (Target Locked)',
      status: 'CRUISING PATROL',
      sensor: 'Dual Gimbal Optical + Siren Array'
    },
    {
      id: 'drone-5',
      callsign: 'APEX-05',
      model: 'Terrace Sky-Guardian Heavy',
      role: 'Clubhouse Roof Helipad & Solar Farm Overwatch',
      altitudeM: 55,
      batteryPct: 91,
      speedKmh: 22.0,
      thermalTemp: '36.5°C (Ambient Normal)',
      status: 'HIGH-ALTITUDE SWEEP',
      sensor: '360° Omnidirectional LIDAR'
    }
  ];

  const handleOpenDroneCommand = () => {
    setActiveView('society_panel');
    setSelectedDrone(null);
  };

  return (
    <>
      {/* Keyframe animations injected for drone flight, spinning rotors, and scanning searchlights */}
      <style>{`
        @keyframes droneFlight1 {
          0% { transform: translate(-5vw, 40px) rotate(2deg); }
          25% { transform: translate(25vw, 65px) rotate(-1deg); }
          50% { transform: translate(55vw, 35px) rotate(3deg); }
          75% { transform: translate(80vw, 55px) rotate(-2deg); }
          100% { transform: translate(105vw, 40px) rotate(2deg); }
        }

        @keyframes droneFlight2 {
          0% { transform: translate(105vw, 240px) scaleX(-1) rotate(-2deg); }
          30% { transform: translate(75vw, 210px) scaleX(-1) rotate(1deg); }
          60% { transform: translate(40vw, 260px) scaleX(-1) rotate(-3deg); }
          85% { transform: translate(15vw, 220px) scaleX(-1) rotate(2deg); }
          100% { transform: translate(-10vw, 240px) scaleX(-1) rotate(-2deg); }
        }

        @keyframes droneFlight3 {
          0% { transform: translate(78vw, 480px) rotate(-1deg); }
          33% { transform: translate(84vw, 520px) rotate(3deg); }
          66% { transform: translate(74vw, 460px) rotate(-2deg); }
          100% { transform: translate(78vw, 480px) rotate(-1deg); }
        }

        @keyframes droneFlight4 {
          0% { transform: translate(-8vw, 750px) rotate(3deg); }
          30% { transform: translate(25vw, 710px) rotate(-2deg); }
          60% { transform: translate(60vw, 760px) rotate(2deg); }
          85% { transform: translate(85vw, 720px) rotate(-1deg); }
          100% { transform: translate(108vw, 750px) rotate(3deg); }
        }

        @keyframes droneFlight5 {
          0% { transform: translate(12vw, 1100px) rotate(1deg); }
          25% { transform: translate(22vw, 1060px) rotate(-2deg); }
          50% { transform: translate(18vw, 1130px) rotate(3deg); }
          75% { transform: translate(8vw, 1080px) rotate(-1deg); }
          100% { transform: translate(12vw, 1100px) rotate(1deg); }
        }

        @keyframes spinRotorFast {
          0% { transform: scaleX(1); opacity: 0.6; }
          50% { transform: scaleX(0.2); opacity: 0.9; }
          100% { transform: scaleX(1); opacity: 0.6; }
        }

        @keyframes pulseSearchlight {
          0%, 100% { opacity: 0.35; transform: rotate(-8deg); }
          50% { opacity: 0.65; transform: rotate(12deg); }
        }

        @keyframes strobeBlinkRed {
          0%, 85%, 100% { opacity: 0.2; }
          90%, 95% { opacity: 1; filter: drop-shadow(0 0 6px #ef4444); }
        }

        @keyframes strobeBlinkGreen {
          0%, 80%, 100% { opacity: 0.2; }
          85%, 92% { opacity: 1; filter: drop-shadow(0 0 6px #10b981); }
        }

        @keyframes strobeBlinkCyan {
          0%, 75%, 100% { opacity: 0.3; }
          82%, 90% { opacity: 1; filter: drop-shadow(0 0 8px #06b6d4); }
        }
      `}</style>

      {/* Floating Drones Layer Container: Fixed over homepage, non-blocking for background clicks */}
      <div 
        aria-hidden="false"
        className="fixed inset-0 pointer-events-none z-30 overflow-hidden"
        style={{ perspective: 1200 }}
      >
        {/* =========================================================================
            DRONE 1: High-Rise Skyline Orbit (Cruising top left to right)
            ========================================================================= */}
        <div 
          onClick={() => setSelectedDrone(dronesData[0])}
          className="absolute top-0 left-0 pointer-events-auto cursor-pointer group/drone select-none transition-transform"
          style={{
            animation: 'droneFlight1 26s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            willChange: 'transform'
          }}
          title="Autonomous Sentinel 01 · Click to inspect live telemetry"
        >
          <div className="relative transform group-hover/drone:scale-125 transition-transform duration-300">
            {/* Downward Scanning Spotlight */}
            <div 
              className="absolute left-1/2 -bottom-2 -translate-x-1/2 w-20 h-40 origin-top pointer-events-none"
              style={{
                background: 'linear-gradient(to bottom, rgba(56, 189, 248, 0.45), rgba(56, 189, 248, 0.05), transparent)',
                clipPath: 'polygon(45% 0%, 55% 0%, 100% 100%, 0% 100%)',
                animation: 'pulseSearchlight 4.5s ease-in-out infinite'
              }}
            />

            {/* Drone Vector Graphic */}
            <div className="w-16 h-10 relative flex items-center justify-center">
              {/* Left & Right Motor Arms */}
              <div className="absolute w-14 h-1 bg-slate-800 rounded-full border border-slate-700 shadow-md" />
              <div className="absolute w-1 h-8 bg-slate-800 rounded-full border border-slate-700 shadow-md rotate-45" />
              <div className="absolute w-1 h-8 bg-slate-800 rounded-full border border-slate-700 shadow-md -rotate-45" />

              {/* 4 Spinning Rotor Propellers */}
              <div 
                className="absolute -top-1.5 -left-1 w-6 h-1 bg-cyan-400/80 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.8)]"
                style={{ animation: 'spinRotorFast 0.08s linear infinite' }}
              />
              <div 
                className="absolute -top-1.5 -right-1 w-6 h-1 bg-cyan-400/80 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.8)]"
                style={{ animation: 'spinRotorFast 0.08s linear infinite' }}
              />
              <div 
                className="absolute -bottom-1.5 -left-1 w-6 h-1 bg-cyan-400/80 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.8)]"
                style={{ animation: 'spinRotorFast 0.08s linear infinite' }}
              />
              <div 
                className="absolute -bottom-1.5 -right-1 w-6 h-1 bg-cyan-400/80 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.8)]"
                style={{ animation: 'spinRotorFast 0.08s linear infinite' }}
              />

              {/* Carbon Fuselage Body */}
              <div className="relative z-10 w-7 h-5 bg-slate-950 border border-slate-700 rounded-lg shadow-lg flex items-center justify-center">
                {/* Center Navigation Dome LED */}
                <div 
                  className="w-2 h-2 rounded-full bg-cyan-400"
                  style={{ animation: 'strobeBlinkCyan 1.4s ease-in-out infinite' }}
                />
              </div>

              {/* Starboard & Port Navigation Strobe LEDs */}
              <div 
                className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-red-500"
                style={{ animation: 'strobeBlinkRed 1.8s ease-in-out infinite' }}
              />
              <div 
                className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-emerald-500"
                style={{ animation: 'strobeBlinkGreen 1.8s ease-in-out infinite' }}
              />
            </div>

            {/* Callsign Pill HUD */}
            <div className="mt-1 flex items-center justify-center">
              <span className="text-[9px] font-mono font-bold tracking-tight bg-slate-950/85 text-cyan-300 px-2 py-0.5 rounded-full border border-cyan-500/40 shadow-md backdrop-blur-xs flex items-center gap-1 group-hover/drone:border-cyan-400 group-hover/drone:text-white">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                SENTINEL-01 · 48m
              </span>
            </div>
          </div>
        </div>

        {/* =========================================================================
            DRONE 2: Thermal Night Scout (Cruising right to left across mid-screen)
            ========================================================================= */}
        <div 
          onClick={() => setSelectedDrone(dronesData[1])}
          className="absolute top-0 left-0 pointer-events-auto cursor-pointer group/drone select-none transition-transform"
          style={{
            animation: 'droneFlight2 30s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            willChange: 'transform'
          }}
          title="FLIR Scout 02 · Heat signature tracking active"
        >
          <div className="relative transform group-hover/drone:scale-125 transition-transform duration-300">
            {/* Amber/Red FLIR Thermal Scanning Cone */}
            <div 
              className="absolute left-1/2 -bottom-2 -translate-x-1/2 w-24 h-44 origin-top pointer-events-none"
              style={{
                background: 'linear-gradient(to bottom, rgba(245, 158, 11, 0.45), rgba(239, 68, 68, 0.1), transparent)',
                clipPath: 'polygon(45% 0%, 55% 0%, 100% 100%, 0% 100%)',
                animation: 'pulseSearchlight 3.8s ease-in-out infinite'
              }}
            />

            {/* Drone Vector Graphic */}
            <div className="w-16 h-10 relative flex items-center justify-center">
              <div className="absolute w-14 h-1 bg-slate-900 rounded-full border border-slate-700 shadow-md" />
              <div className="absolute w-1 h-8 bg-slate-900 rounded-full border border-slate-700 shadow-md rotate-45" />
              <div className="absolute w-1 h-8 bg-slate-900 rounded-full border border-slate-700 shadow-md -rotate-45" />

              {/* Rotors */}
              <div 
                className="absolute -top-1.5 -left-1 w-6 h-1 bg-amber-400/80 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.8)]"
                style={{ animation: 'spinRotorFast 0.07s linear infinite' }}
              />
              <div 
                className="absolute -top-1.5 -right-1 w-6 h-1 bg-amber-400/80 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.8)]"
                style={{ animation: 'spinRotorFast 0.07s linear infinite' }}
              />
              <div 
                className="absolute -bottom-1.5 -left-1 w-6 h-1 bg-amber-400/80 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.8)]"
                style={{ animation: 'spinRotorFast 0.07s linear infinite' }}
              />
              <div 
                className="absolute -bottom-1.5 -right-1 w-6 h-1 bg-amber-400/80 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.8)]"
                style={{ animation: 'spinRotorFast 0.07s linear infinite' }}
              />

              <div className="relative z-10 w-7 h-5 bg-slate-950 border border-amber-600/60 rounded-lg shadow-lg flex items-center justify-center">
                <div 
                  className="w-2 h-2 rounded-full bg-amber-400"
                  style={{ animation: 'strobeBlinkCyan 1.2s ease-in-out infinite' }}
                />
              </div>

              <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            {/* Callsign Pill HUD */}
            <div className="mt-1 flex items-center justify-center">
              <span className="text-[9px] font-mono font-bold tracking-tight bg-slate-950/85 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/40 shadow-md backdrop-blur-xs flex items-center gap-1 group-hover/drone:border-amber-400">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                FLIR-SCOUT · 37.1°C
              </span>
            </div>
          </div>
        </div>

        {/* =========================================================================
            DRONE 3: Gatehouse Intercept Sentinel (Hovering near right mid-section)
            ========================================================================= */}
        <div 
          onClick={() => setSelectedDrone(dronesData[2])}
          className="absolute top-0 left-0 pointer-events-auto cursor-pointer group/drone select-none transition-transform"
          style={{
            animation: 'droneFlight3 12s ease-in-out infinite',
            willChange: 'transform'
          }}
          title="Gate Sentinel 03 · Hovering barrier watch"
        >
          <div className="relative transform group-hover/drone:scale-125 transition-transform duration-300">
            {/* Conical Searchlight */}
            <div 
              className="absolute left-1/2 -bottom-2 -translate-x-1/2 w-20 h-36 origin-top pointer-events-none"
              style={{
                background: 'linear-gradient(to bottom, rgba(16, 185, 129, 0.4), rgba(16, 185, 129, 0.05), transparent)',
                clipPath: 'polygon(45% 0%, 55% 0%, 100% 100%, 0% 100%)',
                animation: 'pulseSearchlight 3.2s ease-in-out infinite'
              }}
            />

            <div className="w-16 h-10 relative flex items-center justify-center">
              <div className="absolute w-14 h-1 bg-slate-900 rounded-full border border-slate-700 shadow-md" />
              <div className="absolute w-1 h-8 bg-slate-900 rounded-full border border-slate-700 shadow-md rotate-45" />
              <div className="absolute w-1 h-8 bg-slate-900 rounded-full border border-slate-700 shadow-md -rotate-45" />

              <div 
                className="absolute -top-1.5 -left-1 w-6 h-1 bg-emerald-400/80 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.8)]"
                style={{ animation: 'spinRotorFast 0.08s linear infinite' }}
              />
              <div 
                className="absolute -top-1.5 -right-1 w-6 h-1 bg-emerald-400/80 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.8)]"
                style={{ animation: 'spinRotorFast 0.08s linear infinite' }}
              />
              <div 
                className="absolute -bottom-1.5 -left-1 w-6 h-1 bg-emerald-400/80 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.8)]"
                style={{ animation: 'spinRotorFast 0.08s linear infinite' }}
              />
              <div 
                className="absolute -bottom-1.5 -right-1 w-6 h-1 bg-emerald-400/80 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.8)]"
                style={{ animation: 'spinRotorFast 0.08s linear infinite' }}
              />

              <div className="relative z-10 w-7 h-5 bg-slate-950 border border-emerald-500/60 rounded-lg shadow-lg flex items-center justify-center">
                <div 
                  className="w-2 h-2 rounded-full bg-emerald-400"
                  style={{ animation: 'strobeBlinkGreen 1.1s ease-in-out infinite' }}
                />
              </div>

              <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-red-500" />
              <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-emerald-500" />
            </div>

            <div className="mt-1 flex items-center justify-center">
              <span className="text-[9px] font-mono font-bold tracking-tight bg-slate-950/85 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/40 shadow-md backdrop-blur-xs flex items-center gap-1 group-hover/drone:border-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                GATE-03 · HOVERING
              </span>
            </div>
          </div>
        </div>

        {/* =========================================================================
            DRONE 4: Boundary Wall Recon (Cruising left to right across lower-mid section)
            ========================================================================= */}
        <div 
          onClick={() => setSelectedDrone(dronesData[3])}
          className="absolute top-0 left-0 pointer-events-auto cursor-pointer group/drone select-none transition-transform"
          style={{
            animation: 'droneFlight4 34s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            willChange: 'transform'
          }}
          title="Recon 04 · Perimeter boundary wall survey"
        >
          <div className="relative transform group-hover/drone:scale-125 transition-transform duration-300">
            <div 
              className="absolute left-1/2 -bottom-2 -translate-x-1/2 w-20 h-36 origin-top pointer-events-none"
              style={{
                background: 'linear-gradient(to bottom, rgba(147, 51, 234, 0.4), rgba(147, 51, 234, 0.05), transparent)',
                clipPath: 'polygon(45% 0%, 55% 0%, 100% 100%, 0% 100%)',
                animation: 'pulseSearchlight 4.2s ease-in-out infinite'
              }}
            />

            <div className="w-16 h-10 relative flex items-center justify-center">
              <div className="absolute w-14 h-1 bg-slate-900 rounded-full border border-slate-700 shadow-md" />
              <div className="absolute w-1 h-8 bg-slate-900 rounded-full border border-slate-700 shadow-md rotate-45" />
              <div className="absolute w-1 h-8 bg-slate-900 rounded-full border border-slate-700 shadow-md -rotate-45" />

              <div 
                className="absolute -top-1.5 -left-1 w-6 h-1 bg-purple-400/80 rounded-full shadow-[0_0_8px_rgba(147,51,234,0.8)]"
                style={{ animation: 'spinRotorFast 0.08s linear infinite' }}
              />
              <div 
                className="absolute -top-1.5 -right-1 w-6 h-1 bg-purple-400/80 rounded-full shadow-[0_0_8px_rgba(147,51,234,0.8)]"
                style={{ animation: 'spinRotorFast 0.08s linear infinite' }}
              />
              <div 
                className="absolute -bottom-1.5 -left-1 w-6 h-1 bg-purple-400/80 rounded-full shadow-[0_0_8px_rgba(147,51,234,0.8)]"
                style={{ animation: 'spinRotorFast 0.08s linear infinite' }}
              />
              <div 
                className="absolute -bottom-1.5 -right-1 w-6 h-1 bg-purple-400/80 rounded-full shadow-[0_0_8px_rgba(147,51,234,0.8)]"
                style={{ animation: 'spinRotorFast 0.08s linear infinite' }}
              />

              <div className="relative z-10 w-7 h-5 bg-slate-950 border border-purple-500/60 rounded-lg shadow-lg flex items-center justify-center">
                <div 
                  className="w-2 h-2 rounded-full bg-purple-400"
                  style={{ animation: 'strobeBlinkCyan 1.5s ease-in-out infinite' }}
                />
              </div>

              <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-red-500" />
              <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-emerald-500" />
            </div>

            <div className="mt-1 flex items-center justify-center">
              <span className="text-[9px] font-mono font-bold tracking-tight bg-slate-950/85 text-purple-300 px-2 py-0.5 rounded-full border border-purple-500/40 shadow-md backdrop-blur-xs flex items-center gap-1 group-hover/drone:border-purple-400">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-ping" />
                RECON-04 · BLINDSPOT
              </span>
            </div>
          </div>
        </div>

        {/* =========================================================================
            DRONE 5: Skyline Apex Sentinel (High-altitude terrace sweeping)
            ========================================================================= */}
        <div 
          onClick={() => setSelectedDrone(dronesData[4])}
          className="absolute top-0 left-0 pointer-events-auto cursor-pointer group/drone select-none transition-transform"
          style={{
            animation: 'droneFlight5 16s ease-in-out infinite',
            willChange: 'transform'
          }}
          title="Apex 05 · High-altitude terrace overwatch"
        >
          <div className="relative transform group-hover/drone:scale-125 transition-transform duration-300">
            <div 
              className="absolute left-1/2 -bottom-2 -translate-x-1/2 w-24 h-48 origin-top pointer-events-none"
              style={{
                background: 'linear-gradient(to bottom, rgba(59, 130, 246, 0.45), rgba(59, 130, 246, 0.05), transparent)',
                clipPath: 'polygon(45% 0%, 55% 0%, 100% 100%, 0% 100%)',
                animation: 'pulseSearchlight 3.6s ease-in-out infinite'
              }}
            />

            <div className="w-16 h-10 relative flex items-center justify-center">
              <div className="absolute w-14 h-1 bg-slate-900 rounded-full border border-slate-700 shadow-md" />
              <div className="absolute w-1 h-8 bg-slate-900 rounded-full border border-slate-700 shadow-md rotate-45" />
              <div className="absolute w-1 h-8 bg-slate-900 rounded-full border border-slate-700 shadow-md -rotate-45" />

              <div 
                className="absolute -top-1.5 -left-1 w-6 h-1 bg-blue-400/80 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.8)]"
                style={{ animation: 'spinRotorFast 0.08s linear infinite' }}
              />
              <div 
                className="absolute -top-1.5 -right-1 w-6 h-1 bg-blue-400/80 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.8)]"
                style={{ animation: 'spinRotorFast 0.08s linear infinite' }}
              />
              <div 
                className="absolute -bottom-1.5 -left-1 w-6 h-1 bg-blue-400/80 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.8)]"
                style={{ animation: 'spinRotorFast 0.08s linear infinite' }}
              />
              <div 
                className="absolute -bottom-1.5 -right-1 w-6 h-1 bg-blue-400/80 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.8)]"
                style={{ animation: 'spinRotorFast 0.08s linear infinite' }}
              />

              <div className="relative z-10 w-7 h-5 bg-slate-950 border border-blue-500/60 rounded-lg shadow-lg flex items-center justify-center">
                <div 
                  className="w-2 h-2 rounded-full bg-blue-400"
                  style={{ animation: 'strobeBlinkCyan 1.6s ease-in-out infinite' }}
                />
              </div>

              <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-red-500" />
              <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-emerald-500" />
            </div>

            <div className="mt-1 flex items-center justify-center">
              <span className="text-[9px] font-mono font-bold tracking-tight bg-slate-950/85 text-blue-300 px-2 py-0.5 rounded-full border border-blue-500/40 shadow-md backdrop-blur-xs flex items-center gap-1 group-hover/drone:border-blue-400">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                APEX-05 · 55m
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Telemetry HUD Modal when User Clicks Any Flying Drone */}
      {selectedDrone && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border-2 border-cyan-500/50 rounded-3xl p-6 max-w-md w-full shadow-2xl shadow-cyan-950/50 space-y-5 text-white">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-cyan-950/80 border border-cyan-500/50 flex items-center justify-center text-cyan-400">
                  <Radio className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded-full border border-cyan-500/30">
                      LIVE AERIAL TELEMETRY
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold">● {selectedDrone.status}</span>
                  </div>
                  <h3 className="text-lg font-black text-white mt-0.5 font-mono">{selectedDrone.callsign}</h3>
                </div>
              </div>

              <button
                onClick={() => setSelectedDrone(null)}
                className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-slate-300">
                <strong className="text-white">{selectedDrone.model}</strong> actively executing autonomous perimeter sweep across residential society boundaries.
              </p>

              <div className="grid grid-cols-2 gap-2.5 font-mono">
                <div className="bg-slate-950/70 p-3 rounded-2xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Altitude AGL</span>
                  <span className="text-sm font-bold text-cyan-300 mt-0.5 block">{selectedDrone.altitudeM} meters</span>
                </div>

                <div className="bg-slate-950/70 p-3 rounded-2xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Airspeed</span>
                  <span className="text-sm font-bold text-emerald-400 mt-0.5 block">{selectedDrone.speedKmh} km/h</span>
                </div>

                <div className="bg-slate-950/70 p-3 rounded-2xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Battery Reserve</span>
                  <span className="text-sm font-bold text-slate-200 mt-0.5 flex items-center gap-1.5">
                    <Battery className="w-3.5 h-3.5 text-emerald-400" />
                    {selectedDrone.batteryPct}%
                  </span>
                </div>

                <div className="bg-slate-950/70 p-3 rounded-2xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">FLIR Sensor Temp</span>
                  <span className="text-sm font-bold text-amber-300 mt-0.5 flex items-center gap-1.5">
                    <Thermometer className="w-3.5 h-3.5 text-amber-400" />
                    {selectedDrone.thermalTemp}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-slate-950/50 rounded-2xl border border-slate-800 text-[11px] text-slate-400 space-y-1">
                <p><span className="text-slate-200 font-semibold">Active Mission:</span> {selectedDrone.role}</p>
                <p><span className="text-slate-200 font-semibold">Sensor Payload:</span> {selectedDrone.sensor}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setSelectedDrone(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-300 text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Close HUD
              </button>
              <button
                onClick={handleOpenDroneCommand}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-slate-950 text-xs font-black transition-all shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Open Drone Command</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
