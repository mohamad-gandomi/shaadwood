'use client';

import * as React from 'react';
import {
  Clock,
  Package,
  Truck,
  CheckCircle2,
  XCircle,
  RotateCcw,
  CreditCard,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { OrderStatus } from '@/types';

export function getOrderStatusBadge(status: OrderStatus) {
  switch (status) {
    case 'PENDING':
      return (
        <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-300 flex items-center gap-1 font-sans text-[10px]">
          <Clock className="w-3 h-3" /> در انتظار بررسی
        </Badge>
      );
    case 'PROCESSING':
      return (
        <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-300 flex items-center gap-1 font-sans text-[10px]">
          <Package className="w-3 h-3" /> در حال ساخت
        </Badge>
      );
    case 'SHIPPED':
      return (
        <Badge variant="outline" className="bg-purple-50 text-purple-800 border-purple-300 flex items-center gap-1 font-sans text-[10px]">
          <Truck className="w-3 h-3" /> ارسال به باربری
        </Badge>
      );
    case 'DELIVERED':
      return (
        <Badge variant="outline" className="bg-emerald-50 text-emerald-800 border-emerald-300 flex items-center gap-1 font-sans text-[10px]">
          <CheckCircle2 className="w-3 h-3" /> تحویل داده شده
        </Badge>
      );
    case 'CANCELLED':
      return (
        <Badge variant="outline" className="bg-zinc-100 text-zinc-700 border-zinc-300 flex items-center gap-1 font-sans text-[10px]">
          <XCircle className="w-3 h-3" /> لغو شده
        </Badge>
      );
    case 'REFUNDED':
      return (
        <Badge variant="outline" className="bg-rose-50 text-rose-800 border-rose-300 flex items-center gap-1 font-sans text-[10px]">
          <RotateCcw className="w-3 h-3" /> مسترد شده
        </Badge>
      );
    default:
      return <Badge variant="outline" className="font-sans text-[10px]">{status}</Badge>;
  }
}

export function getOrderPaymentBadge(status: string, method?: string) {
  const isPaid = status === 'PAID';
  const isRefunded = status === 'REFUNDED';
  const isZarinpal =
    method?.toUpperCase().includes('ZARINPAL') ||
    method?.toUpperCase().includes('MELLAT') ||
    method?.toUpperCase().includes('SAMAN');

  return (
    <div className="space-y-0.5 font-sans">
      <div className="flex items-center gap-1.5 text-xs">
        <CreditCard className="w-3 h-3 text-muted-foreground" />
        <span className="font-medium text-foreground">
          {isZarinpal ? 'زرین‌پال / شاپرک' : method || 'درگاه آنلاین'}
        </span>
      </div>
      <span
        className={`inline-flex items-center gap-1 text-[10px] font-semibold ${
          isPaid ? 'text-emerald-700' : isRefunded ? 'text-rose-700' : 'text-amber-700'
        }`}
      >
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            isPaid ? 'bg-emerald-500' : isRefunded ? 'bg-rose-500' : 'bg-amber-500'
          }`}
        />
        {isPaid ? 'پرداخت موفق' : isRefunded ? 'استرداد وجه' : 'در انتظار پرداخت'}
      </span>
    </div>
  );
}
