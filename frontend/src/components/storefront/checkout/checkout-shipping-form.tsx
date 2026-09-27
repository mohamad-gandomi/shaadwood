'use client';

import * as React from 'react';
import { Truck, Phone, User, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Address } from '@/types';
import { SavedAddressSelector } from './saved-address-selector';

export interface CheckoutShippingData {
  recipientName: string;
  phone: string;
  province: string;
  city: string;
  street: string;
  postalCode: string;
  country?: string;
  deliveryNotes?: string;
}

interface CheckoutShippingFormProps {
  data: CheckoutShippingData;
  onChange: (data: CheckoutShippingData) => void;
  errors: Record<string, string>;
  savedAddresses?: Address[];
}

export function CheckoutShippingForm({
  data,
  onChange,
  errors,
  savedAddresses,
}: CheckoutShippingFormProps) {
  const handleSelectSavedAddress = (addr: Address) => {
    onChange({
      ...data,
      recipientName: addr.recipientName,
      phone: addr.phone,
      province: addr.province,
      city: addr.city,
      street: addr.street,
      postalCode: addr.postalCode,
    });
  };

  return (
    <div className="p-6 rounded-3xl bg-white border border-border/70 shadow-2xs space-y-5 text-right">
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-shaad-800 text-white text-xs font-sans font-bold flex items-center justify-center">
            ۲
          </span>
          <h3 className="font-serif font-bold text-base text-foreground">
            نشانی مقصد و تحویل اختصاصی
          </h3>
        </div>
        <span className="text-[11px] text-muted-foreground font-sans flex items-center gap-1">
          <Truck className="w-3.5 h-3.5 text-shaad-700" />
          ارسال مستقیم کارگاه
        </span>
      </div>

      {savedAddresses && savedAddresses.length > 0 && (
        <SavedAddressSelector
          addresses={savedAddresses}
          currentShipping={data}
          onSelectAddress={handleSelectSavedAddress}
        />
      )}

      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-foreground flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-muted-foreground" />
              <span>نام تحویل‌گیرنده *</span>
            </label>
            <Input
              value={data.recipientName}
              onChange={(e) => onChange({ ...data, recipientName: e.target.value })}
              placeholder="مثلاً علی رضایی"
              className={`h-11 text-xs text-right bg-zen-50 ${errors.recipientName ? 'border-destructive ring-1 ring-destructive' : 'border-border/70'}`}
              required
            />
            {errors.recipientName && <p className="text-[11px] text-destructive">{errors.recipientName}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-foreground flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-muted-foreground" />
              <span>تلفن تماس تحویل‌گیرنده *</span>
            </label>
            <Input
              type="tel"
              value={data.phone}
              onChange={(e) => onChange({ ...data, phone: e.target.value })}
              placeholder="۰۹۱۲۳۴۵۶۷۸۹"
              className={`h-11 text-xs font-sans text-right bg-zen-50 ${errors.shippingPhone ? 'border-destructive ring-1 ring-destructive' : 'border-border/70'}`}
              required
            />
            {errors.shippingPhone && <p className="text-[11px] text-destructive">{errors.shippingPhone}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-foreground">
              <span>استان *</span>
            </label>
            <Input
              value={data.province}
              onChange={(e) => onChange({ ...data, province: e.target.value })}
              placeholder="مثلاً تهران"
              className={`h-11 text-xs text-right bg-zen-50 ${errors.province ? 'border-destructive ring-1 ring-destructive' : 'border-border/70'}`}
              required
            />
            {errors.province && <p className="text-[11px] text-destructive">{errors.province}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-foreground">
              <span>شهر *</span>
            </label>
            <Input
              value={data.city}
              onChange={(e) => onChange({ ...data, city: e.target.value })}
              placeholder="مثلاً تهران"
              className={`h-11 text-xs text-right bg-zen-50 ${errors.city ? 'border-destructive ring-1 ring-destructive' : 'border-border/70'}`}
              required
            />
            {errors.city && <p className="text-[11px] text-destructive">{errors.city}</p>}
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-foreground flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
            <span>نشانی پستی دقیق (خیابان، کوچه، پلاک، واحد) *</span>
          </label>
          <Input
            value={data.street}
            onChange={(e) => onChange({ ...data, street: e.target.value })}
            placeholder="خیابان، پلاک، واحد..."
            className={`h-11 text-xs text-right bg-zen-50 ${errors.street ? 'border-destructive ring-1 ring-destructive' : 'border-border/70'}`}
            required
          />
          {errors.street && <p className="text-[11px] text-destructive">{errors.street}</p>}
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-foreground">
            <span>کد پستی ۱۰ رقمی *</span>
          </label>
          <Input
            value={data.postalCode}
            onChange={(e) => onChange({ ...data, postalCode: e.target.value })}
            placeholder="۱۲۳۴۵۶۷۸۹۰"
            className={`h-11 text-xs font-sans text-right bg-zen-50 ${errors.postalCode ? 'border-destructive ring-1 ring-destructive' : 'border-border/70'}`}
            required
          />
          {errors.postalCode && <p className="text-[11px] text-destructive">{errors.postalCode}</p>}
        </div>

        <div className="space-y-1.5 pt-1">
          <label className="text-xs font-semibold uppercase tracking-wider text-foreground">
            <span>توضیحات تکمیلی یا زمان مناسب تحویل بار (اختیاری)</span>
          </label>
          <textarea
            value={data.deliveryNotes || ''}
            onChange={(e) => onChange({ ...data, deliveryNotes: e.target.value })}
            rows={2}
            placeholder="مثلاً: هماهنگی قبل از مراجعه، حمل طبقات یا ویژگی‌های مسیر ورودی..."
            className="w-full rounded-xl bg-zen-50 border border-border/70 p-3 text-xs text-right focus:outline-hidden focus:ring-1 focus:ring-shaad-800 transition-colors"
          />
        </div>
      </div>
    </div>
  );
}
