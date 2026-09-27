'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles } from 'lucide-react';

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
            className="inline-flex items-center gap-2 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors p-1 -ml-1 rounded-md"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Change Phone</span>
          </button>
        ) : (
          <Link
            href={redirectUrl}
            className="inline-flex items-center gap-2 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors p-1 -ml-1 rounded-md"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Store</span>
          </Link>
        )}

        <div className="flex items-center gap-1.5 text-[11px] font-mono text-shaad-800 bg-shaad-50/90 border border-shaad-200/80 px-2.5 py-1 rounded-full">
          <Sparkles className="w-3 h-3 text-shaad-700" />
          <span>Passwordless SMS</span>
        </div>
      </div>

      {/* Brand Monogram & Title */}
      <div className="text-center space-y-2">
        <Link href="/" className="inline-flex flex-col items-center group">
          <span className="font-serif text-2xl sm:text-3xl font-bold tracking-[0.25em] text-shaad-900 group-hover:text-shaad-800 transition-colors">
            SHAADWOOD
          </span>
          <span className="text-[10px] tracking-[0.35em] uppercase text-shaad-700/80 font-medium">
            Handcrafted Atelier
          </span>
        </Link>
        <p className="text-xs text-muted-foreground max-w-xs mx-auto">
          {step === 'PHONE'
            ? 'Sign in or register effortlessly with your mobile number.'
            : `Enter the 5-digit verification code sent to ${phone || 'your phone'}.`}
        </p>
      </div>
    </div>
  );
}
