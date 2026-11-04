import React from 'react';
import { Bell, CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';
import { useCivicOps } from '../context/CivicOpsContext';

export const GlobalToast: React.FC = () => {
  const { toast } = useCivicOps();

  if (!toast) return null;

  const isAlert = toast.type === 'alert';
  const isWarning = toast.type === 'warning';
  const isSuccess = toast.type === 'success';

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full p-4 rounded-2xl border shadow-2xl backdrop-blur-md transition-all animate-bounce bg-slate-950/95 border-slate-700">
      <div className="flex items-start gap-3">
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
            isAlert
              ? 'bg-rose-950 text-rose-400 border border-rose-800'
              : isWarning
              ? 'bg-amber-950 text-amber-400 border border-amber-800'
              : isSuccess
              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
              : 'bg-blue-950 text-blue-400 border border-blue-800'
          }`}
        >
          {isAlert || isWarning ? (
            <AlertTriangle className="w-5 h-5" />
          ) : isSuccess ? (
            <CheckCircle2 className="w-5 h-5" />
          ) : (
            <Bell className="w-5 h-5" />
          )}
        </div>

        <div className="flex-1 pr-2">
          <h4 className="text-xs font-bold text-white tracking-tight">{toast.title}</h4>
          <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">{toast.body}</p>
          <span className="text-[10px] text-blue-400 font-mono mt-1 block">Live Cross-Tenant Bus</span>
        </div>
      </div>
    </div>
  );
};
