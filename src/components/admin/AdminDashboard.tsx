import React, { useState, useRef } from 'react';
import { useCms } from '../../context/CmsContext';
import { Product, Collection } from '../../types';
import { showroomAudio } from '../../utils/audioSynthesizer';
import { FloorGalleriesManager } from './FloorGalleriesManager';
import softWhiteWaveBg from '../../assets/images/soft_white_3d_wave_bg_1790171220020.jpg';
import {
  X,
  Package,
  FolderTree,
  Sliders,
  Sparkles,
  Volume2,
  Building2,
  Smartphone,
  Plus,
  Trash2,
  Edit2,
  Save,
  RotateCcw,
  Check,
  Play,
  Square,
  Upload,
  Download,
  Eye,
  Layers,
  ShieldCheck,
  Shield,
  Copy,
  KeyRound,
  Image as ImageIcon,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    data,
    isAdminOpen,
    setIsAdminOpen,
    isAdminAuthenticated,
    setIsAdminAuthenticated,
    isAuthorizedDevice,
    authorizeCurrentDevice,
    deauthorizeCurrentDevice,
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
    replayIntro,
    setActiveCollectionId,
    setActiveProductId,
  } = useCms();

  const [activeTab, setActiveTab] = useState<
    'floor-galleries' | 'products' | 'collections' | 'intro' | 'audio' | 'brand' | 'mobile' | 'data'
  >('floor-galleries');

  // Product Editing / Adding State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);

  // Collection Editing / Adding State
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);
  const [isAddingCollection, setIsAddingCollection] = useState(false);

  // Audio testing state
  const [isPlayingAudioTest, setIsPlayingAudioTest] = useState(false);
  const [saveBanner, setSaveBanner] = useState(false);
  const [copiedAdminUrl, setCopiedAdminUrl] = useState(false);

  if (!isAdminOpen || !isAdminAuthenticated) return null;

  const triggerSaveNotification = () => {
    setSaveBanner(true);
    setTimeout(() => setSaveBanner(false), 2000);
  };

  const handleTestAudio = async () => {
    if (isPlayingAudioTest) {
      showroomAudio.stop();
      setIsPlayingAudioTest(false);
    } else {
      setIsPlayingAudioTest(true);
      await showroomAudio.playWelcomeAudio(
        data.welcomeAudio.audioUrl,
        data.welcomeAudio.volume,
        data.welcomeAudio.welcomeMessageText
      );
      setTimeout(() => setIsPlayingAudioTest(false), 8000);
    }
  };

  const handleClose = () => {
    setIsAdminOpen(false);
  };

  const handleLogout = () => {
    setIsAdminAuthenticated(false);
    setIsAdminOpen(false);
  };

  const handleExportJson = () => {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `brand_shop_cms_export_${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target?.result as string);
        if (parsed.products && parsed.collections) {
          localStorage.setItem('brand_shop_cms_state_v1', JSON.stringify(parsed));
          window.location.reload();
        } else {
          alert('Invalid CMS JSON format.');
        }
      } catch (err) {
        alert('Failed to parse JSON file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-neutral-900/50 backdrop-blur-md flex flex-col select-none animate-fade-in text-neutral-900">
      {/* Top Header Bar */}
      <header className="h-16 px-6 md:px-10 border-b border-neutral-200 bg-white flex items-center justify-between shrink-0 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-600 animate-pulse" />
          <h2 className="font-display font-medium text-base md:text-lg text-neutral-900 tracking-widest uppercase">
            {data.brand.brandName} · Atelier CMS & Showroom Control
          </h2>
          {saveBanner && (
            <span className="hidden sm:flex items-center gap-1 text-xs text-emerald-800 font-medium px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200">
              <Check className="w-3 h-3 text-emerald-600" /> Live Updates Synced
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setIsAdminOpen(false);
              replayIntro();
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-neutral-100 hover:bg-neutral-200/80 text-xs text-neutral-700 hover:text-neutral-950 border border-neutral-200 transition-colors cursor-pointer font-medium"
          >
            <Eye className="w-3.5 h-3.5 text-amber-800" />
            <span className="hidden md:inline">Preview Welcome Intro</span>
          </button>

          <button
            onClick={handleLogout}
            className="px-3.5 py-1.5 rounded-full bg-neutral-100 hover:bg-neutral-200/80 text-xs text-neutral-600 hover:text-neutral-950 border border-neutral-200 transition-colors cursor-pointer font-medium"
          >
            Lock Portal
          </button>

          <button
            onClick={handleClose}
            className="p-1.5 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Container with Sidebar + Workspace */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-[#faf9f6]">
        {/* Navigation Sidebar Tabs */}
        <nav className="w-full md:w-64 bg-white border-r border-neutral-200 p-4 md:p-6 flex md:flex-col gap-1.5 overflow-x-auto shrink-0 text-xs font-medium uppercase tracking-wider shadow-sm">
          {/* Floor Galleries Tab - Prompt specified: 10 image slots each for Baby & Women's */}
          <button
            onClick={() => setActiveTab('floor-galleries')}
            className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'floor-galleries'
                ? 'bg-neutral-900 text-white font-bold shadow-md'
                : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100'
            }`}
          >
            <Layers className="w-4 h-4 text-amber-600" />
            <span>Floor Galleries (10 Slots)</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'products'
                ? 'bg-neutral-900 text-white font-bold shadow-md'
                : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Products ({data.products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('collections')}
            className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'collections'
                ? 'bg-neutral-900 text-white font-bold shadow-md'
                : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100'
            }`}
          >
            <FolderTree className="w-4 h-4" />
            <span>Collections ({data.collections.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('intro')}
            className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'intro'
                ? 'bg-neutral-900 text-white font-bold shadow-md'
                : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Welcome Intro & Hero</span>
          </button>

          <button
            onClick={() => setActiveTab('audio')}
            className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'audio'
                ? 'bg-neutral-900 text-white font-bold shadow-md'
                : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100'
            }`}
          >
            <Volume2 className="w-4 h-4" />
            <span>Welcome Audio CMS</span>
          </button>

          <button
            onClick={() => setActiveTab('brand')}
            className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'brand'
                ? 'bg-neutral-900 text-white font-bold shadow-md'
                : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Showroom & Brand</span>
          </button>

          <button
            onClick={() => setActiveTab('mobile')}
            className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'mobile'
                ? 'bg-neutral-900 text-white font-bold shadow-md'
                : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Mobile Optimization</span>
          </button>

          <button
            onClick={() => setActiveTab('data')}
            className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'data'
                ? 'bg-neutral-900 text-white font-bold shadow-md'
                : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>Backup & Reset</span>
          </button>
        </nav>

        {/* Workspace Panels */}
        <main className="flex-1 overflow-y-auto p-6 md:p-10 bg-[#faf9f6]">
          {/* TAB 0: FLOOR GALLERIES (10 UPLOAD SLOTS FOR BABY & WOMEN'S) */}
          {activeTab === 'floor-galleries' && <FloorGalleriesManager />}

          {/* TAB 1: PRODUCTS */}
          {activeTab === 'products' && (
            <div className="space-y-6 max-w-5xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-display font-light text-white">
                    Clothing Products Portfolio
                  </h3>
                  <p className="text-xs text-neutral-400">
                    Add, edit, reorder, or upload GLB models and photos for 3D showroom presentation.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsAddingProduct(true);
                    setEditingProduct({
                      id: '',
                      name: 'New Atelier Garment',
                      subtitle: 'Limited Production',
                      category: 'Evening Gown',
                      collectionId: data.collections[0]?.id || 'womens',
                      price: 15000,
                      description: 'Exquisite tailored silhouette crafted from luxury textiles.',
                      fabricDetails: '100% Mulberry Silk / Virgin Wool Blend',
                      craftsmanship: 'Hand-draped atelier tailoring.',
                      color: 'Silk Ivory',
                      colorHex: '#f0ede6',
                      sizes: ['S', 'M', 'L'],
                      images: [data.products[0]?.images[0] || ''],
                      model3dPreset: 'evening-gown',
                      floor: '2nd Floor',
                      isFeatured: false,
                      isEnabled: true,
                      sortOrder: data.products.length + 1,
                    });
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 text-neutral-950 text-xs font-semibold uppercase tracking-wider hover:bg-white transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Product</span>
                </button>
              </div>

              {/* Product Form if Adding or Editing */}
              {(isAddingProduct || editingProduct) && (
                <div className="p-6 rounded-2xl bg-white/[0.04] border border-white/15 space-y-4 animate-fade-in">
                  <div className="flex justify-between items-center border-b border-white/10 pb-3">
                    <h4 className="text-sm font-semibold text-amber-200 tracking-wider uppercase">
                      {isAddingProduct ? 'Create New Product' : 'Edit Product Specifications'}
                    </h4>
                    <button
                      onClick={() => {
                        setIsAddingProduct(false);
                        setEditingProduct(null);
                      }}
                      className="text-neutral-400 hover:text-white text-xs"
                    >
                      Cancel
                    </button>
                  </div>

                  {editingProduct && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="space-y-1">
                        <label className="text-neutral-400">Garment Name</label>
                        <input
                          type="text"
                          value={editingProduct.name}
                          onChange={(e) =>
                            setEditingProduct({ ...editingProduct, name: e.target.value })
                          }
                          className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-neutral-400">Price (BDT ৳)</label>
                        <input
                          type="number"
                          value={editingProduct.price}
                          onChange={(e) =>
                            setEditingProduct({
                              ...editingProduct,
                              price: Number(e.target.value),
                            })
                          }
                          className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white font-mono"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-neutral-400">Collection</label>
                        <select
                          value={editingProduct.collectionId}
                          onChange={(e) =>
                            setEditingProduct({
                              ...editingProduct,
                              collectionId: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 rounded-lg bg-[#1a1a1e] border border-white/10 text-white"
                        >
                          {data.collections.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name} ({c.floor})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-neutral-400">Category Tag</label>
                        <input
                          type="text"
                          value={editingProduct.category}
                          onChange={(e) =>
                            setEditingProduct({
                              ...editingProduct,
                              category: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-neutral-400">Garment Color Accent</label>
                        <div className="flex gap-2">
                          <input
                            type="color"
                            value={editingProduct.colorHex}
                            onChange={(e) =>
                              setEditingProduct({
                                ...editingProduct,
                                colorHex: e.target.value,
                              })
                            }
                            className="w-10 h-8 rounded bg-transparent cursor-pointer"
                          />
                          <input
                            type="text"
                            value={editingProduct.colorHex}
                            onChange={(e) =>
                              setEditingProduct({
                                ...editingProduct,
                                colorHex: e.target.value,
                              })
                            }
                            className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white font-mono"
                          />
                        </div>
                      </div>

                      <div className="md:col-span-2 space-y-1">
                        <label className="text-neutral-400">Editorial Image URL</label>
                        <input
                          type="text"
                          value={editingProduct.images[0] || ''}
                          onChange={(e) =>
                            setEditingProduct({
                              ...editingProduct,
                              images: [e.target.value],
                            })
                          }
                          className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white font-mono"
                        />
                      </div>

                      <div className="md:col-span-2 space-y-1">
                        <label className="text-neutral-400">Description</label>
                        <textarea
                          rows={2}
                          value={editingProduct.description}
                          onChange={(e) =>
                            setEditingProduct({
                              ...editingProduct,
                              description: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-neutral-400">Fabric Composition</label>
                        <input
                          type="text"
                          value={editingProduct.fabricDetails}
                          onChange={(e) =>
                            setEditingProduct({
                              ...editingProduct,
                              fabricDetails: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-neutral-400">Artisan Craftsmanship</label>
                        <input
                          type="text"
                          value={editingProduct.craftsmanship}
                          onChange={(e) =>
                            setEditingProduct({
                              ...editingProduct,
                              craftsmanship: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
                        />
                      </div>

                      <div className="flex items-center gap-4 pt-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={editingProduct.isEnabled}
                            onChange={(e) =>
                              setEditingProduct({
                                ...editingProduct,
                                isEnabled: e.target.checked,
                              })
                            }
                          />
                          <span className="text-white">Active in Showroom</span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={editingProduct.isFeatured}
                            onChange={(e) =>
                              setEditingProduct({
                                ...editingProduct,
                                isFeatured: e.target.checked,
                              })
                            }
                          />
                          <span className="text-white">Featured Atelier Piece</span>
                        </label>
                      </div>

                      <div className="md:col-span-2 flex justify-end gap-3 pt-4 border-t border-white/10">
                        <button
                          type="button"
                          onClick={() => {
                            setIsAddingProduct(false);
                            setEditingProduct(null);
                          }}
                          className="px-4 py-2 rounded-full bg-white/5 text-neutral-300 hover:bg-white/10"
                        >
                          Cancel
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            if (isAddingProduct) {
                              addProduct(editingProduct);
                              setIsAddingProduct(false);
                            } else {
                              updateProduct(editingProduct);
                            }
                            setEditingProduct(null);
                            triggerSaveNotification();
                          }}
                          className="flex items-center gap-1.5 px-6 py-2 rounded-full bg-amber-100 text-neutral-950 font-semibold uppercase tracking-wider hover:bg-white"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>Save Garment</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Product Grid List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.products.map((prod) => (
                  <div
                    key={prod.id}
                    className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-3 hover:border-white/20 transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="aspect-[4/3] rounded-lg overflow-hidden bg-black/40 relative">
                        <img
                          src={prod.images[0]}
                          alt={prod.name}
                          className="w-full h-full object-cover object-top"
                        />
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/70 text-[10px] text-amber-200 uppercase font-mono">
                          {prod.floor}
                        </span>
                        {!prod.isEnabled && (
                          <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-rose-900/80 text-[10px] text-white">
                            Hidden
                          </span>
                        )}
                      </div>

                      <div className="space-y-1">
                        <div className="text-[11px] text-amber-200/80 uppercase font-medium">
                          {prod.collectionId} · {prod.category}
                        </div>
                        <h4 className="text-sm font-medium text-white line-clamp-1">
                          {prod.name}
                        </h4>
                        <div className="text-xs font-serif text-white tabular-nums">
                          ৳ {prod.price.toLocaleString()}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs">
                      <button
                        onClick={() => {
                          setActiveCollectionId(prod.collectionId);
                          setActiveProductId(prod.id);
                          setIsAdminOpen(false);
                        }}
                        className="text-amber-200 hover:underline cursor-pointer"
                      >
                        View in Showroom
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditingProduct(prod)}
                          className="p-1.5 rounded-md hover:bg-white/10 text-neutral-300 hover:text-white"
                          title="Edit product"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Delete ${prod.name}?`)) {
                              deleteProduct(prod.id);
                              triggerSaveNotification();
                            }
                          }}
                          className="p-1.5 rounded-md hover:bg-rose-500/20 text-neutral-400 hover:text-rose-400"
                          title="Delete product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: COLLECTIONS */}
          {activeTab === 'collections' && (
            <div className="space-y-6 max-w-4xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-display font-light text-white">
                    Showroom Collections
                  </h3>
                  <p className="text-xs text-neutral-400">
                    Manage 1st Floor – Baby & Kids, 2nd Floor – Women’s Collection, or configure seasonal releases.
                  </p>
                </div>
                <button
                  onClick={() => {
                    const newId = `col-${Date.now()}`;
                    addCollection({
                      id: newId,
                      name: 'Haute Bridal Collection',
                      navLabel: 'BRIDAL',
                      subtitle: 'CEREMONIAL LUXURY',
                      description: 'Grand ceremonial wedding couture and heirloom embellishments.',
                      floor: '2nd Floor',
                      bgType: 'image',
                      bgBlur: 24,
                      bgOverlayOpacity: 0.7,
                      ambientColor: '#20181b',
                      lightingPreset: 'royal-dusk',
                      accentColor: '#d4af37',
                      isEnabled: true,
                    });
                    triggerSaveNotification();
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 text-neutral-950 text-xs font-semibold uppercase tracking-wider hover:bg-white transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Collection</span>
                </button>
              </div>

              <div className="space-y-4">
                {data.collections.map((col) => (
                  <div
                    key={col.id}
                    className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: col.accentColor }}
                        />
                        <h4 className="text-base font-semibold text-white">{col.name}</h4>
                        <span className="text-xs font-mono text-amber-200">
                          [{col.floor}]
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setActiveCollectionId(col.id);
                            setIsAdminOpen(false);
                          }}
                          className="px-3 py-1 rounded-full bg-white/10 text-xs text-white hover:bg-white/20 cursor-pointer"
                        >
                          Switch to This Collection
                        </button>
                        {data.collections.length > 1 && (
                          <button
                            onClick={() => {
                              if (confirm(`Delete collection "${col.name}"?`)) {
                                deleteCollection(col.id);
                                triggerSaveNotification();
                              }
                            }}
                            className="p-1.5 text-neutral-500 hover:text-rose-400"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Collection Settings Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                      <div className="space-y-1">
                        <label className="text-neutral-400">Navigation Button Label</label>
                        <input
                          type="text"
                          value={col.navLabel}
                          onChange={(e) =>
                            updateCollection({ ...col, navLabel: e.target.value })
                          }
                          className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white font-mono"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-neutral-400">Floor Location</label>
                        <select
                          value={col.floor}
                          onChange={(e) =>
                            updateCollection({
                              ...col,
                              floor: e.target.value as '1st Floor' | '2nd Floor',
                            })
                          }
                          className="w-full px-3 py-2 rounded-lg bg-[#1a1a1e] border border-white/10 text-white"
                        >
                          <option value="1st Floor">1st Floor (Baby Boutique)</option>
                          <option value="2nd Floor">2nd Floor (Women's Salon)</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-neutral-400">Background Blur (px)</label>
                        <input
                          type="range"
                          min="0"
                          max="45"
                          value={col.bgBlur}
                          onChange={(e) =>
                            updateCollection({ ...col, bgBlur: Number(e.target.value) })
                          }
                          className="w-full accent-amber-200"
                        />
                        <span className="text-[11px] text-neutral-400">{col.bgBlur}px</span>
                      </div>

                      <div className="md:col-span-2 space-y-1">
                        <label className="text-neutral-400">Curatorial Subtitle</label>
                        <input
                          type="text"
                          value={col.subtitle}
                          onChange={(e) =>
                            updateCollection({ ...col, subtitle: e.target.value })
                          }
                          className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-neutral-400">Accent Lighting Color</label>
                        <input
                          type="color"
                          value={col.accentColor}
                          onChange={(e) =>
                            updateCollection({ ...col, accentColor: e.target.value })
                          }
                          className="w-full h-9 rounded bg-transparent cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: WELCOME INTRO & HERO */}
          {activeTab === 'intro' && (
            <div className="space-y-6 max-w-3xl">
              <div>
                <h3 className="text-xl font-display font-light text-white">
                  Welcome Intro Experience & Female Model
                </h3>
                <p className="text-xs text-neutral-400">
                  Configure opening cinematic sequence, typography, duration, and fashion model assets.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 space-y-4 text-xs">
                <label className="flex items-center gap-2 cursor-pointer pb-2">
                  <input
                    type="checkbox"
                    checked={data.welcomeIntro.isEnabled}
                    onChange={(e) => updateWelcomeIntro({ isEnabled: e.target.checked })}
                  />
                  <span className="text-white font-medium">Enable Welcome Intro on Site Open</span>
                </label>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-neutral-400">Intro Kicker Line</label>
                    <input
                      type="text"
                      value={data.welcomeIntro.brandTitle}
                      onChange={(e) => updateWelcomeIntro({ brandTitle: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-neutral-400">Brand Title Display</label>
                    <input
                      type="text"
                      value={data.welcomeIntro.brandName}
                      onChange={(e) => updateWelcomeIntro({ brandName: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white font-display"
                    />
                  </div>

                  <div className="md:col-span-2 space-y-1">
                    <label className="text-neutral-400">Subtitle / Tagline</label>
                    <input
                      type="text"
                      value={data.welcomeIntro.brandSubtitle}
                      onChange={(e) => updateWelcomeIntro({ brandSubtitle: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-neutral-400">Intro Duration (seconds)</label>
                    <input
                      type="number"
                      min="3"
                      max="15"
                      value={data.welcomeIntro.durationSeconds}
                      onChange={(e) =>
                        updateWelcomeIntro({ durationSeconds: Number(e.target.value) })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-neutral-400">Background Blur (px)</label>
                    <input
                      type="number"
                      min="0"
                      max="40"
                      value={data.welcomeIntro.bgBlur}
                      onChange={(e) =>
                        updateWelcomeIntro({ bgBlur: Number(e.target.value) })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white font-mono"
                    />
                  </div>

                  <div className="md:col-span-2 space-y-1">
                    <label className="text-neutral-400">Fashion Model Editorial Asset URL</label>
                    <input
                      type="text"
                      value={data.welcomeIntro.modelImageUrl}
                      onChange={(e) =>
                        updateWelcomeIntro({ modelImageUrl: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white font-mono"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <button
                    onClick={() => {
                      setIsAdminOpen(false);
                      replayIntro();
                    }}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-amber-100 text-neutral-950 font-semibold uppercase tracking-wider hover:bg-white transition-all cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Test Fullscreen Intro Now</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: WELCOME AUDIO */}
          {activeTab === 'audio' && (
            <div className="space-y-6 max-w-3xl">
              <div>
                <h3 className="text-xl font-display font-light text-white">
                  Showroom Welcome Audio Management
                </h3>
                <p className="text-xs text-neutral-400">
                  Upload custom MP3/WAV files, configure autoplay fallback button, and voice announcements.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 space-y-4 text-xs">
                <label className="flex items-center gap-2 cursor-pointer pb-2">
                  <input
                    type="checkbox"
                    checked={data.welcomeAudio.isEnabled}
                    onChange={(e) => updateWelcomeAudio({ isEnabled: e.target.checked })}
                  />
                  <span className="text-white font-medium">Enable Welcome Audio</span>
                </label>

                <div className="space-y-1">
                  <label className="text-neutral-400">Audio Title / Name</label>
                  <input
                    type="text"
                    value={data.welcomeAudio.audioName}
                    onChange={(e) => updateWelcomeAudio({ audioName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-neutral-400">
                    Uploaded Audio File URL (.MP3 or .WAV)
                  </label>
                  <input
                    type="text"
                    value={data.welcomeAudio.audioUrl}
                    onChange={(e) => updateWelcomeAudio({ audioUrl: e.target.value })}
                    placeholder="Leave empty to use high-end synthesized showroom chime & voice"
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white font-mono"
                  />
                  <p className="text-[11px] text-neutral-500">
                    Supports direct links to uploaded MP3/WAV or CDN audio. If empty, the engine uses Web Audio luxury harmonic chimes.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-neutral-300">Volume Level</span>
                    <span className="text-amber-200 font-mono">
                      {Math.round(data.welcomeAudio.volume * 100)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={data.welcomeAudio.volume}
                    onChange={(e) =>
                      updateWelcomeAudio({ volume: parseFloat(e.target.value) })
                    }
                    className="w-full accent-amber-200"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-neutral-400">
                    Autoplay Blocked Fallback Button Text
                  </label>
                  <input
                    type="text"
                    value={data.welcomeAudio.fallbackButtonText}
                    onChange={(e) =>
                      updateWelcomeAudio({ fallbackButtonText: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-neutral-400">Showroom Voice Announcement Script</label>
                  <textarea
                    rows={2}
                    value={data.welcomeAudio.welcomeMessageText}
                    onChange={(e) =>
                      updateWelcomeAudio({ welcomeMessageText: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
                  />
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center gap-3">
                  <button
                    onClick={handleTestAudio}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-amber-100 text-neutral-950 font-semibold uppercase tracking-wider hover:bg-white transition-all cursor-pointer"
                  >
                    {isPlayingAudioTest ? (
                      <>
                        <Square className="w-3.5 h-3.5 fill-current" />
                        <span>Stop Test Playback</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Preview Welcome Audio</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: BRAND & SHOWROOM */}
          {activeTab === 'brand' && (
            <div className="space-y-6 max-w-3xl">
              <div>
                <h3 className="text-xl font-display font-light text-white">
                  Brand Identity & Atelier Floors
                </h3>
                <p className="text-xs text-neutral-400">
                  Configure store address in Banani, contact phone, WhatsApp ordering number, and floor names.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 space-y-4 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-neutral-400">Brand Name</label>
                    <input
                      type="text"
                      value={data.brand.brandName}
                      onChange={(e) => updateBrand({ brandName: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white font-display"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-neutral-400">Brand Tagline</label>
                    <input
                      type="text"
                      value={data.brand.tagline}
                      onChange={(e) => updateBrand({ tagline: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-neutral-400">Official Concierge Email</label>
                    <input
                      type="email"
                      value={data.brand.email}
                      onChange={(e) => updateBrand({ email: e.target.value })}
                      placeholder="concierge@brandshop.com.bd"
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white font-mono text-sm focus:border-amber-400/50 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-neutral-400">WhatsApp Order Hotline</label>
                    <input
                      type="text"
                      value={data.brand.whatsappNumber}
                      onChange={(e) => updateBrand({ whatsappNumber: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-neutral-400">Customer Phone</label>
                    <input
                      type="text"
                      value={data.brand.phone}
                      onChange={(e) => updateBrand({ phone: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white font-mono"
                    />
                  </div>

                  <div className="md:col-span-2 space-y-1">
                    <label className="text-neutral-400">Atelier Physical Address</label>
                    <input
                      type="text"
                      value={data.brand.address}
                      onChange={(e) => updateBrand({ address: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
                    />
                  </div>

                  <div className="md:col-span-2 space-y-1">
                    <label className="text-neutral-400">Visiting & Concierge Hours</label>
                    <input
                      type="text"
                      value={data.brand.openingHours}
                      onChange={(e) => updateBrand({ openingHours: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
                    />
                  </div>

                  {/* CMS Admin Security & Device Authorization Panel */}
                  <div className="md:col-span-2 p-5 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300">
                          <ShieldCheck className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-white">
                            CMS Admin Security & Device Authorization
                          </h4>
                          <p className="text-[11px] text-amber-200/70">
                            Controls who can see and access the CMS administration console
                          </p>
                        </div>
                      </div>

                      {/* Device Status Badge */}
                      {isAuthorizedDevice ? (
                        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-semibold tracking-wider uppercase">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          Authorized Admin Device
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-semibold tracking-wider uppercase">
                          Unregistered Device
                        </span>
                      )}
                    </div>

                    {/* Public Visibility Reassurance */}
                    <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1.5 text-[11px]">
                      <div className="flex items-center gap-2 text-emerald-400 font-medium">
                        <Check className="w-3.5 h-3.5" />
                        <span>Visitor Shield Active: 100% Completely Hidden from Normal Users</span>
                      </div>
                      <p className="text-neutral-400 pl-5 text-[10px] leading-relaxed">
                        Regular customers and site visitors will never see any CMS Admin buttons, pills, or links anywhere on the public boutique website.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                      {/* Security Passcode */}
                      <div className="space-y-1.5">
                        <label className="text-amber-200 font-medium flex items-center gap-1">
                          <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                          <span>Master Passcode</span>
                        </label>
                        <input
                          type="text"
                          value={data.brand.adminPassword || '1980'}
                          onChange={(e) => updateBrand({ adminPassword: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-black/40 border border-amber-500/30 text-white font-mono text-xs focus:border-amber-400 focus:outline-none"
                          placeholder="1980"
                        />
                        <p className="text-[10px] text-neutral-400">
                          Passcode required to unlock this dashboard.
                        </p>
                      </div>

                      {/* Device Action Buttons */}
                      <div className="space-y-1.5 flex flex-col justify-end">
                        <label className="text-neutral-400 text-[11px]">Device Pairing Controls</label>
                        {isAuthorizedDevice ? (
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm('Are you sure you want to de-authorize this device? You can log in again using your passcode or direct URL.')) {
                                deauthorizeCurrentDevice();
                              }
                            }}
                            className="w-full py-2 px-3 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/40 text-rose-300 text-xs font-semibold transition-all cursor-pointer text-center"
                          >
                            De-authorize This Device
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => authorizeCurrentDevice()}
                            className="w-full py-2 px-3 rounded-lg bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 text-xs font-semibold transition-all cursor-pointer text-center"
                          >
                            Authorize This Device
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Private Admin Access Details */}
                    <div className="pt-2 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[11px]">
                      <div className="flex items-center gap-2 text-neutral-400">
                        <span>Private Admin Direct URL:</span>
                        <code className="text-amber-300 font-mono bg-black/50 px-2 py-0.5 rounded border border-white/10">
                          /?admin=portal
                        </code>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          const url = `${window.location.origin}/?admin=portal`;
                          navigator.clipboard.writeText(url).then(() => {
                            setCopiedAdminUrl(true);
                            setTimeout(() => setCopiedAdminUrl(false), 2000);
                          });
                        }}
                        className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium cursor-pointer transition-colors"
                      >
                        {copiedAdminUrl ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Copied to Clipboard!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-neutral-300" />
                            <span>Copy Private Admin Link</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="text-[10px] text-neutral-400 flex items-center justify-between pt-1">
                      <span>Secret Shortcut from any page:</span>
                      <span className="font-mono bg-white/10 px-2 py-0.5 rounded text-amber-200">
                        Ctrl + Shift + A
                      </span>
                    </div>
                  </div>

                  <div className="md:col-span-2 space-y-1 pt-2 border-t border-white/10">
                    <label className="text-amber-200 font-medium">1st Floor Title</label>
                    <input
                      type="text"
                      value={data.brand.floor1Name}
                      onChange={(e) => updateBrand({ floor1Name: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
                    />
                  </div>

                  <div className="md:col-span-2 space-y-1">
                    <label className="text-neutral-400">1st Floor Description</label>
                    <textarea
                      rows={2}
                      value={data.brand.floor1Description}
                      onChange={(e) =>
                        updateBrand({ floor1Description: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
                    />
                  </div>

                  <div className="md:col-span-2 space-y-1 pt-2 border-t border-white/10">
                    <label className="text-amber-200 font-medium">2nd Floor Title</label>
                    <input
                      type="text"
                      value={data.brand.floor2Name}
                      onChange={(e) => updateBrand({ floor2Name: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
                    />
                  </div>

                  <div className="md:col-span-2 space-y-1">
                    <label className="text-neutral-400">2nd Floor Description</label>
                    <textarea
                      rows={2}
                      value={data.brand.floor2Description}
                      onChange={(e) =>
                        updateBrand({ floor2Description: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: MOBILE OPTIMIZATION */}
          {activeTab === 'mobile' && (
            <div className="space-y-6 max-w-3xl">
              <div>
                <h3 className="text-xl font-display font-light text-white">
                  Mobile Responsive Optimization
                </h3>
                <p className="text-xs text-neutral-400">
                  Calibrate 3D rendering for iOS and Android devices to ensure 60fps performance and perfect framing.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 space-y-4 text-xs">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-neutral-300">Mobile 3D Product Scale</span>
                    <span className="text-amber-200 font-mono">
                      {data.mobile.mobileScale.toFixed(2)}x
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="1.2"
                    step="0.02"
                    value={data.mobile.mobileScale}
                    onChange={(e) =>
                      updateMobile({ mobileScale: parseFloat(e.target.value) })
                    }
                    className="w-full accent-amber-200"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-neutral-300">Mobile Y Vertical Offset</span>
                    <span className="text-amber-200 font-mono">
                      {data.mobile.mobileYOffset.toFixed(2)}m
                    </span>
                  </div>
                  <input
                    type="range"
                    min="-0.5"
                    max="0.5"
                    step="0.05"
                    value={data.mobile.mobileYOffset}
                    onChange={(e) =>
                      updateMobile({ mobileYOffset: parseFloat(e.target.value) })
                    }
                    className="w-full accent-amber-200"
                  />
                </div>

                <div className="space-y-1 pt-2">
                  <label className="text-neutral-400">Mobile GPU Quality Tier</label>
                  <select
                    value={data.mobile.qualityTier}
                    onChange={(e) =>
                      updateMobile({
                        qualityTier: e.target.value as 'high' | 'medium' | 'low',
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-[#1a1a1e] border border-white/10 text-white"
                  >
                    <option value="high">High (Full Shadows + Anti-aliasing)</option>
                    <option value="medium">Medium (Soft Shadows, Balanced 60fps)</option>
                    <option value="low">Low (Battery Saver Mode, Ambient Only)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: BACKUP & RESET */}
          {activeTab === 'data' && (
            <div className="space-y-6 max-w-3xl">
              <div>
                <h3 className="text-xl font-display font-light text-white">
                  Showroom Data Backup & Synchronization
                </h3>
                <p className="text-xs text-neutral-400">
                  Export complete catalogue and 3D configuration as JSON, or restore factory defaults.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 space-y-6 text-xs">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                  <button
                    onClick={handleExportJson}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-colors cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-amber-200" />
                    <span>Export CMS State (JSON)</span>
                  </button>

                  <label className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-colors cursor-pointer border border-dashed border-white/20">
                    <Upload className="w-4 h-4 text-amber-200" />
                    <span>Import CMS State (JSON)</span>
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImportJson}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="pt-4 border-t border-white/10 space-y-3">
                  <div className="text-rose-400 font-semibold uppercase tracking-wider">
                    Factory Reset Atelier
                  </div>
                  <p className="text-neutral-400">
                    Reset all products, 3D coordinates, and showroom settings back to factory seed data.
                  </p>
                  <button
                    onClick={() => {
                      if (
                        confirm(
                          'Are you sure you want to restore the default showroom data? All custom additions will be reverted.'
                        )
                      ) {
                        resetToDefault();
                        triggerSaveNotification();
                      }
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-rose-200 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Restore Default Showroom</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
