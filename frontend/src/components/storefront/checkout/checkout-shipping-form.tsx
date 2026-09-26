'use client';

import * as React from 'react';
import { MapPin, Building, Truck, FileText, Phone, User } from 'lucide-react';
import { Input } from '@/components/ui/input';

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
}

export function CheckoutShippingForm({ data, onChange, errors }: CheckoutShippingFormProps) {
  return (
    <div className="p-6 rounded-3xl bg-white border border-border/70 shadow-2xs space-y-5">
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-shaad-800 text-white text-xs font-mono font-bold flex items-center justify-center">
            2
          </span>
          <h3 className="font-serif font-bold text-base text-foreground">
            Delivery & White-Glove Destination
          </h3>
        </div>
        <span className="text-[11px] text-muted-foreground font-mono flex items-center gap-1">
          <Truck className="w-3.5 h-3.5 text-shaad-700" />
          Direct Dispatch
        </span>
      </div>

      <div className="space-y-4">
        {/* Recipient details if different */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-foreground flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-muted-foreground" />
              <span>Recipient Full Name *</span>
            </label>
            <Input
              value={data.recipientName}
              onChange={(e) => onChange({ ...data, recipientName: e.target.value })}
              placeholder="e.g. Alexander Wright"
              className={`h-11 text-xs bg-zen-50 ${errors.recipientName ? 'border-destructive ring-1 ring-destructive' : 'border-border/70'}`}
              required
            />
            {errors.recipientName && <p className="text-[11px] text-destructive">{errors.recipientName}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-foreground flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-muted-foreground" />
              <span>Delivery Contact Phone *</span>
            </label>
            <Input
              type="tel"
              value={data.phone}
              onChange={(e) => onChange({ ...data, phone: e.target.value })}
              placeholder="09123456789 or +98 912 345 6789"
              className={`h-11 text-xs font-mono bg-zen-50 ${errors.shippingPhone ? 'border-destructive ring-1 ring-destructive' : 'border-border/70'}`}
              required
            />
            {errors.shippingPhone && <p className="text-[11px] text-destructive">{errors.shippingPhone}</p>}
          </div>
        </div>

        {/* Province & City */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-foreground flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
              <span>Province / State *</span>
            </label>
            <Input
              value={data.province}
              onChange={(e) => onChange({ ...data, province: e.target.value })}
              placeholder="e.g. Tehran"
              className={`h-11 text-xs bg-zen-50 ${errors.province ? 'border-destructive ring-1 ring-destructive' : 'border-border/70'}`}
              required
            />
            {errors.province && <p className="text-[11px] text-destructive">{errors.province}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-foreground flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-muted-foreground" />
              <span>City *</span>
            </label>
            <Input
              value={data.city}
              onChange={(e) => onChange({ ...data, city: e.target.value })}
              placeholder="e.g. Tehran"
              className={`h-11 text-xs bg-zen-50 ${errors.city ? 'border-destructive ring-1 ring-destructive' : 'border-border/70'}`}
              required
            />
            {errors.city && <p className="text-[11px] text-destructive">{errors.city}</p>}
          </div>
        </div>

        {/* Street & Detailed Address */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-foreground flex items-center gap-1.5">
            <span>Street Address, Building & Unit *</span>
          </label>
          <Input
            value={data.street}
            onChange={(e) => onChange({ ...data, street: e.target.value })}
            placeholder="e.g. Valiasr St, District 3, No. 45, Floor 2"
            className={`h-11 text-xs bg-zen-50 ${errors.street ? 'border-destructive ring-1 ring-destructive' : 'border-border/70'}`}
            required
          />
          {errors.street && <p className="text-[11px] text-destructive">{errors.street}</p>}
        </div>

        {/* Postal Code */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-foreground flex items-center justify-between">
            <span>Postal / Zip Code *</span>
            <span className="text-[10px] text-muted-foreground font-normal">10-digit standard or zip</span>
          </label>
          <Input
            value={data.postalCode}
            onChange={(e) => onChange({ ...data, postalCode: e.target.value })}
            placeholder="e.g. 1985923145"
            className={`h-11 text-xs font-mono bg-zen-50 ${errors.postalCode ? 'border-destructive ring-1 ring-destructive' : 'border-border/70'}`}
            required
          />
          {errors.postalCode && <p className="text-[11px] text-destructive">{errors.postalCode}</p>}
        </div>

        {/* Delivery / Access Notes */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-foreground flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-muted-foreground" />
            <span>Special Delivery / Placement Notes</span>
          </label>
          <textarea
            value={data.deliveryNotes || ''}
            onChange={(e) => onChange({ ...data, deliveryNotes: e.target.value })}
            placeholder="e.g. Freight elevator available, delivery between 10am-2pm, leave with concierge"
            rows={2}
            className="w-full rounded-xl border border-border/70 bg-zen-50 p-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-shaad-800"
          />
        </div>
      </div>
    </div>
  );
}
