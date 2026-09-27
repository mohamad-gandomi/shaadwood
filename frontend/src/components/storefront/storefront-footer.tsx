'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export function StorefrontFooter() {
  const [email, setEmail] = React.useState('');
  const [subscribed, setSubscribed] = React.useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      toast.success('به حلقه دوستداران شادوود خوش آمدید', {
        description: 'گزیده‌های فصلی و دسترسی زودهنگام به آثار جدید کارگاه برای شما ارسال خواهد شد.',
      });
      setEmail('');
    }
  };

  return (
    <footer className="bg-zen-100/80 text-foreground pt-14 sm:pt-20 pb-10 border-t border-border/70 text-right">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Newsletter & Brand Statement */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pb-10 border-b border-border/60">
          <div className="lg:col-span-6 space-y-2.5">
            <span className="font-serif text-2xl sm:text-3xl font-bold tracking-[0.2em] text-shaad-900 block">
              شادوود
            </span>
            <p className="text-xs sm:text-sm text-muted-foreground font-light max-w-md leading-relaxed">
              طراحی و ساخت دست‌ساز مبلمان از چوب طبیعی گردو، بلوط و راش. آثاری ماندگار و اصیل برای نسلی که به آرامش، طبیعت و کیفیت پایدار اهمیت می‌دهد.
            </p>
          </div>

          <div className="lg:col-span-6 space-y-2.5">
            <h4 className="font-serif font-semibold text-sm sm:text-base text-foreground">
              عضویت در حلقه دوستداران شادوود
            </h4>
            <p className="text-xs text-muted-foreground font-light">
              دریافت گزیده‌های فصلی، مقالات دیزاین و دسترسی زودهنگام به آثار جدید کارگاه.
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2 max-w-md">
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="آدرس ایمیل خود را وارد کنید..."
                className="bg-white border-border/80 text-xs h-10 rounded-xl focus-visible:ring-shaad-800 text-right"
              />
              <Button type="submit" className="bg-shaad-800 hover:bg-shaad-900 text-white text-xs px-5 h-10 rounded-xl shrink-0 font-medium">
                {subscribed ? <CheckCircle2 className="w-4 h-4 text-emerald-300" /> : <ArrowLeft className="w-4 h-4" />}
              </Button>
            </form>
          </div>
        </div>

        {/* Footer Navigation Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-xs">
          <div className="space-y-2.5">
            <h5 className="font-semibold uppercase tracking-wider text-[11px] text-shaad-900 font-serif">مجموعه‌های مبلمان</h5>
            <ul className="space-y-2 text-muted-foreground">
              <li><Link href="/shop" className="hover:text-shaad-800 transition-colors">کاتالوگ جامع آثار</Link></li>
              <li><Link href="/shop?categorySlug=living-room" className="hover:text-shaad-800 transition-colors">کاناپه‌ها و صندلی‌های راحتی</Link></li>
              <li><Link href="/shop?categorySlug=dining-room" className="hover:text-shaad-800 transition-colors">میزهای ناهارخوری و نیمکت</Link></li>
              <li><Link href="/shop?categorySlug=bedroom" className="hover:text-shaad-800 transition-colors">تخت‌خواب و سرویس خواب</Link></li>
              <li><Link href="/shop?categorySlug=coffee-tables" className="hover:text-shaad-800 transition-colors">میزهای جلو مبلی و عسلی</Link></li>
            </ul>
          </div>

          <div className="space-y-2.5">
            <h5 className="font-semibold uppercase tracking-wider text-[11px] text-shaad-900 font-serif">هنر نجاری و مجله</h5>
            <ul className="space-y-2 text-muted-foreground">
              <li><Link href="/about" className="hover:text-shaad-800 transition-colors">درباره آتلیه شادوود</Link></li>
              <li><Link href="/about" className="hover:text-shaad-800 transition-colors">اتصالات اصیل فاق و زبانه</Link></li>
              <li><Link href="/blog" className="hover:text-shaad-800 transition-colors">یادداشت‌های کارگاه</Link></li>
              <li><Link href="/blog?category=woodcraft-and-design-guides" className="hover:text-shaad-800 transition-colors">راهنمای طراحی و دیزاین</Link></li>
              <li><Link href="/blog?category=timber-care" className="hover:text-shaad-800 transition-colors">نگهداری چوب و روغن‌های گیاهی</Link></li>
            </ul>
          </div>

          <div className="space-y-2.5">
            <h5 className="font-semibold uppercase tracking-wider text-[11px] text-shaad-900 font-serif">خدمات و سفارش‌ها</h5>
            <ul className="space-y-2 text-muted-foreground">
              <li><Link href="/account" className="hover:text-shaad-800 transition-colors">پیگیری سفارش‌ها و پروفایل</Link></li>
              <li><Link href="/auth/otp" className="hover:text-shaad-800 transition-colors">ورود با رمز یکبارمصرف</Link></li>
              <li><Link href="/cart" className="hover:text-shaad-800 transition-colors">سبد خرید آثار</Link></li>
              <li><Link href="/contact" className="hover:text-shaad-800 transition-colors">ارسال و چیدمان اختصاصی</Link></li>
              <li><Link href="/about" className="hover:text-shaad-800 transition-colors">ضمانت ۲۵ ساله ساختار چوب</Link></li>
            </ul>
          </div>

          <div className="space-y-2.5">
            <h5 className="font-semibold uppercase tracking-wider text-[11px] text-shaad-900 font-serif">شوروم و کارگاه</h5>
            <p className="text-muted-foreground leading-relaxed">
              تهران، خیابان ولیعصر<br />
              بالاتر از پارک ساعی، پلاک ۱۲۴۰<br />
              concierge@shaadwood.com<br />
              ۰۲۱-۸۸۷۷۶۶۵۵
            </p>
            <div className="pt-0.5">
              <Link href="/contact" className="inline-flex items-center gap-1.5 text-[11px] text-shaad-800 hover:text-shaad-900 font-semibold">
                <span>ساعات کاری و نقشه شوروم</span>
                <ArrowLeft className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Rights & Quick Root Navigation */}
        <div className="pt-6 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-muted-foreground">
          <p>تمامی حقوق مادی و معنوی برای کارگاه نجاری و مبلمان شادوود محفوظ است. ۱۴۰۵ ©</p>
          <div className="flex flex-wrap items-center justify-center gap-3 text-[11px]">
            <Link href="/shop" className="hover:text-shaad-800 transition-colors">کاتالوگ</Link>
            <span>&middot;</span>
            <Link href="/blog" className="hover:text-shaad-800 transition-colors">مجله</Link>
            <span>&middot;</span>
            <Link href="/about" className="hover:text-shaad-800 transition-colors">درباره ما</Link>
            <span>&middot;</span>
            <Link href="/contact" className="hover:text-shaad-800 transition-colors">تماس و نقشه</Link>
            <span>&middot;</span>
            <Link href="/account" className="hover:text-shaad-800 transition-colors">حساب کاربری</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
