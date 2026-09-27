'use client';

import * as React from 'react';
import Link from 'next/link';
import { Phone, User, Mail, Sparkles, ArrowLeft } from 'lucide-react';
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
    <div className="p-6 rounded-3xl bg-white border border-border/70 shadow-2xs space-y-5 text-right">
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-shaad-800 text-white text-xs font-sans font-bold flex items-center justify-center">
            ۱
          </span>
          <h3 className="font-serif font-bold text-base text-foreground">
            مشخصات خریدار و احراز هویت
          </h3>
        </div>
        <Link
          href="/auth/otp?redirect=/checkout"
          className="text-xs font-semibold text-shaad-800 hover:text-shaad-900 hover:underline flex items-center gap-1 transition-colors"
        >
          <span>ورود با شماره موبایل</span>
          <ArrowLeft className="w-3 h-3" />
        </Link>
      </div>

      <div className="p-3.5 rounded-2xl bg-shaad-50/80 border border-shaad-200/80 text-shaad-900 text-xs flex items-start gap-2.5">
        <Sparkles className="w-4 h-4 text-shaad-700 mt-0.5 shrink-0" />
        <div className="flex-1">
          <span className="font-semibold block">ثبت سفارش آسان بدون نیاز به رمز عبور</span>
          <span className="text-shaad-800/90 text-[11px] leading-relaxed">
            پروفایل کاربری شما با شماره موبایل به صورت خودکار ایجاد شده و وضعیت آماده‌سازی سازه از طریق پیامک به اطلاع شما می‌رسد.
          </span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-foreground flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-shaad-800" />
              <span>شماره تلفن همراه *</span>
            </span>
            <span className="text-[10px] text-muted-foreground font-normal">جهت پیامک و هماهنگی باربری</span>
          </label>
          <Input
            type="tel"
            value={data.phone}
            onChange={(e) => onChange({ ...data, phone: e.target.value })}
            placeholder="۰۹۱۲۳۴۵۶۷۸۹"
            className={`h-11 text-xs font-sans text-right bg-zen-50 ${errors.phone ? 'border-destructive ring-1 ring-destructive' : 'border-border/70'}`}
            required
          />
          {errors.phone && <p className="text-[11px] text-destructive">{errors.phone}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-foreground flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-muted-foreground" />
              <span>نام *</span>
            </label>
            <Input
              value={data.firstName}
              onChange={(e) => onChange({ ...data, firstName: e.target.value })}
              placeholder="مثلاً علی"
              className={`h-11 text-xs text-right bg-zen-50 ${errors.firstName ? 'border-destructive ring-1 ring-destructive' : 'border-border/70'}`}
              required
            />
            {errors.firstName && <p className="text-[11px] text-destructive">{errors.firstName}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-foreground">
              <span>نام خانوادگی *</span>
            </label>
            <Input
              value={data.lastName}
              onChange={(e) => onChange({ ...data, lastName: e.target.value })}
              placeholder="مثلاً رضایی"
              className={`h-11 text-xs text-right bg-zen-50 ${errors.lastName ? 'border-destructive ring-1 ring-destructive' : 'border-border/70'}`}
              required
            />
            {errors.lastName && <p className="text-[11px] text-destructive">{errors.lastName}</p>}
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-foreground flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-muted-foreground" />
              <span>آدرس ایمیل (اختیاری)</span>
            </span>
            <span className="text-[10px] text-muted-foreground font-normal">جهت دریافت فاکتور رسمی</span>
          </label>
          <Input
            type="email"
            value={data.email}
            onChange={(e) => onChange({ ...data, email: e.target.value })}
            placeholder="name@example.com"
            className="h-11 text-xs font-sans text-left bg-zen-50 border-border/70"
          />
        </div>
      </div>
    </div>
  );
}
