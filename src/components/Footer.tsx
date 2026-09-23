import React from 'react';
import { useCms } from '../context/CmsContext';
import { ArrowUp, Sliders } from 'lucide-react';

export const Footer: React.FC = () => {
  const { data, setActiveCollectionId, setIsAdminOpen, isAuthorizedDevice, isFirstDeviceSetup } = useCms();
  const { brand } = data;
  const [secretClicks, setSecretClicks] = React.useState(0);

  const handleSecretTrigger = () => {
    const next = secretClicks + 1;
    if (next >= 3) {
      setIsAdminOpen(true);
      setSecretClicks(0);
    } else {
      setSecretClicks(next);
      setTimeout(() => setSecretClicks(0), 1200);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative border-t border-neutral-200/80 bg-white/70 backdrop-blur-2xl py-16 px-6 md:px-12 lg:px-16 text-neutral-600 select-none">
      <div className="max-w-7xl mx-auto w-full space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Brand Column */}
          <div className="md:col-span-4 space-y-4">
            <h3 className="text-2xl font-display font-light text-neutral-900 tracking-widest uppercase">
              {brand.brandName}
            </h3>
            <p className="text-xs uppercase tracking-[0.25em] text-amber-800 font-semibold">
              {brand.tagline}
            </p>
            <p className="text-xs text-neutral-600 font-light leading-relaxed max-w-sm">
              An international digital showroom bridging contemporary Western couture,
              regal Bangladeshi heritage handlooms, and heirloom organic baby apparel.
            </p>
          </div>

          {/* Showroom Architecture Column */}
          <div className="md:col-span-3 space-y-3 text-xs">
            <h4 className="font-semibold uppercase tracking-wider text-neutral-900">
              Flagship Atelier
            </h4>
            <div className="space-y-1.5">
              <button
                onClick={() => {
                  setActiveCollectionId('baby');
                  scrollToTop();
                }}
                className="text-left text-neutral-700 hover:text-amber-800 block transition-colors font-medium cursor-pointer"
              >
                1st Floor · {brand.floor1Name}
              </button>
              <p className="text-[11px] text-neutral-500">
                Sensory baby knitwear, newborn organic sets & christening wear.
              </p>
            </div>

            <div className="space-y-1.5 pt-2">
              <button
                onClick={() => {
                  setActiveCollectionId('womens');
                  scrollToTop();
                }}
                className="text-left text-neutral-700 hover:text-amber-800 block transition-colors font-medium cursor-pointer"
              >
                2nd Floor · {brand.floor2Name}
              </button>
              <p className="text-[11px] text-neutral-500">
                Haute couture silhouettes, evening gowns & royal Dhakai Jamdani weaves.
              </p>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="md:col-span-2 space-y-3 text-xs">
            <h4 className="font-semibold uppercase tracking-wider text-neutral-900">
              Navigation
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => {
                    setActiveCollectionId('baby');
                    scrollToTop();
                  }}
                  className="hover:text-neutral-900 transition-colors cursor-pointer"
                >
                  1st Floor – Baby & Kids
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveCollectionId('womens');
                    scrollToTop();
                  }}
                  className="hover:text-neutral-900 transition-colors cursor-pointer"
                >
                  2nd Floor – Women’s Collection
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    const el = document.getElementById('floor-gallery-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-neutral-900 transition-colors cursor-pointer"
                >
                  Curated Floor Galleries
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    const el = document.getElementById('showroom-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-neutral-900 transition-colors cursor-pointer"
                >
                  Physical 2-Floor Atelier
                </button>
              </li>
              {isFirstDeviceSetup && (
                <li>
                  <button
                    onClick={() => setIsAdminOpen(true)}
                    className="hover:text-amber-800 transition-colors flex items-center gap-1 text-amber-700 cursor-pointer font-medium text-xs"
                  >
                    <Sliders className="w-3 h-3 text-amber-700" />
                    <span>Admin Setup (First Device)</span>
                  </button>
                </li>
              )}
              {!isFirstDeviceSetup && isAuthorizedDevice && (
                <li>
                  <button
                    onClick={() => setIsAdminOpen(true)}
                    className="hover:text-neutral-900 transition-colors flex items-center gap-1 text-neutral-500 cursor-pointer font-medium text-xs"
                  >
                    <Sliders className="w-3 h-3 text-amber-700" />
                    <span>Atelier CMS</span>
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Location & Socials */}
          <div className="md:col-span-3 space-y-3 text-xs">
            <h4 className="font-semibold uppercase tracking-wider text-neutral-900">
              Boutique Location
            </h4>
            <p className="text-neutral-700">{brand.address}</p>
            <p className="text-neutral-500">{brand.city}</p>
            <p className="text-neutral-500">{brand.openingHours}</p>

            {/* Concierge Email */}
            <div className="pt-1">
              <span className="text-[10px] uppercase tracking-wider text-neutral-400 block font-semibold">
                Official Concierge Email:
              </span>
              <a
                href={`mailto:${brand.email}`}
                className="text-neutral-900 font-mono hover:text-amber-800 transition-colors font-medium"
              >
                {brand.email}
              </a>
            </div>

            <div className="pt-2 flex items-center gap-4 text-xs tracking-wider uppercase text-amber-800 font-semibold">
              <a
                href={brand.socialLinks.instagram}
                target="_blank"
                rel="noreferrer"
                className="hover:underline"
              >
                Instagram
              </a>
              <a
                href={brand.socialLinks.facebook}
                target="_blank"
                rel="noreferrer"
                className="hover:underline"
              >
                Facebook
              </a>
              <a
                href={brand.socialLinks.whatsapp}
                target="_blank"
                rel="noreferrer"
                className="hover:underline"
              >
                WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Sub-Bar */}
        <div className="pt-8 border-t border-neutral-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <div
            onClick={handleSecretTrigger}
            className="cursor-default select-none transition-colors hover:text-neutral-700"
            title="Brand Shop Atelier · Official Digital Boutique"
          >
            © {new Date().getFullYear()} {brand.brandName}. Baby & Women's Apparel. All Rights Reserved.
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 hover:text-neutral-900 transition-colors cursor-pointer font-medium"
          >
            <span>Back to Top</span>
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
};
