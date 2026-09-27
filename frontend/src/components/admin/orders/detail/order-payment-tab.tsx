'use client';

import * as React from 'react';
import { CreditCard, CheckCircle2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Order, PaymentStatus, TransactionStatus } from '@/types';

interface OrderPaymentTabProps {
  order: Order;
  paymentStatus: PaymentStatus;
  setPaymentStatus: (s: PaymentStatus) => void;
  onSave: () => void;
  isSaving: boolean;
}

function getTxStatusBadge(txStatus: TransactionStatus) {
  switch (txStatus) {
    case 'SUCCESS':
      return <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-300 font-semibold text-[10px] font-sans">موفق</Badge>;
    case 'FAILED':
      return <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-300 font-semibold text-[10px] font-sans">ناموفق</Badge>;
    case 'REFUNDED':
      return <Badge variant="outline" className="bg-zinc-100 text-zinc-700 border-zinc-300 font-semibold text-[10px] font-sans">مسترد شده</Badge>;
    default:
      return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-300 font-semibold text-[10px] font-sans">در انتظار</Badge>;
  }
}

export function OrderPaymentTab(props: OrderPaymentTabProps) {
  const { order, paymentStatus, setPaymentStatus, onSave, isSaving } = props;

  return (
    <div className="space-y-6 font-sans" dir="rtl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Payment Configuration */}
        <Card className="shadow-xs border-border/80">
          <CardHeader className="pb-3 border-b border-border/50">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-primary" />
              <span>وضعیت پرداخت سفارش</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-semibold text-foreground">تغییر وضعیت پرداخت</label>
              <select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value as PaymentStatus)}
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-xs font-sans text-right"
              >
                <option value="PAID">پرداخت موفق و تأییدشده</option>
                <option value="PENDING">در انتظار پرداخت / نامشخص</option>
                <option value="FAILED">پرداخت ناموفق</option>
                <option value="REFUNDED">استرداد کامل وجه</option>
              </select>
            </div>

            <div className="p-3 rounded-xl bg-zen-50 border border-border/60 space-y-1.5">
              <div className="flex justify-between">
                <span className="text-muted-foreground">درگاه / شیوه:</span>
                <span className="font-semibold text-foreground">{order.paymentMethod || 'درگاه بانکی شاپرک'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">مبلغ پرداختی:</span>
                <span className="font-bold text-primary font-sans">{formatCurrency(order.totalAmount)}</span>
              </div>
            </div>

            <Button onClick={onSave} disabled={isSaving} size="sm" className="w-full h-9 text-xs">
              {isSaving ? 'در حال ثبت...' : 'ذخیره وضعیت پرداخت'}
            </Button>
          </CardContent>
        </Card>

        {/* Transactions Table */}
        <div className="lg:col-span-2">
          <Card className="shadow-xs border-border/80">
            <CardHeader className="pb-3 border-b border-border/50">
              <CardTitle className="text-sm font-semibold">تراکنش‌های ثبت‌شده درگاه شاپرک</CardTitle>
            </CardHeader>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead className="text-right">شناسه تراکنش</TableHead>
                    <TableHead className="text-right">تاریخ</TableHead>
                    <TableHead className="text-left">مبلغ</TableHead>
                    <TableHead className="text-center">وضعیت</TableHead>
                    <TableHead className="text-left pl-4">شماره ارجاع (RRN)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.transactions && order.transactions.length > 0 ? (
                    order.transactions.map((tx) => (
                      <TableRow key={tx.id}>
                        <TableCell className="font-sans text-xs">{tx.transactionId || tx.id.slice(0, 8)}</TableCell>
                        <TableCell className="text-xs font-sans text-muted-foreground">{formatDate(tx.createdAt)}</TableCell>
                        <TableCell className="text-left text-xs font-bold font-sans">{formatCurrency(tx.amount)}</TableCell>
                        <TableCell className="text-center">{getTxStatusBadge(tx.status)}</TableCell>
                        <TableCell className="text-left pl-4 font-sans text-xs text-muted-foreground">{tx.trackingCode || tx.transactionId || '---'}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-xs text-muted-foreground">
                        تراکنش آنلاینی برای این سفارش ثبت نشده است.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
