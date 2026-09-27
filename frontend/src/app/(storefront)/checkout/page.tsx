'use client';

import * as React from 'react';
import Link from 'next/link';
import { ChevronLeft, ArrowRight, ShoppingBag } from 'lucide-react';
import { CheckoutContactForm } from '@/components/storefront/checkout/checkout-contact-form';
import { CheckoutShippingForm } from '@/components/storefront/checkout/checkout-shipping-form';
import { CheckoutShippingMethod } from '@/components/storefront/checkout/checkout-shipping-method';
import { CheckoutPaymentMethod } from '@/components/storefront/checkout/checkout-payment-method';
import { CheckoutSummarySidebar } from '@/components/storefront/checkout/checkout-summary-sidebar';
import { useCheckoutForm } from './use-checkout-form';

export default function CheckoutPage() {
  const form = useCheckoutForm();

  if (form.items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-16 text-center">
        <div className="w-20 h-20 rounded-full bg-shaad-50 flex items-center justify-center text-shaad-800 mb-5 border border-shaad-200">
          <ShoppingBag className="w-9 h-9 stroke-[1.5]" />
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mb-2">
          سبد خرید شما در حال حاضر خالی است
        </h1>
        <p className="text-sm text-muted-foreground max-w-md mb-8 leading-relaxed">
          برای آغاز فرایند ثبت سفارش، دست‌ساخته‌های چوب طبیعی مورد نظر خود را از کاتالوگ آثار شادوود برگزینید.
        </p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-shaad-800 hover:bg-shaad-900 text-white font-medium text-sm shadow-md transition-all"
        >
          <span>مشاهده کاتالوگ آثار</span>
          <ChevronLeft className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zen-50/40 pb-24 text-right">
      <div className="border-b border-border/60 bg-white/80 backdrop-blur-md sticky top-16 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">
              خانه
            </Link>
            <ChevronLeft className="w-3.5 h-3.5 text-muted-foreground/60" />
            <Link href="/cart" className="hover:text-foreground transition-colors">
              سبد خرید
            </Link>
            <ChevronLeft className="w-3.5 h-3.5 text-muted-foreground/60" />
            <span className="text-foreground font-semibold">ثبت سفارش و پرداخت</span>
          </div>

          <Link
            href="/cart"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-shaad-800 transition-colors"
          >
            <span>بازگشت به سبد خرید</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12">
        <div className="mb-8">
          <span className="text-[11px] uppercase tracking-widest text-shaad-800 font-semibold block mb-1">
            سفارش اختصاصی و ارسال کارگاه
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">
            تکمیل سفارش و پرداخت
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-2xl leading-relaxed">
            اطلاعات تحویل و درگاه تسویه حساب خود را تأیید فرمایید. کلیه سفارش‌ها شامل بسته‌بندی محافظتی چندلایه و ترابری اختصاصی می‌باشند.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-6">
            <CheckoutContactForm
              data={form.contact}
              onChange={form.setContact}
              errors={form.errors}
            />

            <CheckoutShippingForm
              data={form.shipping}
              onChange={form.setShipping}
              errors={form.errors}
              savedAddresses={form.savedAddresses}
            />

            {form.shippingMethods.length > 0 && (
              <CheckoutShippingMethod
                methods={form.shippingMethods}
                selectedMethodId={form.selectedMethodId}
                onSelect={(m) => form.setSelectedMethodId(m.id)}
              />
            )}

            {form.gateways.length > 0 && (
              <CheckoutPaymentMethod
                gateways={form.gateways}
                selectedGatewayId={form.selectedGatewayId}
                onSelect={form.setSelectedGatewayId}
              />
            )}
          </div>

          <div className="lg:col-span-5 lg:sticky lg:top-32">
            <CheckoutSummarySidebar
              items={form.items}
              subtotal={form.subtotal}
              shippingAmount={form.shippingCost}
              coupon={form.appliedCoupon}
              discountAmount={form.discountAmount}
              taxAmount={0}
              grandTotal={form.grandTotal}
              isSubmitting={form.isSubmitting}
              onSubmit={form.handleSubmitOrder}
              couponCodeInput={form.couponCodeInput}
              onCouponInputChange={form.setCouponCodeInput}
              onApplyCoupon={form.handleApplyCoupon}
              onRemoveCoupon={form.removeCoupon}
              isValidatingCoupon={form.isValidatingCoupon}
              couponError={form.couponError}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
