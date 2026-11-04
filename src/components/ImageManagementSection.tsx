import React, { useState, useRef } from 'react';
import { 
  Camera, 
  Upload, 
  Trash2, 
  Edit3, 
  Star, 
  Plus, 
  X, 
  Check, 
  Sparkles, 
  Search, 
  Filter, 
  Eye, 
  RotateCw, 
  Image as ImageIcon, 
  CheckCircle2, 
  ShieldCheck, 
  Droplet, 
  Building2, 
  Radio, 
  Trees, 
  Car, 
  Dumbbell, 
  Maximize2,
  SlidersHorizontal,
  ExternalLink,
  Layers,
  ArrowRight
} from 'lucide-react';
import { useSmartAISociety } from '../context/SmartAISocietyContext';
import { SocietyFeaturePhoto, PhotoCategory } from '../types/photos';

interface ImageManagementSectionProps {
  onClose?: () => void;
  isModal?: boolean;
}

const CATEGORY_META: Record<PhotoCategory, { label: string; icon: React.ElementType; color: string }> = {
  overview: { label: 'Towers & Architecture', icon: Building2, color: 'bg-blue-100 text-blue-800 border-blue-200' },
  security: { label: 'Main Gate & Perimeter', icon: ShieldCheck, color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  drone: { label: 'Drone Surveillance', icon: Radio, color: 'bg-rose-100 text-rose-800 border-rose-200' },
  pool: { label: 'Infinity Pool & Club', icon: Droplet, color: 'bg-cyan-100 text-cyan-800 border-cyan-200' },
  garden: { label: 'Parks & Promenade', icon: Trees, color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  waste: { label: 'Eco Waste Management', icon: Sparkles, color: 'bg-teal-100 text-teal-800 border-teal-200' },
  water: { label: 'IoT Water Operations', icon: Droplet, color: 'bg-sky-100 text-sky-800 border-sky-200' },
  parking: { label: 'Covered Parking & EV', icon: Car, color: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
  gym: { label: 'Sports & Gymnasium', icon: Dumbbell, color: 'bg-purple-100 text-purple-800 border-purple-200' },
  general: { label: 'General Facilities', icon: Layers, color: 'bg-slate-100 text-slate-800 border-slate-200' },
};

const SAMPLE_PRESET_IMAGES = [
  {
    title: 'Skyline Condominium Towers',
    url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1600&q=85',
    category: 'overview' as PhotoCategory,
  },
  {
    title: 'Biometric Access Gate & Turnstiles',
    url: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=1600&q=85',
    category: 'security' as PhotoCategory,
  },
  {
    title: 'Autonomous Rooftop Drone Helipad',
    url: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=1600&q=85',
    category: 'drone' as PhotoCategory,
  },
  {
    title: 'Olympic Swimming Pool & Deck',
    url: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1600&q=85',
    category: 'pool' as PhotoCategory,
  },
  {
    title: 'Underground Hydro Pump Station',
    url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1600&q=85',
    category: 'water' as PhotoCategory,
  },
  {
    title: 'Sub-Basement High-Speed EV Charging',
    url: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=1600&q=85',
    category: 'parking' as PhotoCategory,
  },
];

export const ImageManagementSection: React.FC<ImageManagementSectionProps> = ({
  onClose,
  isModal = false,
}) => {
  const { 
    societyConfig,
    societyPhotos, 
    addSocietyPhoto, 
    updateSocietyPhoto, 
    deleteSocietyPhoto, 
    resetSocietyPhotos,
    featuredHeroPhotoId,
    setFeaturedHeroPhotoId
  } = useSmartAISociety();

  const [selectedCategory, setSelectedCategory] = useState<PhotoCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState<SocietyFeaturePhoto | null>(null);
  const [inspectingPhoto, setInspectingPhoto] = useState<SocietyFeaturePhoto | null>(null);

  // Form State for Add / Edit
  const [formSourceTab, setFormSourceTab] = useState<'upload' | 'url'>('upload');
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<PhotoCategory>('overview');
  const [formBadge, setFormBadge] = useState('');
  const [formSocietyName, setFormSocietyName] = useState(societyConfig?.name || 'Smart Residential Society AOA');
  const [formLocation, setFormLocation] = useState('');
  const [formMetric, setFormMetric] = useState('');
  const [formMetricLabel, setFormMetricLabel] = useState('');
  const [formStatusTag, setFormStatusTag] = useState('Operational');
  const [formDescription, setFormDescription] = useState('');
  const [formFeaturesText, setFormFeaturesText] = useState('');
  const [formPhotoUrl, setFormPhotoUrl] = useState('');
  const [uploadedPreview, setUploadedPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetForm = () => {
    setFormTitle('');
    setFormCategory('overview');
    setFormBadge('');
    setFormSocietyName(societyConfig?.name || 'Smart Residential Society AOA');
    setFormLocation('');
    setFormMetric('');
    setFormMetricLabel('');
    setFormStatusTag('Operational');
    setFormDescription('');
    setFormFeaturesText('');
    setFormPhotoUrl('');
    setUploadedPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleOpenAdd = () => {
    resetForm();
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (photo: SocietyFeaturePhoto) => {
    setEditingPhoto(photo);
    setFormTitle(photo.title);
    setFormCategory(photo.category);
    setFormBadge(photo.badge);
    setFormSocietyName(photo.societyName);
    setFormLocation(photo.location);
    setFormMetric(photo.metric);
    setFormMetricLabel(photo.metricLabel);
    setFormStatusTag(photo.statusTag);
    setFormDescription(photo.description);
    setFormFeaturesText(photo.features.join('\n'));
    setFormPhotoUrl(photo.realPhotoUrl);
    setUploadedPreview(photo.realPhotoUrl);
    setFormSourceTab('url');
  };

  // Handle local image file upload and read as base64 data URL
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (PNG, JPG, WEBP, SVG).');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setUploadedPreview(result);
      setFormPhotoUrl(result);
    };
    reader.readAsDataURL(file);
  };

  const handleSavePhoto = (e: React.FormEvent) => {
    e.preventDefault();
    const finalPhotoUrl = uploadedPreview || formPhotoUrl.trim();
    if (!finalPhotoUrl) {
      alert('Please provide an image either by uploading a file or entering a photo URL.');
      return;
    }

    const featuresList = formFeaturesText
      .split('\n')
      .map((f) => f.trim())
      .filter(Boolean);

    if (featuresList.length === 0) {
      featuresList.push('High-definition surveillance integration');
      featuresList.push('Real-time telemetry audit logs');
    }

    if (editingPhoto) {
      updateSocietyPhoto(editingPhoto.id, {
        title: formTitle.trim() || 'Society Facility',
        category: formCategory,
        badge: formBadge.trim() || CATEGORY_META[formCategory].label,
        societyName: formSocietyName.trim() || societyConfig?.name || 'Smart Residential Society AOA',
        location: formLocation.trim() || 'Campus Perimeter',
        metric: formMetric.trim() || 'Operational',
        metricLabel: formMetricLabel.trim() || 'Real-Time Sensor Telemetry',
        statusTag: formStatusTag.trim() || 'Active',
        description: formDescription.trim() || 'Modern facility equipped with IoT monitoring.',
        features: featuresList,
        realPhotoUrl: finalPhotoUrl,
      });
      setEditingPhoto(null);
    } else {
      addSocietyPhoto({
        title: formTitle.trim() || 'New Society Facility',
        category: formCategory,
        badge: formBadge.trim() || CATEGORY_META[formCategory].label,
        societyName: formSocietyName.trim() || societyConfig?.name || 'Smart Residential Society AOA',
        location: formLocation.trim() || 'Campus Perimeter',
        metric: formMetric.trim() || '100% Online',
        metricLabel: formMetricLabel.trim() || 'Real-Time Sensor Telemetry',
        statusTag: formStatusTag.trim() || 'Operational',
        statusColor: 'text-emerald-700 border-emerald-200 bg-emerald-50',
        description: formDescription.trim() || 'Curated residential facility equipped with intelligent tracking.',
        features: featuresList,
        realPhotoUrl: finalPhotoUrl,
      });
      setIsAddModalOpen(false);
    }
    resetForm();
  };

  // Filtered Photos
  const filteredPhotos = societyPhotos.filter((p) => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch = 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.badge.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredPhoto = societyPhotos.find((p) => p.id === featuredHeroPhotoId) || societyPhotos[0];

  return (
    <section 
      id="image-management" 
      className={`${isModal ? 'p-0' : 'py-16 px-4 sm:px-6 bg-slate-50 border-y border-slate-200'}`}
    >
      <div className={`${isModal ? 'w-full' : 'max-w-7xl mx-auto'} space-y-8`}>
        
        {/* Top Header & Actions Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider mb-2">
              <Camera className="w-3.5 h-3.5 text-blue-600" />
              <span>Visual Infrastructure & Real Media Studio</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Society Image Management Section
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
              Replace 3D computer graphics with real high-resolution photographs across the entire website. Upload new township photos, update facility descriptions, or set any photo as the featured Hero banner.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleOpenAdd}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-600/25 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Upload / Add Photo</span>
            </button>

            <button
              onClick={() => {
                if (window.confirm('Reset all photos to default curated society photographs?')) {
                  resetSocietyPhotos();
                }
              }}
              className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition-all flex items-center gap-1.5 cursor-pointer"
              title="Restore standard high-res photographs"
            >
              <RotateCw className="w-3.5 h-3.5 text-slate-500" />
              <span>Reset Defaults</span>
            </button>

            {onClose && (
              <button
                onClick={onClose}
                className="p-2.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Current Hero Featured Image Banner */}
        {featuredPhoto && (
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-4 sm:p-6 text-white border border-slate-800 shadow-xl overflow-hidden relative">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
              <div className="lg:col-span-4 relative group rounded-2xl overflow-hidden border-2 border-amber-400/80 shadow-2xl">
                <img
                  src={featuredPhoto.realPhotoUrl}
                  alt={featuredPhoto.title}
                  className="w-full h-48 sm:h-56 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-amber-400 text-slate-950 font-black text-[10px] uppercase px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md">
                  <Star className="w-3 h-3 fill-slate-950" />
                  <span>Hero Featured Image</span>
                </div>
                <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-md text-white text-[10px] font-mono px-2 py-0.5 rounded-md">
                  {featuredPhoto.metric}
                </div>
              </div>

              <div className="lg:col-span-8 space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-widest">
                    Active Hero Display
                  </span>
                  <span className="text-slate-500">·</span>
                  <span className="text-xs text-slate-300 font-semibold">{featuredPhoto.location}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  {featuredPhoto.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl line-clamp-2">
                  {featuredPhoto.description}
                </p>
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => setInspectingPhoto(featuredPhoto)}
                    className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl backdrop-blur-md border border-white/20 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Inspect Fullscreen</span>
                  </button>
                  <button
                    onClick={() => handleOpenEdit(featuredPhoto)}
                    className="px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Hero Photo Details</span>
                  </button>
                  <span className="text-xs text-slate-400">
                    💡 Click "★ Set as Hero" on any card below to replace this banner.
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters, Category Tabs & Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search facility photos, towers, gate..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* View Mode Toggle & Total Counter */}
            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
              <span className="text-xs font-bold text-slate-500">
                Showing {filteredPhotos.length} of {societyPhotos.length} Photos
              </span>
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    viewMode === 'grid' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Grid Cards
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    viewMode === 'table' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Table List
                </button>
              </div>
            </div>
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                selectedCategory === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              All Categories ({societyPhotos.length})
            </button>

            {(Object.keys(CATEGORY_META) as PhotoCategory[]).map((cat) => {
              const meta = CATEGORY_META[cat];
              const Icon = meta.icon;
              const count = societyPhotos.filter((p) => p.category === cat).length;
              if (count === 0 && selectedCategory !== cat) return null;

              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                    selectedCategory === cat
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{meta.label}</span>
                  <span className="text-[10px] opacity-75 font-mono">({count})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Photo Gallery: Grid View */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPhotos.map((photo) => {
              const isHero = photo.id === featuredHeroPhotoId;
              const meta = CATEGORY_META[photo.category] || CATEGORY_META.overview;
              const CategoryIcon = meta.icon;

              return (
                <div
                  key={photo.id}
                  className={`bg-white rounded-3xl border transition-all duration-300 overflow-hidden flex flex-col group relative ${
                    isHero 
                      ? 'border-amber-400 ring-2 ring-amber-400/40 shadow-xl' 
                      : 'border-slate-200 hover:border-slate-300 hover:shadow-lg shadow-sm'
                  }`}
                >
                  {/* Photo Thumbnail Container */}
                  <div className="relative h-56 bg-slate-100 overflow-hidden">
                    <img
                      src={photo.realPhotoUrl}
                      alt={photo.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20" />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1 border shadow-xs ${meta.color}`}>
                        <CategoryIcon className="w-3 h-3" />
                        <span>{photo.badge}</span>
                      </span>

                      {isHero && (
                        <span className="px-2.5 py-1 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-md">
                          <Star className="w-3 h-3 fill-slate-950" />
                          <span>Hero Banner</span>
                        </span>
                      )}
                    </div>

                    {/* Top Right Quick Actions */}
                    <div className="absolute top-3 right-3 flex items-center gap-1.5">
                      <button
                        onClick={() => setInspectingPhoto(photo)}
                        className="p-1.5 rounded-lg bg-black/60 hover:bg-black/90 text-white backdrop-blur-md transition-all cursor-pointer shadow-sm"
                        title="View Fullscreen"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Bottom Photo Overlay Info */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2 text-white">
                      <div>
                        <p className="text-[11px] font-mono text-cyan-300 font-bold uppercase tracking-wider">
                          {photo.metric}
                        </p>
                        <p className="text-[10px] text-slate-200 font-medium">
                          {photo.metricLabel}
                        </p>
                      </div>
                      <span className="text-[10px] font-mono bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/10 text-emerald-300">
                        ● {photo.statusTag}
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h4 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                        {photo.title}
                      </h4>
                      <p className="text-xs text-slate-500 font-medium mt-1">
                        📍 {photo.location}
                      </p>
                      <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                        {photo.description}
                      </p>
                    </div>

                    {/* Feature Chips */}
                    <div className="space-y-1.5 pt-2 border-t border-slate-100">
                      {photo.features.slice(0, 2).map((feat, i) => (
                        <div key={i} className="flex items-start gap-1.5 text-[11px] text-slate-600">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{feat}</span>
                        </div>
                      ))}
                    </div>

                    {/* Card Actions */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      {!isHero ? (
                        <button
                          onClick={() => setFeaturedHeroPhotoId(photo.id)}
                          className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors"
                          title="Showcase this image in the website Hero section"
                        >
                          <Star className="w-3.5 h-3.5 text-amber-600" />
                          <span>Set as Hero</span>
                        </button>
                      ) : (
                        <span className="text-xs font-bold text-amber-700 flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-amber-500" />
                          <span>Active in Hero</span>
                        </span>
                      )}

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(photo)}
                          className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors cursor-pointer border border-slate-200"
                          title="Edit Details"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        {photo.customAdded && (
                          <button
                            onClick={() => {
                              if (window.confirm(`Delete photo "${photo.title}"?`)) {
                                deleteSocietyPhoto(photo.id);
                              }
                            }}
                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer border border-slate-200"
                            title="Delete Photo"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Table List View */
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase font-black tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Photo</th>
                    <th className="py-3 px-4">Facility Title &amp; Category</th>
                    <th className="py-3 px-4">Location</th>
                    <th className="py-3 px-4">Key Metric</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredPhotos.map((photo) => {
                    const isHero = photo.id === featuredHeroPhotoId;
                    return (
                      <tr key={photo.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4">
                          <img
                            src={photo.realPhotoUrl}
                            alt={photo.title}
                            className="w-14 h-10 object-cover rounded-lg border border-slate-200 shadow-2xs"
                          />
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900 text-xs">{photo.title}</div>
                          <div className="text-[10px] text-slate-400">{photo.badge}</div>
                        </td>
                        <td className="py-3 px-4 text-slate-700">{photo.location}</td>
                        <td className="py-3 px-4 font-mono font-bold text-blue-600">{photo.metric}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {photo.statusTag}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {!isHero ? (
                              <button
                                onClick={() => setFeaturedHeroPhotoId(photo.id)}
                                className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold rounded-lg border border-amber-200 text-[11px] cursor-pointer"
                              >
                                Set as Hero
                              </button>
                            ) : (
                              <span className="text-[11px] font-bold text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded-md">
                                ★ In Hero
                              </span>
                            )}
                            <button
                              onClick={() => handleOpenEdit(photo)}
                              className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg cursor-pointer"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredPhotos.length === 0 && (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
              <ImageIcon className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">No Facility Photos Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No images match your current search or category filter. Try clearing filters or upload a new photo.
            </p>
            <button
              onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
              className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl"
            >
              Clear Filters
            </button>
          </div>
        )}

      </div>

      {/* Add / Upload Modal */}
      {(isAddModalOpen || editingPhoto) && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-xl font-black text-slate-900">
                  {editingPhoto ? 'Edit Facility Photo' : 'Upload New Society Photo'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Real photos will be integrated across the Hero, Showcase, and Facility inspections.
                </p>
              </div>
              <button
                onClick={() => { setIsAddModalOpen(false); setEditingPhoto(null); }}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePhoto} className="space-y-5">
              {/* Image Source Selection */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Photo Asset Source
                </label>
                <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-2xl border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setFormSourceTab('upload')}
                    className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      formSourceTab === 'upload' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Local File</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormSourceTab('url')}
                    className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      formSourceTab === 'url' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Photo Web URL</span>
                  </button>
                </div>

                {formSourceTab === 'upload' ? (
                  <div className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl p-6 text-center cursor-pointer transition-colors bg-slate-50 hover:bg-blue-50/30"
                       onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <Upload className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-xs font-bold text-slate-800">
                      Click to choose image or drag &amp; drop
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Supports JPG, PNG, WEBP, SVG (Reads locally as high-res data URL)
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/... or direct image link"
                      value={formPhotoUrl}
                      onChange={(e) => {
                        setFormPhotoUrl(e.target.value);
                        setUploadedPreview(e.target.value);
                      }}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    
                    {/* Quick Pick Sample Presets */}
                    <div className="pt-1">
                      <p className="text-[11px] font-bold text-slate-500 mb-1.5">Quick Presets:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {SAMPLE_PRESET_IMAGES.map((preset, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              setFormPhotoUrl(preset.url);
                              setUploadedPreview(preset.url);
                              setFormTitle(preset.title);
                              setFormCategory(preset.category);
                            }}
                            className="px-2.5 py-1 text-[11px] bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 rounded-lg border border-slate-200 cursor-pointer transition-colors"
                          >
                            + {preset.title}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Preview Box */}
                {uploadedPreview && (
                  <div className="relative rounded-2xl overflow-hidden border border-slate-200 h-44 bg-slate-900 shadow-inner">
                    <img
                      src={uploadedPreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded-md backdrop-blur-md">
                      Live Preview
                    </div>
                  </div>
                )}
              </div>

              {/* Form Metadata Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Facility Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Grand High-Rise Towers & Skydeck"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Facility Category *
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as PhotoCategory)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {(Object.keys(CATEGORY_META) as PhotoCategory[]).map((cat) => (
                      <option key={cat} value={cat}>
                        {CATEGORY_META[cat].label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Location Description
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Sarjapur Main Road, Bengaluru"
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Key Metric Badge
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="e.g. 320 Units"
                      value={formMetric}
                      onChange={(e) => setFormMetric(e.target.value)}
                      className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="e.g. 4 Highrises"
                      value={formMetricLabel}
                      onChange={(e) => setFormMetricLabel(e.target.value)}
                      className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Description
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Write a clear operational summary of this facility..."
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Key Features (one per line)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Gated biometric turnstiles for residents&#10;EV car charging bays in Sub-Basement B1&#10;24/7 DG power backup"
                    value={formFeaturesText}
                    onChange={(e) => setFormFeaturesText(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-[11px]"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => { setIsAddModalOpen(false); setEditingPhoto(null); }}
                  className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
                >
                  {editingPhoto ? 'Save Changes' : 'Add to Collection'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lightbox / Fullscreen Modal */}
      {inspectingPhoto && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-3xl max-w-4xl w-full overflow-hidden border border-slate-700 shadow-2xl text-white relative">
            <button
              onClick={() => setInspectingPhoto(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative h-80 sm:h-96 md:h-[450px] bg-black">
              <img
                src={inspectingPhoto.realPhotoUrl}
                alt={inspectingPhoto.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between text-white">
                <div>
                  <span className="text-[10px] font-mono text-cyan-300 uppercase tracking-widest bg-black/60 px-2 py-0.5 rounded">
                    {inspectingPhoto.badge}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black mt-1 drop-shadow-md">
                    {inspectingPhoto.title}
                  </h3>
                  <p className="text-xs text-slate-300 drop-shadow-sm">
                    📍 {inspectingPhoto.location} · {inspectingPhoto.societyName}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-mono font-black text-amber-400">
                    {inspectingPhoto.metric}
                  </p>
                  <p className="text-[10px] text-slate-300">
                    {inspectingPhoto.metricLabel}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-slate-950 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-slate-400 max-w-xl">
                {inspectingPhoto.description}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setFeaturedHeroPhotoId(inspectingPhoto.id);
                    setInspectingPhoto(null);
                  }}
                  className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Star className="w-3.5 h-3.5 fill-slate-950" />
                  <span>Set as Hero Image</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
