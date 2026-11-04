export type PhotoCategory = 
  | 'overview' 
  | 'security' 
  | 'drone' 
  | 'pool' 
  | 'garden' 
  | 'waste' 
  | 'water' 
  | 'parking' 
  | 'gym' 
  | 'general';

export interface SocietyFeaturePhoto {
  id: string;
  category: PhotoCategory;
  badge: string;
  title: string;
  societyName: string;
  location: string;
  metric: string;
  metricLabel: string;
  statusTag: string;
  statusColor: string;
  description: string;
  features: string[];
  realPhotoUrl: string;
  isFeaturedHero?: boolean;
  uploadedAt?: string;
  customAdded?: boolean;
}
