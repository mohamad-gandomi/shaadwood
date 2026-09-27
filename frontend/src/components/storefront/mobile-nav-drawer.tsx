'use client';

import * as React from 'react';
import Link from 'next/link';
import { ChevronLeft, ShieldCheck, PackageCheck, ExternalLink } from 'lucide-react';
import { SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';

interface MobileNavDrawerProps {
  currentUser: any;
  onClose: () => void;
  onLogout: () => void;
}

const MOBILE_NAV_LINKS = [
  { label: 'کاتالوگ جامع آثار چوبی', href: '/shop' },
  { label: 'مبلمان و نشیمن ارگانیک', href: '/shop?categorySlug=living-room' },
  { label: 'میزهای ناهارخوری و نیمکت', href: '/shop?categorySlug=dining-room' },
  { label: 'سرویس خواب و پاتختی', href: '/shop?categorySlug=bedroom' },
  { label: 'میزهای جلو مبلی و عسلی', href: '/shop?categorySlug=coffee-tables' },
  { label: 'یادداشت‌ها و جستارهای کارگاه', href: '/blog' },
  { label: 'داستان و فلسفه شادوود', href: '/about' },
  { label: 'نشانی شوروم و ارتباط با کارگاه', href: '/contact' },
  { label: 'سفارش‌های من و پروفایل', href: '/account' },
  { label: 'سبد خرید آثار', href: '/cart' },
];

export function MobileNavDrawer({ currentUser, onClose, onLogout }: MobileNavDrawerProps) {
  return (
    <SheetContent side="right" className="w-80 p-0 bg-zen-50 flex flex-col justify-between">
      <div className="overflow-y-auto">
        <SheetHeader className="p-6 border-b border-border/60 text-right">
          <SheetTitle className="font-serif tracking-[0.2em] font-semibold text-lg text-shaad-900">
            شادوود
          </SheetTitle>
          <p className="text-[11px] text-muted-foreground">
            آتلیه نجاری و دست‌ساخته‌های چوب طبیعی
          </p>
        </SheetHeader>

        <nav className="p-6 space-y-1">
          {MOBILE_NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={onClose}
              className="flex items-center justify-between py-3 text-sm font-medium text-foreground/85 hover:text-shaad-800 transition-colors border-b border-border/40"
            >
              <span>{link.label}</span>
              <ChevronLeft className="w-4 h-4 text-muted-foreground/60" />
            </Link>
          ))}

          {/* User Auth Section */}
          {currentUser ? (
            <div className="pt-4 space-y-2 border-t border-border/40 mt-3 text-right">
              <div className="text-xs font-semibold text-foreground">
                {currentUser.firstName} {currentUser.lastName}
              </div>
              <div className="text-[11px] text-muted-foreground">{currentUser.phone || currentUser.email}</div>
              <Link
                href="/account"
                onClick={onClose}
                className="flex items-center justify-between py-2 text-xs font-semibold text-shaad-800"
              >
                <span className="flex items-center gap-2">
                  <PackageCheck className="w-4 h-4 text-shaad-700" />
                  سفارش‌ها و پروفایل من
                </span>
                <ChevronLeft className="w-4 h-4" />
              </Link>
              {currentUser.role === 'ADMIN' && (
                <Link
                  href="/admin"
                  onClick={onClose}
                  className="flex items-center justify-between py-2 text-xs font-semibold text-shaad-800"
                >
                  <span>پنل مدیریت کارگاه</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              )}
              <button
                type="button"
                onClick={onLogout}
                className="text-xs text-red-600 hover:underline pt-2 block text-right w-full"
              >
                خروج از حساب کاربری
              </button>
            </div>
          ) : (
            <Link
              href="/auth/otp"
              onClick={onClose}
              className="flex items-center justify-between py-3 text-xs font-semibold text-shaad-800 hover:text-shaad-900 transition-colors pt-4"
            >
              <span>ورود یا ثبت‌نام با شماره تماس</span>
              <ChevronLeft className="w-4 h-4" />
            </Link>
          )}
        </nav>
      </div>

      {/* Drawer Footer */}
      <div className="p-6 border-t border-border/60 space-y-2 bg-white/50 text-right">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <ShieldCheck className="w-4 h-4 text-shaad-700 shrink-0" />
          <span>ضمانت ۲۵ ساله ساختار چوب طبیعی</span>
        </div>
        <p className="text-[11px] text-muted-foreground/80">
          شوروم مرکزی: تهران، بالاتر از پارک ساعی
        </p>
      </div>
    </SheetContent>
  );
}
