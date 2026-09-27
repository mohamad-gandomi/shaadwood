'use client';

import * as React from 'react';
import { Loader2, ArrowRight, RotateCw, CheckCircle2, KeyRound, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface OtpVerifyStepProps {
  phone: string;
  code: string[];
  onChangeCode: (newCode: string[]) => void;
  onSubmit: () => void;
  onResend: () => void;
  isLoading: boolean;
  isResending: boolean;
  countdown: number;
  devCode?: string;
  error: string | null;
}

export function OtpVerifyStep({
  phone,
  code,
  onChangeCode,
  onSubmit,
  onResend,
  isLoading,
  isResending,
  countdown,
  devCode,
  error,
}: OtpVerifyStepProps) {
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

  // Focus first input on mount
  React.useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, val: string) => {
    const clean = val.replace(/\D/g, '');
    if (!clean) {
      const nextCode = [...code];
      nextCode[index] = '';
      onChangeCode(nextCode);
      return;
    }

    // If single digit entered
    const digit = clean.slice(-1);
    const nextCode = [...code];
    nextCode[index] = digit;
    onChangeCode(nextCode);

    // Auto advance to next input
    if (index < 4) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 5);
    if (!pasted) return;

    const nextCode = [...code];
    for (let i = 0; i < 5; i++) {
      nextCode[i] = pasted[i] || '';
    }
    onChangeCode(nextCode);

    const nextFocusIndex = Math.min(pasted.length, 4);
    inputRefs.current[nextFocusIndex]?.focus();
  };

  const handleAutoFillDevCode = () => {
    if (!devCode) return;
    const digits = devCode.split('').slice(0, 5);
    const nextCode = ['', '', '', '', ''];
    for (let i = 0; i < 5; i++) {
      nextCode[i] = digits[i] || '';
    }
    onChangeCode(nextCode);
    inputRefs.current[4]?.focus();
  };

  const isComplete = code.every((digit) => digit.trim() !== '');

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (isComplete) onSubmit();
      }}
      className="space-y-6"
    >
      {/* Dev Mode 1-Click Code Helper */}
      {devCode && (
        <div className="p-3.5 rounded-2xl bg-amber-50/90 border border-amber-200/80 text-amber-900 text-xs flex items-center justify-between animate-in fade-in-50">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-700 shrink-0" />
            <div>
              <span className="font-semibold block">Dev Mode Active</span>
              <span className="font-mono text-amber-800 text-[11px]">
                SMS Code: <strong>{devCode}</strong>
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleAutoFillDevCode}
            className="px-2.5 py-1 rounded-lg bg-amber-700 hover:bg-amber-800 text-white font-medium text-[11px] transition-colors shadow-2xs"
          >
            Auto-fill
          </button>
        </div>
      )}

      {/* 5-Digit Inputs */}
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-foreground flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <KeyRound className="w-3.5 h-3.5 text-shaad-800" />
            <span>5-Digit Verification Code</span>
          </span>
          <span className="text-[10px] text-muted-foreground font-mono">
            Sent to {phone}
          </span>
        </label>

        <div className="flex items-center justify-between gap-2.5 sm:gap-3" dir="ltr">
          {[0, 1, 2, 3, 4].map((index) => (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              value={code[index]}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              disabled={isLoading}
              className="w-12 h-14 sm:w-14 sm:h-16 text-center text-xl sm:text-2xl font-mono font-bold rounded-2xl border-2 border-border/80 bg-white text-foreground focus:border-shaad-800 focus:outline-hidden focus:ring-4 focus:ring-shaad-800/10 transition-all shadow-2xs disabled:opacity-50"
            />
          ))}
        </div>

        {error && (
          <p className="text-xs text-red-600 font-medium animate-in fade-in-50 duration-150 pt-1 text-center">
            {error}
          </p>
        )}
      </div>

      {/* Countdown Timer & Resend Button */}
      <div className="flex items-center justify-between text-xs pt-1">
        <span className="text-muted-foreground font-mono">
          {countdown > 0 ? (
            <>
              Code expires in{' '}
              <strong className="text-foreground">{formatTimer(countdown)}</strong>
            </>
          ) : (
            <span className="text-amber-700">Code expired. Please request a new code.</span>
          )}
        </span>

        <button
          type="button"
          disabled={countdown > 0 || isResending}
          onClick={onResend}
          className="inline-flex items-center gap-1.5 font-semibold text-shaad-800 hover:text-shaad-900 disabled:opacity-40 disabled:hover:text-shaad-800 transition-colors cursor-pointer disabled:cursor-not-allowed"
        >
          {isResending ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Resending...</span>
            </>
          ) : (
            <>
              <RotateCw className="w-3.5 h-3.5" />
              <span>Resend SMS</span>
            </>
          )}
        </button>
      </div>

      {/* Submit Verification */}
      <Button
        type="submit"
        disabled={!isComplete || isLoading}
        className="w-full h-12 rounded-xl bg-shaad-800 hover:bg-shaad-900 text-white font-medium text-sm transition-all shadow-sm flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-50"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Verifying Code...</span>
          </>
        ) : (
          <>
            <span>Verify & Continue</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </>
        )}
      </Button>
    </form>
  );
}
