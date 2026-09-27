'use client';

import * as React from 'react';
import { Category } from '@/types';
import { cn } from '@/lib/utils';

interface ShopCategoryFilterTreeProps {
  categories: Category[];
  selectedCategorySlug: string;
  onSelectCategory: (slug: string) => void;
}

export function ShopCategoryFilterTree({
  categories,
  selectedCategorySlug,
  onSelectCategory,
}: ShopCategoryFilterTreeProps) {
  return (
    <div className="space-y-1 bg-white/60 p-2.5 rounded-2xl border border-border/60">
      <button
        type="button"
        onClick={() => onSelectCategory('ALL')}
        className={cn(
          'w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all text-right',
          selectedCategorySlug === 'ALL'
            ? 'bg-shaad-800 text-white shadow-2xs font-semibold'
            : 'text-foreground hover:bg-zen-100'
        )}
      >
        <span>همه مجموعه‌ها</span>
        <span
          className={cn(
            'text-[10px] px-1.5 py-0.5 rounded-full font-sans',
            selectedCategorySlug === 'ALL' ? 'bg-shaad-900 text-white' : 'bg-zen-100 text-muted-foreground'
          )}
        >
          کل
        </span>
      </button>

      {categories.map((parent) => {
        const isParentActive = selectedCategorySlug === parent.slug;
        const hasChildren = parent.children && parent.children.length > 0;
        const isAnyChildActive = Boolean(
          hasChildren && parent.children?.some((child) => child.slug === selectedCategorySlug)
        );

        return (
          <div key={parent.id} className="pt-1">
            <button
              type="button"
              onClick={() => onSelectCategory(parent.slug)}
              className={cn(
                'w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all text-right group',
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
                    isParentActive ? 'bg-white' : isAnyChildActive ? 'bg-shaad-700' : 'bg-shaad-400 group-hover:bg-shaad-600'
                  )}
                />
                <span className="truncate">{parent.name}</span>
              </span>

              {parent._count?.products !== undefined && (
                <span
                  className={cn(
                    'text-[10px] px-1.5 py-0.5 rounded-full font-sans shrink-0',
                    isParentActive ? 'bg-shaad-900 text-white' : 'bg-zen-100 text-muted-foreground'
                  )}
                >
                  {parent._count.products}
                </span>
              )}
            </button>

            {hasChildren && (
              <div className="mr-3 pr-3 my-1 border-r-2 border-shaad-200/80 space-y-0.5">
                {parent.children?.map((child) => {
                  const isChildActive = selectedCategorySlug === child.slug;
                  return (
                    <button
                      key={child.id}
                      type="button"
                      onClick={() => onSelectCategory(child.slug)}
                      className={cn(
                        'w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[11px] transition-all text-right relative',
                        isChildActive
                          ? 'bg-shaad-800 text-white font-semibold shadow-2xs'
                          : 'text-muted-foreground hover:text-foreground hover:bg-zen-100/80 font-normal'
                      )}
                    >
                      <span className="truncate">{child.name}</span>
                      {child._count?.products !== undefined && (
                        <span className="text-[10px] font-sans opacity-80">{child._count.products}</span>
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
  );
}
