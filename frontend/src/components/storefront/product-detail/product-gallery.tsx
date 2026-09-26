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

  // Fallback to placeholder if no images
  const galleryImages =
    images.length > 0
      ? images
      : [
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

  // Touch swipe support for mobile
  const touchStartX = React.useRef<number | null>(null);
  const touchEndX = React.useRef<number | null>(null);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
    touchEndX.current = null;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const onTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const diff = touchStartX.current - touchEndX.current;
    const threshold = 40; // min swipe distance in px

    if (diff > threshold) {
      // Swiped Left -> Next
      handleNext();
    } else if (diff < -threshold) {
      // Swiped Right -> Previous
      handlePrev();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Keyboard navigation for Lightbox
  React.useEffect(() => {
    if (!isLightboxOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsLightboxOpen(false);
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, handleNext, handlePrev]);

  // Lock body scroll when Lightbox is open
  React.useEffect(() => {
    if (isLightboxOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isLightboxOpen]);

  return (
    <div className="space-y-4">
      {/* Main Image Container */}
      <div
        className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-zen-100 border border-border/60 shadow-sm cursor-zoom-in group select-none"
        onClick={() => setIsLightboxOpen(true)}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <img
          src={currentImage.url}
          alt={currentImage.altText || `${productName} view ${selectedIndex + 1}`}
          onError={(e) => {
            e.currentTarget.src = '/images/hero-bedroom-zen.webp';
          }}
          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-102"
        />

        {/* Lightbox trigger hint button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsLightboxOpen(true);
          }}
          aria-label="Open Fullscreen Lightbox"
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/80 backdrop-blur-md hover:bg-white text-foreground flex items-center justify-center shadow-md transition-all opacity-80 group-hover:opacity-100"
        >
          <Maximize2 className="w-4 h-4 text-shaad-900" />
        </button>

        {/* Mobile touch swipe dots indicator */}
        {galleryImages.length > 1 && (
          <div className="absolute bottom-4 inset-x-0 flex items-center justify-center gap-1.5 sm:hidden pointer-events-none">
            {galleryImages.map((_, idx) => (
              <span
                key={idx}
                className={cn(
                  'h-1.5 rounded-full transition-all',
                  idx === selectedIndex ? 'w-5 bg-white shadow-sm' : 'w-1.5 bg-white/60'
                )}
              />
            ))}
          </div>
        )}

        {/* Desktop Prev/Next Hover Arrows */}
        {galleryImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              aria-label="Previous Image"
              className="hidden sm:flex absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-md hover:bg-white text-foreground items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              aria-label="Next Image"
              className="hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-md hover:bg-white text-foreground items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails Row */}
      {galleryImages.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-none">
          {galleryImages.map((img, idx) => (
            <button
              key={img.id || idx}
              type="button"
              onClick={() => setSelectedIndex(idx)}
              className={cn(
                'relative w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0 bg-zen-100',
                idx === selectedIndex
                  ? 'border-shaad-800 ring-2 ring-shaad-800/20'
                  : 'border-border/60 opacity-60 hover:opacity-100'
              )}
            >
              <img
                src={img.url}
                alt={`${productName} thumbnail ${idx + 1}`}
                onError={(e) => {
                  e.currentTarget.src = '/images/hero-bedroom-zen.webp';
                }}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 animate-in fade-in duration-200"
          onClick={() => setIsLightboxOpen(false)}
        >
          {/* Lightbox Top Bar */}
          <div className="flex items-center justify-between text-white/80 w-full max-w-7xl mx-auto z-10">
            <span className="text-xs font-mono tracking-wider">
              {selectedIndex + 1} / {galleryImages.length} &bull; {productName}
            </span>
            <button
              type="button"
              onClick={() => setIsLightboxOpen(false)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Close Lightbox"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Lightbox Main Stage */}
          <div
            className="flex-1 flex items-center justify-center relative w-full max-w-6xl mx-auto my-2"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {/* Prev Arrow */}
            {galleryImages.length > 1 && (
              <button
                type="button"
                onClick={handlePrev}
                className="absolute left-2 sm:left-4 z-10 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white border border-white/20 transition-all"
                aria-label="Previous Photo"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            {/* Stage Image */}
            <div className="max-h-[75vh] max-w-full flex items-center justify-center p-2">
              <img
                src={currentImage.url}
                alt={currentImage.altText || productName}
                className="max-h-[75vh] max-w-full object-contain rounded-2xl shadow-2xl"
              />
            </div>

            {/* Next Arrow */}
            {galleryImages.length > 1 && (
              <button
                type="button"
                onClick={handleNext}
                className="absolute right-2 sm:right-4 z-10 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white border border-white/20 transition-all"
                aria-label="Next Photo"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* Lightbox Bottom Thumbnails */}
          {galleryImages.length > 1 && (
            <div
              className="flex items-center justify-center gap-2 overflow-x-auto py-2 z-10"
              onClick={(e) => e.stopPropagation()}
            >
              {galleryImages.map((img, idx) => (
                <button
                  key={img.id || idx}
                  type="button"
                  onClick={() => setSelectedIndex(idx)}
                  className={cn(
                    'w-14 h-14 rounded-xl overflow-hidden border-2 transition-all shrink-0',
                    idx === selectedIndex
                      ? 'border-white ring-2 ring-white/50 scale-105'
                      : 'border-white/30 opacity-50 hover:opacity-100'
                  )}
                >
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
