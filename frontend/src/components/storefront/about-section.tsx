'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function AboutSection() {
  return (
    <section id="about" className="py-16 sm:py-24 bg-zen-50 border-b border-border/60 scroll-mt-24">
      <div id="craft" className="scroll-mt-24" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Workshop Image Column (5 cols) */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl overflow-hidden bg-zen-100 border border-border/60 shadow-sm aspect-[4/3]">
              <img
                src="/images/material-craft-wood.webp"
                alt="میز کار نجاری آتلیه شادوود و ابزارهای دستی سنتی"
                onError={(e) => {
                  e.currentTarget.src = '/images/hero-bedroom-zen.webp';
                }}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 px-4 py-2 rounded-xl bg-white/90 backdrop-blur-md border border-white/40 shadow-xs text-xs text-right">
                <span className="font-semibold text-shaad-900 font-serif block">آتلیه نجاری شادوود</span>
                <span className="text-muted-foreground text-[11px] font-sans">اصالت چوب طبیعی</span>
              </div>
            </div>
          </div>

          {/* Text & Philosophy Column (7 cols) */}
          <div className="lg:col-span-7 space-y-6 text-right">
            <div className="space-y-2">
              <span className="text-[11px] font-semibold uppercase tracking-widest text-shaad-800">
                میراث دست و طبیعت
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground font-serif leading-tight">
                ساخته‌شده با دست، خلق‌شده برای ماندگاری نسل‌ها
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-muted-foreground font-light leading-relaxed max-w-xl">
              در آتلیه نجاری شادوود، هر اثر با گزینش دستی الوارهای اصیل چوب گردوی کوهستانی، راش و بلوط متولد می‌شود. ما با اتکا بر اتصالات کهن نجاری نظیر فاق و زبانه و پرداخت با روغن‌های ارگانیک گیاهی، سازه‌هایی خلق می‌کنیم که با گذشت سال‌ها بر اصالت، گرما و زیبایی آن‌ها افزوده می‌شود.
            </p>

            {/* Core Craft Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-shaad-700 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-xs text-foreground font-serif">۱۰۰٪ چوب ماسیو</h3>
                  <p className="text-[11px] text-muted-foreground">بدون روکش و متریال صنعتی</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-shaad-700 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-xs text-foreground font-serif">اتصالات اصیل</h3>
                  <p className="text-[11px] text-muted-foreground">فاق و زبانه‌های سنتی</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-shaad-700 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-xs text-foreground font-serif">فینیش‌های ارگانیک</h3>
                  <p className="text-[11px] text-muted-foreground">روغن‌های گیاهی و موم طبیعی</p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Link href="/about">
                <Button
                  variant="outline"
                  className="rounded-full border-border/80 bg-white hover:bg-zen-100 text-foreground text-xs sm:text-sm font-medium tracking-wide gap-2 shadow-2xs"
                >
                  <span>داستان و فلسفه آتلیه شادوود</span>
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
