'use client';

import * as React from 'react';
import { Phone, User, Mail, Sparkles, ShieldCheck } from 'lucide-react';
import { Input } from '@/components/ui/input';

export interface CheckoutContactData {
  phone: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface CheckoutContactFormProps {
  data: CheckoutContactData;
  onChange: (data: CheckoutContactData) => void;
  errors: Record<string, string>;
}

export function CheckoutContactForm({ data, onChange, errors }: CheckoutContactFormProps) {
  return (
    <div className="p-6 rounded-3xl bg-white border border-border/70 shadow-2xs space-y-5">
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-shaad-800 text-white text-xs font-mono font-bold flex items-center justify-center">
            1
          </span>
          <h3 className="font-serif font-bold text-base text-foreground">
            Contact & Verification Details
          </h3>
        </div>
        <span className="text-[11px] text-muted-foreground font-mono">Guest / Instant Access</span>
      </div>

      {/* Guest registration benefit banner */}
      <div className="p-3.5 rounded-2xl bg-shaad-50/80 border border-shaad-200/80 text-shaad-900 text-xs flex items-start gap-2.5">
        <Sparkles className="w-4 h-4 text-shaad-700 mt-0.5 shrink-0" />
        <div>
          <span className="font-semibold block">Seamless Guest Purchasing</span>
          <span className="text-shaad-800/90 text-[11px] leading-relaxed">
            No password needed. We create your customer profile automatically using your phone number so you can track your pieces via SMS OTP anytime.
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {/* Mobile Phone Number (Mandatory) */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-foreground flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-shaad-800" />
              <span>Mobile Phone Number *</span>
            </span>
            <span className="text-[10px] text-muted-foreground font-normal">For SMS OTP & order updates</span>
          </label>
          <Input
            type="tel"
            value={data.phone}
            onChange={(e) => onChange({ ...data, phone: e.target.value })}
            placeholder="09123456789 or +98 912 345 6789"
            className={`h-11 text-xs font-mono bg-zen-50 ${errors.phone ? 'border-destructive ring-1 ring-destructive' : 'border-border/70'}`}
            required
          />
          {errors.phone && <p className="text-[11px] text-destructive">{errors.phone}</p>}
        </div>

        {/* First & Last Name */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-foreground flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-muted-foreground" />
              <span>First Name *</span>
            </label>
            <Input
              value={data.firstName}
              onChange={(e) => onChange({ ...data, firstName: e.target.value })}
              placeholder="e.g. Alexander"
              className={`h-11 text-xs bg-zen-50 ${errors.firstName ? 'border-destructive ring-1 ring-destructive' : 'border-border/70'}`}
              required
            />
            {errors.firstName && <p className="text-[11px] text-destructive">{errors.firstName}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-foreground">
              <span>Last Name *</span>
            </label>
            <Input
              value={data.lastName}
              onChange={(e) => onChange({ ...data, lastName: e.target.value })}
              placeholder="e.g. Wright"
              className={`h-11 text-xs bg-zen-50 ${errors.lastName ? 'border-destructive ring-1 ring-destructive' : 'border-border/70'}`}
              required
            />
            {errors.lastName && <p className="text-[11px] text-destructive">{errors.lastName}</p>}
          </div>
        </div>

        {/* Email Address (Optional) */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-foreground flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-muted-foreground" />
              <span>Email Address</span>
            </span>
            <span className="text-[10px] text-muted-foreground font-normal">Optional (for digital invoices)</span>
          </label>
          <Input
            type="email"
            value={data.email}
            onChange={(e) => onChange({ ...data, email: e.target.value })}
            placeholder="e.g. alexander@example.com"
            className="h-11 text-xs bg-zen-50 border-border/70"
          />
        </div>
      </div>
    </div>
  );
}
