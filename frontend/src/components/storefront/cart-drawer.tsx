'use client';

import * as React from 'react';
import Link from 'next/link';
import { ShoppingBag, X, Plus, Minus, ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import { useCart } from '@/context/cart-context';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';

const FREE_SHIPPING_THRESHOLD = 1500;

export function CartDrawer() {
  const { items, isDrawerOpen, setIsDrawerOpen, removeItem, updateQuantity, totalPrice, totalCount } =
    useCart();

  const progressPercent = Math.min(100, Math.round((totalPrice / FREE_SHIPPING_THRESHOLD) * 100));
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - totalPrice);

  return (
    <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
      <SheetContent className="w-full sm:max-w-md p-0 flex flex-col bg-zen-50 border-l border-border/70">
        {/* Header */}
        <SheetHeader className="p-6 border-b border-border/60 bg-white/70 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-shaad-800 text-white flex items-center justify-center">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <SheetTitle className="text-base font-semibold tracking-tight text-foreground font-serif">
                  Studio Cart
                </SheetTitle>
                <SheetDescription className="text-xs text-muted-foreground">
                  {totalCount} handcrafted {totalCount === 1 ? 'piece' : 'pieces'} selected
                </SheetDescription>
              </div>
            </div>
          </div>

          {/* White-Glove Shipping Progress */}
          <div className="mt-4 pt-3 border-t border-border/40">
            <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
              <span className="flex items-center gap-1.5 text-shaad-800">
                <Truck className="w-3.5 h-3.5" />
                {remainingForFreeShipping === 0 ? (
                  <span className="font-semibold text-emerald-700">Free White-Glove Delivery unlocked!</span>
                ) : (
                  <span>Add {formatCurrency(remainingForFreeShipping)} for Free White-Glove Delivery</span>
                )}
              </span>
              <span className="font-mono text-[11px] text-muted-foreground">{progressPercent}%</span>
            </div>
            <div className="h-1.5 w-full bg-border/60 rounded-full overflow-hidden">
              <div
                className="h-full bg-shaad-800 transition-all duration-300 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </SheetHeader>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <div className="w-16 h-16 rounded-full bg-zen-100 border border-border/60 flex items-center justify-center mx-auto text-muted-foreground">
                <ShoppingBag className="w-7 h-7 stroke-[1.5]" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-medium text-foreground font-serif">Your cart is empty</h4>
                <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                  Explore our handcrafted solid wood catalog to curate your sanctuary.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsDrawerOpen(false)}
                className="border-shaad-800 text-shaad-800 hover:bg-shaad-50 text-xs mt-2"
              >
                Browse Collections
              </Button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 p-3.5 rounded-xl bg-white border border-border/60 shadow-2xs group transition-all"
              >
                {/* Thumbnail */}
                <div className="w-20 h-20 rounded-lg bg-zen-100 overflow-hidden shrink-0 border border-border/40 relative">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground/60 text-[10px]">
                      Solid Wood
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-medium text-xs text-foreground truncate">{item.name}</h4>
                      {item.finish && (
                        <p className="text-[11px] text-muted-foreground font-mono mt-0.5">{item.finish}</p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="text-muted-foreground/60 hover:text-red-600 transition-colors p-1 -mr-1"
                      aria-label="Remove item"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    {/* Quantity controls */}
                    <div className="flex items-center gap-2 border border-border/70 rounded-md px-2 py-0.5 bg-zen-50">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, -1)}
                        className="text-muted-foreground hover:text-foreground p-0.5"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-mono font-medium px-1">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, 1)}
                        className="text-muted-foreground hover:text-foreground p-0.5"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="font-bold text-xs font-mono text-foreground">
                      {formatCurrency(item.price * item.quantity)}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Actions */}
        {items.length > 0 && (
          <div className="p-6 border-t border-border/60 bg-white/80 backdrop-blur-sm space-y-4">
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span className="font-mono text-foreground font-semibold">{formatCurrency(totalPrice)}</span>
              </div>
              <div className="flex items-center justify-between text-muted-foreground">
                <span>White-Glove Delivery</span>
                <span className="font-mono text-foreground font-medium">
                  {remainingForFreeShipping === 0 ? 'FREE' : formatCurrency(75)}
                </span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-border/50 text-sm font-bold text-foreground">
                <span>Estimated Total</span>
                <span className="font-mono text-shaad-800">
                  {formatCurrency(totalPrice + (remainingForFreeShipping === 0 ? 0 : 75))}
                </span>
              </div>
            </div>

            <Button
              className="w-full bg-shaad-800 hover:bg-shaad-900 text-white font-medium py-5 text-xs tracking-wider uppercase gap-2 shadow-sm"
              onClick={() => {
                setIsDrawerOpen(false);
                toast.success('Directing to Shaadwood Secure Checkout', {
                  description: 'Payment options include Iranian Shaparak (Zarinpal) and International Cards.',
                });
              }}
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </Button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-muted-foreground">
              <ShieldCheck className="w-3.5 h-3.5 text-shaad-700" />
              <span>25-Year Solid Wood Heirloom Craftsmanship Warranty</span>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
