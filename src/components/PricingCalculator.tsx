import React, { useState } from 'react';
import { CheckCircle, ArrowRight, Shield, Clock } from 'lucide-react';

interface PricingCalculatorProps {
  onStartProvisioningWithConfig: (flats: number, isWhiteLabel: boolean) => void;
  onOpenPriorityCheckout?: () => void;
}

export const PricingCalculator: React.FC<PricingCalculatorProps> = ({
  onStartProvisioningWithConfig,
  onOpenPriorityCheckout,
}) => {
  const [flatCount, setFlatCount] = useState<number>(250);
  const [isWhiteLabel, setIsWhiteLabel] = useState<boolean>(true);
  const [billingCycle, setBillingCycle] = useState<'annual' | 'monthly'>('annual');
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');
  const [includeBiometric, setIncludeBiometric] = useState<boolean>(false);
  const [includeWhatsAppPack, setIncludeWhatsAppPack] = useState<boolean>(true);

  // Pricing constants
  const baseRateINR = 25; // ₹25 per flat/month
  const baseRateUSD = 0.35; // $0.35 per flat/month
  const whiteLabelAddonINR = 2500;
  const whiteLabelAddonUSD = 35;
  const biometricAddonINR = 1500;
  const biometricAddonUSD = 20;
  const whatsAppAddonINR = 990;
  const whatsAppAddonUSD = 15;

  const isINR = currency === 'INR';
  const symbol = isINR ? '₹' : '$';

  const baseRate = isINR ? baseRateINR : baseRateUSD;
  const whiteLabelFee = isWhiteLabel ? (isINR ? whiteLabelAddonINR : whiteLabelAddonUSD) : 0;
  const biometricFee = includeBiometric ? (isINR ? biometricAddonINR : biometricAddonUSD) : 0;
  const whatsAppFee = includeWhatsAppPack ? (isINR ? whatsAppAddonINR : whatsAppAddonUSD) : 0;

  const rawMonthly = flatCount * baseRate + whiteLabelFee + biometricFee + whatsAppFee;
  const discountMultiplier = billingCycle === 'annual' ? 0.8 : 1.0; // 20% discount on annual
  const monthlyTotal = Math.round(rawMonthly * discountMultiplier);

  // Estimated ROI calculations based on flat count
  const estimatedHoursSavedMonthly = Math.round(flatCount * 0.45);
  const estimatedDefaulterReductionPct = 94;

  return (
    <section id="pricing" className="py-20 px-6 bg-slate-50 border-b border-slate-200 text-slate-900">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-black uppercase tracking-wider mb-3">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span>Priority Subscription Required for Mobile App &amp; Feature Access</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Society Subscription &amp;{' '}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 bg-clip-text text-transparent">
              Priority Plans
            </span>
          </h2>
          <p className="text-slate-600 mt-2 text-base">
            To install the smartaisociety mobile app or activate any township automation feature, subscribe on priority. Scale seamlessly as your gated township expands.
          </p>

          {/* Currency & Cadence Toggles */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            {/* Billing Cycle Switcher */}
            <div className="flex items-center p-1 bg-white rounded-2xl border border-slate-200 shadow-xs">
              <button
                onClick={() => setBillingCycle('annual')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                  billingCycle === 'annual'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Annual (20% Off)
              </button>
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                  billingCycle === 'monthly'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Monthly
              </button>
            </div>

            {/* Currency Switcher */}
            <div className="flex items-center p-1 bg-white rounded-2xl border border-slate-200 shadow-xs">
              <button
                onClick={() => setCurrency('INR')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                  currency === 'INR' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                INR (₹)
              </button>
              <button
                onClick={() => setCurrency('USD')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                  currency === 'USD' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                USD ($)
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-lg shadow-slate-200/50">
          {/* Flat Slider */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-semibold text-slate-800">
                Number of Flats / Units in Society:
              </span>
              <span className="text-2xl font-extrabold text-blue-600 font-mono tabular-nums">
                {flatCount.toLocaleString()} Flats
              </span>
            </div>
            <input
              type="range"
              min="50"
              max="2500"
              step="25"
              value={flatCount}
              onChange={(e) => setFlatCount(Number(e.target.value))}
              className="w-full h-2.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-2 font-mono tabular-nums">
              <span>50 Flats</span>
              <span>1,000 Flats</span>
              <span>2,500+ Flats</span>
            </div>
          </div>

          {/* Feature toggles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {/* White-Label Toggle */}
            <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-2xl">
              <div>
                <p className="text-sm font-semibold text-slate-900">White-Label Engine</p>
                <p className="text-xs text-slate-500">
                  Custom domain, emblem & branded invoices (+{symbol}
                  {isINR ? whiteLabelAddonINR : whiteLabelAddonUSD}/mo)
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsWhiteLabel(!isWhiteLabel)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer shrink-0 ${
                  isWhiteLabel ? 'bg-blue-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isWhiteLabel ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* WhatsApp Integration Toggle */}
            <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-2xl">
              <div>
                <p className="text-sm font-semibold text-slate-900">WhatsApp Priority Gateway</p>
                <p className="text-xs text-slate-500">
                  Visitor OTPs & fee reminders on WhatsApp (+{symbol}
                  {isINR ? whatsAppAddonINR : whatsAppAddonUSD}/mo)
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIncludeWhatsAppPack(!includeWhatsAppPack)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer shrink-0 ${
                  includeWhatsAppPack ? 'bg-blue-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    includeWhatsAppPack ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Quantitative ROI preview strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-950/80 border border-slate-800 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-950/80 border border-blue-700/60 flex items-center justify-center text-cyan-400 shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Estimated Committee Time Saved</p>
                <p className="text-sm font-bold text-white font-mono tabular-nums">
                  ~{estimatedHoursSavedMonthly} Staff & Bookkeeping Hours / month
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-700/60 flex items-center justify-center text-emerald-400 shrink-0">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Patrol & Waste Compliance</p>
                <p className="text-sm font-bold text-emerald-400 font-mono tabular-nums">
                  {estimatedDefaulterReductionPct}% Defaulter Reduction Target
                </p>
              </div>
            </div>
          </div>

          {/* Calculated Fee Breakdown & Launch Button */}
          <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <p className="text-xs text-slate-400 uppercase font-semibold">Total Estimated Investment</p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-4xl font-extrabold text-white font-mono tabular-nums">
                  {symbol}
                  {monthlyTotal.toLocaleString()}
                </span>
                <span className="text-slate-400 text-sm">
                  / month {billingCycle === 'annual' ? 'billed annually' : 'billed monthly'}
                </span>
              </div>
              <p className="text-xs text-emerald-400 font-medium mt-1 flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5" /> Includes unlimited guard logs, admin accounts, and resident apps
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              {onOpenPriorityCheckout && (
                <button
                  onClick={onOpenPriorityCheckout}
                  className="w-full sm:w-auto px-6 py-4 bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 font-black rounded-2xl text-slate-950 shadow-xl shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer text-sm active:scale-95"
                >
                  <span>Pay &amp; Subscribe on Priority</span>
                  <ArrowRight className="w-4 h-4 text-slate-950" />
                </button>
              )}

              <button
                onClick={() => onStartProvisioningWithConfig(flatCount, isWhiteLabel)}
                className="w-full sm:w-auto px-6 py-4 bg-white/10 hover:bg-white/20 border border-white/20 font-bold rounded-2xl text-white shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer text-sm active:scale-95"
              >
                Onboard Society Now <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
