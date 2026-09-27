'use client';

import * as React from 'react';
import { Phone, KeyRound, Loader2, ArrowRight, ArrowLeft, RotateCw, Sparkles, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { api } from '@/lib/api';
import { User } from '@/types';

interface PhoneChangeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  currentPhone?: string | null;
  onPhoneUpdated: (updatedUser: User) => void;
}

export function PhoneChangeDialog({
  isOpen,
  onClose,
  currentPhone,
  onPhoneUpdated,
}: PhoneChangeDialogProps) {
  const [step, setStep] = React.useState<'INPUT' | 'VERIFY'>('INPUT');
  const [newPhone, setNewPhone] = React.useState('');
  const [code, setCode] = React.useState(['', '', '', '', '']);
  const [countdown, setCountdown] = React.useState(0);
  const [devCode, setDevCode] = React.useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isResending, setIsResending] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

  // Reset when dialog opens/closes
  React.useEffect(() => {
    if (!isOpen) {
      setStep('INPUT');
      setNewPhone('');
      setCode(['', '', '', '', '']);
      setError(null);
      setDevCode(undefined);
      setCountdown(0);
    }
  }, [isOpen]);

  // Countdown timer
  React.useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const handleSendOtp = async (isResend = false) => {
    const clean = newPhone.trim();
    if (!clean || clean.length < 10) {
      setError('Please enter a valid 11-digit mobile number (e.g. 09123456789)');
      return;
    }
    if (clean === currentPhone) {
      setError('New phone number must be different from your current phone number.');
      return;
    }

    if (isResend) setIsResending(true);
    else setIsLoading(true);
    setError(null);

    try {
      const res = await api.sendPhoneChangeOtp(clean);
      setDevCode(res.devCode);
      setCountdown(res.expiresIn || 120);
      setCode(['', '', '', '', '']);
      setStep('VERIFY');
      toast.success(`Verification code sent to ${clean}`);
    } catch (err: any) {
      const msg = err.message || 'Failed to dispatch verification SMS';
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
      setIsResending(false);
    }
  };

  const handleDigitChange = (index: number, val: string) => {
    const clean = val.replace(/\D/g, '');
    const nextCode = [...code];
    nextCode[index] = clean ? clean.slice(-1) : '';
    setCode(nextCode);

    if (clean && index < 4) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyChange = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = code.join('').trim();
    if (fullCode.length !== 5) {
      setError('Please enter the full 5-digit verification code');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await api.verifyPhoneChange(newPhone.trim(), fullCode);
      onPhoneUpdated(res.user);
      toast.success('Mobile phone number updated successfully!');
      onClose();
    } catch (err: any) {
      const msg = err.message || 'Invalid or expired verification code';
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAutoFillDevCode = () => {
    if (!devCode) return;
    const digits = devCode.split('').slice(0, 5);
    setCode(digits);
    inputRefs.current[4]?.focus();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white rounded-3xl p-6 sm:p-7">
        <DialogHeader className="space-y-1">
          <DialogTitle className="font-serif text-xl font-bold text-foreground">
            {step === 'INPUT' ? 'Change Mobile Phone Number' : 'Verify New Phone Number'}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            {step === 'INPUT'
              ? 'Enter your new phone number to receive an SMS verification code.'
              : `Enter the 5-digit code sent to ${newPhone}.`}
          </DialogDescription>
        </DialogHeader>

        {step === 'INPUT' ? (
          <form onSubmit={(e) => { e.preventDefault(); handleSendOtp(false); }} className="space-y-4 pt-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-foreground">
                New Mobile Number *
              </label>
              <Input
                type="tel"
                dir="ltr"
                autoFocus
                value={newPhone}
                onChange={(e) => {
                  setNewPhone(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="0912 345 6789"
                className="h-11 font-mono tracking-wide rounded-xl"
              />
              {error && <p className="text-xs text-red-600">{error}</p>}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={onClose} className="rounded-xl text-xs">
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading || !newPhone.trim()}
                className="rounded-xl bg-shaad-800 hover:bg-shaad-900 text-white text-xs cursor-pointer"
              >
                {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" /> : null}
                <span>Send Verification Code</span>
              </Button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleVerifyChange} className="space-y-4 pt-3">
            {devCode && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs flex items-center justify-between text-amber-900">
                <span className="font-mono">Dev Code: <strong>{devCode}</strong></span>
                <button type="button" onClick={handleAutoFillDevCode} className="px-2 py-0.5 rounded bg-amber-700 text-white text-[10px]">
                  Auto-fill
                </button>
              </div>
            )}

            <div className="flex items-center justify-center gap-2" dir="ltr">
              {[0, 1, 2, 3, 4].map((i) => (
                <input
                  key={i}
                  ref={(el) => { inputRefs.current[i] = el; }}
                  type="text"
                  maxLength={1}
                  value={code[i]}
                  onChange={(e) => handleDigitChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  className="w-11 h-12 text-center text-xl font-mono font-bold rounded-xl border border-border focus:border-shaad-800 focus:outline-hidden"
                />
              ))}
            </div>
            {error && <p className="text-xs text-red-600 text-center">{error}</p>}

            <div className="flex items-center justify-between text-xs pt-1">
              <button
                type="button"
                onClick={() => { setStep('INPUT'); setError(null); }}
                className="text-muted-foreground hover:text-foreground flex items-center gap-1"
              >
                <ArrowLeft className="w-3 h-3" /> Change Number
              </button>
              <button
                type="button"
                disabled={countdown > 0 || isResending}
                onClick={() => handleSendOtp(true)}
                className="text-shaad-800 font-semibold disabled:opacity-40"
              >
                {countdown > 0 ? `Resend in ${countdown}s` : 'Resend SMS'}
              </button>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={onClose} className="rounded-xl text-xs">
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading || code.some((d) => !d)}
                className="rounded-xl bg-shaad-800 hover:bg-shaad-900 text-white text-xs cursor-pointer"
              >
                {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" /> : null}
                <span>Verify & Save Phone</span>
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
