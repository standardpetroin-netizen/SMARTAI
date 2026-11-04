import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Shield, 
  Trash2, 
  Droplet, 
  MapPin, 
  CheckCircle2, 
  Trees, 
  Car, 
  Dumbbell, 
  Maximize2, 
  X, 
  Video, 
  Camera, 
  Sparkles, 
  Zap, 
  ChevronLeft, 
  ChevronRight, 
  Eye, 
  SlidersHorizontal,
  Sun,
  Moon,
  ExternalLink,
  Star
} from 'lucide-react';
import { useSmartAISociety } from '../context/SmartAISocietyContext';
import { PhotoCategory, SocietyFeaturePhoto } from '../types/photos';
export type { PhotoCategory, SocietyFeaturePhoto };

const CATEGORY_ORDER: PhotoCategory[] = [
  'overview',
  'security',
  'drone',
  'pool',
  'garden',
  'waste',
  'water',
  'parking',
  'gym'
];

export const SocietyPhotoShowcase: React.FC = () => {
  const { 
    societyPhotos, 
    featuredHeroPhotoId, 
    setFeaturedHeroPhotoId 
  } = useSmartAISociety();

  const [activeTab, setActiveTab] = useState<PhotoCategory>('overview');
  const [displayMode, setDisplayMode] = useState<'render' | 'video' | 'details'>('render');
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);
  const [isDuskIllumination, setIsDuskIllumination] = useState<boolean>(false);

  // Auto-play slideshow: Cycles through facilities silently
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTab((currentTab) => {
        const currentIndex = CATEGORY_ORDER.indexOf(currentTab);
        const nextIndex = (currentIndex + 1) % CATEGORY_ORDER.length;
        return CATEGORY_ORDER[nextIndex];
      });
    }, 4500);

    return () => clearInterval(timer);
  }, []);

  const handleNextSlide = () => {
    const currentIndex = CATEGORY_ORDER.indexOf(activeTab);
    const nextIndex = (currentIndex + 1) % CATEGORY_ORDER.length;
    setActiveTab(CATEGORY_ORDER[nextIndex]);
  };

  const handlePrevSlide = () => {
    const currentIndex = CATEGORY_ORDER.indexOf(activeTab);
    const prevIndex = (currentIndex - 1 + CATEGORY_ORDER.length) % CATEGORY_ORDER.length;
    setActiveTab(CATEGORY_ORDER[prevIndex]);
  };

  const currentPhoto = 
    societyPhotos.find((p) => p.category === activeTab) || 
    societyPhotos[0];

  const currentIndex = CATEGORY_ORDER.indexOf(activeTab);
  const nextCategory = CATEGORY_ORDER[(currentIndex + 1) % CATEGORY_ORDER.length];
  const nextPhoto = 
    societyPhotos.find((p) => p.category === nextCategory) || 
    societyPhotos[0];

  return (
    <section className="py-20 px-4 sm:px-6 bg-white text-slate-900 border-y border-slate-200 relative overflow-hidden">
      {/* Subtle background glow accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider mb-2">
            <Camera className="w-3.5 h-3.5 text-blue-600" />
            <span>Real High-Resolution Photographic Gallery</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Township Infrastructure in{' '}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 bg-clip-text text-transparent">
              High-Resolution Real Photography
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl mx-auto mt-2 leading-relaxed">
            Every critical facility across modern residential townships is documented with real photography, synced with IoT telemetry and autonomous aerial inspection logs.
          </p>
        </div>

        {/* 9 Facility Category Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar">
          {[
            { id: 'overview' as PhotoCategory, label: 'Grand Towers', icon: Building2 },
            { id: 'security' as PhotoCategory, label: 'Main Gate 01', icon: Shield },
            { id: 'drone' as PhotoCategory, label: 'Drone Helipad', icon: Zap },
            { id: 'pool' as PhotoCategory, label: 'Infinity Pool', icon: Droplet },
            { id: 'garden' as PhotoCategory, label: 'Central Park', icon: Trees },
            { id: 'waste' as PhotoCategory, label: 'Zero-Waste OWC', icon: Trash2 },
            { id: 'water' as PhotoCategory, label: 'IoT Pump Room', icon: Droplet },
            { id: 'parking' as PhotoCategory, label: 'EV Parking Hub', icon: Car },
            { id: 'gym' as PhotoCategory, label: 'Sports Arena', icon: Dumbbell },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-md ring-2 ring-blue-500/30'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Main Showcase 2-Column Deck: Photo Player & Specs */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-slate-50 rounded-3xl p-4 sm:p-8 border border-slate-200 shadow-sm">
          
          {/* Left Column: Interactive Photographic Canvas (7 cols) */}
          <div className="lg:col-span-7 flex flex-col space-y-3">
            {/* Display Switcher & Controls */}
            <div className="flex items-center justify-between gap-2 p-1 bg-white rounded-2xl border border-slate-200 shadow-2xs">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setDisplayMode('render')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    displayMode === 'render'
                      ? 'bg-slate-900 text-cyan-300 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Camera className="w-3.5 h-3.5 text-cyan-400" />
                  <span>4K Real Photo</span>
                </button>

                <button
                  onClick={() => setDisplayMode('video')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    displayMode === 'video'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Video className="w-3.5 h-3.5 text-pink-300" />
                  <span>Drone Video Flight</span>
                </button>

                <button
                  onClick={() => setIsDuskIllumination(!isDuskIllumination)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                    isDuskIllumination
                      ? 'bg-amber-100 text-amber-900 border-amber-300'
                      : 'bg-slate-100 text-slate-600 border-slate-200 hover:text-slate-900'
                  }`}
                  title="Toggle Dusk Illumination"
                >
                  {isDuskIllumination ? <Sun className="w-3.5 h-3.5 text-amber-600" /> : <Moon className="w-3.5 h-3.5 text-indigo-600" />}
                  <span>{isDuskIllumination ? 'Daylight' : 'Dusk Light'}</span>
                </button>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={handlePrevSlide}
                  className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                  title="Previous Facility"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <button
                  onClick={handleNextSlide}
                  className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                  title="Next Facility"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setIsLightboxOpen(true)}
                  className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer mr-1"
                  title="Fullscreen View"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Photo Rendering Canvas */}
            <div className="relative w-full h-[380px] sm:h-[440px] rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 group shadow-md">
              {displayMode === 'video' ? (
                <div className="relative w-full h-full overflow-hidden bg-slate-950 flex items-center justify-center">
                  <video
                    src="https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-city-traffic-at-night-41544-large.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/40 pointer-events-none" />
                  <div className="absolute top-4 left-4 flex items-center gap-2 bg-slate-950/80 border border-cyan-500/50 px-3 py-1.5 rounded-xl backdrop-blur-md">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                    <span className="text-[11px] font-mono font-bold text-cyan-300">
                      LIVE AERIAL SURVEILLANCE · 4K UHD
                    </span>
                  </div>
                </div>
              ) : (
                <div className="relative w-full h-full overflow-hidden">
                  <img
                    key={currentPhoto.id}
                    src={currentPhoto.realPhotoUrl}
                    alt={currentPhoto.title}
                    className={`w-full h-full object-cover group-hover:scale-105 transition-all duration-700 ease-out ${
                      isDuskIllumination ? 'brightness-90 contrast-110 saturate-125' : 'brightness-100'
                    }`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent pointer-events-none" />

                  {/* Pulsing Facility Badge on Image */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between bg-slate-950/85 border border-slate-700 p-3 rounded-2xl backdrop-blur-md">
                    <div>
                      <p className="text-xs font-bold text-white">{currentPhoto.title}</p>
                      <p className="text-[10px] text-cyan-400 font-mono mt-0.5">{currentPhoto.location}</p>
                    </div>
                    <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-500/40 px-2.5 py-1 rounded-lg">
                      {currentPhoto.metric}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Facility Specs & Detailed Information (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${currentPhoto.statusColor}`}>
                  {currentPhoto.badge}
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  ● {currentPhoto.statusTag}
                </span>
              </div>

              <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                {currentPhoto.title}
              </h3>

              <p className="text-xs font-mono text-blue-600 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                <span>{currentPhoto.location}</span>
              </p>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {currentPhoto.description}
            </p>

            {/* Telemetry Metric Highlight */}
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  {currentPhoto.metricLabel}
                </p>
                <p className="text-xl sm:text-2xl font-black font-mono text-slate-900 mt-0.5">
                  {currentPhoto.metric}
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-xl">
                100% Verified
              </span>
            </div>

            {/* Key Features List */}
            <div className="space-y-2 pt-2">
              <p className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Audited Facility Capabilities:
              </p>
              <div className="space-y-2">
                {currentPhoto.features.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Verification Badge */}
            <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1.5 font-bold text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Verified Facility Asset · Real-Time Telemetry Linked</span>
              </span>
              <span className="font-mono text-[11px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md font-bold">
                4K UHD Photography
              </span>
            </div>
          </div>
        </div>

        {/* 9 Facility Parallax Multi-Card Grid */}
        <div className="mt-16 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                All 9 Society Infrastructure Facilities
              </h3>
              <p className="text-xs text-slate-500">
                Click any facility card below to inspect full high-resolution imagery and specifications.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {societyPhotos.map((photo) => {
              const isSelected = photo.category === activeTab;
              return (
                <div
                  key={photo.id}
                  onClick={() => {
                    setActiveTab(photo.category);
                    window.scrollTo({ top: 900, behavior: 'smooth' });
                  }}
                  className={`bg-white rounded-3xl border transition-all duration-300 overflow-hidden cursor-pointer group flex flex-col justify-between ${
                    isSelected
                      ? 'border-blue-600 ring-2 ring-blue-500/20 shadow-lg'
                      : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
                  }`}
                >
                  <div className="relative h-48 bg-slate-900 overflow-hidden">
                    <img
                      src={photo.realPhotoUrl}
                      alt={photo.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                    <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-xs text-white text-[10px] font-mono px-2.5 py-1 rounded-full border border-white/20">
                      {photo.badge}
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                      <span className="font-mono text-cyan-300 font-bold">{photo.metric}</span>
                      <span className="text-[10px] bg-black/60 px-2 py-0.5 rounded text-emerald-300">
                        ● {photo.statusTag}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                      {photo.title}
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-2">
                      {photo.description}
                    </p>
                    <div className="pt-2 flex items-center justify-between text-[11px] text-blue-600 font-bold">
                      <span>Inspect Facility</span>
                      <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Fullscreen Lightbox Modal */}
        {isLightboxOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-xl flex items-center justify-center p-4">
            <div className="bg-slate-900 rounded-3xl max-w-5xl w-full max-h-[92vh] overflow-hidden flex flex-col shadow-2xl border border-slate-700 text-white">
              <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950">
                <div>
                  <h3 className="font-black text-white text-lg">{currentPhoto.title}</h3>
                  <p className="text-xs text-slate-400 font-mono">{currentPhoto.location} · 4K UHD Real Photo</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrevSlide}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white cursor-pointer"
                    title="Previous"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <button
                    onClick={handleNextSlide}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white cursor-pointer"
                    title="Next"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>

                  <button
                    onClick={() => setIsLightboxOpen(false)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white cursor-pointer transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-black flex flex-col items-center">
                <div className="w-full h-[460px] rounded-2xl overflow-hidden border border-slate-800 shadow-lg">
                  <img
                    src={currentPhoto.realPhotoUrl}
                    alt={currentPhoto.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="w-full mt-4 p-4 bg-slate-900 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                      {currentPhoto.metricLabel}
                    </span>
                    <p className="text-sm text-slate-300 mt-1 max-w-xl">{currentPhoto.description}</p>
                  </div>

                  <span className="text-2xl font-black font-mono text-amber-400 shrink-0">
                    {currentPhoto.metric}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
