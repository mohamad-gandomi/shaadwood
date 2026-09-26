'use client';

import * as React from 'react';
import { Search, RotateCcw, Check, ChevronDown, ChevronRight, Layers } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Category } from '@/types';
import { cn } from '@/lib/utils';

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
  // Local price input state so user can type freely before committing
  const [localMin, setLocalMin] = React.useState(minPrice);
  const [localMax, setLocalMax] = React.useState(maxPrice);

  React.useEffect(() => {
    setLocalMin(minPrice);
  }, [minPrice]);

  React.useEffect(() => {
    setLocalMax(maxPrice);
  }, [maxPrice]);

  const handlePriceApply = (e: React.FormEvent) => {
    e.preventDefault();
    onPriceChange(localMin, localMax);
  };

  return (
    <aside className="w-full space-y-8">
      {/* 1. Keyword Search */}
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
          Search Pieces
        </label>
        <div className="relative">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search timber, style, name..."
            className="pl-9 h-10 text-xs rounded-xl bg-white border-border/70 focus-visible:ring-shaad-800"
          />
        </div>
      </div>

      {/* 2. Hierarchical Category Tree */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5" />
            <span>Studio Collections</span>
          </label>
          <span className="text-[11px] font-mono text-muted-foreground">Tree View</span>
        </div>

        <div className="space-y-1 bg-white/60 p-2.5 rounded-2xl border border-border/60">
          {/* All Collections Button */}
          <button
            type="button"
            onClick={() => onSelectCategory('ALL')}
            className={cn(
              'w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all text-left',
              selectedCategorySlug === 'ALL'
                ? 'bg-shaad-800 text-white shadow-2xs font-semibold'
                : 'text-foreground hover:bg-zen-100'
            )}
          >
            <span>All Collections</span>
            <span
              className={cn(
                'text-[10px] px-1.5 py-0.5 rounded-full font-mono',
                selectedCategorySlug === 'ALL'
                  ? 'bg-shaad-900 text-white'
                  : 'bg-zen-100 text-muted-foreground'
              )}
            >
              All
            </span>
          </button>

          {/* Hierarchical Categories */}
          {categories.map((parent) => {
            const isParentActive = selectedCategorySlug === parent.slug;
            const hasChildren = parent.children && parent.children.length > 0;
            const isAnyChildActive = Boolean(
              hasChildren && parent.children?.some((child) => child.slug === selectedCategorySlug)
            );

            return (
              <div key={parent.id} className="pt-1">
                {/* Parent Row */}
                <button
                  type="button"
                  onClick={() => onSelectCategory(parent.slug)}
                  className={cn(
                    'w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all text-left group',
                    isParentActive
                      ? 'bg-shaad-800 text-white font-semibold shadow-2xs'
                      : isAnyChildActive
                      ? 'bg-shaad-50 text-shaad-900 font-semibold border border-shaad-200'
                      : 'text-foreground hover:bg-zen-100 font-medium'
                  )}
                >
                  <span className="flex items-center gap-2">
                    <span
                      className={cn(
                        'w-1.5 h-1.5 rounded-full transition-colors',
                        isParentActive
                          ? 'bg-white'
                          : isAnyChildActive
                          ? 'bg-shaad-700'
                          : 'bg-shaad-400 group-hover:bg-shaad-600'
                      )}
                    />
                    <span className="truncate">{parent.name}</span>
                  </span>

                  {parent._count?.products !== undefined && (
                    <span
                      className={cn(
                        'text-[10px] px-1.5 py-0.5 rounded-full font-mono shrink-0',
                        isParentActive
                          ? 'bg-shaad-900 text-white'
                          : 'bg-zen-100 text-muted-foreground'
                      )}
                    >
                      {parent._count.products}
                    </span>
                  )}
                </button>

                {/* Subcategories (Indented Tree Branch) */}
                {hasChildren && (
                  <div className="ml-3 pl-3 my-1 border-l-2 border-shaad-200/80 space-y-0.5">
                    {parent.children?.map((child) => {
                      const isChildActive = selectedCategorySlug === child.slug;

                      return (
                        <button
                          key={child.id}
                          type="button"
                          onClick={() => onSelectCategory(child.slug)}
                          className={cn(
                            'w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[11px] transition-all text-left relative',
                            isChildActive
                              ? 'bg-shaad-800 text-white font-semibold shadow-2xs'
                              : 'text-muted-foreground hover:text-foreground hover:bg-zen-100/80 font-normal'
                          )}
                        >
                          <span className="flex items-center gap-1.5 truncate">
                            <span className="text-muted-foreground/60 select-none">↳</span>
                            <span className="truncate">{child.name}</span>
                          </span>

                          {child._count?.products !== undefined && (
                            <span
                              className={cn(
                                'text-[10px] px-1.5 py-0.2 rounded-full font-mono shrink-0',
                                isChildActive
                                  ? 'bg-shaad-900 text-white'
                                  : 'text-muted-foreground/80'
                              )}
                            >
                              {child._count.products}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Price Filter */}
      <div className="space-y-3">
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
          Price Range ($)
        </label>
        <form onSubmit={handlePriceApply} className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-[10px] text-muted-foreground block mb-1">Min Price</span>
              <Input
                type="number"
                placeholder="0"
                value={localMin}
                onChange={(e) => setLocalMin(e.target.value)}
                className="h-9 text-xs rounded-xl bg-white border-border/70 font-mono"
              />
            </div>
            <div>
              <span className="text-[10px] text-muted-foreground block mb-1">Max Price</span>
              <Input
                type="number"
                placeholder="5000"
                value={localMax}
                onChange={(e) => setLocalMax(e.target.value)}
                className="h-9 text-xs rounded-xl bg-white border-border/70 font-mono"
              />
            </div>
          </div>
          <Button
            type="submit"
            variant="outline"
            size="sm"
            className="w-full text-xs rounded-xl h-8 border-border/80 hover:border-shaad-800"
          >
            Apply Price Filter
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
            className="w-4 h-4 rounded text-shaad-800 border-border focus:ring-shaad-800"
          />
          <span className="font-medium">In-Stock Pieces Only</span>
        </label>
      </div>

      {/* 5. Reset All Button */}
      <div className="pt-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onResetFilters}
          className="w-full text-xs text-muted-foreground hover:text-foreground justify-center gap-1.5 h-9"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset All Filters</span>
        </Button>
      </div>
    </aside>
  );
}
