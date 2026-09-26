'use client';

import * as React from 'react';
import { SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ShopHeaderProps {
  totalCount: number;
  sortBy: string;
  onSortChange: (sort: string) => void;
  onOpenMobileFilters: () => void;
}

export function ShopHeader({
  totalCount,
  sortBy,
  onSortChange,
  onOpenMobileFilters,
}: ShopHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-border/60">
      <div>
        <p className="text-xs uppercase tracking-widest text-shaad-700 font-semibold mb-1">
          Shaadwood Studio Catalog
        </p>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-foreground tracking-tight">
          Handcrafted Furniture
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1 font-light">
          Showing <span className="font-medium text-foreground font-mono">{totalCount}</span> studio pieces
        </p>
      </div>

      <div className="flex items-center gap-2.5">
        {/* Mobile Filter Sheet Trigger */}
        <Button
          variant="outline"
          size="sm"
          onClick={onOpenMobileFilters}
          className="lg:hidden rounded-full border-border/80 text-xs gap-1.5 h-9"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Filters</span>
        </Button>

        {/* Sort Select */}
        <div className="relative inline-flex items-center">
          <ArrowUpDown className="w-3.5 h-3.5 text-muted-foreground absolute left-3 pointer-events-none" />
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="pl-8 pr-8 py-2 text-xs rounded-full border border-border/80 bg-white hover:border-shaad-800 text-foreground font-medium appearance-none focus:outline-hidden focus:ring-1 focus:ring-shaad-800 transition-colors cursor-pointer shadow-2xs"
            aria-label="Sort catalog pieces"
          >
            <option value="newest">Latest Additions</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="name_asc">Name: A to Z</option>
            <option value="name_desc">Name: Z to A</option>
          </select>
        </div>
      </div>
    </div>
  );
}
