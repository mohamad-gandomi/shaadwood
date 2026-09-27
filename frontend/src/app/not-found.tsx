import Link from 'next/link';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-linear-to-b from-zen-50 via-background to-zen-100 flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full space-y-6">
        {/* Monogram / Atelier Emblem */}
        <div className="w-16 h-16 mx-auto rounded-3xl bg-shaad-900 text-white flex items-center justify-center font-serif text-2xl font-bold tracking-widest shadow-lg">
          SW
        </div>

        {/* 404 Header */}
        <div className="space-y-2">
          <span className="text-xs font-sans tracking-widest text-shaad-700 font-semibold block">
            خطای ۴۰۴ &middot; برگ یافت نشد
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-foreground tracking-tight">
            اثری در این نشانی یافت نشد
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            صفحه، اثر هنری یا نشانی که به دنبال آن بودید در کارگاه وجود ندارد یا به بخش دیگری منتقل شده است.
          </p>
        </div>

        {/* Navigation Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <Button
            asChild
            className="w-full sm:w-auto h-11 px-6 rounded-xl bg-shaad-800 hover:bg-shaad-900 text-white font-medium text-xs shadow-sm cursor-pointer"
          >
            <Link href="/" className="flex items-center gap-2">
              <ArrowRight className="w-4 h-4" />
              <span>بازگشت به خانه</span>
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="w-full sm:w-auto h-11 px-6 rounded-xl border-border/80 bg-white hover:bg-zen-50 text-foreground font-medium text-xs cursor-pointer"
          >
            <Link href="/shop" className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-shaad-800" />
              <span>مشاهده کاتالوگ آثار</span>
            </Link>
          </Button>
        </div>

        {/* Footnote */}
        <p className="text-[11px] text-muted-foreground/70 font-sans pt-6">
          استودیو درودگری شادوود &middot; سازه‌های ماندگار و دست‌ساز چوب کهنسال
        </p>
      </div>
    </div>
  );
}
