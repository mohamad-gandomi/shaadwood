'use client';

import * as React from 'react';
import Link from 'next/link';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { CartItem } from '@/context/cart-context';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface CartItemRowProps {
  item: CartItem;
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
}

export function CartItemRow({ item, onUpdateQuantity, onRemove }: CartItemRowProps) {
  const lineTotal = item.price * item.quantity;

  return (
    <div className="p-3.5 sm:p-5 rounded-2xl bg-white border border-border/60 hover:border-shaad-200 shadow-2xs transition-all space-y-3 sm:space-y-0 sm:flex sm:items-center sm:justify-between sm:gap-4 text-right">
      <div className="flex items-start sm:items-center justify-between sm:justify-start gap-3 sm:gap-4 min-w-0 flex-1">
        <Link
          href={`/shop/${item.productId}`}
          className="w-16 h-16 sm:w-24 sm:h-24 rounded-xl bg-zen-100 overflow-hidden shrink-0 border border-border/50 block group relative"
        >
          <img
            src={item.image || '/images/hero-bedroom-zen.webp'}
            alt={item.name}
            onError={(e) => {
              e.currentTarget.src = '/images/hero-bedroom-zen.webp';
            }}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>

        <div className="space-y-1 min-w-0 flex-1">
          <Link
            href={`/shop/${item.productId}`}
            className="font-serif font-bold text-xs sm:text-base text-foreground hover:text-shaad-800 transition-colors line-clamp-2 sm:line-clamp-1 block leading-snug"
          >
            {item.name}
          </Link>

          {item.finish && (
            <div className="inline-flex items-center px-2 py-0.5 rounded-md bg-shaad-50 text-shaad-800 text-[10px] sm:text-[11px] font-medium border border-shaad-200">
              <span className="truncate max-w-[180px] sm:max-w-none">{item.finish}</span>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-2 text-[11px] sm:text-xs text-muted-foreground font-sans">
            {item.sku && <span className="hidden sm:inline font-sans">شناسه: {item.sku} &bull;</span>}
            <span className="font-semibold text-foreground">{formatCurrency(item.price)} برای هر اثر</span>
          </div>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onRemove(item.id)}
          className="sm:hidden h-8 w-8 p-0 text-muted-foreground hover:text-destructive shrink-0 -mt-1 -ml-1"
          aria-label="حذف اثر"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-5 pt-2.5 sm:pt-0 border-t sm:border-t-0 border-border/40">
        <div className="flex items-center rounded-full border border-border/80 bg-zen-50 p-1 shadow-2xs">
          <button
            type="button"
            onClick={() => onUpdateQuantity(item.id, -1)}
            disabled={item.quantity <= 1}
            className="w-7 h-7 rounded-full flex items-center justify-center text-foreground hover:bg-white disabled:opacity-30 transition-colors"
            aria-label="کاهش تعداد"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="w-8 sm:w-9 text-center font-sans text-xs font-bold text-foreground">
            {item.quantity}
          </span>
          <button
            type="button"
            onClick={() => onUpdateQuantity(item.id, 1)}
            className="w-7 h-7 rounded-full flex items-center justify-center text-foreground hover:bg-white transition-colors"
            aria-label="افزایش تعداد"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="text-left sm:min-w-[110px]">
          <div className="font-sans font-bold text-sm sm:text-base text-shaad-900">
            {formatCurrency(lineTotal)}
          </div>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onRemove(item.id)}
          className="hidden sm:inline-flex h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-rose-50 rounded-full"
          aria-label="حذف اثر از سبد"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
