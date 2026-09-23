'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ShoppingBag,
  Search,
  Truck,
  CreditCard,
  Eye,
  CheckCircle2,
  Clock,
  Package,
  XCircle,
  AlertTriangle,
  RotateCcw,
  TrendingUp,
  Pencil,
  Trash2,
  Image as ImageIcon,
} from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { Header } from '@/components/admin/header';
import { HoldToDeleteButton } from '@/components/admin/hold-to-delete-button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Order, OrderStatus } from '@/types';

export default function OrdersPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [selectedStatus, setSelectedStatus] = React.useState<string>('ALL');
  const [searchTerm, setSearchTerm] = React.useState('');
  const [deleteOrder, setDeleteOrder] = React.useState<Order | null>(null);

  const { data: stats } = useQuery({
    queryKey: ['order-stats'],
    queryFn: () => api.getOrderStats(),
  });

  const { data: ordersData, isLoading } = useQuery({
    queryKey: ['orders', selectedStatus, searchTerm],
    queryFn: () =>
      api.getOrders({
        status: selectedStatus === 'ALL' ? undefined : (selectedStatus as OrderStatus),
        search: searchTerm || undefined,
        limit: 50,
      }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.deleteOrder(id),
    onSuccess: () => {
      toast.success('Order deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['order-stats'] });
      setDeleteOrder(null);
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to delete order');
    },
  });

  const orders: Order[] = Array.isArray(ordersData)
    ? ordersData
    : (ordersData as any)?.data || [];

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'PENDING':
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-300 flex items-center gap-1">
            <Clock className="w-3 h-3" /> Pending
          </Badge>
        );
      case 'PROCESSING':
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-300 flex items-center gap-1">
            <Package className="w-3 h-3" /> Processing
          </Badge>
        );
      case 'SHIPPED':
        return (
          <Badge variant="outline" className="bg-purple-50 text-purple-800 border-purple-300 flex items-center gap-1">
            <Truck className="w-3 h-3" /> Shipped
          </Badge>
        );
      case 'DELIVERED':
        return (
          <Badge variant="outline" className="bg-emerald-50 text-emerald-800 border-emerald-300 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Delivered
          </Badge>
        );
      case 'CANCELLED':
        return (
          <Badge variant="outline" className="bg-zinc-100 text-zinc-700 border-zinc-300 flex items-center gap-1">
            <XCircle className="w-3 h-3" /> Cancelled
          </Badge>
        );
      case 'REFUNDED':
        return (
          <Badge variant="outline" className="bg-rose-50 text-rose-800 border-rose-300 flex items-center gap-1">
            <RotateCcw className="w-3 h-3" /> Refunded
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPaymentBadge = (status: string, method?: string) => {
    const isPaid = status === 'PAID';
    const isRefunded = status === 'REFUNDED';
    const isZarinpal =
      method?.toUpperCase().includes('ZARINPAL') ||
      method?.toUpperCase().includes('MELLAT') ||
      method?.toUpperCase().includes('SAMAN');

    return (
      <div className="space-y-0.5">
        <div className="flex items-center gap-1.5 text-xs">
          <CreditCard className="w-3 h-3 text-muted-foreground" />
          <span className="font-medium text-foreground">
            {isZarinpal ? 'زرین‌پال / شاپرک' : method || 'Card'}
          </span>
        </div>
        <span
          className={`inline-flex items-center gap-1 text-[10px] font-semibold ${
            isPaid
              ? 'text-emerald-700'
              : isRefunded
              ? 'text-rose-700'
              : 'text-amber-700'
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              isPaid ? 'bg-emerald-500' : isRefunded ? 'bg-rose-500' : 'bg-amber-500'
            }`}
          />
          {status}
        </span>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <Header title="Orders & Fulfillment" />

      <div className="px-4 sm:px-8 max-w-7xl mx-auto space-y-6">
        {/* Metrics KPI Cards (Matching Product List Style) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Card className="shadow-2xs border-border/80 bg-card/60">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="text-xs font-medium text-muted-foreground">Total Orders</p>
                <p className="text-xl font-bold text-foreground">{stats?.totalOrders || 0}</p>
              </div>
              <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <ShoppingBag className="w-4 h-4" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-2xs border-border/80 bg-card/60">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="text-xs font-medium text-muted-foreground">Pending Action</p>
                <p className="text-xl font-bold text-amber-700 dark:text-amber-400">
                  {stats?.pendingCount || 0}
                </p>
              </div>
              <div className="w-9 h-9 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-2xs border-border/80 bg-card/60">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="text-xs font-medium text-muted-foreground">In Fulfillment</p>
                <p className="text-xl font-bold text-blue-700 dark:text-blue-400">
                  {(stats?.processingCount || 0) + (stats?.shippedCount || 0)}
                </p>
              </div>
              <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/30 flex items-center justify-center">
                <Truck className="w-4 h-4" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-2xs border-border/80 bg-card/60">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="text-xs font-medium text-muted-foreground">Gross Revenue</p>
                <p className="text-xl font-bold text-emerald-600">
                  {formatCurrency(stats?.totalRevenue || 0)}
                </p>
              </div>
              <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controls & Search Toolbar (Matching Product List Style) */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 max-w-2xl">
            {/* Search Box */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                placeholder="Search orders by #, customer, tracking, email..."
                className="pl-9 bg-card h-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Status Filter Buttons */}
            <div className="flex items-center rounded-lg border border-border bg-card p-1 text-xs shrink-0 h-9 box-border overflow-x-auto">
              {[
                { id: 'ALL', label: 'All' },
                { id: 'PENDING', label: 'Pending' },
                { id: 'PROCESSING', label: 'Processing' },
                { id: 'SHIPPED', label: 'Shipped' },
                { id: 'DELIVERED', label: 'Delivered' },
                { id: 'CANCELLED', label: 'Cancelled' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedStatus(tab.id)}
                  className={`h-full px-2.5 sm:px-3 rounded-md font-medium transition-colors flex items-center justify-center whitespace-nowrap ${
                    selectedStatus === tab.id
                      ? 'bg-primary text-primary-foreground shadow-xs'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="text-xs text-muted-foreground self-center sm:self-auto font-medium">
            Showing <strong className="text-foreground">{orders.length}</strong> order{orders.length === 1 ? '' : 's'}
          </div>
        </div>

        {/* 1. MOBILE VIEW: Responsive Cards (Matching Product List) */}
        <div className="grid grid-cols-1 gap-3 md:hidden">
          {isLoading ? (
            <div className="text-center py-12 text-muted-foreground text-sm">
              Loading orders...
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground text-sm bg-card border border-border rounded-xl">
              No matching orders found.
            </div>
          ) : (
            orders.map((order) => {
              const firstItem = order.items?.[0];
              return (
                <div
                  key={order.id}
                  onClick={() => router.push(`/orders/${order.id}`)}
                  className="p-4 rounded-xl border border-border bg-card shadow-xs hover:border-primary/50 transition-all cursor-pointer space-y-3"
                >
                  {/* Card Header: Order #, Status, and Date */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-mono font-bold text-sm text-primary">
                        {order.orderNumber}
                      </div>
                      <div className="font-semibold text-xs text-foreground mt-0.5">
                        {order.customerName}
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        {order.customerEmail}
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      {getStatusBadge(order.status)}
                      <div className="text-[10px] text-muted-foreground font-mono">
                        {formatDate(order.createdAt)}
                      </div>
                    </div>
                  </div>

                  {/* Card Middle: Items snippet & Total */}
                  <div className="flex items-center justify-between pt-2 border-t border-border/60 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-md bg-muted border border-border overflow-hidden shrink-0 flex items-center justify-center">
                        {firstItem?.productImage ? (
                          <img
                            src={firstItem.productImage}
                            alt={firstItem.productName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <ImageIcon className="w-4 h-4 text-muted-foreground/50" />
                        )}
                      </div>
                      <div className="space-y-0.5">
                        <div className="text-xs font-medium text-foreground">
                          {order.items?.length || 0} item{(order.items?.length || 0) > 1 ? 's' : ''}
                        </div>
                        <div className="text-[10px] text-muted-foreground truncate max-w-[160px]">
                          {order.shippingCarrier || order.shippingMethod || 'Standard Delivery'}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-bold text-sm text-foreground">
                        {formatCurrency(order.totalAmount)}
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        {order.paymentStatus}
                      </div>
                    </div>
                  </div>

                  {/* Card Footer: Actions */}
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-2 border-t border-border/40">
                    <div className="text-muted-foreground truncate max-w-[200px]">
                      {order.trackingNumber ? `#${order.trackingNumber}` : 'No tracking yet'}
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/orders/${order.id}`);
                        }}
                        title="View order"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteOrder(order);
                        }}
                        title="Delete order"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* 2. DESKTOP VIEW: Table With Actions (Matching Product List) */}
        <Card className="hidden md:block overflow-hidden">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[140px]">Order</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Shipping & Carrier</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-10 text-muted-foreground">
                      Loading orders...
                    </TableCell>
                  </TableRow>
                ) : orders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-10 text-muted-foreground">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <ShoppingBag className="w-8 h-8 text-muted-foreground/50" />
                        <p className="font-medium text-foreground">No orders found</p>
                        <p className="text-xs text-muted-foreground">
                          Try changing the status filter or search query.
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  orders.map((order) => (
                    <TableRow
                      key={order.id}
                      onClick={() => router.push(`/orders/${order.id}`)}
                      className="cursor-pointer hover:bg-muted/50 transition-colors group"
                    >
                      {/* Order Number */}
                      <TableCell className="font-semibold text-primary font-mono text-sm group-hover:underline">
                        {order.orderNumber}
                      </TableCell>

                      {/* Customer */}
                      <TableCell>
                        <div className="font-semibold text-foreground text-sm group-hover:text-primary transition-colors">
                          {order.customerName}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {order.customerEmail}
                        </div>
                      </TableCell>

                      {/* Date */}
                      <TableCell className="text-xs text-muted-foreground whitespace-nowrap font-mono">
                        {formatDate(order.createdAt)}
                      </TableCell>

                      {/* Items */}
                      <TableCell>
                        <div className="text-xs font-semibold text-foreground">
                          {order.items?.length || 0} item{(order.items?.length || 0) > 1 ? 's' : ''}
                        </div>
                        {order.items && order.items[0] && (
                          <div className="text-[11px] text-muted-foreground truncate max-w-[170px]">
                            {order.items[0].productName}
                          </div>
                        )}
                      </TableCell>

                      {/* Carrier */}
                      <TableCell>
                        <div className="text-xs font-medium text-foreground">
                          {order.shippingCarrier || order.shippingMethod || 'Standard Delivery'}
                        </div>
                        {order.trackingNumber && (
                          <div className="text-[11px] font-mono text-muted-foreground truncate max-w-[140px]">
                            #{order.trackingNumber}
                          </div>
                        )}
                      </TableCell>

                      {/* Payment */}
                      <TableCell>
                        {getPaymentBadge(order.paymentStatus, order.paymentMethod)}
                      </TableCell>

                      {/* Total */}
                      <TableCell className="text-right font-bold text-foreground text-sm">
                        {formatCurrency(order.totalAmount)}
                      </TableCell>

                      {/* Status */}
                      <TableCell className="text-center">
                        {getStatusBadge(order.status)}
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/orders/${order.id}`);
                            }}
                            title="Inspect order details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteOrder(order);
                            }}
                            title="Delete order"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog (Matching Product Delete Modal) */}
      <Dialog open={Boolean(deleteOrder)} onOpenChange={(open) => !open && setDeleteOrder(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="w-10 h-10 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mb-2">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <DialogTitle>Delete Order</DialogTitle>
            <DialogDescription>
              Are you sure you want to permanently delete order{' '}
              <strong className="text-foreground font-mono">{deleteOrder?.orderNumber}</strong>? This
              action cannot be undone and will remove all associated transaction records and fulfillment history.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteOrder(null)}
              disabled={deleteMutation.isPending}
            >
              Cancel
            </Button>
            <HoldToDeleteButton
              onTrigger={() => {
                if (deleteOrder) {
                  deleteMutation.mutate(deleteOrder.id);
                }
              }}
              isPending={deleteMutation.isPending}
              label="Delete Order"
              pendingLabel="Deleting Order..."
            />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
