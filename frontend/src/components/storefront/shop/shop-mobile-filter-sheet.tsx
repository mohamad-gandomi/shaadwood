'use client';

import * as React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { ShopFilterSidebar } from './shop-filter-sidebar';
import { Category } from '@/types';

interface ShopMobileFilterSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: Category[];
  categorySlug: string;
  searchQuery: string;
  minPrice: string;
  maxPrice: string;
  inStockOnly: boolean;
  onSelectCategory: (slug: string) => void;
  onSearchChange: (q: string) => void;
  onPriceChange: (min?: string, max?: string) => void;
  onInStockChange: (val: boolean) => void;
  onResetFilters: () => void;
}

export function ShopMobileFilterSheet({
  open,
  onOpenChange,
  categories,
  categorySlug,
  searchQuery,
  minPrice,
  maxPrice,
  inStockOnly,
  onSelectCategory,
  onSearchChange,
  onPriceChange,
  onInStockChange,
  onResetFilters,
}: ShopMobileFilterSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[320px] sm:w-[380px] p-6 overflow-y-auto text-right">
        <SheetHeader className="pb-4 border-b border-border/60 text-right">
          <SheetTitle className="font-serif text-lg">فیلترهای کاتالوگ آثار</SheetTitle>
        </SheetHeader>
        <div className="pt-6">
          <ShopFilterSidebar
            categories={categories}
            selectedCategorySlug={categorySlug}
            onSelectCategory={(slug) => {
              onSelectCategory(slug);
              onOpenChange(false);
            }}
            searchQuery={searchQuery}
            onSearchChange={onSearchChange}
            minPrice={minPrice}
            maxPrice={maxPrice}
            onPriceChange={(min, max) => {
              onPriceChange(min, max);
              onOpenChange(false);
            }}
            inStockOnly={inStockOnly}
            onInStockChange={onInStockChange}
            onResetFilters={() => {
              onResetFilters();
              onOpenChange(false);
            }}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
