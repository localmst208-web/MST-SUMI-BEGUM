import React, { useState } from 'react';
import { CmsProvider, useCms } from './context/CmsContext';
import { WelcomeIntro } from './components/WelcomeIntro';
import { Navbar } from './components/Navbar';
import { ContinuousBackground } from './components/ContinuousBackground';
import { FloatingProductShowroom } from './components/FloatingProductShowroom';
import { FloorGalleryShowcase } from './components/FloorGalleryShowcase';
import { PhysicalShowroom } from './components/PhysicalShowroom';
import { AboutSection } from './components/AboutSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { ProductDetailModal } from './components/ProductDetailModal';
import { ShoppingBagDrawer } from './components/ShoppingBagDrawer';
import { AdminLoginModal } from './components/admin/AdminLoginModal';
import { AdminDashboard } from './components/admin/AdminDashboard';

const MainShowroomApp: React.FC = () => {
  const {
    data,
    activeCollectionId,
    setActiveCollectionId,
    hasCompletedIntro,
    setHasCompletedIntro,
  } = useCms();

  const [activeSection, setActiveSection] = useState('products');

  const currentCollection =
    data.collections.find((c) => c.id === activeCollectionId) || data.collections[0];

  const handleNavigateSection = (sectionId: string) => {
    setActiveSection(sectionId);
    if (sectionId === 'hero' || sectionId === 'products') {
      const el = document.getElementById('floating-product-stage');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (sectionId === 'gallery') {
      const el = document.getElementById('floor-gallery-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (sectionId === 'showroom') {
      const el = document.getElementById('physical-showroom-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (sectionId === 'about') {
      const el = document.getElementById('about-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (sectionId === 'contact') {
      const el = document.getElementById('contact-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectFloorCollection = (collectionId: string) => {
    setActiveCollectionId(collectionId);
    const el = document.getElementById('floating-product-stage');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen text-neutral-900 bg-[#faf9f6] selection:bg-amber-200 selection:text-neutral-900 overflow-x-hidden font-sans">
      {/* 1. Full-Screen Cinematic Welcome Intro */}
      {!hasCompletedIntro && data.welcomeIntro.isEnabled && (
        <WelcomeIntro onEnterShowroom={() => setHasCompletedIntro(true)} />
      )}

      {/* 2. One Continuous Soft Blurred Background (Does NOT flash on product change) */}
      <ContinuousBackground collection={currentCollection} bgImageUrl={data.welcomeIntro.bgImageUrl} />

      {/* 3. Transparent Floating Minimal Navbar */}
      <Navbar
        onNavigateSection={handleNavigateSection}
        activeSection={activeSection}
      />

      {/* 4. Main Product Experience (High-Resolution Couture Editorial Showcase) */}
      <FloatingProductShowroom
        onOpenShowroomMap={() => handleNavigateSection('showroom')}
      />

      {/* 5. Curated 10-Slot Floor Visual Archives (1st Floor Baby & 2nd Floor Women) */}
      <FloorGalleryShowcase />

      {/* 6. Physical Showroom Architecture Section (1st Floor Baby & 2nd Floor Women) */}
      <PhysicalShowroom
        onSelectFloorCollection={handleSelectFloorCollection}
      />

      {/* 7. Atelier Heritage & Craftsmanship */}
      <AboutSection />

      {/* 8. Boutique Contact & Private Appointment Booking */}
      <ContactSection />

      {/* 9. Showroom Footer */}
      <Footer />

      {/* Overlays & Modals */}
      <ProductDetailModal />
      <ShoppingBagDrawer />
      <AdminLoginModal />
      <AdminDashboard />
    </div>
  );
};

export default function App() {
  return (
    <CmsProvider>
      <MainShowroomApp />
    </CmsProvider>
  );
}
