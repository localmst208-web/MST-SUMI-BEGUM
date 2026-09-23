import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  AppCmsData,
  Product,
  Collection,
  ThreeDShowroomSettings,
  WelcomeIntroSettings,
  WelcomeAudioSettings,
  HeroSettings,
  BrandSettings,
  MobileSettings,
  CartItem,
  FloorGallerySlot,
  FloorGalleries,
} from '../types';
import { initialCmsData } from '../data/initialData';

const LOCAL_STORAGE_KEY = 'brand_shop_cms_state_v1';

interface CmsContextType {
  data: AppCmsData;
  activeCollectionId: string;
  setActiveCollectionId: (id: string) => void;
  activeProductId: string;
  setActiveProductId: (id: string) => void;
  // Floor navigation & 10-slot Gallery
  selectedFloorView: '1st Floor' | '2nd Floor';
  setSelectedFloorView: (floor: '1st Floor' | '2nd Floor') => void;
  updateFloorGallerySlot: (
    floor: 'babyFloor' | 'womensFloor',
    slotNumber: number,
    slotData: Partial<FloorGallerySlot>
  ) => void;
  deleteFloorGallerySlot: (
    floor: 'babyFloor' | 'womensFloor',
    slotNumber: number
  ) => void;
  // Product actions
  updateProduct: (product: Product) => void;
  addProduct: (product: Omit<Product, 'id'>) => Product;
  deleteProduct: (id: string) => void;
  // Collection actions
  updateCollection: (collection: Collection) => void;
  addCollection: (collection: Omit<Collection, 'id'> & { id: string }) => void;
  deleteCollection: (id: string) => void;
  // Setting sections
  updateThreeDSettings: (settings: Partial<ThreeDShowroomSettings>) => void;
  updateWelcomeIntro: (settings: Partial<WelcomeIntroSettings>) => void;
  updateWelcomeAudio: (settings: Partial<WelcomeAudioSettings>) => void;
  updateHero: (settings: Partial<HeroSettings>) => void;
  updateBrand: (settings: Partial<BrandSettings>) => void;
  updateMobile: (settings: Partial<MobileSettings>) => void;
  resetToDefault: () => void;
  // Cart
  cart: CartItem[];
  addToCart: (product: Product, size: string, color: string, qty?: number) => void;
  removeFromCart: (productId: string, size: string) => void;
  updateCartQty: (productId: string, size: string, delta: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  // Detail Modal
  detailProduct: Product | null;
  setDetailProduct: (product: Product | null) => void;
  // Welcome & Admin State
  hasCompletedIntro: boolean;
  setHasCompletedIntro: (completed: boolean) => void;
  replayIntro: () => void;
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  isAdminAuthenticated: boolean;
  setIsAdminAuthenticated: (auth: boolean) => void;
  isAuthorizedDevice: boolean;
  isFirstDeviceSetup: boolean;
  authorizeCurrentDevice: (passcode?: string, email?: string) => void;
  deauthorizeCurrentDevice: () => void;
}

const CmsContext = createContext<CmsContextType | null>(null);

export const CmsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<AppCmsData>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Merge with initial data to ensure new fields or images are not lost
        const hasLegacyCollections = parsed.collections?.some(
          (c: { id: string }) => c.id === 'western' || c.id === 'bangladeshi'
        );
        const resolvedCollections =
          hasLegacyCollections || !parsed.collections?.length
            ? initialCmsData.collections
            : parsed.collections;

        const rawProducts = parsed.products?.length ? parsed.products : initialCmsData.products;
        const resolvedProducts = rawProducts.map((p: Product) => {
          if ((p.collectionId as string) === 'western' || (p.collectionId as string) === 'bangladeshi') {
            return { ...p, collectionId: 'womens', floor: '2nd Floor' as const };
          }
          return p;
        });

        return {
          ...initialCmsData,
          ...parsed,
          brand: { ...initialCmsData.brand, ...parsed.brand },
          hero: { ...initialCmsData.hero, ...parsed.hero },
          welcomeIntro: { ...initialCmsData.welcomeIntro, ...parsed.welcomeIntro },
          welcomeAudio: { ...initialCmsData.welcomeAudio, ...parsed.welcomeAudio },
          threeDSettings: { ...initialCmsData.threeDSettings, ...parsed.threeDSettings },
          mobile: { ...initialCmsData.mobile, ...parsed.mobile },
          floorGalleries:
            parsed.floorGalleries?.babyFloor?.length && parsed.floorGalleries?.womensFloor?.length
              ? parsed.floorGalleries
              : initialCmsData.floorGalleries,
          collections: resolvedCollections,
          products: resolvedProducts,
        };
      }
    } catch (e) {
      console.error('Failed to parse local CMS state:', e);
    }
    return initialCmsData;
  });

  const [activeCollectionId, setActiveCollectionId] = useState<string>('womens');
  const [activeProductId, setActiveProductId] = useState<string>('prod-w-01');
  const [selectedFloorView, setSelectedFloorView] = useState<'1st Floor' | '2nd Floor'>('2nd Floor');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);
  const [hasCompletedIntro, setHasCompletedIntro] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  // Device authorization state
  const [isAuthorizedDevice, setIsAuthorizedDevice] = useState<boolean>(() => {
    try {
      return localStorage.getItem('brandshop_authorized_admin_device') === 'true';
    } catch {
      return false;
    }
  });

  const isFirstDeviceSetup = !data?.brand?.adminSetupCompleted &&
    (() => {
      try {
        return localStorage.getItem('brandshop_admin_setup_completed') !== 'true';
      } catch {
        return true;
      }
    })();

  const authorizeCurrentDevice = (passcode?: string, email?: string) => {
    try {
      localStorage.setItem('brandshop_authorized_admin_device', 'true');
      localStorage.setItem('brandshop_admin_setup_completed', 'true');
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
    setIsAuthorizedDevice(true);
    setData((prev) => ({
      ...prev,
      brand: {
        ...prev.brand,
        ...(passcode ? { adminPassword: passcode } : {}),
        ...(email ? { email } : {}),
        adminSetupCompleted: true,
      },
    }));
  };

  const deauthorizeCurrentDevice = () => {
    try {
      localStorage.removeItem('brandshop_authorized_admin_device');
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
    setIsAuthorizedDevice(false);
    setIsAdminAuthenticated(false);
    setIsAdminOpen(false);
  };

  // URL query parameter & keyboard shortcut listener (?admin=portal, ?admin=login, ?admin=setup, #admin, Ctrl+Shift+A)
  useEffect(() => {
    const handleUrlAndShortcuts = () => {
      try {
        const searchParams = new URLSearchParams(window.location.search);
        const hasAdminParam = searchParams.has('admin') || window.location.hash === '#admin';
        if (hasAdminParam) {
          setIsAdminOpen(true);
        }
      } catch (e) {
        console.warn('Error reading URL params:', e);
      }
    };

    handleUrlAndShortcuts();

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setIsAdminOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn('Unable to persist CMS changes to localStorage:', e);
    }
  }, [data]);

  // When collection changes, set active product to the first product in that collection
  useEffect(() => {
    const colProducts = data.products.filter(
      (p) => p.collectionId === activeCollectionId && p.isEnabled
    );
    if (colProducts.length > 0) {
      // If current activeProductId is not in this collection, switch
      const currentExists = colProducts.some((p) => p.id === activeProductId);
      if (!currentExists) {
        setActiveProductId(colProducts[0].id);
      }
    }
  }, [activeCollectionId, data.products, activeProductId]);

  const updateProduct = (updated: Product) => {
    setData((prev) => ({
      ...prev,
      products: prev.products.map((p) => (p.id === updated.id ? updated : p)),
    }));
  };

  const addProduct = (newProd: Omit<Product, 'id'>): Product => {
    const id = `prod-${Date.now()}`;
    const product: Product = { ...newProd, id };
    setData((prev) => ({
      ...prev,
      products: [product, ...prev.products],
    }));
    return product;
  };

  const deleteProduct = (id: string) => {
    setData((prev) => ({
      ...prev,
      products: prev.products.filter((p) => p.id !== id),
    }));
  };

  const updateCollection = (col: Collection) => {
    setData((prev) => ({
      ...prev,
      collections: prev.collections.map((c) => (c.id === col.id ? col : c)),
    }));
  };

  const addCollection = (col: Omit<Collection, 'id'> & { id: string }) => {
    setData((prev) => ({
      ...prev,
      collections: [...prev.collections, col as Collection],
    }));
  };

  const deleteCollection = (id: string) => {
    setData((prev) => ({
      ...prev,
      collections: prev.collections.filter((c) => c.id !== id),
      products: prev.products.filter((p) => p.collectionId !== id),
    }));
  };

  const updateThreeDSettings = (settings: Partial<ThreeDShowroomSettings>) => {
    setData((prev) => ({
      ...prev,
      threeDSettings: { ...prev.threeDSettings, ...settings },
    }));
  };

  const updateWelcomeIntro = (settings: Partial<WelcomeIntroSettings>) => {
    setData((prev) => ({
      ...prev,
      welcomeIntro: { ...prev.welcomeIntro, ...settings },
    }));
  };

  const updateWelcomeAudio = (settings: Partial<WelcomeAudioSettings>) => {
    setData((prev) => ({
      ...prev,
      welcomeAudio: { ...prev.welcomeAudio, ...settings },
    }));
  };

  const updateHero = (settings: Partial<HeroSettings>) => {
    setData((prev) => ({
      ...prev,
      hero: { ...prev.hero, ...settings },
    }));
  };

  const updateBrand = (settings: Partial<BrandSettings>) => {
    setData((prev) => ({
      ...prev,
      brand: { ...prev.brand, ...settings },
    }));
  };

  const updateMobile = (settings: Partial<MobileSettings>) => {
    setData((prev) => ({
      ...prev,
      mobile: { ...prev.mobile, ...settings },
    }));
  };

  // 10-slot Floor Galleries for Baby and Women's floors
  const updateFloorGallerySlot = (
    floor: 'babyFloor' | 'womensFloor',
    slotNumber: number,
    slotData: Partial<FloorGallerySlot>
  ) => {
    setData((prev) => {
      const currentList = prev.floorGalleries[floor] || [];
      const updatedList = currentList.map((slot) => {
        if (slot.slotNumber === slotNumber) {
          return { ...slot, ...slotData };
        }
        return slot;
      });

      // If slotNumber did not exist, add it
      if (!currentList.some((s) => s.slotNumber === slotNumber)) {
        updatedList.push({
          id: `${floor === 'babyFloor' ? 'baby' : 'women'}-slot-${slotNumber}`,
          slotNumber,
          imageUrl: slotData.imageUrl || '',
          title: slotData.title || `Slot ${slotNumber}`,
          subtitle: slotData.subtitle || '',
        });
      }

      return {
        ...prev,
        floorGalleries: {
          ...prev.floorGalleries,
          [floor]: updatedList,
        },
      };
    });
  };

  const deleteFloorGallerySlot = (
    floor: 'babyFloor' | 'womensFloor',
    slotNumber: number
  ) => {
    setData((prev) => {
      const currentList = prev.floorGalleries[floor] || [];
      const updatedList = currentList.map((slot) => {
        if (slot.slotNumber === slotNumber) {
          return {
            ...slot,
            imageUrl: '',
            title: `Slot ${slotNumber} (Empty)`,
            subtitle: 'No image uploaded yet',
          };
        }
        return slot;
      });

      return {
        ...prev,
        floorGalleries: {
          ...prev.floorGalleries,
          [floor]: updatedList,
        },
      };
    });
  };

  const resetToDefault = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setData(initialCmsData);
    setActiveCollectionId('womens');
    setActiveProductId('prod-w-01');
    setSelectedFloorView('2nd Floor');
  };

  // Cart operations
  const addToCart = (product: Product, size: string, color: string, qty = 1) => {
    setCart((prev) => {
      const existingIdx = prev.findIndex(
        (item) => item.product.id === product.id && item.selectedSize === size
      );
      if (existingIdx > -1) {
        const copy = [...prev];
        copy[existingIdx].quantity += qty;
        return copy;
      }
      return [...prev, { product, selectedSize: size, selectedColor: color, quantity: qty }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string, size: string) => {
    setCart((prev) =>
      prev.filter((i) => !(i.product.id === productId && i.selectedSize === size))
    );
  };

  const updateCartQty = (productId: string, size: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((i) => {
          if (i.product.id === productId && i.selectedSize === size) {
            const nextQty = i.quantity + delta;
            return nextQty > 0 ? { ...i, quantity: nextQty } : null;
          }
          return i;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const clearCart = () => setCart([]);

  const replayIntro = () => {
    setHasCompletedIntro(false);
  };

  return (
    <CmsContext.Provider
      value={{
        data,
        activeCollectionId,
        setActiveCollectionId,
        activeProductId,
        setActiveProductId,
        selectedFloorView,
        setSelectedFloorView,
        updateFloorGallerySlot,
        deleteFloorGallerySlot,
        updateProduct,
        addProduct,
        deleteProduct,
        updateCollection,
        addCollection,
        deleteCollection,
        updateThreeDSettings,
        updateWelcomeIntro,
        updateWelcomeAudio,
        updateHero,
        updateBrand,
        updateMobile,
        resetToDefault,
        cart,
        addToCart,
        removeFromCart,
        updateCartQty,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        detailProduct,
        setDetailProduct,
        hasCompletedIntro,
        setHasCompletedIntro,
        replayIntro,
        isAdminOpen,
        setIsAdminOpen,
        isAdminAuthenticated,
        setIsAdminAuthenticated,
        isAuthorizedDevice,
        isFirstDeviceSetup,
        authorizeCurrentDevice,
        deauthorizeCurrentDevice,
      }}
    >
      {children}
    </CmsContext.Provider>
  );
};

export const useCms = (): CmsContextType => {
  const context = useContext(CmsContext);
  if (!context) {
    throw new Error('useCms must be used within a CmsProvider');
  }
  return context;
};
