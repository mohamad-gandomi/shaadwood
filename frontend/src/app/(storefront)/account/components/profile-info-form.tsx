'use client';

import * as React from 'react';
import { User as UserIcon, Mail, Phone, Loader2, CheckCircle2, Smartphone } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { User } from '@/types';

interface ProfileInfoFormProps {
  user: User;
  onUserUpdated: (updatedUser: User) => void;
  onRequestChangePhone: () => void;
}

export function ProfileInfoForm({
  user,
  onUserUpdated,
  onRequestChangePhone,
}: ProfileInfoFormProps) {
  const [firstName, setFirstName] = React.useState(user.firstName || '');
  const [lastName, setLastName] = React.useState(user.lastName || '');
  const [email, setEmail] = React.useState(
    user.email?.endsWith('@guest.shaadwood.com') ? '' : user.email || ''
  );
  const [isSaving, setIsSaving] = React.useState(false);

  React.useEffect(() => {
    setFirstName(user.firstName || '');
    setLastName(user.lastName || '');
    setEmail(user.email?.endsWith('@guest.shaadwood.com') ? '' : user.email || '');
  }, [user]);

  const hasChanges =
    firstName.trim() !== (user.firstName || '').trim() ||
    lastName.trim() !== (user.lastName || '').trim() ||
    (email.trim() !== '' && email.trim().toLowerCase() !== (user.email || '').toLowerCase());

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim()) {
      toast.error('نام کوچک نمی‌تواند خالی باشد');
      return;
    }

    setIsSaving(true);
    try {
      const payload: { firstName: string; lastName: string; email?: string } = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      };
      if (email.trim()) {
        payload.email = email.trim().toLowerCase();
      }

      const updated = await api.updateProfile(payload);
      onUserUpdated(updated);
      toast.success('مشخصات حساب کاربری با موفقیت ذخیره شد');
    } catch (err: any) {
      toast.error(err.message || 'خطا در ثبت اطلاعات کاربری');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Personal Identity & Email Form */}
      <form onSubmit={handleSave} className="p-6 sm:p-8 rounded-3xl bg-white border border-border/70 shadow-2xs space-y-5">
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <div className="flex items-center gap-2">
            <UserIcon className="w-5 h-5 text-shaad-800" />
            <h3 className="font-serif font-bold text-base text-foreground">
              اطلاعات فردی
            </h3>
          </div>
          <span className="text-[11px] text-muted-foreground font-sans">شناسنامه همراه</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              نام *
            </label>
            <Input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="مثال: کوروش"
              className="h-11 rounded-xl"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              نام خانوادگی
            </label>
            <Input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="مثال: راد"
              className="h-11 rounded-xl"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-shaad-800" />
              <span>نشانی ایمیل</span>
            </span>
            <span className="text-[10px] text-muted-foreground font-normal">جهت دریافت فاکتورهای رسمی</span>
          </label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            dir="ltr"
            className="h-11 rounded-xl font-sans text-sm text-left"
          />
          {user.email?.endsWith('@guest.shaadwood.com') && (
            <p className="text-[11px] text-amber-800 bg-amber-50/80 p-2.5 rounded-lg border border-amber-200/60 leading-relaxed font-sans">
              سفارش قبلی شما به‌صورت مهمان ثبت شده بود. با واردکردن ایمیل، تاییدیه‌های کارگاه و باربری را دریافت کنید.
            </p>
          )}
        </div>

        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            disabled={isSaving || !hasChanges}
            className="h-11 px-6 rounded-xl bg-shaad-800 hover:bg-shaad-900 text-white font-medium text-xs transition-all shadow-sm cursor-pointer disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin ml-2" />
                <span>در حال ذخیره‌سازی...</span>
              </>
            ) : (
              <span>ذخیره تغییرات</span>
            )}
          </Button>
        </div>
      </form>

      {/* 2. Mobile Phone Number & SMS OTP Action */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-border/70 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <div className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-shaad-800" />
            <h3 className="font-serif font-bold text-base text-foreground">
              شماره تلفن همراه و احراز هویت
            </h3>
          </div>
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-sans">
            <CheckCircle2 className="w-3 h-3" />
            تأیید شده
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-zen-50 border border-border/60">
          <div>
            <span className="text-[11px] text-muted-foreground font-semibold block">
              شماره همراه فعال
            </span>
            <span dir="ltr" className="font-sans font-bold text-base text-foreground text-right block">
              {user.phone || 'شماره‌ای ثبت نشده است'}
            </span>
            <p className="text-xs text-muted-foreground mt-0.5">
              جهت ورود سریع با پیامک رمز یکبارمصرف و هماهنگی ارسال با باربری.
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={onRequestChangePhone}
            className="rounded-xl border-shaad-300 text-shaad-800 hover:bg-shaad-50 text-xs font-semibold shrink-0 cursor-pointer"
          >
            <Phone className="w-3.5 h-3.5 ml-1.5" />
            <span>تغییر شماره همراه</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
