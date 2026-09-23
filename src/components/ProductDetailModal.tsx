import React, { useState } from 'react';
import { useCms } from '../context/CmsContext';
import {
  X,
  ShoppingBag,
  MessageCircle,
  Sparkles,
  ShieldCheck,
  RotateCcw,
  Ruler,
  Check,
} from 'lucide-react';

export const ProductDetailModal: React.FC = () => {
  const { detailProduct, setDetailProduct, addToCart, data } = useCms();
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [addedAnimation, setAddedAnimation] = useState(false);

  if (!detailProduct) return null;

  const currentSize = selectedSize || detailProduct.sizes[0] || 'Standard';

  const handleAdd = () => {
    addToCart(detailProduct, currentSize, detailProduct.color);
    setAddedAnimation(true);
    setTimeout(() => {
      setAddedAnimation(false);
      setDetailProduct(null);
    }, 900);
  };

  const handleWhatsApp = () => {
    const msg = encodeURIComponent(
      `Hello Brand Shop! I would like to order the "${detailProduct.name}" (৳ ${detailProduct.price.toLocaleString()}) in size ${currentSize}. Please confirm delivery details.`
    );
    const cleanPhone = data.brand.whatsappNumber.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${cleanPhone}?text=${msg}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-neutral-900/50 backdrop-blur-md animate-fade-in select-none">
      <div
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white/95 border border-neutral-200 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 text-neutral-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setDetailProduct(null)}
          className="absolute top-6 right-6 p-2 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Left: Product Images & Texture Preview */}
          <div className="md:col-span-6 space-y-4">
            <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-neutral-100 border border-neutral-200 shadow-sm">
              <img
                src={detailProduct.images[activeImageIdx] || detailProduct.images[0]}
                alt={detailProduct.name}
                className="w-full h-full object-cover object-top filter brightness-100"
              />
              <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/80 backdrop-blur-md text-[11px] font-mono text-amber-800 uppercase tracking-widest font-semibold border border-neutral-200/80 shadow-sm">
                {detailProduct.floor}
              </div>
            </div>

            {/* Thumbnail switcher if multiple */}
            {detailProduct.images.length > 1 && (
              <div className="flex gap-2">
                {detailProduct.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIdx(idx)}
                    className={`w-16 h-20 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                      activeImageIdx === idx
                        ? 'border-amber-800 scale-105 shadow-sm'
                        : 'border-neutral-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="thumb" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Details & Purchase Form */}
          <div className="md:col-span-6 space-y-6">
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-[0.25em] text-amber-800 font-semibold">
                {detailProduct.category}
              </span>
              <h3 className="text-3xl font-display font-light text-neutral-900 leading-tight">
                {detailProduct.name}
              </h3>
              {detailProduct.subtitle && (
                <p className="text-xs text-neutral-500 font-light tracking-wide">
                  {detailProduct.subtitle}
                </p>
              )}
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-serif text-neutral-900 tracking-wide tabular-nums font-medium">
                ৳ {detailProduct.price.toLocaleString()}
              </span>
              {detailProduct.originalPrice && (
                <span className="text-sm text-neutral-400 line-through tabular-nums">
                  ৳ {detailProduct.originalPrice.toLocaleString()}
                </span>
              )}
            </div>

            <p className="text-xs md:text-sm text-neutral-600 font-light leading-relaxed">
              {detailProduct.description}
            </p>

            {/* Fabric & Material Specifications */}
            <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-amber-800 font-medium uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Textile & Fabric Architecture</span>
              </div>
              <p className="text-neutral-700 leading-relaxed">{detailProduct.fabricDetails}</p>
              <div className="pt-2 border-t border-neutral-200 text-neutral-600">
                <span className="text-neutral-900 font-medium">Artisan Craft:</span>{' '}
                {detailProduct.craftsmanship}
              </div>
              {detailProduct.careInstructions && (
                <div className="pt-1 text-neutral-600">
                  <span className="text-neutral-900 font-medium">Care:</span>{' '}
                  {detailProduct.careInstructions}
                </div>
              )}
            </div>

            {/* Sizes */}
            {detailProduct.sizes.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-neutral-500">
                  <span>Available Size:</span>
                  <span className="flex items-center gap-1 text-neutral-800 font-medium">
                    <Ruler className="w-3.5 h-3.5" /> Sizing Guaranteed
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {detailProduct.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`px-4 py-2 rounded-lg text-xs font-medium tracking-wide transition-all cursor-pointer ${
                        currentSize === s
                          ? 'bg-neutral-900 text-white font-bold shadow-sm'
                          : 'bg-neutral-100 border border-neutral-200 text-neutral-700 hover:border-neutral-400'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <button
                onClick={handleAdd}
                className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-full text-xs uppercase tracking-[0.2em] font-semibold transition-all duration-300 shadow-md cursor-pointer ${
                  addedAnimation
                    ? 'bg-emerald-600 text-white'
                    : 'bg-neutral-900 hover:bg-neutral-800 text-white'
                }`}
              >
                {addedAnimation ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
                <span>{addedAnimation ? 'Added to Bag' : 'Add to Shopping Bag'}</span>
              </button>

              <button
                onClick={handleWhatsApp}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs uppercase tracking-[0.2em] font-semibold transition-colors cursor-pointer shadow-sm"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>Instant Order via WhatsApp</span>
              </button>
            </div>

            {/* Trust Markers */}
            <div className="pt-4 border-t border-neutral-200 flex items-center justify-between text-[11px] text-neutral-500">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-800" />
                100% Authentic Quality
              </span>
              <span className="flex items-center gap-1.5">
                <RotateCcw className="w-3.5 h-3.5 text-amber-800" />
                Easy Exchange Policy
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
