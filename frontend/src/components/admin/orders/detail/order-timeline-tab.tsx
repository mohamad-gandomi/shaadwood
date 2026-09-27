'use client';

import * as React from 'react';
import { Clock, Save } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Order, OrderStatus } from '@/types';

interface OrderTimelineTabProps {
  order: Order;
  status: OrderStatus;
  setStatus: (s: OrderStatus) => void;
  internalNotes: string;
  setInternalNotes: (notes: string) => void;
  onSave: () => void;
  isSaving: boolean;
}

export function OrderTimelineTab(props: OrderTimelineTabProps) {
  const {
    order,
    status,
    setStatus,
    internalNotes,
    setInternalNotes,
    onSave,
    isSaving,
  } = props;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 font-sans" dir="rtl">
      {/* Workshop Notes Card */}
      <Card className="shadow-xs border-border/80">
        <CardHeader className="pb-3 border-b border-border/50">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            <span>یادداشت‌های داخلی کارگاه درودگری</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-semibold text-foreground">
              یادداشت‌های محرمانه (فقط برای مدیران و استادکاران کارگاه قابل رؤیت است)
            </label>
            <textarea
              value={internalNotes}
              onChange={(e) => setInternalNotes(e.target.value)}
              placeholder="نکات مربوط به گونه چوب، برش، زمان سنباده‌زنی، هماهنگی باربری..."
              rows={5}
              className="w-full rounded-md border border-input bg-background p-3 text-xs text-right focus:outline-none focus:ring-1 focus:ring-primary leading-relaxed font-sans"
            />
          </div>

          <Button onClick={onSave} disabled={isSaving} size="sm" className="h-9 text-xs gap-1.5">
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? 'در حال ثبت...' : 'ذخیره یادداشت‌های کارگاه'}</span>
          </Button>
        </CardContent>
      </Card>

      {/* Lifecycle Status Management */}
      <Card className="shadow-xs border-border/80">
        <CardHeader className="pb-3 border-b border-border/50">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            <span>تغییر مرحله و وضعیت سفارش</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-semibold text-foreground">مرحله فعلی سفارش در کارگاه</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as OrderStatus)}
              className="w-full h-10 px-3 rounded-md border border-input bg-background text-xs font-sans text-right"
            >
              <option value="PENDING">در انتظار بررسی اولیه</option>
              <option value="PROCESSING">در حال ساخت و پردازش در کارگاه</option>
              <option value="SHIPPED">تحویل به باربری و ارسال مرسوله</option>
              <option value="DELIVERED">تحویل نهایی به مشتری</option>
              <option value="CANCELLED">لغو سفارش</option>
              <option value="REFUNDED">مسترد شده</option>
            </select>
          </div>

          <div className="p-3.5 rounded-xl bg-zen-50 border border-border/60 text-muted-foreground leading-relaxed text-[11px] space-y-1">
            <p className="font-semibold text-foreground">راهنمای وضعیت‌ها:</p>
            <p>• <strong>در حال ساخت:</strong> چوب در کارگاه برش خورده و اتصالات درودگری در دست مونتاژ است.</p>
            <p>• <strong>تحویل به باربری:</strong> مرسوله با بسته‌بندی ایمن تحویل راننده یا سامانه پستی گردید.</p>
          </div>

          <Button onClick={onSave} disabled={isSaving} size="sm" className="w-full h-9 text-xs">
            {isSaving ? 'در حال اعمال...' : 'اعمال تغییر وضعیت'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
