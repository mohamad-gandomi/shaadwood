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
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-border/60 text-right">
      <div>
        <p className="text-xs uppercase tracking-widest text-shaad-700 font-semibold mb-1">
          کاتالوگ جامع آثار شادوود
        </p>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-foreground tracking-tight">
          دست‌ساخته‌های چوب طبیعی
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1 font-light">
          نمایش <span className="font-semibold text-foreground font-sans">{totalCount}</span> اثر برگزیده کارگاه
        </p>
      </div>

      <div className="flex items-center gap-2.5">
        <Button
          variant="outline"
          size="sm"
          onClick={onOpenMobileFilters}
          className="lg:hidden rounded-full border-border/80 text-xs gap-1.5 h-9"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>فیلترها</span>
        </Button>

        <div className="relative inline-flex items-center">
          <ArrowUpDown className="w-3.5 h-3.5 text-muted-foreground absolute left-3 pointer-events-none" />
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="pl-8 pr-4 py-2 text-xs rounded-full border border-border/80 bg-white hover:border-shaad-800 text-foreground font-sans font-medium appearance-none focus:outline-hidden focus:ring-1 focus:ring-shaad-800 transition-colors cursor-pointer shadow-2xs text-right"
            aria-label="مرتب‌سازی آثار کاتالوگ"
          >
            <option value="newest" className="font-sans py-1">جدیدترین آثار</option>
            <option value="price_asc" className="font-sans py-1">قیمت: از کم به زیاد</option>
            <option value="price_desc" className="font-sans py-1">قیمت: از زیاد به کم</option>
            <option value="name_asc" className="font-sans py-1">نام اثر: الف تا ی</option>
            <option value="name_desc" className="font-sans py-1">نام اثر: ی تا الف</option>
          </select>
        </div>
      </div>
    </div>
  );
}
