import React, { useState } from 'react';
import { useCms } from '../context/CmsContext';
import { ShoppingBag, Menu, X, Sliders, Shield, Layers } from 'lucide-react';

interface NavbarProps {
  onNavigateSection: (sectionId: string) => void;
  activeSection: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  onNavigateSection,
  activeSection,
}) => {
  const {
    data,
    activeCollectionId,
    setActiveCollectionId,
    selectedFloorView,
    setSelectedFloorView,
    cart,
    setIsCartOpen,
    setIsAdminOpen,
    isAuthorizedDevice,
    isFirstDeviceSetup,
  } = useCms();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const handleNavClick = (section: string, collectionId?: string, floor?: '1st Floor' | '2nd Floor') => {
    if (collectionId) {
      setActiveCollectionId(collectionId);
    }
    if (floor) {
      setSelectedFloorView(floor);
    }
    onNavigateSection(section);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-40 h-20 px-6 md:px-12 flex items-center justify-between bg-white/80 backdrop-blur-xl border-b border-neutral-200/80 shadow-[0_2px_20px_rgba(0,0,0,0.02)] transition-all duration-300">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => handleNavClick('hero')}
          className="text-left group cursor-pointer"
        >
          <span className="font-display text-lg md:text-xl font-medium tracking-[0.2em] text-neutral-900 group-hover:text-amber-800 transition-colors uppercase">
            {data.brand.brandName}
          </span>
          <span className="block text-[10px] tracking-[0.25em] text-neutral-500 font-light uppercase">
            {data.brand.tagline}
          </span>
        </button>

        {/* Zone 2: Clean luxury text navigation links */}
        <nav className="hidden xl:flex items-center gap-7 text-xs font-medium tracking-[0.18em] uppercase">
          <button
            onClick={() => handleNavClick('products', 'baby', '1st Floor')}
            className={`transition-colors cursor-pointer py-1 relative ${
              activeSection === 'products' && activeCollectionId === 'baby'
                ? 'text-neutral-900 font-semibold'
                : 'text-neutral-600 hover:text-neutral-950'
            }`}
          >
            1st Floor – Baby & Kids
            {activeSection === 'products' && activeCollectionId === 'baby' && (
              <span className="absolute bottom-0 inset-x-0 h-[1.5px] bg-amber-800" />
            )}
          </button>

          <button
            onClick={() => handleNavClick('products', 'womens', '2nd Floor')}
            className={`transition-colors cursor-pointer py-1 relative ${
              activeSection === 'products' && activeCollectionId === 'womens'
                ? 'text-neutral-900 font-semibold'
                : 'text-neutral-600 hover:text-neutral-950'
            }`}
          >
            2nd Floor – Women’s Collection
            {activeSection === 'products' && activeCollectionId === 'womens' && (
              <span className="absolute bottom-0 inset-x-0 h-[1.5px] bg-amber-800" />
            )}
          </button>

          <button
            onClick={() => handleNavClick('gallery')}
            className={`transition-colors cursor-pointer py-1 relative ${
              activeSection === 'gallery'
                ? 'text-neutral-900 font-semibold'
                : 'text-neutral-600 hover:text-neutral-950'
            }`}
          >
            Curated Galleries
            {activeSection === 'gallery' && (
              <span className="absolute bottom-0 inset-x-0 h-[1.5px] bg-amber-800" />
            )}
          </button>

          <button
            onClick={() => handleNavClick('showroom')}
            className={`transition-colors cursor-pointer py-1 relative ${
              activeSection === 'showroom'
                ? 'text-neutral-900 font-semibold'
                : 'text-neutral-600 hover:text-neutral-950'
            }`}
          >
            2-Floor Atelier
            {activeSection === 'showroom' && (
              <span className="absolute bottom-0 inset-x-0 h-[1.5px] bg-amber-800" />
            )}
          </button>

          <button
            onClick={() => handleNavClick('about')}
            className={`transition-colors cursor-pointer py-1 relative ${
              activeSection === 'about'
                ? 'text-neutral-900 font-semibold'
                : 'text-neutral-600 hover:text-neutral-950'
            }`}
          >
            Philosophy
            {activeSection === 'about' && (
              <span className="absolute bottom-0 inset-x-0 h-[1.5px] bg-amber-800" />
            )}
          </button>

          <button
            onClick={() => handleNavClick('contact')}
            className={`transition-colors cursor-pointer py-1 relative ${
              activeSection === 'contact'
                ? 'text-neutral-900 font-semibold'
                : 'text-neutral-600 hover:text-neutral-950'
            }`}
          >
            Visit Banani
            {activeSection === 'contact' && (
              <span className="absolute bottom-0 inset-x-0 h-[1.5px] bg-amber-800" />
            )}
          </button>
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-3">
          {/* Floor Quick Gallery Switcher (compact) */}
          <div className="hidden md:flex items-center p-1 bg-neutral-100/90 rounded-full border border-neutral-200/80 text-[11px] font-medium">
            <button
              onClick={() => handleNavClick('products', 'baby', '1st Floor')}
              className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                activeCollectionId === 'baby'
                  ? 'bg-white text-neutral-900 shadow-sm font-semibold'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              1st Floor · Baby & Kids
            </button>
            <button
              onClick={() => handleNavClick('products', 'womens', '2nd Floor')}
              className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                activeCollectionId === 'womens'
                  ? 'bg-white text-neutral-900 shadow-sm font-semibold'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              2nd Floor · Women’s
            </button>
          </div>

          {/* Admin CMS Access - Hidden from regular visitors; only visible during first-device setup or on authorized admin device */}
          {isFirstDeviceSetup && (
            <button
              onClick={() => setIsAdminOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 text-xs tracking-wider font-semibold transition-all duration-200 cursor-pointer shadow-sm animate-pulse"
              title="First-Device CMS Admin Setup"
            >
              <Shield className="w-3.5 h-3.5 text-amber-800" />
              <span>Admin Setup</span>
            </button>
          )}

          {!isFirstDeviceSetup && isAuthorizedDevice && (
            <button
              onClick={() => setIsAdminOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white text-xs tracking-wider font-medium transition-all duration-200 cursor-pointer shadow-sm"
              title="Authorized Master Admin Device"
            >
              <Shield className="w-3 h-3 text-amber-400" />
              <span className="hidden sm:inline text-[11px]">CMS</span>
            </button>
          )}

          {/* Cart Bag */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center justify-center p-2 rounded-full bg-neutral-100 hover:bg-neutral-200/80 border border-neutral-200 text-neutral-900 transition-all cursor-pointer shadow-sm"
            aria-label="Shopping Bag"
          >
            <ShoppingBag className="w-4 h-4" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-neutral-900 text-white text-[10px] font-bold flex items-center justify-center tabular-nums">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 rounded-full bg-neutral-100 border border-neutral-200 text-neutral-800"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Menu - Clean Soft White Luxury */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 xl:hidden bg-white/95 backdrop-blur-2xl flex flex-col justify-between p-8 pt-24 animate-fade-in text-neutral-900">
          <div className="flex justify-end absolute top-6 right-6">
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-full bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-6 text-center">
            <p className="text-[11px] uppercase tracking-[0.3em] text-amber-800 font-semibold">
              Atelier Directory
            </p>

            <div className="flex flex-col gap-3.5 text-base font-medium tracking-wider uppercase">
              <button
                onClick={() => handleNavClick('products', 'baby', '1st Floor')}
                className="py-2.5 rounded-xl hover:bg-neutral-100 text-neutral-800"
              >
                1st Floor – Baby & Kids
              </button>
              <button
                onClick={() => handleNavClick('products', 'womens', '2nd Floor')}
                className="py-2.5 rounded-xl hover:bg-neutral-100 text-neutral-800"
              >
                2nd Floor – Women’s Collection
              </button>
              <button
                onClick={() => handleNavClick('gallery')}
                className="py-2.5 rounded-xl hover:bg-neutral-100 text-neutral-800"
              >
                Floor Galleries (10 Slots per floor)
              </button>
              <button
                onClick={() => handleNavClick('showroom')}
                className="py-2.5 rounded-xl hover:bg-neutral-100 text-neutral-800"
              >
                Physical 2-Floor Atelier
              </button>
              <button
                onClick={() => handleNavClick('about')}
                className="py-2.5 rounded-xl hover:bg-neutral-100 text-neutral-800"
              >
                Philosophy & Lineage
              </button>
              <button
                onClick={() => handleNavClick('contact')}
                className="py-2.5 rounded-xl hover:bg-neutral-100 text-neutral-800"
              >
                Visit Banani Boutique
              </button>
            </div>
          </div>

          <div className="pt-6 border-t border-neutral-200 flex items-center justify-between text-xs text-neutral-500">
            <span>Banani, Dhaka</span>
            {isFirstDeviceSetup && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsAdminOpen(true);
                }}
                className="flex items-center gap-1.5 text-amber-800 font-semibold"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Admin Setup</span>
              </button>
            )}
            {!isFirstDeviceSetup && isAuthorizedDevice && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsAdminOpen(true);
                }}
                className="flex items-center gap-1.5 text-neutral-900 font-semibold"
              >
                <Shield className="w-3.5 h-3.5 text-amber-600" />
                <span>CMS Admin</span>
              </button>
            )}
            {!isFirstDeviceSetup && !isAuthorizedDevice && (
              <span className="text-neutral-400 font-mono text-[11px]">+880 1712 345678</span>
            )}
          </div>
        </div>
      )}
    </>
  );
};
