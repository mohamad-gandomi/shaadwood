'use client';

import * as React from 'react';
import { Plus, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ProductsToolbarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedType: 'ALL' | 'SIMPLE' | 'VARIABLE';
  onSelectedTypeChange: (type: 'ALL' | 'SIMPLE' | 'VARIABLE') => void;
  onAddProduct: () => void;
}

export function ProductsToolbar({
  searchTerm,
  onSearchChange,
  selectedType,
  onSelectedTypeChange,
  onAddProduct,
}: ProductsToolbarProps) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 font-sans" dir="rtl">
      <div className="flex items-center gap-3 flex-1 max-w-lg">
        {/* Search Box */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <Input
            placeholder="جستجوی محصول بر اساس نام، شناسه (SKU) یا مشخصات..."
            className="pr-9 pl-9 bg-card h-9 text-right font-sans text-xs w-full"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Type Filter Buttons */}
        <div className="flex items-center rounded-lg border border-border bg-card p-1 text-xs shrink-0 h-9 box-border">
          {[
            { label: 'همه', val: 'ALL' },
            { label: 'متغیر', val: 'VARIABLE' },
            { label: 'ساده', val: 'SIMPLE' },
          ].map((tab) => (
            <button
              key={tab.val}
              type="button"
              onClick={() => onSelectedTypeChange(tab.val as any)}
              className={`h-full px-3 rounded-md font-medium transition-colors flex items-center justify-center font-sans ${
                selectedType === tab.val
                  ? 'bg-primary text-primary-foreground shadow-xs font-semibold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Top Action: Add Product */}
      <Button
        onClick={onAddProduct}
        className="gap-2 shrink-0 h-9 font-semibold shadow-xs font-sans self-start sm:self-auto"
      >
        <Plus className="w-4 h-4" />
        <span>افزودن محصول جدید</span>
      </Button>
    </div>
  );
}
