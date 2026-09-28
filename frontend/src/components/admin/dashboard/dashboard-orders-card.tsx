'use client';

import * as React from 'react';
import Link from 'next/link';
import { ShoppingBag, ArrowLeft, Truck } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getOrderStatusBadge, formatPaymentMethod } from '@/components/admin/orders/orders-status-badge';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Order } from '@/types';

interface DashboardOrdersCardProps {
  statsLoading: boolean;
  displayedOrders: Order[];
  activeFilter: 'all' | 'pending' | 'low_stock' | 'coupons';
}

export function DashboardOrdersCard({ statsLoading, displayedOrders, activeFilter }: DashboardOrdersCardProps) {
  return (
    <Card className="shadow-2xs border-border/70 overflow-hidden font-sans" dir="rtl">
      <CardHeader className="flex flex-row items-center justify-between pb-3 px-4 sm:px-6">
        <div>
          <CardTitle className="text-sm sm:text-base flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-primary" />
            <span>سفارش‌های اخیر و جریان کارگاه</span>
          </CardTitle>
          <CardDescription className="text-xs">
            {activeFilter === 'pending'
              ? 'نمایش سفارش‌های چشم‌انتظار ساخت و تحویل به باربری'
              : 'سفارش‌های لحظه‌ای ثبت‌شده مشتریان در فروشگاه'}
          </CardDescription>
        </div>
        <Link href="/orders">
          <Button variant="ghost" size="sm" className="text-xs gap-1 text-primary hover:text-primary px-2">
            <span>مشاهده همه</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </Button>
        </Link>
      </CardHeader>

      {/* Desktop Table View */}
      <div className="hidden sm:block overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[120px] text-right">شماره سفارش</TableHead>
              <TableHead className="text-right">مشتری</TableHead>
              <TableHead className="text-right">روش و ناوگان ارسال</TableHead>
              <TableHead className="text-left">مبلغ کل</TableHead>
              <TableHead className="text-center whitespace-nowrap">وضعیت سفارش</TableHead>
              <TableHead className="text-left pl-4">عملیات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {statsLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground text-xs">
                  در حال بارگذاری سفارش‌های اخیر...
                </TableCell>
              </TableRow>
            ) : displayedOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground text-xs">
                  {activeFilter === 'pending' ? 'سفارشی در صف پردازش نیست.' : 'هنوز سفارشی ثبت نشده است.'}
                </TableCell>
              </TableRow>
            ) : (
              displayedOrders.slice(0, 6).map((ord) => (
                <TableRow key={ord.id} className="hover:bg-muted/40 transition-colors">
                  <TableCell className="font-semibold text-primary font-sans text-xs">
                    <Link href={`/orders/${ord.id}`} className="hover:underline flex items-center gap-1">
                      {ord.orderNumber}
                    </Link>
                  </TableCell>
                  <TableCell className="text-xs">
                    <div className="font-medium text-foreground">{ord.customerName}</div>
                    <div className="text-muted-foreground text-[11px] truncate max-w-[160px]">{ord.customerEmail}</div>
                  </TableCell>
                  <TableCell className="text-xs">
                    <div className="text-foreground font-medium flex items-center gap-1.5">
                      <Truck className="w-3 h-3 text-muted-foreground" />
                      <span>{ord.shippingCarrier || ord.shippingMethod || 'ارسال اختصاصی کارگاه'}</span>
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      {formatPaymentMethod(ord.paymentMethod)}
                    </div>
                  </TableCell>
                  <TableCell className="text-left font-bold text-foreground text-xs font-sans">
                    {formatCurrency(ord.totalAmount)}
                  </TableCell>
                  <TableCell className="text-center whitespace-nowrap">
                    {getOrderStatusBadge(ord.status as any)}
                  </TableCell>
                  <TableCell className="text-left pl-4">
                    <Link href={`/orders/${ord.id}`}>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground" title="جزئیات سفارش">
                        <ArrowLeft className="w-3.5 h-3.5" />
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View */}
      <div className="block sm:hidden divide-y divide-border/60">
        {statsLoading ? (
          <div className="text-center py-6 text-xs text-muted-foreground">در حال بارگذاری سفارش‌ها...</div>
        ) : displayedOrders.length === 0 ? (
          <div className="text-center py-6 text-xs text-muted-foreground">سفارشی یافت نشد.</div>
        ) : (
          displayedOrders.slice(0, 5).map((ord) => (
            <Link key={ord.id} href={`/orders/${ord.id}`} className="block p-4 hover:bg-accent/40 transition-colors space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="font-sans text-xs font-bold text-primary">{ord.orderNumber}</span>
                <div className="shrink-0 whitespace-nowrap">
                  {getOrderStatusBadge(ord.status as any)}
                </div>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-foreground">{ord.customerName}</span>
                <span className="font-bold text-foreground font-sans">{formatCurrency(ord.totalAmount)}</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                <span>{ord.shippingCarrier || 'ارسال اختصاصی'}</span>
                <span>{formatDate(ord.createdAt)}</span>
              </div>
            </Link>
          ))
        )}
      </div>
    </Card>
  );
}
