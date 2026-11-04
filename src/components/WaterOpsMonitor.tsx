import React, { useState } from 'react';
import { 
  Power, 
  Volume2, 
  VolumeX, 
  AlertTriangle, 
  Zap, 
  Sliders,
  SlidersHorizontal,
  LogOut
} from 'lucide-react';
import { useCivicOps } from '../context/CivicOpsContext';
import { SectionAuthScreen } from './SectionAuthScreen';

export const WaterOpsMonitor: React.FC = () => {
  const {
    tanks,
    pumps,
    waterLogs,
    togglePump,
    emergencyShutoffAndAcknowledge,
    adjustTankLevel,
    buzzerActive,
    toggleBuzzerMute,
    autoFailsafeSecondsRemaining,
    authUsers,
    logoutPortal
  } = useCivicOps();

  const waterUser = authUsers['water'];
  if (!waterUser) {
    return <SectionAuthScreen role="water" />;
  }

  const [operatorName] = useState<string>(waterUser.name || 'Er. Sandeep Rao (ID #ENG-W-104)');
  const [showSimControls, setShowSimControls] = useState<boolean>(false);

  // Check if any tank has critical alarm
  const criticalHighTank = tanks.find((t) => t.levelPercentage >= 95);
  const lowLevelTank = tanks.find((t) => t.levelPercentage <= 20);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6 font-sans">
      {/* Top Station Header Lockup */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="w-3 h-3 rounded-full bg-cyan-500 animate-pulse" />
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              IoT Water Telemetry & Motor Automation
            </h2>
            <span className="text-[10px] font-mono font-bold text-cyan-800 bg-cyan-100 px-2 py-0.5 rounded border border-cyan-300">
              MQTT / Modbus Active
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 font-mono">
            Active Operator: <strong className="text-slate-800">{operatorName}</strong> · Sensor Ping: Live (1s interval)
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setShowSimControls(!showSimControls)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs ${
              showSimControls
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            {showSimControls ? 'Hide Sensor Overrides' : 'Sensor Overrides'}
          </button>

          <button
            onClick={() => logoutPortal('water')}
            className="px-3 py-1.5 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
            title="Sign out of SCADA terminal"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* SENSOR SIMULATION OVERRIDE PANEL (When toggled) */}
      {showSimControls && (
        <div className="bg-white p-5 rounded-3xl border-2 border-blue-400 shadow-md space-y-4">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-blue-700 uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-4 h-4" /> Hardware Telemetry Simulator
            </span>
            <span className="text-slate-500">Drag sliders to test threshold triggers live</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {tanks.map((t) => (
              <div key={t.id} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-800 truncate">{t.name.split(' ')[0]}</span>
                  <span className="font-mono font-bold text-slate-900">{t.levelPercentage}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={t.levelPercentage}
                  onChange={(e) => adjustTankLevel(t.id, parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-cyan-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>0%</span>
                  <span>Low: 20%</span>
                  <span>Full: 95%</span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100 text-xs">
            <button
              onClick={() => adjustTankLevel('oht_tower_b', 98)}
              className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-800 font-medium rounded-xl cursor-pointer"
            >
              Trigger Tower B 98% Overflow Alarm
            </button>
            <button
              onClick={() => adjustTankLevel('ug_sump', 18)}
              className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 font-medium rounded-xl cursor-pointer"
            >
              Trigger Sump 18% Low Level Alert
            </button>
            <button
              onClick={() => {
                adjustTankLevel('oht_tower_b', 75);
                adjustTankLevel('ug_sump', 80);
              }}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl cursor-pointer"
            >
              Reset to Normal Levels (75% / 80%)
            </button>
          </div>
        </div>
      )}

      {/* CRITICAL FULL-LEVEL ALARM BANNER (>= 95% - 98%) */}
      {criticalHighTank && (
        <div className="bg-rose-50 border-2 border-rose-400 rounded-3xl p-6 shadow-md space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 border border-rose-300 flex items-center justify-center text-rose-700 shrink-0">
                <AlertTriangle className="w-6 h-6 animate-bounce" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-rose-800 bg-rose-100 px-2.5 py-0.5 rounded-full border border-rose-300">
                    HIGH-PRIORITY SIREN FIRED
                  </span>
                  <button
                    onClick={toggleBuzzerMute}
                    className="text-xs text-rose-800 hover:text-rose-950 flex items-center gap-1 cursor-pointer bg-white px-2 py-0.5 rounded-lg border border-rose-200"
                  >
                    {buzzerActive ? <Volume2 className="w-3.5 h-3.5 text-rose-600" /> : <VolumeX className="w-3.5 h-3.5" />}
                    {buzzerActive ? 'Buzzer Loud' : 'Muted'}
                  </button>
                </div>
                <h3 className="text-lg font-bold text-rose-950 mt-1">
                  {criticalHighTank.name} is Full ({criticalHighTank.levelPercentage}%) – Turn Off Motor Immediately!
                </h3>
                <p className="text-xs text-rose-800 mt-0.5">
                  Overhead tank reached critical overflow limit. Water Boy must disengage booster pump to avoid terrace flooding.
                </p>
              </div>
            </div>

            <button
              onClick={() => emergencyShutoffAndAcknowledge(criticalHighTank.id)}
              className="px-6 py-3.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer shrink-0 uppercase tracking-wider"
            >
              Acknowledge & Turn Off Motor Now
            </button>
          </div>

          {/* IoT Auto-Shutoff Failsafe Countdown Callout */}
          <div className="p-3 bg-white rounded-xl border border-rose-200 flex items-center justify-between text-xs text-rose-900 font-mono">
            <span className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-600" />
              IoT Relay Auto-Trip Countdown:
            </span>
            <span className="font-extrabold text-rose-700 text-sm">
              {autoFailsafeSecondsRemaining}s until automated emergency cutoff
            </span>
          </div>
        </div>
      )}

      {/* LOW WATER LEVEL ALERT (< 20%) */}
      {lowLevelTank && !criticalHighTank && (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-3xl p-5 shadow-xs flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">
                Low Level Alert: {lowLevelTank.name} ({lowLevelTank.levelPercentage}%)
              </h4>
              <p className="text-xs text-amber-800">
                Level dropped below 20% baseline. Water Boy: switch on Borewell replenishment pump.
              </p>
            </div>
          </div>
          <button
            onClick={() => togglePump('borewell_1')}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shrink-0"
          >
            Start Borewell Pump #1
          </button>
        </div>
      )}

      {/* SECTION 1: LIVE TANK LEVEL GAUGES */}
      <section className="space-y-4">
        <div>
          <span className="text-xs font-bold text-cyan-600 uppercase tracking-wider">Storage Reservoirs</span>
          <h3 className="text-xl font-bold text-slate-900 mt-0.5">Live Tank Telemetry & Capacity</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {tanks.map((tank) => {
            const isCriticalHigh = tank.levelPercentage >= 95;
            const isLow = tank.levelPercentage <= 20;

            const fillColor = isCriticalHigh
              ? 'bg-rose-500'
              : isLow
              ? 'bg-amber-500'
              : 'bg-cyan-500';

            return (
              <div
                key={tank.id}
                className={`bg-white p-5 rounded-3xl border transition-all relative overflow-hidden flex flex-col justify-between shadow-xs ${
                  isCriticalHigh
                    ? 'border-rose-400'
                    : isLow
                    ? 'border-amber-400'
                    : 'border-slate-200'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-slate-900 truncate max-w-[150px]">{tank.name}</span>
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                        isCriticalHigh
                          ? 'bg-rose-100 text-rose-800 border border-rose-300'
                          : isLow
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : 'bg-cyan-100 text-cyan-800 border border-cyan-300'
                      }`}
                    >
                      {tank.levelPercentage}%
                    </span>
                  </div>

                  {/* Visual Cylindrical Tank Reservoir Container */}
                  <div className="h-36 bg-slate-100 rounded-2xl border border-slate-200 relative overflow-hidden flex flex-col justify-end p-2 mb-3">
                    {/* Animated Water Fill level */}
                    <div
                      className={`w-full rounded-xl transition-all duration-700 relative overflow-hidden ${fillColor}`}
                      style={{ height: `${tank.levelPercentage}%` }}
                    >
                      {/* Water surface wave effect */}
                      <div className="absolute inset-x-0 top-0 h-2 bg-white/30 backdrop-blur-xs animate-pulse" />
                    </div>

                    {/* Tank readout overlay */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                      <span className="text-2xl font-black text-slate-900 font-mono drop-shadow-xs">
                        {tank.levelPercentage}%
                      </span>
                      <span className="text-[11px] font-mono text-slate-700 font-medium">
                        {tank.currentLitres.toLocaleString()} / {tank.capacityLitres.toLocaleString()} L
                      </span>
                    </div>
                  </div>
                </div>

                {/* Sensor Telemetry Specs */}
                <div className="text-[11px] text-slate-500 space-y-1 border-t border-slate-100 pt-3 font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Sensor:</span>
                    <span className="truncate max-w-[120px] text-slate-700 font-medium">{tank.sensorType.split(' ')[0]}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Health:</span>
                    <span className="text-emerald-700 font-semibold">{tank.sensorHealth}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Location:</span>
                    <span className="text-slate-700 truncate max-w-[120px]">{tank.location}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 2: PUMP CONTROL SWITCHBOARD */}
      <section className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Heavy Duty Relay Switchboard</span>
            <h3 className="text-xl font-bold text-slate-900 mt-0.5">Motor Pump Controls & Live Status</h3>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            Optocoupled IoT Relays (Digital & Manual Verification)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pumps.map((pump) => {
            const isRunning = pump.state === 'RUNNING';
            const isTripped = pump.state === 'AUTO_TRIPPED';

            return (
              <div
                key={pump.id}
                className={`p-5 rounded-3xl border transition-all space-y-4 ${
                  isRunning
                    ? 'bg-cyan-50/50 border-cyan-400 shadow-xs'
                    : isTripped
                    ? 'bg-rose-50/60 border-rose-300'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-base">{pump.name}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{pump.type}</p>
                  </div>

                  <span
                    className={`text-xs font-mono font-bold px-2.5 py-1 rounded-full ${
                      isRunning
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 animate-pulse'
                        : isTripped
                        ? 'bg-rose-100 text-rose-800 border border-rose-300'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {pump.state}
                  </span>
                </div>

                {/* Specs grid */}
                <div className="grid grid-cols-3 gap-2 text-[11px] font-mono bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
                  <div>
                    <span className="text-slate-400 block">Flow Rate</span>
                    <span className="text-cyan-700 font-bold">{pump.flowRateLpm} LPM</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Power Rating</span>
                    <span className="text-slate-800 font-bold">{pump.powerKw} kW</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Grid Voltage</span>
                    <span className="text-emerald-700 font-bold">{pump.voltageV} V</span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 flex items-center justify-between">
                  <span>Routing: UG Sump ➔ {pump.targetTankId === 'oht_tower_b' ? 'Tower B OHT' : 'Tower A OHT'}</span>
                  <span>{pump.lastStateChanged}</span>
                </div>

                {/* Digital / Physical Switch Button */}
                <button
                  onClick={() => togglePump(pump.id, operatorName)}
                  className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    isRunning
                      ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-xs'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                  }`}
                >
                  <Power className="w-4 h-4" />
                  {isRunning ? 'Turn OFF Pump (Flip Switch)' : 'Turn ON Pump (Start Replenishment)'}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 3: OPERATIONAL AUDIT LOG */}
      <section className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">Compliance Trail</span>
            <h3 className="text-xl font-bold text-slate-900 mt-0.5">Pump Operational Audit History</h3>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            {waterLogs.length} Events Recorded
          </span>
        </div>

        <div className="divide-y divide-slate-100 text-xs">
          {waterLogs.map((log) => {
            const isAutoTrip = log.triggerType === 'IoT Automated Failsafe';
            const isFullAlarm = log.action === 'FULL_LEVEL_ALARM';
            const isPremature = log.auditFlag?.toLowerCase().includes('premature');

            return (
              <div key={log.id} className="py-3.5 space-y-1 hover:bg-slate-50 px-2 rounded-xl transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-mono font-bold text-[10px] px-2 py-0.5 rounded ${
                        log.action === 'PUMP_ON'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : isAutoTrip
                          ? 'bg-rose-100 text-rose-800 border border-rose-300'
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      {log.action}
                    </span>
                    <span className="font-semibold text-slate-900">{log.pumpName}</span>
                    <span className="text-slate-500">· {log.tankName} ({log.levelPercentage}%)</span>
                  </div>

                  <span className="text-[11px] font-mono text-slate-400">{log.timestamp}</span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px]">
                  <span className="text-slate-600">
                    Operator: <strong className="text-slate-800">{log.operator}</strong> · Mode: {log.triggerType}
                  </span>
                  {log.auditFlag && (
                    <span
                      className={`font-medium ${
                        isAutoTrip || isFullAlarm
                          ? 'text-rose-700 font-semibold'
                          : isPremature
                          ? 'text-amber-700'
                          : 'text-slate-500'
                      }`}
                    >
                      Flag: {log.auditFlag}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
