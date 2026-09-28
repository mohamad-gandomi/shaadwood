'use client';

import * as React from 'react';
import Image from 'next/image';
import { OrderItem } from '@/types';
import { formatCurrency } from '@/lib/utils';

interface OrderSuccessItemsProps {
  items: OrderItem[];
  subtotal: number;
  discountAmount?: number;
  shippingAmount?: number;
  total: number;
}

export function OrderSuccessItems({
  items,
  subtotal,
  discountAmount = 0,
  shippingAmount = 0,
  total,
}: OrderSuccessItemsProps) {
  return (
    <div className="p-6 rounded-3xl bg-white border border-border/70 shadow-2xs space-y-5 text-right">
      <h3 className="font-serif font-bold text-base text-foreground border-b border-border/60 pb-3">
        اقلام ثبت‌شده سفارش
      </h3>

      <div className="divide-y divide-border/40">
        {items.map((item) => {
          const itemImg = item.productImage || '/images/hero-bedroom-zen.webp';
          const unitPrice = Number(item.unitPrice || 0);

          return (
            <div key={item.id} className="py-3 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-zen-100 border border-border/60 shrink-0">
                  <Image src={itemImg} alt={item.product?.name || ''} fill className="object-cover" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-semibold text-xs sm:text-sm text-foreground truncate">
                    {item.product?.name || 'اثر دست‌ساز چوبی'}
                  </h4>
                  <p className="text-[11px] text-muted-foreground font-sans mt-0.5">
                    تعداد: {item.quantity} × {formatCurrency(unitPrice)}
                  </p>
                </div>
              </div>

              <div className="font-sans font-bold text-xs sm:text-sm text-shaad-900 shrink-0">
                {formatCurrency(unitPrice * item.quantity)}
              </div>
            </div>
          );
        })}
      </div>

      <div className="pt-3 border-t border-border/60 space-y-2 text-xs">
        <div className="flex items-center justify-between text-muted-foreground">
          <span>مجموع اقلام</span>
          <span className="font-sans">{formatCurrency(subtotal)}</span>
        </div>
        {discountAmount > 0 && (
          <div className="flex items-center justify-between text-emerald-700">
            <span>تخفیف</span>
            <span className="font-sans">-{formatCurrency(discountAmount)}</span>
          </div>
        )}
        <div className="flex items-center justify-between text-muted-foreground">
          <span>هزینه ارسال اختصاصی</span>
          <span className="font-sans">
            {shippingAmount === 0 ? (
              <span className="text-amber-800 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded font-semibold text-[10px]">
                هماهنگی تلفنی (پس‌کرایه)
              </span>
            ) : (
              formatCurrency(shippingAmount)
            )}
          </span>
        </div>
        <div className="pt-2 border-t border-border/50 flex items-center justify-between font-bold text-sm text-foreground">
          <span>مبلغ کل سفارش</span>
          <span className="font-sans text-base text-shaad-900">{formatCurrency(total)}</span>
        </div>
      </div>
    </div>
  );
}
