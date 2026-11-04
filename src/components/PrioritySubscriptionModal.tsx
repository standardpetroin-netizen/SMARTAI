import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  CreditCard, 
  Smartphone, 
  ArrowRight, 
  Zap, 
  Building2, 
  QrCode, 
  Download,
  Lock,
  Star,
  Receipt,
  FileCheck
} from 'lucide-react';
import { QrCodeSvg } from './QrCodeSvg';
import { useSmartAISociety } from '../context/SmartAISocietyContext';

interface PrioritySubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialFlats?: number;
}

type PlanType = 'starter' | 'pro' | 'enterprise';
type PaymentMethod = 'upi' | 'card' | 'netbanking';

export const PrioritySubscriptionModal: React.FC<PrioritySubscriptionModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialFlats = 250,
}) => {
  const { societyConfig, showToast, subscriptionTargetFeature, activatePrioritySubscription } = useSmartAISociety();

  const [selectedPlan, setSelectedPlan] = useState<PlanType>('pro');
  const [flatCount, setFlatCount] = useState<number>(initialFlats);
  const [billingCycle, setBillingCycle] = useState<'annual' | 'monthly'>('annual');
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');

  // Society contact details
  const [societyName, setSocietyName] = useState<string>(societyConfig.name || 'Grand Heights Luxury Residences');
  const [adminName, setAdminName] = useState<string>('Mr. Anand Verma (President)');
  const [adminEmail, setAdminEmail] = useState<string>('president@smartaisociety.com');
  const [adminPhone, setAdminPhone] = useState<string>('+91 98220 11223');
  const [upiId, setUpiId] = useState<string>('society.rwa@okhdfcbank');

  // Checkout states
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isPaid, setIsPaid] = useState<boolean>(false);
  const [orderReceiptId, setOrderReceiptId] = useState<string>('');

  if (!isOpen) return null;

  // Rate calculations
  const rates: Record<PlanType, { inr: number; usd: number; name: string; tag: string }> = {
    starter: { inr: 25, usd: 0.35, name: 'Standard Gated Society', tag: 'Essential' },
    pro: { inr: 35, usd: 0.50, name: 'Smart AI Pro Township', tag: 'Most Popular' },
    enterprise: { inr: 45, usd: 0.65, name: 'Township Enterprise & High-Rise', tag: 'Full Suite' },
  };

  const isINR = currency === 'INR';
  const symbol = isINR ? '₹' : '$';
  const currentRate = isINR ? rates[selectedPlan].inr : rates[selectedPlan].usd;
  const rawTotal = flatCount * currentRate;
  const discountMultiplier = billingCycle === 'annual' ? 0.8 : 1.0;
  const totalAmount = Math.round(rawTotal * discountMultiplier);

  const handlePayOnPriority = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      const generatedId = `PRIORITY-SUB-${Math.floor(100000 + Math.random() * 900000)}`;
      setOrderReceiptId(generatedId);
      setIsProcessing(false);
      setIsPaid(true);

      activatePrioritySubscription(selectedPlan, flatCount, totalAmount);

      if (onSuccess) {
        onSuccess();
      }
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-3xl w-full max-h-[94vh] flex flex-col shadow-2xl overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-300 flex items-center justify-center text-slate-950 shadow-md shadow-amber-400/30 font-black">
              <Zap className="w-5 h-5 fill-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black tracking-tight">smartaisociety Priority Subscription</h2>
                <span className="text-[10px] font-mono font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded-full uppercase">
                  Mandatory For App Access
                </span>
              </div>
              <p className="text-xs text-blue-200">
                {subscriptionTargetFeature
                  ? `Priority subscription required to access ${subscriptionTargetFeature}.`
                  : 'To install the mobile app and unlock township features, subscribe on priority.'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {!isPaid ? (
            <form onSubmit={handlePayOnPriority} className="space-y-6">
              {/* Priority Notice Banner */}
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-900 leading-relaxed">
                  <p className="font-bold text-amber-950">Why Priority Subscription is Required:</p>
                  <p className="mt-0.5">
                    For using any feature of <strong>smartaisociety</strong> (Resident Mobile App on Android & iOS, Guard Patrol NFC Terminal, IoT Water Telemetry, and RWA Society ERP), your township must maintain an active subscription paid on priority. This allocates dedicated high-availability cloud capacity and instant deployment.
                  </p>
                </div>
              </div>

              {/* 1. Plan Selection */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                    <span>Select Priority Plan Tier</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setBillingCycle(billingCycle === 'annual' ? 'monthly' : 'annual')}
                      className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors cursor-pointer"
                    >
                      {billingCycle === 'annual' ? 'Annual (20% Off Active)' : 'Switch to Annual'}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {(['starter', 'pro', 'enterprise'] as PlanType[]).map((planKey) => {
                    const plan = rates[planKey];
                    const isSelected = selectedPlan === planKey;
                    return (
                      <div
                        key={planKey}
                        onClick={() => setSelectedPlan(planKey)}
                        className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50/60 shadow-md shadow-blue-600/10'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        {planKey === 'pro' && (
                          <span className="absolute -top-2.5 right-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-full shadow-xs">
                            ★ Recommended
                          </span>
                        )}
                        <div>
                          <p className="text-xs font-bold text-slate-800">{plan.name}</p>
                          <div className="flex items-baseline gap-1 mt-2">
                            <span className="text-2xl font-black text-slate-900 font-mono">
                              {symbol}
                              {isINR ? plan.inr : plan.usd}
                            </span>
                            <span className="text-[11px] text-slate-500">/ flat / mo</span>
                          </div>
                        </div>

                        <div className="mt-3 pt-3 border-t border-slate-200/80 text-[11px] text-slate-600 space-y-1">
                          <p>✓ All Resident App Accounts</p>
                          <p>✓ {planKey === 'starter' ? 'Basic Gate QR Scan' : 'AI FaceID & Drone Link'}</p>
                          <p>✓ {planKey === 'enterprise' ? 'Custom Domain & SLA' : 'Instant UPI Billing'}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 2. Flat Count Slider */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-xs font-bold text-slate-800">Total Society Flats / Units</label>
                    <p className="text-[11px] text-slate-500">Scale the subscription for your registered flats</p>
                  </div>
                  <div className="px-3 py-1 bg-white border border-slate-300 rounded-xl font-mono font-black text-base text-blue-600">
                    {flatCount} Flats
                  </div>
                </div>

                <input
                  type="range"
                  min={50}
                  max={1500}
                  step={25}
                  value={flatCount}
                  onChange={(e) => setFlatCount(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />

                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>50 Flats (Boutique)</span>
                  <span>500 Flats (Mid-Township)</span>
                  <span>1,500+ Flats (Mega-Township)</span>
                </div>
              </div>

              {/* 3. Society & Committee Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Society Name</label>
                  <input
                    type="text"
                    required
                    value={societyName}
                    onChange={(e) => setSocietyName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="e.g. Any Housing Society / Grand Heights"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Authorised Signatory</label>
                  <input
                    type="text"
                    required
                    value={adminName}
                    onChange={(e) => setAdminName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="e.g. Mr. Anand Verma (President)"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">RWA Billing Email</label>
                  <input
                    type="email"
                    required
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="president@smartaisociety.com"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">WhatsApp Phone (For Instant Alerts)</label>
                  <input
                    type="tel"
                    required
                    value={adminPhone}
                    onChange={(e) => setAdminPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="+91 98220 11223"
                  />
                </div>
              </div>

              {/* 4. Payment Method Selection */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-2">
                  Select Priority Payment Method
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('upi')}
                    className={`p-3 rounded-xl border text-xs font-bold transition-all flex flex-col items-center gap-1.5 cursor-pointer ${
                      paymentMethod === 'upi'
                        ? 'border-blue-600 bg-blue-50 text-blue-900 shadow-xs'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Smartphone className="w-4 h-4 text-blue-600" />
                    <span>Instant UPI</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 rounded-xl border text-xs font-bold transition-all flex flex-col items-center gap-1.5 cursor-pointer ${
                      paymentMethod === 'card'
                        ? 'border-blue-600 bg-blue-50 text-blue-900 shadow-xs'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-blue-600" />
                    <span>Corporate Card</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('netbanking')}
                    className={`p-3 rounded-xl border text-xs font-bold transition-all flex flex-col items-center gap-1.5 cursor-pointer ${
                      paymentMethod === 'netbanking'
                        ? 'border-blue-600 bg-blue-50 text-blue-900 shadow-xs'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Building2 className="w-4 h-4 text-blue-600" />
                    <span>Net Banking / RTGS</span>
                  </button>
                </div>

                {paymentMethod === 'upi' && (
                  <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-3">
                    <QrCode className="w-5 h-5 text-indigo-600 shrink-0" />
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="Enter Society UPI VPA (e.g. society@okhdfcbank)"
                      className="w-full bg-white px-3 py-1.5 text-xs font-mono rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-600"
                    />
                  </div>
                )}
              </div>

              {/* Total Summary & Priority Action Button */}
              <div className="p-4 bg-slate-900 rounded-2xl text-white flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Priority Investment Amount</p>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-3xl font-black font-mono text-emerald-400">
                      {symbol}{totalAmount.toLocaleString()}
                    </span>
                    <span className="text-xs text-slate-300">
                      / month ({billingCycle === 'annual' ? 'billed annually with 20% savings' : 'monthly cycle'})
                    </span>
                  </div>
                  <p className="text-[10px] text-amber-300 mt-1 flex items-center gap-1 font-mono">
                    <Zap className="w-3 h-3" /> Priority SLA: Direct mobile app links unlocked immediately on payment
                  </p>
                </div>

                <div className="flex flex-col gap-2 w-full sm:w-auto">
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-black text-sm rounded-xl shadow-lg shadow-amber-400/20 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                        <span>Verifying Priority Payment...</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        <span>Pay &amp; Subscribe on Priority</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          ) : (
            /* Payment Success Screen */
            <div className="py-8 px-4 text-center space-y-6">
              <div className="w-16 h-16 bg-emerald-100 border border-emerald-300 rounded-3xl flex items-center justify-center text-emerald-600 mx-auto shadow-lg shadow-emerald-500/10">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="text-xs font-black uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  Priority Payment Confirmed
                </span>
                <h3 className="text-2xl font-black text-slate-900 mt-2">
                  Your Society Subscription is Active!
                </h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto mt-1">
                  Thank you for paying on priority. Your dedicated smartaisociety instance and mobile app deployment packages are now fully provisioned and unlocked.
                </p>
              </div>

              {/* Order Receipt Box */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 max-w-md mx-auto text-left font-mono text-xs space-y-1.5 text-slate-700">
                <div className="flex justify-between border-b border-slate-200 pb-1.5 font-bold text-slate-900">
                  <span>Order Receipt ID:</span>
                  <span className="text-blue-600">{orderReceiptId}</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span>Society:</span>
                  <span>{societyName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Registered Flats:</span>
                  <span>{flatCount} Units</span>
                </div>
                <div className="flex justify-between">
                  <span>Plan Activated:</span>
                  <span className="uppercase font-bold text-emerald-700">{selectedPlan} Tier</span>
                </div>
                <div className="flex justify-between font-bold text-slate-900 border-t border-slate-200 pt-1.5">
                  <span>Total Paid (Priority):</span>
                  <span>{symbol}{totalAmount.toLocaleString()}</span>
                </div>
              </div>

              {/* Install App QR Code Unlocked */}
              <div className="p-5 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-3xl max-w-md mx-auto space-y-3">
                <div className="flex items-center justify-center gap-2 text-blue-900 font-bold text-sm">
                  <Smartphone className="w-4 h-4 text-blue-600" />
                  <span>Resident Mobile App Unlocked for Installation</span>
                </div>

                <div className="p-3 bg-white rounded-2xl shadow-xs inline-block">
                  <QrCodeSvg value={`https://${societyConfig.subdomain || 'grandheights'}.smartaisociety.io/app`} size={140} fgColor="#0f172a" centerBadgeText="APP" />
                </div>

                <div className="flex flex-col sm:flex-row gap-2 justify-center pt-1">
                  <a
                    href={`/api/export-sql`}
                    download="smartaisociety_subscription_receipt.pdf"
                    onClick={() => showToast('Receipt Downloaded', `Tax invoice saved for ${orderReceiptId}.`, 'success')}
                    className="px-4 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-700 flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Receipt className="w-3.5 h-3.5 text-slate-500" />
                    <span>Download Tax Invoice</span>
                  </a>

                  <button
                    onClick={() => {
                      onClose();
                      showToast('Resident App Opened', 'Redirecting to your resident dashboard...', 'info');
                    }}
                    className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-blue-600/20"
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>Open Resident App Now</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500 shrink-0">
          <div className="flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span>256-bit Encrypted Priority Processing</span>
          </div>
          <span>smartaisociety Enterprise Billing</span>
        </div>
      </div>
    </div>
  );
};
