import React, { useState, useRef } from 'react';
import { useCms } from '../../context/CmsContext';
import { FloorGallerySlot } from '../../types';
import {
  Upload,
  Trash2,
  Image as ImageIcon,
  Check,
  RefreshCw,
  Eye,
  Layers,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

export const FloorGalleriesManager: React.FC = () => {
  const {
    data,
    selectedFloorView,
    setSelectedFloorView,
    updateFloorGallerySlot,
    deleteFloorGallerySlot,
    setIsAdminOpen,
  } = useCms();

  const [activeFloor, setActiveFloor] = useState<'babyFloor' | 'womensFloor'>(
    selectedFloorView === '1st Floor' ? 'babyFloor' : 'womensFloor'
  );

  const [notification, setNotification] = useState<string | null>(null);
  const [activeSlotModal, setActiveSlotModal] = useState<FloorGallerySlot | null>(null);

  // File input refs for each of the 10 slots
  const fileInputRefs = useRef<{ [key: number]: HTMLInputElement | null }>({});

  const isBaby = activeFloor === 'babyFloor';
  const slots: FloorGallerySlot[] = isBaby
    ? data.floorGalleries?.babyFloor || []
    : data.floorGalleries?.womensFloor || [];

  const handleFloorChange = (floor: 'babyFloor' | 'womensFloor') => {
    setActiveFloor(floor);
    setSelectedFloorView(floor === 'babyFloor' ? '1st Floor' : '2nd Floor');
  };

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 2500);
  };

  // Upload local image from device via FileReader
  const handleFileUpload = (slotNumber: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit (max 8MB recommended for base64)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size exceeds 10MB. Please choose an optimized image.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64Url = reader.result as string;
      const currentSlot = slots.find((s) => s.slotNumber === slotNumber);
      updateFloorGallerySlot(activeFloor, slotNumber, {
        imageUrl: base64Url,
        title: currentSlot?.title && !currentSlot.title.includes('(Empty)')
          ? currentSlot.title
          : file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
      });
      showNotification(`Slot ${slotNumber} image updated successfully!`);
    };
    reader.readAsDataURL(file);
    // Reset file input so user can re-upload same file name if needed
    e.target.value = '';
  };

  const handleTitleChange = (slotNumber: number, title: string) => {
    updateFloorGallerySlot(activeFloor, slotNumber, { title });
  };

  const handleSubtitleChange = (slotNumber: number, subtitle: string) => {
    updateFloorGallerySlot(activeFloor, slotNumber, { subtitle });
  };

  const handleUrlChange = (slotNumber: number, imageUrl: string) => {
    updateFloorGallerySlot(activeFloor, slotNumber, { imageUrl });
    showNotification(`Slot ${slotNumber} URL updated!`);
  };

  const handleDeleteSlot = (slotNumber: number) => {
    if (window.confirm(`Are you sure you want to delete and clear Slot ${slotNumber}?`)) {
      deleteFloorGallerySlot(activeFloor, slotNumber);
      showNotification(`Slot ${slotNumber} cleared.`);
    }
  };

  // Count active images
  const uploadedCount = slots.filter((s) => s.imageUrl).length;

  return (
    <div className="space-y-8 max-w-6xl pb-16">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-white border border-neutral-200 shadow-sm">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 text-neutral-800 text-xs uppercase font-medium tracking-wider">
            <Layers className="w-3.5 h-3.5 text-amber-800" />
            <span>Dedicated 10-Slot Floor Galleries</span>
          </div>
          <h3 className="text-2xl font-display font-medium text-neutral-900">
            Floor Image Upload Manager
          </h3>
          <p className="text-xs text-neutral-600 max-w-2xl leading-relaxed">
            Manage all 10 individual image slots for Baby (1st Floor) and Women’s (2nd Floor).
            Upload from your device, replace, change titles, or delete any image.
            All updates instantly reflect on the live website.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setIsAdminOpen(false);
              const el = document.getElementById('floor-gallery-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider text-neutral-700 hover:text-neutral-950 bg-neutral-100 hover:bg-neutral-200/80 border border-neutral-200 transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View on Website</span>
          </button>
        </div>
      </div>

      {/* Live Save Notification */}
      {notification && (
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium animate-fade-in shadow-sm">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{notification}</span>
        </div>
      )}

      {/* Floor Selection Tabs */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-2 rounded-2xl bg-neutral-100 border border-neutral-200">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => handleFloorChange('babyFloor')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
              isBaby
                ? 'bg-neutral-900 text-white shadow-md'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-white/60'
            }`}
          >
            <span>1st Floor – Baby & Kids</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-white/20">
              {isBaby ? `${uploadedCount}/10` : '10 Slots'}
            </span>
          </button>

          <button
            onClick={() => handleFloorChange('womensFloor')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
              !isBaby
                ? 'bg-neutral-900 text-white shadow-md'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-white/60'
            }`}
          >
            <span>2nd Floor – Women’s Collection</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-white/20">
              {!isBaby ? `${uploadedCount}/10` : '10 Slots'}
            </span>
          </button>
        </div>

        <div className="text-xs text-neutral-500 font-mono px-3">
          Status: {uploadedCount} of 10 slots active
        </div>
      </div>

      {/* 10 Separate Image Upload Slots */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {slots.map((slot) => {
          const hasImg = Boolean(slot.imageUrl);
          const paddedNum = slot.slotNumber < 10 ? `0${slot.slotNumber}` : `${slot.slotNumber}`;

          return (
            <div
              key={slot.id || `slot-${slot.slotNumber}`}
              className="p-5 rounded-2xl bg-white border border-neutral-200/90 shadow-sm space-y-4 hover:border-neutral-300 transition-all"
            >
              {/* Slot Header */}
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                <div className="flex items-center gap-2.5">
                  <span className="px-3 py-1 rounded-lg bg-neutral-900 text-white font-mono text-xs font-semibold">
                    Slot {paddedNum} / 10
                  </span>
                  <span className="text-xs font-medium text-neutral-500">
                    {isBaby ? 'Baby 1st Floor' : "Women's 2nd Floor"}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  {hasImg ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md">
                      <Check className="w-3 h-3" /> Live
                    </span>
                  ) : (
                    <span className="text-[11px] font-medium text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-md">
                      Empty
                    </span>
                  )}
                </div>
              </div>

              {/* Middle Section: Image Thumbnail & Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                {/* Thumbnail Preview */}
                <div className="sm:col-span-4 aspect-[3/4] rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200 relative group flex items-center justify-center">
                  {hasImg ? (
                    <>
                      <img
                        src={slot.imageUrl}
                        alt={slot.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <button
                        onClick={() => setActiveSlotModal(slot)}
                        className="absolute inset-0 bg-neutral-900/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white cursor-pointer"
                        title="Preview Full Size"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                    </>
                  ) : (
                    <div className="text-center p-3 text-neutral-400">
                      <ImageIcon className="w-8 h-8 mx-auto mb-1 opacity-50" />
                      <span className="text-[11px]">No Image</span>
                    </div>
                  )}
                </div>

                {/* Slot Actions */}
                <div className="sm:col-span-8 space-y-3">
                  {/* Hidden File Input */}
                  <input
                    type="file"
                    accept="image/*"
                    ref={(el) => {
                      fileInputRefs.current[slot.slotNumber] = el;
                    }}
                    onChange={(e) => handleFileUpload(slot.slotNumber, e)}
                    className="hidden"
                  />

                  {/* Upload / Replace / Delete Buttons */}
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => fileInputRefs.current[slot.slotNumber]?.click()}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer shadow-sm"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{hasImg ? 'Replace Image' : 'Upload Image'}</span>
                    </button>

                    {hasImg && (
                      <button
                        onClick={() => handleDeleteSlot(slot.slotNumber)}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-medium transition-colors cursor-pointer border border-rose-200"
                        title="Clear this image slot"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    )}
                  </div>

                  {/* Image Direct URL Field */}
                  <div>
                    <label className="block text-[11px] font-medium text-neutral-500 mb-1">
                      Or Image URL / Asset Link:
                    </label>
                    <input
                      type="text"
                      value={slot.imageUrl.startsWith('data:') ? '(Uploaded Base64 File)' : slot.imageUrl}
                      disabled={slot.imageUrl.startsWith('data:')}
                      onChange={(e) => handleUrlChange(slot.slotNumber, e.target.value)}
                      placeholder="https://... or /assets/..."
                      className="w-full px-3 py-1.5 rounded-lg bg-neutral-50 border border-neutral-200 text-xs text-neutral-800 focus:bg-white focus:border-neutral-400 focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Title & Subtitle Inputs */}
              <div className="space-y-2 pt-2 border-t border-neutral-100">
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-700 mb-1 uppercase tracking-wider">
                    Garment Title:
                  </label>
                  <input
                    type="text"
                    value={slot.title}
                    onChange={(e) => handleTitleChange(slot.slotNumber, e.target.value)}
                    placeholder="e.g. Silk Heirloom Christening Gown"
                    className="w-full px-3 py-2 rounded-xl bg-neutral-50 border border-neutral-200 text-xs font-medium text-neutral-900 focus:bg-white focus:border-neutral-400 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-neutral-700 mb-1 uppercase tracking-wider">
                    Fabric & Craftsmanship Details:
                  </label>
                  <input
                    type="text"
                    value={slot.subtitle || ''}
                    onChange={(e) => handleSubtitleChange(slot.slotNumber, e.target.value)}
                    placeholder="e.g. Pure mulberry silk with French knots"
                    className="w-full px-3 py-2 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-700 focus:bg-white focus:border-neutral-400 focus:outline-none transition-colors"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Full-view Modal */}
      {activeSlotModal && (
        <div
          onClick={() => setActiveSlotModal(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/75 backdrop-blur-md"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-lg w-full bg-white rounded-2xl p-6 space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <h4 className="font-display font-medium text-neutral-900">
                Slot {activeSlotModal.slotNumber} Preview
              </h4>
              <button
                onClick={() => setActiveSlotModal(null)}
                className="text-neutral-500 hover:text-neutral-900"
              >
                ✕
              </button>
            </div>
            <div className="aspect-[3/4] rounded-xl overflow-hidden bg-neutral-100">
              <img
                src={activeSlotModal.imageUrl}
                alt={activeSlotModal.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="font-medium text-neutral-900">{activeSlotModal.title}</div>
              <div className="text-xs text-neutral-500 mt-1">{activeSlotModal.subtitle}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
