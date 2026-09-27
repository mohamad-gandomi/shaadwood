'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

interface OtpHeaderProps {
  redirectUrl?: string;
  step: 'PHONE' | 'VERIFY';
  phone?: string;
  onBackToPhone?: () => void;
}

export function OtpHeader({ redirectUrl = '/shop', step, phone, onBackToPhone }: OtpHeaderProps) {
  return (
    <div className="w-full space-y-6">
      {/* Top Navigation Row: Back Link */}
      <div className="flex items-center justify-between">
        {step === 'VERIFY' ? (
          <button
            type="button"
            onClick={onBackToPhone}
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md"
          >
            <ArrowRight className="w-4 h-4" />
            <span>ویرایش شماره</span>
          </button>
        ) : (
          <Link
            href={redirectUrl}
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md"
          >
            <ArrowRight className="w-4 h-4" />
            <span>بازگشت به فروشگاه</span>
          </Link>
        )}

        <div className="flex items-center gap-1.5 text-[11px] font-sans text-shaad-800 bg-shaad-50/90 border border-shaad-200/80 px-2.5 py-1 rounded-full">
          <Sparkles className="w-3 h-3 text-shaad-700" />
          <span>ورود امن پیامکی</span>
        </div>
      </div>

      {/* Brand Monogram & Title */}
      <div className="text-center space-y-2">
        <Link href="/" className="inline-flex flex-col items-center group">
          <span className="font-serif text-2xl sm:text-3xl font-bold tracking-[0.25em] text-shaad-900 group-hover:text-shaad-800 transition-colors">
            SHAADWOOD
          </span>
          <span className="text-[11px] tracking-wider text-shaad-700 font-medium">
            کارگاه دست‌سازه‌های چوب طبیعی
          </span>
        </Link>
        <p className="text-xs text-muted-foreground max-w-xs mx-auto leading-relaxed">
          {step === 'PHONE'
            ? 'ورود یا عضویت سریع و بدون نیاز به کلمه عبور با شماره تلفن همراه.'
            : `کد تأیید ۵ رقمی پیامک‌شده به شماره ${phone || 'همراه شما'} را وارد نمایید.`}
        </p>
      </div>
    </div>
  );
}
