import React from 'react';
import { ArrowRight, ArrowLeft, Palette, Building, ShieldCheck, Smartphone, Check } from 'lucide-react';
import { SocietyConfig } from '../../types';

interface StepBrandingProps {
  config: SocietyConfig;
  onChange: (updated: Partial<SocietyConfig>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const COLOR_PRESETS = [
  { name: 'Emerald Forest', primary: '#059669', secondary: '#0f766e', desc: 'Eco & Landscaped' },
  { name: 'Royal Sapphire', primary: '#2563eb', secondary: '#1e40af', desc: 'Luxury High-Rise' },
  { name: 'Imperial Amber', primary: '#d97706', secondary: '#b45309', desc: 'Heritage Estates' },
  { name: 'Amethyst Luxury', primary: '#7c3aed', secondary: '#6d28d9', desc: 'Boutique Condos' },
  { name: 'Ocean Cyan', primary: '#0891b2', secondary: '#0e7490', desc: 'Waterfront Living' },
];

export const StepBranding: React.FC<StepBrandingProps> = ({
  config,
  onChange,
  onNext,
  onPrev,
}) => {
  return (
    <div className="space-y-6 text-slate-800">
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-purple-600 uppercase tracking-wider">
          <span>Stage 02</span>
          <span>·</span>
          <span>Branding & Legal Ingestion</span>
        </div>
        <h3 className="text-2xl font-bold text-slate-900 mt-1">Branding Ingestion & Legal Identity</h3>
        <p className="text-xs text-slate-500 mt-1">
          Store registered society credentials, color tokens, and emblem for resident apps and official invoices.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Fields: 7 cols */}
        <div className="lg:col-span-7 space-y-4">
          {/* Legal Entity Details in Clean Luminous White */}
          <div className="bg-slate-50 p-5 sm:p-6 rounded-3xl border border-slate-200 space-y-4 shadow-xs">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Building className="w-4 h-4 text-purple-600" /> Society Legal Entity
            </h4>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Official Society / RWA Registered Name
              </label>
              <input
                type="text"
                value={config.name}
                onChange={(e) => onChange({ name: e.target.value })}
                className="w-full bg-white border-2 border-slate-200 rounded-2xl px-3.5 py-2.5 text-sm text-slate-900 font-semibold focus:outline-none focus:border-purple-600 shadow-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Societies Reg. Number
                </label>
                <input
                  type="text"
                  value={config.registrationNumber}
                  onChange={(e) => onChange({ registrationNumber: e.target.value })}
                  placeholder="BLR/RWA/2021/8841-A"
                  className="w-full bg-white border-2 border-slate-200 rounded-2xl px-3.5 py-2.5 text-sm text-slate-900 font-mono font-medium focus:outline-none focus:border-purple-600 shadow-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Emblem / Acronym</label>
                <input
                  type="text"
                  maxLength={4}
                  value={config.logoEmblem}
                  onChange={(e) => onChange({ logoEmblem: e.target.value.toUpperCase() })}
                  placeholder="PG"
                  className="w-full bg-white border-2 border-slate-200 rounded-2xl px-3.5 py-2.5 text-sm text-slate-900 font-mono uppercase font-bold focus:outline-none focus:border-purple-600 shadow-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Registered Address</label>
              <input
                type="text"
                value={config.address}
                onChange={(e) => onChange({ address: e.target.value })}
                className="w-full bg-white border-2 border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-purple-600 shadow-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">City & State</label>
                <input
                  type="text"
                  value={config.city}
                  onChange={(e) => onChange({ city: e.target.value })}
                  className="w-full bg-white border-2 border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-purple-600 shadow-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Postal Code</label>
                <input
                  type="text"
                  value={config.pincode}
                  onChange={(e) => onChange({ pincode: e.target.value })}
                  className="w-full bg-white border-2 border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs text-slate-900 font-mono focus:outline-none focus:border-purple-600 shadow-xs"
                />
              </div>
            </div>
          </div>

          {/* Color Tokens & Preset Studio */}
          <div className="bg-slate-50 p-5 sm:p-6 rounded-3xl border border-slate-200 space-y-4 shadow-xs">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Palette className="w-4 h-4 text-purple-600" /> Brand Color Palette
            </h4>

            {/* Presets */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {COLOR_PRESETS.map((preset) => {
                const isSelected = config.primaryColor === preset.primary;
                return (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() =>
                      onChange({
                        primaryColor: preset.primary,
                        secondaryColor: preset.secondary,
                      })
                    }
                    className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-white border-purple-600 shadow-md ring-2 ring-purple-600/20'
                        : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className="w-4 h-4 rounded-full shadow-xs" style={{ backgroundColor: preset.primary }} />
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: preset.secondary }} />
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 text-purple-600" />}
                    </div>
                    <p className="text-[11px] font-bold text-slate-900 truncate">{preset.name.split(' ')[0]}</p>
                    <p className="text-[9px] text-slate-500 truncate">{preset.desc}</p>
                  </button>
                );
              })}
            </div>

            {/* Custom Hex Inputs */}
            <div className="grid grid-cols-2 gap-3.5 pt-2 border-t border-slate-200">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Primary Brand Color (Hex)</label>
                <div className="flex items-center gap-2.5 bg-white border-2 border-slate-200 rounded-2xl px-3 py-2 shadow-xs">
                  <input
                    type="color"
                    value={config.primaryColor}
                    onChange={(e) => onChange({ primaryColor: e.target.value })}
                    className="w-7 h-7 rounded-lg cursor-pointer bg-transparent border-0"
                  />
                  <input
                    type="text"
                    value={config.primaryColor}
                    onChange={(e) => onChange({ primaryColor: e.target.value })}
                    className="w-full bg-transparent text-xs text-slate-900 font-mono font-bold focus:outline-none uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Secondary Accent (Hex)</label>
                <div className="flex items-center gap-2.5 bg-white border-2 border-slate-200 rounded-2xl px-3 py-2 shadow-xs">
                  <input
                    type="color"
                    value={config.secondaryColor}
                    onChange={(e) => onChange({ secondaryColor: e.target.value })}
                    className="w-7 h-7 rounded-lg cursor-pointer bg-transparent border-0"
                  />
                  <input
                    type="text"
                    value={config.secondaryColor}
                    onChange={(e) => onChange({ secondaryColor: e.target.value })}
                    className="w-full bg-transparent text-xs text-slate-900 font-mono font-bold focus:outline-none uppercase"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Synchronized Mobile PWA Preview: 5 cols */}
        <div className="lg:col-span-5 bg-gradient-to-b from-purple-50/60 to-indigo-50/60 p-5 sm:p-6 rounded-3xl border border-purple-200/80 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-purple-200">
              <span className="text-xs font-bold text-purple-900 flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-purple-600" /> Live Resident App Mockup
              </span>
              <span className="text-[10px] text-emerald-700 font-mono font-bold bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-full">
                Synchronized
              </span>
            </div>

            {/* Mobile frame in sleek modern light style */}
            <div className="mt-5 mx-auto max-w-[280px] bg-white rounded-3xl border-4 border-slate-300 p-3.5 shadow-xl">
              {/* App status bar */}
              <div className="flex justify-between items-center text-[10px] text-slate-600 font-bold px-1 mb-2.5">
                <span>09:41</span>
                <span>5G · 100%</span>
              </div>

              {/* Ingestion Brand Card */}
              <div
                className="p-4 rounded-2xl text-white shadow-md transition-colors"
                style={{ backgroundColor: config.primaryColor }}
              >
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-xl bg-white/25 backdrop-blur-sm flex items-center justify-center font-bold text-sm shadow-xs">
                    {config.logoEmblem || 'SO'}
                  </div>
                  <span className="text-[10px] bg-black/20 backdrop-blur-xs px-2.5 py-0.5 rounded-full font-bold">
                    Unit 402
                  </span>
                </div>
                <h5 className="font-extrabold text-xs mt-2.5 truncate">{config.name}</h5>
                <p className="text-[10px] opacity-90 truncate">{config.registrationNumber || 'Registered Society'}</p>
              </div>

              {/* Sample resident quick actions */}
              <div className="grid grid-cols-2 gap-2 mt-3 text-[10px]">
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-center shadow-xs">
                  <p className="font-bold text-slate-800">Visitor Pass</p>
                  <p className="text-slate-500 text-[9px]">1-Tap Invite</p>
                </div>
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-center shadow-xs">
                  <p className="font-bold text-slate-800">Helpdesk</p>
                  <p className="text-slate-500 text-[9px]">OTP Verified</p>
                </div>
              </div>

              <div className="mt-3 p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-[10px] text-emerald-800 flex items-center justify-between font-medium">
                <span>Guard Night Patrol</span>
                <span className="text-emerald-700 font-mono font-bold">100% Active</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-purple-200 mt-5 text-[11px] text-purple-900 font-medium flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            Emblem & Color schema dynamically compiled into the resident installable PWA manifest.
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-5 border-t border-slate-200">
        <button
          onClick={onPrev}
          className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Host Setup
        </button>
        <button
          onClick={onNext}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/25 transition-all flex items-center gap-1.5 cursor-pointer"
        >
          Proceed to QR Generation Engine <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
