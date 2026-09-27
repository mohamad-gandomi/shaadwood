'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';

interface CartOrderSummaryProps {
  subtotal: number;
  discountAmount: number;
  shippingCost: number;
  finalTotal: number;
}

export function CartOrderSummary({
  subtotal,
  discountAmount,
  shippingCost,
  finalTotal,
}: CartOrderSummaryProps) {
  return (
    <div className="space-y-6 text-right">
      <div className="p-6 rounded-3xl bg-white border border-border/70 shadow-sm space-y-6">
        <h3 className="font-serif font-bold text-lg text-foreground border-b border-border/60 pb-3">
          خلاصه سفارش
        </h3>

        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span>مجموع اقلام</span>
            <span className="font-sans font-medium text-foreground">{formatCurrency(subtotal)}</span>
          </div>

          {discountAmount > 0 && (
            <div className="flex items-center justify-between text-emerald-700 font-medium">
              <span>تخفیف اختصاصی</span>
              <span className="font-sans">-{formatCurrency(discountAmount)}</span>
            </div>
          )}

          <div className="flex items-center justify-between text-muted-foreground">
            <span>هزینه ارسال و تحویل اختصاصی</span>
            <span className="font-sans font-medium text-foreground">
              {shippingCost === 0 ? (
                <span className="text-emerald-700 font-semibold text-[11px]">رایگان</span>
              ) : (
                formatCurrency(shippingCost)
              )}
            </span>
          </div>

          <div className="pt-3 border-t border-border/60 flex items-baseline justify-between text-base font-bold text-foreground">
            <span className="font-serif">مبلغ کل قابل پرداخت</span>
            <div className="text-left">
              <span className="font-sans text-xl sm:text-2xl text-shaad-900 font-bold">
                {formatCurrency(finalTotal)}
              </span>
            </div>
          </div>
        </div>

        <Button
          asChild
          size="lg"
          className="w-full rounded-full font-semibold text-xs tracking-wide gap-2 py-6 bg-shaad-800 hover:bg-shaad-900 text-white shadow-md transition-all"
        >
          <Link href="/checkout">
            <span>تکمیل خرید و ثبت نهایی سفارش</span>
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </Button>

        <div className="text-center pt-1">
          <Link
            href="/shop"
            className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-4 inline-flex items-center gap-1.5"
          >
            <ArrowRight className="w-3.5 h-3.5" />
            <span>بازگشت و ادامه مرور کاتالوگ</span>
          </Link>
        </div>
      </div>

      <div className="p-5 rounded-2xl bg-zen-50 border border-border/50 space-y-3">
        <div className="flex items-start gap-2.5 text-xs">
          <ShieldCheck className="w-4 h-4 text-shaad-700 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-foreground">ضمانت ۲۵ ساله ساختار چوب طبیعی</h4>
            <p className="text-[10px] text-muted-foreground mt-0.5 leading-relaxed">
              اصالت اتصالات کهن نجاری و سلامت چوب طبیعی تضمین شده است.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
