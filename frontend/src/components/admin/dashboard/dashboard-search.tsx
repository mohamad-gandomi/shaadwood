'use client';

import * as React from 'react';
import Link from 'next/link';
import { Search, X, Clock, AlertTriangle, Tag, ChevronLeft, Armchair } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCurrency, cn } from '@/lib/utils';
import { Order, Product, Coupon } from '@/types';

export interface SearchResultsData {
  orders: Order[];
  products: Product[];
  coupons: Coupon[];
  actions: { title: string; description: string; href: string; icon: any; category: string }[];
  totalCount: number;
}

interface DashboardSearchProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  activeFilter: 'all' | 'pending' | 'low_stock' | 'coupons';
  setActiveFilter: (f: 'all' | 'pending' | 'low_stock' | 'coupons') => void;
  ordersToFulfill: number; lowStockCount: number; activeCouponsCount: number;
  searchResults: SearchResultsData | null;
}

export function DashboardSearch(props: DashboardSearchProps) {
  const {
    searchQuery,
    setSearchQuery,
    activeFilter,
    setActiveFilter,
    ordersToFulfill,
    lowStockCount,
    activeCouponsCount,
    searchResults,
  } = props;

  return (
    <div className="space-y-3 font-sans" dir="rtl">
      {/* Search Input Bar with right-side search icon and left-side clear icon */}
      <div className="relative">
        <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-muted-foreground">
          <Search className="w-4 h-4" />
        </div>
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="جستجو در سفارش‌ها (مثلاً #ORD-2026-001 یا نام مشتری)، محصولات کارگاه، کدهای تخفیف یا دستورات..."
          className="pr-10 pl-10 py-2.5 h-11 bg-card/70 border-border/70 rounded-xl text-xs sm:text-sm shadow-2xs focus-visible:ring-primary/30 transition-all placeholder:text-muted-foreground/70 text-right"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-muted-foreground hover:text-foreground"
            aria-label="پاک کردن جستجو"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filter status pills */}
      <div className="flex flex-wrap items-center gap-2 pt-0.5">
        <button
          type="button"
          onClick={() => { setActiveFilter('all'); setSearchQuery(''); }}
          className={cn('px-3 py-1.5 rounded-lg text-xs font-medium transition-all border select-none', activeFilter === 'all' && !searchQuery ? 'bg-primary text-primary-foreground border-primary shadow-2xs' : 'bg-card/70 text-muted-foreground hover:text-foreground border-border/60 hover:bg-accent/50')}
        >
          همه بخش‌ها
        </button>
        <button
          type="button"
          onClick={() => { setActiveFilter('pending'); setSearchQuery(''); }}
          className={cn('px-3 py-1.5 rounded-lg text-xs font-medium transition-all border flex items-center gap-1.5 select-none', activeFilter === 'pending' && !searchQuery ? 'bg-amber-600 text-white border-amber-600 shadow-2xs' : 'bg-card/70 text-muted-foreground hover:text-foreground border-border/60 hover:bg-accent/50')}
        >
          <Clock className="w-3.5 h-3.5 text-amber-500" />
          <span>نیازمند ساخت و ارسال</span>
          <span className="font-sans text-[10px] bg-amber-500/20 text-amber-700 dark:text-amber-300 px-1.5 py-0.2 rounded font-semibold">{ordersToFulfill}</span>
        </button>
        <button
          type="button"
          onClick={() => { setActiveFilter('low_stock'); setSearchQuery(''); }}
          className={cn('px-3 py-1.5 rounded-lg text-xs font-medium transition-all border flex items-center gap-1.5 select-none', activeFilter === 'low_stock' && !searchQuery ? 'bg-red-600 text-white border-red-600 shadow-2xs' : 'bg-card/70 text-muted-foreground hover:text-foreground border-border/60 hover:bg-accent/50')}
        >
          <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
          <span>هشدار کمبود موجودی</span>
          <span className="font-sans text-[10px] bg-red-500/20 text-red-700 dark:text-red-300 px-1.5 py-0.2 rounded font-semibold">{lowStockCount}</span>
        </button>
        <button
          type="button"
          onClick={() => { setActiveFilter('coupons'); setSearchQuery(''); }}
          className={cn('px-3 py-1.5 rounded-lg text-xs font-medium transition-all border flex items-center gap-1.5 select-none', activeFilter === 'coupons' && !searchQuery ? 'bg-wood-700 text-white border-wood-700 shadow-2xs' : 'bg-card/70 text-muted-foreground hover:text-foreground border-border/60 hover:bg-accent/50')}
        >
          <Tag className="w-3.5 h-3.5 text-wood-600" />
          <span>تخفیف‌های فعال</span>
          <span className="font-sans text-[10px] bg-wood-500/20 text-wood-700 dark:text-wood-300 px-1.5 py-0.2 rounded font-semibold">{activeCouponsCount}</span>
        </button>
      </div>

      {/* Instant Search Results Panel */}
      {searchResults && (
        <Card className="border-primary/40 shadow-md bg-card animate-in fade-in-50 duration-150">
          <CardHeader className="py-3 px-4 border-b border-border/60 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-primary" />
              <CardTitle className="text-xs font-bold text-foreground">
                نتایج جستجو ({searchResults.totalCount} مورد یافت شد)
              </CardTitle>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setSearchQuery('')} className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground">
              بستن
            </Button>
          </CardHeader>
          <CardContent className="p-4 space-y-4 max-h-[420px] overflow-y-auto">
            {searchResults.totalCount === 0 ? (
              <div className="text-center py-6 text-xs text-muted-foreground">
                هیچ موردی منطبق با «{searchQuery}» در سفارشات، آثار، تخفیف‌ها یا بخش‌های مدیریتی یافت نشد.
              </div>
            ) : (
              <>
                {searchResults.orders.length > 0 && (
                  <div className="space-y-1.5">
                    <div className="text-[11px] font-bold text-muted-foreground px-1">سفارش‌ها ({searchResults.orders.length})</div>
                    <div className="space-y-1">
                      {searchResults.orders.map((ord) => (
                        <Link key={ord.id} href={`/orders/${ord.id}`} className="flex items-center justify-between p-2.5 rounded-lg border border-border/60 hover:bg-accent/60 transition-colors text-xs">
                          <div className="flex items-center gap-3 min-w-0">
                            <span className="font-sans font-bold text-primary shrink-0">{ord.orderNumber}</span>
                            <div className="truncate"><span className="font-semibold text-foreground">{ord.customerName}</span><span className="text-muted-foreground text-[11px] mr-2 truncate">({ord.customerEmail})</span></div>
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            <span className="font-bold text-foreground font-sans">{formatCurrency(ord.totalAmount)}</span>
                            <Badge variant="outline" className="text-[10px]">{ord.status}</Badge>
                            <ChevronLeft className="w-3.5 h-3.5 text-muted-foreground" />
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {searchResults.products.length > 0 && (
                  <div className="space-y-1.5">
                    <div className="text-[11px] font-bold text-muted-foreground px-1">محصولات ({searchResults.products.length})</div>
                    <div className="space-y-1">
                      {searchResults.products.map((p) => (
                        <Link key={p.id} href="/products" className="flex items-center justify-between p-2.5 rounded-lg border border-border/60 hover:bg-accent/60 transition-colors text-xs">
                          <div className="flex items-center gap-3 min-w-0">
                            <Armchair className="w-3.5 h-3.5 text-wood-700 shrink-0" />
                            <div className="truncate"><span className="font-semibold text-foreground">{p.name}</span>{p.sku && <span className="text-muted-foreground font-sans text-[11px] mr-2">شناسه: {p.sku}</span>}</div>
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            <span className="font-medium text-foreground">{formatCurrency(p.basePrice)}</span>
                            <Badge variant={p.stockQuantity <= 0 ? 'destructive' : 'outline'} className="text-[10px]">{p.stockQuantity <= 0 ? 'ناموجود' : `${p.stockQuantity} عدد موجود`}</Badge>
                            <ChevronLeft className="w-3.5 h-3.5 text-muted-foreground" />
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {searchResults.coupons.length > 0 && (
                  <div className="space-y-1.5">
                    <div className="text-[11px] font-bold text-muted-foreground px-1">کدهای تخفیف ({searchResults.coupons.length})</div>
                    <div className="space-y-1">
                      {searchResults.coupons.map((c) => (
                        <Link key={c.id} href="/coupons" className="flex items-center justify-between p-2.5 rounded-lg border border-border/60 hover:bg-accent/60 transition-colors text-xs">
                          <div className="flex items-center gap-3 min-w-0">
                            <Tag className="w-3.5 h-3.5 text-primary shrink-0" />
                            <div className="truncate"><span className="font-sans font-bold text-primary">{c.code}</span>{c.description && <span className="text-muted-foreground text-[11px] mr-2">({c.description})</span>}</div>
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            <span className="font-medium text-foreground">{c.discountType === 'PERCENTAGE' ? `${c.discountValue}٪ تخفیف` : `${formatCurrency(c.discountValue)} تخفیف`}</span>
                            <Badge variant={c.isActive ? 'wood' : 'secondary'} className="text-[10px]">{c.isActive ? 'فعال' : 'غیرفعال'}</Badge>
                            <ChevronLeft className="w-3.5 h-3.5 text-muted-foreground" />
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
