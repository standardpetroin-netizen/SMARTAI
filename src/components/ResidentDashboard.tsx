import React, { useState } from 'react';
import { 
  Building2, 
  Receipt, 
  CreditCard, 
  Package, 
  Plus, 
  CheckCircle2, 
  Zap, 
  Droplet, 
  FileText, 
  Printer, 
  X,
  Bell,
  AlertCircle,
  Calendar,
  Sparkles,
  QrCode,
  Clock,
  ShieldCheck,
  Send,
  Wrench,
  Check,
  LogOut
} from 'lucide-react';
import { useCivicOps } from '../context/CivicOpsContext';
import { CarrierType } from '../types';
import { SectionAuthScreen } from './SectionAuthScreen';

export const ResidentDashboard: React.FC = () => {
  const {
    societyConfig,
    currentUnit,
    setCurrentUnit,
    invoices,
    payInvoice,
    deliveries,
    addPreApprovedDelivery,
    selectedInvoiceForReceipt,
    setSelectedInvoiceForReceipt,
    complaints,
    addComplaint,
    notices,
    facilityBookings,
    addFacilityBooking,
    visitorInvites,
    createVisitorInvite,
    securityAlerts,
    guardProfile,
    guardGeofence,
    authUsers,
    logoutPortal
  } = useCivicOps();

  const residentUser = authUsers['resident'];
  if (!residentUser) {
    return <SectionAuthScreen role="resident" />;
  }

  // Active sub-tab in Resident App
  const [activeTab, setActiveTab] = useState<'billing' | 'deliveries' | 'notices' | 'complaints' | 'facilities'>('billing');

  // Modals state
  const [isPreApproveModalOpen, setIsPreApproveModalOpen] = useState<boolean>(false);
  const [isVisitorPassModalOpen, setIsVisitorPassModalOpen] = useState<boolean>(false);
  const [isPayModalOpen, setIsPayModalOpen] = useState<boolean>(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'UPI' | 'Credit Card' | 'Net Banking'>('UPI');
  const [isComplaintModalOpen, setIsComplaintModalOpen] = useState<boolean>(false);
  const [isFacilityModalOpen, setIsFacilityModalOpen] = useState<boolean>(false);

  // Visitor Pass form state
  const [guestName, setGuestName] = useState<string>('');
  const [guestPhone, setGuestPhone] = useState<string>('');
  const [guestType, setGuestType] = useState<'Guest' | 'Delivery' | 'Cab' | 'Service Staff'>('Guest');
  const [guestVehicle, setGuestVehicle] = useState<string>('');
  const [guestOtp, setGuestOtp] = useState<string>('7842');

  // Pre-approve delivery form state
  const [carrier, setCarrier] = useState<CarrierType>('Zomato');
  const [permission, setPermission] = useState<'Leave at Gate' | 'Allow to Doorstep'>('Allow to Doorstep');
  const [passcode, setPasscode] = useState<string>('5821');
  const [notes, setNotes] = useState<string>('Food delivery parcel. Ring bell once.');

  // Complaint Form state
  const [complaintCategory, setComplaintCategory] = useState<'Plumbing' | 'Electrical' | 'Elevator' | 'Security' | 'Gardening' | 'Civil' | 'Other'>('Plumbing');
  const [complaintTitle, setComplaintTitle] = useState('');
  const [complaintDesc, setComplaintDesc] = useState('');
  const [complaintPriority, setComplaintPriority] = useState<'Low' | 'Medium' | 'High' | 'Urgent'>('Medium');

  // Facility Form state
  const [facilityName, setFacilityName] = useState<'Clubhouse Party Hall' | 'Tennis Court' | 'Swimming Pool Slot' | 'Badminton Court' | 'Community Garden'>('Clubhouse Party Hall');
  const [facilityDate, setFacilityDate] = useState('2026-04-20');
  const [facilityTimeSlot, setFacilityTimeSlot] = useState('06:00 PM - 09:00 PM');

  // Find active pending invoice for current unit
  const activeInvoice = invoices.find((inv) => inv.unit === currentUnit && inv.status === 'Pending') || invoices[0];
  const unitComplaints = complaints.filter(c => c.unit === currentUnit);
  const unitBookings = facilityBookings.filter(b => b.unit === currentUnit);

  const handleGenerateNewPasscode = () => {
    setPasscode(Math.floor(1000 + Math.random() * 9000).toString());
  };

  const handleCreatePreApproval = (e: React.FormEvent) => {
    e.preventDefault();
    addPreApprovedDelivery({
      unit: currentUnit,
      carrier,
      passcode,
      permission,
      notes,
      expectedWindow: 'Expected within 45 mins',
    });
    setIsPreApproveModalOpen(false);
  };

  const handleExecutePayment = () => {
    if (activeInvoice) {
      payInvoice(activeInvoice.id, selectedPaymentMethod);
      setIsPayModalOpen(false);
    }
  };

  const handleCreateComplaint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaintTitle || !complaintDesc) return;
    await addComplaint({
      societyId: societyConfig.id,
      unit: currentUnit,
      residentName: activeInvoice?.residentName || 'Resident',
      category: complaintCategory,
      title: complaintTitle,
      description: complaintDesc,
      priority: complaintPriority
    });
    setComplaintTitle('');
    setComplaintDesc('');
    setIsComplaintModalOpen(false);
  };

  const handleCreateBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    await addFacilityBooking({
      societyId: societyConfig.id,
      unit: currentUnit,
      residentName: activeInvoice?.residentName || 'Resident',
      facilityName,
      bookingDate: facilityDate,
      timeSlot: facilityTimeSlot,
      feeAmount: facilityName === 'Clubhouse Party Hall' ? 3500 : 0
    });
    setIsFacilityModalOpen(false);
  };

  const handleCreateVisitorPass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) return;

    await createVisitorInvite({
      societyId: societyConfig.id,
      unit: currentUnit,
      residentName: activeInvoice?.residentName || 'Sameer Verma',
      residentPhone: '+91 98401 23456',
      visitorName: guestName,
      visitorPhone: guestPhone || '+91 98000 00000',
      visitorType: guestType,
      company: guestType === 'Delivery' ? 'Delivery Agent' : guestType === 'Cab' ? 'Uber/Ola Driver' : 'Personal Guest',
      otpCode: guestOtp || Math.floor(1000 + Math.random() * 9000).toString(),
      vehicleNumber: guestVehicle || undefined,
      validFrom: 'Now',
      validUntil: 'Today 11:59 PM',
    });

    setIsVisitorPassModalOpen(false);
    setGuestName('');
    setGuestPhone('');
    setGuestVehicle('');
    setGuestOtp(Math.floor(1000 + Math.random() * 9000).toString());
  };

  const activeSecurityAlert = securityAlerts.find(a => a.status === 'ACTIVE' && (a.alertType === 'FORCED_ENTRY' || a.alertType === 'INTRUDER_UNAUTHORIZED'));
  const unitVisitorPasses = visitorInvites.filter(iv => iv.unit === currentUnit);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6 font-sans">
      {/* =========================================================================
          EMERGENCY SECURITY INTRUSION BANNER (IF GUARD TRIGGERED ALARM)
          ========================================================================= */}
      {activeSecurityAlert && (
        <div className="bg-gradient-to-r from-rose-600 to-red-700 text-white p-5 rounded-3xl shadow-xl border-2 border-red-400 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in duration-300">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center shrink-0 animate-bounce">
              <AlertCircle className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-black uppercase bg-white/20 px-2.5 py-0.5 rounded-full border border-white/30">
                  HIGH SECURITY ALERT · GATE 01
                </span>
                <span className="text-[10px] text-white/80 font-mono">• {activeSecurityAlert.createdAt}</span>
              </div>
              <h3 className="text-lg font-black mt-0.5">Forced Entry / Intrusion Attempt Reported!</h3>
              <p className="text-xs text-white/90 mt-0.5 max-w-xl">
                {activeSecurityAlert.description} Security personnel are actively handling the barrier perimeter. Residents advised to remain alert.
              </p>
            </div>
          </div>
          <span className="text-xs bg-white text-rose-800 font-extrabold px-4 py-2 rounded-xl shrink-0 self-start sm:self-auto shadow-sm">
            Security Team Dispatched
          </span>
        </div>
      )}

      {/* Top Mobile/App Header Lockup with Society White-Labeling */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-white text-2xl shadow-sm shrink-0"
            style={{ backgroundColor: societyConfig.primaryColor }}
          >
            {societyConfig.logoEmblem}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-slate-900 tracking-tight">{societyConfig.name}</h2>
              <span className="text-[10px] text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300 font-mono font-bold">
                Resident Portal Live
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Unit: <strong className="text-slate-900 font-mono">{residentUser?.unit || currentUnit}</strong> · Resident: <strong className="text-slate-900">{residentUser?.name}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-400 font-medium">Flat:</span>
            <select
              value={currentUnit}
              onChange={(e) => setCurrentUnit(e.target.value)}
              className="bg-slate-50 border border-slate-300 text-xs text-slate-800 font-bold rounded-xl px-3 py-2 font-mono focus:outline-none focus:border-blue-500 shadow-xs cursor-pointer"
            >
              <option value="B-402">Unit B-402 (Tower B)</option>
              <option value="A-101">Unit A-101 (Tower A)</option>
              <option value="A-102">Unit A-102 (Tower A)</option>
              <option value="B-403">Unit B-403 (Tower B)</option>
            </select>
          </div>

          <button
            onClick={() => logoutPortal('resident')}
            className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer border border-rose-200"
            title="Sign out of resident account"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* LIVE GATE & GUARD SECURITY STATUS SUMMARY */}
      <div className="bg-gradient-to-r from-blue-50/60 via-white to-slate-50 p-4 rounded-2xl border border-blue-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={guardProfile.masterPhotoUrl}
              alt={guardProfile.name}
              className="w-10 h-10 rounded-xl object-cover border border-slate-300 shadow-xs"
            />
            <span
              className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${
                guardProfile.isOnline ? 'bg-emerald-500' : 'bg-slate-400'
              }`}
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-slate-900">{guardProfile.name}</span>
              <span className="text-[10px] bg-blue-100 text-blue-800 font-mono font-bold px-1.5 py-0.5 rounded">
                {guardProfile.badgeNumber}
              </span>
              <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 font-bold px-2 py-0.5 rounded-full">
                {guardProfile.isOnline ? 'On Duty (Online)' : 'Off Duty'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-2 font-mono">
              <span>{guardProfile.assignedGate}</span>
              <span>•</span>
              <span className="text-emerald-700 font-bold">
                GPS Geofence: {guardGeofence.isWithinGeofence ? 'Verified Inside (±3m)' : 'Perimeter Alert'}
              </span>
              <span>•</span>
              <span className="text-blue-700">Face Verified</span>
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('deliveries')}
          className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 self-end sm:self-auto cursor-pointer"
        >
          <QrCode className="w-3.5 h-3.5" /> Invite Visitor Pass (OTP)
        </button>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200">
        {[
          { id: 'billing', label: 'Maintenance Bills', icon: Receipt },
          { id: 'deliveries', label: `Gate & Deliveries (${deliveries.filter(d => d.unit === currentUnit).length})`, icon: Package },
          { id: 'notices', label: `Notice Board (${notices.length})`, icon: Bell },
          { id: 'complaints', label: `My Tickets (${unitComplaints.length})`, icon: AlertCircle },
          { id: 'facilities', label: 'Book Amenity', icon: Calendar },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200/80'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* =========================================================================
          TAB 1: MAINTENANCE BILLING & INVOICES
          ========================================================================= */}
      {activeTab === 'billing' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Multi-Utility Ledger</span>
              <h3 className="text-xl font-bold text-slate-900 mt-0.5">Current Dues & Utility Breakdown</h3>
            </div>
            <span className="text-xs text-slate-500 font-mono">
              Cycle: {activeInvoice?.billingPeriod} · Due: {activeInvoice?.dueDate}
            </span>
          </div>

          {/* 4 Line Item Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-slate-200 space-y-2 hover:border-slate-300 transition-colors shadow-xs">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-semibold text-slate-700">Society Maintenance</span>
                <Building2 className="w-4 h-4 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
                ₹{activeInvoice?.societyMaintenance.amount.toLocaleString()}
              </p>
              <div className="text-[11px] text-slate-500 space-y-0.5 border-t border-slate-100 pt-2 font-mono">
                <p>{activeInvoice?.societyMaintenance.areaSqFt} sq ft @ ₹{activeInvoice?.societyMaintenance.ratePerSqFt.toFixed(2)}/sq ft</p>
                <p className="text-slate-400">CAM & Common Facilities</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 space-y-2 hover:border-slate-300 transition-colors shadow-xs">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-semibold text-slate-700">Municipal Housing Tax</span>
                <FileText className="w-4 h-4 text-purple-600" />
              </div>
              <p className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
                ₹{activeInvoice?.propertyTax.amount.toLocaleString()}
              </p>
              <div className="text-[11px] text-slate-500 space-y-0.5 border-t border-slate-100 pt-2 font-mono">
                <p className="truncate">BBMP Q3 Assessment</p>
                <p className="text-slate-400">{activeInvoice?.propertyTax.assessmentNo}</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 space-y-2 hover:border-slate-300 transition-colors shadow-xs">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-semibold text-slate-700">Electricity & DG Power</span>
                <Zap className="w-4 h-4 text-amber-600" />
              </div>
              <p className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
                ₹{activeInvoice?.electricityMeter.totalAmount.toLocaleString()}
              </p>
              <div className="text-[11px] text-slate-500 space-y-0.5 border-t border-slate-100 pt-2 font-mono">
                <p>Grid: {activeInvoice?.electricityMeter.unitsConsumed} kWh (₹{activeInvoice?.electricityMeter.gridRate}/u)</p>
                <p className="text-amber-700">DG: {activeInvoice?.electricityMeter.dgUnitsConsumed} kWh (₹{activeInvoice?.electricityMeter.dgRate}/u)</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 space-y-2 hover:border-slate-300 transition-colors shadow-xs">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-semibold text-slate-700">Water Utility & Surcharge</span>
                <Droplet className="w-4 h-4 text-cyan-600" />
              </div>
              <p className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
                ₹{activeInvoice?.waterUtility.totalAmount.toLocaleString()}
              </p>
              <div className="text-[11px] text-slate-500 space-y-0.5 border-t border-slate-100 pt-2 font-mono">
                <p>Actual: {(activeInvoice?.waterUtility.actualLitres || 0).toLocaleString()}L</p>
                <p className="text-cyan-700">Surcharge: ₹{activeInvoice?.waterUtility.consumptionSurcharge} (over 15kL base)</p>
              </div>
            </div>
          </div>

          {/* Total Pay CTA Banner */}
          <div className="bg-gradient-to-r from-blue-50 via-white to-blue-50/50 p-6 sm:p-7 rounded-3xl border border-blue-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <span className="text-xs text-blue-700 font-bold uppercase tracking-wider">Total Consolidated Balance</span>
              <div className="flex items-baseline gap-3 mt-1">
                <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-mono tabular-nums">
                  ₹{activeInvoice?.totalAmount.toLocaleString()}
                </span>
                <span
                  className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                    activeInvoice?.status === 'Paid'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-amber-100 text-amber-800 border border-amber-300'
                  }`}
                >
                  {activeInvoice?.status === 'Paid' ? 'Paid & Settled ✓' : `Due on ${activeInvoice?.dueDate || '30 Apr'}`}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Includes Society Maintenance, Property Tax, Sub-metered Electricity, DG Backup, and Water.
              </p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              {activeInvoice?.status === 'Paid' ? (
                <button
                  onClick={() => setSelectedInvoiceForReceipt(activeInvoice)}
                  className="w-full sm:w-auto px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Printer className="w-4 h-4" /> Download Official Receipt
                </button>
              ) : (
                <button
                  onClick={() => setIsPayModalOpen(true)}
                  className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CreditCard className="w-4 h-4" /> Pay Balance (₹{activeInvoice?.totalAmount.toLocaleString()})
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: GATE, VISITOR OTP PASSES & COURIER DELIVERIES
          ========================================================================= */}
      {activeTab === 'deliveries' && (
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Gate Intercom Access</span>
              <h3 className="text-xl font-bold text-slate-900 mt-0.5">Visitor OTP Passes & Courier Clearances</h3>
              <p className="text-xs text-slate-500">
                Visitor ko 4-digit OTP share karein. Guard gate terminal par OTP verify karke barrier kholega.
              </p>
            </div>
            <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
              <button
                onClick={() => {
                  setGuestOtp(Math.floor(1000 + Math.random() * 9000).toString());
                  setIsVisitorPassModalOpen(true);
                }}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Generate Visitor Pass (OTP)
              </button>
              <button
                onClick={() => setIsPreApproveModalOpen(true)}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer"
              >
                <Package className="w-4 h-4" /> Pre-Approve Courier
              </button>
            </div>
          </div>

          {/* VISITOR INVITE PASSES LIST */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <QrCode className="w-4 h-4 text-blue-600" />
              Active Guest & Cab Passes for Flat {currentUnit} ({unitVisitorPasses.length})
            </h4>

            {unitVisitorPasses.length === 0 ? (
              <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl text-center space-y-2">
                <p className="text-xs text-slate-500 font-medium">No active visitor passes issued yet for flat {currentUnit}.</p>
                <button
                  onClick={() => {
                    setGuestOtp(Math.floor(1000 + Math.random() * 9000).toString());
                    setIsVisitorPassModalOpen(true);
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Create First Visitor Pass
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {unitVisitorPasses.map((pass) => (
                  <div key={pass.id} className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs space-y-3 relative overflow-hidden">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-xs border border-blue-200">
                          {pass.visitorType.slice(0, 2).toUpperCase()}
                        </span>
                        <div>
                          <h4 className="font-extrabold text-slate-900 text-sm">{pass.visitorName}</h4>
                          <p className="text-[11px] text-slate-500">{pass.company || pass.visitorType} · {pass.visitorPhone}</p>
                        </div>
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                          pass.status === 'Admitted'
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                            : pass.status === 'Pending_Verification'
                            ? 'bg-amber-50 text-amber-800 border-amber-300 animate-pulse'
                            : 'bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        {pass.status === 'Pending_Verification' ? 'Waiting at Gate' : pass.status}
                      </span>
                    </div>

                    {/* BIG OTP CARD */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50/60 p-4 rounded-2xl border border-blue-200 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-blue-700 tracking-wider block">
                          Gate Security OTP Code
                        </span>
                        <span className="text-2xl font-mono font-black text-slate-900 tracking-widest mt-0.5 block">
                          {pass.otpCode}
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block font-mono">Valid Hours</span>
                        <span className="text-xs font-semibold text-slate-700 block">{pass.validFrom} - {pass.validUntil}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                      <span>Vehicle: <strong className="font-mono text-slate-800">{pass.vehicleNumber || 'Pedestrian'}</strong></span>
                      {pass.admittedAt ? (
                        <span className="text-emerald-700 font-bold">Admitted by Guard: {pass.admittedAt}</span>
                      ) : (
                        <span className="text-amber-700">Tell guard code #{pass.otpCode}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* PRE-APPROVED DELIVERIES LIST */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Package className="w-4 h-4 text-emerald-600" />
              Pre-Approved Courier Parcels ({deliveries.filter((del) => del.unit === currentUnit).length})
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {deliveries
                .filter((del) => del.unit === currentUnit)
                .map((del) => (
                  <div key={del.id} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-800">
                          {del.carrier.slice(0, 2).toUpperCase()}
                        </span>
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm">{del.carrier} Delivery</h4>
                          <p className="text-[11px] text-slate-500">{del.expectedWindow}</p>
                        </div>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          del.status === 'Delivered'
                            ? 'bg-slate-100 text-slate-700'
                            : del.status === 'At Security Gate'
                            ? 'bg-amber-100 text-amber-800 animate-pulse'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {del.status}
                      </span>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-2xl flex items-center justify-between text-xs">
                      <div>
                        <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Gate OTP Code</p>
                        <p className="text-lg font-mono font-extrabold text-blue-700 tracking-widest">{del.passcode}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Permission</p>
                        <p className="font-semibold text-slate-700">{del.permission}</p>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 bg-blue-50/60 p-2.5 rounded-xl border border-blue-100/60">
                      "{del.notes}"
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                      <span>Logged: {del.createdAt}</span>
                      {del.admittedAt && <span className="text-emerald-700 font-medium">Admitted at Gate: {del.admittedAt}</span>}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          TAB 3: SOCIETY NOTICE BOARD
          ========================================================================= */}
      {activeTab === 'notices' && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">Official Circulars</span>
              <h3 className="text-xl font-bold text-slate-900 mt-0.5">Society Announcements & Bulletins</h3>
            </div>
            <span className="text-xs text-slate-500">{notices.length} Active Circulars</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {notices.map((n) => (
              <div key={n.id} className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                    n.priority === 'Urgent' ? 'bg-red-100 text-red-800' :
                    n.priority === 'Important' ? 'bg-amber-100 text-amber-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {n.priority} • {n.category}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">Until {n.validUntil}</span>
                </div>

                <h4 className="text-base font-bold text-slate-900">{n.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{n.content}</p>

                <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
                  <span>From: <strong className="text-slate-700">{n.postedBy}</strong></span>
                  <span>Published on {n.createdAt}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* =========================================================================
          TAB 4: HELPDESK TICKETS & COMPLAINTS
          ========================================================================= */}
      {activeTab === 'complaints' && (
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Society Helpdesk</span>
              <h3 className="text-xl font-bold text-slate-900 mt-0.5">Maintenance Complaints & Tickets</h3>
              <p className="text-xs text-slate-500">Track technician visits and resolution progress in real time</p>
            </div>
            <button
              onClick={() => setIsComplaintModalOpen(true)}
              className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" /> Raise New Ticket
            </button>
          </div>

          {unitComplaints.length === 0 ? (
            <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
              <h4 className="text-sm font-bold text-slate-900">No active tickets for {currentUnit}</h4>
              <p className="text-xs text-slate-500">Everything is working smoothly in your flat!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {unitComplaints.map((c) => (
                <div key={c.id} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-slate-500">Ticket #{c.id}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                      c.status === 'Open' ? 'bg-amber-100 text-amber-800' :
                      c.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                      'bg-emerald-100 text-emerald-800'
                    }`}>
                      {c.status}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-base font-bold text-slate-900">{c.title}</h4>
                    <p className="text-xs text-slate-600 mt-1">{c.description}</p>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100">
                    <span>Category: <strong>{c.category}</strong></span>
                    <span>Priority: <strong>{c.priority}</strong></span>
                    <span>Logged: {c.createdAt}</span>
                  </div>

                  {c.assignedTo && (
                    <div className="p-3 bg-slate-50 rounded-2xl text-xs text-slate-700 flex items-center justify-between">
                      <span>Assigned Technician: <strong>{c.assignedTo}</strong></span>
                      {c.resolvedAt && <span className="text-emerald-700 font-bold">Resolved on {c.resolvedAt}</span>}
                    </div>
                  )}

                  {c.resolutionNotes && (
                    <div className="p-3 bg-emerald-50 rounded-2xl text-xs text-emerald-800 border border-emerald-200">
                      <strong>Resolution Notes:</strong> {c.resolutionNotes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* =========================================================================
          TAB 5: FACILITY & AMENITY BOOKINGS
          ========================================================================= */}
      {activeTab === 'facilities' && (
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Amenities Access</span>
              <h3 className="text-xl font-bold text-slate-900 mt-0.5">Clubhouse & Sports Court Bookings</h3>
              <p className="text-xs text-slate-500">Reserve party halls, tennis courts, and swimming pool slots</p>
            </div>
            <button
              onClick={() => setIsFacilityModalOpen(true)}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" /> Reserve Amenity Slot
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {unitBookings.map((b) => (
              <div key={b.id} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-bold text-slate-900">{b.facilityName}</h4>
                  <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase rounded-full">
                    {b.status}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Booking Date:</span>
                    <strong className="text-slate-800">{b.bookingDate}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Time Slot:</span>
                    <strong className="text-slate-800">{b.timeSlot}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Fee Paid:</span>
                    <strong className="text-emerald-700 font-mono">₹{b.feeAmount.toLocaleString()}</strong>
                  </div>
                </div>

                <p className="text-[11px] text-slate-400">Reserved for Flat {b.unit} ({b.residentName})</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* =========================================================================
          MODAL 1: PRE-APPROVE DELIVERY MODAL
          ========================================================================= */}
      {isPreApproveModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setIsPreApproveModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-800 p-2 rounded-xl bg-slate-100 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 mb-1">
              <Package className="w-4 h-4" /> Instant Gate Sync
            </div>
            <h3 className="text-lg font-bold text-slate-900">Pre-Approve Delivery Courier</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Courier will bypass manual phone screening upon stating unit {currentUnit} at Gate 01.
            </p>

            <form onSubmit={handleCreatePreApproval} className="space-y-4 mt-5">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">Select Delivery Partner</label>
                <div className="grid grid-cols-4 gap-2">
                  {(['Zomato', 'Swiggy', 'Amazon', 'Blinkit', 'Dunzo', 'BlueDart', 'Flipkart', 'Other'] as CarrierType[]).map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setCarrier(c)}
                      className={`p-2 rounded-xl text-xs font-semibold border text-center transition-all cursor-pointer ${
                        carrier === c
                          ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">Delivery Permission</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPermission('Allow to Doorstep')}
                    className={`p-2.5 rounded-xl text-xs font-semibold border text-center transition-all cursor-pointer ${
                      permission === 'Allow to Doorstep'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                        : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    Allow to Doorstep
                  </button>
                  <button
                    type="button"
                    onClick={() => setPermission('Leave at Gate')}
                    className={`p-2.5 rounded-xl text-xs font-semibold border text-center transition-all cursor-pointer ${
                      permission === 'Leave at Gate'
                        ? 'bg-blue-50 border-blue-500 text-blue-800'
                        : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    Leave at Gate Desk
                  </button>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-medium text-slate-700">Auto-Generated Gate Passcode</label>
                  <button
                    type="button"
                    onClick={handleGenerateNewPasscode}
                    className="text-[11px] text-blue-600 hover:underline cursor-pointer"
                  >
                    Refresh
                  </button>
                </div>
                <input
                  type="text"
                  maxLength={4}
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-base font-mono font-bold tracking-widest text-center text-slate-900 focus:outline-none focus:border-blue-500 shadow-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Special Delivery Notes</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Ring bell once / Keep in Locker #14"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500 shadow-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
              >
                Confirm Pre-Approval Passcode
              </button>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: RAISE COMPLAINT / HELPDESK TICKET
          ========================================================================= */}
      {isComplaintModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setIsComplaintModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-800 p-2 rounded-xl bg-slate-100 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 text-xs font-semibold text-amber-700 mb-1">
              <AlertCircle className="w-4 h-4" /> Society Service Desk
            </div>
            <h3 className="text-lg font-bold text-slate-900">Log Maintenance Ticket</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Ticket for Unit {currentUnit}. Estate technician will be assigned.
            </p>

            <form onSubmit={handleCreateComplaint} className="space-y-4 mt-5">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Category</label>
                <select
                  value={complaintCategory}
                  onChange={(e) => setComplaintCategory(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-blue-500"
                >
                  <option value="Plumbing">Plumbing (Water line, leakage, taps)</option>
                  <option value="Electrical">Electrical (Power trip, meter, fixtures)</option>
                  <option value="Elevator">Elevator / Lift</option>
                  <option value="Security">Security & Intercom</option>
                  <option value="Civil">Civil Works / Seepage</option>
                  <option value="Gardening">Gardening & Landscape</option>
                  <option value="Other">Other / Miscellaneous</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Issue Title*</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Master bathroom geyser outlet leaking"
                  value={complaintTitle}
                  onChange={(e) => setComplaintTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Description*</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Please describe the issue in detail..."
                  value={complaintDesc}
                  onChange={(e) => setComplaintDesc(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Priority</label>
                <select
                  value={complaintPriority}
                  onChange={(e) => setComplaintPriority(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-blue-500"
                >
                  <option value="Low">Low (Convenience issue)</option>
                  <option value="Medium">Medium (Normal resolution)</option>
                  <option value="High">High (Impacting daily routine)</option>
                  <option value="Urgent">Urgent (Immediate attention)</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
              >
                Submit Ticket to Society Panel
              </button>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 3: BOOK AMENITY
          ========================================================================= */}
      {isFacilityModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setIsFacilityModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-800 p-2 rounded-xl bg-slate-100 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 mb-1">
              <Calendar className="w-4 h-4" /> Amenity Reservation
            </div>
            <h3 className="text-lg font-bold text-slate-900">Book Society Amenity</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Reserve common facilities for family events or sports.
            </p>

            <form onSubmit={handleCreateBooking} className="space-y-4 mt-5">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Select Facility</label>
                <select
                  value={facilityName}
                  onChange={(e) => setFacilityName(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-blue-500"
                >
                  <option value="Clubhouse Party Hall">Clubhouse Party Hall (₹3,500/slot)</option>
                  <option value="Tennis Court">Tennis Court (Complimentary)</option>
                  <option value="Swimming Pool Slot">Swimming Pool Slot (Complimentary)</option>
                  <option value="Badminton Court">Badminton Court (Complimentary)</option>
                  <option value="Community Garden">Community Garden Lawn (Complimentary)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Reservation Date</label>
                <input
                  type="date"
                  required
                  value={facilityDate}
                  onChange={(e) => setFacilityDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Time Slot</label>
                <select
                  value={facilityTimeSlot}
                  onChange={(e) => setFacilityTimeSlot(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-blue-500"
                >
                  <option value="06:00 AM - 08:00 AM">Morning: 06:00 AM - 08:00 AM</option>
                  <option value="08:00 AM - 10:00 AM">Morning: 08:00 AM - 10:00 AM</option>
                  <option value="04:00 PM - 06:00 PM">Evening: 04:00 PM - 06:00 PM</option>
                  <option value="06:00 PM - 09:00 PM">Evening: 06:00 PM - 09:00 PM</option>
                  <option value="06:00 PM - 10:30 PM">Night Party: 06:00 PM - 10:30 PM</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
              >
                Confirm Slot Reservation
              </button>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 4: PAY INVOICE MODAL
          ========================================================================= */}
      {isPayModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setIsPayModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-800 p-2 rounded-xl bg-slate-100 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 mb-1">
              <CreditCard className="w-4 h-4" /> Encrypted Payment Gateway
            </div>
            <h3 className="text-lg font-bold text-slate-900">Settle Society Invoices</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Unit {currentUnit} · Cycle: {activeInvoice?.billingPeriod}
            </p>

            <div className="my-5 p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-xs text-slate-500">Payable Total</span>
              <p className="text-2xl font-bold font-mono text-slate-900">
                ₹{activeInvoice?.totalAmount.toLocaleString()}
              </p>
              <p className="text-[11px] text-slate-400 mt-1 font-mono">Invoice Ref: {activeInvoice?.id}</p>
            </div>

            <div className="space-y-2 mb-6">
              {(['UPI', 'Credit Card', 'Net Banking'] as const).map((method) => (
                <label
                  key={method}
                  onClick={() => setSelectedPaymentMethod(method)}
                  className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    selectedPaymentMethod === method
                      ? 'bg-blue-50 border-blue-500 text-blue-950 font-semibold'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span className="text-xs">{method}</span>
                  <span className="text-[10px] text-emerald-700 font-mono font-medium">0% Surcharge</span>
                </label>
              ))}
            </div>

            <button
              onClick={handleExecutePayment}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" /> Authorize & Settle ₹{activeInvoice?.totalAmount.toLocaleString()}
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 5: OFFICIAL PRINTABLE DIGITAL RECEIPT
          ========================================================================= */}
      {selectedInvoiceForReceipt && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white text-slate-900 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative my-auto border border-slate-200">
            <button
              onClick={() => setSelectedInvoiceForReceipt(null)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-800 p-2 rounded-xl bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Receipt Header */}
            <div className="border-b border-slate-200 pb-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-white text-xl shadow-sm"
                    style={{ backgroundColor: societyConfig.primaryColor }}
                  >
                    {societyConfig.logoEmblem}
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">{societyConfig.name}</h3>
                    <p className="text-xs text-slate-500">{societyConfig.address}, {societyConfig.city} - {societyConfig.pincode}</p>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                      Reg: {societyConfig.registrationNumber} · GSTIN: {societyConfig.gstin || '29AAAFP9821M1Z5'}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[11px] font-mono font-bold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded border border-emerald-300">
                    TAX INVOICE & RECEIPT
                  </span>
                  <p className="text-[11px] font-mono text-slate-600 mt-1">RCPT: {selectedInvoiceForReceipt.id}</p>
                </div>
              </div>
            </div>

            {/* Flat & Bill Metadata Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 text-xs border-b border-slate-200 bg-slate-50 p-3 rounded-2xl mt-4">
              <div>
                <p className="text-slate-500 text-[10px]">Flat / Unit ID</p>
                <p className="font-bold text-slate-900 font-mono">{selectedInvoiceForReceipt.unit}</p>
              </div>
              <div>
                <p className="text-slate-500 text-[10px]">Resident Name</p>
                <p className="font-bold text-slate-900">{selectedInvoiceForReceipt.residentName}</p>
              </div>
              <div>
                <p className="text-slate-500 text-[10px]">Billing Period</p>
                <p className="font-bold text-slate-900">{selectedInvoiceForReceipt.billingPeriod}</p>
              </div>
              <div>
                <p className="text-slate-500 text-[10px]">Status</p>
                <p className="font-bold text-emerald-700 font-mono">{selectedInvoiceForReceipt.status}</p>
              </div>
            </div>

            {/* Line items table */}
            <div className="mt-4">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 text-[11px]">
                    <th className="py-2">Description</th>
                    <th className="py-2 text-right">Basis</th>
                    <th className="py-2 text-right">Amount (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="py-2.5 font-medium">Society Maintenance</td>
                    <td className="py-2.5 text-right font-mono text-slate-500">Fixed CAM</td>
                    <td className="py-2.5 text-right font-mono font-semibold">
                      ₹{selectedInvoiceForReceipt.societyMaintenance.amount.toLocaleString()}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-medium">Sub-metered Electricity / DG Power</td>
                    <td className="py-2.5 text-right font-mono text-slate-500">DG & Grid Units</td>
                    <td className="py-2.5 text-right font-mono font-semibold">
                      ₹{selectedInvoiceForReceipt.electricityMeter.totalAmount.toLocaleString()}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-medium">Water Utility & Surcharge</td>
                    <td className="py-2.5 text-right font-mono text-slate-500">Metered Consumption</td>
                    <td className="py-2.5 text-right font-mono font-semibold">
                      ₹{selectedInvoiceForReceipt.waterUtility.totalAmount.toLocaleString()}
                    </td>
                  </tr>
                  <tr className="border-t-2 border-slate-900 font-bold text-slate-900">
                    <td className="py-3 text-sm">Total Paid</td>
                    <td className="py-3 text-right text-xs text-slate-500">Settled</td>
                    <td className="py-3 text-right text-base font-mono text-emerald-700">
                      ₹{selectedInvoiceForReceipt.totalAmount.toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Cryptographic Receipt Hash */}
            <div className="mt-5 p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-[11px] flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <p className="font-semibold text-slate-800">
                  Payment Ref: {selectedInvoiceForReceipt.transactionId || 'TXN-SETTLED-AXIS'}
                </p>
                <p className="font-mono text-slate-500 text-[10px] break-all">
                  SHA-256 Digest: {selectedInvoiceForReceipt.receiptHash || '9F28A1C49B200E4A1028FF4B'}
                </p>
              </div>
              <div className="text-right shrink-0">
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-mono font-bold">
                  DIGITALLY STAMPED
                </span>
              </div>
            </div>

            {/* Action Bar */}
            <div className="mt-6 flex justify-end gap-3 border-t border-slate-200 pt-4">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4" /> Print Receipt
              </button>
              <button
                onClick={() => setSelectedInvoiceForReceipt(null)}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
      {/* =========================================================================
          MODAL 6: CREATE VISITOR INVITE PASS (WITH OTP GENERATOR)
          ========================================================================= */}
      {isVisitorPassModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsVisitorPassModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                <QrCode className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Generate Visitor Pass (OTP)</h3>
                <p className="text-xs text-slate-500">Provide this 4-digit OTP to your guest or cab driver.</p>
              </div>
            </div>

            <form onSubmit={handleCreateVisitorPass} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Visitor / Guest Full Name</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Kishore Sharma"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Visitor Type</label>
                  <select
                    value={guestType}
                    onChange={(e) => setGuestType(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500 font-medium"
                  >
                    <option value="Guest">Personal Guest</option>
                    <option value="Cab">Cab / Uber / Ola</option>
                    <option value="Delivery">Delivery / Courier</option>
                    <option value="Service Staff">Service Staff</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Vehicle Plate (If Any)</label>
                  <input
                    type="text"
                    placeholder="KA-05-JK-1234"
                    value={guestVehicle}
                    onChange={(e) => setGuestVehicle(e.target.value.toUpperCase())}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Visitor Mobile Number</label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* GENERATED OTP CARD */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-2xl border-2 border-blue-200 text-center space-y-1">
                <span className="text-[10px] font-mono font-bold uppercase text-blue-700 tracking-wider">
                  Gate Security Clearance OTP
                </span>
                <div className="text-3xl font-mono font-black text-slate-900 tracking-widest">
                  {guestOtp}
                </div>
                <p className="text-[10px] text-slate-500">
                  This OTP will be auto-synced to Gate 01 Guard Terminal.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsVisitorPassModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl cursor-pointer shadow-xs flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" /> Issue Gate Pass
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
