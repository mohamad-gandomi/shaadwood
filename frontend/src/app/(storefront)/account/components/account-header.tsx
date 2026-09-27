'use client';

import * as React from 'react';
import { Phone, Mail, Calendar, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AccountHeaderProps {
  user: any;
  onLogout: () => void;
}

export function AccountHeader({ user, onLogout }: AccountHeaderProps) {
  const memberDate = user?.createdAt
    ? new Intl.DateTimeFormat('fa-IR', {
        month: 'long',
        year: 'numeric',
      }).format(new Date(user.createdAt))
    : 'به‌تازگی';

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-white border border-border/70 shadow-2xs space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-shaad-800 text-white font-serif font-bold text-xl flex items-center justify-center shadow-xs shrink-0">
            {user?.firstName?.[0] || 'ش'}
          </div>
          <div>
            <h1 className="font-serif text-2xl font-bold text-foreground">
              {user?.firstName} {user?.lastName}
            </h1>
            <p className="text-xs text-muted-foreground font-sans mt-0.5">
              عضو همراهان کارگاه شادوود &middot; عضویت از {memberDate}
            </p>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={onLogout}
          className="rounded-xl border-border/80 text-red-600 hover:text-red-700 hover:bg-red-50 text-xs font-semibold gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>خروج از حساب</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2 border-t border-border/50 text-xs">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Phone className="w-3.5 h-3.5 text-shaad-800 shrink-0" />
          <span className="font-sans text-foreground">{user?.phone || 'شماره تلفن ثبت نشده'}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Mail className="w-3.5 h-3.5 text-shaad-800 shrink-0" />
          <span className="truncate text-foreground font-sans">{user?.email || 'بدون نشانی ایمیل'}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="w-3.5 h-3.5 text-shaad-800 shrink-0" />
          <span>ورود امن با پیامک یکبارمصرف</span>
        </div>
      </div>
    </div>
  );
}
