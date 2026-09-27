'use client';

import * as React from 'react';
import { ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react';
import { ProductImage } from '@/types';
import { cn } from '@/lib/utils';

interface ProductGalleryProps {
  images?: ProductImage[];
  productName: string;
}

export function ProductGallery({ images = [], productName }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = React.useState(false);

  const galleryImages = images.length > 0 ? images : [
    {
      id: 'placeholder',
      productId: 'placeholder',
      url: '/images/hero-bedroom-zen.webp',
      altText: productName,
      displayOrder: 1,
      isPrimary: true,
    },
  ];

  const currentImage = galleryImages[selectedIndex] || galleryImages[0];

  const handleNext = React.useCallback(() => {
    setSelectedIndex((prev) => (prev + 1) % galleryImages.length);
  }, [galleryImages.length]);

  const handlePrev = React.useCallback(() => {
    setSelectedIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  }, [galleryImages.length]);

  const touchStartX = React.useRef<number | null>(null);

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 40) handleNext();
    else if (diff < -40) handlePrev();
    touchStartX.current = null;
  };

  React.useEffect(() => {
    if (!isLightboxOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsLightboxOpen(false);
      if (e.key === 'ArrowRight') handlePrev();
      if (e.key === 'ArrowLeft') handleNext();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [isLightboxOpen, handleNext, handlePrev]);

  return (
    <div className="space-y-4">
      {/* Main Image Stage */}
      <div
        className="relative aspect-[4/3] bg-zen-100 rounded-3xl overflow-hidden border border-border/70 group shadow-sm select-none"
        onTouchStart={(e) => { touchStartX.current = e.targetTouches[0].clientX; }}
        onTouchEnd={handleTouchEnd}
      >
        <img
          src={currentImage.url}
          alt={currentImage.altText || productName}
          onError={(e) => { e.currentTarget.src = '/images/hero-bedroom-zen.webp'; }}
          className="w-full h-full object-cover object-center cursor-zoom-in transition-transform duration-500 group-hover:scale-[1.02]"
          onClick={() => setIsLightboxOpen(true)}
        />

        <button
          type="button"
          onClick={() => setIsLightboxOpen(true)}
          className="absolute top-4 left-4 p-2.5 rounded-full bg-white/80 hover:bg-white text-foreground shadow-md transition-all opacity-0 group-hover:opacity-100"
          aria-label="بزرگ‌نمایی تصویر"
        >
          <Maximize2 className="w-4 h-4 text-shaad-900" />
        </button>

        {galleryImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white text-foreground shadow-md transition-all opacity-0 group-hover:opacity-100"
              aria-label="تصویر قبلی"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white text-foreground shadow-md transition-all opacity-0 group-hover:opacity-100"
              aria-label="تصویر بعدی"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails row */}
      {galleryImages.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
          {galleryImages.map((img, idx) => (
            <button
              key={img.id || idx}
              type="button"
              onClick={() => setSelectedIndex(idx)}
              className={cn(
                'relative w-20 h-20 rounded-2xl overflow-hidden shrink-0 border-2 transition-all',
                idx === selectedIndex
                  ? 'border-shaad-800 ring-2 ring-shaad-800/20 shadow-xs'
                  : 'border-border/60 hover:border-border opacity-70 hover:opacity-100'
              )}
              aria-label={`انتخاب تصویر ${idx + 1}`}
            >
              <img src={img.url} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
          <button
            type="button"
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-5 left-5 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white"
            aria-label="بستن تصویر"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={currentImage.url}
            alt={currentImage.altText || productName}
            className="max-h-[85vh] max-w-[90vw] object-contain rounded-2xl shadow-2xl"
          />
          {galleryImages.length > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrev}
                className="absolute right-5 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white"
                aria-label="تصویر قبلی"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="absolute left-5 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white"
                aria-label="تصویر بعدی"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
