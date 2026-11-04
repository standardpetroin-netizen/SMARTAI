import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Trash2, 
  Wrench, 
  CheckCircle, 
  AlertTriangle, 
  MapPin, 
  Camera, 
  CheckCircle2, 
  Radio
} from 'lucide-react';
import { INITIAL_CHECKPOINTS } from '../utils/sampleData';
import { GuardCheckpoint } from '../types';

export const FeatureDemos: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'guard' | 'waste' | 'maintenance'>('guard');

  // Guard Simulator State
  const [checkpoints, setCheckpoints] = useState<GuardCheckpoint[]>(INITIAL_CHECKPOINTS);
  const [patrolAlertActive, setPatrolAlertActive] = useState<boolean>(false);
  const [lastScannedNote, setLastScannedNote] = useState<string>('Select an unscanned checkpoint below to simulate guard NFC scan.');

  // Waste Audit State
  const [selectedUnit, setSelectedUnit] = useState<string>('A-102');
  const [segregationType, setSegregationType] = useState<'perfect' | 'mixed' | 'hazardous'>('perfect');
  const [dryWeight, setDryWeight] = useState<number>(1.8);
  const [wetWeight, setWetWeight] = useState<number>(2.4);
  const [wasteLogs, setWasteLogs] = useState<Array<{ unit: string; time: string; status: string; penalty: boolean }>>([
    { unit: 'A-101', time: '06:14 AM', status: 'Segregated (Dry + Wet)', penalty: false },
    { unit: 'A-103', time: '06:22 AM', status: 'Segregated (Dry + Wet)', penalty: false },
    { unit: 'A-201', time: '06:28 AM', status: 'Mixed Unsegregated', penalty: true },
  ]);

  // Maintenance OTP State
  const [otpInput, setOtpInput] = useState<string>('');
  const [photoProofAttached, setPhotoProofAttached] = useState<boolean>(false);
  const [ticketStatus, setTicketStatus] = useState<'In Progress' | 'Awaiting OTP' | 'Resolved'>('Awaiting OTP');
  const [otpError, setOtpError] = useState<string | null>(null);

  const clearedCount = checkpoints.filter((c) => c.status === 'cleared').length;
  const patrolCompletionPct = Math.round((clearedCount / checkpoints.length) * 100);

  const handleScanCheckpoint = (id: string) => {
    setCheckpoints((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          return {
            ...c,
            status: 'cleared',
            lastScannedTime: 'Just now (04:02 AM)',
            scannedBy: 'Guard Ram Singh (Mobile Terminal #02)',
          };
        }
        return c;
      })
    );
    setLastScannedNote(`✓ Checkpoint ${id} verified! Geofence verified within 8m accuracy.`);
    setPatrolAlertActive(false);
  };

  const handleTriggerMissedAlert = () => {
    setPatrolAlertActive(true);
    setLastScannedNote('⚠️ Checkpoint CP-03 overdue by 12 mins! Escalation dispatch sent to Control Room.');
  };

  const handleLogWaste = (e: React.FormEvent) => {
    e.preventDefault();
    const isPenalty = segregationType === 'mixed' || segregationType === 'hazardous';
    const statusText =
      segregationType === 'perfect'
        ? 'Segregated (Dry + Wet)'
        : segregationType === 'mixed'
        ? 'Mixed / Unsegregated'
        : 'Hazardous Glass / Battery Flag';

    setWasteLogs([
      { unit: selectedUnit, time: 'Just now (06:34 AM)', status: statusText, penalty: isPenalty },
      ...wasteLogs,
    ]);
  };

  const handleVerifyTicketOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoProofAttached) {
      setOtpError('Please attach photo proof of completion first.');
      return;
    }
    if (otpInput.trim() !== '829140') {
      setOtpError('Invalid OTP code. Resident confirmation OTP is 829140.');
      return;
    }
    setOtpError(null);
    setTicketStatus('Resolved');
  };

  return (
    <section id="features" className="py-20 bg-slate-50 px-6 border-y border-slate-200 text-slate-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-xs uppercase font-bold tracking-widest text-blue-600 mb-2">Ground-Level Accountability</p>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Complete Visibility Across{' '}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 bg-clip-text text-transparent">
              Every Society Operation
            </span>
          </h2>
          <p className="text-slate-600 mt-3 text-base">
            Most apps only handle visitor approval. smartaisociety actively tracks every physical duty cycle across your township with real-time auditability.
          </p>
        </div>

        {/* 3 Core Architecture Pillars in Simple Clean Light Theme */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* Pillar 1 */}
          <div className="bg-white border border-slate-200 rounded-3xl p-8 hover:border-blue-400 hover:shadow-lg transition-all flex flex-col justify-between shadow-xs">
            <div>
              <div className="w-12 h-12 bg-blue-50 border border-blue-200 rounded-2xl flex items-center justify-center text-blue-600 mb-6 shadow-xs">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">NFC Guard Patrol Rounds</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Guards scan physical geofenced checkpoints along perimeter walls and basements during night shifts. The system sounds automated alerts to the control room if a checkpoint is bypassed by &gt;10 minutes.
              </p>
            </div>
            <ul className="text-xs text-slate-600 space-y-2.5 border-t border-slate-100 pt-4">
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" /> Geofence latitude/longitude validation</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" /> Offline cache for basement parking</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" /> SOS panic triggers to resident phones</li>
            </ul>
          </div>

          {/* Pillar 2 */}
          <div className="bg-white border border-slate-200 rounded-3xl p-8 hover:border-emerald-400 hover:shadow-lg transition-all flex flex-col justify-between shadow-xs">
            <div>
              <div className="w-12 h-12 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-center text-emerald-600 mb-6 shadow-xs">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Doorstep Waste Audit</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Housekeeping staff scan discrete QR badges installed outside each unit. Logs record whether wet/dry/hazardous waste was handed over, segregated, or missed entirely.
              </p>
            </div>
            <ul className="text-xs text-slate-600 space-y-2.5 border-t border-slate-100 pt-4">
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" /> Auto-penalty tagging on monthly bills</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" /> Floor-wise housekeeping progress heatmap</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" /> Central dumper truck clearance audit</li>
            </ul>
          </div>

          {/* Pillar 3 */}
          <div className="bg-white border border-slate-200 rounded-3xl p-8 hover:border-purple-400 hover:shadow-lg transition-all flex flex-col justify-between shadow-xs">
            <div>
              <div className="w-12 h-12 bg-purple-50 border border-purple-200 rounded-2xl flex items-center justify-center text-purple-600 mb-6 shadow-xs">
                <Wrench className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">OTP-Verified Maintenance</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Residents log electrical, plumbing, or elevator issues. In-house technicians cannot close tickets without resident-provided 6-digit confirmation codes and mandatory photographic evidence.
              </p>
            </div>
            <ul className="text-xs text-slate-600 space-y-2.5 border-t border-slate-100 pt-4">
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" /> Strict SLA countdowns (2h, 4h, 24h triggers)</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" /> Before/After job inspection photos</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" /> Asset lifecycle tracking for pumps & generators</li>
            </ul>
          </div>
        </div>

        {/* Live Interactive Simulators Section */}
        <div id="simulations" className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
            <div>
              <span className="text-xs uppercase font-bold text-blue-600 tracking-wider">Interactive Staff & Field Workbench</span>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">Test Operational Workflows Live</h3>
            </div>

            {/* Interactive Tab Switcher */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl border border-slate-200 self-start sm:self-auto">
              <button
                onClick={() => setActiveTab('guard')}
                className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                  activeTab === 'guard'
                    ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                1. Guard Patrol (NFC/QR)
              </button>
              <button
                onClick={() => setActiveTab('waste')}
                className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                  activeTab === 'waste'
                    ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                2. Waste Segregation
              </button>
              <button
                onClick={() => setActiveTab('maintenance')}
                className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                  activeTab === 'maintenance'
                    ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                3. Maintenance OTP
              </button>
            </div>
          </div>

          {/* TAB 1: Guard Patrol Simulator */}
          {activeTab === 'guard' && (
            <div className="pt-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left 2 Cols: Checkpoint list and status */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    <div>
                      <p className="text-xs text-slate-500 font-medium">Night Patrol Shift Progress (00:00 - 06:00)</p>
                      <p className="text-lg font-bold text-slate-900 mt-0.5 font-mono tabular-nums">
                        {clearedCount} of {checkpoints.length} Checkpoints Verified ({patrolCompletionPct}%)
                      </p>
                    </div>
                    <div className="w-32 bg-slate-200 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full transition-all duration-500"
                        style={{ width: `${patrolCompletionPct}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    {checkpoints.map((cp) => (
                      <div
                        key={cp.id}
                        className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                          cp.status === 'cleared'
                            ? 'bg-emerald-50/60 border-emerald-200'
                            : cp.status === 'missed' || (patrolAlertActive && cp.id === 'CP-03')
                            ? 'bg-rose-50 border-rose-300'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 mt-0.5 ${
                              cp.status === 'cleared'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : cp.id === 'CP-03' && patrolAlertActive
                                ? 'bg-rose-100 text-rose-800 border border-rose-300 animate-pulse'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {cp.id}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-semibold text-slate-900">{cp.name}</h4>
                              {cp.status === 'cleared' && (
                                <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-100 px-2 py-0.5 rounded-full">Cleared</span>
                              )}
                              {cp.id === 'CP-03' && patrolAlertActive && (
                                <span className="text-[10px] text-rose-700 font-bold uppercase bg-rose-100 px-2 py-0.5 rounded-full">Overdue 12m</span>
                              )}
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5">{cp.location}</p>
                            <p className="text-[11px] text-slate-400 mt-1">
                              {cp.scannedBy ? `${cp.scannedBy} · ${cp.lastScannedTime}` : cp.requiredTimeWindow}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-center">
                          {cp.status === 'cleared' ? (
                            <span className="text-xs text-emerald-700 flex items-center gap-1 font-semibold bg-emerald-100/80 px-3 py-1.5 rounded-xl border border-emerald-200">
                              <CheckCircle className="w-3.5 h-3.5" /> Cleared
                            </span>
                          ) : (
                            <button
                              onClick={() => handleScanCheckpoint(cp.id)}
                              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                            >
                              <Radio className="w-3.5 h-3.5" /> Simulate Tap
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Col: Guard Handheld Terminal & Control Room */}
                <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-xs font-semibold text-slate-800">Guard Handheld Terminal</span>
                      </div>
                      <span className="text-[11px] font-mono text-slate-500 font-medium">ID: G-102 (Gate 1)</span>
                    </div>

                    <div className="mt-4 p-3 bg-white rounded-2xl border border-slate-200 shadow-xs">
                      <p className="text-xs text-slate-500">Live GPS Accuracy</p>
                      <p className="text-sm font-semibold text-slate-900 mt-0.5 flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-emerald-600" /> 12.9251° N, 77.6749° E (±4m)
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1">Geofence validation active</p>
                    </div>

                    <div className="mt-4 p-3.5 bg-white rounded-2xl border border-slate-200 text-xs shadow-xs">
                      <p className="font-semibold text-slate-800">Audit Status Note:</p>
                      <p className="text-slate-600 mt-1 leading-relaxed">{lastScannedNote}</p>
                    </div>

                    {patrolAlertActive && (
                      <div className="mt-4 p-3 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs">
                        <div className="flex items-center gap-1.5 font-bold">
                          <AlertTriangle className="w-4 h-4 text-rose-600" /> Control Room Siren Triggered
                        </div>
                        <p className="mt-1 text-rose-700 text-[11px]">
                          Automated WhatsApp dispatch sent to Estate Supervisor (Col. Rao).
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="pt-6 border-t border-slate-200 mt-6 space-y-2.5">
                    <button
                      onClick={handleTriggerMissedAlert}
                      className="w-full py-2.5 bg-rose-100 hover:bg-rose-200 text-rose-800 border border-rose-300 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <AlertTriangle className="w-4 h-4" /> Simulate 10-Min Missed Checkpoint
                    </button>
                    <button
                      onClick={() => {
                        setCheckpoints(INITIAL_CHECKPOINTS);
                        setPatrolAlertActive(false);
                        setLastScannedNote('Patrol roster reset to default shift window.');
                      }}
                      className="w-full py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 text-xs rounded-xl transition-colors cursor-pointer"
                    >
                      Reset Patrol Simulator
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Waste Segregation Audit Inspector */}
          {activeTab === 'waste' && (
            <div className="pt-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form to log waste */}
                <form onSubmit={handleLogWaste} className="bg-slate-50 border border-slate-200 rounded-3xl p-6 space-y-4">
                  <div>
                    <span className="text-xs uppercase font-bold text-emerald-600 tracking-wider">Door QR Scanner</span>
                    <h4 className="text-lg font-bold text-slate-900 mt-1">Log Unit Doorstep Pickup</h4>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Select Unit (QR Badge Scanned)</label>
                    <select
                      value={selectedUnit}
                      onChange={(e) => setSelectedUnit(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-emerald-500 shadow-xs"
                    >
                      <option value="A-102">Flat A-102 (Tower A - Fl 1)</option>
                      <option value="A-201">Flat A-201 (Tower A - Fl 2)</option>
                      <option value="B-304">Flat B-304 (Tower B - Fl 3)</option>
                      <option value="C-501">Flat C-501 (Tower C - Fl 5)</option>
                      <option value="D-703">Flat D-703 (Tower D - Fl 7)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1.5">Segregation Quality</label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setSegregationType('perfect')}
                        className={`p-2 rounded-xl text-xs font-semibold border text-center transition-all cursor-pointer ${
                          segregationType === 'perfect'
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                            : 'bg-white border-slate-200 text-slate-600'
                        }`}
                      >
                        ✓ Segregated
                      </button>
                      <button
                        type="button"
                        onClick={() => setSegregationType('mixed')}
                        className={`p-2 rounded-xl text-xs font-semibold border text-center transition-all cursor-pointer ${
                          segregationType === 'mixed'
                            ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                            : 'bg-white border-slate-200 text-slate-600'
                        }`}
                      >
                        ⚠️ Mixed
                      </button>
                      <button
                        type="button"
                        onClick={() => setSegregationType('hazardous')}
                        className={`p-2 rounded-xl text-xs font-semibold border text-center transition-all cursor-pointer ${
                          segregationType === 'hazardous'
                            ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                            : 'bg-white border-slate-200 text-slate-600'
                        }`}
                      >
                        🚫 Hazard
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block text-xs text-slate-600 mb-1">Dry Weight (kg)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={dryWeight}
                        onChange={(e) => setDryWeight(parseFloat(e.target.value) || 0)}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 font-mono shadow-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-600 mb-1">Wet Weight (kg)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={wetWeight}
                        onChange={(e) => setWetWeight(parseFloat(e.target.value) || 0)}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 font-mono shadow-xs"
                      />
                    </div>
                  </div>

                  {segregationType !== 'perfect' && (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-amber-900 text-xs">
                      <strong>Auto-Penalty Trigger:</strong> ₹250 non-compliance penalty will be appended automatically to unit {selectedUnit}&apos;s next monthly maintenance bill.
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-md transition-all cursor-pointer"
                  >
                    Submit Door Log & Sync Heatmap
                  </button>
                </form>

                {/* Right 2 cols: Township Real-Time Waste Log & Heatmap */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                      <p className="text-xs text-slate-500">Today&apos;s Segregation</p>
                      <p className="text-2xl font-bold text-emerald-600 font-mono tabular-nums mt-1">94.2%</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">Target: &gt;90% RWA goal</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                      <p className="text-xs text-slate-500">Total Wet Composted</p>
                      <p className="text-2xl font-bold text-slate-900 font-mono tabular-nums mt-1">482 kg</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">Organic waste converter</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                      <p className="text-xs text-slate-500">Penalties Tagged</p>
                      <p className="text-2xl font-bold text-amber-600 font-mono tabular-nums mt-1">
                        ₹{wasteLogs.filter((w) => w.penalty).length * 250}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">Pending review on bill</p>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                    <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                      <span className="text-xs font-semibold text-slate-800">Live Doorstep Audit Trail</span>
                      <span className="text-[11px] text-slate-500">Logged by Housekeeping Team A</span>
                    </div>

                    <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto">
                      {wasteLogs.map((log, idx) => (
                        <div key={idx} className="p-3.5 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-3">
                            <span className="font-mono font-bold text-slate-800 bg-slate-100 px-2 py-1 rounded border border-slate-200">
                              {log.unit}
                            </span>
                            <div>
                              <p className="text-slate-800 font-medium">{log.status}</p>
                              <p className="text-[11px] text-slate-400">{log.time}</p>
                            </div>
                          </div>
                          <div>
                            {log.penalty ? (
                              <span className="text-rose-700 bg-rose-50 px-2 py-1 rounded border border-rose-200 font-semibold text-[11px]">
                                Penalty ₹250
                              </span>
                            ) : (
                              <span className="text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-200 text-[11px]">
                                Verified Compliant
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Maintenance Ticket OTP Verification */}
          {activeTab === 'maintenance' && (
            <div className="pt-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                {/* Active Ticket Card */}
                <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                    <div>
                      <span className="text-xs font-mono text-purple-700 font-semibold">TICKET #TK-8492</span>
                      <h4 className="text-lg font-bold text-slate-900 mt-0.5">Elevator B2 Audible Alarm Stutter</h4>
                    </div>
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                        ticketStatus === 'Resolved'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-amber-100 text-amber-800 border border-amber-300'
                      }`}
                    >
                      {ticketStatus}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="bg-white p-3 rounded-xl border border-slate-200">
                      <p className="text-slate-500">Unit / Location</p>
                      <p className="text-slate-900 font-semibold mt-0.5">Tower B · Passenger Lift #02</p>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-slate-200">
                      <p className="text-slate-500">Assigned Technician</p>
                      <p className="text-slate-900 font-semibold mt-0.5">Imran Khan (Otis Certified)</p>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-slate-200">
                      <p className="text-slate-500">SLA Window</p>
                      <p className="text-emerald-700 font-semibold mt-0.5 font-mono tabular-nums">1h 14m Remaining</p>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-slate-200">
                      <p className="text-slate-500">Resident Confirmation OTP</p>
                      <p className="text-blue-600 font-mono font-bold mt-0.5">829140 (Sent to Flat)</p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed bg-white p-3 rounded-xl border border-slate-200">
                    Technician reported: Faulty sensor calibration replaced on relay board #3. Resident inspection required for job clearance.
                  </p>
                </div>

                {/* Technician Closeout Console */}
                <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6">
                  {ticketStatus === 'Resolved' ? (
                    <div className="text-center py-8 space-y-3">
                      <div className="w-14 h-14 bg-emerald-100 border border-emerald-300 rounded-2xl flex items-center justify-center text-emerald-700 mx-auto">
                        <CheckCircle2 className="w-8 h-8" />
                      </div>
                      <h4 className="text-lg font-bold text-slate-900">Ticket Successfully Closed</h4>
                      <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                        Resident OTP <strong>829140</strong> confirmed. Job inspection photo archived with digital signature timestamp.
                      </p>
                      <button
                        onClick={() => {
                          setTicketStatus('Awaiting OTP');
                          setOtpInput('');
                          setPhotoProofAttached(false);
                          setOtpError(null);
                        }}
                        className="mt-4 px-4 py-2 bg-white hover:bg-slate-100 border border-slate-300 text-xs font-semibold text-slate-700 rounded-xl transition-colors cursor-pointer"
                      >
                        Reset Demo Ticket
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleVerifyTicketOtp} className="space-y-4">
                      <div>
                        <span className="text-xs uppercase font-bold text-purple-600 tracking-wider">Strict SLA Resolution</span>
                        <h4 className="text-lg font-bold text-slate-900 mt-1">Technician Closeout Protocol</h4>
                        <p className="text-xs text-slate-500 mt-1">
                          smartaisociety enforces photographic proof and resident OTP before any ticket can be marked closed.
                        </p>
                      </div>

                      {/* Photo upload toggle simulation */}
                      <div className="p-3 bg-white rounded-2xl border border-slate-200 flex items-center justify-between shadow-xs">
                        <div className="flex items-center gap-2.5">
                          <Camera className="w-4 h-4 text-purple-600" />
                          <div>
                            <p className="text-xs font-semibold text-slate-900">Completion Photo Proof</p>
                            <p className="text-[11px] text-slate-500">
                              {photoProofAttached ? 'sensor_repair_proof_macro.jpg attached' : 'Mandatory before OTP validation'}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setPhotoProofAttached(!photoProofAttached)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                            photoProofAttached
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : 'bg-purple-100 text-purple-800 hover:bg-purple-200 border border-purple-200'
                          }`}
                        >
                          {photoProofAttached ? 'Attached ✓' : 'Attach Photo'}
                        </button>
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="text-xs font-medium text-slate-700">Resident 6-Digit Verification OTP</label>
                          <button
                            type="button"
                            onClick={() => setOtpInput('829140')}
                            className="text-[11px] text-blue-600 hover:underline cursor-pointer"
                          >
                            Auto-fill (829140)
                          </button>
                        </div>
                        <input
                          type="text"
                          maxLength={6}
                          placeholder="e.g. 829140"
                          value={otpInput}
                          onChange={(e) => setOtpInput(e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-base font-mono tracking-widest text-center text-slate-900 focus:outline-none focus:border-purple-500 shadow-xs"
                        />
                      </div>

                      {otpError && (
                        <p className="text-xs text-rose-700 bg-rose-50 p-2.5 rounded-xl border border-rose-200">
                          {otpError}
                        </p>
                      )}

                      <button
                        type="submit"
                        className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs rounded-xl shadow-md transition-all cursor-pointer"
                      >
                        Verify OTP & Clear Ticket
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
