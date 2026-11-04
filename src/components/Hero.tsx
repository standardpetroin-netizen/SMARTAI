import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  Shield, 
  Sparkles, 
  Building2, 
  Droplet, 
  Star, 
  Smartphone, 
  CheckCircle, 
  Camera, 
  Zap, 
  Radio, 
  Lock,
  Maximize2,
  Trees,
  Car,
  Eye,
  SlidersHorizontal,
  ChevronRight,
  Sun,
  Moon,
  X,
  MapPin
} from 'lucide-react';
import { InteractivePhoneSimulator } from './InteractivePhoneSimulator';
import { useSmartAISociety } from '../context/SmartAISocietyContext';
import { PhotoCategory, SocietyFeaturePhoto } from '../types/photos';

interface HeroProps {
  onOpenProvisioning: () => void;
  onOpenLeadModal: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenProvisioning, onOpenLeadModal }) => {
  const { 
    setActiveView, 
    isSubscribed, 
    openSubscriptionModal,
    societyPhotos,
    featuredHeroPhotoId
  } = useSmartAISociety();

  const [heroViewMode, setHeroViewMode] = useState<'photos' | 'app'>('photos');
  const [selectedPhotoCategory, setSelectedPhotoCategory] = useState<PhotoCategory>('overview');
  const [isAutoCycling, setIsAutoCycling] = useState<boolean>(true);
  const [isDuskLighting, setIsDuskLighting] = useState<boolean>(false);

  // Section 2 Interactive Facility Inspector State (Preserves the section from user's screenshot with Real Photography)
  const [selectedFacilityCategory, setSelectedFacilityCategory] = useState<PhotoCategory>('overview');
  const [isFacilityAutoRotating, setIsFacilityAutoRotating] = useState<boolean>(true);
  const [facilityLightingMode, setFacilityLightingMode] = useState<'day' | 'dusk'>('day');
  const [isFacilityFullscreen, setIsFacilityFullscreen] = useState<boolean>(false);

  // The active featured photo in hero
  const activeHeroPhoto = 
    societyPhotos.find((p) => p.category === selectedPhotoCategory) ||
    societyPhotos.find((p) => p.id === featuredHeroPhotoId) ||
    societyPhotos[0];

  // Active facility photo in the lower operational architecture section
  const currentFacilityPhoto = 
    societyPhotos.find((p) => p.category === selectedFacilityCategory) || 
    societyPhotos[0];

  // Auto-cycle categories in the top Hero preview
  useEffect(() => {
    if (!isAutoCycling || heroViewMode !== 'photos') return;
    const categories: PhotoCategory[] = ['overview', 'security', 'drone', 'pool', 'water', 'garden'];
    const interval = setInterval(() => {
      setSelectedPhotoCategory((prev) => {
        const currentIndex = categories.indexOf(prev);
        const nextIndex = (currentIndex + 1) % categories.length;
        return categories[nextIndex];
      });
    }, 4500);
    return () => clearInterval(interval);
  }, [isAutoCycling, heroViewMode]);

  // Auto-cycle categories in the lower operational facility viewer
  useEffect(() => {
    if (!isFacilityAutoRotating) return;
    const categories: PhotoCategory[] = ['overview', 'security', 'drone', 'pool', 'water', 'garden'];
    const interval = setInterval(() => {
      setSelectedFacilityCategory((prev) => {
        const currentIndex = categories.indexOf(prev);
        const nextIndex = (currentIndex + 1) % categories.length;
        return categories[nextIndex];
      });
    }, 4200);
    return () => clearInterval(interval);
  }, [isFacilityAutoRotating]);

  const handleResidentAppClick = () => {
    if (!isSubscribed) {
      openSubscriptionModal('Resident Mobile App', 'resident');
    } else {
      setActiveView('resident');
    }
  };

  return (
    <section className="relative px-4 sm:px-6 pt-8 pb-16 bg-gradient-to-b from-white via-slate-50/70 to-white text-slate-900 overflow-hidden border-b border-slate-200">
      <div className="max-w-7xl mx-auto">
        {/* Main 2-Column Hero Grid: Left Copy & Right Photographic Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* Left Column: Headlines, CTAs, Badges (6 cols) */}
          <div className="lg:col-span-6 text-left space-y-6">
            
            {/* Brand Kicker */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-700 text-white text-xs font-bold uppercase tracking-wider shadow-md">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="font-mono text-cyan-300">smartaisociety</span>
              <span className="text-slate-500">·</span>
              <span className="text-slate-300 font-semibold text-[11px]">Autonomous Living Platform</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.08]">
              Smart Gated Living, <br />
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 bg-clip-text text-transparent">
                Powered by Autonomous AI & IoT.
              </span>
            </h1>

            {/* Value Proposition Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed">
              The futuristic operating system for every residential housing society, high-rise apartment complex, gated condominium, and township. Real-time photographic facility surveillance, automated guard rotations, utility billing, pre-approved courier entry, and IoT reservoirs — 100% white-labeled and tailored for your society.
            </p>

            {/* Quick Value Points */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs font-semibold text-slate-700 pt-1">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Real Society Visual Infrastructure</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Automated Guard Patrol GPS Geofencing</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>1-Tap Visitor OTP Barrier Clearance</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>IoT Ultrasonic Reservoir Cutoff Relays</span>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  if (!isSubscribed) {
                    openSubscriptionModal('Society Admin Panel & ERP Hub', 'society_panel');
                  } else {
                    setActiveView('society_panel');
                  }
                }}
                className="px-6 py-3.5 bg-slate-900 hover:bg-slate-800 font-extrabold text-sm rounded-2xl text-white shadow-xl shadow-slate-900/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <Building2 className="w-4 h-4 text-cyan-400" />
                <span>Launch Society ERP</span>
              </button>

              <button
                onClick={handleResidentAppClick}
                className="px-5 py-3.5 bg-blue-600 hover:bg-blue-700 font-extrabold text-sm rounded-2xl text-white transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-blue-600/25 active:scale-95"
              >
                {!isSubscribed ? <Lock className="w-4 h-4 text-amber-300" /> : <Smartphone className="w-4 h-4 text-white" />}
                <span>Resident App</span>
                {!isSubscribed && (
                  <span className="text-[10px] bg-amber-400/90 text-slate-950 px-1.5 py-0.5 rounded-md font-mono font-black uppercase">
                    Priority
                  </span>
                )}
              </button>

              <a
                href="#showcase"
                className="px-5 py-3.5 bg-white hover:bg-slate-50 border border-slate-300 font-bold text-sm rounded-2xl text-slate-700 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-95"
              >
                <Camera className="w-4 h-4 text-slate-500" />
                <span>Facility Photos</span>
              </a>

              <button
                onClick={onOpenLeadModal}
                className="px-4 py-3.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50/60 font-bold text-sm rounded-2xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Free Trial</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Trust and Social Proof Badges */}
            <div className="pt-4 border-t border-slate-200/80 flex flex-wrap items-center gap-4 text-xs text-slate-600">
              <div className="flex items-center gap-1 text-amber-500">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
                <span className="font-extrabold text-slate-900 ml-1">4.9 / 5.0</span>
              </div>
              <span className="text-slate-300">·</span>
              <span className="font-bold text-slate-800">500,000+ Active Residents</span>
              <span className="text-slate-300">·</span>
              <span className="font-bold text-slate-800">1,200+ Smart Townships</span>
            </div>
          </div>

          {/* Right Column: Real Society Photographic Showcase & Phone Simulator (6 cols) */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center space-y-3">
            
            {/* Mode Switcher Tabs */}
            <div className="w-full flex items-center justify-between gap-2 p-1.5 bg-slate-200/80 backdrop-blur-md rounded-2xl border border-slate-300/80">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setHeroViewMode('photos')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    heroViewMode === 'photos'
                      ? 'bg-slate-900 text-cyan-300 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Camera className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Real Facility Photos</span>
                </button>

                <button
                  onClick={() => setHeroViewMode('app')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    heroViewMode === 'app'
                      ? 'bg-white text-purple-700 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5 text-purple-600" />
                  <span>Resident Mobile App</span>
                </button>
              </div>

              <span className="text-[10px] font-mono text-slate-500 hidden sm:inline-block pr-2">
                {heroViewMode === 'photos' ? 'Real 4K Township Photos' : 'Interactive Resident Phone Simulator'}
              </span>
            </div>

            {/* Media Rendering Container */}
            <div className="w-full">
              {heroViewMode === 'photos' && activeHeroPhoto && (
                <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden relative group">
                  
                  {/* Photo Display with Real-time Sensor HUD */}
                  <div className="relative h-[340px] sm:h-[390px] overflow-hidden bg-slate-900">
                    <img
                      src={activeHeroPhoto.realPhotoUrl}
                      alt={activeHeroPhoto.title}
                      className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-105 ${
                        isDuskLighting ? 'brightness-90 contrast-110 saturate-125' : 'brightness-100'
                      }`}
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-black/20 to-black/30 pointer-events-none" />

                    {/* Top HUD Overlay */}
                    <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between text-white z-10">
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-cyan-300 font-mono text-xs font-bold flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                          <span>LIVE INFRASTRUCTURE</span>
                        </span>
                        <span className="text-[11px] font-mono text-white/80 bg-black/40 px-2.5 py-1 rounded-full backdrop-blur-xs hidden sm:inline-block">
                          {activeHeroPhoto.location}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setIsDuskLighting(!isDuskLighting)}
                          className="p-1.5 rounded-xl bg-black/50 hover:bg-black/80 text-white backdrop-blur-md transition-colors cursor-pointer border border-white/10"
                          title={isDuskLighting ? 'Switch to Daylight View' : 'Switch to Dusk Illumination View'}
                        >
                          {isDuskLighting ? <Sun className="w-3.5 h-3.5 text-amber-300" /> : <Moon className="w-3.5 h-3.5 text-cyan-300" />}
                        </button>

                        <button
                          onClick={() => setIsAutoCycling(!isAutoCycling)}
                          className={`px-2 py-1 rounded-xl text-[10px] font-bold backdrop-blur-md border border-white/10 cursor-pointer ${
                            isAutoCycling ? 'bg-emerald-500/80 text-white' : 'bg-black/50 text-white/70'
                          }`}
                        >
                          {isAutoCycling ? 'Auto' : 'Paused'}
                        </button>
                      </div>
                    </div>

                    {/* Bottom HUD Information */}
                    <div className="absolute bottom-4 left-4 right-4 text-white z-10 space-y-2">
                      <div className="flex items-end justify-between gap-3">
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 bg-amber-950/70 border border-amber-500/30 px-2 py-0.5 rounded">
                            {activeHeroPhoto.badge}
                          </span>
                          <h3 className="text-xl sm:text-2xl font-black mt-1 text-white tracking-tight drop-shadow-md">
                            {activeHeroPhoto.title}
                          </h3>
                          <p className="text-xs text-slate-200 drop-shadow-sm max-w-md line-clamp-1">
                            {activeHeroPhoto.description}
                          </p>
                        </div>

                        <div className="text-right shrink-0">
                          <p className="text-xl font-mono font-black text-cyan-300 drop-shadow-md">
                            {activeHeroPhoto.metric}
                          </p>
                          <p className="text-[10px] text-slate-300 font-mono">
                            {activeHeroPhoto.metricLabel}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Category Quick Selector Pills under photo */}
                  <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center justify-between gap-1 overflow-x-auto no-scrollbar">
                    {[
                      { cat: 'overview' as PhotoCategory, label: 'Towers', icon: Building2 },
                      { cat: 'security' as PhotoCategory, label: 'Gate 01', icon: Shield },
                      { cat: 'drone' as PhotoCategory, label: 'Air Drone', icon: Radio },
                      { cat: 'pool' as PhotoCategory, label: 'Club & Pool', icon: Droplet },
                      { cat: 'water' as PhotoCategory, label: 'IoT Water', icon: Droplet },
                      { cat: 'garden' as PhotoCategory, label: 'Parks', icon: Trees },
                    ].map((item) => {
                      const Icon = item.icon;
                      const isSelected = selectedPhotoCategory === item.cat;
                      return (
                        <button
                          key={item.cat}
                          onClick={() => {
                            setSelectedPhotoCategory(item.cat);
                            setIsAutoCycling(false);
                          }}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                            isSelected
                              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 ring-1 ring-blue-400'
                              : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                          }`}
                        >
                          <Icon className="w-3 h-3" />
                          <span>{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {heroViewMode === 'app' && (
                <div className="w-full flex flex-col items-center">
                  <InteractivePhoneSimulator className="w-full max-w-sm" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* =========================================================================
            OPERATIONAL ARCHITECTURE SECTION (PRESERVED FROM USER'S SCREENSHOT)
            Replaces the 3D model with real photographs in the big interactive container
            ========================================================================= */}
        <div className="mt-16 pt-10 border-t border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                  Operational Infrastructure &amp; Architecture
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
                Smart Residential Township · Real Infrastructure
              </h3>
              <p className="text-xs text-slate-500">
                Multi-Tower High-Rises, Biometric Gates, Autonomous Drone Sentinels &amp; Integrated IoT Infrastructure
              </p>
            </div>

            {/* Perspective Selector with Auto-Cycle status (Preserved from 3D layout) */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setIsFacilityAutoRotating(!isFacilityAutoRotating)}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer border ${
                  isFacilityAutoRotating 
                    ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100' 
                    : 'bg-slate-100 text-slate-600 border-slate-300 hover:bg-slate-200'
                }`}
                title={isFacilityAutoRotating ? 'Auto-cycling (click to pause)' : 'Paused (click to auto-cycle)'}
              >
                <span className={`w-2 h-2 rounded-full ${isFacilityAutoRotating ? 'bg-emerald-500 animate-ping' : 'bg-slate-400'}`} />
                <span>{isFacilityAutoRotating ? 'Auto-Rotating' : 'Paused'}</span>
              </button>

              <button
                onClick={() => { setSelectedFacilityCategory('overview'); setIsFacilityAutoRotating(false); }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                  selectedFacilityCategory === 'overview'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:text-slate-900'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>High-Rise Towers</span>
              </button>

              <button
                onClick={() => { setSelectedFacilityCategory('security'); setIsFacilityAutoRotating(false); }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                  selectedFacilityCategory === 'security'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:text-slate-900'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Security Gatehouse</span>
              </button>

              <button
                onClick={() => { setSelectedFacilityCategory('drone'); setIsFacilityAutoRotating(false); }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                  selectedFacilityCategory === 'drone'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:text-slate-900'
                }`}
              >
                <Radio className="w-3.5 h-3.5" />
                <span>Drone Command</span>
              </button>

              <button
                onClick={() => { setSelectedFacilityCategory('pool'); setIsFacilityAutoRotating(false); }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                  selectedFacilityCategory === 'pool'
                    ? 'bg-cyan-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:text-slate-900'
                }`}
              >
                <Droplet className="w-3.5 h-3.5" />
                <span>Infinity Pool Deck</span>
              </button>

              <button
                onClick={() => { setSelectedFacilityCategory('water'); setIsFacilityAutoRotating(false); }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                  selectedFacilityCategory === 'water'
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:text-slate-900'
                }`}
              >
                <Droplet className="w-3.5 h-3.5" />
                <span>IoT Water Plant</span>
              </button>
            </div>
          </div>

          {/* Big Interactive Real-Photo Display Container (Replaces the 3D model box in user's screenshot) */}
          <div className="p-2 sm:p-3 bg-white rounded-3xl border border-slate-200 shadow-md space-y-3">
            <div className="relative w-full h-80 sm:h-96 lg:h-[450px] rounded-2xl overflow-hidden bg-slate-950 group">
              <img
                src={currentFacilityPhoto.realPhotoUrl}
                alt={currentFacilityPhoto.title}
                className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-105 ${
                  facilityLightingMode === 'dusk' ? 'brightness-90 contrast-115 saturate-125' : 'brightness-100'
                }`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-black/30 pointer-events-none" />

              {/* Top HUD Controls on Container */}
              <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between text-white z-10">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-cyan-300 font-mono text-xs font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>REAL-TIME OPERATIONAL INFRASTRUCTURE · 4K OPTICAL</span>
                  </span>
                  <span className="text-[11px] font-mono text-white/80 bg-black/50 px-2.5 py-1 rounded-full backdrop-blur-xs hidden sm:inline-block">
                    {currentFacilityPhoto.location}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setFacilityLightingMode(facilityLightingMode === 'day' ? 'dusk' : 'day')}
                    className="p-2 rounded-xl bg-black/60 hover:bg-black/90 text-white backdrop-blur-md transition-colors border border-white/10 cursor-pointer"
                    title={facilityLightingMode === 'day' ? 'Switch to Dusk Illumination' : 'Switch to Daylight View'}
                  >
                    {facilityLightingMode === 'dusk' ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-cyan-300" />}
                  </button>

                  <button
                    onClick={() => setIsFacilityFullscreen(true)}
                    className="p-2 rounded-xl bg-black/60 hover:bg-black/90 text-white backdrop-blur-md transition-colors border border-white/10 cursor-pointer"
                    title="Fullscreen Lightbox"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Bottom Telemetry Overlay */}
              <div className="absolute bottom-4 left-4 right-4 text-white z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 bg-black/60 border border-amber-500/40 px-2.5 py-0.5 rounded-full">
                    {currentFacilityPhoto.badge}
                  </span>
                  <h4 className="text-xl sm:text-2xl font-black mt-1.5 text-white tracking-tight drop-shadow-md">
                    {currentFacilityPhoto.title}
                  </h4>
                  <p className="text-xs text-slate-200 mt-0.5 drop-shadow-sm max-w-lg line-clamp-1">
                    {currentFacilityPhoto.description}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <p className="text-2xl font-mono font-black text-cyan-300 drop-shadow-md">
                    {currentFacilityPhoto.metric}
                  </p>
                  <p className="text-[10px] text-slate-300 font-mono">
                    {currentFacilityPhoto.metricLabel}
                  </p>
                </div>
              </div>
            </div>

            {/* Detailed Facility Specs Bar */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900">{currentFacilityPhoto.title}</span>
                  <span className="text-xs text-emerald-600 font-bold">● {currentFacilityPhoto.statusTag}</span>
                </div>
                <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
                  {currentFacilityPhoto.description}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                {currentFacilityPhoto.features.slice(0, 2).map((feat, i) => (
                  <span key={i} className="text-[11px] font-medium text-slate-700 bg-white border border-slate-200 px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-2xs">
                    <CheckCircle className="w-3 h-3 text-emerald-600" />
                    <span>{feat}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Social Proof Strip with Clean Tabular Numerals on Clean Background */}
        <div className="mt-12 pt-8 border-t border-slate-200 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-mono tabular-nums">45,000+</p>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">Flats Monitored Daily</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-extrabold text-emerald-600 font-mono tabular-nums">99.8%</p>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">Guard Checkpoint Adherence</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-mono tabular-nums">₹14.2 Cr</p>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">Maintenance Collected Online</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-extrabold text-blue-600 font-mono tabular-nums">1,200+</p>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">Townships Deployed</p>
          </div>
        </div>
      </div>

      {/* Fullscreen Lightbox Modal for Facility Inspector */}
      {isFacilityFullscreen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-3xl max-w-5xl w-full overflow-hidden border border-slate-700 shadow-2xl text-white relative">
            <button
              onClick={() => setIsFacilityFullscreen(false)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative h-80 sm:h-96 md:h-[500px] bg-black">
              <img
                src={currentFacilityPhoto.realPhotoUrl}
                alt={currentFacilityPhoto.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between text-white">
                <div>
                  <span className="text-[10px] font-mono text-cyan-300 uppercase tracking-widest bg-black/60 px-2 py-0.5 rounded">
                    {currentFacilityPhoto.badge}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black mt-1 drop-shadow-md">
                    {currentFacilityPhoto.title}
                  </h3>
                  <p className="text-xs text-slate-300 drop-shadow-sm">
                    📍 {currentFacilityPhoto.location}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-mono font-black text-amber-400">
                    {currentFacilityPhoto.metric}
                  </p>
                  <p className="text-[10px] text-slate-300 font-mono">
                    {currentFacilityPhoto.metricLabel}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5 bg-slate-950 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
              <p className="max-w-xl">{currentFacilityPhoto.description}</p>
              <span className="font-mono text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-500/30 px-3 py-1 rounded-lg">
                ● 100% OPERATIONAL
              </span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
