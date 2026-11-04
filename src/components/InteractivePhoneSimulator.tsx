import React, { useState } from 'react';
import { 
  Bell, 
  CreditCard, 
  Package, 
  ShieldCheck, 
  Droplet, 
  Users, 
  CheckCircle2, 
  ArrowRight, 
  QrCode, 
  PhoneCall, 
  Sparkles,
  Flame,
  Home,
  FileText,
  Key,
  MessageSquare
} from 'lucide-react';
import { useCivicOps } from '../context/CivicOpsContext';

export const InteractivePhoneSimulator: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { societyConfig, invoices, payInvoice, deliveries, addPreApprovedDelivery, setActiveView } = useCivicOps();

  const [activeTab, setActiveTab] = useState<'home' | 'visitors' | 'pay' | 'water'>('home');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [simulatedDeliveryApproved, setSimulatedDeliveryApproved] = useState<boolean>(false);

  const activeInvoice = invoices.find((i) => i.unit === 'B-402' && i.status === 'Pending') || invoices[0];

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleQuickPay = () => {
    if (activeInvoice) {
      payInvoice(activeInvoice.id, 'UPI');
      triggerToast('✓ ₹4,250 Maintenance Paid via UPI! Digital receipt generated.');
    }
  };

  const handleQuickApproveCourier = () => {
    setSimulatedDeliveryApproved(true);
    addPreApprovedDelivery({
      unit: 'B-402',
      carrier: 'Zomato',
      passcode: '4821',
      permission: 'Allow to Doorstep',
      notes: 'Food parcel. Ring bell once.',
      expectedWindow: 'Expected in 15 mins',
    });
    triggerToast('✓ Zomato Delivery Pass #4821 synced to Gate 01 Terminal!');
  };

  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      {/* Decorative ambient background glows */}
      <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-emerald-500/20 rounded-[48px] blur-2xl -z-10" />

      {/* Floating live notification badge 1 (Top Left) */}
      <div className="hidden sm:flex absolute -left-12 top-14 bg-white/95 backdrop-blur-md p-3 rounded-2xl border border-slate-200 shadow-xl items-center gap-3 z-20 animate-pulse">
        <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
          <Package className="w-5 h-5" />
        </div>
        <div className="text-left">
          <p className="text-[11px] font-bold text-slate-900">Zomato Courier Verified</p>
          <p className="text-[10px] text-slate-500 font-medium">Gate 01 · Auto-admitted to Doorstep</p>
        </div>
      </div>

      {/* Floating live notification badge 2 (Bottom Right) */}
      <div className="hidden sm:flex absolute -right-12 bottom-20 bg-white/95 backdrop-blur-md p-3 rounded-2xl border border-slate-200 shadow-xl items-center gap-3 z-20">
        <div className="w-9 h-9 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center border border-cyan-200">
          <Droplet className="w-5 h-5" />
        </div>
        <div className="text-left">
          <p className="text-[11px] font-bold text-slate-900">OHT Tank Full (96%)</p>
          <p className="text-[10px] text-emerald-600 font-bold">IoT Failsafe Auto-Trip: Motor OFF</p>
        </div>
      </div>

      {/* Modern iPhone 16 Pro Style Smartphone Frame */}
      <div className="w-[310px] sm:w-[330px] h-[640px] bg-slate-900 rounded-[50px] p-3 shadow-2xl border-[5px] border-slate-700/80 relative flex flex-col overflow-hidden ring-1 ring-white/20">
        {/* Dynamic Island / Speaker Pill */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-5 bg-black rounded-full z-30 flex items-center justify-end px-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
        </div>

        {/* Screen Display Container */}
        <div className="w-full h-full bg-slate-50 rounded-[40px] overflow-hidden flex flex-col relative text-slate-800">
          {/* Status Bar */}
          <div className="pt-2 px-5 pb-1 flex justify-between items-center text-[10px] font-bold text-slate-700">
            <span>09:41</span>
            <div className="flex items-center gap-1.5 text-[9px]">
              <span>5G</span>
              <div className="w-4 h-2 rounded-xs border border-slate-700 p-0.5 flex items-center">
                <div className="w-full h-full bg-slate-800 rounded-2xs" />
              </div>
            </div>
          </div>

          {/* App Header */}
          <div className="px-4 py-2.5 bg-white border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-xl text-white font-black text-xs flex items-center justify-center shadow-xs"
                style={{ backgroundColor: societyConfig.primaryColor }}
              >
                {societyConfig.logoEmblem}
              </div>
              <div className="text-left leading-tight">
                <p className="text-xs font-extrabold text-slate-900 truncate max-w-[140px]">
                  {societyConfig.name}
                </p>
                <p className="text-[9px] font-bold text-slate-400">Unit B-402 · Tower B</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => triggerToast('No unread society emergency alerts.')}
                className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer relative"
              >
                <Bell className="w-3.5 h-3.5" />
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 absolute top-1 right-1" />
              </button>
            </div>
          </div>

          {/* In-Phone Live Toast */}
          {toastMessage && (
            <div className="absolute top-14 left-2 right-2 bg-slate-900 text-white p-2.5 rounded-2xl text-[10px] shadow-lg z-40 animate-in fade-in slide-in-from-top-2 font-medium flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span>{toastMessage}</span>
            </div>
          )}

          {/* Phone Scrollable Body */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-3 text-left">
            {/* 1. Maintenance Dues Card */}
            <div
              className="p-3.5 rounded-2xl text-white shadow-md transition-all relative overflow-hidden"
              style={{ backgroundColor: societyConfig.primaryColor }}
            >
              <div className="flex items-center justify-between text-[10px] opacity-90">
                <span>March 2026 Maintenance</span>
                <span className="bg-white/20 px-2 py-0.5 rounded-full font-mono">
                  {activeInvoice.status === 'Paid' ? 'PAID ✓' : 'DUE IN 3 DAYS'}
                </span>
              </div>
              <div className="mt-2 flex items-baseline justify-between">
                <div>
                  <p className="text-[10px] opacity-80">Payable Amount</p>
                  <p className="text-xl font-black font-mono">
                    {activeInvoice.status === 'Paid' ? '₹0' : '₹4,250'}
                  </p>
                </div>
                {activeInvoice.status !== 'Paid' ? (
                  <button
                    onClick={handleQuickPay}
                    className="px-3 py-1.5 bg-white text-slate-900 hover:bg-slate-100 font-extrabold text-[10px] rounded-xl shadow-xs cursor-pointer flex items-center gap-1 transition-transform active:scale-95"
                  >
                    <span>UPI Pay</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                ) : (
                  <span className="text-[10px] font-bold text-emerald-100 bg-white/20 px-2 py-1 rounded-lg">
                    Receipt #REC-8842
                  </span>
                )}
              </div>
            </div>

            {/* 2. Quick Action Icons Grid */}
            <div className="grid grid-cols-4 gap-2 text-center text-[9px] font-bold text-slate-700">
              <button
                onClick={handleQuickApproveCourier}
                className="p-2 bg-white rounded-xl border border-slate-200 shadow-2xs hover:border-blue-400 transition-colors cursor-pointer flex flex-col items-center gap-1"
              >
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Package className="w-3.5 h-3.5" />
                </div>
                <span className="truncate">Pre-Approve</span>
              </button>

              <button
                onClick={() => triggerToast('Guest QR Pass #9921 generated. Sent to your WhatsApp.')}
                className="p-2 bg-white rounded-xl border border-slate-200 shadow-2xs hover:border-purple-400 transition-colors cursor-pointer flex flex-col items-center gap-1"
              >
                <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                  <Key className="w-3.5 h-3.5" />
                </div>
                <span className="truncate">Guest Pass</span>
              </button>

              <button
                onClick={() => triggerToast('Main Borewell Pump is running. Overhead tank is 86% full.')}
                className="p-2 bg-white rounded-xl border border-slate-200 shadow-2xs hover:border-cyan-400 transition-colors cursor-pointer flex flex-col items-center gap-1"
              >
                <div className="w-7 h-7 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center">
                  <Droplet className="w-3.5 h-3.5" />
                </div>
                <span className="truncate">Water IoT</span>
              </button>

              <button
                onClick={() => triggerToast('Emergency Panic SOS Broadcasted to Gate 01 Security Guard!')}
                className="p-2 bg-white rounded-xl border border-slate-200 shadow-2xs hover:border-rose-400 transition-colors cursor-pointer flex flex-col items-center gap-1"
              >
                <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                  <Flame className="w-3.5 h-3.5" />
                </div>
                <span className="truncate">SOS Panic</span>
              </button>
            </div>

            {/* 3. Expected Deliveries & Visitors Today */}
            <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-[10px]">
                <span className="font-bold text-slate-900">Today&apos;s Gate Logs</span>
                <span className="text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.2 rounded font-mono">
                  Active Sync
                </span>
              </div>

              <div className="space-y-1.5">
                <div className="p-2 bg-slate-50 rounded-xl flex items-center justify-between text-[10px]">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <div>
                      <p className="font-bold text-slate-800">Zomato Food Delivery</p>
                      <p className="text-[9px] text-slate-500">Passcode: 4821 · Allow to Doorstep</p>
                    </div>
                  </div>
                  <span className="font-bold text-emerald-700">Pre-Approved</span>
                </div>

                <div className="p-2 bg-slate-50 rounded-xl flex items-center justify-between text-[10px]">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    <div>
                      <p className="font-bold text-slate-800">Guest: Dr. Arvind Patel</p>
                      <p className="text-[9px] text-slate-500">Car KA-03-MR-9104 · Gate 1</p>
                    </div>
                  </div>
                  <span className="text-[9px] text-slate-500 font-mono">08:30 AM</span>
                </div>
              </div>
            </div>

            {/* 4. Society Notice Board */}
            <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
              <p className="text-[10px] font-bold text-slate-900">RWA Community Notice</p>
              <p className="text-[9px] text-slate-600 line-clamp-2">
                Annual General Body Meeting (AGM) scheduled for Sunday 10:00 AM at the Clubhouse Amphitheatre.
              </p>
            </div>
          </div>

          {/* Phone Bottom Navigation Bar */}
          <div className="px-4 py-2.5 bg-white border-t border-slate-200 flex justify-between items-center text-[9px] font-bold text-slate-400">
            <button
              onClick={() => setActiveTab('home')}
              className={`flex flex-col items-center gap-0.5 cursor-pointer ${activeTab === 'home' ? 'text-blue-600' : 'hover:text-slate-700'}`}
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('visitors');
                triggerToast('Opening Pre-Approved Delivery Pass creator...');
              }}
              className={`flex flex-col items-center gap-0.5 cursor-pointer ${activeTab === 'visitors' ? 'text-blue-600' : 'hover:text-slate-700'}`}
            >
              <Package className="w-4 h-4" />
              <span>Passes</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('pay');
                handleQuickPay();
              }}
              className={`flex flex-col items-center gap-0.5 cursor-pointer ${activeTab === 'pay' ? 'text-blue-600' : 'hover:text-slate-700'}`}
            >
              <CreditCard className="w-4 h-4" />
              <span>Bills</span>
            </button>
            <button
              onClick={() => setActiveView('resident')}
              className="flex flex-col items-center gap-0.5 text-blue-600 font-extrabold cursor-pointer hover:underline"
            >
              <ArrowRight className="w-4 h-4" />
              <span>Full App</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
