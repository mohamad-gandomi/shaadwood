'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  CheckCircle2, Printer, ChevronLeft, ShieldCheck, MapPin, PackageCheck, ArrowRight,
} from 'lucide-react';
import { api } from '@/lib/api';
import { Order } from '@/types';
import { formatDate } from '@/lib/utils';
import { OrderSuccessItems } from '@/components/storefront/checkout/order-success-items';

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
      .then((data) => setOrder(data))
      .catch((err) => {
        console.error('Failed to load order confirmation:', err);
        setError('یافتن اطلاعات سفارش امکان‌پذیر نبود. لطفاً شناسه سفارش را بررسی فرمایید.');
      })
      .finally(() => setLoading(false));
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-20 text-center">
        <div className="w-12 h-12 rounded-full border-2 border-shaad-800 border-t-transparent animate-spin mb-4" />
        <p className="text-sm font-sans text-muted-foreground">در حال بارگذاری اطلاعات سفارش...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-16 text-center max-w-lg mx-auto">
        <div className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center text-destructive mb-4 border border-rose-200">
          <ShieldCheck className="w-8 h-8 stroke-[1.5]" />
        </div>
        <h1 className="font-serif text-2xl font-bold text-foreground mb-2">اطلاعیه سفارش</h1>
        <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
          {error || 'نمایش تأییدیه این سفارش مقدور نمی‌باشد.'}
        </p>
        <Link
          href="/shop"
          className="px-6 py-3 rounded-2xl bg-shaad-800 text-white text-xs font-medium hover:bg-shaad-900 transition-colors"
        >
          بازگشت به کاتالوگ آثار
        </Link>
      </div>
    );
  }

  const shippingAddr = (order.shippingAddress || {}) as any;

  return (
    <div className="min-h-screen bg-zen-50/40 pb-24 text-right">
      <div className="border-b border-border/60 bg-white/80 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-sans text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">
              خانه
            </Link>
            <ChevronLeft className="w-3.5 h-3.5 text-muted-foreground/60" />
            <Link href="/shop" className="hover:text-foreground transition-colors">
              کاتالوگ آثار
            </Link>
            <ChevronLeft className="w-3.5 h-3.5 text-muted-foreground/60" />
            <span className="text-foreground font-semibold">تأییدیه سفارش</span>
          </div>

          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors print:hidden"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>چاپ فاکتور</span>
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 space-y-8">
        {/* Success Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-border/70 shadow-sm text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-widest text-emerald-800 font-semibold font-sans">
              سفارش با موفقیت ثبت و تأیید شد
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
              سپاس از اعتماد شما به آتلیه شادوود
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed pt-1">
              شماره پیگیری سفارش شما <strong className="text-foreground font-sans font-semibold">{order.orderNumber}</strong> می‌باشد. پیامک تأیید و جزئیات آماده‌سازی به زودی برای شما ارسال می‌گردد.
            </p>
          </div>
          <div className="pt-2 text-xs text-muted-foreground font-sans">
            تاریخ ثبت: {formatDate(order.createdAt)}
          </div>
        </div>

        {/* Order Details & Summary */}
        <OrderSuccessItems
          items={order.items || []}
          subtotal={Number(order.totalAmount || 0)}
          discountAmount={Number(order.discountAmount || 0)}
          shippingAmount={Number(order.shippingAmount || 0)}
          total={Number(order.totalAmount || 0)}
        />

        {/* Shipping Address Information */}
        <div className="p-6 rounded-3xl bg-white border border-border/70 shadow-2xs space-y-3">
          <div className="flex items-center gap-2 font-serif font-bold text-base text-foreground border-b border-border/60 pb-3">
            <MapPin className="w-4 h-4 text-shaad-800" />
            <span>اطلاعات نشانی تحویل و باربری</span>
          </div>
          <div className="text-xs space-y-1.5 leading-relaxed text-muted-foreground">
            <p className="font-semibold text-foreground">
              تحویل‌گیرنده: {shippingAddr.recipientName || order.customerName}
            </p>
            <p>تلفن هماهنگی: {shippingAddr.phone || order.customerPhone}</p>
            <p>نشانی: {shippingAddr.province}، {shippingAddr.city}، {shippingAddr.street}</p>
            <p>کد پستی: {shippingAddr.postalCode}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 print:hidden">
          <Link
            href="/account"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-shaad-800 hover:bg-shaad-900 text-white text-xs font-semibold shadow-sm transition-all"
          >
            <PackageCheck className="w-4 h-4" />
            <span>مشاهده وضعیت سفارش در پروفایل</span>
          </Link>
          <Link
            href="/shop"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowRight className="w-3.5 h-3.5" />
            <span>ادامه مرور کاتالوگ آثار</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
