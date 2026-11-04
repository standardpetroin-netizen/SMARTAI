import React, { useState } from 'react';
import { 
  ArrowRight, 
  ArrowLeft, 
  Key, 
  Upload, 
  Users, 
  ShieldCheck, 
  CheckCircle, 
  FileSpreadsheet, 
  Plus, 
  Eye, 
  EyeOff,
  UserCheck
} from 'lucide-react';
import { SocietyConfig, ResidentRecord } from '../../types';
import { INITIAL_RESIDENTS, SAMPLE_CSV_TEMPLATE } from '../../utils/sampleData';

interface StepCommitteeRosterProps {
  config: SocietyConfig;
  onChange: (updated: Partial<SocietyConfig>) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const StepCommitteeRoster: React.FC<StepCommitteeRosterProps> = ({
  config,
  onChange,
  onNext,
  onPrev,
}) => {
  const [residents, setResidents] = useState<ResidentRecord[]>(INITIAL_RESIDENTS);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [csvUploadSuccess, setCsvUploadSuccess] = useState<string | null>(null);

  // New staff member state
  const [staffList, setStaffList] = useState<Array<{ name: string; role: string; badgeId: string; shift: string }>>([
    { name: 'Ram Singh', role: 'Perimeter Night Patrol Guard', badgeId: 'G-102', shift: 'Night (20:00 - 06:00)' },
    { name: 'Deepesh Das', role: 'Security Supervisor (Gate 1)', badgeId: 'G-108', shift: 'Rotational (24h SLA)' },
    { name: 'Santosh Kumar', role: 'Lead Housekeeping Auditor', badgeId: 'HK-04', shift: 'Morning (06:00 - 14:00)' },
  ]);

  const [newStaffName, setNewStaffName] = useState<string>('');
  const [newStaffRole, setNewStaffRole] = useState<string>('Night Patrol Guard');

  const handleGeneratePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789!@#$%';
    let result = `${config.logoEmblem || 'SOC'}-`;
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    onChange({ temporaryPassword: result });
  };

  const handleLoadSampleCsv = () => {
    const lines = SAMPLE_CSV_TEMPLATE.trim().split('\n').slice(1);
    const parsed: ResidentRecord[] = lines.map((line, idx) => {
      const parts = line.split(',');
      return {
        id: `R-${idx + 101}`,
        unit: parts[0] || `A-${idx + 101}`,
        block: parts[1] || 'Tower A',
        ownerName: parts[2] || 'Resident Owner',
        residentType: (parts[3] as 'Owner' | 'Tenant') || 'Owner',
        phone: parts[4] || '+91 98000 00000',
        email: parts[5] || 'resident@society.org',
        parkingSlot: parts[6] || `B1-P${idx + 10}`,
        hasPets: parts[7]?.toLowerCase() === 'yes',
        status: 'active',
      };
    });

    setResidents(parsed);
    setCsvUploadSuccess(`Successfully parsed ${parsed.length} resident records from CSV template!`);
    onChange({ totalFlats: parsed.length });
  };

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffName.trim()) return;
    const badgeNum = Math.floor(100 + Math.random() * 900);
    setStaffList([
      ...staffList,
      {
        name: newStaffName,
        role: newStaffRole,
        badgeId: `ST-${badgeNum}`,
        shift: 'Assigned Standard Shift',
      },
    ]);
    setNewStaffName('');
  };

  return (
    <div className="space-y-6 text-slate-800">
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider">
          <span>Stage 04</span>
          <span>·</span>
          <span>Committee Onboarding & Roster Ingestion</span>
        </div>
        <h3 className="text-2xl font-bold text-slate-900 mt-1">Issue Master Admin & Ingest Roster</h3>
        <p className="text-xs text-slate-500 mt-1">
          Issue cryptographic master credentials to RWA Office Bearers and batch-import initial resident units.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Master Admin Credentials (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-50 p-5 sm:p-6 rounded-3xl border border-slate-200 space-y-3.5 shadow-xs">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Key className="w-4 h-4 text-blue-600" /> Master Society Admin
            </h4>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Designation / Office Bearer Role
              </label>
              <select
                value={config.adminRole}
                onChange={(e) =>
                  onChange({
                    adminRole: e.target.value as 'President' | 'Secretary' | 'Treasurer' | 'Estate Manager',
                  })
                }
                className="w-full bg-white border-2 border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs text-slate-900 font-bold focus:outline-none focus:border-blue-600 shadow-xs cursor-pointer"
              >
                <option value="President">RWA President</option>
                <option value="Secretary">Hon. General Secretary</option>
                <option value="Treasurer">Hon. Treasurer</option>
                <option value="Estate Manager">Head of Estate Operations</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Full Name</label>
              <input
                type="text"
                value={config.adminName}
                onChange={(e) => onChange({ adminName: e.target.value })}
                className="w-full bg-white border-2 border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs text-slate-900 font-semibold focus:outline-none focus:border-blue-600 shadow-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Official Email</label>
              <input
                type="email"
                value={config.adminEmail}
                onChange={(e) => onChange({ adminEmail: e.target.value })}
                className="w-full bg-white border-2 border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs text-slate-900 font-mono focus:outline-none focus:border-blue-600 shadow-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Mobile Phone (SMS & WhatsApp)</label>
              <input
                type="tel"
                value={config.adminPhone}
                onChange={(e) => onChange({ adminPhone: e.target.value })}
                className="w-full bg-white border-2 border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs text-slate-900 font-mono focus:outline-none focus:border-blue-600 shadow-xs"
              />
            </div>

            {/* Generated Temporary Password */}
            <div className="pt-2 border-t border-slate-200">
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-bold text-slate-700">One-Time Activation Password</label>
                <button
                  type="button"
                  onClick={handleGeneratePassword}
                  className="text-xs text-blue-700 hover:underline font-bold cursor-pointer"
                >
                  Regenerate
                </button>
              </div>
              <div className="flex items-center gap-2 bg-white border-2 border-slate-200 rounded-2xl px-3.5 py-2 shadow-xs">
                <input
                  type={showPassword ? 'text' : 'password'}
                  readOnly
                  value={config.temporaryPassword || 'PG-RWA-2026!Secured'}
                  className="w-full bg-transparent text-sm font-mono text-emerald-700 font-bold focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-500 hover:text-slate-900 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[10px] text-slate-500 mt-1">
                Forces mandatory two-factor authentication reset on first committee login.
              </p>
            </div>
          </div>

          {/* Staff & Guard Badge Allocations */}
          <div className="bg-slate-50 p-5 sm:p-6 rounded-3xl border border-slate-200 space-y-3.5 shadow-xs">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> Assigned Staff Badges
              </span>
              <span className="text-xs font-bold text-slate-600 bg-slate-200/80 px-2 py-0.5 rounded-full">
                {staffList.length} Active
              </span>
            </h4>

            <div className="space-y-2 max-h-40 overflow-y-auto">
              {staffList.map((st) => (
                <div key={st.badgeId} className="p-3 bg-white rounded-2xl border border-slate-200 flex items-center justify-between text-xs shadow-xs">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-900">{st.name}</span>
                      <span className="text-[10px] font-mono text-emerald-800 font-bold bg-emerald-100 border border-emerald-300 px-2 py-0.2 rounded-full">
                        {st.badgeId}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">{st.role}</p>
                  </div>
                  <UserCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                </div>
              ))}
            </div>

            <form onSubmit={handleAddStaff} className="pt-2 border-t border-slate-200 flex gap-2">
              <input
                type="text"
                placeholder="Guard/Staff Name"
                value={newStaffName}
                onChange={(e) => setNewStaffName(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shrink-0 cursor-pointer shadow-xs"
              >
                + Assign
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Resident Roster CSV Ingest (7 cols) */}
        <div className="lg:col-span-7 bg-slate-50 p-5 sm:p-6 rounded-3xl border border-slate-200 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-slate-200">
              <div>
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600" /> Resident Roster Spreadsheet
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Ingest flat ownership data, parking bays, and contact directories.
                </p>
              </div>

              <button
                type="button"
                onClick={handleLoadSampleCsv}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-emerald-600/20 self-start sm:self-auto"
              >
                <Upload className="w-3.5 h-3.5" /> Load Sample Roster (8 Units)
              </button>
            </div>

            {csvUploadSuccess && (
              <div className="mt-3.5 p-3 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-800 text-xs font-medium flex items-center gap-2 shadow-xs">
                <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" /> {csvUploadSuccess}
              </div>
            )}

            {/* Resident Table Preview */}
            <div className="mt-4 rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-xs">
              <div className="max-h-80 overflow-y-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-700 sticky top-0 border-b border-slate-200">
                    <tr>
                      <th className="p-3 font-bold">Unit</th>
                      <th className="p-3 font-bold">Resident Name</th>
                      <th className="p-3 font-bold">Tenure</th>
                      <th className="p-3 font-bold">Contact</th>
                      <th className="p-3 font-bold">Bay</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {residents.map((r) => (
                      <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3 font-mono font-bold text-slate-900">{r.unit}</td>
                        <td className="p-3 font-semibold text-slate-800">{r.ownerName}</td>
                        <td className="p-3">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              r.residentType === 'Owner'
                                ? 'bg-blue-50 text-blue-800 border border-blue-200'
                                : 'bg-purple-50 text-purple-800 border border-purple-200'
                            }`}
                          >
                            {r.residentType}
                          </span>
                        </td>
                        <td className="p-3 font-mono text-[11px] text-slate-600">{r.phone}</td>
                        <td className="p-3 font-mono text-[11px] text-slate-600">{r.parkingSlot}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 mt-5 flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>{residents.length} flats staged for initial tenant seed.</span>
            <span className="text-emerald-700 font-bold">✓ Encrypted AES-256</span>
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-5 border-t border-slate-200">
        <button
          onClick={onPrev}
          className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" /> Back to QR Engine
        </button>
        <button
          onClick={onNext}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/25 transition-all flex items-center gap-1.5 cursor-pointer"
        >
          Proceed to Automated Job Runner <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
