'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ArrowLeft,
  Truck,
  CreditCard,
  Package,
  Calendar,
  User,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  RotateCcw,
  AlertTriangle,
  ExternalLink,
  Save,
  Tag,
  Receipt,
  ShieldCheck,
  Building,
  Trash2,
  Info,
  Layers,
  Image as ImageIcon,
} from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { Header } from '@/components/admin/header';
import { HoldToDeleteButton } from '@/components/admin/hold-to-delete-button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
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
import { OrderStatus, PaymentStatus, TransactionStatus } from '@/types';

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const orderId = params.id as string;

  const [activeTab, setActiveTab] = React.useState('overview');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);

  // Editable fields state
  const [status, setStatus] = React.useState<OrderStatus>('PENDING');
  const [paymentStatus, setPaymentStatus] = React.useState<PaymentStatus>('PENDING');
  const [carrier, setCarrier] = React.useState('');
  const [trackingNumber, setTrackingNumber] = React.useState('');
  const [trackingUrl, setTrackingUrl] = React.useState('');
  const [internalNotes, setInternalNotes] = React.useState('');

  const { data: order, isLoading } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => api.getOrder(orderId),
    enabled: !!orderId,
  });

  React.useEffect(() => {
    if (order) {
      setStatus(order.status);
      setPaymentStatus(order.paymentStatus);
      setCarrier(order.shippingCarrier || '');
      setTrackingNumber(order.trackingNumber || '');
      setTrackingUrl(order.trackingUrl || '');
      setInternalNotes(order.internalNotes || '');
    }
  }, [order]);

  const updateOrderMutation = useMutation({
    mutationFn: (payload: any) => api.updateOrder(orderId, payload),
    onSuccess: () => {
      toast.success('Order details updated successfully');
      queryClient.invalidateQueries({ queryKey: ['order', orderId] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['order-stats'] });
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to update order');
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: (newStatus: OrderStatus) => api.updateOrderStatus(orderId, newStatus),
    onSuccess: () => {
      toast.success('Order status updated');
      queryClient.invalidateQueries({ queryKey: ['order', orderId] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['order-stats'] });
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to update order status');
    },
  });

  const deleteOrderMutation = useMutation({
    mutationFn: () => api.deleteOrder(orderId),
    onSuccess: () => {
      toast.success('Order deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['order-stats'] });
      router.replace('/orders');
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to delete order');
    },
  });

  const handleSaveAll = () => {
    // If status changed, update status first or simultaneously
    if (order && status !== order.status) {
      updateStatusMutation.mutate(status);
    }
    updateOrderMutation.mutate({
      paymentStatus,
      shippingCarrier: carrier || undefined,
      trackingNumber: trackingNumber || undefined,
      trackingUrl: trackingUrl || undefined,
      internalNotes: internalNotes || undefined,
    });
  };

  if (isLoading || !order) {
    return (
      <div className="space-y-6">
        <Header title="Order Details" />
        <div className="p-12 text-center text-muted-foreground text-sm">
          Loading order details...
        </div>
      </div>
    );
  }

  const getStatusBadge = (s: OrderStatus) => {
    switch (s) {
      case 'PENDING':
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-300">
            Pending
          </Badge>
        );
      case 'PROCESSING':
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-300">
            Processing
          </Badge>
        );
      case 'SHIPPED':
        return (
          <Badge variant="outline" className="bg-purple-50 text-purple-800 border-purple-300">
            Shipped
          </Badge>
        );
      case 'DELIVERED':
        return (
          <Badge variant="outline" className="bg-emerald-50 text-emerald-800 border-emerald-300">
            Delivered
          </Badge>
        );
      case 'CANCELLED':
        return (
          <Badge variant="outline" className="bg-zinc-100 text-zinc-700 border-zinc-300">
            Cancelled
          </Badge>
        );
      case 'REFUNDED':
        return (
          <Badge variant="outline" className="bg-rose-50 text-rose-800 border-rose-300">
            Refunded
          </Badge>
        );
      default:
        return <Badge variant="outline">{s}</Badge>;
    }
  };

  const getTxStatusBadge = (txStatus: TransactionStatus) => {
    switch (txStatus) {
      case 'SUCCESS':
        return (
          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-300 font-semibold text-[11px]">
            SUCCESS
          </Badge>
        );
      case 'FAILED':
        return (
          <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-300 font-semibold text-[11px]">
            FAILED
          </Badge>
        );
      case 'REFUNDED':
        return (
          <Badge variant="outline" className="bg-zinc-100 text-zinc-700 border-zinc-300 font-semibold text-[11px]">
            REFUNDED
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-300 font-semibold text-[11px]">
            PENDING
          </Badge>
        );
    }
  };

  const isIranianGateway =
    order.paymentMethod?.toUpperCase().includes('ZARINPAL') ||
    order.paymentMethod?.toUpperCase().includes('MELLAT') ||
    order.paymentMethod?.toUpperCase().includes('SAMAN');

  return (
    <div className="space-y-6 pb-20">
      {/* 1. Global Header Component */}
      <Header title="Order Details" />

      {/* 2. Main Page Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-6">
        {/* Streamlined Order Header (Matching Product Details Header) */}
        <div className="p-3.5 sm:p-5 rounded-xl border border-border bg-card shadow-xs space-y-3">
          {/* Top row: Back link + Action Buttons */}
          <div className="flex items-center justify-between gap-2">
            <Link
              href="/orders"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
              <span>Back to Orders</span>
            </Link>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 text-xs h-8 sm:h-9 px-2.5 sm:px-3 gap-1.5"
                onClick={() => setIsDeleteDialogOpen(true)}
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Delete Order</span>
                <span className="sm:hidden">Delete</span>
              </Button>
              <Button
                size="sm"
                onClick={handleSaveAll}
                disabled={updateOrderMutation.isPending || updateStatusMutation.isPending}
                className="gap-1.5 text-xs h-8 sm:h-9 px-3 sm:px-4 shadow-xs font-semibold"
              >
                <Save className="w-3.5 h-3.5" />
                {updateOrderMutation.isPending || updateStatusMutation.isPending
                  ? 'Saving...'
                  : 'Save Changes'}
              </Button>
            </div>
          </div>

          {/* Bottom row: Order Number, Status Badges, and Customer Info */}
          <div className="pt-2.5 border-t border-border/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
            <div className="flex flex-wrap items-center gap-2 min-w-0">
              <h1 className="text-base sm:text-xl font-bold font-mono text-foreground tracking-tight">
                {order.orderNumber}
              </h1>
              {getStatusBadge(order.status)}
              <Badge
                variant={order.paymentStatus === 'PAID' ? 'default' : 'secondary'}
                className="text-[10px] px-2 py-0.5"
              >
                {order.paymentStatus}
              </Badge>
              {order.shippingCarrier && (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full">
                  <Truck className="w-3 h-3" />
                  {order.shippingCarrier}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 text-[11px] text-muted-foreground shrink-0">
              <span>Customer: <strong className="text-foreground">{order.customerName}</strong></span>
              <span>•</span>
              <span className="font-mono">{formatDate(order.createdAt)}</span>
              <span>•</span>
              <span className="font-semibold text-foreground">
                {isIranianGateway ? 'زرین‌پال / شاپرک' : order.paymentMethod}
              </span>
            </div>
          </div>
        </div>

        {/* Segmented Tabs (Matching Product Details Tabs Style) */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-2 sm:grid-cols-4 w-full h-auto p-1.5 bg-muted/80 rounded-xl border border-border gap-1">
            <TabsTrigger value="overview" className="gap-2 py-2 text-xs font-semibold rounded-lg">
              <Package className="w-3.5 h-3.5 shrink-0" />
              <span>Overview & Items</span>
            </TabsTrigger>
            <TabsTrigger value="shipping" className="gap-2 py-2 text-xs font-semibold rounded-lg">
              <Truck className="w-3.5 h-3.5 shrink-0" />
              <span>Shipping & Logistics</span>
            </TabsTrigger>
            <TabsTrigger value="payments" className="gap-2 py-2 text-xs font-semibold rounded-lg">
              <CreditCard className="w-3.5 h-3.5 shrink-0" />
              <span>Payment & Ledger</span>
            </TabsTrigger>
            <TabsTrigger value="timeline" className="gap-2 py-2 text-xs font-semibold rounded-lg">
              <Clock className="w-3.5 h-3.5 shrink-0" />
              <span>Timeline & Notes</span>
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: OVERVIEW & ITEMS */}
          <TabsContent value="overview" className="space-y-6 m-0">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left 2 Cols: Purchased Items */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader className="pb-3 border-b border-border/50">
                    <CardTitle className="text-base font-semibold flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-primary" />
                        <span>Purchased Items ({order.items?.length || 0})</span>
                      </div>
                      <span className="text-xs font-mono text-muted-foreground font-normal">
                        Subtotal: {formatCurrency(order.subtotal)}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  {/* 1. Mobile Cards View */}
                  <div className="p-3 space-y-3 md:hidden">
                    {order.items?.map((item) => (
                      <div
                        key={item.id}
                        className="p-3 rounded-xl border border-border/70 bg-card/60 space-y-2.5 shadow-2xs"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-14 h-14 rounded-lg bg-muted border border-border/80 overflow-hidden shrink-0 flex items-center justify-center">
                            {item.productImage ? (
                              <img
                                src={item.productImage}
                                alt={item.productName}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <ImageIcon className="w-5 h-5 text-muted-foreground/50" />
                            )}
                          </div>

                          <div className="flex-1 min-w-0 space-y-1">
                            <h4 className="font-semibold text-sm text-foreground leading-snug">
                              {item.productName}
                            </h4>
                            {item.variantName && (
                              <p className="text-xs text-muted-foreground leading-snug">
                                {item.variantName}
                              </p>
                            )}
                            {item.productSku && (
                              <span className="text-[11px] font-mono text-muted-foreground block">
                                SKU: {item.productSku}
                              </span>
                            )}
                          </div>
                        </div>

                        {item.selectedAttributes && Object.keys(item.selectedAttributes).length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-1 border-t border-border/40">
                            {Object.entries(item.selectedAttributes).map(([k, v]) => (
                              <span
                                key={k}
                                className="inline-flex items-center text-[10px] px-2 py-0.5 rounded-md bg-muted/80 font-medium text-muted-foreground"
                              >
                                <span className="opacity-75">{k}:</span> <strong className="ml-1 text-foreground">{v}</strong>
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-2 border-t border-border/50 text-xs">
                          <div className="text-muted-foreground">
                            <span>{formatCurrency(item.unitPrice)}</span>
                            <span className="mx-1">×</span>
                            <span className="font-semibold text-foreground">{item.quantity}</span>
                          </div>
                          <div className="font-bold text-sm text-primary font-mono">
                            {formatCurrency(item.totalPrice)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* 2. Desktop Table View */}
                  <div className="hidden md:block overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[320px]">Item & Specifications</TableHead>
                          <TableHead className="text-center">SKU</TableHead>
                          <TableHead className="text-right">Unit Price</TableHead>
                          <TableHead className="text-center">Qty</TableHead>
                          <TableHead className="text-right">Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {order.items?.map((item) => (
                          <TableRow key={item.id} className="hover:bg-muted/40">
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-lg bg-muted border border-border/80 overflow-hidden shrink-0 flex items-center justify-center">
                                  {item.productImage ? (
                                    <img
                                      src={item.productImage}
                                      alt={item.productName}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <ImageIcon className="w-5 h-5 text-muted-foreground/50" />
                                  )}
                                </div>
                                <div className="space-y-0.5 min-w-0">
                                  <div className="font-semibold text-sm text-foreground truncate">
                                    {item.productName}
                                  </div>
                                  {item.variantName && (
                                    <div className="text-xs text-muted-foreground">
                                      {item.variantName}
                                    </div>
                                  )}
                                  {item.selectedAttributes && (
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      {Object.entries(item.selectedAttributes).map(([k, v]) => (
                                        <span
                                          key={k}
                                          className="inline-flex items-center text-[10px] px-1.5 py-0.5 rounded bg-muted font-medium text-muted-foreground"
                                        >
                                          {k}: {v}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </TableCell>

                            <TableCell className="text-center font-mono text-xs text-muted-foreground">
                              {item.productSku || '-'}
                            </TableCell>

                            <TableCell className="text-right font-medium text-xs">
                              {formatCurrency(item.unitPrice)}
                            </TableCell>

                            <TableCell className="text-center font-semibold text-xs">
                              {item.quantity}
                            </TableCell>

                            <TableCell className="text-right font-bold text-foreground text-sm">
                              {formatCurrency(item.totalPrice)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </Card>
              </div>

              {/* Right 1 Col: Financial Breakdown & Status Controls */}
              <div className="space-y-6">
                {/* Status Selector Card */}
                <Card>
                  <CardHeader className="pb-3 border-b border-border/50">
                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-primary" />
                      <span>Fulfillment Status</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 space-y-4 text-xs">
                    <div>
                      <label className="text-muted-foreground block mb-1.5 font-medium">
                        Order Lifecycle Status
                      </label>
                      <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value as OrderStatus)}
                        className="w-full text-xs font-semibold h-9 rounded-md border border-border bg-background px-3 focus:outline-none focus:ring-1 focus:ring-primary"
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="PROCESSING">PROCESSING</option>
                        <option value="SHIPPED">SHIPPED</option>
                        <option value="DELIVERED">DELIVERED</option>
                        <option value="CANCELLED">CANCELLED</option>
                        <option value="REFUNDED">REFUNDED</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-muted-foreground block mb-1.5 font-medium">
                        Payment Status
                      </label>
                      <select
                        value={paymentStatus}
                        onChange={(e) => setPaymentStatus(e.target.value as PaymentStatus)}
                        className="w-full text-xs font-semibold h-9 rounded-md border border-border bg-background px-3 focus:outline-none focus:ring-1 focus:ring-primary"
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="PAID">PAID</option>
                        <option value="FAILED">FAILED</option>
                        <option value="REFUNDED">REFUNDED</option>
                        <option value="PARTIALLY_REFUNDED">PARTIALLY_REFUNDED</option>
                      </select>
                    </div>

                    <Button
                      size="sm"
                      onClick={handleSaveAll}
                      disabled={updateOrderMutation.isPending || updateStatusMutation.isPending}
                      className="w-full gap-1.5 font-semibold text-xs shadow-xs"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Update Status</span>
                    </Button>
                  </CardContent>
                </Card>

                {/* Financial Summary Card */}
                <Card>
                  <CardHeader className="pb-3 border-b border-border/50">
                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                      <Receipt className="w-4 h-4 text-primary" />
                      <span>Order Financials</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 space-y-3 text-xs">
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span>Items Subtotal</span>
                      <span className="font-mono text-foreground">{formatCurrency(order.subtotal)}</span>
                    </div>

                    {Number(order.discountAmount) > 0 && (
                      <div className="flex items-center justify-between text-emerald-700 font-medium">
                        <span className="flex items-center gap-1">
                          <Tag className="w-3.5 h-3.5" />
                          Coupon Discount {order.couponCode && `(${order.couponCode})`}
                        </span>
                        <span className="font-mono">-{formatCurrency(order.discountAmount)}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-muted-foreground">
                      <span>Shipping & Freight</span>
                      <span className="font-mono text-foreground">
                        {Number(order.shippingAmount) > 0
                          ? formatCurrency(order.shippingAmount)
                          : 'Free'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-muted-foreground">
                      <span>Estimated Taxes</span>
                      <span className="font-mono text-foreground">{formatCurrency(order.taxAmount)}</span>
                    </div>

                    <div className="border-t border-border pt-3 flex items-center justify-between font-bold text-sm text-foreground">
                      <span>Grand Total</span>
                      <span className="font-mono text-base text-primary">
                        {formatCurrency(order.totalAmount)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* TAB 2: SHIPPING & LOGISTICS */}
          <TabsContent value="shipping" className="space-y-6 m-0">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left 2 Cols: Logistics Form */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader className="pb-3 border-b border-border/50">
                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                      <Truck className="w-4 h-4 text-primary" />
                      <span>Fulfillment & Dispatch Logistics</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-5 space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="font-semibold text-foreground">
                          Shipping Carrier / Courier
                        </label>
                        <Input
                          placeholder="e.g. Tipax, Chapar, FedEx Freight, Old Dominion"
                          value={carrier}
                          onChange={(e) => setCarrier(e.target.value)}
                          className="h-9"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="font-semibold text-foreground">Tracking Number</label>
                        <Input
                          placeholder="e.g. TPX-99823104 or FX-9128310"
                          value={trackingNumber}
                          onChange={(e) => setTrackingNumber(e.target.value)}
                          className="h-9 font-mono"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-semibold text-foreground">Carrier Tracking URL</label>
                      <div className="flex items-center gap-2">
                        <Input
                          placeholder="https://carrier.com/track?id=..."
                          value={trackingUrl}
                          onChange={(e) => setTrackingUrl(e.target.value)}
                          className="h-9 font-mono flex-1"
                        />
                        {trackingUrl && (
                          <a
                            href={trackingUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-xs px-3 h-9 rounded-md bg-muted hover:bg-muted/80 text-foreground font-medium transition-colors shrink-0"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>Test Link</span>
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-semibold text-foreground">
                        Internal Workshop & Crating Notes
                      </label>
                      <textarea
                        rows={3}
                        value={internalNotes}
                        onChange={(e) => setInternalNotes(e.target.value)}
                        placeholder="Wood crating specifications, freight handling instructions, inspection notes..."
                        className="w-full text-xs p-3 rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>

                    <div className="flex justify-end pt-2">
                      <Button
                        size="sm"
                        onClick={handleSaveAll}
                        disabled={updateOrderMutation.isPending}
                        className="gap-1.5 font-semibold text-xs shadow-xs"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Save Logistics Info</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right 1 Col: Customer & Destination Address */}
              <div className="space-y-6">
                <Card>
                  <CardHeader className="pb-3 border-b border-border/50">
                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span>Delivery Destination</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 space-y-3 text-xs">
                    <div>
                      <div className="font-semibold text-foreground text-sm">
                        {order.customerName}
                      </div>
                      <div className="text-muted-foreground">{order.customerEmail}</div>
                      {order.customerPhone && (
                        <div className="text-muted-foreground font-mono">{order.customerPhone}</div>
                      )}
                    </div>

                    <div className="border-t border-border pt-3">
                      <div className="font-semibold text-foreground mb-1">Shipping Address</div>
                      {order.shippingAddress ? (
                        <div className="text-muted-foreground leading-relaxed">
                          <div className="font-medium text-foreground">
                            {order.shippingAddress.recipientName}
                          </div>
                          <div>{order.shippingAddress.street}</div>
                          <div>
                            {order.shippingAddress.city}, {order.shippingAddress.province}{' '}
                            {order.shippingAddress.postalCode}
                          </div>
                          <div>{order.shippingAddress.country || 'United States'}</div>
                          {order.shippingAddress.phone && (
                            <div className="mt-1 font-mono text-foreground font-medium">
                              Tel: {order.shippingAddress.phone}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted-foreground italic">No address provided</span>
                      )}
                    </div>

                    {order.customerNotes && (
                      <div className="border-t border-border pt-3">
                        <span className="font-semibold text-foreground block mb-1">
                          Delivery Instructions:
                        </span>
                        <p className="text-muted-foreground italic bg-muted/40 p-2.5 rounded-lg border border-border/50">
                          &ldquo;{order.customerNotes}&rdquo;
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* TAB 3: PAYMENTS & LEDGER */}
          <TabsContent value="payments" className="space-y-6 m-0">
            <Card>
              <CardHeader className="pb-3 border-b border-border/50">
                <CardTitle className="text-base font-semibold flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-primary" />
                    <span>Transaction History</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {order.transactions?.length || 0} Attempt{(order.transactions?.length || 0) === 1 ? '' : 's'}
                  </Badge>
                </CardTitle>
              </CardHeader>
                {/* 1. Mobile Cards View */}
                <div className="p-3 space-y-3 md:hidden">
                  {!order.transactions || order.transactions.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground text-xs">
                      No transactions recorded for this order yet.
                    </div>
                  ) : (
                    order.transactions.map((tx) => (
                      <div
                        key={tx.id}
                        className="p-3.5 rounded-xl border border-border/70 bg-card/60 space-y-3 shadow-2xs"
                      >
                        {/* Header: Gateway Name + Status Badge */}
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="font-semibold text-sm text-foreground">
                              {tx.gateway.includes('ZARINPAL')
                                ? 'زرین‌پال (Zarinpal Shaparak)'
                                : tx.gateway.includes('MELLAT')
                                ? 'به‌پرداخت ملت (Mellat)'
                                : tx.gateway.includes('SAMAN')
                                ? 'سامان کیش (Saman SEP)'
                                : tx.gateway}
                            </div>
                            <div className="text-[11px] font-mono text-muted-foreground mt-0.5">
                              {formatDate(tx.createdAt)}
                            </div>
                          </div>
                          <div>{getTxStatusBadge(tx.status)}</div>
                        </div>

                        {/* Amount */}
                        <div className="flex items-baseline justify-between pt-2 border-t border-border/50">
                          <span className="text-xs text-muted-foreground font-medium">
                            Transaction Amount:
                          </span>
                          <span className="font-bold text-base text-foreground font-mono">
                            {formatCurrency(tx.amount)}
                          </span>
                        </div>

                        {/* Details */}
                        <div className="space-y-1.5 pt-2 border-t border-border/40 text-xs font-mono">
                          {tx.transactionId && (
                            <div className="flex items-center justify-between text-muted-foreground gap-2">
                              <span className="font-sans text-[11px] shrink-0">Authority / Token:</span>
                              <span className="text-foreground truncate max-w-[170px]">{tx.transactionId}</span>
                            </div>
                          )}

                          {tx.trackingCode && (
                            <div className="flex items-center justify-between text-muted-foreground gap-2">
                              <span className="font-sans text-[11px] shrink-0">Tracking / RRN:</span>
                              <span className="text-foreground font-semibold">{tx.trackingCode}</span>
                            </div>
                          )}

                          {tx.cardPan && (
                            <div className="flex items-center justify-between text-muted-foreground gap-2">
                              <span className="font-sans text-[11px] shrink-0">Card Mask:</span>
                              <span className="text-foreground">{tx.cardPan}</span>
                            </div>
                          )}
                        </div>

                        {tx.errorMessage && (
                          <div className="p-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs">
                            {tx.errorMessage}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>

                {/* 2. Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Gateway</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Authority / Transaction ID</TableHead>
                        <TableHead>Shaparak RRN / Tracking</TableHead>
                        <TableHead>Card Mask</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead className="text-right">Timestamp</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {!order.transactions || order.transactions.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="h-32 text-center text-muted-foreground text-xs">
                            No transactions recorded for this order yet.
                          </TableCell>
                        </TableRow>
                      ) : (
                        order.transactions.map((tx) => (
                          <TableRow key={tx.id} className="text-xs hover:bg-muted/40">
                            <TableCell className="font-semibold text-foreground">
                              {tx.gateway.includes('ZARINPAL')
                                ? 'زرین‌پال (Zarinpal Shaparak)'
                                : tx.gateway.includes('MELLAT')
                                ? 'به‌پرداخت ملت (Mellat)'
                                : tx.gateway.includes('SAMAN')
                                ? 'سامان کیش (Saman SEP)'
                                : tx.gateway}
                            </TableCell>

                            <TableCell>{getTxStatusBadge(tx.status)}</TableCell>

                            <TableCell className="font-mono text-muted-foreground">
                              {tx.transactionId || '-'}
                            </TableCell>

                            <TableCell className="font-mono text-foreground font-medium">
                              {tx.trackingCode || '-'}
                            </TableCell>

                            <TableCell className="font-mono text-muted-foreground">
                              {tx.cardPan || '-'}
                            </TableCell>

                            <TableCell className="text-right font-bold text-foreground">
                              {formatCurrency(tx.amount)}
                            </TableCell>

                            <TableCell className="text-right text-muted-foreground whitespace-nowrap font-mono">
                              {formatDate(tx.createdAt)}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
            </Card>
          </TabsContent>

          {/* TAB 4: TIMELINE & AUDIT */}
          <TabsContent value="timeline" className="space-y-6 m-0">
            <Card>
              <CardHeader className="pb-3 border-b border-border/50">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  <span>Order Audit Log & Timeline</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6 max-w-2xl">
                  {order.timeline?.map((event, index) => (
                    <div key={event.id} className="relative flex gap-4 text-xs">
                      {index !== order.timeline.length - 1 && (
                        <span className="absolute left-[11px] top-6 w-0.5 h-[calc(100%+12px)] bg-border" />
                      )}
                      <div className="w-6 h-6 rounded-full bg-primary/10 border border-primary/30 text-primary flex items-center justify-center shrink-0 z-10 shadow-xs">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1 space-y-1 pb-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-bold text-sm text-foreground">
                            {event.status}
                          </span>
                          <span className="text-[11px] text-muted-foreground font-mono">
                            {formatDate(event.createdAt)}
                          </span>
                        </div>
                        {event.note && (
                          <p className="text-muted-foreground leading-relaxed bg-muted/30 p-2.5 rounded-lg border border-border/50">
                            {event.note}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Delete Confirmation Dialog (Matching Product Delete Modal) */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="w-10 h-10 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mb-2">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <DialogTitle>Delete Order</DialogTitle>
            <DialogDescription>
              Are you sure you want to permanently delete order{' '}
              <strong className="text-foreground font-mono">{order.orderNumber}</strong>? This action
              cannot be undone and will delete all associated transactions, items, and tracking logs.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={deleteOrderMutation.isPending}
            >
              Cancel
            </Button>
            <HoldToDeleteButton
              onTrigger={() => deleteOrderMutation.mutate()}
              isPending={deleteOrderMutation.isPending}
              label="Delete Order"
              pendingLabel="Deleting Order..."
            />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
