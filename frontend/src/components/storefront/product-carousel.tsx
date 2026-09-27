'use client';

import * as React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight, Plus, Check } from 'lucide-react';
import { api } from '@/lib/api';
import { useCart } from '@/context/cart-context';
import { formatCurrency, cn } from '@/lib/utils';
import { Product } from '@/types';

export function ProductCarousel() {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const { addItem } = useCart();
  const [addedId, setAddedId] = React.useState<string | null>(null);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['storefront-products'],
    queryFn: () => api.getProducts(),
  });

  const displayedProducts = React.useMemo(() => {
    return products.slice(0, 10);
  }, [products]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const offset = direction === 'left' ? -340 : 340;
      scrollContainerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  const handleQuickAdd = (p: Product) => {
    const imageUrl = p.images?.[0]?.url || '/images/hero-bedroom-zen.webp';
    addItem({
      id: p.id,
      productId: p.id,
      name: p.name,
      price: typeof p.basePrice === 'string' ? parseFloat(p.basePrice) : p.basePrice,
      image: imageUrl,
      finish: p.productType === 'VARIABLE' ? 'سفارشی / چوب گردو و بلوط' : 'چوب طبیعی ماسیو',
    });

    setAddedId(p.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  return (
    <section id="collections" className="py-16 sm:py-24 bg-zen-50 border-b border-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-12">
          <div className="space-y-1.5 text-right">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-shaad-800">
              مجموعه شاهکارهای ماندگار ({displayedProducts.length} اثر)
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground font-serif">
              دست‌ساخته‌های شاخص آتلیه
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-lg leading-relaxed">
              هر اثر به صورت اختصاصی از الوارهای ممتاز چوب طبیعی با اتصالات کهن نجاری تراشیده و پرداخت شده است.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto flex-row-reverse">
            <button
              type="button"
              onClick={() => scroll('left')}
              className="w-10 h-10 rounded-full border border-border/80 bg-white hover:bg-zen-100 text-foreground flex items-center justify-center transition-colors shadow-2xs"
              aria-label="حرکت به جلو"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => scroll('right')}
              className="w-10 h-10 rounded-full border border-border/80 bg-white hover:bg-zen-100 text-foreground flex items-center justify-center transition-colors shadow-2xs"
              aria-label="حرکت به عقب"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Carousel Stream */}
        <div
          ref={scrollContainerRef}
          className="flex gap-4 sm:gap-6 overflow-x-auto pb-6 pt-2 scrollbar-none snap-x snap-mandatory -mx-4 px-[7.5vw] scroll-px-[7.5vw] sm:mx-0 sm:px-0 sm:scroll-px-0"
        >
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="w-[85vw] max-w-xs sm:w-80 shrink-0 snap-center sm:snap-start rounded-2xl bg-white p-4 border border-border/60 space-y-4 animate-pulse"
              >
                <div className="aspect-[4/3] bg-zen-100 rounded-xl" />
                <div className="h-4 bg-zen-200 rounded w-3/4" />
                <div className="h-3 bg-zen-100 rounded w-1/2" />
                <div className="h-4 bg-zen-200 rounded w-1/3" />
              </div>
            ))
          ) : displayedProducts.length === 0 ? (
            <div className="w-full text-center py-12 text-sm text-muted-foreground">
              اثری در کاتالوگ آتلیه یافت نشد.
            </div>
          ) : (
            displayedProducts.map((product) => {
              const imgUrl = product.images?.[0]?.url || '/images/hero-bedroom-zen.webp';
              const isAdded = addedId === product.id;

              return (
                <div
                  key={product.id}
                  className="w-[85vw] max-w-xs sm:w-80 shrink-0 snap-center sm:snap-start group rounded-2xl bg-white border border-border/60 overflow-hidden shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="relative aspect-[4/3] bg-zen-100/60 overflow-hidden">
                    <img
                      src={imgUrl}
                      alt={product.name}
                      onError={(e) => {
                        e.currentTarget.src = '/images/hero-bedroom-zen.webp';
                      }}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                    />

                    <div className="absolute top-3 right-3">
                      <span className="text-[10px] font-medium tracking-wider px-2 py-0.5 rounded-full bg-white/95 backdrop-blur-sm text-shaad-900 border border-black/5 shadow-2xs">
                        {product.category?.name || 'چوب ماسیو'}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleQuickAdd(product)}
                      className={cn(
                        'absolute bottom-3 left-3 h-9 px-3 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all shadow-md',
                        isAdded
                          ? 'bg-emerald-700 text-white'
                          : 'bg-shaad-800 text-white hover:bg-shaad-900 opacity-90 group-hover:opacity-100'
                      )}
                      aria-label="افزودن به سبد خرید"
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>افزوده شد</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>افزودن به سبد</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="p-4 sm:p-5 space-y-2 text-right">
                    <div className="space-y-0.5">
                      <Link href={`/shop/${product.slug}`} className="block">
                        <h3 className="font-semibold text-sm sm:text-base text-foreground font-serif group-hover:text-shaad-800 transition-colors truncate">
                          {product.name}
                        </h3>
                      </Link>
                      <p className="text-xs text-muted-foreground truncate">
                        {product.shortDescription || '۱۰۰٪ چوب طبیعی و خشک‌شده در کوره'}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-border/50 text-xs">
                      <span className="text-muted-foreground text-[11px]">
                        {product.productType === 'VARIABLE' ? 'پوشش‌های سفارشی' : 'فینیش طبیعی'}
                      </span>
                      <span className="font-bold text-sm text-shaad-900 font-sans">
                        {formatCurrency(product.basePrice)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
