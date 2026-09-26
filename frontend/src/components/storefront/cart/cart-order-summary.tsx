'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, HeartHandshake, Truck, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';

interface CartOrderSummaryProps {
  subtotal: number;
  discountAmount: number;
  shippingCost: number;
  finalTotal: number;
  isProceeding?: boolean;
}

export function CartOrderSummary({
  subtotal,
  discountAmount,
  shippingCost,
  finalTotal,
  isProceeding = false,
}: CartOrderSummaryProps) {
  return (
    <div className="space-y-6">
      <div className="p-6 rounded-3xl bg-white border border-border/70 shadow-sm space-y-6">
        <h3 className="font-serif font-bold text-lg text-foreground border-b border-border/60 pb-3">
          Order Summary
        </h3>

        {/* Financial Breakdown */}
        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span>Subtotal</span>
            <span className="font-mono font-medium text-foreground">{formatCurrency(subtotal)}</span>
          </div>

          {discountAmount > 0 && (
            <div className="flex items-center justify-between text-emerald-700 font-medium">
              <span>Privilege Discount</span>
              <span className="font-mono">-{formatCurrency(discountAmount)}</span>
            </div>
          )}

          <div className="flex items-center justify-between text-muted-foreground">
            <span>Delivery & Handling</span>
            <span className="font-mono font-medium text-foreground">
              {shippingCost === 0 ? (
                <span className="text-emerald-700 font-semibold uppercase text-[11px]">Free</span>
              ) : (
                formatCurrency(shippingCost)
              )}
            </span>
          </div>

          <div className="pt-3 border-t border-border/60 flex items-baseline justify-between text-base font-bold text-foreground">
            <span className="font-serif">Estimated Total</span>
            <div className="text-right">
              <span className="font-mono text-xl sm:text-2xl text-shaad-900 font-bold">
                {formatCurrency(finalTotal)}
              </span>
              <p className="text-[10px] text-muted-foreground font-sans font-normal mt-0.5">
                Taxes calculated at dispatch
              </p>
            </div>
          </div>
        </div>

        {/* Proceed to Checkout CTA */}
        <Button
          asChild
          size="lg"
          className="w-full rounded-full font-semibold text-xs tracking-wider uppercase gap-2 py-6 bg-shaad-800 hover:bg-shaad-900 text-white shadow-md transition-all"
        >
          <Link href="/checkout">
            <span>Proceed to Studio Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>

        {/* Continue Shopping Link */}
        <div className="text-center pt-1">
          <Link
            href="/shop"
            className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-4"
          >
            &larr; Continue Exploring Catalog
          </Link>
        </div>
      </div>

      {/* Trust Guarantees */}
      <div className="p-5 rounded-2xl bg-zen-50 border border-border/50 space-y-3">
        <div className="flex items-start gap-2.5 text-xs">
          <ShieldCheck className="w-4 h-4 text-shaad-700 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-foreground">10-Year Master Craftsman Warranty</h4>
            <p className="text-[10px] text-muted-foreground">
              Structural joinery and solid timber integrity guaranteed.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2.5 text-xs">
          <Truck className="w-4 h-4 text-shaad-700 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-foreground">White-Glove In-Home Placement</h4>
            <p className="text-[10px] text-muted-foreground">
              Delivered, unpacked, and placed by specialized fine furniture artisans.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2.5 text-xs">
          <RotateCcw className="w-4 h-4 text-shaad-700 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-foreground">30-Day In-Home Sanctuary Trial</h4>
            <p className="text-[10px] text-muted-foreground">
              Experience the warmth and proportion in your space risk-free.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
