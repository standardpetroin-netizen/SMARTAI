import React, { useState, useEffect } from 'react';
import { useSmartAISociety, AppViewMode } from '../context/SmartAISocietyContext';
import { 
  Sparkles, 
  ArrowLeft, 
  Smartphone, 
  ShieldCheck, 
  Droplet, 
  Sliders, 
  Building2, 
  LogOut, 
  UserCheck,
  Lock,
  Clock,
  Activity
} from 'lucide-react';
import { Brand3DLogo } from './Brand3DLogo';
import { PortalRole } from '../types/auth';

export const SubAppNavHeader: React.FC = () => {
  const { 
    activeView, 
    setActiveView, 
    societyConfig, 
    authUsers, 
    logoutPortal, 
    isSubscribed, 
    resetSubscriptionStatus, 
    openSubscriptionModal 
  } = useSmartAISociety();

  // Live operational clock for ERP operations
  const [currentTime, setCurrentTime] = useState<string>(() => {
    return new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const navItems: { id: AppViewMode; label: string; icon: React.ElementType }[] = [
    { id: 'resident', label: 'Resident App', icon: Smartphone },
    { id: 'society_panel', label: 'Society Panel (ERP)', icon: Building2 },
    { id: 'guard', label: 'Smart Gate', icon: ShieldCheck },
    { id: 'water', label: 'IoT Water Ops', icon: Droplet },
    { id: 'provisioning', label: 'Site Admin', icon: Sliders },
  ];

  const currentPortalRole: PortalRole | null = 
    activeView === 'resident' || activeView === 'society_panel' || activeView === 'guard' || activeView === 'water' || activeView === 'provisioning'
      ? activeView
      : null;

  const currentUser = currentPortalRole ? authUsers[currentPortalRole] : null;

  return (
    <header className="border-b border-slate-200/90 bg-white/95 backdrop-blur-md sticky top-0 z-40 px-4 sm:px-6 py-2.5 shadow-xs">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Left: smartaisociety brand & Back to Home */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <button
            onClick={() => setActiveView('marketing')}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-blue-600 bg-slate-100/90 hover:bg-slate-200/80 px-3 py-1.5 rounded-xl transition-all cursor-pointer shadow-xs border border-slate-200/60"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-slate-500" />
            <span>Home</span>
          </button>

          <Brand3DLogo
            size="sm"
            showText={true}
            onClick={() => setActiveView('marketing')}
          />

          {/* Operational Status Pill */}
          <div className="hidden xl:flex items-center gap-1.5 text-[11px] font-mono font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/80">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>ERP LIVE</span>
          </div>
        </div>

        {/* Center: Module Switcher */}
        <div className="flex items-center gap-1 p-1 bg-slate-100/90 rounded-2xl border border-slate-200/80 overflow-x-auto max-w-full">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  if (!isSubscribed) {
                    openSubscriptionModal(item.label, item.id);
                  } else {
                    setActiveView(item.id);
                  }
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-white text-slate-900 shadow-sm border border-slate-200/90'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right: Active Society & User Profile & Live Clock */}
        <div className="flex items-center gap-2.5 self-end md:self-auto text-xs">
          {/* Live Operational Clock */}
          <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-mono text-slate-600 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-full shadow-2xs tabular-nums">
            <Clock className="w-3 h-3 text-slate-400" />
            <span>{currentTime}</span>
          </div>

          {currentUser ? (
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 pl-2 pr-1.5 py-1 rounded-full shadow-2xs">
              {currentUser.avatarUrl ? (
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.name}
                  className="w-6 h-6 rounded-full object-cover border border-slate-300 shrink-0"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                  {currentUser.name.charAt(0)}
                </div>
              )}
              <div className="flex flex-col text-left pr-1 leading-tight">
                <span className="font-extrabold text-slate-900 text-[11px] truncate max-w-[120px]">
                  {currentUser.name}
                </span>
                <span className="text-[9px] text-blue-600 font-bold">
                  {currentUser.unit || currentUser.roleTitle || currentUser.role}
                </span>
              </div>
              <button
                onClick={() => currentPortalRole && logoutPortal(currentPortalRole)}
                title="Sign out of this portal"
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-slate-500 font-bold">
              <UserCheck className="w-3.5 h-3.5 text-amber-500" />
              <span>Not Signed In</span>
            </div>
          )}

          {/* Tenant & Subscription Pill */}
          <div className="flex items-center gap-2">
            {isSubscribed ? (
              <button
                type="button"
                onClick={resetSubscriptionStatus}
                title="Click to reset subscription and test locked state"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-full font-bold text-[10px] cursor-pointer hover:bg-rose-50 hover:text-rose-700 hover:border-rose-300 transition-colors shadow-2xs"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Subscribed</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => openSubscriptionModal('Township Management Portal')}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 border border-amber-300 text-amber-900 rounded-full font-bold text-[10px] cursor-pointer hover:bg-amber-200 transition-colors shadow-2xs"
              >
                <Lock className="w-3 h-3 text-amber-700" />
                <span>Subscription</span>
              </button>
            )}

            <span className="hidden lg:flex font-bold text-slate-800 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-full items-center gap-1.5 max-w-[200px] truncate" title={societyConfig.name}>
              <span
                className="w-2 h-2 rounded-full inline-block shrink-0"
                style={{ backgroundColor: societyConfig.primaryColor }}
              />
              <span className="truncate">{societyConfig.name}</span>
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
