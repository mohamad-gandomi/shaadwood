'use client';

import * as React from 'react';
import { X } from 'lucide-react';

interface ActiveFiltersProps {
  categorySlug: string;
  categoryName?: string;
  onClearCategory: () => void;
  searchQuery: string;
  onClearSearch: () => void;
  minPrice: string;
  maxPrice: string;
  onClearPrice: () => void;
  inStockOnly: boolean;
  onClearInStock: () => void;
  onClearAll: () => void;
}

export function ShopActiveFilters({
  categorySlug,
  categoryName,
  onClearCategory,
  searchQuery,
  onClearSearch,
  minPrice,
  maxPrice,
  onClearPrice,
  inStockOnly,
  onClearInStock,
  onClearAll,
}: ActiveFiltersProps) {
  const hasActiveFilters =
    categorySlug !== 'ALL' ||
    Boolean(searchQuery) ||
    Boolean(minPrice || maxPrice) ||
    inStockOnly;

  if (!hasActiveFilters) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 pt-4 text-right">
      <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider ml-1">
        فیلترهای فعال:
      </span>

      {categorySlug !== 'ALL' && (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-shaad-50 text-shaad-900 border border-shaad-200">
          <span>مجموعه: {categoryName || categorySlug}</span>
          <button
            type="button"
            onClick={onClearCategory}
            className="hover:opacity-75 transition-opacity"
            aria-label="حذف فیلتر دسته‌بندی"
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      )}

      {Boolean(searchQuery) && (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-shaad-50 text-shaad-900 border border-shaad-200">
          <span>جستجو: «{searchQuery}»</span>
          <button
            type="button"
            onClick={onClearSearch}
            className="hover:opacity-75 transition-opacity"
            aria-label="حذف فیلتر جستجو"
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      )}

      {(Boolean(minPrice) || Boolean(maxPrice)) && (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-shaad-50 text-shaad-900 border border-shaad-200 font-sans">
          <span>
            {minPrice ? Number(minPrice).toLocaleString('fa-IR') : '۰'} تا {maxPrice ? Number(maxPrice).toLocaleString('fa-IR') : 'بی‌نهایت'} تومان
          </span>
          <button
            type="button"
            onClick={onClearPrice}
            className="hover:opacity-75 transition-opacity"
            aria-label="حذف فیلتر قیمت"
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      )}

      {inStockOnly && (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-shaad-50 text-shaad-900 border border-shaad-200">
          <span>فقط آثار آماده تحویل</span>
          <button
            type="button"
            onClick={onClearInStock}
            className="hover:opacity-75 transition-opacity"
            aria-label="حذف فیلتر موجودی"
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      )}

      <button
        type="button"
        onClick={onClearAll}
        className="text-xs text-muted-foreground hover:text-shaad-900 font-medium underline underline-offset-4 mr-2"
      >
        حذف همه فیلترها
      </button>
    </div>
  );
}
