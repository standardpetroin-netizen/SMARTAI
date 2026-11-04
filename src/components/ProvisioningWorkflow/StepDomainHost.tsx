import React, { useState } from 'react';
import { Shield, RefreshCw, Server, ArrowRight } from 'lucide-react';
import { SocietyConfig } from '../../types';

interface StepDomainHostProps {
  config: SocietyConfig;
  onChange: (updated: Partial<SocietyConfig>) => void;
  onNext: () => void;
}

export const StepDomainHost: React.FC<StepDomainHostProps> = ({
  config,
  onChange,
  onNext,
}) => {
  const [isCheckingDns, setIsCheckingDns] = useState<boolean>(false);

  const handleSubdomainChange = (val: string) => {
    const sanitized = val.toLowerCase().replace(/[^a-z0-9-]/g, '');
    onChange({
      subdomain: sanitized,
    });
  };

  const handleRunDnsTest = () => {
    setIsCheckingDns(true);
    setTimeout(() => {
      setIsCheckingDns(false);
      onChange({
        edgeRoutingStatus: 'routed',
        sslStatus: 'active',
      });
    }, 900);
  };

  return (
    <div className="space-y-6 text-slate-800">
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider">
          <span>Stage 01</span>
          <span>·</span>
          <span>Edge Router & Host Allocation</span>
        </div>
        <h3 className="text-2xl font-bold text-slate-900 mt-1">Configure Subdomain & Custom Edge Host</h3>
        <p className="text-xs text-slate-500 mt-1">
          Every society tenant receives an isolated namespace on our global edge network with instant SSL encryption.
        </p>
      </div>

      {/* Subdomain Input Card in Enhanced Color Scheme */}
      <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Default smartaisociety Subdomain
          </label>
          <div className="flex items-center rounded-2xl bg-white border-2 border-slate-300 overflow-hidden focus-within:border-blue-600 shadow-xs">
            <span className="text-xs text-slate-500 pl-3.5 font-medium">https://</span>
            <input
              type="text"
              value={config.subdomain}
              onChange={(e) => handleSubdomainChange(e.target.value)}
              placeholder="yoursociety"
              className="w-full bg-transparent px-2 py-3 text-sm text-slate-900 font-mono font-bold focus:outline-none"
            />
            <span className="text-xs text-slate-700 font-mono font-bold pr-3.5 bg-slate-100 py-3 px-3.5 border-l border-slate-200">
              .smartaisociety.io
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1.5">
            Auto-assigned high-availability multi-region tenant endpoint.
          </p>
        </div>

        {/* Custom Domain Section */}
        <div className="pt-4 border-t border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs font-bold text-slate-900">White-Label Custom Domain</p>
              <p className="text-[11px] text-slate-500">Map society&apos;s own registered domain name</p>
            </div>
            <button
              type="button"
              onClick={() => onChange({ isCustomDomainActive: !config.isCustomDomainActive })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer shrink-0 ${
                config.isCustomDomainActive ? 'bg-blue-600' : 'bg-slate-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  config.isCustomDomainActive ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {config.isCustomDomainActive && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Custom Hostname (FQDN)</label>
                <input
                  type="text"
                  value={config.customDomain}
                  onChange={(e) => onChange({ customDomain: e.target.value })}
                  placeholder="portal.yoursociety.org"
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 font-mono focus:outline-none focus:border-blue-600 shadow-xs"
                />
              </div>

              {/* DNS Mapping Instructions */}
              <div className="p-4 bg-blue-50/70 rounded-2xl border border-blue-200 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-blue-900">Required DNS CNAME Record:</span>
                  <span className="text-[10px] text-emerald-800 font-mono font-bold bg-emerald-100 px-2 py-0.5 rounded">TTL: 300</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono bg-white p-3 rounded-xl border border-blue-100 shadow-2xs">
                  <div>
                    <span className="text-slate-400">Host: </span>
                    <span className="text-blue-700 font-bold">
                      {config.customDomain.split('.')[0] || 'portal'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400">Points to: </span>
                    <span className="text-emerald-700 font-bold">cname.edge.smartaisociety.io</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edge Routing & SSL Status Card in Vibrant Colors */}
      <div className="p-5 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-3xl border border-emerald-200 flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-xs shrink-0">
            <Server className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900">Edge Ingress Routing</span>
              <span className="text-[10px] text-emerald-800 bg-emerald-100 font-bold px-2 py-0.5 rounded-full border border-emerald-300">
                Anycast Active
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-emerald-600" />
              Automated Let&apos;s Encrypt Wildcard SSL Active
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleRunDnsTest}
          disabled={isCheckingDns}
          className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-300 text-xs font-bold text-slate-700 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isCheckingDns ? 'animate-spin text-blue-600' : ''}`} />
          {isCheckingDns ? 'Verifying...' : 'Verify DNS'}
        </button>
      </div>

      <div className="flex justify-end pt-4 border-t border-slate-200">
        <button
          onClick={onNext}
          className="px-7 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
        >
          Proceed to Branding Ingestion <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
