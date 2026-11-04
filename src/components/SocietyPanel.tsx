import React, { useState } from 'react';
import { useCivicOps } from '../context/CivicOpsContext';
import { 
  Building2, 
  Users, 
  Receipt, 
  AlertCircle, 
  Bell, 
  ShieldCheck, 
  Droplet, 
  Plus, 
  Search, 
  CheckCircle2, 
  Clock, 
  Filter, 
  Zap, 
  Trash2, 
  FileSpreadsheet, 
  TrendingUp,
  CreditCard,
  UserCheck,
  Send,
  X,
  Phone,
  Mail,
  Car,
  Wrench,
  Flame,
  Check,
  Calendar,
  RotateCw,
  Power,
  MapPin,
  Radio,
  ArrowRightLeft,
  LogOut,
  Camera,
  Download,
  FileText,
  Sparkles,
  ArrowUpRight,
  BarChart3,
  PieChart,
  Layers,
  Activity,
  MessageSquare
} from 'lucide-react';
import { Complaint, SocietyNotice, GuardShiftAssignment, GuardDutyProfile } from '../types';
import { GuardGeofenceMap } from './GuardGeofenceMap';
import { DroneSurveillanceView } from './DroneSurveillanceView';
import { SectionAuthScreen } from './SectionAuthScreen';
import { ImageManagementSection } from './ImageManagementSection';

export const SocietyPanel: React.FC = () => {
  const { 
    societyConfig, 
    residentsList, 
    addResident, 
    deleteResident,
    invoices, 
    bulkGenerateInvoices,
    complaints, 
    updateComplaintStatus,
    notices, 
    addNotice, 
    deleteNotice,
    visitors,
    tanks,
    pumps,
    togglePump,
    sqlBackendStatus,
    refreshSqlData,
    securityAlerts,
    resolveSecurityAlert,
    guardProfile,
    guardRoster,
    faceVerificationLogs,
    updateGuardMasterPhoto,
    guardGeofence,
    guardShifts,
    assignGuardShift,
    rotateAllGuardShifts,
    setGuardOnlineStatus,
    droneFlightLogs,
    authUsers,
    logoutPortal,
    showToast,
    activeSocietyPanelTab,
    setActiveSocietyPanelTab
  } = useCivicOps();

  const societyUser = authUsers['society_panel'];
  if (!societyUser) {
    return <SectionAuthScreen role="society_panel" />;
  }

  const [activeTab, setActiveTab] = useState<'overview' | 'residents' | 'billing' | 'complaints' | 'notices' | 'security' | 'shifts' | 'water' | 'drone' | 'images'>(() => {
    return activeSocietyPanelTab || 'overview';
  });

  // Modal states
  const [isAddResidentOpen, setIsAddResidentOpen] = useState(false);
  const [isBulkInvoiceOpen, setIsBulkInvoiceOpen] = useState(false);
  const [isAddNoticeOpen, setIsAddNoticeOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);

  // Advanced ERP filter & period states
  const [selectedBlockFilter, setSelectedBlockFilter] = useState<string>('ALL');
  const [tenancyFilter, setTenancyFilter] = useState<'ALL' | 'Owner' | 'Tenant'>('ALL');
  const [fiscalPeriod, setFiscalPeriod] = useState<string>('April 2026');
  const [isSyncingSql, setIsSyncingSql] = useState<boolean>(false);

  // Guard Shift Management Modal & Form states
  const [isAssignShiftOpen, setIsAssignShiftOpen] = useState(false);
  const [selectedShiftGuardId, setSelectedShiftGuardId] = useState('guard_01');
  const [selectedShiftType, setSelectedShiftType] = useState<'Morning' | 'Evening' | 'Night' | 'Relief'>('Morning');
  const [selectedShiftTiming, setSelectedShiftTiming] = useState('06:00 - 14:00');
  const [selectedAssignedPost, setSelectedAssignedPost] = useState('Gate 01 - Main Entrance Barrier');
  const [selectedDutyStatus, setSelectedDutyStatus] = useState<'ACTIVE_ON_DUTY' | 'SCHEDULED' | 'OFF_DUTY_REST'>('ACTIVE_ON_DUTY');
  const [selectedEffectiveDate, setSelectedEffectiveDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedShiftNotes, setSelectedShiftNotes] = useState('');
  const [isRotatingShifts, setIsRotatingShifts] = useState(false);
  const [isSubmittingShift, setIsSubmittingShift] = useState(false);

  // Guard Master Photo modal state
  const [isMasterPhotoModalOpen, setIsMasterPhotoModalOpen] = useState(false);
  const [targetGuardId, setTargetGuardId] = useState('guard_01');
  const [newMasterPhotoInput, setNewMasterPhotoInput] = useState('');

  // Filter states
  const [residentSearch, setResidentSearch] = useState('');
  const [invoiceFilter, setInvoiceFilter] = useState<'ALL' | 'Paid' | 'Pending'>('ALL');
  const [complaintFilter, setComplaintFilter] = useState<'ALL' | 'Open' | 'In Progress' | 'Resolved'>('ALL');

  // Form states: New Resident
  const [newUnit, setNewUnit] = useState('');
  const [newBlock, setNewBlock] = useState('Tower A');
  const [newOwnerName, setNewOwnerName] = useState('');
  const [newResidentType, setNewResidentType] = useState<'Owner' | 'Tenant'>('Owner');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newParkingSlot, setNewParkingSlot] = useState('');
  const [newHasPets, setNewHasPets] = useState(false);

  // Form states: Bulk Invoice
  const [bulkPeriod, setBulkPeriod] = useState('April 2026');
  const [bulkDueDate, setBulkDueDate] = useState('2026-04-30');
  const [bulkMaintAmt, setBulkMaintAmt] = useState(2400);
  const [bulkElecAmt, setBulkElecAmt] = useState(1100);
  const [bulkWaterAmt, setBulkWaterAmt] = useState(750);
  const [isGenerating, setIsGenerating] = useState(false);

  // Form states: New Notice
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeCategory, setNoticeCategory] = useState<'General' | 'Maintenance' | 'Event' | 'Emergency' | 'Meeting'>('General');
  const [noticePriority, setNoticePriority] = useState<'Normal' | 'Important' | 'Urgent'>('Normal');
  const [noticeContent, setNoticeContent] = useState('');
  const [noticeValidUntil, setNoticeValidUntil] = useState('2026-04-30');

  // Form states: Complaint resolution
  const [assignStaff, setAssignStaff] = useState('Suresh Plumber');
  const [resolutionNotes, setResolutionNotes] = useState('');

  // Metrics calculation
  const totalInvoicesAmt = invoices.reduce((acc, inv) => acc + inv.totalAmount, 0);
  const paidInvoicesAmt = invoices.filter(i => i.status === 'Paid').reduce((acc, inv) => acc + inv.totalAmount, 0);
  const pendingInvoicesAmt = invoices.filter(i => i.status !== 'Paid').reduce((acc, inv) => acc + inv.totalAmount, 0);
  const openComplaintsCount = complaints.filter(c => c.status === 'Open').length;
  const inProgressComplaintsCount = complaints.filter(c => c.status === 'In Progress').length;
  const activeVisitorsInside = visitors.filter(v => v.status === 'Inside').length;
  const avgWaterLevel = Math.round(tanks.reduce((acc, t) => acc + t.levelPercentage, 0) / (tanks.length || 1));

  // Filtered lists with multi-dimensional ERP filters
  const filteredResidents = residentsList.filter(r => {
    const matchesSearch = 
      r.unit.toLowerCase().includes(residentSearch.toLowerCase()) ||
      r.ownerName.toLowerCase().includes(residentSearch.toLowerCase()) ||
      r.block.toLowerCase().includes(residentSearch.toLowerCase()) ||
      r.phone.includes(residentSearch);
    const matchesBlock = selectedBlockFilter === 'ALL' || r.block === selectedBlockFilter;
    const matchesTenancy = tenancyFilter === 'ALL' || r.residentType === tenancyFilter;
    return matchesSearch && matchesBlock && matchesTenancy;
  });

  const filteredInvoices = invoices.filter(inv => {
    if (invoiceFilter === 'Paid') return inv.status === 'Paid';
    if (invoiceFilter === 'Pending') return inv.status !== 'Paid';
    return true;
  });

  const filteredComplaints = complaints.filter(c => {
    if (complaintFilter !== 'ALL') return c.status === complaintFilter;
    return true;
  });

  // ERP Export Handlers
  const exportResidentsCsv = () => {
    const headers = 'Unit,Block,Resident Name,Type,Phone,Email,Parking Slot\n';
    const rows = filteredResidents.map(r => `"${r.unit}","${r.block}","${r.ownerName}","${r.residentType}","${r.phone}","${r.email}","${r.parkingSlot}"`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${societyConfig.subdomain || 'society'}_flats_directory.csv`;
    a.click();
    showToast('Directory Exported', `CSV file downloaded for ${filteredResidents.length} units.`, 'success');
  };

  const exportInvoicesCsv = () => {
    const headers = 'Invoice ID,Unit,Resident,Period,Maintenance,Power DG,Water,Total,Status\n';
    const rows = filteredInvoices.map(i => `"${i.id}","${i.unit}","${i.residentName}","${i.billingPeriod}",${i.societyMaintenance.amount},${i.electricityMeter.totalAmount},${i.waterUtility.totalAmount},${i.totalAmount},"${i.status}"`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${societyConfig.subdomain || 'society'}_maintenance_invoices.csv`;
    a.click();
    showToast('Invoices Exported', `CSV file downloaded for ${filteredInvoices.length} invoices.`, 'success');
  };

  const handleSendDefaulterReminder = (inv: (typeof invoices)[0]) => {
    showToast('Payment Reminder Dispatched', `Automated SMS & WhatsApp bill reminder sent to ${inv.residentName} (${inv.unit}) for ₹${inv.totalAmount.toLocaleString()}.`, 'success');
  };

  const handleManualSqlSync = async () => {
    setIsSyncingSql(true);
    await refreshSqlData();
    setTimeout(() => {
      setIsSyncingSql(false);
      showToast('Database Synchronized', 'Real-time telemetry and ledger synced with PostgreSQL.', 'success');
    }, 400);
  };

  const handleCreateResident = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUnit || !newOwnerName) return;

    await addResident({
      unit: newUnit,
      block: newBlock,
      ownerName: newOwnerName,
      residentType: newResidentType,
      phone: newPhone || '+91 98000 00000',
      email: newEmail || `${newUnit.toLowerCase()}@society.org`,
      parkingSlot: newParkingSlot || 'B1-P' + Math.floor(10 + Math.random() * 89),
      hasPets: newHasPets,
    });

    setNewUnit('');
    setNewOwnerName('');
    setNewPhone('');
    setNewEmail('');
    setNewParkingSlot('');
    setIsAddResidentOpen(false);
  };

  const handleBulkGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    await bulkGenerateInvoices(bulkPeriod, bulkDueDate, bulkMaintAmt, bulkElecAmt, bulkWaterAmt);
    setIsGenerating(false);
    setIsBulkInvoiceOpen(false);
  };

  const handleCreateNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeTitle || !noticeContent) return;

    await addNotice({
      societyId: societyConfig.id,
      title: noticeTitle,
      category: noticeCategory,
      priority: noticePriority,
      content: noticeContent,
      postedBy: `${societyConfig.adminRole} - ${societyConfig.adminName}`,
      validUntil: noticeValidUntil,
    });

    setNoticeTitle('');
    setNoticeContent('');
    setIsAddNoticeOpen(false);
  };

  const handleResolveComplaint = async (status: 'In Progress' | 'Resolved') => {
    if (!selectedComplaint) return;
    await updateComplaintStatus(selectedComplaint.id, status, resolutionNotes, assignStaff);
    setSelectedComplaint(null);
    setResolutionNotes('');
  };

  // Guard Shift Handlers
  const handleAssignShift = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingShift(true);
    const guardObj = guardRoster.find(g => g.id === selectedShiftGuardId) || guardProfile;
    await assignGuardShift({
      societyId: societyConfig.id,
      guardId: selectedShiftGuardId,
      guardName: guardObj.name,
      badgeNumber: guardObj.badgeNumber,
      shiftType: selectedShiftType,
      shiftTiming: selectedShiftTiming,
      assignedPost: selectedAssignedPost,
      effectiveDate: selectedEffectiveDate,
      status: selectedDutyStatus,
      autoDutySync: true,
      assignedBy: `${societyConfig.adminRole} - ${societyConfig.adminName}`,
      notes: selectedShiftNotes,
    });
    setIsSubmittingShift(false);
    setIsAssignShiftOpen(false);
    setSelectedShiftNotes('');
  };

  const handleRotateAllShifts = async () => {
    setIsRotatingShifts(true);
    await rotateAllGuardShifts();
    setIsRotatingShifts(false);
  };

  const handleQuickDutyToggle = async (guard: GuardDutyProfile) => {
    const nextStatus = guard.isOnline ? 'OFF_DUTY_REST' : 'ACTIVE_ON_DUTY';
    await assignGuardShift({
      societyId: societyConfig.id,
      guardId: guard.id,
      guardName: guard.name,
      badgeNumber: guard.badgeNumber,
      shiftType: (guard.dutyShift?.split(' ')[0] as any) || 'Morning',
      shiftTiming: guard.dutyShift?.match(/\((.*?)\)/)?.[1] || '06:00 - 14:00',
      assignedPost: guard.assignedGate,
      effectiveDate: new Date().toISOString().split('T')[0],
      status: nextStatus,
      autoDutySync: true,
      assignedBy: `${societyConfig.adminRole} - ${societyConfig.adminName}`,
      notes: `Quick Duty status toggled to ${nextStatus === 'ACTIVE_ON_DUTY' ? 'On-Duty' : 'Off-Duty'} via Society Panel`,
    });
  };

  const handleOpenAssignModalForGuard = (guard: GuardDutyProfile) => {
    setSelectedShiftGuardId(guard.id);
    const shiftName = guard.dutyShift?.split(' ')[0];
    if (shiftName === 'Morning' || shiftName === 'Evening' || shiftName === 'Night' || shiftName === 'Relief') {
      setSelectedShiftType(shiftName);
    }
    const timingMatch = guard.dutyShift?.match(/\((.*?)\)/);
    if (timingMatch?.[1]) {
      setSelectedShiftTiming(timingMatch[1]);
    }
    setSelectedAssignedPost(guard.assignedGate || 'Gate 01 - Main Entrance Barrier');
    setSelectedDutyStatus(guard.isOnline ? 'ACTIVE_ON_DUTY' : 'OFF_DUTY_REST');
    setIsAssignShiftOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
      {/* ACTIVE EMERGENCY INTRUSION & SECURITY ALERT BANNER */}
      {securityAlerts.filter(a => a.status === 'ACTIVE').length > 0 && (
        <div className="bg-gradient-to-r from-rose-600 to-red-700 text-white p-5 rounded-3xl shadow-xl border-2 border-red-500 space-y-3 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0 animate-bounce">
                <AlertCircle className="w-7 h-7 text-white" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-black uppercase bg-white/20 px-2 py-0.5 rounded-full border border-white/30">
                  CRITICAL SECURITY INCIDENT · GATEHOUSE DISPATCH
                </span>
                <h3 className="text-lg font-black mt-0.5">High-Priority Security Intrusion / Forced Entry Reported!</h3>
              </div>
            </div>
            <span className="text-xs bg-white text-rose-800 font-extrabold px-3 py-1.5 rounded-xl shrink-0 self-start sm:self-auto">
              Real-time Alert Active
            </span>
          </div>

          <div className="space-y-2 pt-1">
            {securityAlerts.filter(a => a.status === 'ACTIVE').map(alt => (
              <div key={alt.id} className="p-3.5 bg-black/20 rounded-2xl border border-white/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-white text-sm">{alt.alertType}</span>
                    <span className="font-mono text-white/80">• Location: {alt.location}</span>
                    <span className="text-white/60 font-mono">• Reported by {alt.guardName} ({alt.createdAt})</span>
                  </div>
                  <p className="text-white/90 mt-1">{alt.description}</p>
                </div>
                <button
                  onClick={() => resolveSecurityAlert(alt.id, `${societyConfig.adminRole} - ${societyConfig.adminName}`)}
                  className="px-4 py-2 bg-white hover:bg-rose-50 text-rose-800 font-extrabold text-xs rounded-xl shadow-sm transition-colors cursor-pointer self-end sm:self-auto"
                >
                  Acknowledge & Mark Secured
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top ERP Command Center Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-5 sm:p-6 shadow-xl border border-slate-800 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div 
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg shrink-0 border border-white/20"
              style={{ backgroundColor: societyConfig.primaryColor }}
            >
              {societyConfig.logoEmblem}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {societyConfig.name}
                </h1>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  ERP Command Live
                </span>
              </div>
              <div className="text-xs text-slate-300 flex flex-wrap items-center gap-3 mt-1.5">
                <span className="font-mono text-slate-400">Reg: {societyConfig.registrationNumber}</span>
                <span className="text-slate-600">·</span>
                <span>{societyConfig.city}</span>
                <span className="text-slate-600">·</span>
                <span className="font-mono text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded-md border border-cyan-500/30">
                  {fiscalPeriod} (FY 2026-27)
                </span>
                <span className="text-slate-600">·</span>
                <span className="text-emerald-400 font-medium">PostgreSQL Linked</span>
              </div>
            </div>
          </div>

          {/* User profile & Quick Action Toolbar */}
          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Authenticated Committee Profile */}
            <div className="flex items-center gap-2 bg-slate-800/80 border border-slate-700 pl-2.5 pr-2 py-1.5 rounded-2xl">
              {societyUser.avatarUrl ? (
                <img
                  src={societyUser.avatarUrl}
                  alt={societyUser.name}
                  className="w-7 h-7 rounded-xl object-cover border border-slate-600"
                />
              ) : (
                <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">
                  {societyUser.name.charAt(0)}
                </div>
              )}
              <div className="text-left leading-tight">
                <p className="text-xs font-bold text-white">{societyUser.name}</p>
                <p className="text-[10px] text-emerald-400 font-mono">{societyUser.roleTitle || 'Committee Member'}</p>
              </div>
              <button
                onClick={() => logoutPortal('society_panel')}
                className="ml-1 p-1 text-slate-400 hover:text-rose-400 hover:bg-slate-700/60 rounded-lg transition-colors cursor-pointer"
                title="Sign out of Society Panel"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              onClick={handleManualSqlSync}
              disabled={isSyncingSql}
              className={`px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer border border-slate-700 ${isSyncingSql ? 'opacity-70' : ''}`}
              title="Sync latest records from SQL database"
            >
              <RotateCw className={`w-3.5 h-3.5 text-cyan-400 ${isSyncingSql ? 'animate-spin' : ''}`} />
              <span>{isSyncingSql ? 'Syncing...' : 'Sync SQL'}</span>
            </button>

            <button
              onClick={() => setIsAddResidentOpen(true)}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-blue-600/30 active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Enrol Flat</span>
            </button>

            <button
              onClick={() => setIsBulkInvoiceOpen(true)}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-emerald-600/30 active:scale-95"
            >
              <Receipt className="w-3.5 h-3.5" />
              <span>₹ Run Invoices</span>
            </button>

            <button
              onClick={() => setIsAddNoticeOpen(true)}
              className="px-3.5 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-purple-600/30 active:scale-95"
            >
              <Bell className="w-3.5 h-3.5" />
              <span>Circular</span>
            </button>

            <button
              onClick={() => {
                setSelectedShiftGuardId(guardRoster[0]?.id || 'guard_01');
                setIsAssignShiftOpen(true);
              }}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5 text-indigo-400" />
              <span>Roster</span>
            </button>

            <button
              onClick={() => setActiveTab('images')}
              className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-sm ${
                activeTab === 'images'
                  ? 'bg-amber-400 text-slate-950 font-black shadow-amber-400/30'
                  : 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Hero & Media</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modern High-End ERP Tab Navigation */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-200 no-scrollbar">
        {[
          { id: 'overview', label: 'Executive Dashboard', icon: BarChart3, count: undefined },
          { id: 'residents', label: 'Flats & Directory', icon: Users, count: residentsList.length },
          { id: 'billing', label: 'Dues & Maintenance Ledger', icon: Receipt, count: invoices.length },
          { id: 'complaints', label: 'Helpdesk & SLA Tickets', icon: AlertCircle, count: complaints.length },
          { id: 'notices', label: 'Circulars & Notices', icon: Bell, count: notices.length },
          { id: 'security', label: 'Gate Security & Access', icon: ShieldCheck, count: visitors.length },
          { id: 'drone', label: 'Autonomous Aerial Drone', icon: Radio, count: droneFlightLogs.length },
          { id: 'shifts', label: 'Guard Roster & GPS Shifts', icon: Calendar, count: guardRoster.length },
          { id: 'water', label: 'IoT Water Controls', icon: Droplet, count: tanks.length },
          { id: 'images', label: 'Society Photos & Hero CMS', icon: Camera, count: undefined },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                isActive
                  ? 'bg-slate-900 text-white shadow-md shadow-slate-900/20 ring-1 ring-slate-800'
                  : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200/80 shadow-2xs'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono tabular-nums font-bold ${
                  isActive ? 'bg-slate-800 text-cyan-300' : 'bg-slate-100 text-slate-600'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* =========================================================================
          TAB 1: EXECUTIVE OVERVIEW (ERP DASHBOARD)
          ========================================================================= */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Metrics Cards in Modern ERP Style */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Maintenance Invoicing & Collections */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Maintenance Collected</span>
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                  <Receipt className="w-4 h-4" />
                </div>
              </div>
              <div>
                <p className="text-3xl font-black text-slate-900 font-mono tabular-nums">
                  ₹{paidInvoicesAmt.toLocaleString()}
                </p>
                <div className="mt-2 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">Collection Efficiency</span>
                    <span className="font-mono font-bold text-emerald-600">
                      {totalInvoicesAmt > 0 ? Math.round((paidInvoicesAmt / totalInvoicesAmt) * 100) : 100}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500" 
                      style={{ width: `${totalInvoicesAmt > 0 ? Math.round((paidInvoicesAmt / totalInvoicesAmt) * 100) : 100}%` }}
                    />
                  </div>
                </div>
              </div>
              <p className="text-[11px] text-slate-500 pt-1 border-t border-slate-100 flex items-center justify-between">
                <span>Pending Arrears:</span>
                <span className="font-mono font-bold text-amber-600">₹{pendingInvoicesAmt.toLocaleString()}</span>
              </p>
            </div>

            {/* Card 2: Flats & Occupancy */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Flats & Directory</span>
                <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div>
                <p className="text-3xl font-black text-slate-900 font-mono tabular-nums">
                  {residentsList.length} <span className="text-sm font-semibold text-slate-500">Flats</span>
                </p>
                <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-600">
                  <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-semibold">
                    {residentsList.filter(r => r.residentType === 'Owner').length} Owners
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 font-semibold">
                    {residentsList.filter(r => r.residentType === 'Tenant').length} Tenants
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-slate-500 pt-1 border-t border-slate-100 flex items-center justify-between">
                <span>SQL Ledger Registry:</span>
                <span className="text-emerald-600 font-bold">100% Verified</span>
              </p>
            </div>

            {/* Card 3: Helpdesk & SLA */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Helpdesk & SLA</span>
                <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
                  <AlertCircle className="w-4 h-4" />
                </div>
              </div>
              <div>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-black text-slate-900 font-mono tabular-nums">
                    {openComplaintsCount + inProgressComplaintsCount}
                  </p>
                  <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
                    {openComplaintsCount} Pending
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-2">
                  Average SLA Resolution: <strong className="text-slate-800 font-mono">3.8 Hours</strong>
                </p>
              </div>
              <p className="text-[11px] text-slate-500 pt-1 border-t border-slate-100 flex items-center justify-between">
                <span>Resolved Tickets:</span>
                <span className="font-mono font-bold text-emerald-600">
                  {complaints.filter(c => c.status === 'Resolved').length} Closed
                </span>
              </p>
            </div>

            {/* Card 4: Water Operations */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Water Reservoir IoT</span>
                <div className="p-2 bg-cyan-50 text-cyan-600 rounded-xl">
                  <Droplet className="w-4 h-4" />
                </div>
              </div>
              <div>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-black text-cyan-700 font-mono tabular-nums">
                    {avgWaterLevel}%
                  </p>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                    Optimal
                  </span>
                </div>
                <div className="flex items-center justify-between mt-2 text-[11px]">
                  <span className="text-slate-500">Motor Relay:</span>
                  <button
                    onClick={() => togglePump('borewell_1', `${societyConfig.adminName} (ERP Dashboard)`)}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-colors cursor-pointer ${
                      pumps[0]?.state === 'RUNNING' 
                        ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' 
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    ● {pumps[0]?.state || 'RUNNING'} (Click to Toggle)
                  </button>
                </div>
              </div>
              <p className="text-[11px] text-slate-500 pt-1 border-t border-slate-100 flex items-center justify-between">
                <span>Ultrasonic Sensors:</span>
                <span className="text-emerald-600 font-bold">Online · MQTT 50ms</span>
              </p>
            </div>
          </div>

          {/* ERP Financial Reserves & Sinking Fund Status Strip */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white p-5 rounded-3xl border border-slate-800 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
                <CreditCard className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-amber-300 uppercase tracking-widest font-bold">
                  SOCIETY TREASURY & SINKING RESERVE
                </span>
                <h3 className="text-base font-black text-white">
                  Consolidated Association Reserve Capital
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 text-xs w-full md:w-auto">
              <div>
                <span className="text-slate-400 block text-[11px]">Sinking Fund</span>
                <span className="font-mono font-bold text-white text-base">₹14,25,000</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">DG Diesel Escrow</span>
                <span className="font-mono font-bold text-cyan-300 text-base">₹1,85,000</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Annual Audit Status</span>
                <span className="font-mono font-bold text-emerald-400 text-base">FY26 Compliant</span>
              </div>
            </div>
          </div>

          {/* Pending Invoices / Defaulters Alert Desk */}
          {invoices.filter(i => i.status !== 'Paid').length > 0 && (
            <div className="bg-amber-50/80 border border-amber-200 rounded-3xl p-5 shadow-xs space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                  <div>
                    <h3 className="text-sm font-black text-amber-950">
                      Pending Maintenance Dues Notice Desk
                    </h3>
                    <p className="text-xs text-amber-800">
                      {invoices.filter(i => i.status !== 'Paid').length} unit(s) currently overdue for {bulkPeriod}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('billing')}
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer self-start sm:self-auto"
                >
                  View Dues Ledger →
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                {invoices.filter(i => i.status !== 'Paid').map((inv) => (
                  <div key={inv.id} className="p-3 bg-white rounded-2xl border border-amber-200 flex items-center justify-between gap-3 text-xs">
                    <div>
                      <p className="font-black text-slate-900 font-mono">{inv.unit} · {inv.residentName}</p>
                      <p className="text-[11px] text-slate-500">Period: {inv.billingPeriod} • Amount: ₹{inv.totalAmount.toLocaleString()}</p>
                    </div>
                    <button
                      onClick={() => handleSendDefaulterReminder(inv)}
                      className="px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold rounded-xl text-[11px] transition-colors flex items-center gap-1 cursor-pointer shrink-0"
                      title="Send WhatsApp & SMS reminder"
                    >
                      <Send className="w-3 h-3 text-amber-700" />
                      <span>Remind</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions & Recent Activity Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Quick Actions Panel */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Zap className="w-4 h-4 text-blue-600" />
                <span>Society Committee Operations</span>
              </h2>
              <div className="space-y-2">
                <button
                  onClick={() => setIsBulkInvoiceOpen(true)}
                  className="w-full p-3 rounded-2xl bg-slate-50 hover:bg-emerald-50 border border-slate-200/80 hover:border-emerald-300 text-left transition-all flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                      ₹
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 group-hover:text-emerald-700">1-Click Bulk Monthly Billing</p>
                      <p className="text-[11px] text-slate-500">Auto-generate invoices for all units in SQL</p>
                    </div>
                  </div>
                  <Plus className="w-4 h-4 text-slate-400 group-hover:text-emerald-600" />
                </button>

                <button
                  onClick={() => setIsAddNoticeOpen(true)}
                  className="w-full p-3 rounded-2xl bg-slate-50 hover:bg-purple-50 border border-slate-200/80 hover:border-purple-300 text-left transition-all flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                      <Bell className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 group-hover:text-purple-700">Broadcast Circular Notice</p>
                      <p className="text-[11px] text-slate-500">Instant notification to resident app</p>
                    </div>
                  </div>
                  <Plus className="w-4 h-4 text-slate-400 group-hover:text-purple-600" />
                </button>

                <button
                  onClick={() => togglePump('borewell_1', `${societyConfig.adminName} (Committee Panel)`)}
                  className="w-full p-3 rounded-2xl bg-slate-50 hover:bg-cyan-50 border border-slate-200/80 hover:border-cyan-300 text-left transition-all flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center">
                      <Droplet className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 group-hover:text-cyan-700">Toggle Borewell Motor Relay</p>
                      <p className="text-[11px] text-slate-500">Current state: <span className="font-bold">{pumps[0]?.state}</span></p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                    pumps[0]?.state === 'RUNNING' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {pumps[0]?.state}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('images')}
                  className="w-full p-3 rounded-2xl bg-slate-50 hover:bg-amber-50 border border-slate-200/80 hover:border-amber-300 text-left transition-all flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                      <Camera className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 group-hover:text-amber-700">Edit Hero Image & Society Media</p>
                      <p className="text-[11px] text-slate-500">Upload 4K photos, change hero banner</p>
                    </div>
                  </div>
                  <Plus className="w-4 h-4 text-slate-400 group-hover:text-amber-600" />
                </button>
              </div>

              {/* Operational Status Badge */}
              <div className="p-3.5 bg-slate-900 rounded-2xl text-white text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-blue-400">Autonomous Operations Hub</span>
                  <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    LIVE & SYNCHRONIZED
                  </span>
                </div>
                <p className="text-[11px] text-slate-300">
                  All security gates, water telemetry, resident portals, and digital registries active.
                </p>
              </div>
            </div>

            {/* Pending Complaints Desk */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <span>Recent Helpdesk Tickets</span>
                </h2>
                <button
                  onClick={() => setActiveTab('complaints')}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
                >
                  View All ({complaints.length})
                </button>
              </div>

              <div className="space-y-2.5">
                {complaints.slice(0, 3).map((cmp) => (
                  <div 
                    key={cmp.id}
                    onClick={() => { setSelectedComplaint(cmp); setActiveTab('complaints'); }}
                    className="p-3 rounded-2xl border border-slate-200/80 hover:border-slate-300 hover:bg-slate-50 transition-colors cursor-pointer space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">{cmp.unit} - {cmp.title}</span>
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                        cmp.status === 'Open' ? 'bg-amber-100 text-amber-800' :
                        cmp.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                        'bg-emerald-100 text-emerald-800'
                      }`}>
                        {cmp.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-1">{cmp.description}</p>
                    <p className="text-[10px] text-slate-400">Category: {cmp.category} • Logged by {cmp.residentName}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Live Security & Gate Status */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Security Gate Status</span>
                </h2>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  {activeVisitorsInside} Inside Premises
                </span>
              </div>

              <div className="space-y-2.5">
                {visitors.slice(0, 3).map((vis) => (
                  <div key={vis.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-900">{vis.name}</p>
                      <p className="text-[11px] text-slate-500">Unit: {vis.unit} • {vis.purpose}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-bold text-slate-400">{vis.entryTime}</span>
                      <p className="text-[10px] font-extrabold text-emerald-600">{vis.entryGate}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: FLATS & RESIDENTS DIRECTORY
          ========================================================================= */}
      {activeTab === 'residents' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-black text-slate-900">Residential Units Directory</h2>
              <p className="text-xs text-slate-500">Manage flats, assigned parking slots, and resident profiles in SQL</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search unit, name or block..."
                  value={residentSearch}
                  onChange={(e) => setResidentSearch(e.target.value)}
                  className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600/30"
                />
              </div>
              <button
                onClick={() => setIsAddResidentOpen(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-sm shadow-blue-600/30"
              >
                <Plus className="w-4 h-4" />
                <span>Add Flat</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase font-mono text-[10px]">
                <tr>
                  <th className="py-3 px-4">Flat / Unit</th>
                  <th className="py-3 px-4">Block / Tower</th>
                  <th className="py-3 px-4">Resident Name</th>
                  <th className="py-3 px-4">Tenancy</th>
                  <th className="py-3 px-4">Phone & Email</th>
                  <th className="py-3 px-4">Parking Slot</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredResidents.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">{r.unit}</td>
                    <td className="py-3 px-4 text-slate-600">{r.block}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">{r.ownerName}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        r.residentType === 'Owner' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {r.residentType}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      <div>{r.phone}</div>
                      <div className="text-[10px] text-slate-400">{r.email}</div>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600">{r.parkingSlot}</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => deleteResident(r.id)}
                        className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
                        title="Delete flat from database"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: BILLING & MAINTENANCE LEDGER
          ========================================================================= */}
      {activeTab === 'billing' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-black text-slate-900">Maintenance Invoices & Utility Ledger</h2>
              <p className="text-xs text-slate-500">SQL database ledger with cryptographic receipt validation</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
                {(['ALL', 'Paid', 'Pending'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setInvoiceFilter(filter)}
                    className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                      invoiceFilter === filter ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setIsBulkInvoiceOpen(true)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-sm shadow-emerald-600/30"
              >
                <Plus className="w-4 h-4" />
                <span>Bulk Generate Dues</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase font-mono text-[10px]">
                <tr>
                  <th className="py-3 px-4">Invoice ID</th>
                  <th className="py-3 px-4">Unit & Resident</th>
                  <th className="py-3 px-4">Period</th>
                  <th className="py-3 px-4">Maintenance</th>
                  <th className="py-3 px-4">DG / Water</th>
                  <th className="py-3 px-4">Total Amount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Receipt Hash</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono text-slate-600">{inv.id}</td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-900 font-mono">{inv.unit}</span>
                      <p className="text-[10px] text-slate-400">{inv.residentName}</p>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{inv.billingPeriod}</td>
                    <td className="py-3 px-4 font-mono text-slate-700">₹{inv.societyMaintenance.amount.toLocaleString()}</td>
                    <td className="py-3 px-4 font-mono text-slate-500">
                      ₹{(inv.electricityMeter.totalAmount + inv.waterUtility.totalAmount).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      ₹{inv.totalAmount.toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                        inv.status === 'Paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-[10px] text-slate-400">
                      {inv.receiptHash?.slice(0, 14)}...
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 4: HELPDESK TICKETS & COMPLAINTS
          ========================================================================= */}
      {activeTab === 'complaints' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-black text-slate-900">Complaints & Helpdesk Tickets</h2>
              <p className="text-xs text-slate-500">Assigned staff, status transitions, and resolution tracking in SQL</p>
            </div>
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
              {(['ALL', 'Open', 'In Progress', 'Resolved'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setComplaintFilter(filter)}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    complaintFilter === filter ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredComplaints.map((cmp) => (
              <div 
                key={cmp.id}
                className="p-5 rounded-3xl border border-slate-200 hover:border-blue-300 bg-white shadow-xs space-y-3 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                    {cmp.unit}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                    cmp.status === 'Open' ? 'bg-amber-100 text-amber-800' :
                    cmp.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                    'bg-emerald-100 text-emerald-800'
                  }`}>
                    {cmp.status}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900">{cmp.title}</h3>
                  <p className="text-xs text-slate-500 mt-1">{cmp.description}</p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Category: {cmp.category}</span>
                  <span>{cmp.createdAt}</span>
                </div>

                {cmp.assignedTo && (
                  <div className="p-2 bg-slate-50 rounded-xl text-[11px] text-slate-600 flex items-center justify-between">
                    <span>Staff: <strong className="text-slate-800">{cmp.assignedTo}</strong></span>
                  </div>
                )}

                {cmp.resolutionNotes && (
                  <div className="p-2 bg-emerald-50 rounded-xl text-[11px] text-emerald-800">
                    <strong>Resolution:</strong> {cmp.resolutionNotes}
                  </div>
                )}

                <div className="flex items-center gap-2 pt-1">
                  {cmp.status !== 'In Progress' && cmp.status !== 'Resolved' && (
                    <button
                      onClick={() => updateComplaintStatus(cmp.id, 'In Progress', 'Assigned to maintenance technician', 'Suresh Plumber')}
                      className="flex-1 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                    >
                      Assign Staff
                    </button>
                  )}
                  {cmp.status !== 'Resolved' && (
                    <button
                      onClick={() => updateComplaintStatus(cmp.id, 'Resolved', 'Issue repaired and verified with resident OTP', cmp.assignedTo || 'Staff')}
                      className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
                    >
                      Mark Resolved
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 5: NOTICE BOARD & CIRCULARS
          ========================================================================= */}
      {activeTab === 'notices' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-black text-slate-900">Society Circulars & Notice Board</h2>
              <p className="text-xs text-slate-500">Official broadcasts published directly to all resident mobile apps</p>
            </div>
            <button
              onClick={() => setIsAddNoticeOpen(true)}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-sm shadow-purple-600/30"
            >
              <Plus className="w-4 h-4" />
              <span>Publish Circular</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {notices.map((n) => (
              <div key={n.id} className="p-5 rounded-3xl border border-slate-200 bg-white shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                    n.priority === 'Urgent' ? 'bg-red-100 text-red-800' :
                    n.priority === 'Important' ? 'bg-amber-100 text-amber-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {n.priority} • {n.category}
                  </span>
                  <button
                    onClick={() => deleteNotice(n.id)}
                    className="p-1 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <h3 className="text-base font-bold text-slate-900">{n.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{n.content}</p>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Posted by: <strong>{n.postedBy}</strong></span>
                  <span>Valid until: {n.validUntil}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 6: SECURITY, GUARD GEOFENCING & BIOMETRIC FACE VERIFICATION
          ========================================================================= */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          {/* Quick Shift Management Banner */}
          <div className="bg-gradient-to-r from-indigo-600 to-blue-700 rounded-3xl p-5 text-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-indigo-500/30">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-extrabold">Guard Shift Management & Duty Rotations</h3>
                  <span className="text-[10px] font-mono font-bold bg-white/20 text-white px-2 py-0.5 rounded-full border border-white/30">
                    AUTO-SYNC
                  </span>
                </div>
                <p className="text-xs text-indigo-100 mt-0.5">
                  Assign shift rotations across morning, evening, and night duty cycles. Status changes automatically update the Guard App to On-Duty or Off-Duty.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
              <button
                onClick={() => setActiveTab('shifts')}
                className="px-4 py-2 bg-white hover:bg-indigo-50 text-indigo-700 font-extrabold text-xs rounded-xl shadow-sm transition-all cursor-pointer"
              >
                Open Shift Module →
              </button>
            </div>
          </div>

          {/* Section 1: Guard Duty Roster & Live Geofence Radar */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Live Security Surveillance</span>
                <h2 className="text-lg font-black text-slate-900 mt-0.5">Guard Roster, GPS Geofence Radar & Shift Tracking</h2>
                <p className="text-xs text-slate-500">
                  Track whether guards are on/off duty, inside the barrier geofence perimeter, and verified via hourly facial biometric checks.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('shifts')}
                  className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Assign Shift</span>
                </button>
                <span className="text-xs font-mono font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
                  {guardRoster.filter(g => g.isOnline).length} / {guardRoster.length} Guards On Duty
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {guardRoster.map((guard) => {
                const isCurrentGate1 = guard.id === guardProfile.id;
                const isWithin = isCurrentGate1 ? guardGeofence.isWithinGeofence : guard.isWithinGeofence;
                const dist = isCurrentGate1 ? guardGeofence.distanceMeters : guard.distanceFromPostMeters;

                return (
                  <div key={guard.id} className="p-5 rounded-3xl border border-slate-200 bg-slate-50/70 space-y-4 hover:border-slate-300 transition-colors shadow-2xs">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img
                            src={guard.masterPhotoUrl}
                            alt={guard.name}
                            className="w-13 h-13 rounded-2xl object-cover border-2 border-slate-200 shadow-xs"
                          />
                          <span
                            className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white ${
                              guard.isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
                            }`}
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-extrabold text-slate-900 text-sm">{guard.name}</h4>
                            <span className="text-[10px] font-mono font-bold bg-white text-slate-700 px-1.5 py-0.5 rounded border border-slate-200">
                              {guard.badgeNumber}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 font-mono mt-0.5">{guard.assignedGate}</p>
                          <p className="text-[10px] text-slate-400 font-mono">Shift: {guard.dutyShift}</p>
                        </div>
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                          guard.isOnline
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                            : 'bg-slate-200 text-slate-700 border-slate-300'
                        }`}
                      >
                        {guard.isOnline ? 'ON DUTY (ONLINE)' : 'OFF DUTY'}
                      </span>
                    </div>

                    {/* Geofence & Facial Verification Status Badges */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-3 bg-white rounded-2xl border border-slate-200">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">
                          GPS Geofence
                        </span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className={`w-2 h-2 rounded-full ${isWithin ? 'bg-emerald-500' : 'bg-rose-500 animate-ping'}`} />
                          <span className={`font-bold text-[11px] ${isWithin ? 'text-emerald-700' : 'text-rose-700'}`}>
                            {isWithin ? `Inside Perimeter (±${dist}m)` : `BREACH (+${dist}m away)`}
                          </span>
                        </div>
                      </div>

                      <div className="p-3 bg-white rounded-2xl border border-slate-200">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">
                          Hourly Face Match
                        </span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span
                            className={`font-bold text-[11px] ${
                              guard.faceVerificationStatus === 'VERIFIED'
                                ? 'text-emerald-700'
                                : 'text-rose-700 font-black'
                            }`}
                          >
                            {guard.faceVerificationStatus === 'VERIFIED'
                              ? `Verified (${guard.lastVerificationConfidence || 96.4}%)`
                              : 'UNVERIFIED ALERT'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200/60">
                      <span>Last Ping: {guard.lastGpsPing || 'Just now'} · Battery: {guard.batteryLevel}%</span>
                      <button
                        onClick={() => {
                          setTargetGuardId(guard.id);
                          setNewMasterPhotoInput(guard.masterPhotoUrl);
                          setIsMasterPhotoModalOpen(true);
                        }}
                        className="text-blue-600 hover:text-blue-800 font-bold cursor-pointer transition-colors"
                      >
                        Update Master Photo →
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 2: Hourly AI Face Verification Logs & Master Reference */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">Biometric Vigilance Audit</span>
                <h3 className="text-lg font-black text-slate-900 mt-0.5">Hourly Facial Feature Verification Logs</h3>
                <p className="text-xs text-slate-500">
                  AI compares bone structure, eye distance, and nasal-chin geometry. Uniform, dress, and hair changes are ignored.
                </p>
              </div>

              <span className="text-xs font-mono text-purple-700 bg-purple-50 px-2.5 py-1 rounded-xl border border-purple-200 font-bold">
                100% Biometric AI Audit
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 text-[11px]">
                    <th className="py-2.5">Guard</th>
                    <th className="py-2.5">Captured Selfie</th>
                    <th className="py-2.5">Master Reference</th>
                    <th className="py-2.5">Biometric Match</th>
                    <th className="py-2.5">Status</th>
                    <th className="py-2.5">AI Landmark Analysis Notes</th>
                    <th className="py-2.5 text-right">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {faceVerificationLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 font-bold text-slate-900">{log.guardName}</td>
                      <td className="py-3">
                        <img
                          src={log.capturedPhotoUrl}
                          alt="Captured"
                          className="w-10 h-10 rounded-xl object-cover border border-slate-300"
                        />
                      </td>
                      <td className="py-3">
                        <img
                          src={log.masterPhotoUrl}
                          alt="Master"
                          className="w-10 h-10 rounded-xl object-cover border border-blue-400"
                        />
                      </td>
                      <td className="py-3 font-mono font-extrabold text-sm">
                        <span className={log.matchScore >= 80 ? 'text-emerald-700' : 'text-rose-700'}>
                          {log.matchScore}%
                        </span>
                      </td>
                      <td className="py-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            log.status === 'PASSED'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : 'bg-rose-100 text-rose-800 border border-rose-300'
                          }`}
                        >
                          {log.status}
                        </span>
                      </td>
                      <td className="py-3 text-[11px] text-slate-600 max-w-xs">{log.verificationNotes}</td>
                      <td className="py-3 text-right font-mono text-slate-500 text-[11px]">{log.verifiedAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 3: Visitors Inside & Checkpoints */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Active Visitors */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-3">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                Visitors Currently Inside Premises ({visitors.filter(v => v.status === 'Inside').length})
              </h3>
              <div className="space-y-2">
                {visitors.filter(v => v.status === 'Inside').map((v) => (
                  <div key={v.id} className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-900">{v.name}</p>
                      <p className="text-[11px] text-slate-500">Unit: {v.unit} • Purpose: {v.purpose}</p>
                      {v.vehicleNumber && <p className="text-[10px] font-mono text-slate-400">Vehicle: {v.vehicleNumber}</p>}
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                        {v.status}
                      </span>
                      <p className="text-[11px] text-slate-500 mt-1">{v.entryGate} ({v.entryTime})</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Guard NFC / QR Checkpoints */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-3">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                Guard NFC / QR Checkpoints Patrols
              </h3>
              <div className="space-y-2">
                {[
                  { name: 'Main Gate 01 Barrier', location: 'Gatehouse Entry', time: '03:45 AM', status: 'cleared' },
                  { name: 'Tower A Sub-Basement B1', location: 'Elevator Core A', time: '03:52 AM', status: 'cleared' },
                  { name: 'Perimeter Wall South-East', location: 'Watch Pillar #4', time: 'Bypassed', status: 'pending' },
                  { name: 'Clubhouse Pool Deck', location: 'Pump Filtration Room', time: '04:12 AM', status: 'cleared' },
                  { name: 'STP Plant & DG Bay', location: 'Heavy Utility Room #2', time: '04:20 AM', status: 'cleared' },
                ].map((cp, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl border border-slate-200 bg-white flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-900">{cp.name}</p>
                      <p className="text-[11px] text-slate-500">{cp.location}</p>
                    </div>
                    <div className="text-right">
                      <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                        cp.status === 'cleared' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {cp.status}
                      </span>
                      <p className="text-[10px] text-slate-400 mt-0.5">{cp.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section 4: Real-time Campus Geofence Radar */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-slate-900">Perimeter Geofence Radar & Campus GPS Map</h3>
                <p className="text-xs text-slate-500">Live compound tracking of on-duty guards relative to barrier perimeter (±250m geofence)</p>
              </div>
              <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-0.5 rounded-full">
                LIVE GPS RADAR
              </span>
            </div>
            <GuardGeofenceMap interactive={false} showOtherGuards={true} />
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB: GUARD SHIFT MANAGEMENT & DUTY ROTATIONS MODULE
          ========================================================================= */}
      {activeTab === 'shifts' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Module Header Card */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Guard Operations & Shifts</span>
                <span className="text-[10px] font-mono font-bold bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full border border-indigo-200">
                  AUTO-SYNC WITH GUARD APP
                </span>
              </div>
              <h2 className="text-xl font-black text-slate-900 mt-1">Guard Duty Shift Management & Rotations</h2>
              <p className="text-xs text-slate-500 mt-0.5 max-w-2xl">
                Assign duty rotations across morning, evening, and night cycles. When an admin assigns a shift or rotates duty, the Guard Terminal app automatically updates to <strong>'On-Duty'</strong> or <strong>'Off-Duty'</strong> with real-time GPS post alignment.
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-2.5 flex-wrap self-start md:self-auto shrink-0">
              <button
                onClick={() => {
                  setSelectedShiftGuardId(guardRoster[0]?.id || 'guard_01');
                  setIsAssignShiftOpen(true);
                }}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-sm transition-all flex items-center gap-2 cursor-pointer shadow-indigo-600/20 active:scale-95"
              >
                <Plus className="w-4 h-4" />
                Assign Shift Rotation
              </button>

              <button
                onClick={handleRotateAllShifts}
                disabled={isRotatingShifts}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-extrabold text-xs rounded-xl shadow-sm transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 active:scale-95"
                title="Rotate all guards to their next duty shift slot and update guard app status"
              >
                <RotateCw className={`w-4 h-4 text-emerald-400 ${isRotatingShifts ? 'animate-spin' : ''}`} />
                {isRotatingShifts ? 'Rotating Shifts...' : '1-Tap Cycle All Rotations'}
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 text-xs">
                <span className="font-bold">Total Security Personnel</span>
                <Users className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-black text-slate-900 font-mono">{guardRoster.length}</span>
                <span className="text-[11px] text-slate-500">Enrolled Guards</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1 font-mono">3 Core Gates + Perimeter Patrol</p>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 text-xs">
                <span className="font-bold">Currently On-Duty (Active)</span>
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-black text-emerald-600 font-mono">
                  {guardRoster.filter(g => g.isOnline).length}
                </span>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                  Guard App Online
                </span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1 font-mono">GPS Ping & Radar Active</p>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 text-xs">
                <span className="font-bold">Off-Duty / Rest Rotation</span>
                <Clock className="w-4 h-4 text-slate-600" />
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-black text-slate-700 font-mono">
                  {guardRoster.filter(g => !g.isOnline).length}
                </span>
                <span className="text-[11px] text-slate-500">Standby / Relieved</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1 font-mono">Scheduled for next cycle</p>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 text-xs">
                <span className="font-bold">Automated Guard Duty Sync</span>
                <Zap className="w-4 h-4 text-amber-500" />
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-sm font-black text-indigo-700 font-mono">AUTO-DUTY SYNC</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                  ACTIVE
                </span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1 font-mono">Synchronized with Guard Terminal</p>
            </div>
          </div>

          {/* Section 1: Guard Duty Roster & Active Shift Postings */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Current Guard Shift Assignments & Duty Status</h3>
                <p className="text-xs text-slate-500">
                  Each guard's live duty shift, assigned post, and real-time app connection status. Use quick toggles to change duty status.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleRotateAllShifts}
                  disabled={isRotatingShifts}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCw className={`w-3.5 h-3.5 ${isRotatingShifts ? 'animate-spin' : ''}`} />
                  <span>Cycle Rotations</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-2">
              {guardRoster.map((guard) => {
                const isCurrentGate1 = guard.id === guardProfile.id;
                const isWithin = isCurrentGate1 ? guardGeofence.isWithinGeofence : guard.isWithinGeofence;
                const dist = isCurrentGate1 ? guardGeofence.distanceMeters : guard.distanceFromPostMeters;

                return (
                  <div 
                    key={guard.id} 
                    className={`p-5 rounded-3xl border transition-all ${
                      guard.isOnline 
                        ? 'bg-gradient-to-br from-white to-emerald-50/40 border-emerald-200 shadow-xs' 
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img
                            src={guard.masterPhotoUrl}
                            alt={guard.name}
                            className="w-14 h-14 rounded-2xl object-cover border-2 border-slate-200 shadow-xs"
                          />
                          <span
                            className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center ${
                              guard.isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
                            }`}
                          />
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-extrabold text-slate-900 text-base">{guard.name}</h4>
                            <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                              {guard.badgeNumber}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 font-semibold mt-0.5 flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-blue-600" />
                            <span>{guard.assignedGate}</span>
                          </p>
                          <p className="text-[11px] text-indigo-700 font-mono mt-0.5 font-bold">
                            Shift: {guard.dutyShift}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span
                          className={`inline-block text-[10px] font-black px-2.5 py-1 rounded-full border font-mono ${
                            guard.isOnline
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-300 shadow-xs'
                              : 'bg-slate-100 text-slate-600 border-slate-200'
                          }`}
                        >
                          {guard.isOnline ? '● ON-DUTY (ONLINE)' : '○ OFF-DUTY'}
                        </span>
                      </div>
                    </div>

                    {/* Geofence & Duty Telemetry */}
                    <div className="grid grid-cols-2 gap-2 mt-4 text-xs font-mono">
                      <div className="p-2.5 bg-slate-50 rounded-2xl border border-slate-200/80">
                        <span className="text-[9px] uppercase font-bold text-slate-400 block">
                          Perimeter Geofence
                        </span>
                        <span className={`text-[11px] font-extrabold flex items-center gap-1 mt-0.5 ${isWithin ? 'text-emerald-700' : 'text-rose-700'}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${isWithin ? 'bg-emerald-500' : 'bg-rose-500 animate-ping'}`} />
                          {isWithin ? `Inside (±${dist}m)` : `Breach (+${dist}m)`}
                        </span>
                      </div>

                      <div className="p-2.5 bg-slate-50 rounded-2xl border border-slate-200/80">
                        <span className="text-[9px] uppercase font-bold text-slate-400 block">
                          Guard App Status
                        </span>
                        <span className={`text-[11px] font-extrabold ${guard.isOnline ? 'text-emerald-700' : 'text-slate-500'}`}>
                          {guard.isOnline ? 'Active on Terminal' : 'Standby / Logged Out'}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons: Quick Status Toggle & Reassign Shift */}
                    <div className="flex items-center justify-between gap-2 pt-3 mt-3 border-t border-slate-100">
                      <button
                        onClick={() => handleQuickDutyToggle(guard)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                          guard.isOnline
                            ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                        }`}
                        title="Toggles On-Duty or Off-Duty for the guard app"
                      >
                        <Power className="w-3.5 h-3.5" />
                        <span>{guard.isOnline ? 'Mark Off-Duty' : 'Set On-Duty (Online)'}</span>
                      </button>

                      <button
                        onClick={() => handleOpenAssignModalForGuard(guard)}
                        className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <ArrowRightLeft className="w-3 h-3 text-indigo-600" />
                        <span>Reassign Shift</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 2: Shift Assignment Schedule & Rotation Ledger */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Duty Rotation & Shift Assignment Ledger</h3>
                <p className="text-xs text-slate-500">
                  SQL-persisted record of shift rotations, timings, designated security posts, and guard app synchronization status.
                </p>
              </div>

              <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-xl border border-indigo-200">
                {guardShifts.length} Records
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 text-[11px]">
                    <th className="py-2.5">Guard Personnel</th>
                    <th className="py-2.5">Shift Type & Timing</th>
                    <th className="py-2.5">Assigned Post</th>
                    <th className="py-2.5">Effective Date</th>
                    <th className="py-2.5">Duty Status</th>
                    <th className="py-2.5">Guard App Sync</th>
                    <th className="py-2.5">Assigned By</th>
                    <th className="py-2.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {guardShifts.map((shift) => (
                    <tr key={shift.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3">
                        <div className="font-bold text-slate-900">{shift.guardName}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{shift.badgeNumber}</div>
                      </td>
                      <td className="py-3">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          shift.shiftType === 'Morning' ? 'bg-amber-100 text-amber-800' :
                          shift.shiftType === 'Evening' ? 'bg-blue-100 text-blue-800' :
                          shift.shiftType === 'Night' ? 'bg-purple-100 text-purple-800' :
                          'bg-slate-100 text-slate-800'
                        }`}>
                          {shift.shiftType}
                        </span>
                        <div className="text-[11px] text-slate-600 font-mono mt-0.5">{shift.shiftTiming}</div>
                      </td>
                      <td className="py-3 font-semibold text-slate-800">{shift.assignedPost}</td>
                      <td className="py-3 font-mono text-slate-600">{shift.effectiveDate}</td>
                      <td className="py-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                          shift.status === 'ACTIVE_ON_DUTY' 
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                            : shift.status === 'SCHEDULED'
                            ? 'bg-blue-100 text-blue-800 border border-blue-200'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}>
                          {shift.status === 'ACTIVE_ON_DUTY' ? '● ON-DUTY' : shift.status === 'SCHEDULED' ? 'SCHEDULED' : 'OFF-DUTY'}
                        </span>
                      </td>
                      <td className="py-3">
                        <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1 font-mono">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Synced</span>
                        </span>
                      </td>
                      <td className="py-3 text-slate-600 text-[11px]">
                        <div>{shift.assignedBy}</div>
                        {shift.notes && <div className="text-[10px] text-slate-400 italic max-w-xs">{shift.notes}</div>}
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => {
                            const g = guardRoster.find(gr => gr.id === shift.guardId);
                            if (g) handleOpenAssignModalForGuard(g);
                          }}
                          className="text-indigo-600 hover:text-indigo-800 font-bold text-xs cursor-pointer"
                        >
                          Modify →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 3: Campus Geofence Radar & Guard Post Mapping */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Perimeter Guard Posts & Campus GPS Radar</h3>
                <p className="text-xs text-slate-500">Live GPS tracking of guard personnel relative to compound boundaries and designated post gates</p>
              </div>
              <span className="text-[10px] font-mono font-bold bg-blue-100 text-blue-800 border border-blue-200 px-2.5 py-0.5 rounded-full">
                RADAR VISUALIZATION
              </span>
            </div>
            <GuardGeofenceMap interactive={true} showOtherGuards={true} />
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 7: WATER IOT CONTROLS
          ========================================================================= */}
      {activeTab === 'water' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-6">
          <div>
            <h2 className="text-lg font-black text-slate-900">IoT Water Reservoirs & Pump Relays</h2>
            <p className="text-xs text-slate-500">Real-time ultrasonic sensor levels and automated pump shutoff relays</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {tanks.map((tank) => (
              <div key={tank.id} className="p-5 rounded-3xl border border-slate-200 bg-slate-50 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-900">{tank.name}</h3>
                  <span className="text-[10px] font-extrabold text-cyan-800 bg-cyan-100 px-2 py-0.5 rounded-full">
                    {tank.sensorType}
                  </span>
                </div>
                <div className="flex items-baseline justify-between">
                  <p className="text-3xl font-black text-cyan-700 font-mono">{tank.levelPercentage}%</p>
                  <span className="text-xs font-mono text-slate-500">{tank.currentLitres.toLocaleString()} / {tank.capacityLitres.toLocaleString()} L</span>
                </div>
                <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-cyan-500 rounded-full transition-all duration-500" 
                    style={{ width: `${tank.levelPercentage}%` }} 
                  />
                </div>
                <p className="text-[10px] text-slate-400">{tank.location}</p>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-4">
            {pumps.map((pump) => (
              <div key={pump.id} className="p-5 rounded-3xl border border-slate-200 bg-white shadow-xs flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{pump.name}</h4>
                  <p className="text-[11px] text-slate-500">{pump.type}</p>
                  <p className="text-[10px] font-mono text-slate-400 mt-1">Flow: {pump.flowRateLpm} LPM • {pump.powerKw} kW</p>
                </div>
                <div className="text-right space-y-2">
                  <span className={`inline-block text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                    pump.state === 'RUNNING' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {pump.state}
                  </span>
                  <div>
                    <button
                      onClick={() => togglePump(pump.id as any, `${societyConfig.adminName} (Panel)`)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                        pump.state === 'RUNNING'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                          : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs'
                      }`}
                    >
                      {pump.state === 'RUNNING' ? 'Turn Off' : 'Turn On'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 9: AUTONOMOUS DRONE COMMAND & AERIAL AUDIT
          ========================================================================= */}
      {activeTab === 'drone' && (
        <DroneSurveillanceView />
      )}

      {/* =========================================================================
          TAB 10: SOCIETY IMAGE MANAGEMENT & MEDIA DIRECTORY
          ========================================================================= */}
      {activeTab === 'images' && (
        <div className="bg-white rounded-3xl p-2 sm:p-6 border border-slate-200">
          <ImageManagementSection isModal={false} />
        </div>
      )}

      {/* =========================================================================
          MODAL: ADD NEW RESIDENT
          ========================================================================= */}
      {isAddResidentOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-slate-900">Enrol New Resident Flat</h3>
              <button 
                onClick={() => setIsAddResidentOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateResident} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Unit / Flat No.*</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. C-304"
                    value={newUnit}
                    onChange={(e) => setNewUnit(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600/30"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Block / Tower</label>
                  <input
                    type="text"
                    value={newBlock}
                    onChange={(e) => setNewBlock(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600/30"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Owner / Resident Name*</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ananya Roy"
                  value={newOwnerName}
                  onChange={(e) => setNewOwnerName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600/30"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Tenancy Type</label>
                  <select
                    value={newResidentType}
                    onChange={(e) => setNewResidentType(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600/30"
                  >
                    <option value="Owner">Owner</option>
                    <option value="Tenant">Tenant</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Parking Slot</label>
                  <input
                    type="text"
                    placeholder="e.g. B1-P18"
                    value={newParkingSlot}
                    onChange={(e) => setNewParkingSlot(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600/30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Phone</label>
                  <input
                    type="text"
                    placeholder="+91 98..."
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600/30"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="name@mail.com"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600/30"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="hasPets"
                  checked={newHasPets}
                  onChange={(e) => setNewHasPets(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="hasPets" className="text-xs text-slate-600 font-medium cursor-pointer">
                  Has registered pets
                </label>
              </div>

              <div className="flex items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddResidentOpen(false)}
                  className="flex-1 py-2.5 border border-slate-200 text-slate-600 text-xs font-bold rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-blue-600/30 cursor-pointer"
                >
                  Save in SQL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: BULK INVOICE GENERATION
          ========================================================================= */}
      {isBulkInvoiceOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  ₹
                </div>
                <h3 className="text-base font-black text-slate-900">Bulk Monthly Maintenance Billing</h3>
              </div>
              <button 
                onClick={() => setIsBulkInvoiceOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              This will insert new utility invoices for all <strong>{residentsList.length} registered flats</strong> in the society database ledger.
            </p>

            <form onSubmit={handleBulkGenerate} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Billing Period</label>
                  <input
                    type="text"
                    required
                    value={bulkPeriod}
                    onChange={(e) => setBulkPeriod(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-600/30"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Due Date</label>
                  <input
                    type="date"
                    required
                    value={bulkDueDate}
                    onChange={(e) => setBulkDueDate(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-600/30"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Society Maintenance (₹)</label>
                <input
                  type="number"
                  required
                  value={bulkMaintAmt}
                  onChange={(e) => setBulkMaintAmt(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold font-mono focus:outline-none focus:ring-2 focus:ring-emerald-600/30"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">DG Power Baseline (₹)</label>
                  <input
                    type="number"
                    value={bulkElecAmt}
                    onChange={(e) => setBulkElecAmt(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold font-mono"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Water Utility (₹)</label>
                  <input
                    type="number"
                    value={bulkWaterAmt}
                    onChange={(e) => setBulkWaterAmt(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold font-mono"
                  />
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between text-xs">
                <span className="font-bold text-slate-600">Total per flat:</span>
                <span className="font-mono font-black text-emerald-700 text-sm">
                  ₹{(bulkMaintAmt + bulkElecAmt + bulkWaterAmt).toLocaleString()}
                </span>
              </div>

              <div className="flex items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsBulkInvoiceOpen(false)}
                  className="flex-1 py-2.5 border border-slate-200 text-slate-600 text-xs font-bold rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-emerald-600/30 cursor-pointer disabled:opacity-50"
                >
                  {isGenerating ? 'Generating SQL...' : 'Run SQL Generation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: ADD NEW NOTICE
          ========================================================================= */}
      {isAddNoticeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-slate-900">Broadcast Society Notice</h3>
              <button 
                onClick={() => setIsAddNoticeOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNotice} className="space-y-4">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Notice Title*</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lift AMC scheduled for Monday"
                  value={noticeTitle}
                  onChange={(e) => setNoticeTitle(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-600/30"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Category</label>
                  <select
                    value={noticeCategory}
                    onChange={(e) => setNoticeCategory(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-600/30"
                  >
                    <option value="General">General</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Event">Event</option>
                    <option value="Meeting">Meeting</option>
                    <option value="Emergency">Emergency</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Priority</label>
                  <select
                    value={noticePriority}
                    onChange={(e) => setNoticePriority(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-600/30"
                  >
                    <option value="Normal">Normal</option>
                    <option value="Important">Important</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Notice Content*</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Details of the announcement..."
                  value={noticeContent}
                  onChange={(e) => setNoticeContent(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-600/30"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Valid Until</label>
                <input
                  type="date"
                  value={noticeValidUntil}
                  onChange={(e) => setNoticeValidUntil(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-600/30"
                />
              </div>

              <div className="flex items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddNoticeOpen(false)}
                  className="flex-1 py-2.5 border border-slate-200 text-slate-600 text-xs font-bold rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-purple-600/30 cursor-pointer"
                >
                  Publish Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: ASSIGN GUARD DUTY ROTATION & SHIFT
          ========================================================================= */}
      {isAssignShiftOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Assign Guard Duty Rotation</h3>
                  <p className="text-xs text-slate-500">Configures rotation and syncs duty status to the guard app</p>
                </div>
              </div>
              <button 
                onClick={() => setIsAssignShiftOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAssignShift} className="space-y-4">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Select Guard Personnel*</label>
                <select
                  value={selectedShiftGuardId}
                  onChange={(e) => {
                    setSelectedShiftGuardId(e.target.value);
                    const found = guardRoster.find(g => g.id === e.target.value);
                    if (found) {
                      setSelectedAssignedPost(found.assignedGate);
                    }
                  }}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-600/30"
                >
                  {guardRoster.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name} ({g.badgeNumber}) — Current: {g.assignedGate}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Shift Type</label>
                  <select
                    value={selectedShiftType}
                    onChange={(e) => {
                      const val = e.target.value as any;
                      setSelectedShiftType(val);
                      if (val === 'Morning') setSelectedShiftTiming('06:00 - 14:00');
                      else if (val === 'Evening') setSelectedShiftTiming('14:00 - 22:00');
                      else if (val === 'Night') setSelectedShiftTiming('22:00 - 06:00');
                      else setSelectedShiftTiming('09:00 - 18:00');
                    }}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-600/30"
                  >
                    <option value="Morning">Morning (06:00 - 14:00)</option>
                    <option value="Evening">Evening (14:00 - 22:00)</option>
                    <option value="Night">Night (22:00 - 06:00)</option>
                    <option value="Relief">Relief (09:00 - 18:00)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Shift Hours</label>
                  <input
                    type="text"
                    value={selectedShiftTiming}
                    onChange={(e) => setSelectedShiftTiming(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-600/30"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Assigned Security Post*</label>
                <select
                  value={selectedAssignedPost}
                  onChange={(e) => setSelectedAssignedPost(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-600/30"
                >
                  <option value="Gate 01 - Main Entrance Barrier">Gate 01 - Main Entrance Barrier</option>
                  <option value="Gate 02 - Service & Delivery Gate">Gate 02 - Service & Delivery Gate</option>
                  <option value="Perimeter Wall & STP Patrol">Perimeter Wall & STP Patrol</option>
                  <option value="Clubhouse & Visitor Pavilion">Clubhouse & Visitor Pavilion</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Duty Status (Syncs to Guard App)</label>
                  <select
                    value={selectedDutyStatus}
                    onChange={(e) => setSelectedDutyStatus(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-600/30"
                  >
                    <option value="ACTIVE_ON_DUTY">ACTIVE (Immediately On-Duty / Online)</option>
                    <option value="SCHEDULED">SCHEDULED (Upcoming / Off-Duty)</option>
                    <option value="OFF_DUTY_REST">OFF-DUTY (Standby / Offline)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Effective Date</label>
                  <input
                    type="date"
                    value={selectedEffectiveDate}
                    onChange={(e) => setSelectedEffectiveDate(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-600/30"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Shift Handover / Vigilance Notes</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Maintain strict vehicle barrier checks. Handover keys to relieving guard."
                  value={selectedShiftNotes}
                  onChange={(e) => setSelectedShiftNotes(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-600/30"
                />
              </div>

              <div className="p-3 bg-indigo-50/80 rounded-2xl border border-indigo-200/80 text-[11px] text-indigo-900 flex items-start gap-2">
                <Zap className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Real-Time App Sync:</strong> Setting status to <em>ACTIVE</em> will automatically turn the guard's mobile terminal to <strong>ON-DUTY (Online)</strong> and update their assigned post coordinates.
                </span>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAssignShiftOpen(false)}
                  className="flex-1 py-2.5 border border-slate-200 text-slate-600 text-xs font-bold rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingShift}
                  className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-indigo-600/30 cursor-pointer disabled:opacity-50"
                >
                  {isSubmittingShift ? 'Saving to SQL...' : 'Assign & Sync Duty Status'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
