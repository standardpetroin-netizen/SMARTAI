import React, { useState } from 'react';
import { X, Shield, Globe, Palette, QrCode, Users, Bell, CheckCircle } from 'lucide-react';
import { SocietyConfig } from '../../types';
import { DEFAULT_SOCIETY } from '../../utils/sampleData';
import { StepDomainHost } from './StepDomainHost';
import { StepBranding } from './StepBranding';
import { StepQRGeneration } from './StepQRGeneration';
import { StepCommitteeRoster } from './StepCommitteeRoster';
import { StepNotificationsRunner } from './StepNotificationsRunner';

interface ProvisioningModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialFlats?: number;
  initialIsWhiteLabel?: boolean;
}

export const ProvisioningModal: React.FC<ProvisioningModalProps> = ({
  isOpen,
  onClose,
  initialFlats,
  initialIsWhiteLabel,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [societyConfig, setSocietyConfig] = useState<SocietyConfig>({
    ...DEFAULT_SOCIETY,
    totalFlats: initialFlats || DEFAULT_SOCIETY.totalFlats,
    isCustomDomainActive: initialIsWhiteLabel !== undefined ? initialIsWhiteLabel : true,
  });

  const [launchedPortalView, setLaunchedPortalView] = useState<boolean>(false);

  if (!isOpen) return null;

  const updateConfig = (updated: Partial<SocietyConfig>) => {
    setSocietyConfig((prev) => ({ ...prev, ...updated }));
  };

  const steps = [
    { num: 1, label: 'Host & Edge DNS', icon: Globe },
    { num: 2, label: 'Branding & Legal', icon: Palette },
    { num: 3, label: 'QR & Badges', icon: QrCode },
    { num: 4, label: 'Committee Roster', icon: Users },
    { num: 5, label: 'Alerts & Deploy', icon: Bell },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden relative">
        {/* Top Header Bar with Enhanced Color Scheme */}
        <div className="px-6 py-4.5 border-b border-slate-200 bg-gradient-to-r from-blue-50/80 via-white to-indigo-50/80 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-600/30">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">Super-Admin Society Provisioning</h2>
                <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-0.5 rounded-full">
                  Automated Pipeline
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Multi-tenant setup engine for <span className="text-blue-700 font-bold">{societyConfig.name}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-900 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator Header in Enhanced Clean Style */}
        {!launchedPortalView && (
          <div className="px-6 py-3.5 border-b border-slate-200 bg-slate-50 overflow-x-auto">
            <div className="flex items-center justify-between min-w-[620px]">
              {steps.map((s, idx) => {
                const isCompleted = currentStep > s.num;
                const isCurrent = currentStep === s.num;

                return (
                  <React.Fragment key={s.num}>
                    <button
                      onClick={() => setCurrentStep(s.num)}
                      className={`flex items-center gap-2.5 text-xs font-bold transition-colors cursor-pointer py-1 ${
                        isCurrent
                          ? 'text-blue-700'
                          : isCompleted
                          ? 'text-emerald-700'
                          : 'text-slate-400 hover:text-slate-700'
                      }`}
                    >
                      <div
                        className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-mono font-bold transition-all ${
                          isCurrent
                            ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                            : isCompleted
                            ? 'bg-emerald-100 border border-emerald-300 text-emerald-800'
                            : 'bg-white border border-slate-300 text-slate-500'
                        }`}
                      >
                        {isCompleted ? <CheckCircle className="w-4 h-4 text-emerald-700" /> : s.num}
                      </div>
                      <span className="whitespace-nowrap">{s.label}</span>
                    </button>
                    {idx < steps.length - 1 && (
                      <div
                        className={`w-8 h-0.5 transition-colors ${
                          currentStep > s.num ? 'bg-emerald-400' : 'bg-slate-200'
                        }`}
                      />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        )}

        {/* Modal Scrollable Body */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 bg-white">
          {launchedPortalView ? (
            /* Live Simulated Portal View after successful provisioning */
            <div className="space-y-6">
              <div className="p-5 bg-emerald-50 border-2 border-emerald-300 rounded-3xl flex items-center justify-between shadow-xs">
                <div>
                  <span className="text-[10px] font-mono text-emerald-800 font-bold uppercase tracking-wider bg-emerald-100 px-2 py-0.5 rounded">
                    Isolated Tenant Instance Live
                  </span>
                  <h3 className="text-2xl font-bold text-slate-900 mt-1">{societyConfig.name}</h3>
                  <p className="text-xs text-slate-600 font-mono mt-1">
                    https://{societyConfig.subdomain}.smartaisociety.io
                    {societyConfig.isCustomDomainActive && ` (Custom: https://${societyConfig.customDomain})`}
                  </p>
                </div>
                <button
                  onClick={() => setLaunchedPortalView(false)}
                  className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-bold rounded-xl cursor-pointer shadow-xs"
                >
                  Return to Wizard
                </button>
              </div>

              {/* RWA President Cockpit Preview */}
              <div className="bg-slate-50 rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-4 gap-4">
                  <div className="flex items-center gap-3.5">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-white text-xl shadow-md"
                      style={{ backgroundColor: societyConfig.primaryColor }}
                    >
                      {societyConfig.logoEmblem}
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-slate-900">{societyConfig.name}</h4>
                      <p className="text-xs text-slate-500">
                        Admin: {societyConfig.adminName} ({societyConfig.adminRole}) · {societyConfig.adminEmail}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300 font-bold self-start sm:self-auto">
                    Active Tenant · SSL Verified
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                    <p className="text-xs text-slate-500 font-medium">Registered Roster Units</p>
                    <p className="text-2xl font-bold text-slate-900 font-mono tabular-nums mt-1">
                      {societyConfig.totalFlats} Units
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">Doorstep badges generated</p>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                    <p className="text-xs text-slate-500 font-medium">Night Patrol Coverage</p>
                    <p className="text-2xl font-bold text-emerald-700 font-mono tabular-nums mt-1">
                      5 Checkpoints
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">Geofence radius 20m - 35m</p>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                    <p className="text-xs text-slate-500 font-medium">Master Admin Credentials</p>
                    <p className="text-sm font-bold text-blue-700 font-mono mt-1">
                      {societyConfig.temporaryPassword || 'Dispatched'}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">Sent to {societyConfig.adminEmail}</p>
                  </div>
                </div>

                <div className="p-5 bg-blue-50/70 rounded-2xl border border-blue-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h5 className="text-xs font-bold text-blue-900">Printable QR Badge Assets Ready</h5>
                    <p className="text-[11px] text-blue-700 mt-0.5">
                      Download pre-rendered printable vector PDFs for flat doors and perimeter NFC checkpoints.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setCurrentStep(3);
                      setLaunchedPortalView(false);
                    }}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl cursor-pointer shadow-sm shadow-blue-600/20"
                  >
                    View QR Badge Sheets
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Multi-step wizard views */
            <>
              {currentStep === 1 && (
                <StepDomainHost
                  config={societyConfig}
                  onChange={updateConfig}
                  onNext={() => setCurrentStep(2)}
                />
              )}

              {currentStep === 2 && (
                <StepBranding
                  config={societyConfig}
                  onChange={updateConfig}
                  onNext={() => setCurrentStep(3)}
                  onPrev={() => setCurrentStep(1)}
                />
              )}

              {currentStep === 3 && (
                <StepQRGeneration
                  config={societyConfig}
                  onNext={() => setCurrentStep(4)}
                  onPrev={() => setCurrentStep(2)}
                />
              )}

              {currentStep === 4 && (
                <StepCommitteeRoster
                  config={societyConfig}
                  onChange={updateConfig}
                  onNext={() => setCurrentStep(5)}
                  onPrev={() => setCurrentStep(3)}
                />
              )}

              {currentStep === 5 && (
                <StepNotificationsRunner
                  config={societyConfig}
                  onPrev={() => setCurrentStep(4)}
                  onLaunchPortal={() => setLaunchedPortalView(true)}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
