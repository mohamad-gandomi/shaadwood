'use client';

import * as React from 'react';
import Link from 'next/link';
import { ChevronLeft, Trash2 } from 'lucide-react';
import { useCart } from '@/context/cart-context';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { CartItemRow } from '@/components/storefront/cart/cart-item-row';
import { CartCouponForm } from '@/components/storefront/cart/cart-coupon-form';
import { CartOrderSummary } from '@/components/storefront/cart/cart-order-summary';
import { CartEmptyState } from '@/components/storefront/cart/cart-empty-state';

export default function CartPage() {
  const {
    items,
    updateQuantity,
    removeItem,
    clearCart,
    totalPrice,
    totalCount,
    appliedCoupon,
    discountAmount,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [shippingRate, setShippingRate] = React.useState<number>(0);

  React.useEffect(() => {
    api
      .getShippingMethods()
      .then((methods) => {
        if (methods && methods.length > 0) {
          const defaultMethod = methods.find((m) => m.isDefault) || methods[0];
          setShippingRate(defaultMethod.price);
        }
      })
      .catch(() => {
        setShippingRate(0);
      });
  }, []);

  const shippingCost = items.length > 0 ? shippingRate : 0;
  const finalTotal = Math.max(0, totalPrice - discountAmount + shippingCost);

  return (
    <div className="min-h-screen bg-zen-50/70 pt-8 pb-20 text-right">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <nav
          aria-label="مسیر راهنما"
          className="flex items-center gap-2 text-xs text-muted-foreground font-medium"
        >
          <Link href="/" className="hover:text-foreground transition-colors">
            خانه
          </Link>
          <ChevronLeft className="w-3.5 h-3.5 text-muted-foreground/50 shrink-0" />
          <Link href="/shop" className="hover:text-foreground transition-colors">
            کاتالوگ آثار
          </Link>
          <ChevronLeft className="w-3.5 h-3.5 text-muted-foreground/50 shrink-0" />
          <span className="text-foreground">سبد خرید آثار</span>
        </nav>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-border/60">
          <div>
            <p className="text-xs uppercase tracking-widest text-shaad-700 font-semibold mb-1">
              مجموعه برگزیده شما
            </p>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-foreground tracking-tight">
              سبد خرید آثار
            </h1>
          </div>
          {items.length > 0 && (
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground">
                <strong className="font-sans text-foreground font-semibold">{totalCount}</strong> اثر انتخاب شده است
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={clearCart}
                className="text-xs text-muted-foreground hover:text-destructive h-8 px-2 gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>خالی کردن سبد</span>
              </Button>
            </div>
          )}
        </div>

        {items.length === 0 ? (
          <CartEmptyState />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8 space-y-4">
              <div className="space-y-3">
                {items.map((item) => (
                  <CartItemRow
                    key={item.id}
                    item={item}
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeItem}
                  />
                ))}
              </div>

              <CartCouponForm
                cartSubtotal={totalPrice}
                appliedCoupon={appliedCoupon}
                discountAmount={discountAmount}
                onApplyCoupon={applyCoupon}
                onRemoveCoupon={removeCoupon}
              />
            </div>

            <div className="lg:col-span-4 lg:sticky lg:top-28">
              <CartOrderSummary
                subtotal={totalPrice}
                discountAmount={discountAmount}
                shippingCost={shippingCost}
                finalTotal={finalTotal}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
