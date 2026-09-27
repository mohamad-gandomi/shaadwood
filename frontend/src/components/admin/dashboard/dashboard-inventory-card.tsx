'use client';

import * as React from 'react';
import Link from 'next/link';
import { Package, CheckCircle2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, cn } from '@/lib/utils';
import { Product } from '@/types';

interface DashboardInventoryCardProps {
  productsLoading: boolean;
  lowStockProducts: Product[];
}

export function DashboardInventoryCard({ productsLoading, lowStockProducts }: DashboardInventoryCardProps) {
  return (
    <Card className="shadow-2xs border-border/70 font-sans" dir="rtl">
      <CardHeader className="pb-3 px-4 sm:px-6 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <Package className="w-4 h-4 text-primary" />
            <span>پایش کسری موجودی</span>
          </CardTitle>
          <CardDescription className="text-xs">
            پایش نیاز به ساخت مجدد و تأمین چوب
          </CardDescription>
        </div>
        <Link href="/products">
          <Button variant="ghost" size="sm" className="text-xs text-primary hover:text-primary h-7 px-2">
            مدیریت آثار
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="px-4 sm:px-6 pb-5 space-y-2.5">
        {productsLoading ? (
          <div className="text-center py-6 text-xs text-muted-foreground">
            در حال پایش موجودی انبار کارگاه...
          </div>
        ) : lowStockProducts.length === 0 ? (
          <div className="p-4 rounded-xl border border-emerald-200/60 bg-emerald-50/50 dark:bg-emerald-950/20 text-center space-y-1.5">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400 mx-auto" />
            <div className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">
              موجودی کاتالوگ در وضعیت مطلوب
            </div>
            <div className="text-[11px] text-emerald-700/80 dark:text-emerald-400/80">
              تمام مدل‌های چوبی دست‌ساز دارای موجودی کافی در کارگاه هستند.
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {lowStockProducts.slice(0, 5).map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between p-2.5 rounded-lg border border-border/60 bg-card/60 hover:bg-accent/40 transition-colors text-xs"
              >
                <div className="min-w-0 pl-2">
                  <div className="font-semibold text-foreground truncate">{p.name}</div>
                  <div className="text-[11px] text-muted-foreground flex items-center gap-1.5 mt-0.5">
                    {p.sku && <span className="font-sans">شناسه: {p.sku}</span>}
                    {p.sku && <span>·</span>}
                    <span className="font-sans">{formatCurrency(p.basePrice)}</span>
                  </div>
                </div>
                <Badge
                  variant={p.stockQuantity <= 0 ? 'destructive' : 'outline'}
                  className={cn(
                    'text-[10px] shrink-0 font-medium font-sans',
                    p.stockQuantity <= 0
                      ? 'bg-red-500/15 text-red-700 dark:text-red-300 border-red-300'
                      : 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-300'
                  )}
                >
                  {p.stockQuantity <= 0 ? 'ناموجود' : `${p.stockQuantity} عدد مانده`}
                </Badge>
              </div>
            ))}
            {lowStockProducts.length > 5 && (
              <Link href="/products" className="block pt-1 text-center">
                <span className="text-[11px] text-primary hover:underline font-medium">
                  + {lowStockProducts.length - 5} اثر کم‌موجود دیگر
                </span>
              </Link>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
