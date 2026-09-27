'use client';

import * as React from 'react';
import { Search, RotateCcw, Layers } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Category } from '@/types';
import { ShopCategoryFilterTree } from './shop-category-filter-tree';

interface ShopFilterSidebarProps {
  categories: Category[];
  selectedCategorySlug: string;
  onSelectCategory: (slug: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  minPrice: string;
  maxPrice: string;
  onPriceChange: (min: string, max: string) => void;
  inStockOnly: boolean;
  onInStockChange: (inStock: boolean) => void;
  onResetFilters: () => void;
}

export function ShopFilterSidebar({
  categories,
  selectedCategorySlug,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  minPrice,
  maxPrice,
  onPriceChange,
  inStockOnly,
  onInStockChange,
  onResetFilters,
}: ShopFilterSidebarProps) {
  const [localMin, setLocalMin] = React.useState(minPrice);
  const [localMax, setLocalMax] = React.useState(maxPrice);

  React.useEffect(() => { setLocalMin(minPrice); }, [minPrice]);
  React.useEffect(() => { setLocalMax(maxPrice); }, [maxPrice]);

  const handlePriceApply = (e: React.FormEvent) => {
    e.preventDefault();
    onPriceChange(localMin, localMax);
  };

  return (
    <aside className="w-full space-y-7 text-right">
      {/* 1. Keyword Search */}
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
          جستجوی آثار
        </label>
        <div className="relative">
          <Search className="w-4 h-4 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2" />
          <Input
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="جستجوی متریال، سبک، نام اثر..."
            className="pr-9 pl-3 h-10 text-xs rounded-xl bg-white border-border/70 focus-visible:ring-shaad-800 text-right"
          />
        </div>
      </div>

      {/* 2. Hierarchical Category Tree */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5" />
            <span>مجموعه‌های کارگاه</span>
          </label>
        </div>

        <ShopCategoryFilterTree
          categories={categories}
          selectedCategorySlug={selectedCategorySlug}
          onSelectCategory={onSelectCategory}
        />
      </div>

      {/* 3. Price Filter */}
      <div className="space-y-3">
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
          محدوده قیمت (تومان)
        </label>
        <form onSubmit={handlePriceApply} className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-[10px] text-muted-foreground block mb-1">از قیمت</span>
              <Input
                type="number"
                placeholder="۰"
                value={localMin}
                onChange={(e) => setLocalMin(e.target.value)}
                className="h-9 text-xs rounded-xl bg-white border-border/70 font-sans text-right"
              />
            </div>
            <div>
              <span className="text-[10px] text-muted-foreground block mb-1">تا قیمت</span>
              <Input
                type="number"
                placeholder="۵۰,۰۰۰,۰۰۰"
                value={localMax}
                onChange={(e) => setLocalMax(e.target.value)}
                className="h-9 text-xs rounded-xl bg-white border-border/70 font-sans text-right"
              />
            </div>
          </div>
          <Button
            type="submit"
            variant="outline"
            size="sm"
            className="w-full text-xs rounded-xl h-8 border-border/80 hover:border-shaad-800 font-medium cursor-pointer"
          >
            اعمال فیلتر قیمت
          </Button>
        </form>
      </div>

      {/* 4. Availability Checkbox */}
      <div className="pt-2 border-t border-border/60">
        <label className="flex items-center gap-2.5 text-xs text-foreground cursor-pointer select-none py-1">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => onInStockChange(e.target.checked)}
            className="w-4 h-4 rounded text-shaad-800 border-border focus:ring-shaad-800 cursor-pointer"
          />
          <span className="font-medium">فقط آثار آماده تحویل در کارگاه</span>
        </label>
      </div>

      {/* 5. Reset All Button */}
      <div className="pt-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onResetFilters}
          className="w-full text-xs text-muted-foreground hover:text-foreground justify-center gap-1.5 h-9 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>پاک‌سازی تمام فیلترها</span>
        </Button>
      </div>
    </aside>
  );
}
