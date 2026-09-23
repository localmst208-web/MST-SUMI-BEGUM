import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useCms } from '../context/CmsContext';
import { FloorGallerySlot } from '../types';
import {
  Layers,
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
  Sliders,
  Image as ImageIcon,
  CheckCircle2,
  LayoutGrid,
  Sparkles,
  MessageCircle,
  Play,
  Pause,
} from 'lucide-react';

export const FloorGalleryShowcase: React.FC = () => {
  const { data, selectedFloorView, setSelectedFloorView } = useCms();

  const isBabyFloor = selectedFloorView === '1st Floor';
  const currentSlots: FloorGallerySlot[] = isBabyFloor
    ? data.floorGalleries?.babyFloor || []
    : data.floorGalleries?.womensFloor || [];

  // Carousel state
  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(true);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isSlideFading, setIsSlideFading] = useState<boolean>(false);

  // Full Gallery Modal state
  const [isGalleryOpen, setIsGalleryOpen] = useState<boolean>(false);
  const [galleryViewMode, setGalleryViewMode] = useState<'grid' | 'focus'>('grid');
  const [focusSlotIndex, setFocusSlotIndex] = useState<number>(0);

  // Reset active slide when floor changes
  useEffect(() => {
    setActiveSlideIndex(0);
    setFocusSlotIndex(0);
  }, [selectedFloorView]);

  // Next & Prev Slide for main carousel
  const handleNextSlide = useCallback(() => {
    if (currentSlots.length === 0 || isSlideFading) return;
    setIsSlideFading(true);
    setTimeout(() => {
      setActiveSlideIndex((prev) => (prev + 1) % currentSlots.length);
      setIsSlideFading(false);
    }, 200);
  }, [currentSlots.length, isSlideFading]);

  const handlePrevSlide = useCallback(() => {
    if (currentSlots.length === 0 || isSlideFading) return;
    setIsSlideFading(true);
    setTimeout(() => {
      setActiveSlideIndex((prev) => (prev - 1 + currentSlots.length) % currentSlots.length);
      setIsSlideFading(false);
    }, 200);
  }, [currentSlots.length, isSlideFading]);

  // Auto-slide effect (4.5 seconds per slide)
  useEffect(() => {
    if (!isAutoPlaying || isHovered || isGalleryOpen || currentSlots.length <= 1) return;

    const timer = setInterval(() => {
      handleNextSlide();
    }, 4500);

    return () => clearInterval(timer);
  }, [isAutoPlaying, isHovered, isGalleryOpen, currentSlots.length, handleNextSlide]);

  // Open Full Gallery Modal
  const openGalleryModal = (mode: 'grid' | 'focus' = 'grid', slotIndex: number = activeSlideIndex) => {
    setFocusSlotIndex(slotIndex);
    setGalleryViewMode(mode);
    setIsGalleryOpen(true);
  };

  // Keyboard navigation inside modal
  useEffect(() => {
    if (!isGalleryOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsGalleryOpen(false);
      } else if (e.key === 'ArrowRight') {
        setFocusSlotIndex((prev) => (prev + 1) % currentSlots.length);
      } else if (e.key === 'ArrowLeft') {
        setFocusSlotIndex((prev) => (prev - 1 + currentSlots.length) % currentSlots.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isGalleryOpen, currentSlots.length]);

  const activeSlot: FloorGallerySlot | undefined = currentSlots[activeSlideIndex] || currentSlots[0];
  const focusedSlot: FloorGallerySlot | undefined = currentSlots[focusSlotIndex] || currentSlots[0];

  const handleWhatsAppInquiry = (slot: FloorGallerySlot) => {
    const message = encodeURIComponent(
      `Hello Brand Shop! I am interested in inquiring about the floor piece "${slot.title}" from the ${selectedFloorView}. Please share availability and details.`
    );
    const cleanPhone = data.brand.whatsappNumber.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
  };

  return (
    <section
      id="floor-gallery-section"
      className="relative w-full py-24 px-6 md:px-12 lg:px-16 select-none bg-gradient-to-b from-transparent via-white/80 to-white"
    >
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-neutral-200/90 text-neutral-800 text-xs tracking-[0.25em] uppercase font-semibold shadow-sm">
            <Layers className="w-3.5 h-3.5 text-amber-800" />
            <span>Atelier Floor Visual Archives</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-display font-light text-neutral-900 tracking-tight">
            Curated 10-Piece Floor Showcase
          </h2>

          <p className="text-xs md:text-sm text-neutral-600 font-light leading-relaxed">
            Our atelier showcases 10 bespoke high-resolution pieces per floor. The gallery slides automatically below—click any image or slider to explore all 10 in full gallery view.
          </p>
        </div>

        {/* Floor Switcher & Admin Control Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-2 rounded-2xl bg-white/90 border border-neutral-200/80 shadow-sm backdrop-blur-md">
          {/* Floor Selection Tabs */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setSelectedFloorView('1st Floor')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2.5 px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                isBabyFloor
                  ? 'bg-neutral-900 text-white shadow-md'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100/70'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>1st Floor – Baby & Kids (10 Slots)</span>
            </button>

            <button
              onClick={() => setSelectedFloorView('2nd Floor')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2.5 px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                !isBabyFloor
                  ? 'bg-neutral-900 text-white shadow-md'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100/70'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>2nd Floor – Women’s Collection (10 Slots)</span>
            </button>
          </div>

          {/* Controls: Auto-play toggle & Full Gallery Modal button */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-neutral-700 hover:text-neutral-950 bg-neutral-100 hover:bg-neutral-200/80 transition-colors cursor-pointer"
              title={isAutoPlaying ? 'Pause automatic sliding' : 'Resume automatic sliding'}
            >
              {isAutoPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5 text-neutral-600" />
                  <span className="hidden md:inline">Auto-Sliding Active</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 text-amber-800" />
                  <span className="hidden md:inline">Resume Auto-Slide</span>
                </>
              )}
            </button>

            <button
              onClick={() => openGalleryModal('grid')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-neutral-900 hover:text-black bg-amber-100/80 hover:bg-amber-200/80 border border-amber-200/80 transition-all cursor-pointer shadow-sm"
            >
              <LayoutGrid className="w-3.5 h-3.5 text-amber-900" />
              <span>View All 10 in Gallery</span>
            </button>
          </div>
        </div>

        {/* ================= MAIN 10-IMAGE SMOOTH AUTO-SLIDER ================= */}
        {activeSlot && (
          <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="relative rounded-3xl overflow-hidden bg-white/80 border border-white shadow-[0_20px_50px_rgba(0,0,0,0.06)] backdrop-blur-xl p-4 sm:p-6 md:p-8 transition-all"
          >
            {/* Ambient Pastel Glow Behind Carousel Card */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] rounded-full filter blur-[120px] opacity-40 pointer-events-none bg-gradient-to-r from-[#ffe8df] via-[#f7edf9] to-[#e3f2fd]" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Column: Garment Information & Direct Controls */}
              <div
                className={`lg:col-span-5 space-y-5 transition-all duration-300 ${
                  isSlideFading ? 'opacity-0 -translate-x-3' : 'opacity-100 translate-x-0'
                }`}
              >
                {/* Slot Tag & Floor */}
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-neutral-900 text-white text-[10px] font-mono tracking-widest uppercase font-semibold">
                    SLOT {activeSlot.slotNumber < 10 ? `0${activeSlot.slotNumber}` : activeSlot.slotNumber} / 10
                  </span>
                  <span className="text-xs text-neutral-500 font-medium uppercase tracking-wider">
                    {selectedFloorView}
                  </span>
                </div>

                {/* Garment Title */}
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-display font-light text-neutral-900 leading-tight">
                  {activeSlot.title}
                </h3>

                {/* Subtitle / Description */}
                {activeSlot.subtitle && (
                  <p className="text-xs sm:text-sm text-neutral-600 font-light leading-relaxed">
                    {activeSlot.subtitle}
                  </p>
                )}

                {/* Direct Action Buttons */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={() => openGalleryModal('focus', activeSlideIndex)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold uppercase tracking-wider transition-all duration-200 shadow-md cursor-pointer hover:scale-[1.01]"
                  >
                    <Maximize2 className="w-3.5 h-3.5 text-amber-300" />
                    <span>Open High-Res Gallery</span>
                  </button>

                  <button
                    onClick={() => openGalleryModal('grid')}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white hover:bg-neutral-100 border border-neutral-300 text-neutral-800 text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-sm"
                  >
                    <LayoutGrid className="w-3.5 h-3.5 text-amber-800" />
                    <span>Show All 10 Slots</span>
                  </button>
                </div>

                {/* WhatsApp Concierge Order Button */}
                <button
                  onClick={() => handleWhatsAppInquiry(activeSlot)}
                  className="flex items-center gap-2 text-xs text-neutral-600 hover:text-emerald-700 transition-colors pt-1 cursor-pointer font-medium"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span>Inquire Availability on WhatsApp</span>
                </button>
              </div>

              {/* Right Column: Hero High-Resolution Image Viewport with Click-to-Gallery */}
              <div className="lg:col-span-7 relative flex items-center justify-center">
                <div
                  onClick={() => openGalleryModal('focus', activeSlideIndex)}
                  className="group relative w-full aspect-[4/3] sm:aspect-[16/10] md:aspect-[16/9] lg:aspect-[4/3] max-h-[58vh] rounded-2xl overflow-hidden bg-neutral-100 shadow-[0_15px_35px_rgba(0,0,0,0.08)] border border-white cursor-pointer"
                >
                  <img
                    src={activeSlot.imageUrl}
                    alt={activeSlot.title}
                    className={`w-full h-full object-cover object-center group-hover:scale-105 transition-all duration-700 ease-out ${
                      isSlideFading ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
                    }`}
                  />

                  {/* Soft Vignette Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                  {/* Click Cue Hover Badge */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-[2px] bg-black/20">
                    <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/95 text-neutral-900 text-xs font-semibold uppercase tracking-wider shadow-xl transform translate-y-2 group-hover:translate-y-0 transition-transform">
                      <Maximize2 className="w-4 h-4 text-amber-800" />
                      <span>Click to open full 10-image gallery</span>
                    </div>
                  </div>

                  {/* Bottom Caption Pill on image */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                    <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-mono tracking-wider">
                      {activeSlideIndex + 1} / 10 · {activeSlot.title}
                    </span>
                    <span className="hidden sm:inline-block px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-neutral-900 text-[10px] font-semibold uppercase tracking-wider">
                      Click Image for Full View
                    </span>
                  </div>
                </div>

                {/* Left & Right Arrow Buttons */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrevSlide();
                  }}
                  className="absolute -left-3 sm:-left-5 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/95 hover:bg-white text-neutral-800 shadow-xl border border-neutral-200 transition-all cursor-pointer hover:scale-105"
                  aria-label="Previous Slide"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNextSlide();
                  }}
                  className="absolute -right-3 sm:-right-5 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/95 hover:bg-white text-neutral-800 shadow-xl border border-neutral-200 transition-all cursor-pointer hover:scale-105"
                  aria-label="Next Slide"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* 10 Segmented Progress / Indicator Bar */}
            <div className="relative z-10 pt-6 mt-6 border-t border-neutral-100 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 sm:gap-2 flex-1">
                {currentSlots.map((slot, idx) => (
                  <button
                    key={slot.id || idx}
                    onClick={() => {
                      setIsSlideFading(true);
                      setTimeout(() => {
                        setActiveSlideIndex(idx);
                        setIsSlideFading(false);
                      }, 150);
                    }}
                    className={`relative h-2 rounded-full transition-all duration-300 cursor-pointer ${
                      idx === activeSlideIndex
                        ? 'flex-[2.5] bg-neutral-900'
                        : 'flex-1 bg-neutral-200 hover:bg-neutral-400'
                    }`}
                    title={`Go to Slot ${idx + 1}: ${slot.title}`}
                  />
                ))}
              </div>

              <span className="text-xs font-mono text-neutral-500 tabular-nums pl-3">
                {String(activeSlideIndex + 1).padStart(2, '0')} / 10
              </span>
            </div>

            {/* 10-Thumbnail Carousel Bar */}
            <div className="relative z-10 pt-4 grid grid-cols-5 sm:grid-cols-10 gap-2">
              {currentSlots.map((slot, idx) => {
                const isActive = idx === activeSlideIndex;
                return (
                  <button
                    key={slot.id || `thumb-${idx}`}
                    onClick={() => {
                      setIsSlideFading(true);
                      setTimeout(() => {
                        setActiveSlideIndex(idx);
                        setIsSlideFading(false);
                      }, 150);
                    }}
                    className={`group relative aspect-[3/4] rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                      isActive
                        ? 'border-neutral-900 shadow-md scale-105'
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={slot.imageUrl}
                      alt={slot.title}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-0.5 right-0.5 px-1 rounded bg-black/70 text-[9px] font-mono text-white">
                      {String(slot.slotNumber).padStart(2, '0')}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ================= FULL GALLERY VIEW MODAL ================= */}
      {isGalleryOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-white/95 backdrop-blur-2xl animate-fade-in select-none overflow-hidden">
          {/* Top Navigation Bar */}
          <header className="h-16 px-6 md:px-10 border-b border-neutral-200 flex items-center justify-between shrink-0 bg-white/80">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <div>
                <h3 className="text-sm md:text-base font-display font-medium text-neutral-900 uppercase tracking-widest">
                  {selectedFloorView} · Visual Archive Gallery
                </h3>
                <p className="text-[11px] text-neutral-500 hidden sm:block">
                  10 Curated High-Resolution Pieces
                </p>
              </div>
            </div>

            {/* View Mode Switcher + Close Button */}
            <div className="flex items-center gap-3">
              <div className="flex items-center p-1 rounded-xl bg-neutral-100 border border-neutral-200 text-xs">
                <button
                  onClick={() => setGalleryViewMode('grid')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                    galleryViewMode === 'grid'
                      ? 'bg-white text-neutral-950 font-semibold shadow-sm'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>All 10 Images (Grid)</span>
                </button>

                <button
                  onClick={() => setGalleryViewMode('focus')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                    galleryViewMode === 'focus'
                      ? 'bg-white text-neutral-950 font-semibold shadow-sm'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Single Focus (Slide)</span>
                </button>
              </div>

              <button
                onClick={() => setIsGalleryOpen(false)}
                className="p-2 rounded-full hover:bg-neutral-100 text-neutral-600 hover:text-neutral-950 transition-colors cursor-pointer"
                title="Close Gallery (Esc)"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </header>

          {/* Modal Body: Grid View or Focus Slide View */}
          <div className="flex-1 overflow-y-auto p-6 md:p-10">
            {galleryViewMode === 'grid' ? (
              /* --- ALL 10 IMAGES GRID VIEW --- */
              <div className="max-w-7xl mx-auto space-y-6">
                <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
                  <span className="text-xs font-mono text-neutral-500 tracking-wider uppercase">
                    Exhibition Contact Sheet · 10 Curated Garments
                  </span>
                  <span className="text-xs text-neutral-400">
                    Click any image to view in high-resolution focus mode
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                  {currentSlots.map((slot, idx) => (
                    <div
                      key={slot.id || idx}
                      onClick={() => {
                        setFocusSlotIndex(idx);
                        setGalleryViewMode('focus');
                      }}
                      className="group flex flex-col rounded-2xl bg-white border border-neutral-200/90 p-2.5 shadow-sm hover:shadow-xl hover:border-neutral-400 transition-all duration-300 cursor-pointer overflow-hidden"
                    >
                      <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-neutral-100 mb-2.5">
                        <img
                          src={slot.imageUrl}
                          alt={slot.title}
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                        />
                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-mono font-semibold text-neutral-900 shadow-sm">
                          Slot {String(slot.slotNumber).padStart(2, '0')}
                        </div>
                        <div className="absolute inset-0 bg-neutral-900/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px]">
                          <Maximize2 className="w-5 h-5 text-white drop-shadow-md" />
                        </div>
                      </div>

                      <div className="space-y-1 px-1">
                        <h4 className="text-xs font-display font-medium text-neutral-900 line-clamp-1 group-hover:text-amber-800 transition-colors">
                          {slot.title}
                        </h4>
                        {slot.subtitle && (
                          <p className="text-[10px] text-neutral-500 line-clamp-2 leading-tight">
                            {slot.subtitle}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* --- SINGLE FOCUS SLIDE VIEW --- */
              <div className="max-w-5xl mx-auto h-full flex flex-col justify-between space-y-6">
                <div className="relative flex-1 min-h-[50vh] flex items-center justify-center">
                  {/* Left & Right Focus Controls */}
                  <button
                    onClick={() =>
                      setFocusSlotIndex(
                        (prev) => (prev - 1 + currentSlots.length) % currentSlots.length
                      )
                    }
                    className="absolute left-0 sm:-left-6 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/90 hover:bg-white text-neutral-800 shadow-xl border border-neutral-200 transition-all cursor-pointer"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>

                  <button
                    onClick={() =>
                      setFocusSlotIndex((prev) => (prev + 1) % currentSlots.length)
                    }
                    className="absolute right-0 sm:-right-6 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/90 hover:bg-white text-neutral-800 shadow-xl border border-neutral-200 transition-all cursor-pointer"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>

                  {/* Main Large Focused Image */}
                  <div className="w-full max-w-2xl max-h-[60vh] aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border border-neutral-200 bg-neutral-100 flex items-center justify-center">
                    {focusedSlot && (
                      <img
                        src={focusedSlot.imageUrl}
                        alt={focusedSlot.title}
                        className="w-full h-full object-contain"
                      />
                    )}
                  </div>
                </div>

                {/* Focused Details & WhatsApp Inquire */}
                {focusedSlot && (
                  <div className="p-4 sm:p-6 rounded-2xl bg-white border border-neutral-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-neutral-900 text-white text-[10px] font-mono">
                          Slot {String(focusedSlot.slotNumber).padStart(2, '0')} / 10
                        </span>
                        <span className="text-xs text-amber-800 font-medium">{selectedFloorView}</span>
                      </div>
                      <h4 className="text-xl font-display font-medium text-neutral-900">
                        {focusedSlot.title}
                      </h4>
                      {focusedSlot.subtitle && (
                        <p className="text-xs text-neutral-600 max-w-xl">
                          {focusedSlot.subtitle}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <button
                        onClick={() => handleWhatsAppInquiry(focusedSlot)}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold uppercase tracking-wider transition-colors shadow-md cursor-pointer"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>Order via WhatsApp</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Bottom 10-Item Thumbnail Strip */}
                <div className="grid grid-cols-10 gap-2 pt-2">
                  {currentSlots.map((slot, idx) => (
                    <button
                      key={slot.id || `focus-thumb-${idx}`}
                      onClick={() => setFocusSlotIndex(idx)}
                      className={`relative aspect-[3/4] rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                        idx === focusSlotIndex
                          ? 'border-neutral-900 shadow-md scale-105'
                          : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={slot.imageUrl}
                        alt={slot.title}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-0.5 right-0.5 px-1 rounded bg-black/70 text-[9px] font-mono text-white">
                        {String(slot.slotNumber).padStart(2, '0')}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
