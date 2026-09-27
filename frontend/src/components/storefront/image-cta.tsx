'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ImageCTA() {
  return (
    <section className="py-16 sm:py-20 bg-white border-b border-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl overflow-hidden bg-zen-900 text-white shadow-md border border-zen-800 grid grid-cols-1 lg:grid-cols-12">
          {/* Content Column (5 cols) */}
          <div className="lg:col-span-5 p-8 sm:p-12 lg:p-14 flex flex-col justify-center space-y-5 order-2 lg:order-1 text-right">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-shaad-300">
              سفارش‌های اختصاصی و سازه‌های دست‌ساز
            </span>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-serif tracking-tight text-white leading-tight">
              طراحی و ساخت منطبق با فضا و سلیقه چوبی شما
            </h2>

            <p className="text-xs sm:text-sm text-zen-300 font-light leading-relaxed max-w-md">
              امکان گفت‌وگو و همراهی مستقیم با اساتید آتلیه شادوود برای تعیین ابعاد دلخواه، گزینش اسلب چوب طبیعی و خلق اثری یگانه و ماندگار برای خانه شما.
            </p>

            <div className="pt-2">
              <Link href="/contact">
                <Button
                  size="lg"
                  className="bg-white hover:bg-zen-100 text-shaad-900 rounded-full font-semibold px-6 sm:px-8 py-3 text-xs sm:text-sm tracking-wide shadow-sm gap-2 transition-all hover:scale-105"
                >
                  <span>مشاوره و سفارش اثر سفارشی</span>
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Lifestyle / Furniture Image Column (7 cols) */}
          <div className="lg:col-span-7 relative min-h-[280px] sm:min-h-[360px] lg:min-h-[420px] overflow-hidden bg-zen-800 order-1 lg:order-2">
            <img
              src="/images/showcase-credenza.webp"
              alt="کنسول دست‌ساز چوب گردوی پیوسته شادوود"
              onError={(e) => {
                e.currentTarget.src = '/images/material-craft-wood.webp';
              }}
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent lg:hidden" />
            <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[11px] font-sans text-white/90">
              سفارش اختصاصی اسلب گردو
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
