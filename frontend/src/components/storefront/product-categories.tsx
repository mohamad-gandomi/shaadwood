'use client';

import * as React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { ArrowUpRight } from 'lucide-react';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';
import { Category } from '@/types';

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  image: string;
  subtitle?: string;
}

const FALLBACK_CATEGORIES: CategoryItem[] = [
  {
    id: 'living',
    name: 'Living Room',
    slug: 'living-room',
    image: '/images/hero-living-zen.webp',
    subtitle: 'Lounge seating & coffee tables',
  },
  {
    id: 'dining',
    name: 'Dining Room',
    slug: 'dining-room',
    image: '/images/products/aalborg-dining-table.webp',
    subtitle: 'Solid timber dining & benches',
  },
  {
    id: 'bedroom',
    name: 'Bedroom Sanctuary',
    slug: 'bedroom',
    image: '/images/bedroom-sanctuary.jpg',
    subtitle: 'Platform beds & nightstands',
  },
];

const FALLBACK_IMAGE_BY_SLUG: Record<string, string> = {
  'living-room': '/images/hero-living-zen.webp',
  'dining-room': '/images/products/aalborg-dining-table.webp',
  bedroom: '/images/bedroom-sanctuary.jpg',
  'sofas-and-armchairs': '/images/products/shizuka-lounge-sofa.webp',
  'coffee-tables': '/images/products/sora-coffee-table.webp',
  'dining-tables': '/images/products/aalborg-dining-table.webp',
  'dining-chairs': '/images/products/kanso-chair.webp',
};

export function ProductCategories() {
  const { data: rawCategories = [] } = useQuery({
    queryKey: ['storefront-categories'],
    queryFn: () => api.getCategoriesTree(),
  });

  // Limit to maximum 3 or 4 categories (never more than 4)
  const categories: CategoryItem[] = React.useMemo(() => {
    if (!rawCategories || rawCategories.length === 0) {
      return FALLBACK_CATEGORIES;
    }

    const topLevel = rawCategories.filter((c: Category) => !c.parentId);
    const pool = topLevel.length >= 3 ? topLevel : rawCategories;

    // Take max 4 items; if there are at least 3, use 3 or 4
    const selected = pool.slice(0, 4);
    if (selected.length < 3) {
      return FALLBACK_CATEGORIES;
    }

    return selected.map((cat: Category) => {
      const fallbackImg =
        FALLBACK_IMAGE_BY_SLUG[cat.slug] || '/images/showcase-credenza.webp';
      return {
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        image: cat.image || fallbackImg,
        subtitle: cat.description || undefined,
      };
    });
  }, [rawCategories]);

  const count = categories.length;
  // Desktop: 3 columns if 3 items, 4 columns if 4 items; Mobile: responsive 1 or 2 columns
  const gridColsClass =
    count === 4
      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
      : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';

  return (
    <section id="categories" className="py-16 sm:py-24 bg-white border-b border-border/60 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-12">
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-shaad-800">
              Artisanal Spaces
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground font-serif">
              Curated Collections
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-lg">
              Every room thoughtfully considered in solid walnut, white oak, and natural finishes.
            </p>
          </div>
        </div>

        {/* Categories Grid */}
        <div className={cn('grid gap-6 sm:gap-8', gridColsClass)}>
          {categories.map((category) => {
            const fallbackImg =
              FALLBACK_IMAGE_BY_SLUG[category.slug] || '/images/hero-living-zen.webp';
            const anchorId = category.slug.includes('living')
              ? 'living'
              : category.slug.includes('dining')
              ? 'dining'
              : category.slug.includes('bed')
              ? 'bedroom'
              : undefined;

            return (
              <Link
                key={category.id}
                id={anchorId}
                href="#collections"
                className="group relative rounded-2xl sm:rounded-3xl overflow-hidden bg-zen-100 border border-border/60 shadow-2xs hover:shadow-lg transition-all duration-500 block focus:outline-hidden focus-visible:ring-2 focus-visible:ring-shaad-800 scroll-mt-24"
              >
                {/* Image Stage */}
                <div className="relative aspect-[4/5] sm:aspect-[3/4] w-full overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    onError={(e) => {
                      e.currentTarget.src = fallbackImg;
                    }}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  />

                  {/* Gradient Overlay for Legibility */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent transition-opacity duration-300" />

                  {/* Card Content Overlay */}
                  <div className="absolute inset-x-0 bottom-0 p-6 sm:p-7 flex flex-col justify-end text-white">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-xl sm:text-2xl font-bold font-serif tracking-tight drop-shadow-xs group-hover:translate-x-1 transition-transform duration-300">
                        {category.name}
                      </h3>
                      <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white opacity-80 group-hover:opacity-100 group-hover:bg-white group-hover:text-shaad-900 transition-all shrink-0">
                        <ArrowUpRight className="w-4 h-4" />
                      </div>
                    </div>

                    <span className="text-xs text-white/80 font-light tracking-wide mt-1.5 line-clamp-1">
                      {category.subtitle || 'Explore handcrafted pieces'}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
