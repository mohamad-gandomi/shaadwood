'use client';

import * as React from 'react';
import { Phone, ArrowRight, Loader2, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface OtpPhoneStepProps {
  phone: string;
  onChangePhone: (phone: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  error: string | null;
}

export function OtpPhoneStep({
  phone,
  onChangePhone,
  onSubmit,
  isLoading,
  error,
}: OtpPhoneStepProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  // Quick preset phone for quick test/demo
  const handleQuickDemo = (demoPhone: string) => {
    onChangePhone(demoPhone);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <label
          htmlFor="phone-input"
          className="text-xs font-semibold uppercase tracking-wider text-foreground flex items-center justify-between"
        >
          <span className="flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-shaad-800" />
            <span>Mobile Phone Number</span>
          </span>
          <span className="text-[10px] text-muted-foreground font-mono">Iran (+98)</span>
        </label>

        <div className="relative">
          <Input
            id="phone-input"
            type="tel"
            autoFocus
            dir="ltr"
            value={phone}
            onChange={(e) => onChangePhone(e.target.value)}
            placeholder="0912 345 6789"
            className="h-12 pl-4 pr-10 text-base font-mono tracking-wide rounded-xl border-border/80 focus-visible:ring-shaad-800"
            disabled={isLoading}
          />
          {phone.trim().length >= 10 && (
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          )}
        </div>

        {error && (
          <p className="text-xs text-red-600 font-medium animate-in fade-in-50 duration-150">
            {error}
          </p>
        )}

        <p className="text-[11px] text-muted-foreground leading-relaxed">
          We will send a 5-digit verification code via SMS to verify your identity.
        </p>
      </div>

      {/* Quick Demo Pre-fill for Testing */}
      <div className="p-3 rounded-xl bg-zen-50 border border-border/60 text-[11px] text-muted-foreground space-y-1.5">
        <div className="font-semibold text-foreground flex items-center justify-between">
          <span>Quick Demo Numbers:</span>
        </div>
        <div className="flex flex-wrap gap-2 pt-0.5">
          <button
            type="button"
            onClick={() => handleQuickDemo('09355396804')}
            className="px-2 py-1 rounded-md bg-shaad-900 text-white hover:bg-black transition-colors font-mono text-[10px] font-semibold"
          >
            09355396804 (Shaad Admin)
          </button>
          <button
            type="button"
            onClick={() => handleQuickDemo('09129876543')}
            className="px-2 py-1 rounded-md bg-white border border-border/70 hover:border-shaad-700 hover:text-shaad-800 transition-colors font-mono text-[10px]"
          >
            09129876543 (Phase 2 Guest)
          </button>
          <button
            type="button"
            onClick={() => handleQuickDemo('09123456789')}
            className="px-2 py-1 rounded-md bg-white border border-border/70 hover:border-shaad-700 hover:text-shaad-800 transition-colors font-mono text-[10px]"
          >
            09123456789 (New Customer)
          </button>
        </div>
      </div>

      <Button
        type="submit"
        disabled={isLoading || !phone.trim()}
        className="w-full h-12 rounded-xl bg-shaad-800 hover:bg-shaad-900 text-white font-medium text-sm transition-all shadow-sm flex items-center justify-center gap-2 group cursor-pointer"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Sending Verification Code...</span>
          </>
        ) : (
          <>
            <span>Send Verification Code</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </>
        )}
      </Button>

      {/* Trust & Privacy Notice */}
      <div className="pt-2 flex items-center justify-center gap-2 text-[11px] text-muted-foreground text-center">
        <ShieldCheck className="w-3.5 h-3.5 text-shaad-700 shrink-0" />
        <span>Secure passwordless SMS authentication via Kavenegar</span>
      </div>
    </form>
  );
}
