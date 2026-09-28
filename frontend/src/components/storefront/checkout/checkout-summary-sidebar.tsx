'use client';

import * as React from 'react';
import Image from 'next/image';
import { ShieldCheck, Lock, ArrowLeft, Loader2, Tag, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CartItem } from '@/context/cart-context';
import { ValidatedCoupon } from '@/types';
import { formatCurrency } from '@/lib/utils';

interface CheckoutSummarySidebarProps {
  items: CartItem[];
  subtotal: number; shippingAmount: number; taxAmount: number; grandTotal: number; discountAmount: number;
  coupon: ValidatedCoupon | null;
  isSubmitting: boolean;
  onSubmit: () => void;
  couponCodeInput: string;
  onCouponInputChange: (val: string) => void;
  onApplyCoupon: () => void;
  onRemoveCoupon: () => void;
  isValidatingCoupon: boolean;
  couponError: string | null;
}

export function CheckoutSummarySidebar({
  items,
  subtotal,
  shippingAmount,
  coupon,
  discountAmount,
  grandTotal,
  isSubmitting,
  onSubmit,
  couponCodeInput,
  onCouponInputChange,
  onApplyCoupon,
  onRemoveCoupon,
  isValidatingCoupon,
  couponError,
}: CheckoutSummarySidebarProps) {
  return (
    <div className="space-y-6 text-right">
      <div className="p-6 rounded-3xl bg-white border border-border/70 shadow-2xs space-y-6">
        <div className="flex items-center justify-between border-b border-border/60 pb-4">
          <h3 className="font-serif font-bold text-lg text-foreground">خلاصه سفارش</h3>
          <span className="text-xs font-sans text-muted-foreground">
            {items.reduce((acc, i) => acc + i.quantity, 0)} اثر انتخاب شده
          </span>
        </div>

        {/* Item mini-list */}
        <div className="space-y-3 max-h-72 overflow-y-auto pl-1">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-3 py-2 border-b border-border/40 last:border-0">
              <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-zen-100 border border-border/60 shrink-0">
                {item.image ? (
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[10px] text-muted-foreground font-sans">
                    شادوود
                  </div>
                )}
                <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded-md bg-shaad-900/80 text-[10px] font-sans font-bold text-white leading-none">
                  ×{item.quantity}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-semibold text-foreground truncate">{item.name}</h4>
                {item.finish && (
                  <p className="text-[11px] text-muted-foreground truncate">{item.finish}</p>
                )}
                <span className="text-xs font-sans font-medium text-foreground block mt-0.5">
                  {formatCurrency(item.price * item.quantity)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Coupon Code Section */}
        <div className="pt-2 border-t border-border/50">
          {coupon ? (
            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-emerald-700" />
                <div>
                  <span className="text-xs font-sans font-bold text-emerald-900">{coupon.code}</span>
                  <span className="text-[10px] text-emerald-700 block font-sans">
                    {formatCurrency(discountAmount)} تخفیف اعمال شد
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={onRemoveCoupon}
                className="text-xs text-muted-foreground hover:text-destructive flex items-center gap-0.5"
              >
                <X className="w-3.5 h-3.5" />
                <span>حذف</span>
              </button>
            </div>
          ) : (
            <div className="space-y-1.5">
              <div className="flex gap-2">
                <Input
                  value={couponCodeInput}
                  onChange={(e) => onCouponInputChange(e.target.value.toUpperCase())}
                  placeholder="کد تخفیف..."
                  className="h-9 text-xs font-sans bg-zen-50 border-border/70 text-right"
                />
                <Button
                  type="button"
                  size="sm"
                  onClick={onApplyCoupon}
                  disabled={isValidatingCoupon || !couponCodeInput.trim()}
                  className="h-9 px-3 text-xs bg-shaad-800 hover:bg-shaad-900 text-white shrink-0 font-medium"
                >
                  {isValidatingCoupon ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'اعمال'}
                </Button>
              </div>
              {couponError && <p className="text-[10px] text-destructive">{couponError}</p>}
            </div>
          )}
        </div>

        {/* Subtotal & Delivery Breakdown */}
        <div className="pt-3 border-t border-border/60 space-y-2 text-xs">
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
            <span>هزینه ارسال و تحویل</span>
            <span className="font-sans font-medium text-foreground">
              {shippingAmount === 0 ? (
                <span className="text-amber-800 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded font-semibold text-[10px]">
                  هماهنگی تلفنی (پس‌کرایه)
                </span>
              ) : (
                formatCurrency(shippingAmount)
              )}
            </span>
          </div>

          <div className="pt-3 border-t border-border/60 flex items-baseline justify-between text-base font-bold text-foreground">
            <span className="font-serif">مبلغ کل قابل پرداخت</span>
            <span className="font-sans text-xl sm:text-2xl text-shaad-900 font-bold">
              {formatCurrency(grandTotal)}
            </span>
          </div>
        </div>

        {/* Final Place Order Button */}
        <Button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting}
          size="lg"
          className="w-full rounded-full bg-shaad-800 hover:bg-shaad-900 text-white font-semibold text-xs tracking-wide py-6 gap-2 shadow-md disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>در حال ثبت نهایی سفارش...</span>
            </>
          ) : (
            <>
              <Lock className="w-4 h-4" />
              <span>پرداخت و ثبت نهایی سفارش</span>
              <ArrowLeft className="w-4 h-4" />
            </>
          )}
        </Button>
      </div>

      <div className="p-4 rounded-2xl bg-zen-50 border border-border/60 space-y-2 text-xs">
        <div className="flex items-center gap-2 font-semibold text-foreground">
          <ShieldCheck className="w-4 h-4 text-shaad-800 shrink-0" />
          <span>تضمین اصالت و ضمانت ۲۵ ساله شادوود</span>
        </div>
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          تمام سفارش‌ها شامل بسته‌بندی ایمن چندلایه چوب، بیمه باربری و خدمات پس از فروش اختصاصی کارگاه می‌باشند.
        </p>
      </div>
    </div>
  );
}
