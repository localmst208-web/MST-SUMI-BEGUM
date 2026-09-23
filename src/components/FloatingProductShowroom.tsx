import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useCms } from '../context/CmsContext';
import { Product } from '../types';
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  ShoppingBag,
  MessageCircle,
  Layers,
  ZoomIn,
} from 'lucide-react';

interface FloatingProductShowroomProps {
  onOpenShowroomMap: () => void;
}

export const FloatingProductShowroom: React.FC<FloatingProductShowroomProps> = ({
  onOpenShowroomMap,
}) => {
  const {
    data,
    activeCollectionId,
    setActiveCollectionId,
    activeProductId,
    setActiveProductId,
    addToCart,
    setDetailProduct,
  } = useCms();

  const { products, collections, brand } = data;

  // Filter products for active collection
  const collectionProducts = products
    .filter((p) => p.collectionId === activeCollectionId && p.isEnabled)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const activeIndex = collectionProducts.findIndex((p) => p.id === activeProductId);
  const currentProduct: Product | undefined =
    collectionProducts[activeIndex >= 0 ? activeIndex : 0] || collectionProducts[0];

  const currentCollection =
    collections.find((c) => c.id === activeCollectionId) || collections[0];

  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [addedAnimation, setAddedAnimation] = useState(false);

  // Set default size and reset image index when current product changes
  useEffect(() => {
    if (currentProduct) {
      if (currentProduct.sizes.length > 0) {
        setSelectedSize(currentProduct.sizes[0]);
      }
      setSelectedImageIndex(0);
    }
  }, [currentProduct?.id]);

  // Navigate to next or previous product
  const navigateProduct = useCallback(
    (direction: 'next' | 'prev') => {
      if (collectionProducts.length <= 1 || isTransitioning) return;
      setIsTransitioning(true);

      const nextIndex =
        direction === 'next'
          ? (activeIndex + 1) % collectionProducts.length
          : (activeIndex - 1 + collectionProducts.length) % collectionProducts.length;

      setTimeout(() => {
        setActiveProductId(collectionProducts[nextIndex].id);
        setIsTransitioning(false);
      }, 250);
    },
    [activeIndex, collectionProducts, isTransitioning, setActiveProductId]
  );

  // Smooth wheel scroll listener for product switching
  const lastScrollTime = useRef(0);
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // Prevent rapid fire transitions
      const now = Date.now();
      if (now - lastScrollTime.current < 650) return;

      if (Math.abs(e.deltaY) > 40) {
        lastScrollTime.current = now;
        if (e.deltaY > 0) {
          navigateProduct('next');
        } else {
          navigateProduct('prev');
        }
      }
    };

    const showroomEl = document.getElementById('floating-product-stage');
    if (showroomEl) {
      showroomEl.addEventListener('wheel', handleWheel, { passive: true });
    }

    return () => {
      if (showroomEl) {
        showroomEl.removeEventListener('wheel', handleWheel);
      }
    };
  }, [navigateProduct]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        navigateProduct('next');
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        navigateProduct('prev');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigateProduct]);

  if (!currentProduct) {
    return (
      <div className="min-h-screen flex items-center justify-center text-neutral-400">
        No active products in this collection.
      </div>
    );
  }

  const handleQuickAdd = () => {
    addToCart(currentProduct, selectedSize, currentProduct.color);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);
  };

  const handleWhatsAppInquiry = () => {
    const message = encodeURIComponent(
      `Hello Brand Shop! I am interested in inquiring about the "${currentProduct.name}" (৳ ${currentProduct.price.toLocaleString()}) from the ${currentCollection.name}. Size: ${selectedSize}. Please assist with availability and ordering.`
    );
    const cleanPhone = brand.whatsappNumber.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
  };

  const currentIndexPadded = String(activeIndex + 1).padStart(2, '0');
  const totalCountPadded = String(collectionProducts.length).padStart(2, '0');

  return (
    <section
      id="floating-product-stage"
      className="relative min-h-screen w-full flex flex-col justify-between pt-24 pb-10 px-6 md:px-12 lg:px-16 overflow-hidden select-none"
    >
      {/* Subdued Collection Switcher Bar */}
      <div className="relative z-30 flex flex-wrap items-center justify-between gap-4 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-1.5 p-1 rounded-full bg-white/80 backdrop-blur-xl border border-neutral-200/80 shadow-sm">
          {collections
            .filter((c) => c.isEnabled)
            .map((col) => (
              <button
                key={col.id}
                onClick={() => setActiveCollectionId(col.id)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium tracking-wider uppercase transition-all duration-300 cursor-pointer ${
                  activeCollectionId === col.id
                    ? 'bg-neutral-900 text-white shadow-sm font-semibold'
                    : 'text-neutral-600 hover:text-neutral-950'
                }`}
              >
                {col.navLabel}
              </button>
            ))}
        </div>

        {/* Floor Location Badge & Showroom Map Link */}
        <button
          onClick={onOpenShowroomMap}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-neutral-200/80 text-neutral-700 hover:text-neutral-950 text-xs tracking-wider uppercase hover:border-amber-800/40 transition-all cursor-pointer shadow-sm"
        >
          <Layers className="w-3.5 h-3.5 text-amber-800" />
          <span>{currentProduct.floor}</span>
          <span className="text-neutral-300">·</span>
          <span className="text-amber-800 font-medium">Explore Atelier Floor</span>
        </button>
      </div>

      {/* Main Center Stage: 3D Floating Garment or Editorial Photo Viewport */}
      <div className="relative flex-1 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 items-center gap-8 py-4">
        {/* Left Side: Minimalist Editorial Typographic Specs */}
        <div
          className={`lg:col-span-4 z-20 space-y-4 transition-all duration-300 ${
            isTransitioning ? 'opacity-0 -translate-x-4' : 'opacity-100 translate-x-0'
          }`}
        >
          {/* Collection Kicker */}
          <div className="flex items-center gap-2 text-xs tracking-[0.25em] uppercase text-amber-800 font-semibold">
            <span>{currentCollection.name}</span>
            <span aria-hidden="true">·</span>
            <span>{currentProduct.category}</span>
          </div>

          {/* Product Headline */}
          <h2 className="text-3xl md:text-5xl font-display font-light tracking-tight text-neutral-900 leading-tight">
            {currentProduct.name}
          </h2>

          {/* Subtitle / Edition */}
          {currentProduct.subtitle && (
            <p className="text-xs tracking-wider text-neutral-500 font-light">
              {currentProduct.subtitle}
            </p>
          )}

          {/* Minimal Pricing */}
          <div className="flex items-baseline gap-3 pt-2">
            <span className="text-2xl md:text-3xl font-light text-neutral-900 tracking-wide font-serif tabular-nums">
              ৳ {currentProduct.price.toLocaleString()}
            </span>
            {currentProduct.originalPrice && (
              <span className="text-sm text-neutral-400 line-through tabular-nums">
                ৳ {currentProduct.originalPrice.toLocaleString()}
              </span>
            )}
          </div>

          <p className="text-xs md:text-sm text-neutral-600 font-light leading-relaxed max-w-sm line-clamp-3">
            {currentProduct.description}
          </p>

          {/* Quick Size Selector */}
          {currentProduct.sizes.length > 0 && (
            <div className="space-y-2 pt-2">
              <span className="text-[11px] uppercase tracking-wider text-neutral-500 font-medium">
                Select Size:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {currentProduct.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-3 py-1 rounded-md text-xs font-medium tracking-wide transition-all cursor-pointer ${
                      selectedSize === size
                        ? 'bg-neutral-900 text-white font-semibold shadow-sm'
                        : 'bg-white border border-neutral-200 text-neutral-700 hover:border-neutral-400'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-4">
            <button
              onClick={handleQuickAdd}
              className={`flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-full text-xs uppercase tracking-[0.2em] font-semibold transition-all duration-300 shadow-md cursor-pointer ${
                addedAnimation
                  ? 'bg-emerald-600 text-white scale-105'
                  : 'bg-neutral-900 hover:bg-neutral-800 text-white hover:scale-[1.01]'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{addedAnimation ? 'Added to Bag' : 'Add to Bag'}</span>
            </button>

            <button
              onClick={() => setDetailProduct(currentProduct)}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-white hover:bg-neutral-50 border border-neutral-300 text-neutral-900 text-xs uppercase tracking-[0.2em] font-medium transition-all duration-200 cursor-pointer shadow-sm"
            >
              <Eye className="w-3.5 h-3.5 text-amber-800" />
              <span>Fabric & Details</span>
            </button>
          </div>

          {/* WhatsApp Direct Concierge Order */}
          <button
            onClick={handleWhatsAppInquiry}
            className="flex items-center gap-2 text-xs text-neutral-600 hover:text-emerald-700 transition-colors pt-2 cursor-pointer font-medium"
          >
            <MessageCircle className="w-4 h-4 text-emerald-600" />
            <span>Order via WhatsApp Concierge (Fast Response)</span>
          </button>
        </div>

        {/* Center/Right: High-Resolution Garment Photography Showcase */}
        <div className="lg:col-span-8 relative h-[55vh] md:h-[65vh] lg:h-[72vh] flex flex-col items-center justify-center">
          {/* Subtle Soft Pastel Stage Ambient Halo */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div
              className="w-[480px] h-[480px] rounded-full filter blur-[110px] opacity-35 transition-colors duration-1000"
              style={{ backgroundColor: currentCollection.accentColor || '#fae3d9' }}
            />
          </div>

          {/* Main Photo Card */}
          <div
            onClick={() => setDetailProduct(currentProduct)}
            className={`group relative w-full max-w-lg aspect-[3/4] max-h-[62vh] rounded-3xl overflow-hidden bg-white/70 border border-white/80 shadow-[0_20px_50px_rgba(0,0,0,0.06)] backdrop-blur-md cursor-pointer transition-all duration-500 flex items-center justify-center p-3 ${
              isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
            }`}
          >
            <img
              src={currentProduct.images[selectedImageIndex] || currentProduct.images[0]}
              alt={currentProduct.name}
              className="w-full h-full object-cover object-center rounded-2xl group-hover:scale-105 transition-transform duration-700 ease-out"
            />

            {/* Hover Inspect Cue */}
            <div className="absolute inset-0 bg-neutral-900/15 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1.5px] rounded-3xl">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/95 text-neutral-900 text-xs font-semibold uppercase tracking-wider shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform">
                <ZoomIn className="w-4 h-4 text-amber-800" />
                <span>Inspect Fabric & Details</span>
              </div>
            </div>

            {/* Floor Badge */}
            <div className="absolute top-5 left-5 z-20 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md border border-neutral-200/80 text-[10px] font-mono tracking-widest text-neutral-800 uppercase shadow-sm">
              {currentProduct.floor}
            </div>
          </div>

          {/* Multi-Image Thumbnails Strip (if product has multiple images) */}
          {currentProduct.images && currentProduct.images.length > 1 && (
            <div className="flex items-center gap-2 mt-4 z-20">
              {currentProduct.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-12 h-12 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                    selectedImageIndex === idx
                      ? 'border-neutral-900 shadow-md scale-105'
                      : 'border-white/80 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Left / Right Arrow Carousel Controls */}
          <button
            onClick={() => navigateProduct('prev')}
            className="absolute left-0 sm:left-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-white/95 hover:bg-white border border-neutral-200 text-neutral-800 hover:text-neutral-950 shadow-lg hover:shadow-xl transition-all cursor-pointer"
            aria-label="Previous Garment"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={() => navigateProduct('next')}
            className="absolute right-0 sm:right-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-white/95 hover:bg-white border border-neutral-200 text-neutral-800 hover:text-neutral-950 shadow-lg hover:shadow-xl transition-all cursor-pointer"
            aria-label="Next Garment"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Bottom HUD: Product Pagination Counter & Dot Navigation */}
      <div className="relative z-30 flex items-center justify-between max-w-7xl mx-auto w-full pt-4 border-t border-neutral-200/80">
        {/* Index Counter */}
        <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-neutral-500 tabular-nums">
          <span className="text-neutral-900 font-medium text-sm">{currentIndexPadded}</span>
          <span>/</span>
          <span>{totalCountPadded}</span>
          <span className="text-neutral-400 hidden sm:inline ml-2">
            · Scroll or use Arrow keys to transition
          </span>
        </div>

        {/* Step Dots */}
        <div className="flex items-center gap-2">
          {collectionProducts.map((p, idx) => (
            <button
              key={p.id}
              onClick={() => setActiveProductId(p.id)}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                idx === activeIndex
                  ? 'w-8 bg-neutral-900'
                  : 'w-1.5 bg-neutral-300 hover:bg-neutral-500'
              }`}
              title={p.name}
            />
          ))}
        </div>

        {/* Floor Indicator Shortcut */}
        <div className="text-xs text-neutral-500 tracking-wider uppercase font-medium">
          <span>{currentProduct.floor}</span>
        </div>
      </div>
    </section>
  );
};
