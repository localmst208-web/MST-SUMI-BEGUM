import React from 'react';
import { useCms } from '../context/CmsContext';
import { Sparkles, Award, HeartHandshake, Scissors } from 'lucide-react';

export const AboutSection: React.FC = () => {
  const { data } = useCms();
  const { brand } = data;

  return (
    <section
      id="about-section"
      className="relative min-h-screen w-full py-28 px-6 md:px-12 lg:px-16 flex flex-col justify-center select-none"
    >
      <div className="max-w-6xl mx-auto w-full space-y-16">
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-neutral-200 text-amber-800 text-xs tracking-[0.25em] uppercase font-semibold shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Atelier Philosophy</span>
          </div>

          <h2 className="text-4xl md:text-6xl font-display font-light text-neutral-900 tracking-tight">
            The Art of Distinction
          </h2>

          <p className="text-sm md:text-base text-neutral-600 font-light leading-relaxed">
            Brand Shop was conceived as a dialogue between timeless international fashion
            and Bengal’s extraordinary six-hundred-year-old weaving lineage.
          </p>
        </div>

        {/* 4 Pillars of Craftsmanship */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-white/80 border border-neutral-200/80 shadow-sm space-y-4 hover:border-neutral-300 transition-colors">
            <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-800 flex items-center justify-center border border-amber-200/50">
              <Scissors className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-serif text-neutral-900">Bespoke Silhouette</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Every couture piece is cut with anatomical precision, draped in three dimensions
              to honor fluid movement and effortless modern grace.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/80 border border-neutral-200/80 shadow-sm space-y-4 hover:border-neutral-300 transition-colors">
            <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-800 flex items-center justify-center border border-amber-200/50">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-serif text-neutral-900">Heritage Handlooms</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Preserving rare Dhakai Jamdani and Rajshahi pure silk traditions by commissioning
              master artisans on ancestral wooden pit-looms.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/80 border border-neutral-200/80 shadow-sm space-y-4 hover:border-neutral-300 transition-colors">
            <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-800 flex items-center justify-center border border-amber-200/50">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-serif text-neutral-900">Purest Baby Textiles</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Crafted solely from unbleached organic cotton and fine Mongolian cashmere, gentle
              on delicate newborn skin with zero chemical irritants.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/80 border border-neutral-200/80 shadow-sm space-y-4 hover:border-neutral-300 transition-colors">
            <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-800 flex items-center justify-center border border-amber-200/50">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-serif text-neutral-900">Digital Showroom</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Reimagining luxury retail through high-resolution editorial presentation—letting clients
              inspect textiles, folds, and silhouettes from anywhere in the world.
            </p>
          </div>
        </div>

        {/* Curatorial Quote Banner */}
        <div className="p-8 md:p-12 rounded-3xl bg-white/80 border border-neutral-200/80 shadow-sm text-center space-y-4 max-w-4xl mx-auto">
          <p className="font-serif text-xl md:text-2xl text-neutral-800 italic leading-relaxed">
            "Clothing is the architecture we carry on our skin. From an infant’s first delicate
            romper to the regal grace of a hand-woven saree, each garment should evoke dignity and wonder."
          </p>
          <div className="text-xs uppercase tracking-[0.25em] text-amber-800 font-semibold pt-2">
            — {brand.brandName} Atelier Manifesto
          </div>
        </div>
      </div>
    </section>
  );
};
