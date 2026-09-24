'use client';

import * as React from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface HeroSlide {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  badge: string;
  ctaText: string;
  ctaHref: string;
}

const SLIDES: HeroSlide[] = [
  {
    id: 'bedroom',
    image: 'http://localhost:4000/uploads/hero-bedroom-zen.webp',
    badge: 'Artisanal Bedroom Suite',
    title: 'Rest in Bedroom',
    subtitle: 'Handcrafted in solid walnut & certified white oak. The essence of quiet natural living.',
    ctaText: 'Explore Bedroom',
    ctaHref: '#categories',
  },
  {
    id: 'living',
    image: 'http://localhost:4000/uploads/hero-living-zen.webp',
    badge: 'Living Sanctuary',
    title: 'Organic Harmony',
    subtitle: 'Low-profile timber framing, oatmeal linen textures, and traditional mortise & tenon joinery.',
    ctaText: 'Discover Living Space',
    ctaHref: '#categories',
  },
  {
    id: 'credenza',
    image: 'http://localhost:4000/uploads/showcase-credenza.webp',
    badge: 'Masterpiece Credenza',
    title: 'Crafted for Generations',
    subtitle: 'Solid American black walnut with hand-rubbed organic plant oils and zero veneers.',
    ctaText: 'View Furniture Catalog',
    ctaHref: '#collections',
  },
];

export function HeroSlider() {
  const [current, setCurrent] = React.useState(0);
  const [isPaused, setIsPaused] = React.useState(false);

  // Touch swipe refs for mobile
  const touchStartX = React.useRef<number | null>(null);
  const touchEndX = React.useRef<number | null>(null);

  // Auto-advance timer
  React.useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, 6500);
    return () => clearInterval(timer);
  }, [isPaused]);

  const prevSlide = React.useCallback(() => {
    setCurrent((prev) => (prev === 0 ? SLIDES.length - 1 : prev - 1));
  }, []);

  const nextSlide = React.useCallback(() => {
    setCurrent((prev) => (prev + 1) % SLIDES.length);
  }, []);

  // Mobile Touch Swipe Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
    touchEndX.current = null;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 45;

    if (distance > minSwipeDistance) {
      // Swiped left -> next slide
      nextSlide();
    } else if (distance < -minSwipeDistance) {
      // Swiped right -> prev slide
      prevSlide();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <section
      className="relative w-full overflow-hidden bg-zen-100 select-none touch-pan-y"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      aria-label="Shaadwood Hero Slider"
    >
      {/* Slide Viewport */}
      <div className="relative h-[65vh] sm:h-[75vh] md:h-[82vh] lg:h-[86vh] w-full overflow-hidden">
        {SLIDES.map((slide, idx) => {
          const isActive = idx === current;
          return (
            <div
              key={slide.id}
              className={cn(
                'absolute inset-0 transition-opacity duration-1000 ease-in-out',
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              )}
            >
              {/* Background Image with GPU-accelerated smooth zoom (zero sub-pixel vibration/jitter) */}
              <div className="absolute inset-0 overflow-hidden">
                <img
                  src={slide.image}
                  alt={slide.title}
                  onError={(e) => {
                    const fallback = slide.image.includes('bedroom')
                      ? '/images/hero-bedroom-zen.webp'
                      : slide.image.includes('living')
                      ? '/images/hero-living-zen.webp'
                      : '/images/showcase-credenza.webp';
                    e.currentTarget.src = fallback;
                  }}
                  className={cn(
                    'w-full h-full object-cover object-center transform-gpu will-change-transform [backface-visibility:hidden] [transform:translateZ(0)] transition-transform duration-[7000ms] ease-out',
                    isActive ? 'scale-[1.03]' : 'scale-100'
                  )}
                  style={{
                    WebkitBackfaceVisibility: 'hidden',
                    WebkitTransform: 'translate3d(0, 0, 0)',
                  }}
                />
              </div>

              {/* Gentle Zen Atmospheric Vignette Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/20" />

              {/* Slide Content Overlay */}
              <div className="absolute inset-0 flex items-center justify-center text-center p-6">
                <div className="max-w-2xl space-y-4 sm:space-y-5 animate-in fade-in-50 slide-in-from-bottom-6 duration-700">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-[11px] sm:text-xs font-medium tracking-wider uppercase border border-white/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    <span>{slide.badge}</span>
                  </div>

                  <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white font-serif drop-shadow-sm">
                    {slide.title}
                  </h1>

                  <p className="text-xs sm:text-sm md:text-base text-white/90 max-w-lg mx-auto font-light leading-relaxed drop-shadow-xs">
                    {slide.subtitle}
                  </p>

                  <div className="pt-2">
                    <Link href={slide.ctaHref}>
                      <Button
                        size="lg"
                        className="bg-white hover:bg-zen-100 text-shaad-900 font-semibold px-6 sm:px-8 py-3 text-xs sm:text-sm tracking-wider uppercase shadow-md gap-2 rounded-full hover:scale-105 transition-all"
                      >
                        <span>{slide.ctaText}</span>
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Arrows - Strictly Hidden on Mobile, Visible on Desktop */}
      <button
        type="button"
        onClick={prevSlide}
        className="hidden md:flex absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/30 hover:bg-white/70 text-white hover:text-shaad-900 backdrop-blur-md items-center justify-center transition-all opacity-80 hover:opacity-100 shadow-sm"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      <button
        type="button"
        onClick={nextSlide}
        className="hidden md:flex absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/30 hover:bg-white/70 text-white hover:text-shaad-900 backdrop-blur-md items-center justify-center transition-all opacity-80 hover:opacity-100 shadow-sm"
        aria-label="Next Slide"
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      {/* Slide Indicators (Clean dots on mobile and desktop) */}
      <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {SLIDES.map((slide, idx) => (
          <button
            key={slide.id}
            type="button"
            onClick={() => setCurrent(idx)}
            className={cn(
              'h-1.5 rounded-full transition-all duration-300',
              idx === current ? 'w-7 bg-white' : 'w-2 bg-white/40 hover:bg-white/60'
            )}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
