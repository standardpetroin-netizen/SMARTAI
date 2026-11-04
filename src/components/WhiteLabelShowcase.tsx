import React, { useState } from 'react';
import { CheckCircle, Globe, Shield, Sparkles, Receipt, Smartphone } from 'lucide-react';

interface PresetTheme {
  name: string;
  subdomain: string;
  customDomain: string;
  unit: string;
  emblem: string;
  color: string;
  bgHex: string;
}

const PRESET_SOCIETIES: PresetTheme[] = [
  {
    name: 'Emerald Heights Residency RWA',
    subdomain: 'emeraldheights',
    customDomain: 'members.emeraldheights-rwa.org',
    unit: 'Block B, Flat 402',
    emblem: 'EH',
    color: 'bg-emerald-600 text-emerald-400 border-emerald-500',
    bgHex: '#059669',
  },
  {
    name: 'Prestige Heights Condos',
    subdomain: 'prestigeheights',
    customDomain: 'portal.prestige-heights.in',
    unit: 'Tower 4, Suite 1201',
    emblem: 'PH',
    color: 'bg-blue-600 text-blue-400 border-blue-500',
    bgHex: '#2563eb',
  },
  {
    name: 'Solitaire Meadows Estate',
    subdomain: 'solitairemeadows',
    customDomain: 'my.solitaire-meadows.com',
    unit: 'Villa 18, Phase 2',
    emblem: 'SM',
    color: 'bg-amber-600 text-amber-400 border-amber-500',
    bgHex: '#d97706',
  },
  {
    name: 'Imperial Sky Residences',
    subdomain: 'imperialsky',
    customDomain: 'connect.imperialsky-condos.com',
    unit: 'Penthouse East, Fl 24',
    emblem: 'IS',
    color: 'bg-purple-600 text-purple-400 border-purple-500',
    bgHex: '#7c3aed',
  },
];

export const WhiteLabelShowcase: React.FC = () => {
  const [selectedPreset, setSelectedPreset] = useState<PresetTheme>(PRESET_SOCIETIES[0]);
  const [previewTab, setPreviewTab] = useState<'resident_app' | 'invoice_receipt'>('resident_app');

  return (
    <section id="whitelabel" className="py-20 px-6 bg-slate-50 relative border-b border-slate-200 text-slate-900">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Narrative & White-Label Capabilities */}
          <div className="lg:col-span-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 border border-purple-200 text-purple-700 text-xs font-semibold mb-4">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              <span>Enterprise White-Label Engine</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 leading-tight tracking-tight">
              Your Society. Your Domain. <br />
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 bg-clip-text text-transparent">
                Your Custom Brand Identity.
              </span>
            </h2>
            <p className="mt-5 text-slate-600 leading-relaxed text-base">
              Premium residential communities prefer not to use generic platforms. With our White-Label Add-on, your residents, guards, and committee access the platform strictly under your complex&apos;s legal identity, domain, and colors.
            </p>

            <div className="mt-8 space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 p-2 rounded-xl text-blue-600 mt-0.5 shrink-0 border border-blue-200">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-slate-900 font-semibold text-sm">Custom Domain & Edge DNS Routing</h4>
                  <p className="text-sm text-slate-600 mt-0.5">
                    Map <code className="bg-white border border-slate-200 px-1.5 py-0.5 rounded text-blue-600 font-mono text-xs">portal.yoursociety.com</code> with automated Let&apos;s Encrypt wildcard SSL certificate provisioning in seconds.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-emerald-100 p-2 rounded-xl text-emerald-600 mt-0.5 shrink-0 border border-emerald-200">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-slate-900 font-semibold text-sm">Custom PWA & Mobile App Theme</h4>
                  <p className="text-sm text-slate-600 mt-0.5">
                    Installable mobile web app uses the society&apos;s high-res emblem, custom splash screens, and committee color palette.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-purple-100 p-2 rounded-xl text-purple-600 mt-0.5 shrink-0 border border-purple-200">
                  <Receipt className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-slate-900 font-semibold text-sm">Branded Receipts & Digital Invoices</h4>
                  <p className="text-sm text-slate-600 mt-0.5">
                    All quarterly maintenance bills, gate receipts, and payment notifications carry the society&apos;s legal entity header and GST registration.
                  </p>
                </div>
              </div>
            </div>

            {/* Interactive Preset Selector */}
            <div className="mt-8 pt-6 border-t border-slate-200">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                Switch Live White-Label Theme Presets:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {PRESET_SOCIETIES.map((item) => (
                  <button
                    key={item.subdomain}
                    onClick={() => setSelectedPreset(item)}
                    className={`p-2.5 rounded-2xl border text-left text-xs transition-all cursor-pointer ${
                      selectedPreset.subdomain === item.subdomain
                        ? 'bg-white border-blue-500 shadow-sm text-slate-900 font-semibold ring-2 ring-blue-500/20'
                        : 'bg-white/80 border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="w-3.5 h-3.5 rounded-full shrink-0"
                        style={{ backgroundColor: item.bgHex }}
                      />
                      <span className="font-bold text-white truncate">{item.emblem}</span>
                    </div>
                    <p className="text-[11px] truncate text-slate-500">{item.name.split(' ')[0]}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Live Mockup Frame in Simple Clean Style */}
          <div className="lg:col-span-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-4 sm:p-6 shadow-xl relative">
              {/* Browser chrome header */}
              <div className="bg-slate-100 rounded-2xl border border-slate-200 overflow-hidden">
                <div className="bg-slate-200/70 px-4 py-3 flex items-center justify-between border-b border-slate-200">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-rose-400" />
                    <div className="w-3 h-3 rounded-full bg-amber-400" />
                    <div className="w-3 h-3 rounded-full bg-emerald-400" />
                  </div>
                  <div className="bg-white text-slate-700 text-xs px-3 sm:px-4 py-1.5 rounded-xl font-mono border border-slate-200 flex items-center gap-2 max-w-[260px] sm:max-w-md truncate shadow-2xs">
                    <span className="text-emerald-600 text-[10px] font-bold">🔒 https://</span>
                    <span className="truncate">{selectedPreset.customDomain}</span>
                  </div>
                  <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                    <Shield className="w-3.5 h-3.5" /> SSL Active
                  </div>
                </div>

                {/* Preview Viewport Switcher */}
                <div className="flex border-b border-slate-200 bg-slate-50 px-4 pt-2">
                  <button
                    onClick={() => setPreviewTab('resident_app')}
                    className={`pb-2 px-3 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
                      previewTab === 'resident_app'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Resident Portal Mockup
                  </button>
                  <button
                    onClick={() => setPreviewTab('invoice_receipt')}
                    className={`pb-2 px-3 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
                      previewTab === 'invoice_receipt'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Branded Invoice / Receipt
                  </button>
                </div>

                {/* Tab 1 Content: Resident Portal Mockup */}
                {previewTab === 'resident_app' && (
                  <div className="p-6 bg-white">
                    {/* Society Header */}
                    <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-white text-lg shadow-sm"
                          style={{ backgroundColor: selectedPreset.bgHex }}
                        >
                          {selectedPreset.emblem}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm">{selectedPreset.name}</h4>
                          <p className="text-xs text-emerald-600 flex items-center gap-1 font-medium">
                            <CheckCircle className="w-3 h-3" /> Dedicated White-Label Node
                          </p>
                        </div>
                      </div>
                      <span className="text-xs px-2.5 py-1 bg-slate-100 rounded-full text-slate-700 font-medium">
                        {selectedPreset.unit}
                      </span>
                    </div>

                    {/* Operational telemetry cards in resident portal */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                        <p className="text-xs text-slate-500 font-medium">Night Patrol Status</p>
                        <p className="text-lg font-bold text-emerald-600 mt-1 font-mono tabular-nums">100% Cleared</p>
                        <p className="text-[10px] text-slate-400 mt-1">Last scan: Gate 3 at 03:30 AM</p>
                      </div>

                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                        <p className="text-xs text-slate-500 font-medium">Doorstep Waste Audit</p>
                        <p className="text-lg font-bold text-blue-600 mt-1">Segregated (Dry/Wet)</p>
                        <p className="text-[10px] text-slate-400 mt-1">Logged by Collector #04</p>
                      </div>
                    </div>

                    {/* Quick resident actions styled with society brand color */}
                    <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                      <div>
                        <p className="text-xs text-slate-500">Q2 Maintenance Fee</p>
                        <p className="text-base font-bold text-slate-900 font-mono tabular-nums">₹14,250 Due</p>
                      </div>
                      <button
                        className="px-4 py-2 text-xs font-semibold text-white rounded-xl shadow-xs transition-all cursor-pointer"
                        style={{ backgroundColor: selectedPreset.bgHex }}
                      >
                        Pay Online
                      </button>
                    </div>
                  </div>
                )}

                {/* Tab 2 Content: Branded Invoice / Receipt */}
                {previewTab === 'invoice_receipt' && (
                  <div className="p-6 bg-slate-50 font-sans">
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4 shadow-xs">
                      {/* Legal Letterhead */}
                      <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white text-base shadow-xs"
                            style={{ backgroundColor: selectedPreset.bgHex }}
                          >
                            {selectedPreset.emblem}
                          </div>
                          <div>
                            <h5 className="text-sm font-bold text-slate-900">{selectedPreset.name}</h5>
                            <p className="text-[10px] text-slate-500">Reg: BLR/RWA/2021/8841-A · GSTIN: 29AAAFP9821M1Z5</p>
                            <p className="text-[10px] text-slate-400">Official Society Receipt & Maintenance Invoice</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] font-mono text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200 font-bold">
                            PAID · SETTLED
                          </span>
                          <p className="text-[10px] font-mono text-slate-500 mt-1">RCPT-2026-0814</p>
                        </div>
                      </div>

                      {/* Line items */}
                      <div className="text-xs space-y-2">
                        <div className="flex justify-between text-slate-500 border-b border-slate-100 pb-1.5 font-medium">
                          <span>Description</span>
                          <span>Amount</span>
                        </div>
                        <div className="flex justify-between text-slate-800">
                          <span>Quarterly Common Area Maintenance (CAM)</span>
                          <span className="font-mono font-medium">₹12,500.00</span>
                        </div>
                        <div className="flex justify-between text-slate-800">
                          <span>Sinking Fund Contribution (Lift & DG)</span>
                          <span className="font-mono font-medium">₹1,750.00</span>
                        </div>
                        <div className="flex justify-between font-bold text-slate-900 pt-2 border-t border-slate-200">
                          <span>Total Amount Collected</span>
                          <span className="font-mono text-emerald-700">₹14,250.00</span>
                        </div>
                      </div>

                      <div className="pt-2 text-[10px] text-slate-500 flex items-center justify-between border-t border-slate-100">
                        <span>Digital Signature: Verified by Master Society Ledger</span>
                        <span className="font-mono">Axis Escrow A/c: ····8902</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
