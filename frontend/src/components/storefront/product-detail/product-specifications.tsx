'use client';

import * as React from 'react';
import { TreePine, Sparkles, CheckCircle2 } from 'lucide-react';
import { Product } from '@/types';

interface ProductSpecificationsProps {
  product: Product;
}

export function ProductSpecifications({ product }: ProductSpecificationsProps) {
  const specsList = React.useMemo(() => {
    const list: Array<{ label: string; value: string }> = [];

    if (product.dimensions) {
      list.push({ label: 'ابعاد اثر', value: product.dimensions });
    }

    if (product.weight) {
      list.push({ label: 'وزن خالص', value: `${product.weight} کیلوگرم` });
    }

    if (product.specifications && Array.isArray(product.specifications) && product.specifications.length > 0) {
      for (const item of product.specifications) {
        if (!item || !item.label || !item.value) continue;
        const isDim = /dimension/i.test(item.label) || /ابعاد/i.test(item.label);
        const isWeight = /weight/i.test(item.label) || /وزن/i.test(item.label);
        if (isDim && product.dimensions) continue;
        if (isWeight && product.weight) continue;
        list.push(item);
      }
      return list;
    }

    list.push(
      { label: 'گونه چوب', value: 'چوب طبیعی ماسیو دارای شناسنامه پایداری (گردو / بلوط / راش)' },
      { label: 'فنون و اتصالات', value: 'اتصالات کهن فاق و زبانه با تقویت پین‌های چوب سخت' },
      { label: 'پوشش و پرداخت سطح', value: 'روغن‌های ارگانیک گیاهی و موم طبیعی با پرداخت دستی مات' },
      { label: 'یراق‌آلات', value: 'برنج ریخته‌گری کهنه‌کاری‌شده، لولاهای آرام‌بند مخفی' },
      { label: 'استاندارد زیست‌محیطی', value: 'فاقد مواد فرار شیمیایی (Zero VOC)، مواد کاملاً طبیعی و ایمن' },
      { label: 'ضمانت و پشتیبانی', value: 'ضمانت ۲۵ ساله اصالت ساختار چوب آتلیه نجاری شادوود' }
    );

    return list;
  }, [product.specifications, product.dimensions, product.weight]);

  return (
    <section className="pt-16 pb-6 border-t border-border/70 text-right">
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-shaad-800 text-xs font-semibold uppercase tracking-widest mb-1.5">
              <TreePine className="w-3.5 h-3.5" />
              <span>مشخصات فنی و نجاری اثر</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-foreground">
              دقت در ساختار، پیوند با طبیعت متریال
            </h2>
          </div>
          <p className="text-xs text-muted-foreground font-light max-w-sm leading-relaxed">
            هر اثر به صورت اختصاصی با شناسنامه چوب و امضای استادکار آتلیه شادوود عرضه می‌شود.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-border/70 overflow-hidden shadow-2xs">
          <div className="divide-y divide-border/60">
            {specsList.map((item, idx) => (
              <div
                key={idx}
                className="grid grid-cols-1 md:grid-cols-12 p-4 sm:p-5 hover:bg-zen-50/60 transition-colors gap-2 sm:gap-4 items-baseline"
              >
                <div className="md:col-span-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-shaad-700 shrink-0" />
                  <span>{item.label}</span>
                </div>
                <div className="md:col-span-8 text-xs sm:text-sm font-medium text-foreground leading-relaxed">
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-shaad-900 text-white rounded-3xl p-6 sm:p-8 space-y-3">
          <div className="flex items-center gap-2 text-shaad-300 text-xs uppercase tracking-widest font-semibold">
            <Sparkles className="w-4 h-4 text-shaad-400" />
            <span>استانداردهای مهندسی چوب شادوود</span>
          </div>
          <p className="text-xs sm:text-sm text-zen-200 font-light leading-relaxed max-w-3xl">
            هیچ‌یک از سازه‌های شادوود از ام‌دی‌اف، نئوپان یا روکش‌های صنعتی لایه‌ای ساخته نمی‌شوند. تمامی اجزا با اتصالات مکانیکی چوب به چوب به یکدیگر متصل شده‌اند تا با تغییرات دما و رطوبت فصول سال هماهنگ بوده و برای دهه‌ها زیبایی و کیفیت اولیه خود را حفظ کنند.
          </p>
        </div>
      </div>
    </section>
  );
}
