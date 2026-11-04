import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Bell, 
  Play, 
  CheckCircle2, 
  ExternalLink, 
  AlertTriangle, 
  Send, 
  Package, 
  Flame,
  Terminal
} from 'lucide-react';
import { SocietyConfig, NotificationRule } from '../../types';
import { INITIAL_NOTIFICATION_RULES } from '../../utils/sampleData';

interface StepNotificationsRunnerProps {
  config: SocietyConfig;
  onPrev: () => void;
  onLaunchPortal: () => void;
}

export const StepNotificationsRunner: React.FC<StepNotificationsRunnerProps> = ({
  config,
  onPrev,
  onLaunchPortal,
}) => {
  const [notificationRules, setNotificationRules] = useState<NotificationRule[]>(INITIAL_NOTIFICATION_RULES);
  const [isProvisioning, setIsProvisioning] = useState<boolean>(false);
  const [provisionProgress, setProvisionProgress] = useState<number>(0);
  const [provisionLogs, setProvisionLogs] = useState<string[]>([]);
  const [isProvisioned, setIsProvisioned] = useState<boolean>(false);

  // Live test notification toast state
  const [simulatedAlert, setSimulatedAlert] = useState<{ title: string; body: string; type: string } | null>(null);

  const toggleRule = (id: string) => {
    setNotificationRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );
  };

  const handleFireTestAlert = (type: 'visitor' | 'delivery' | 'sos') => {
    if (type === 'visitor') {
      setSimulatedAlert({
        title: 'Visitor at Gate 1: Guest Rahul Sharma',
        body: 'Arrived for Unit A-102. Car Reg: KA-01-MJ-4820. Tap to Approve or Deny entry.',
        type: 'visitor',
      });
    } else if (type === 'delivery') {
      setSimulatedAlert({
        title: 'Amazon Package Locker: Unit B-304',
        body: 'Courier logged 1 parcel in Gatehouse Locker #14. Retrieval OTP: 5932.',
        type: 'delivery',
      });
    } else {
      setSimulatedAlert({
        title: 'EMERGENCY SOS: Central Podium Pool Zone',
        body: 'Panic alarm triggered by Resident #C-501. Guard Squad 1 dispatched.',
        type: 'sos',
      });
    }

    setTimeout(() => {
      setSimulatedAlert(null);
    }, 6000);
  };

  const handleRunProvisioningJob = () => {
    setIsProvisioning(true);
    setProvisionProgress(10);
    setProvisionLogs([
      `[00:00:01] Initializing isolated multi-tenant database namespace: soc_${config.subdomain}...`,
    ]);

    setTimeout(() => {
      setProvisionProgress(35);
      setProvisionLogs((prev) => [
        ...prev,
        `[00:00:02] Ingesting branding tokens (Primary: ${config.primaryColor}, Emblem: ${config.logoEmblem})...`,
        `[00:00:02] Compiling PWA install manifest for https://${config.subdomain}.smartaisociety.io...`,
      ]);
    }, 800);

    setTimeout(() => {
      setProvisionProgress(65);
      setProvisionLogs((prev) => [
        ...prev,
        `[00:00:03] Minting 320 cryptographically signed flat & dustbin QR codes...`,
        `[00:00:04] Initializing 5 perimeter guard patrol checkpoints with geofence constraints...`,
      ]);
    }, 1800);

    setTimeout(() => {
      setProvisionProgress(88);
      setProvisionLogs((prev) => [
        ...prev,
        `[00:00:05] Provisioning Cloudflare Edge CNAME and Let's Encrypt Wildcard SSL...`,
        `[00:00:06] Issuing Master Society Admin credentials to ${config.adminEmail}...`,
      ]);
    }, 2800);

    setTimeout(() => {
      setProvisionProgress(100);
      setProvisionLogs((prev) => [
        ...prev,
        `[00:00:07] Provisioning job complete! Society tenant "${config.name}" is now LIVE.`,
      ]);
      setIsProvisioning(false);
      setIsProvisioned(true);
    }, 3800);
  };

  return (
    <div className="space-y-6 text-slate-800">
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-purple-600 uppercase tracking-wider">
          <span>Stage 05</span>
          <span>·</span>
          <span>Automated Provisioning Pipeline & Alerts</span>
        </div>
        <h3 className="text-2xl font-bold text-slate-900 mt-1">Real-Time Notification Engine & Job Execution</h3>
        <p className="text-xs text-slate-500 mt-1">
          Review automated alert routing rules and execute the end-to-end society provisioning job.
        </p>
      </div>

      {/* Simulated Live Mobile Toast Alert */}
      {simulatedAlert && (
        <div className="p-4 rounded-3xl border-2 transition-all animate-bounce shadow-xl flex items-start justify-between gap-3 bg-white border-blue-500">
          <div className="flex items-start gap-3">
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-xs ${
                simulatedAlert.type === 'sos'
                  ? 'bg-rose-100 text-rose-600 border border-rose-300'
                  : simulatedAlert.type === 'delivery'
                  ? 'bg-emerald-100 text-emerald-600 border border-emerald-300'
                  : 'bg-blue-100 text-blue-600 border border-blue-300'
              }`}
            >
              {simulatedAlert.type === 'sos' ? (
                <Flame className="w-5 h-5" />
              ) : simulatedAlert.type === 'delivery' ? (
                <Package className="w-5 h-5" />
              ) : (
                <Bell className="w-5 h-5" />
              )}
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">{simulatedAlert.title}</p>
              <p className="text-xs text-slate-600 mt-0.5">{simulatedAlert.body}</p>
              <span className="text-[10px] text-blue-700 font-bold mt-1 block">Live Push & WhatsApp Dispatch Simulated</span>
            </div>
          </div>
          <button
            onClick={() => setSimulatedAlert(null)}
            className="text-xs font-bold text-slate-500 hover:text-slate-900 cursor-pointer px-2 py-1 bg-slate-100 rounded-lg"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Notification Trigger Matrix */}
      <div className="bg-slate-50 p-5 sm:p-6 rounded-3xl border border-slate-200 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-slate-200">
          <div>
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Bell className="w-4 h-4 text-purple-600" /> Automated Incident & Operational Dispatch Rules
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">Multi-channel routing via Mobile Push, SMS, and WhatsApp</p>
          </div>

          {/* Test buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleFireTestAlert('visitor')}
              className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 text-xs font-bold text-slate-700 rounded-xl cursor-pointer shadow-xs"
            >
              Test Visitor Entry
            </button>
            <button
              onClick={() => handleFireTestAlert('delivery')}
              className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 text-xs font-bold text-slate-700 rounded-xl cursor-pointer shadow-xs"
            >
              Test Parcel Drop
            </button>
            <button
              onClick={() => handleFireTestAlert('sos')}
              className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-300 text-xs font-bold text-rose-700 rounded-xl cursor-pointer shadow-xs"
            >
              Test SOS Siren
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {notificationRules.map((rule) => (
            <div
              key={rule.id}
              className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-3 ${
                rule.enabled ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-100/70 border-slate-200 opacity-60'
              }`}
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900">{rule.title}</span>
                  <span
                    className={`text-[9px] px-2 py-0.5 rounded-full font-mono uppercase font-bold ${
                      rule.severity === 'critical'
                        ? 'bg-rose-100 text-rose-800 border border-rose-300'
                        : rule.severity === 'high'
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : 'bg-blue-100 text-blue-800 border border-blue-300'
                    }`}
                  >
                    {rule.severity}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{rule.description}</p>
                <div className="flex items-center gap-1.5 pt-1 text-[10px] text-slate-500 font-mono">
                  <span className="font-semibold text-slate-700">Channels:</span>
                  {rule.channels.map((ch) => (
                    <span key={ch} className="bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded text-slate-700 font-bold">
                      {ch}
                    </span>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => toggleRule(rule.id)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer shrink-0 mt-0.5 ${
                  rule.enabled ? 'bg-blue-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    rule.enabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Automated Provisioning Execution Terminal Runner */}
      <div className="bg-slate-50 p-5 sm:p-6 rounded-3xl border border-slate-200 space-y-4 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-indigo-600" />
            <h4 className="text-sm font-bold text-slate-900">Automated Super-Admin Provisioning Runner</h4>
          </div>
          {isProvisioned && (
            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" /> Tenant Live & Ready
            </span>
          )}
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-mono font-bold text-slate-700">
            <span>Provisioning Status:</span>
            <span>{provisionProgress}%</span>
          </div>
          <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden border border-slate-300 shadow-inner">
            <div
              className="bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500 h-full transition-all duration-300 rounded-full"
              style={{ width: `${provisionProgress}%` }}
            />
          </div>
        </div>

        {/* Terminal Logs in high-contrast clean colored console */}
        <div className="bg-slate-900 rounded-2xl border-2 border-slate-800 p-4.5 font-mono text-xs text-slate-200 space-y-1.5 min-h-32 max-h-48 overflow-y-auto shadow-inner">
          {provisionLogs.length === 0 ? (
            <p className="text-slate-400">
              Ready to execute automated jobs: Host routing, Branding ingestion, QR matrix generation, and Master Admin credentials.
            </p>
          ) : (
            provisionLogs.map((log, index) => (
              <p
                key={index}
                className={log.includes('complete') ? 'text-emerald-400 font-bold' : 'text-slate-300'}
              >
                {log}
              </p>
            ))
          )}
        </div>

        {/* Action button */}
        {!isProvisioned ? (
          <button
            onClick={handleRunProvisioningJob}
            disabled={isProvisioning}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-blue-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Play className={`w-4 h-4 ${isProvisioning ? 'animate-spin' : ''}`} />
            {isProvisioning ? 'Executing Multi-Tenant Automated Jobs...' : 'Execute Provisioning Job Now'}
          </button>
        ) : (
          <div className="p-5 bg-emerald-50 border-2 border-emerald-300 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
            <div>
              <p className="text-base font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" /> {config.name} Successfully Onboarded
              </p>
              <p className="text-xs text-slate-600 mt-1 font-mono">
                Live URL: https://{config.subdomain}.smartaisociety.io
                {config.isCustomDomainActive && ` (Custom: https://${config.customDomain})`}
              </p>
            </div>
            <button
              onClick={onLaunchPortal}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-600/25 transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap"
            >
              Launch Live Society Portal <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      <div className="flex justify-between pt-5 border-t border-slate-200">
        <button
          onClick={onPrev}
          className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Committee & Roster
        </button>
      </div>
    </div>
  );
};
