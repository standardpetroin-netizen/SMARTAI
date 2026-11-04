import React, { useState } from 'react';
import { useSmartAISociety } from '../context/SmartAISocietyContext';
import { 
  Smartphone, 
  Download, 
  CheckCircle2, 
  QrCode, 
  ShieldCheck, 
  Zap, 
  ArrowRight, 
  Sparkles, 
  Star,
  Lock
} from 'lucide-react';
import { QrCodeSvg } from './QrCodeSvg';

interface MobileAppBannerSectionProps {
  onOpenPrioritySubscription?: () => void;
}

export const MobileAppBannerSection: React.FC<MobileAppBannerSectionProps> = ({
  onOpenPrioritySubscription,
}) => {
  const { setActiveView, showToast, isSubscribed, openSubscriptionModal } = useSmartAISociety();
  const [isRedirecting, setIsRedirecting] = useState<boolean>(false);

  const handleInstallAppClick = () => {
    setIsRedirecting(true);

    showToast(
      'Priority Subscription Required',
      'For using any feature or installing the app on phone, activate a priority subscription.',
      'info'
    );

    if (onOpenPrioritySubscription) {
      onOpenPrioritySubscription();
    } else {
      openSubscriptionModal('Resident App on Phone (iOS & Android)', 'resident');
    }

    const pricingElem = document.getElementById('pricing');
    if (pricingElem) {
      pricingElem.scrollIntoView({ behavior: 'smooth' });
    }

    setTimeout(() => {
      setIsRedirecting(false);
    }, 400);
  };

  return (
    <section className="py-20 px-6 bg-gradient-to-br from-blue-700 via-indigo-700 to-slate-900 text-white relative overflow-hidden">
      {/* Glow shapes */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        {/* Left Column: Copy & Badges (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-blue-300" />
            <span>Mobile App for Residents & Society Staff</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Carry Your Entire Society <br />
            <span className="bg-gradient-to-r from-blue-200 via-sky-200 to-emerald-200 bg-clip-text text-transparent">
              Right in Your Pocket.
            </span>
          </h2>

          <p className="text-blue-100 text-base sm:text-lg leading-relaxed max-w-xl">
            Whether approving an Amazon parcel, paying monthly society maintenance with instant UPI, or monitoring overhead water pump levels, the smartaisociety mobile app makes community living effortless.
          </p>

          {/* Key app features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="flex items-center gap-2.5 text-xs font-semibold text-blue-100">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Biometric FaceID / TouchID Quick Login</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs font-semibold text-blue-100">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Offline Cache for Basement B1 Parking</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs font-semibold text-blue-100">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Instant WhatsApp & Push Notifications</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs font-semibold text-blue-100">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Direct Intercom Escalation to Gatehouse</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-4 flex flex-wrap items-center gap-4">
            <button
              onClick={() => {
                if (!isSubscribed) {
                  openSubscriptionModal('Resident Mobile App', 'resident');
                } else {
                  setActiveView('resident');
                }
              }}
              className="px-6 py-3.5 bg-white text-blue-900 hover:bg-blue-50 font-extrabold text-sm rounded-2xl shadow-xl transition-all flex items-center gap-2 cursor-pointer"
            >
              {!isSubscribed ? <Lock className="w-4 h-4 text-amber-600" /> : <Smartphone className="w-4 h-4 text-blue-600" />}
              <span>Launch Live Resident App View</span>
              {!isSubscribed ? (
                <span className="text-[10px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full font-mono uppercase font-bold">
                  Priority
                </span>
              ) : (
                <ArrowRight className="w-4 h-4" />
              )}
            </button>

            {/* Install App on Phone - Requires Priority Subscription */}
            <button
              onClick={handleInstallAppClick}
              className="px-5 py-3.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-sm rounded-2xl shadow-xl shadow-amber-500/20 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <Download className="w-4 h-4 text-slate-950" />
              <span>{isRedirecting ? 'Opening Subscription...' : 'Install App on Phone'}</span>
              <span className="text-[10px] bg-slate-950/20 px-2 py-0.5 rounded-full font-mono uppercase tracking-wider">
                Priority
              </span>
            </button>
          </div>

          {/* App Store Ratings */}
          <div className="pt-2 flex items-center gap-4 text-xs text-blue-200">
            <div className="flex items-center gap-1 text-amber-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
              ))}
            </div>
            <span className="font-bold text-white">4.8 / 5.0</span>
            <span className="text-blue-300">from 500,000+ happy gated society residents</span>
          </div>
        </div>

        {/* Right Column: Scan QR to Open Mobile App (5 cols) */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 sm:p-8 rounded-3xl shadow-2xl max-w-sm w-full text-center space-y-5">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-white mx-auto shadow-md">
              <QrCode className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-white">Scan to Test on Phone</h3>
              <p className="text-xs text-blue-200 mt-1">
                Point your phone camera to experience smartaisociety directly on your smartphone browser.
              </p>
            </div>

            <div 
              onClick={handleInstallAppClick}
              className="p-4 bg-white rounded-2xl shadow-inner inline-block cursor-pointer hover:ring-4 hover:ring-amber-400/50 transition-all group"
              title="Click to Subscribe on Priority & Install App"
            >
              <QrCodeSvg value="https://demo.smartaisociety.io/app" size={160} fgColor="#0f172a" centerBadgeText="APP" />
              <p className="text-[10px] font-bold text-slate-700 mt-2 flex items-center justify-center gap-1">
                <Lock className="w-3 h-3 text-amber-600" />
                <span>Subscribe on Priority to Deploy</span>
              </p>
            </div>

            <div className="pt-2 border-t border-white/10 flex items-center justify-center gap-3 text-[11px] text-blue-200 font-mono">
              <span>● iOS Safari App</span>
              <span>● Android Chrome</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
