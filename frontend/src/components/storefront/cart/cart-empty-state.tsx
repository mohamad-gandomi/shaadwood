'use client';

import * as React from 'react';
import Link from 'next/link';
import { ShoppingBag, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function CartEmptyState() {
  return (
    <div className="max-w-md mx-auto py-16 text-center space-y-6">
      <div className="w-20 h-20 rounded-full bg-zen-100 border border-border/70 flex items-center justify-center mx-auto text-shaad-800 shadow-2xs">
        <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
      </div>

      <div className="space-y-2">
        <h2 className="font-serif font-bold text-2xl text-foreground">
          سبد خرید شما در حال حاضر خالی است
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground font-light leading-relaxed">
          هنوز اثری از دست‌ساخته‌های چوب طبیعی شادوود را برای خانه‌تان انتخاب نکرده‌اید. کاتالوگ آثار ما را برای کشف مبلمان اصیل و ماندگار مرور کنید.
        </p>
      </div>

      <Button
        asChild
        size="lg"
        className="rounded-full bg-shaad-800 hover:bg-shaad-900 text-white font-semibold text-xs tracking-wide px-8 py-6 shadow-sm gap-2"
      >
        <Link href="/shop">
          <span>مشاهده کاتالوگ آثار</span>
          <ArrowLeft className="w-4 h-4" />
        </Link>
      </Button>
    </div>
  );
}
