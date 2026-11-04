import React, { useState } from 'react';
import { 
  Building2, 
  Smartphone, 
  ShieldCheck, 
  Droplet, 
  Sliders, 
  KeyRound, 
  UserCheck, 
  Mail, 
  Lock, 
  Phone, 
  Home, 
  ShieldAlert, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight,
  UserPlus,
  LogIn,
  Eye,
  EyeOff,
  ArrowLeft,
  BadgeAlert
} from 'lucide-react';
import { PortalRole, AuthUser } from '../types/auth';
import { useCivicOps } from '../context/CivicOpsContext';

interface SectionAuthScreenProps {
  role: PortalRole;
  onSuccess?: (user: AuthUser) => void;
  onCancel?: () => void;
}

export const SectionAuthScreen: React.FC<SectionAuthScreenProps> = ({ role, onSuccess, onCancel }) => {
  const { loginPortal, signupPortal, societyConfig, setActiveView, showToast } = useCivicOps();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Sign In Form States
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('password123');
  const [gateId, setGateId] = useState('Gate 01');

  // Sign Up Form States
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPhone, setSignupPhone] = useState('+91 98');
  const [signupPassword, setSignupPassword] = useState('password123');
  const [signupUnit, setSignupUnit] = useState('A-201');
  const [signupBlock, setSignupBlock] = useState('Tower A');
  const [signupResidentType, setSignupResidentType] = useState<'Owner' | 'Tenant'>('Owner');
  const [signupCommitteeRole, setSignupCommitteeRole] = useState('Executive Committee Member');
  const [signupBadge, setSignupBadge] = useState('SEC-0995');
  const [signupGate, setSignupGate] = useState('Gate 01');
  const [signupDept, setSignupDept] = useState('Smart Water & Hydro-Mechanical');

  // Role Configurations
  const roleConfigs = {
    resident: {
      title: 'Resident Portal',
      subtitle: 'Flat Owner & Tenant Access',
      icon: Smartphone,
      accentColor: 'from-blue-600 to-indigo-600',
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
      description: 'Access digital billing, gatekeeper delivery OTPs, visitor passes, amenity reservations, and community helpdesk.',
      identifierPlaceholder: 'Flat No. (e.g. A-101) or Registered Phone',
      identifierLabel: 'Flat Unit No. or Mobile / Email',
      demoPreset: { identifier: 'A-101', name: 'Dr. Rajesh Sharma (A-101)', password: 'password123' },
      quickLogins: [
        { label: 'Dr. Rajesh Sharma (A-101)', unit: 'A-101', sub: 'Tower A · Flat Owner' },
        { label: 'Pooja Hegde (B-402)', unit: 'B-402', sub: 'Tower B · Flat Owner' },
        { label: 'Vikram Malhotra (A-102)', unit: 'A-102', sub: 'Tower A · Resident' }
      ]
    },
    society_panel: {
      title: 'Society Management Panel',
      subtitle: 'RWA & Managing Committee Console',
      icon: Building2,
      accentColor: 'from-emerald-600 to-teal-700',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      description: 'Authorized administrative cockpit for RWA President, General Secretary, Treasurer, and Estate Managers.',
      identifierPlaceholder: 'Official Email (e.g. president@smartaisociety.com)',
      identifierLabel: 'Committee Email or Username',
      demoPreset: { identifier: 'president@smartaisociety.com', name: 'Mr. Anand Verma (President)', password: 'password123' },
      quickLogins: [
        { label: 'Mr. Anand Verma (President)', id: 'president@smartaisociety.com', sub: 'Executive Committee Lead' },
        { label: 'Mrs. Sunita Rao (Secretary)', id: 'secretary@smartaisociety.com', sub: 'General Secretary' },
        { label: 'CA Rajesh Iyer (Treasurer)', id: 'treasurer@smartaisociety.com', sub: 'Accounts & Audits' }
      ]
    },
    guard: {
      title: 'Guard & Gatekeeper Terminal',
      subtitle: 'Perimeter Security & Access Control',
      icon: ShieldCheck,
      accentColor: 'from-slate-800 to-slate-900',
      badgeColor: 'bg-slate-200 text-slate-800 border-slate-300',
      description: 'Duty clock-in, AI face verification, vehicle scanner, visitor OTP admissions, and drone security scramble.',
      identifierPlaceholder: 'Officer Badge No. (e.g. SEC-0891)',
      identifierLabel: 'Security Badge Number or Phone',
      demoPreset: { identifier: 'SEC-0891', name: 'Officer Vikram Singh (Gate 01)', password: '1234' },
      quickLogins: [
        { label: 'Officer Vikram Singh', badge: 'SEC-0891', gate: 'Gate 01', sub: 'Main North Entrance' },
        { label: 'Officer Deepesh Das', badge: 'SEC-0892', gate: 'Gate 02', sub: 'Tower B South Gate' },
        { label: 'Supervisor Manoj Kumar', badge: 'SEC-0895', gate: 'Gate 01', sub: 'Duty Supervisor' }
      ]
    },
    water: {
      title: 'Smart Water & SCADA Telemetry',
      subtitle: 'Industrial IoT Operations Monitor',
      icon: Droplet,
      accentColor: 'from-cyan-600 to-blue-700',
      badgeColor: 'bg-cyan-100 text-cyan-800 border-cyan-200',
      description: 'Facilities engineering interface for real-time ultrasonic tank levels, pump relay triggers, and automated fail-safes.',
      identifierPlaceholder: 'Engineer ID or Email (e.g. ENG-W-104)',
      identifierLabel: 'Facility Engineer ID or Email',
      demoPreset: { identifier: 'ENG-W-104', name: 'Er. Sandeep Rao', password: '1234' },
      quickLogins: [
        { label: 'Er. Sandeep Rao', id: 'ENG-W-104', sub: 'Chief Facilities Engineer' },
        { label: 'Tech. Ramesh Yadav', id: 'TECH-P-202', sub: 'Hydro-Mechanical Lead' }
      ]
    },
    provisioning: {
      title: 'smartaisociety Master Console',
      subtitle: 'Global Multi-Tenant Cockpit',
      icon: Sliders,
      accentColor: 'from-indigo-700 to-purple-800',
      badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      description: 'Master administrative operations, interactive SQL workbench, database backup downloads, and cluster provisioning.',
      identifierPlaceholder: 'admin@smartaisociety.com',
      identifierLabel: 'Master Admin Email or User ID',
      demoPreset: { identifier: 'admin@smartaisociety.com', name: 'Master Cloud Administrator', password: 'admin123' },
      quickLogins: [
        { label: 'Master Administrator', id: 'admin@smartaisociety.com', sub: 'Root Super-Admin Clearance' }
      ]
    }
  };

  const config = roleConfigs[role];
  const IconComponent = config.icon;

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const idToUse = identifier.trim() || config.demoPreset.identifier;
    setLoading(true);
    setError(null);

    try {
      const user = await loginPortal({
        role,
        identifier: idToUse,
        password: password || config.demoPreset.password,
        gateId: role === 'guard' ? gateId : undefined
      });
      showToast(`Welcome back, ${user.name}!`, `Authenticated for ${config.title}.`, 'success');
      if (onSuccess) onSuccess(user);
    } catch (err: unknown) {
      setError(String(err) || 'Authentication failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = async (quickId: string, customGate?: string) => {
    setLoading(true);
    setError(null);
    try {
      const user = await loginPortal({
        role,
        identifier: quickId,
        password: config.demoPreset.password,
        gateId: customGate || gateId
      });
      showToast(`Logged in as ${user.name}`, `Granted access to ${config.title}.`, 'success');
      if (onSuccess) onSuccess(user);
    } catch (err: unknown) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupName.trim() || !signupEmail.trim()) {
      setError('Please provide your name and email address.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const user = await signupPortal({
        role,
        name: signupName.trim(),
        email: signupEmail.trim(),
        phone: signupPhone.trim(),
        password: signupPassword,
        unit: role === 'resident' ? signupUnit : undefined,
        block: role === 'resident' ? signupBlock : undefined,
        residentType: role === 'resident' ? signupResidentType : undefined,
        committeeRole: role === 'society_panel' ? signupCommitteeRole : undefined,
        badgeNumber: role === 'guard' ? signupBadge : undefined,
        gateId: role === 'guard' ? signupGate : undefined,
        department: role === 'water' ? signupDept : undefined
      });
      showToast(`Account Created Successfully!`, `Welcome to smartaisociety, ${user.name}.`, 'success');
      if (onSuccess) onSuccess(user);
    } catch (err: unknown) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-xl bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header Ribbon */}
        <div className={`bg-gradient-to-r ${config.accentColor} p-6 sm:p-8 text-white relative`}>
          <div className="flex items-center justify-between mb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider">
              <IconComponent className="w-3.5 h-3.5" />
              <span>{config.subtitle}</span>
            </div>

            <button
              onClick={() => (onCancel ? onCancel() : setActiveView('marketing'))}
              className="text-xs font-bold text-white/80 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </button>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/15 border border-white/30 flex items-center justify-center shrink-0 shadow-inner">
              <IconComponent className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tight">{config.title}</h2>
              <p className="text-xs text-white/90 mt-1 leading-relaxed">{config.description}</p>
              <p className="text-[11px] text-white/75 mt-1 font-mono">
                Society Tenant: <strong>{societyConfig.name}</strong> ({societyConfig.city})
              </p>
            </div>
          </div>

          {/* Mode Switch Tabs */}
          <div className="flex bg-black/20 p-1 rounded-xl mt-6">
            <button
              onClick={() => { setMode('signin'); setError(null); }}
              className={`flex-1 py-2 text-xs font-extrabold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                mode === 'signin' ? 'bg-white text-slate-900 shadow-sm' : 'text-white/80 hover:text-white'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
            <button
              onClick={() => { setMode('signup'); setError(null); }}
              className={`flex-1 py-2 text-xs font-extrabold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                mode === 'signup' ? 'bg-white text-slate-900 shadow-sm' : 'text-white/80 hover:text-white'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Create Account (Sign Up)</span>
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {error && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-800 font-bold flex items-center gap-2">
              <BadgeAlert className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* =========================================================================
              SIGN IN TAB
              ========================================================================= */}
          {mode === 'signin' && (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="text-xs font-extrabold text-slate-700 block mb-1.5">
                  {config.identifierLabel}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder={config.identifierPlaceholder}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white shadow-2xs"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <UserCheck className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {role === 'guard' && (
                <div>
                  <label className="text-xs font-extrabold text-slate-700 block mb-1.5">
                    Assigned Gate Station
                  </label>
                  <select
                    value={gateId}
                    onChange={(e) => setGateId(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    <option value="Gate 01">Gate 01 (Main North Entrance)</option>
                    <option value="Gate 02">Gate 02 (Tower B South Gate)</option>
                    <option value="Service Gate">Service & Delivery Gate</option>
                  </select>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-extrabold text-slate-700">
                    Password / Access PIN
                  </label>
                  <span className="text-[11px] text-slate-500 font-mono">Demo: {config.demoPreset.password}</span>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white shadow-2xs font-mono"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>Sign In to {config.title}</span>
                  </>
                )}
              </button>

              {/* 1-Click Quick Demo Switcher */}
              <div className="pt-4 border-t border-slate-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Or Select 1-Click Demo Profile:</span>
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {config.quickLogins.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleQuickDemoLogin(
                        'unit' in item ? item.unit : 'id' in item ? item.id : 'badge' in item ? item.badge : '',
                        'gate' in item ? item.gate : undefined
                      )}
                      className="p-2.5 text-left bg-slate-50 hover:bg-blue-50/70 border border-slate-200 hover:border-blue-300 rounded-xl transition-all cursor-pointer group"
                    >
                      <p className="text-xs font-bold text-slate-900 group-hover:text-blue-700">{item.label}</p>
                      <p className="text-[10px] text-slate-500">{item.sub}</p>
                    </button>
                  ))}
                </div>
              </div>
            </form>
          )}

          {/* =========================================================================
              SIGN UP / REGISTRATION TAB
              ========================================================================= */}
          {mode === 'signup' && (
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-extrabold text-slate-700 block mb-1">Full Name*</label>
                  <input
                    type="text"
                    required
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    placeholder="e.g. Ramesh Kulkarni"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-extrabold text-slate-700 block mb-1">Phone Number*</label>
                  <input
                    type="text"
                    required
                    value={signupPhone}
                    onChange={(e) => setSignupPhone(e.target.value)}
                    placeholder="+91 98000 00000"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-extrabold text-slate-700 block mb-1">Email Address*</label>
                <input
                  type="email"
                  required
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  placeholder="ramesh@example.com"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Role-Specific Registration Fields */}
              {role === 'resident' && (
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-xs font-extrabold text-slate-700 block mb-1">Tower/Wing</label>
                    <select
                      value={signupBlock}
                      onChange={(e) => setSignupBlock(e.target.value)}
                      className="w-full px-2 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800"
                    >
                      <option value="Tower A">Tower A</option>
                      <option value="Tower B">Tower B</option>
                      <option value="Tower C">Tower C</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-extrabold text-slate-700 block mb-1">Flat No.*</label>
                    <input
                      type="text"
                      required
                      value={signupUnit}
                      onChange={(e) => setSignupUnit(e.target.value)}
                      placeholder="e.g. A-302"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-extrabold text-slate-700 block mb-1">Occupancy</label>
                    <select
                      value={signupResidentType}
                      onChange={(e) => setSignupResidentType(e.target.value as 'Owner' | 'Tenant')}
                      className="w-full px-2 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800"
                    >
                      <option value="Owner">Owner</option>
                      <option value="Tenant">Tenant</option>
                    </select>
                  </div>
                </div>
              )}

              {role === 'society_panel' && (
                <div>
                  <label className="text-xs font-extrabold text-slate-700 block mb-1">Committee Designation*</label>
                  <select
                    value={signupCommitteeRole}
                    onChange={(e) => setSignupCommitteeRole(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800"
                  >
                    <option value="Executive Committee Member">Executive Committee Member</option>
                    <option value="President">President</option>
                    <option value="General Secretary">General Secretary</option>
                    <option value="Treasurer">Treasurer</option>
                    <option value="Estate & Facility Manager">Estate & Facility Manager</option>
                  </select>
                </div>
              )}

              {role === 'guard' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-extrabold text-slate-700 block mb-1">Security Badge ID*</label>
                    <input
                      type="text"
                      required
                      value={signupBadge}
                      onChange={(e) => setSignupBadge(e.target.value)}
                      placeholder="SEC-0995"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-extrabold text-slate-700 block mb-1">Assigned Gate</label>
                    <select
                      value={signupGate}
                      onChange={(e) => setSignupGate(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800"
                    >
                      <option value="Gate 01">Gate 01 (North Gate)</option>
                      <option value="Gate 02">Gate 02 (South Gate)</option>
                      <option value="Service Gate">Service Gate</option>
                    </select>
                  </div>
                </div>
              )}

              {role === 'water' && (
                <div>
                  <label className="text-xs font-extrabold text-slate-700 block mb-1">Technical Department</label>
                  <select
                    value={signupDept}
                    onChange={(e) => setSignupDept(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800"
                  >
                    <option value="Smart Water & Hydro-Mechanical">Smart Water & Hydro-Mechanical</option>
                    <option value="Electrical & Solar SCADA">Electrical & Solar SCADA</option>
                    <option value="Civil & Sewage Treatment (STP)">Civil & Sewage Treatment (STP)</option>
                  </select>
                </div>
              )}

              <div>
                <label className="text-xs font-extrabold text-slate-700 block mb-1">Create Password*</label>
                <input
                  type="password"
                  required
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  placeholder="Create a secure password"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <span>Registering...</span>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>Complete Registration & Launch {config.title}</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
