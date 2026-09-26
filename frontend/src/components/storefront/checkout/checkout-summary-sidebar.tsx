'use client';

import * as React from 'react';
import Image from 'next/image';
import { ShieldCheck, Lock, Award, ArrowRight, Loader2, Tag, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CartItem } from '@/context/cart-context';
import { ValidatedCoupon } from '@/types';

interface CheckoutSummarySidebarProps {
  items: CartItem[];
  subtotal: number;
  shippingAmount: number;
  coupon: ValidatedCoupon | null;
  discountAmount: number;
  taxAmount: number;
  grandTotal: number;
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
  taxAmount,
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
    <div className="space-y-6">
      <div className="p-6 rounded-3xl bg-white border border-border/70 shadow-2xs space-y-6">
        <div className="flex items-center justify-between border-b border-border/60 pb-4">
          <h3 className="font-serif font-bold text-lg text-foreground">Order Summary</h3>
          <span className="text-xs font-mono text-muted-foreground">
            {items.reduce((acc, i) => acc + i.quantity, 0)} Selected Items
          </span>
        </div>

        {/* Item mini-list */}
        <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-3 py-2 border-b border-border/40 last:border-0">
              <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-zen-100 border border-border/60 shrink-0">
                {item.image ? (
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[10px] text-muted-foreground font-mono">
                    Shaadwood
                  </div>
                )}
                <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded-md bg-shaad-900/80 text-[10px] font-mono font-bold text-white leading-none">
                  ×{item.quantity}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-semibold text-foreground truncate">{item.name}</h4>
                {item.finish && (
                  <p className="text-[11px] text-muted-foreground truncate">{item.finish}</p>
                )}
                <span className="text-xs font-mono font-medium text-foreground block mt-0.5">
                  ${(item.price * item.quantity).toFixed(2)}
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
                  <span className="text-xs font-mono font-bold text-emerald-900">{coupon.code}</span>
                  <span className="text-[10px] text-emerald-700 block">
                    Saved ${discountAmount.toFixed(2)}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={onRemoveCoupon}
                className="text-xs text-muted-foreground hover:text-destructive p-1"
                title="Remove discount"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  value={couponCodeInput}
                  onChange={(e) => onCouponInputChange(e.target.value)}
                  placeholder="Studio voucher code"
                  className="h-10 text-xs font-mono uppercase bg-zen-50 border-border/70"
                />
                <Button
                  type="button"
                  onClick={onApplyCoupon}
                  disabled={!couponCodeInput.trim() || isValidatingCoupon}
                  variant="outline"
                  className="h-10 text-xs font-medium px-4 shrink-0 border-shaad-800 text-shaad-900 hover:bg-shaad-50"
                >
                  {isValidatingCoupon ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Apply'}
                </Button>
              </div>
              {couponError && <p className="text-[11px] text-destructive">{couponError}</p>}
            </div>
          )}
        </div>

        {/* Pricing calculations */}
        <div className="space-y-2.5 pt-2 border-t border-border/60 text-xs">
          <div className="flex justify-between text-muted-foreground">
            <span>Subtotal</span>
            <span className="font-mono font-medium text-foreground">${subtotal.toFixed(2)}</span>
          </div>

          {discountAmount > 0 && (
            <div className="flex justify-between text-emerald-700 font-medium">
              <span>Studio Discount</span>
              <span className="font-mono">-${discountAmount.toFixed(2)}</span>
            </div>
          )}

          <div className="flex justify-between text-muted-foreground">
            <span>Delivery & Handling</span>
            <span className="font-mono font-medium text-foreground">
              {shippingAmount === 0 ? 'Complimentary' : `$${shippingAmount.toFixed(2)}`}
            </span>
          </div>

          <div className="flex justify-between text-muted-foreground">
            <span>Estimated Sales Tax (8%)</span>
            <span className="font-mono font-medium text-foreground">${taxAmount.toFixed(2)}</span>
          </div>

          <div className="flex justify-between items-baseline pt-3 border-t border-border/80">
            <span className="font-serif font-bold text-base text-foreground">Total Investment</span>
            <span className="font-mono font-bold text-xl text-shaad-950">${grandTotal.toFixed(2)}</span>
          </div>
        </div>

        {/* Submit Order CTA */}
        <Button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting || items.length === 0}
          className="w-full h-13 rounded-2xl bg-shaad-800 hover:bg-shaad-900 text-white font-medium text-sm shadow-md transition-all flex items-center justify-center gap-2 group cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Placing Studio Order...</span>
            </>
          ) : (
            <>
              <span>Confirm & Place Studio Order</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </>
          )}
        </Button>

        <p className="text-[11px] text-center text-muted-foreground leading-relaxed">
          By placing your order, you agree to Shaadwood&apos;s Bespoke Craftsmanship terms and White-Glove delivery guidelines.
        </p>
      </div>

      {/* Trust & Guarantee Highlights */}
      <div className="p-5 rounded-3xl bg-zen-50/70 border border-border/60 space-y-3">
        <div className="flex items-center gap-3 text-xs text-foreground">
          <Award className="w-4 h-4 text-shaad-800 shrink-0" />
          <span>100% Solid Certified Hardwood (Walnut, Oak, Ash)</span>
        </div>
        <div className="flex items-center gap-3 text-xs text-foreground">
          <ShieldCheck className="w-4 h-4 text-shaad-800 shrink-0" />
          <span>10-Year Craftsmanship Structural Warranty</span>
        </div>
        <div className="flex items-center gap-3 text-xs text-foreground">
          <Lock className="w-4 h-4 text-shaad-800 shrink-0" />
          <span>256-Bit SSL Secured Banking Redirection</span>
        </div>
      </div>
    </div>
  );
}
