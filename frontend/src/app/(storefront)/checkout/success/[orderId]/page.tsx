'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import {
  CheckCircle2,
  Clock,
  Printer,
  ChevronRight,
  ShieldCheck,
  Truck,
  Sparkles,
  Phone,
  MapPin,
  CreditCard,
  PackageCheck,
  ShoppingBag,
  ArrowRight,
} from 'lucide-react';
import { api } from '@/lib/api';
import { Order } from '@/types';
import { Button } from '@/components/ui/button';

export default function OrderSuccessPage() {
  const params = useParams();
  const orderId = params?.orderId as string;

  const [order, setOrder] = React.useState<Order | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!orderId) return;
    setLoading(true);
    api
      .getOrder(orderId)
      .then((data) => {
        setOrder(data);
      })
      .catch((err) => {
        console.error('Failed to load order confirmation:', err);
        setError('Could not locate order details. Please check your order ID or contact studio support.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-20">
        <div className="w-12 h-12 rounded-full border-2 border-shaad-800 border-t-transparent animate-spin mb-4" />
        <p className="text-sm font-mono text-muted-foreground">Retrieving studio commission details...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-16 text-center max-w-lg mx-auto">
        <div className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center text-destructive mb-4 border border-rose-200">
          <ShieldCheck className="w-8 h-8 stroke-[1.5]" />
        </div>
        <h1 className="font-serif text-2xl font-bold text-foreground mb-2">Order Notice</h1>
        <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
          {error || 'Unable to display confirmation for this order.'}
        </p>
        <Link
          href="/shop"
          className="px-6 py-3 rounded-2xl bg-shaad-800 text-white text-xs font-medium hover:bg-shaad-900 transition-colors"
        >
          Return to Atelier Catalog
        </Link>
      </div>
    );
  }

  const shippingAddr = (order.shippingAddress || {}) as any;

  return (
    <div className="min-h-screen bg-zen-50/40 pb-24">
      {/* Top Breadcrumb */}
      <div className="border-b border-border/60 bg-white/80 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/60" />
            <Link href="/shop" className="hover:text-foreground transition-colors">
              Shop
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/60" />
            <span className="text-foreground font-semibold">Confirmation</span>
          </div>

          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors print:hidden"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Receipt</span>
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-10 pb-16 space-y-8">
        {/* Celebration Header Card */}
        <div className="p-8 rounded-3xl bg-white border border-border/70 shadow-2xs text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto border border-emerald-200/80 shadow-xs">
            <CheckCircle2 className="w-8 h-8 stroke-[2]" />
          </div>

          <div className="space-y-1">
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-800 font-semibold">
              Commission Placed Successfully
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">
              Thank You, {order.customerName}
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed pt-1">
              Your bespoke commission has been assigned to our master craftsmen. A confirmation record is prepared below.
            </p>
          </div>

          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-zen-50 border border-border/80 text-xs font-mono">
            <span className="text-muted-foreground">Order Reference:</span>
            <span className="font-bold text-shaad-900 text-sm tracking-wide">{order.orderNumber}</span>
          </div>
        </div>

        {/* Guest Auto-Registration & OTP Login Notice */}
        <div className="p-5 sm:p-6 rounded-3xl bg-shaad-50/70 border border-shaad-200/80 text-shaad-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-2xl bg-shaad-800 text-white flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-sm text-shaad-900">
                Your Shaadwood Account is Ready
              </h4>
              <p className="text-xs text-shaad-800/90 mt-0.5 leading-relaxed">
                Registered under mobile phone{' '}
                <span className="font-mono font-bold text-shaad-950">
                  {order.customerPhone || 'your contact phone'}
                </span>
                . You can log in anytime with an instant SMS OTP code to check your order progress and track dispatch.
              </p>
            </div>
          </div>
          <Link
            href="/auth/otp"
            className="shrink-0 px-4 py-2.5 rounded-xl bg-shaad-800 hover:bg-shaad-900 text-white text-xs font-medium font-mono flex items-center gap-1.5 transition-colors"
          >
            <span>Access Portal</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Order Status & Timeline Banner */}
        <div className="p-6 rounded-3xl bg-white border border-border/70 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <div className="flex items-center gap-2">
              <PackageCheck className="w-4 h-4 text-shaad-800" />
              <h3 className="font-serif font-bold text-sm text-foreground">Commission Progression</h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold uppercase bg-amber-50 text-amber-800 border border-amber-200">
                Status: {order.status}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold uppercase bg-emerald-50 text-emerald-800 border border-emerald-200">
                Payment: {order.paymentStatus}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1 text-center">
            <div className="p-3 rounded-2xl bg-shaad-50/80 border border-shaad-200 text-shaad-900">
              <span className="text-[10px] font-mono uppercase block text-shaad-700">Step 1</span>
              <span className="text-xs font-semibold block mt-0.5">Order Received</span>
            </div>
            <div className="p-3 rounded-2xl bg-zen-50 border border-border/70 text-muted-foreground">
              <span className="text-[10px] font-mono uppercase block">Step 2</span>
              <span className="text-xs font-semibold block mt-0.5">Artisan Review</span>
            </div>
            <div className="p-3 rounded-2xl bg-zen-50 border border-border/70 text-muted-foreground">
              <span className="text-[10px] font-mono uppercase block">Step 3</span>
              <span className="text-xs font-semibold block mt-0.5">Joinery & Finish</span>
            </div>
            <div className="p-3 rounded-2xl bg-zen-50 border border-border/70 text-muted-foreground">
              <span className="text-[10px] font-mono uppercase block">Step 4</span>
              <span className="text-xs font-semibold block mt-0.5">White-Glove Dispatch</span>
            </div>
          </div>
        </div>

        {/* Ordered Pieces & Financial Breakdown */}
        <div className="p-6 rounded-3xl bg-white border border-border/70 shadow-2xs space-y-6">
          <div className="border-b border-border/60 pb-3">
            <h3 className="font-serif font-bold text-base text-foreground">Commission Items</h3>
          </div>

          <div className="divide-y divide-border/50">
            {order.items?.map((item) => (
              <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex items-center gap-4">
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-zen-100 border border-border/60 shrink-0">
                  {item.productImage ? (
                    <Image src={item.productImage} alt={item.productName} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[10px] text-muted-foreground font-mono">
                      Shaadwood
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm text-foreground truncate">{item.productName}</h4>
                  {item.variantName && (
                    <p className="text-xs text-muted-foreground mt-0.5">{item.variantName}</p>
                  )}
                  {item.productSku && (
                    <span className="text-[10px] font-mono text-muted-foreground block">
                      SKU: {item.productSku}
                    </span>
                  )}
                </div>

                <div className="text-right">
                  <span className="text-xs font-mono text-muted-foreground block">
                    ${Number(item.unitPrice).toFixed(2)} × {item.quantity}
                  </span>
                  <span className="text-sm font-mono font-bold text-foreground block mt-0.5">
                    ${Number(item.totalPrice).toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="border-t border-border/60 pt-4 space-y-2 text-xs">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span className="font-mono font-medium text-foreground">${Number(order.subtotal).toFixed(2)}</span>
            </div>

            {Number(order.discountAmount) > 0 && (
              <div className="flex justify-between text-emerald-700 font-medium">
                <span>Studio Discount {order.couponCode && `(${order.couponCode})`}</span>
                <span className="font-mono">-${Number(order.discountAmount).toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between text-muted-foreground">
              <span>Delivery & White-Glove Placement</span>
              <span className="font-mono font-medium text-foreground">
                ${Number(order.shippingAmount).toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between text-muted-foreground">
              <span>Estimated Sales Tax (8%)</span>
              <span className="font-mono font-medium text-foreground">${Number(order.taxAmount).toFixed(2)}</span>
            </div>

            <div className="flex justify-between items-baseline pt-3 border-t border-border/80">
              <span className="font-serif font-bold text-base text-foreground">Total Investment</span>
              <span className="font-mono font-bold text-xl text-shaad-950">
                ${Number(order.totalAmount).toFixed(2)} {order.currency}
              </span>
            </div>
          </div>
        </div>

        {/* Shipping & Payment Information Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Shipping Destination */}
          <div className="p-6 rounded-3xl bg-white border border-border/70 shadow-2xs space-y-3">
            <div className="flex items-center gap-2 border-b border-border/60 pb-3">
              <Truck className="w-4 h-4 text-shaad-800" />
              <h3 className="font-serif font-bold text-sm text-foreground">Delivery Destination</h3>
            </div>

            <div className="space-y-1.5 text-xs">
              <p className="font-semibold text-foreground">
                {shippingAddr.recipientName || order.customerName}
              </p>
              <p className="text-muted-foreground flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-muted-foreground/80 shrink-0" />
                <span className="font-mono">{shippingAddr.phone || order.customerPhone}</span>
              </p>
              <p className="text-muted-foreground flex items-start gap-1.5 leading-relaxed pt-1">
                <MapPin className="w-3.5 h-3.5 text-muted-foreground/80 shrink-0 mt-0.5" />
                <span>
                  {shippingAddr.street}, {shippingAddr.city}, {shippingAddr.province}
                  {shippingAddr.postalCode && ` - Postal: ${shippingAddr.postalCode}`}
                </span>
              </p>
              {order.shippingMethod && (
                <div className="pt-2 text-[11px] font-mono text-shaad-800">
                  Method: {order.shippingMethod}
                </div>
              )}
            </div>
          </div>

          {/* Settlement Details */}
          <div className="p-6 rounded-3xl bg-white border border-border/70 shadow-2xs space-y-3">
            <div className="flex items-center gap-2 border-b border-border/60 pb-3">
              <CreditCard className="w-4 h-4 text-shaad-800" />
              <h3 className="font-serif font-bold text-sm text-foreground">Settlement & Gateway</h3>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Gateway:</span>
                <span className="font-medium text-foreground">{order.paymentMethod}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Payment Status:</span>
                <span className="font-mono font-semibold text-foreground uppercase">{order.paymentStatus}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Currency:</span>
                <span className="font-mono text-foreground">{order.currency}</span>
              </div>

              {order.paymentStatus === 'PENDING' && order.paymentMethod === 'BANK_TRANSFER' && (
                <div className="p-3 rounded-xl bg-zen-100/70 border border-border/60 text-[11px] text-muted-foreground mt-2 leading-relaxed">
                  <span className="font-semibold block text-foreground mb-0.5">Wire Transfer Information:</span>
                  Please transfer total amount to Studio IBAN / Sheba and reference order #{order.orderNumber}.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Navigation CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 print:hidden">
          <Link
            href="/shop"
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-shaad-800 hover:bg-shaad-900 text-white font-medium text-xs font-mono shadow-md transition-all flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Continue Exploring Collection</span>
          </Link>

          <button
            type="button"
            onClick={() => window.print()}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl border border-border/80 hover:bg-white text-muted-foreground hover:text-foreground text-xs font-mono transition-colors flex items-center justify-center gap-2"
          >
            <Printer className="w-4 h-4" />
            <span>Print Official Receipt</span>
          </button>
        </div>
      </div>
    </div>
  );
}
