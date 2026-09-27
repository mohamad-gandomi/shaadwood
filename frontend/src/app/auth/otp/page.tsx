'use client';

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { api } from '@/lib/api';
import { OtpHeader } from './components/otp-header';
import { OtpPhoneStep } from './components/otp-phone-step';
import { OtpVerifyStep } from './components/otp-verify-step';

function OtpPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/shop';

  const [step, setStep] = React.useState<'PHONE' | 'VERIFY'>('PHONE');
  const [phone, setPhone] = React.useState('');
  const [code, setCode] = React.useState<string[]>(['', '', '', '', '']);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isResending, setIsResending] = React.useState(false);
  const [devCode, setDevCode] = React.useState<string | undefined>(undefined);
  const [countdown, setCountdown] = React.useState(0);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const handleSendOtp = async (isResend = false) => {
    const cleanPhone = phone.trim();
    if (!cleanPhone || cleanPhone.length < 10) {
      setError('شماره تلفن همراه معتبر ۱۱ رقمی وارد نمایید (مثال: ۰۹۱۲۳۴۵۶۷۸۹)');
      return;
    }

    if (isResend) {
      setIsResending(true);
    } else {
      setIsLoading(true);
    }
    setError(null);

    try {
      const res = await api.sendOtp(cleanPhone);
      setDevCode(res.devCode);
      setCountdown(res.expiresIn || 120);
      setCode(['', '', '', '', '']);
      setStep('VERIFY');

      if (isResend) {
        toast.success('کد تأیید جدید از طریق پیامک ارسال شد');
      } else {
        toast.success(`کد تأیید ورود به شماره ${res.phone} ارسال شد`);
      }
    } catch (err: any) {
      const msg = err.message || 'خطا در ارسال پیامک تأیید. لطفاً مجدداً تلاش فرمایید.';
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
      setIsResending(false);
    }
  };

  const handleVerifyOtp = async () => {
    const fullCode = code.join('').trim();
    if (fullCode.length !== 5) {
      setError('لطفاً کد ۵ رقمی را به‌طور کامل وارد فرمایید');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await api.verifyOtp(phone.trim(), fullCode);
      const name = res.user.firstName ? ` ${res.user.firstName}` : '';
      if (res.isNewUser) {
        toast.success(`به استودیو شادوود خوش آمدید${name}!`);
      } else {
        toast.success(`خوش آمدید${name}!`);
      }

      if (res.user.role === 'ADMIN' && (!searchParams.get('redirect') || searchParams.get('redirect') === '/shop')) {
        router.push('/admin');
      } else {
        router.push(redirectUrl);
      }
    } catch (err: any) {
      const msg = err.message || 'کد واردشده نامعتبر یا منقضی شده است';
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-zen-100/60 via-background to-zen-100/40 flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md space-y-6">
        <OtpHeader
          redirectUrl={redirectUrl}
          step={step}
          phone={phone}
          onBackToPhone={() => {
            setStep('PHONE');
            setError(null);
          }}
        />

        <Card className="border border-border/80 shadow-xl bg-white/95 backdrop-blur-md rounded-3xl overflow-hidden">
          <CardContent className="p-6 sm:p-8">
            {step === 'PHONE' ? (
              <OtpPhoneStep
                phone={phone}
                onChangePhone={(val) => {
                  setPhone(val);
                  if (error) setError(null);
                }}
                onSubmit={() => handleSendOtp(false)}
                isLoading={isLoading}
                error={error}
              />
            ) : (
              <OtpVerifyStep
                phone={phone}
                code={code}
                onChangeCode={(newCode) => {
                  setCode(newCode);
                  if (error) setError(null);
                }}
                onSubmit={handleVerifyOtp}
                onResend={() => handleSendOtp(true)}
                isLoading={isLoading}
                isResending={isResending}
                countdown={countdown}
                devCode={devCode}
                error={error}
              />
            )}
          </CardContent>
        </Card>

        <p className="text-center text-[11px] text-muted-foreground/70 font-sans">
          استودیو درودگری و مبلمان شادوود &copy; {new Date().getFullYear()} &middot; امنیت و حریم خصوصی تضمین‌شده
        </p>
      </div>
    </div>
  );
}

export default function OtpPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-zen-50">
          <div className="w-8 h-8 rounded-full border-2 border-shaad-800 border-t-transparent animate-spin" />
        </div>
      }
    >
      <OtpPageContent />
    </React.Suspense>
  );
}
