import React from 'react';
import { 
  Lock, 
  ShieldAlert, 
  Zap, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Sparkles,
  Smartphone,
  Building2,
  Droplet,
  Radio
} from 'lucide-react';
import { useSmartAISociety } from '../context/SmartAISocietyContext';

interface SubscriptionRequiredGateProps {
  featureName?: string;
  onOpenSubscriptionModal?: () => void;
}

export const SubscriptionRequiredGate: React.FC<SubscriptionRequiredGateProps> = ({
  featureName = 'Township Operations Module',
  onOpenSubscriptionModal,
}) => {
  const { setActiveView, openSubscriptionModal, activatePrioritySubscription } = useSmartAISociety();

  const handleOpenSubscribe = () => {
    if (onOpenSubscriptionModal) {
      onOpenSubscriptionModal();
    } else {
      openSubscriptionModal(featureName);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white border-2 border-amber-300 rounded-3xl max-w-2xl w-full p-6 sm:p-10 shadow-2xl relative overflow-hidden text-center space-y-6">
        
        {/* Glow ambient circle */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Lock Icon */}
        <div className="relative z-10">
          <div className="w-16 h-16 rounded-3xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700 mx-auto shadow-md shadow-amber-400/20">
            <Lock className="w-8 h-8" />
          </div>
          
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-[11px] font-black uppercase tracking-wider mt-4">
            <Zap className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
            <span>Priority Subscription Required</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-3">
            {featureName} is Locked
          </h2>
          
          <p className="text-slate-600 text-sm max-w-md mx-auto mt-2 leading-relaxed">
            For using any smartaisociety feature (Society Panel, Drone Command, Resident Mobile App, Gate Security Terminal, and IoT Water Ops), your society must activate an active plan paid on priority.
          </p>
        </div>

        {/* Feature Highlights unlocked on subscription */}
        <div className="relative z-10 bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left space-y-2.5 max-w-lg mx-auto">
          <p className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Included Upon Priority Subscription:</span>
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Full Flats Directory in SQL</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Resident App on Android &amp; iOS</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Gate Terminal &amp; Visitor OTP</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>IoT Water Telemetry &amp; Cutoffs</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={handleOpenSubscribe}
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-black text-sm rounded-2xl shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
          >
            <span>Pay &amp; Subscribe on Priority</span>
            <ArrowRight className="w-4 h-4 text-slate-950" />
          </button>

          <button
            onClick={() => setActiveView('marketing')}
            className="w-full sm:w-auto px-6 py-4 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-bold text-sm rounded-2xl flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>
        </div>
      </div>
    </div>
  );
};
