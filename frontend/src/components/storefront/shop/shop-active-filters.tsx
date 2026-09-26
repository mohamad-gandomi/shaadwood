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
    <div className="flex flex-wrap items-center gap-2 pt-4">
      <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mr-1">
        Active Filters:
      </span>

      {categorySlug !== 'ALL' && (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-shaad-50 text-shaad-900 border border-shaad-200">
          <span>Collection: {categoryName || categorySlug}</span>
          <button
            type="button"
            onClick={onClearCategory}
            className="hover:opacity-75 transition-opacity"
            aria-label="Remove category filter"
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      )}

      {Boolean(searchQuery) && (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-shaad-50 text-shaad-900 border border-shaad-200">
          <span>Search: &ldquo;{searchQuery}&rdquo;</span>
          <button
            type="button"
            onClick={onClearSearch}
            className="hover:opacity-75 transition-opacity"
            aria-label="Remove search filter"
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      )}

      {(Boolean(minPrice) || Boolean(maxPrice)) && (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-shaad-50 text-shaad-900 border border-shaad-200 font-mono">
          <span>
            ${minPrice || '0'} – ${maxPrice || '∞'}
          </span>
          <button
            type="button"
            onClick={onClearPrice}
            className="hover:opacity-75 transition-opacity"
            aria-label="Remove price filter"
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      )}

      {inStockOnly && (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-shaad-50 text-shaad-900 border border-shaad-200">
          <span>In-Stock Only</span>
          <button
            type="button"
            onClick={onClearInStock}
            className="hover:opacity-75 transition-opacity"
            aria-label="Remove in-stock filter"
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      )}

      <button
        type="button"
        onClick={onClearAll}
        className="text-xs text-shaad-800 hover:text-shaad-900 font-medium underline underline-offset-4 ml-1"
      >
        Clear All
      </button>
    </div>
  );
}
