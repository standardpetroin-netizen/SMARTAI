import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Brand3DLogo } from './Brand3DLogo';

interface FooterProps {
  onOpenProvisioning: () => void;
  onOpenLeadModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenProvisioning, onOpenLeadModal }) => {
  return (
    <footer className="border-t border-slate-200 py-12 px-6 bg-slate-50 text-slate-600 text-sm">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <Brand3DLogo size="md" showText={true} dark={false} />
          <p className="text-xs text-slate-500 mt-2 max-w-md">
            Next-generation photographic visual infrastructure &amp; autonomous operations for Residential Welfare Associations, Condominiums, and Gated Townships.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-6 text-xs font-semibold text-slate-600">
          <a href="#features" className="hover:text-blue-600 transition-colors">Features</a>
          <a href="#showcase" className="hover:text-blue-600 transition-colors">Facility Photos</a>
          <a href="#apps" className="hover:text-blue-600 transition-colors">Live Apps</a>
          <a href="#whitelabel" className="hover:text-blue-600 transition-colors">White-Label Engine</a>
          <a href="#portfolio" className="hover:text-blue-600 transition-colors">Case Studies</a>
          <a href="#pricing" className="hover:text-blue-600 transition-colors">Subscription &amp; Pricing</a>
          <button
            onClick={onOpenProvisioning}
            className="hover:text-blue-600 transition-colors cursor-pointer"
          >
            Super-Admin Console
          </button>
          <button
            onClick={onOpenLeadModal}
            className="text-blue-600 hover:text-blue-700 font-bold cursor-pointer"
          >
            Schedule Pilot
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
        <p>© 2026 smartaisociety. Visual Infrastructure Platform. All rights reserved.</p>
        <div className="flex gap-4">
          <span className="hover:text-slate-700">Security SLA 99.9%</span>
          <span>·</span>
          <span className="hover:text-slate-700">GDPR & ISO-27001 Tenant Data Isolation</span>
          <span>·</span>
          <span className="hover:text-slate-700">Custom Deployment Agreement</span>
        </div>
      </div>
    </footer>
  );
};
