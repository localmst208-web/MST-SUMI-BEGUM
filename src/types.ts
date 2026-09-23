export type CollectionId = 'baby' | 'womens' | string;

export interface Product {
  id: string;
  name: string;
  subtitle?: string;
  category: string;
  collectionId: CollectionId;
  price: number; // in BDT (৳)
  originalPrice?: number;
  description: string;
  fabricDetails: string;
  craftsmanship: string;
  careInstructions?: string;
  color: string;
  colorHex: string;
  sizes: string[];
  images: string[];
  model3dPreset: 'evening-gown' | 'draped-saree' | 'baby-romper' | 'tailored-blazer' | 'silk-top' | 'luxury-dress' | 'custom-glb';
  model3dUrl?: string; // Optional custom GLB/GLTF file URL
  floor: '1st Floor' | '2nd Floor';
  isFeatured: boolean;
  isEnabled: boolean;
  sortOrder: number;
}

export interface Collection {
  id: CollectionId;
  name: string;
  navLabel: string;
  subtitle: string;
  description: string;
  floor: '1st Floor' | '2nd Floor';
  bgType: 'gradient' | 'image' | 'dark-studio';
  bgImageUrl?: string;
  bgBlur: number; // in px
  bgOverlayOpacity: number; // 0 to 1
  ambientColor: string;
  lightingPreset: 'cinematic-warm' | 'minimal-studio' | 'royal-dusk' | 'soft-nursery';
  accentColor: string;
  isEnabled: boolean;
}

export interface ThreeDShowroomSettings {
  productScale: number;
  rotationSpeed: number;
  floatingSpeed: number;
  floatingAmplitude: number;
  cameraDistance: number;
  lightingIntensity: number;
  shadowIntensity: number;
  depthOfField: number;
  backgroundBlur: number;
  scrollSensitivity: number;
  autoRotate: boolean;
}

export interface WelcomeIntroSettings {
  isEnabled: boolean;
  brandTitle: string;
  brandName: string;
  brandSubtitle: string;
  durationSeconds: number;
  modelPreset: 'western-blazer-model' | 'high-fashion-evening' | 'custom-glb';
  customModelUrl?: string;
  modelImageUrl: string;
  bgImageUrl: string;
  bgBlur: number;
  bgOpacity?: number;
  bgOverlayStyle?: 'glow' | 'vignette' | 'clean';
  cameraMovementSpeed: number;
}

export interface WelcomeAudioSettings {
  isEnabled: boolean;
  audioUrl: string; // real MP3 or WAV URL
  audioName: string;
  autoplayPreferred: boolean;
  volume: number; // 0 to 1
  fallbackButtonText: string;
  welcomeMessageText: string; // synthesized or audio voiceover script
  useVoiceSynthIfNoAudio: boolean;
}

export interface HeroSettings {
  tagline: string;
  title: string;
  subtitle: string;
  ctaPrimaryText: string;
  ctaSecondaryText: string;
  bgImageUrl: string;
}

export interface BrandSettings {
  brandName: string;
  tagline: string;
  logoText: string;
  address: string;
  city: string;
  phone: string;
  whatsappNumber: string;
  email: string;
  openingHours: string;
  floor1Name: string;
  floor1Description: string;
  floor2Name: string;
  floor2Description: string;
  socialLinks: {
    instagram: string;
    facebook: string;
    tiktok: string;
    whatsapp: string;
  };
  adminPassword?: string;
  adminSetupCompleted?: boolean;
  adminAuthorizedDeviceId?: string;
}

export interface MobileSettings {
  mobileScale: number;
  mobileYOffset: number;
  mobileAnimationSpeed: number;
  qualityTier: 'high' | 'medium' | 'low';
}

export interface CartItem {
  product: Product;
  selectedSize: string;
  selectedColor: string;
  quantity: number;
}

export interface FloorGallerySlot {
  id: string;
  slotNumber: number; // 1 to 10
  imageUrl: string;
  title: string;
  subtitle?: string;
}

export interface FloorGalleries {
  babyFloor: FloorGallerySlot[];
  womensFloor: FloorGallerySlot[];
}

export interface AppCmsData {
  products: Product[];
  collections: Collection[];
  threeDSettings: ThreeDShowroomSettings;
  welcomeIntro: WelcomeIntroSettings;
  welcomeAudio: WelcomeAudioSettings;
  hero: HeroSettings;
  brand: BrandSettings;
  mobile: MobileSettings;
  floorGalleries: FloorGalleries;
}
