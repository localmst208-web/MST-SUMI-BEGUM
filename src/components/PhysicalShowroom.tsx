import React, { useState } from 'react';
import { useCms } from '../context/CmsContext';
import { showroomArchImg } from '../data/initialData';
import {
  Layers,
  MapPin,
  Clock,
  Phone,
  MessageCircle,
  ArrowRight,
  Compass,
  CheckCircle2,
} from 'lucide-react';

interface PhysicalShowroomProps {
  onSelectFloorCollection: (collectionId: string) => void;
}

export const PhysicalShowroom: React.FC<PhysicalShowroomProps> = ({
  onSelectFloorCollection,
}) => {
  const { data } = useCms();
  const { brand } = data;

  const [activeFloor, setActiveFloor] = useState<'1st' | '2nd'>('2nd');

  return (
    <section
      id="physical-showroom-section"
      className="relative min-h-screen w-full py-28 px-6 md:px-12 lg:px-16 flex flex-col justify-center select-none"
    >
      <div className="max-w-7xl mx-auto w-full space-y-16">
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-neutral-200 text-amber-800 text-xs tracking-[0.25em] uppercase font-semibold shadow-sm">
            <Compass className="w-3.5 h-3.5" />
            <span>Banani Flagship Atelier</span>
          </div>

          <h2 className="text-4xl md:text-6xl font-display font-light text-neutral-900 tracking-tight">
            The Physical Showroom
          </h2>

          <p className="text-sm md:text-base text-neutral-600 font-light leading-relaxed">
            Step through our two-story architectural space in Banani, Dhaka. Designed
            with limestone surfaces, warm cove illumination, and private viewing salons.
          </p>
        </div>

        {/* Interactive Floor Elevation Switcher */}
        <div className="flex justify-center">
          <div className="inline-flex p-1.5 rounded-2xl bg-neutral-100 border border-neutral-200 shadow-sm">
            <button
              onClick={() => setActiveFloor('2nd')}
              className={`flex items-center gap-3 px-6 py-3 rounded-xl text-xs font-semibold tracking-wider uppercase transition-all duration-300 cursor-pointer ${
                activeFloor === '2nd'
                  ? 'bg-neutral-900 text-white shadow-md'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-600" />
              <span>2nd Floor · Women’s Collection</span>
            </button>

            <button
              onClick={() => setActiveFloor('1st')}
              className={`flex items-center gap-3 px-6 py-3 rounded-xl text-xs font-semibold tracking-wider uppercase transition-all duration-300 cursor-pointer ${
                activeFloor === '1st'
                  ? 'bg-neutral-900 text-white shadow-md'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-600" />
              <span>1st Floor · Baby & Kids</span>
            </button>
          </div>
        </div>

        {/* 3D Floor Plan & Visual Architecture Experience */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white/80 border border-neutral-200/80 rounded-3xl p-8 lg:p-12 backdrop-blur-md shadow-sm">
          {/* Visual Showcase of Selected Floor */}
          <div className="lg:col-span-7 relative h-[420px] md:h-[500px] rounded-2xl overflow-hidden shadow-xl group">
            <img
              src={showroomArchImg}
              alt="Brand Shop Showroom Interior"
              className="w-full h-full object-cover transform transition-transform duration-1000 group-hover:scale-105 filter brightness-95"
            />
            {/* Cinematic Scrim */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            {/* Floating Level Spatial Tag */}
            <div className="absolute top-6 left-6 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-amber-200 text-xs tracking-widest font-mono">
              <Layers className="w-3.5 h-3.5" />
              <span>{activeFloor === '2nd' ? 'LEVEL 02 ARCHITECTURE' : 'LEVEL 01 ARCHITECTURE'}</span>
            </div>

            {/* Bottom Caption */}
            <div className="absolute bottom-6 left-6 right-6 space-y-2">
              <h3 className="text-2xl md:text-3xl font-display font-light text-white">
                {activeFloor === '2nd' ? brand.floor2Name : brand.floor1Name}
              </h3>
              <p className="text-xs md:text-sm text-neutral-200 font-light leading-relaxed">
                {activeFloor === '2nd' ? brand.floor2Description : brand.floor1Description}
              </p>
            </div>
          </div>

          {/* Details & Direct Experience Entry */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-3">
              <span className="text-xs uppercase tracking-[0.25em] text-amber-800 font-semibold">
                Floor Highlights
              </span>
              <h4 className="text-2xl font-serif text-neutral-900">
                {activeFloor === '2nd'
                  ? 'Haute Silhouettes & Cultural Heritage'
                  : 'Sensory Comfort for Infants & Newborns'}
              </h4>
            </div>

            <ul className="space-y-3.5 text-xs md:text-sm text-neutral-700">
              {activeFloor === '2nd' ? (
                <>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-amber-800 mt-0.5 shrink-0" />
                    <span>Private bridal & couture consultation suites with personalized stylist.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-amber-800 mt-0.5 shrink-0" />
                    <span>Dhakai Jamdani heritage archive featuring master-weaver handlooms.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-amber-800 mt-0.5 shrink-0" />
                    <span>European bias-cut silk evening gowns with custom tailoring fittings.</span>
                  </li>
                </>
              ) : (
                <>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-amber-800 mt-0.5 shrink-0" />
                    <span>GOTS certified organic cashmere & hypo-allergenic soft touch textiles.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-amber-800 mt-0.5 shrink-0" />
                    <span>Hand-embroidered French knot heirloom christening & birthday frocks.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-amber-800 mt-0.5 shrink-0" />
                    <span>Quiet nursing lounge and infant measurement fitting station.</span>
                  </li>
                </>
              )}
            </ul>

            {/* Direct Teleport to Floating 3D Collection for this Floor */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {activeFloor === '2nd' ? (
                <button
                  onClick={() => onSelectFloorCollection('womens')}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-neutral-900 text-white text-xs uppercase tracking-wider font-semibold hover:bg-neutral-800 transition-all shadow-md cursor-pointer"
                >
                  <span>Explore 2nd Floor – Women’s Collection</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => onSelectFloorCollection('baby')}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-neutral-900 text-white text-xs uppercase tracking-wider font-semibold hover:bg-neutral-800 transition-all shadow-md cursor-pointer"
                >
                  <span>Explore 1st Floor – Baby & Kids</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Store Information Cards */}
            <div className="pt-4 border-t border-neutral-200 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-neutral-600">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-neutral-900 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-amber-800" />
                  <span>Location</span>
                </div>
                <p>{brand.address}</p>
                <p>{brand.city}</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-neutral-900 font-medium">
                  <Clock className="w-3.5 h-3.5 text-amber-800" />
                  <span>Visiting Hours</span>
                </div>
                <p>{brand.openingHours}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
