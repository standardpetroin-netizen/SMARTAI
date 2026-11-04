import React, { useState, useRef, useEffect } from 'react';
import { 
  MapPin, 
  Search, 
  Package, 
  CheckCircle2, 
  UserPlus, 
  Clock, 
  LogOut, 
  Lock, 
  Radio, 
  Car,
  AlertTriangle,
  Siren,
  Camera,
  ShieldCheck,
  ShieldAlert,
  Power,
  ScanFace,
  RefreshCw,
  Eye,
  Check,
  X,
  Upload,
  UserCheck,
  Smartphone,
  Sparkles,
  PhoneCall,
  Thermometer,
  Zap,
  Flame
} from 'lucide-react';
import { useCivicOps } from '../context/CivicOpsContext';
import { GuardGeofenceMap } from './GuardGeofenceMap';
import { SectionAuthScreen } from './SectionAuthScreen';

export const GuardGateTerminal: React.FC = () => {
  const {
    deliveries,
    admitDelivery,
    visitors,
    admitManualVisitor,
    markVisitorExited,
    guardGeofence,
    visitorInvites,
    verifyVisitorOtp,
    triggerSecurityAlert,
    securityAlerts,
    resolveSecurityAlert,
    guardProfile,
    setGuardOnlineStatus,
    updateGuardLocation,
    updateGuardMasterPhoto,
    verifyGuardFaceHourly,
    faceVerificationLogs,
    hourlyTimerSecondsRemaining,
    resetHourlyTimer,
    showToast,
    droneTelemetry,
    activeDroneIncident,
    dispatchDroneIncident,
    triggerDroneDeterrent,
    authUsers,
    logoutPortal
  } = useCivicOps();

  const guardUser = authUsers['guard'];
  if (!guardUser) {
    return <SectionAuthScreen role="guard" />;
  }

  // Autonomous Drone Rapid Incident local states
  const [isLaunchingDrone, setIsLaunchingDrone] = useState<boolean>(false);
  const [isFlashingStrobe, setIsFlashingStrobe] = useState<boolean>(false);

  // Search & OTP state
  const [otpInput, setOtpInput] = useState<string>('');
  const [unitSearch, setUnitSearch] = useState<string>('B-402');
  const [otpVerificationResult, setOtpVerificationResult] = useState<{
    success: boolean;
    message: string;
    invite?: any;
  } | null>(null);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState<boolean>(false);

  // Delivery Passcode
  const [courierNameInput, setCourierNameInput] = useState<string>('');
  const [enteredPasscode, setEnteredPasscode] = useState<string>('');
  const [passcodeMatchNote, setPasscodeMatchNote] = useState<string | null>(null);

  // Manual visitor state
  const [isManualModalOpen, setIsManualModalOpen] = useState<boolean>(false);
  const [manualVisitorName, setManualVisitorName] = useState<string>('');
  const [manualCompany, setManualCompany] = useState<string>('');
  const [manualPurpose, setManualPurpose] = useState<'Delivery' | 'Guest' | 'Cab' | 'Service Staff'>('Guest');
  const [manualVehicle, setManualVehicle] = useState<string>('');

  // Forced Entry / Intrusion Alert Modal
  const [isIntrusionModalOpen, setIsIntrusionModalOpen] = useState<boolean>(false);
  const [intruderVehicle, setIntruderVehicle] = useState<string>('DL-08-BK-4091');
  const [intruderDescription, setIntruderDescription] = useState<string>('Black SUV forced through entry barrier without resident OTP authorization.');
  const [intruderPersons, setIntruderPersons] = useState<number>(2);
  const [alertDispatched, setAlertDispatched] = useState<boolean>(false);

  // Hourly Face Verification Modal
  const [isFaceModalOpen, setIsFaceModalOpen] = useState<boolean>(false);
  const [faceCheckMode, setFaceCheckMode] = useState<'camera' | 'sample'>('sample');
  const [selectedSampleFace, setSelectedSampleFace] = useState<string>(guardProfile.masterPhotoUrl);
  const [isScanningFace, setIsScanningFace] = useState<boolean>(false);
  const [faceScanConfidence, setFaceScanConfidence] = useState<number | null>(null);
  const [faceScanStatus, setFaceScanStatus] = useState<'idle' | 'scanning' | 'passed' | 'failed'>('idle');

  // Supervisor override PIN
  const [overridePin, setOverridePin] = useState<string>('');
  const [overrideError, setOverrideError] = useState<string | null>(null);

  // Master photo update modal
  const [isMasterPhotoModalOpen, setIsMasterPhotoModalOpen] = useState<boolean>(false);
  const [newMasterPhotoUrl, setNewMasterPhotoUrl] = useState<string>(guardProfile.masterPhotoUrl);

  // Look for matching expected deliveries for the typed unit
  const activeExpectedDeliveries = deliveries.filter(
    (d) => d.unit.toUpperCase() === unitSearch.trim().toUpperCase() && d.status === 'Expected'
  );
  const matchedDelivery = activeExpectedDeliveries[0];

  // Matched OTP invite
  const matchedOtpInvite = visitorInvites.find(
    (iv) => iv.otpCode === otpInput.trim() && iv.status === 'Pending_Verification'
  );

  // Format hourly timer
  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // OTP Verification Handler
  const handleVerifyOtp = async (codeToVerify?: string) => {
    const code = codeToVerify || otpInput;
    if (!code || code.length < 4) {
      showToast('Enter Valid OTP', 'Please enter a 4-digit code provided by visitor.', 'warning');
      return;
    }

    setIsVerifyingOtp(true);
    setOtpVerificationResult(null);

    const result = await verifyVisitorOtp(code, guardProfile.name, guardProfile.assignedGate);
    setOtpVerificationResult(result);
    setIsVerifyingOtp(false);

    if (result.success) {
      setOtpInput('');
      setTimeout(() => {
        setOtpVerificationResult(null);
      }, 5000);
    }
  };

  // Forced Entry Panic Alert Trigger
  const handleSendIntrusionAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    await triggerSecurityAlert({
      societyId: guardProfile.societyId,
      guardId: guardProfile.id,
      guardName: `${guardProfile.name} (${guardProfile.assignedGate})`,
      alertType: 'FORCED_ENTRY',
      severity: 'CRITICAL',
      location: guardProfile.assignedGate,
      description: intruderDescription,
      intruderDetails: {
        vehicleNumber: intruderVehicle,
        personCount: intruderPersons,
        description: intruderDescription,
      },
    });

    setAlertDispatched(true);
    setTimeout(() => {
      setAlertDispatched(false);
      setIsIntrusionModalOpen(false);
    }, 2000);
  };

  // Facial Verification Execution
  const handleExecuteFaceVerification = async (simulateMismatch: boolean = false) => {
    setIsScanningFace(true);
    setFaceScanStatus('scanning');

    // Simulate AI biometric landmark extraction & bone-structure match
    await new Promise((r) => setTimeout(r, 1400));

    const landmarks = {
      eyeDistance: 0.44,
      noseToChinRatio: 0.59,
      faceWidthToHeightRatio: 0.76,
      eyeToMouthRatio: 0.62,
      jawCurvatureScore: 0.88,
      confidenceScore: simulateMismatch ? 0.45 : 0.96,
    };

    const result = await verifyGuardFaceHourly(
      guardProfile.id,
      selectedSampleFace,
      landmarks,
      simulateMismatch
    );

    setIsScanningFace(false);
    setFaceScanConfidence(result.matchScore);
    setFaceScanStatus(result.success ? 'passed' : 'failed');

    if (result.success) {
      setTimeout(() => {
        setIsFaceModalOpen(false);
        setFaceScanStatus('idle');
      }, 2200);
    }
  };

  const handleVerifyAndAdmit = () => {
    if (!matchedDelivery) return;
    admitDelivery(matchedDelivery.id, courierNameInput || matchedDelivery.agentName || 'Verified Courier');
    setCourierNameInput('');
    setEnteredPasscode('');
    setPasscodeMatchNote('Admitted successfully! Barrier gate opened & resident notified.');
    setTimeout(() => setPasscodeMatchNote(null), 4000);
  };

  const handleCreateManualEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualVisitorName.trim()) return;

    admitManualVisitor({
      name: manualVisitorName,
      company: manualCompany || 'Independent Visitor',
      unit: unitSearch || 'B-402',
      purpose: manualPurpose,
      vehicleNumber: manualVehicle || undefined,
      entryGate: guardProfile.assignedGate || 'Gate 01',
    });

    setIsManualModalOpen(false);
    setManualVisitorName('');
    setManualCompany('');
    setManualVehicle('');
  };

  const handleCheckPasscode = (val: string) => {
    setEnteredPasscode(val);
    if (matchedDelivery && val.length >= 4) {
      if (val === matchedDelivery.passcode) {
        setPasscodeMatchNote('✓ Passcode Validated: Matches resident pre-approval.');
      } else {
        setPasscodeMatchNote('⚠️ Passcode mismatch: Check resident instructions.');
      }
    } else {
      setPasscodeMatchNote(null);
    }
  };

  const handleSupervisorUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (overridePin === '9821' || overridePin === '1234') {
      guardGeofence.unlockOverride();
      setOverrideError(null);
    } else {
      setOverrideError('Invalid Supervisor PIN. Enter 9821.');
    }
  };

  // GEOFENCE LOCKOUT SCREEN: If outside ±50m and not unlocked
  if (!guardGeofence.isWithinGeofence && !guardGeofence.overrideUnlocked) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center font-sans">
        <div className="bg-white border-2 border-rose-500 rounded-3xl p-8 sm:p-12 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-200">
          <div className="w-20 h-20 bg-rose-100 border-2 border-rose-300 rounded-3xl flex items-center justify-center text-rose-600 mx-auto animate-bounce">
            <Lock className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-rose-800 bg-rose-100 px-3.5 py-1.5 rounded-full border border-rose-300">
              TERMINAL LOCKED · GEOFENCE PERIMETER BREACH
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-3">Guard Away From Authorized Post</h2>
            <p className="text-sm text-slate-600 mt-2 max-w-md mx-auto leading-relaxed">
              Guard <strong>{guardProfile.name}</strong> is currently <strong>{guardGeofence.distanceMeters}m</strong> away from the designated {guardProfile.assignedGate}.
              Security protocols require you to return inside the barrier circle to unlock admittance.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-left font-mono space-y-1.5 text-slate-700">
            <p className="text-rose-700 font-bold flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" /> Society Geofence Radar Log:
            </p>
            <p>Target Coordinates: 12.9279° N, 77.6828° E (Gate 01 Main Barrier)</p>
            <p>Current GPS Fix: {guardProfile.currentLat.toFixed(4)}° N, {guardProfile.currentLng.toFixed(4)}° E (Offset: +{guardGeofence.distanceMeters}m)</p>
            <p>Society Panel Status: <span className="text-rose-600 font-bold">ALARM DISPATCHED - Out of Bounds</span></p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center items-center">
            <button
              onClick={() => {
                updateGuardLocation(12.9279, 77.6828, true, 3);
                guardGeofence.toggleGeofenceSimulation();
              }}
              className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <MapPin className="w-4 h-4" /> Return to Gate Post (Reset GPS to ±3m)
            </button>

            {/* Supervisor PIN Unlock */}
            <form onSubmit={handleSupervisorUnlock} className="flex gap-2 w-full sm:w-auto">
              <input
                type="password"
                maxLength={4}
                placeholder="Supervisor PIN (9821)"
                value={overridePin}
                onChange={(e) => setOverridePin(e.target.value)}
                className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono focus:outline-none focus:border-rose-500 w-40 shadow-xs"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-xl cursor-pointer"
              >
                Override
              </button>
            </form>
          </div>

          {overrideError && <p className="text-xs text-rose-600 font-medium">{overrideError}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6 font-sans">
      {/* =========================================================================
          1. TOP GUARD STATION STATUS & ONLINE/OFFLINE + VIGILANCE BAR
          ========================================================================= */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Guard Profile & Gate Info */}
          <div className="flex items-center gap-3.5">
            <div className="relative">
              <img
                src={guardProfile.masterPhotoUrl}
                alt={guardProfile.name}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-slate-200 shadow-xs"
              />
              <span
                className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                  guardProfile.isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
                }`}
                title={guardProfile.isOnline ? 'On Duty' : 'Off Duty'}
              />
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">{guardProfile.name}</h2>
                <span className="text-[10px] font-mono bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-200 font-bold">
                  {guardProfile.badgeNumber}
                </span>
                <span
                  className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border flex items-center gap-1 ${
                    guardProfile.isOnline
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      : 'bg-slate-100 text-slate-600 border-slate-300'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${guardProfile.isOnline ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                  {guardProfile.isOnline ? 'ON DUTY (ONLINE)' : 'OFF DUTY (OFFLINE)'}
                </span>
              </div>

              <p className="text-xs text-slate-500 mt-1 flex items-center gap-2 font-mono flex-wrap">
                <span className="flex items-center gap-1 text-slate-700 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600" /> {guardProfile.assignedGate}
                </span>
                <span>• Shift: {guardProfile.dutyShift}</span>
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-emerald-600" /> Geofence: ±{guardGeofence.distanceMeters}m (Inside)
                </span>
              </p>
            </div>
          </div>

          {/* Quick Action Toggles: On/Off Duty, Geofence Drift, Update Face */}
          <div className="flex items-center gap-2 flex-wrap self-start lg:self-auto">
            {/* On/Off Duty Switch */}
            <button
              onClick={() => setGuardOnlineStatus(!guardProfile.isOnline)}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-xs ${
                guardProfile.isOnline
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-slate-200 hover:bg-slate-300 text-slate-800'
              }`}
            >
              <Power className="w-4 h-4" />
              {guardProfile.isOnline ? 'Mark Off Duty' : 'Go On Duty (Online)'}
            </button>

            {/* Simulate Geofence Drift */}
            <button
              onClick={() => {
                guardGeofence.toggleGeofenceSimulation();
                updateGuardLocation(12.9248, 77.6745, !guardGeofence.isWithinGeofence, guardGeofence.isWithinGeofence ? 85 : 4);
              }}
              className="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Test GPS breach"
            >
              <Radio className="w-3.5 h-3.5 text-rose-600" />
              Simulate Drift
            </button>

            {/* Master Photo Admin/Update */}
            <button
              onClick={() => setIsMasterPhotoModalOpen(true)}
              className="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Update Master Reference Photo"
            >
              <Camera className="w-3.5 h-3.5 text-slate-600" />
              Master Face
            </button>

            {/* Handover & Sign Out Button */}
            <button
              onClick={() => logoutPortal('guard')}
              className="px-3.5 py-2.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
              title="Handover shift & sign out of terminal"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Shift Handover / Sign Out</span>
            </button>
          </div>
        </div>

        {/* Hourly Face Check & Vigilance Sub-Bar */}
        <div className="p-4 bg-gradient-to-r from-slate-50 to-blue-50/50 rounded-2xl border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <ScanFace className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900 text-sm">Hourly Biometric Vigilance Check</span>
                <span
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                    guardProfile.faceVerificationStatus === 'VERIFIED'
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                      : guardProfile.faceVerificationStatus === 'EXPIRED_ALERT'
                      ? 'bg-rose-100 text-rose-800 border-rose-300 animate-pulse'
                      : 'bg-amber-100 text-amber-800 border-amber-300'
                  }`}
                >
                  {guardProfile.faceVerificationStatus === 'VERIFIED'
                    ? 'VERIFIED & ACTIVE'
                    : guardProfile.faceVerificationStatus === 'EXPIRED_ALERT'
                    ? 'EXPIRED · ALERT ACTIVE'
                    : 'VERIFICATION DUE'}
                </span>
              </div>
              <p className="text-slate-600 mt-0.5">
                AI matches facial bone structure & landmark geometry with Society Panel registered master photo (uniform/hair ignored).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-end sm:self-auto shrink-0">
            <div className="text-right">
              <span className="text-[10px] text-slate-500 font-mono block">Next Check Due In:</span>
              <span className="text-base font-mono font-extrabold text-slate-900 tracking-wider">
                {formatTimer(hourlyTimerSecondsRemaining)}
              </span>
            </div>

            <button
              onClick={() => setIsFaceModalOpen(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5" />
              Verify Face Now
            </button>

            {/* Fast forward timer for test simulation */}
            <button
              onClick={() => {
                showToast('Fast Forward', 'Simulated 60m expiry! Expired alert sent to Society Panel.', 'alert');
                verifyGuardFaceHourly(guardProfile.id, guardProfile.masterPhotoUrl, undefined, true);
              }}
              className="p-2 bg-slate-200 hover:bg-rose-100 text-slate-700 hover:text-rose-700 rounded-xl transition-colors cursor-pointer"
              title="Test Expiry Mismatch Alert"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          REAL-TIME GEOFENCE RADAR & GUARD GPS SURVEILLANCE MAP
          ========================================================================= */}
      <GuardGeofenceMap interactive={true} />

      {/* =========================================================================
          2. CRITICAL EMERGENCY: FORCED ENTRY / INTRUSION PANIC BANNER
          ========================================================================= */}
      <div className="bg-gradient-to-r from-rose-600 to-red-700 p-5 rounded-3xl text-white shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-2 border-red-500 relative overflow-hidden">
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center text-white shrink-0 animate-pulse">
            <Siren className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider font-extrabold bg-white/20 px-2.5 py-0.5 rounded-full border border-white/30">
                1-TAP EMERGENCY DISPATCH
              </span>
            </div>
            <h3 className="text-xl font-black mt-1">Jabardasti Ghusne / Forced Entry Alarm</h3>
            <p className="text-xs text-white/90 mt-0.5">
              If an unauthorized visitor or vehicle attempts forced barrier ramming or gate bypass, press panic to broadcast sirens instantly to Resident App & Society Panel.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsIntrusionModalOpen(true)}
          className="px-6 py-3.5 bg-white hover:bg-rose-50 text-rose-700 font-extrabold text-sm rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer self-start sm:self-auto shrink-0 relative z-10 active:scale-95"
        >
          <AlertTriangle className="w-5 h-5 text-rose-600" />
          🚨 Trigger Forced Entry Alert
        </button>
      </div>

      {/* ACTIVE CRITICAL ALERTS LIST (IF ANY ACTIVE) */}
      {securityAlerts.filter(a => a.status === 'ACTIVE').length > 0 && (
        <div className="bg-rose-50 border-2 border-rose-400 p-5 rounded-3xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-rose-800 font-extrabold text-sm">
              <Siren className="w-5 h-5 text-rose-600 animate-bounce" />
              Active Society Emergency Alerts ({securityAlerts.filter(a => a.status === 'ACTIVE').length})
            </div>
            <span className="text-[10px] bg-rose-200 text-rose-900 font-mono px-2 py-0.5 rounded font-bold">
              LIVE BROADCAST ACTIVE
            </span>
          </div>

          <div className="space-y-2">
            {securityAlerts.filter(a => a.status === 'ACTIVE').map((alt) => (
              <div key={alt.id} className="p-3.5 bg-white rounded-2xl border border-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{alt.alertType}</span>
                    <span className="font-mono text-slate-500">• {alt.location}</span>
                    <span className="text-[10px] text-slate-400">• {alt.createdAt}</span>
                  </div>
                  <p className="text-slate-600 mt-1">{alt.description}</p>
                </div>

                <button
                  onClick={() => resolveSecurityAlert(alt.id, guardProfile.name)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer self-end sm:self-auto"
                >
                  Mark Secured / Clear
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          AUTONOMOUS DRONE RAPID INCIDENT RESPONSE & LIVE SENTINEL MONITOR (< 5 MIN SLA)
          ========================================================================= */}
      <div className={`p-5 sm:p-6 rounded-3xl border-2 transition-all shadow-sm space-y-4 ${
        activeDroneIncident 
          ? 'bg-rose-950 text-white border-rose-500 shadow-rose-950/40 ring-4 ring-rose-500/20 animate-pulse' 
          : 'bg-slate-900 text-white border-slate-700'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
              activeDroneIncident ? 'bg-rose-600 text-white animate-bounce' : 'bg-blue-600/30 text-blue-400 border border-blue-500/30'
            }`}>
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                  activeDroneIncident 
                    ? 'bg-rose-500 text-white' 
                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                }`}>
                  {activeDroneIncident ? '🚨 TRIPWIRE BREACH · DRONE INTERCEPT IN PROGRESS' : 'AUTONOMOUS DRONE SENTINEL ACTIVE'}
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  SLA: &lt; 5 Min Rapid Launch
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-white mt-0.5">
                {activeDroneIncident ? `${activeDroneIncident.triggerSensor} (${activeDroneIncident.location})` : 'Expansive Aerial Perimeter & Blindspot Surveillance'}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={async () => {
                setIsFlashingStrobe(true);
                await triggerDroneDeterrent(true, true);
                setTimeout(() => setIsFlashingStrobe(false), 3000);
              }}
              disabled={isFlashingStrobe}
              className="px-3.5 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Zap className={`w-3.5 h-3.5 ${isFlashingStrobe ? 'animate-spin' : ''}`} />
              {isFlashingStrobe ? 'Strobes Active!' : '⚡ 12,000lm Strobe / Siren'}
            </button>

            <button
              onClick={async () => {
                setIsLaunchingDrone(true);
                await dispatchDroneIncident(
                  'Perimeter Tripwire Laser #02 (East Boundary Wall)',
                  'East Boundary Wall Shrubbery Blindspot',
                  'Unauthorized Trespasser Heat Signature (37.2°C)'
                );
                setTimeout(() => setIsLaunchingDrone(false), 2000);
              }}
              disabled={isLaunchingDrone}
              className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <AlertTriangle className={`w-3.5 h-3.5 ${isLaunchingDrone ? 'animate-spin' : ''}`} />
              {isLaunchingDrone ? 'Launching Drone...' : '🚨 Simulate Tripwire Breach'}
            </button>
          </div>
        </div>

        {/* Live Drone HUD Telemetry & Thermal Threat Status */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="bg-black/40 p-3 rounded-2xl border border-white/10">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Flight Status</span>
            <span className="font-mono font-bold text-emerald-400 mt-1 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              {droneTelemetry.status === 'PATROLLING_PERIMETER' ? 'Airborne Orbit' : droneTelemetry.status.replace(/_/g, ' ')}
            </span>
          </div>

          <div className="bg-black/40 p-3 rounded-2xl border border-white/10">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Battery & Altitude</span>
            <span className="font-mono font-bold text-cyan-300 mt-1">
              {droneTelemetry.batteryPct}% · {droneTelemetry.altitudeMeters}m AGL
            </span>
          </div>

          <div className="bg-black/40 p-3 rounded-2xl border border-white/10">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Night FLIR Thermal</span>
            <span className="font-mono font-bold text-amber-300 mt-1 flex items-center gap-1">
              <Thermometer className="w-3.5 h-3.5" />
              {droneTelemetry.thermalMode.replace(/_/g, ' ')}
            </span>
          </div>

          <div className="bg-black/40 p-3 rounded-2xl border border-white/10">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Current Patrol Sector</span>
            <span className="font-mono font-bold text-slate-200 mt-1 truncate block">
              {droneTelemetry.currentZone}
            </span>
          </div>
        </div>

        {/* Active Incident Detail Banner if In Progress */}
        {activeDroneIncident && (
          <div className="bg-rose-900/60 p-4 rounded-2xl border border-rose-500/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="space-y-1">
              <p className="font-black text-rose-200 flex items-center gap-2">
                <Flame className="w-4 h-4 text-rose-400 animate-pulse" />
                VERIFIED THREAT: {activeDroneIncident.targetClassification} ({activeDroneIncident.thermalReadingCelsius}°C)
              </p>
              <p className="text-rose-100 font-mono text-[11px]">
                Target: {activeDroneIncident.location} · Status: <strong>{activeDroneIncident.droneStatus}</strong> · ETA: {activeDroneIncident.etaSeconds}s (&lt; 5m SLA)
              </p>
              <p className="text-slate-300 text-[11px]">
                Drone optical zoom and FLIR thermal sensor have locked onto the intrusion site. Video recording automatically synced to cloud security audit logs.
              </p>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
              <button
                onClick={() => {
                  triggerDroneDeterrent(true, true);
                  showToast('Deterrent Engaged', '12,000lm strobe lights and ultrasonic siren pulsing over intrusion zone.', 'warning');
                }}
                className="px-3 py-1.5 bg-amber-500 text-slate-950 font-black rounded-xl text-xs hover:bg-amber-400 transition-all cursor-pointer"
              >
                Pulse Strobes
              </button>
            </div>
          </div>
        )}
      </div>

      {/* =========================================================================
          3. VISITOR OTP VERIFICATION (MAIN REQUIREMENT)
          ========================================================================= */}
      <section className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div>
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Gate Intercom Barrier Sync</span>
          <h3 className="text-2xl font-extrabold text-slate-900 mt-0.5">Visitor OTP Gate Verification</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Koi bhi visitor jo aaya hai usko resident app se 4-digit OTP code aaya hoga. Ask visitor for their OTP code to verify and open barrier.
          </p>
        </div>

        {/* OTP Input Card */}
        <div className="bg-gradient-to-br from-slate-50 to-blue-50/40 p-5 rounded-2xl border-2 border-blue-200 space-y-4">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <ScanFace className="w-5 h-5 text-blue-600 absolute left-4 top-3.5" />
              <input
                type="text"
                maxLength={6}
                value={otpInput}
                onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
                placeholder="Enter 4-digit Visitor OTP (e.g. 7842, 3591, 9124)"
                className="w-full bg-white border-2 border-blue-300 rounded-2xl pl-12 pr-4 py-3 text-xl font-mono font-black text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 shadow-xs tracking-widest text-center sm:text-left"
              />
            </div>

            <button
              onClick={() => handleVerifyOtp()}
              disabled={isVerifyingOtp || otpInput.length < 4}
              className={`w-full sm:w-auto px-8 py-3.5 rounded-2xl font-extrabold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md ${
                otpInput.length >= 4
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              {isVerifyingOtp ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <CheckCircle2 className="w-5 h-5" />
              )}
              Verify OTP & Open Barrier
            </button>
          </div>

          {/* Quick OTP Sample Buttons for testing */}
          <div className="flex items-center gap-2 text-xs flex-wrap">
            <span className="text-slate-500 font-medium">Quick Test Sample OTPs:</span>
            {visitorInvites.filter(iv => iv.status === 'Pending_Verification').slice(0, 3).map((iv) => (
              <button
                key={iv.id}
                type="button"
                onClick={() => {
                  setOtpInput(iv.otpCode);
                  handleVerifyOtp(iv.otpCode);
                }}
                className="px-3 py-1.5 bg-white hover:bg-blue-100 border border-blue-200 text-blue-800 rounded-xl font-mono font-bold shadow-2xs cursor-pointer transition-colors"
              >
                #{iv.otpCode} ({iv.visitorName.split(' ')[0]} → {iv.unit})
              </button>
            ))}
          </div>

          {/* OTP Verification Result Alert */}
          {otpVerificationResult && (
            <div
              className={`p-4 rounded-2xl border text-xs flex items-center gap-3 animate-in fade-in duration-200 ${
                otpVerificationResult.success
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                  : 'bg-rose-50 border-rose-300 text-rose-900'
              }`}
            >
              {otpVerificationResult.success ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              ) : (
                <X className="w-5 h-5 text-rose-600 shrink-0" />
              )}
              <div className="flex-1">
                <p className="font-extrabold text-sm">{otpVerificationResult.message}</p>
                {otpVerificationResult.invite && (
                  <p className="mt-0.5 text-xs text-slate-700">
                    Visitor: <strong>{otpVerificationResult.invite.visitor_name}</strong> • Flat:{' '}
                    <strong>{otpVerificationResult.invite.unit}</strong> ({otpVerificationResult.invite.resident_name})
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Live Matching Invite Preview Card if typed code matches */}
        {matchedOtpInvite && (
          <div className="bg-emerald-50/80 p-5 rounded-2xl border-2 border-emerald-400 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-200 pb-3">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                  <Check className="w-6 h-6" />
                </span>
                <div>
                  <h4 className="font-extrabold text-slate-900 text-base">
                    Pre-Approved Guest: {matchedOtpInvite.visitorName}
                  </h4>
                  <p className="text-xs text-slate-600">
                    Target Unit: <strong className="text-slate-900">{matchedOtpInvite.unit}</strong> ({matchedOtpInvite.residentName})
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-500 font-mono block">OTP CODE</span>
                <span className="font-mono text-xl font-black text-emerald-800 tracking-widest">
                  {matchedOtpInvite.otpCode}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-white rounded-xl border border-emerald-100">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Category</span>
                <span className="font-bold text-slate-800 mt-0.5 block">{matchedOtpInvite.visitorType}</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-emerald-100">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Visitor Phone</span>
                <span className="font-mono text-slate-800 mt-0.5 block">{matchedOtpInvite.visitorPhone || 'N/A'}</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-emerald-100">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Vehicle Reg</span>
                <span className="font-mono text-slate-800 mt-0.5 block">{matchedOtpInvite.vehicleNumber || 'Pedestrian'}</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-emerald-100">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Valid Window</span>
                <span className="font-mono text-slate-800 mt-0.5 block">{matchedOtpInvite.validFrom} - {matchedOtpInvite.validUntil}</span>
              </div>
            </div>

            <button
              onClick={() => handleVerifyOtp(matchedOtpInvite.otpCode)}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-5 h-5" /> 1-Tap Permit Entry & Open Barrier Gate
            </button>
          </div>
        )}

        {/* OR CROSS-REFERENCE BY FLAT NUMBER */}
        <div className="pt-4 border-t border-slate-100 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-slate-900 text-sm">Or Cross-Reference Pre-Scheduled Delivery by Flat</h4>
            <button
              onClick={() => setIsManualModalOpen(true)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors inline-flex items-center gap-1.5 cursor-pointer"
            >
              <UserPlus className="w-4 h-4 text-blue-600" /> Register Unexpected Visitor
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
              <input
                type="text"
                value={unitSearch}
                onChange={(e) => setUnitSearch(e.target.value.toUpperCase())}
                placeholder="Enter Flat e.g. B-402, A-102, C-501"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-12 pr-4 py-2.5 text-base font-mono font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white shadow-xs"
              />
            </div>

            <div className="flex items-center gap-2">
              {['B-402', 'A-102', 'C-501'].map((u) => (
                <button
                  key={u}
                  type="button"
                  onClick={() => setUnitSearch(u)}
                  className={`px-3 py-2 text-xs font-mono font-bold rounded-xl border transition-all cursor-pointer ${
                    unitSearch === u ? 'bg-blue-600 border-blue-600 text-white shadow-xs' : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  {u}
                </button>
              ))}
            </div>
          </div>

          {matchedDelivery && (
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <span className="font-bold text-slate-900 text-sm">
                  {matchedDelivery.carrier} Delivery for {matchedDelivery.unit}
                </span>
                <p className="text-slate-500 mt-0.5">
                  Policy: <strong>{matchedDelivery.permission}</strong> • Passcode: <strong className="font-mono">{matchedDelivery.passcode}</strong>
                </p>
              </div>

              <button
                onClick={handleVerifyAndAdmit}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" /> Admit Courier
              </button>
            </div>
          )}
        </div>
      </section>

      {/* =========================================================================
          4. PREMISES MOVEMENT & ACTIVE ON-SITE ROSTER
          ========================================================================= */}
      <section className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">Perimeter Headcount</span>
            <h3 className="text-xl font-bold text-slate-900 mt-0.5">Active Deliveries & Visitors Inside Township</h3>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            {visitors.filter((v) => v.status === 'Inside').length} Individuals Currently Inside
          </span>
        </div>

        <div className="divide-y divide-slate-100 text-xs">
          {visitors.filter((v) => v.status === 'Inside').length === 0 ? (
            <p className="py-6 text-center text-slate-400 text-sm font-medium">No external visitors currently inside society grounds.</p>
          ) : (
            visitors
              .filter((v) => v.status === 'Inside')
              .map((vis) => (
                <div key={vis.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 px-2 rounded-xl transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 shrink-0">
                      {vis.purpose === 'Delivery' ? (
                        <Package className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Car className="w-4 h-4 text-purple-600" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{vis.name}</span>
                        <span className="text-[10px] font-mono font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                          {vis.company}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Visiting Unit: <strong className="text-slate-900 font-mono">{vis.unit}</strong> · Purpose: {vis.purpose}{' '}
                        {vis.vehicleNumber && `· Reg: ${vis.vehicleNumber}`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 self-end sm:self-auto">
                    <div className="text-right">
                      <span className="text-xs font-mono text-emerald-700 font-medium flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> {vis.entryTime}
                      </span>
                      <span className="text-[10px] text-slate-400">Barrier {vis.entryGate || 'Gate 01'}</span>
                    </div>

                    <button
                      onClick={() => markVisitorExited(vis.id)}
                      className="px-3.5 py-1.5 bg-slate-100 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 text-slate-700 hover:text-rose-700 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" /> Mark Exited
                    </button>
                  </div>
                </div>
              ))
          )}
        </div>
      </section>

      {/* =========================================================================
          MODAL 1: FORCED ENTRY / INTRUSION ALERT DISPATCH MODAL
          ========================================================================= */}
      {isIntrusionModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border-2 border-rose-500 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 border-b border-rose-100 pb-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <Siren className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase text-rose-800 bg-rose-100 px-2 py-0.5 rounded">
                  CRITICAL INCIDENT PROTOCOL
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">Forced Entry / Intrusion Alert</h3>
              </div>
            </div>

            {alertDispatched ? (
              <div className="py-10 text-center space-y-3">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-bold text-slate-900">Emergency Alert Broadcasted!</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Sirens and emergency banners pushed to Resident App, Society Management Panel, and Estate Office.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendIntrusionAlert} className="space-y-4 mt-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Gate Location</label>
                  <input
                    disabled
                    type="text"
                    value={guardProfile.assignedGate}
                    className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-600 cursor-not-allowed"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Intruder Vehicle Plate (If Any)</label>
                    <input
                      type="text"
                      placeholder="e.g. DL-08-BK-4091"
                      value={intruderVehicle}
                      onChange={(e) => setIntruderVehicle(e.target.value.toUpperCase())}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono font-bold focus:outline-none focus:border-rose-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Suspect Count</label>
                    <input
                      type="number"
                      min={1}
                      max={10}
                      value={intruderPersons}
                      onChange={(e) => setIntruderPersons(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold focus:outline-none focus:border-rose-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Incident Description & Threat Note</label>
                  <textarea
                    rows={3}
                    required
                    value={intruderDescription}
                    onChange={(e) => setIntruderDescription(e.target.value)}
                    placeholder="Describe vehicle model, behavior, refusal of OTP check, forced barrier pass..."
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 text-[11px] text-rose-800 space-y-1">
                  <p className="font-bold flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4" /> Real-time System Response:
                  </p>
                  <p>• Pushes high-decibel audible security alert to Society Management Committee.</p>
                  <p>• Displays prominent red lockdown alert banner on all resident smartphones.</p>
                  <p>• Logs incident timestamp and vehicle number into society security database.</p>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsIntrusionModalOpen(false)}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-black rounded-xl cursor-pointer shadow-md flex items-center gap-1.5"
                  >
                    <Siren className="w-4 h-4 animate-pulse" /> Dispatch High-Priority Alarm
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: HOURLY BIOMETRIC AI FACE VERIFICATION MODAL
          ========================================================================= */}
      {isFaceModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center">
                  <ScanFace className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900">Hourly Guard Face Verification</h3>
                  <p className="text-xs text-slate-500">
                    Matches facial landmarks with registered master photo stored in Society Panel.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsFaceModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 mt-5">
              {/* Comparison Preview (Current Captured vs Society Master Reference) */}
              <div className="grid grid-cols-2 gap-4">
                {/* Registered Master Reference */}
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-center space-y-2">
                  <span className="text-[10px] font-mono font-bold uppercase text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200 block">
                    Society Master Reference
                  </span>
                  <div className="relative mx-auto w-32 h-32 rounded-2xl overflow-hidden border-2 border-slate-300 shadow-xs">
                    <img
                      src={guardProfile.masterPhotoUrl}
                      alt="Registered Face"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 border-2 border-blue-500/60 rounded-2xl pointer-events-none" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-800 block">{guardProfile.name}</span>
                  <span className="text-[10px] text-slate-500 font-mono block">Registered in Society Panel</span>
                </div>

                {/* Current Captured Selfie with AI Landmark Mesh */}
                <div className="bg-blue-50/50 p-3.5 rounded-2xl border-2 border-blue-200 text-center space-y-2 relative">
                  <span className="text-[10px] font-mono font-bold uppercase text-blue-700 bg-blue-100 px-2 py-0.5 rounded border border-blue-200 block">
                    Live Guard Camera Capture
                  </span>

                  <div className="relative mx-auto w-32 h-32 rounded-2xl overflow-hidden border-2 border-blue-500 shadow-xs bg-slate-900">
                    <img
                      src={selectedSampleFace}
                      alt="Current Capture"
                      className="w-full h-full object-cover"
                    />

                    {/* AI Landmark Mesh Overlay Simulation */}
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                      {isScanningFace ? (
                        <div className="w-full h-full border-2 border-emerald-400 bg-emerald-500/10 flex flex-col items-center justify-center">
                          <RefreshCw className="w-6 h-6 text-white animate-spin" />
                          <span className="text-[9px] font-mono text-white mt-1 bg-black/60 px-1 rounded">
                            Analyzing Mesh...
                          </span>
                        </div>
                      ) : (
                        <div className="w-24 h-24 border border-emerald-400/80 rounded-xl relative">
                          {/* Eye centers */}
                          <div className="absolute top-7 left-5 w-2 h-2 rounded-full border border-emerald-400 bg-emerald-400/30" />
                          <div className="absolute top-7 right-5 w-2 h-2 rounded-full border border-emerald-400 bg-emerald-400/30" />
                          {/* Nose bridge */}
                          <div className="absolute top-12 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          {/* Mouth line */}
                          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-8 h-1 bg-emerald-400/60 rounded" />
                        </div>
                      )}
                    </div>
                  </div>

                  <span className="text-[11px] font-bold text-slate-800 block">Terminal Camera View</span>
                  <span className="text-[10px] text-blue-600 font-mono block">Landmark Triangulation Active</span>
                </div>
              </div>

              {/* Explanatory AI Note (Address User's exact prompt) */}
              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-[11px] text-amber-900 space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-600" /> AI Biometric Facial Keypoints Rule:
                </p>
                <p>
                  Yeh feature guard ka <strong>facial bone structure, eye distance, and contour</strong> match karta hai.
                  Guard ka <strong>uniform, dress, turban ya hair changes</strong> ko ignore kiya jaata hai.
                </p>
              </div>

              {/* Scan Status Feedback */}
              {faceScanStatus === 'passed' && (
                <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-900 font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  Facial Match Confirmed ({faceScanConfidence}% Biometric Confidence)! 60-Minute Duty Timer Reset.
                </div>
              )}

              {faceScanStatus === 'failed' && (
                <div className="p-3 bg-rose-50 border border-rose-300 rounded-xl text-xs text-rose-900 font-bold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  Facial Mismatch ({faceScanConfidence}%)! Alert broadcasted to Society Panel.
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <button
                  type="button"
                  disabled={isScanningFace}
                  onClick={() => handleExecuteFaceVerification(false)}
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isScanningFace ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <ScanFace className="w-4 h-4" />
                  )}
                  Verify Facial Match (Authorized Guard)
                </button>

                <button
                  type="button"
                  disabled={isScanningFace}
                  onClick={() => handleExecuteFaceVerification(true)}
                  className="px-4 py-3 bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 border border-slate-200 text-xs font-bold rounded-xl transition-all cursor-pointer"
                  title="Simulate proxy person or intruder attempting verification"
                >
                  Test Mismatch Proxy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 3: MANUAL VISITOR ADMISSION MODAL
          ========================================================================= */}
      {isManualModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-slate-900">Manual Visitor Gate Admittance</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Logs unexpected guest/delivery and sends intercom notification to unit {unitSearch}.
            </p>

            <form onSubmit={handleCreateManualEntry} className="space-y-4 mt-5">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Visitor / Driver Full Name</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Ramesh Kumar"
                  value={manualVisitorName}
                  onChange={(e) => setManualVisitorName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500 shadow-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Company / Agency</label>
                  <input
                    type="text"
                    placeholder="e.g. DTDC / Urban Co"
                    value={manualCompany}
                    onChange={(e) => setManualCompany(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500 shadow-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Vehicle Plate (If Any)</label>
                  <input
                    type="text"
                    placeholder="KA-01-AB-1234"
                    value={manualVehicle}
                    onChange={(e) => setManualVehicle(e.target.value.toUpperCase())}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 font-mono focus:outline-none focus:border-blue-500 shadow-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Purpose of Entry</label>
                <select
                  value={manualPurpose}
                  onChange={(e) => setManualPurpose(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500 shadow-xs"
                >
                  <option value="Delivery">Delivery / Courier</option>
                  <option value="Guest">Personal Guest / Relative</option>
                  <option value="Cab">Cab / Uber / Ola</option>
                  <option value="Service Staff">Service Staff / Technician</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsManualModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl cursor-pointer shadow-xs"
                >
                  Admit & Alert Resident
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 4: MASTER REFERENCE PHOTO UPDATE MODAL
          ========================================================================= */}
      {isMasterPhotoModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-slate-900">Update Master Reference Face</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Syncs with Society Panel admin database for hourly facial biometric comparison.
            </p>

            <div className="space-y-4 mt-5">
              <div className="text-center">
                <img
                  src={newMasterPhotoUrl}
                  alt="Preview"
                  className="w-28 h-28 rounded-2xl mx-auto object-cover border-2 border-blue-500 shadow-md"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Image URL / Facial Asset</label>
                <input
                  type="text"
                  value={newMasterPhotoUrl}
                  onChange={(e) => setNewMasterPhotoUrl(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setNewMasterPhotoUrl('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80')}
                  className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold rounded-lg"
                >
                  Face Profile A
                </button>
                <button
                  type="button"
                  onClick={() => setNewMasterPhotoUrl('https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80')}
                  className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold rounded-lg"
                >
                  Face Profile B
                </button>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsMasterPhotoModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    updateGuardMasterPhoto(guardProfile.id, newMasterPhotoUrl);
                    setIsMasterPhotoModalOpen(false);
                  }}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl cursor-pointer shadow-xs"
                >
                  Save Master Reference
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
