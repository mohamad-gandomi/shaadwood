'use client';

import * as React from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';
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
    badge: 'مجموعه سرویس خواب چوب طبیعی',
    title: 'آرامش ناب در بستر طبیعت',
    subtitle: 'دست‌ساخته‌های تمام‌چوب از گردوی کوهستانی و بلوط؛ آفرینش سکوت، گرما و اصالت در فضای خواب شما.',
    ctaText: 'مشاهده سرویس خواب',
    ctaHref: '/shop?categorySlug=bedroom',
  },
  {
    id: 'living',
    image: 'http://localhost:4000/uploads/hero-living-zen.webp',
    badge: 'فضای نشیمن ارگانیک',
    title: 'هماهنگی چوب و زندگی',
    subtitle: 'خطوط آرام، بافت کتان طبیعی و اتصالات اصیل فاق و زبانه؛ آفریده‌شده برای گرما بخشیدن به خانه.',
    ctaText: 'کشف مجموعه نشیمن',
    ctaHref: '/shop?categorySlug=living-room',
  },
  {
    id: 'credenza',
    image: 'http://localhost:4000/uploads/showcase-credenza.webp',
    badge: 'شاهکار هنر نجاری',
    title: 'میراثی ماندگار برای نسل‌ها',
    subtitle: 'کنسول دست‌ساز از گردوی سیاه با پوشش روغن‌های ارگانیک گیاهی و بدون روکش مصنوعی.',
    ctaText: 'مشاهده کاتالوگ آثار',
    ctaHref: '/shop',
  },
];

export function HeroSlider() {
  const [current, setCurrent] = React.useState(0);
  const [isPaused, setIsPaused] = React.useState(false);
  const touchStartX = React.useRef<number | null>(null);

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

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const distance = touchStartX.current - e.changedTouches[0].clientX;
    if (distance > 45) nextSlide();
    else if (distance < -45) prevSlide();
    touchStartX.current = null;
  };

  return (
    <section
      className="relative w-full overflow-hidden bg-zen-100 select-none touch-pan-y"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={(e) => { touchStartX.current = e.targetTouches[0].clientX; }}
      onTouchEnd={handleTouchEnd}
      aria-label="اسلایدر صفحه اصلی شادوود"
    >
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
                    'w-full h-full object-cover object-center transform-gpu will-change-transform [backface-visibility:hidden] transition-transform duration-[7000ms] ease-out',
                    isActive ? 'scale-[1.03]' : 'scale-100'
                  )}
                />
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/25 to-black/25" />

              <div className="absolute inset-0 flex items-center justify-center text-center p-6">
                <div className="max-w-2xl space-y-4 sm:space-y-5 animate-in fade-in-50 slide-in-from-bottom-6 duration-700">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-[11px] sm:text-xs font-medium border border-white/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    <span>{slide.badge}</span>
                  </div>

                  <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white font-serif drop-shadow-sm leading-tight sm:leading-tight">
                    {slide.title}
                  </h1>

                  <p className="text-xs sm:text-sm md:text-base text-white/90 max-w-lg mx-auto font-light leading-relaxed drop-shadow-xs">
                    {slide.subtitle}
                  </p>

                  <div className="pt-2">
                    <Link href={slide.ctaHref}>
                      <Button
                        size="lg"
                        className="bg-white hover:bg-zen-100 text-shaad-900 font-semibold px-6 sm:px-8 py-3 text-xs sm:text-sm tracking-wide gap-2 rounded-full hover:scale-105 transition-all shadow-md"
                      >
                        <span>{slide.ctaText}</span>
                        <ArrowLeft className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop Prev / Next Buttons */}
      <button
        type="button"
        onClick={prevSlide}
        className="hidden md:flex absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/30 hover:bg-white/70 text-white hover:text-shaad-900 backdrop-blur-md items-center justify-center transition-all opacity-80 hover:opacity-100 shadow-sm"
        aria-label="اسلاید قبلی"
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      <button
        type="button"
        onClick={nextSlide}
        className="hidden md:flex absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/30 hover:bg-white/70 text-white hover:text-shaad-900 backdrop-blur-md items-center justify-center transition-all opacity-80 hover:opacity-100 shadow-sm"
        aria-label="اسلاید بعدی"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      {/* Slide Indicators */}
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
            aria-label={`رفتن به اسلاید ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
