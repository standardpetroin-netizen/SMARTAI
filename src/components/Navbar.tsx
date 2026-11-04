import React from 'react';
import { useCivicOps } from '../context/CivicOpsContext';
import { 
  ArrowRight,
  Sparkles,
  Building2
} from 'lucide-react';
import { Brand3DLogo } from './Brand3DLogo';

interface NavbarProps {
  onOpenProvisioning: () => void;
  onOpenLeadModal: () => void;
  isProvisioningOpen: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenProvisioning,
  onOpenLeadModal,
}) => {
  const { setActiveView } = useCivicOps();

  return (
    <header className="border-b border-slate-200/90 bg-white/95 backdrop-blur-md sticky top-0 z-40 px-4 sm:px-6 py-3 shadow-xs">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Lockup: 3D Interactive Animated Logo */}
        <Brand3DLogo
          size="md"
          showText={true}
          dark={false}
          onClick={() => setActiveView('marketing')}
        />

        {/* Center Text Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-slate-600">
          <a href="#features" className="hover:text-blue-600 transition-colors">Features</a>
          <a href="#showcase" className="hover:text-blue-600 transition-colors">Facility Photos</a>
          <a href="#apps" className="hover:text-blue-600 transition-colors flex items-center gap-1.5">
            <span>ERP Apps</span>
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
          </a>
          <a href="#whitelabel" className="hover:text-blue-600 transition-colors">White-Label</a>
          <a href="#portfolio" className="hover:text-blue-600 transition-colors">Case Studies</a>
          <a href="#pricing" className="hover:text-blue-600 transition-colors">Subscription</a>
        </nav>

        {/* Right Action: Clean CTA and Direct ERP Access */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setActiveView('society_panel')}
            className="text-xs sm:text-sm font-bold text-slate-700 hover:text-blue-600 px-3 py-2 rounded-xl transition-colors hidden sm:flex items-center gap-1.5 cursor-pointer bg-slate-100 hover:bg-slate-200/80"
          >
            <Building2 className="w-3.5 h-3.5 text-blue-600" />
            <span>Society ERP</span>
          </button>

          <button
            onClick={onOpenLeadModal}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold px-4 py-2 rounded-xl transition-all shadow-sm shadow-blue-600/30 whitespace-nowrap cursor-pointer flex items-center gap-1.5 active:scale-95"
          >
            <span>Get Started</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
