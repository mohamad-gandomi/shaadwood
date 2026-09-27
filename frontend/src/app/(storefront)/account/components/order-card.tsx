'use client';

import * as React from 'react';
import Link from 'next/link';
import { Package, Truck, Clock, CheckCircle2, ChevronRight, ExternalLink } from 'lucide-react';
import { Order } from '@/types';

interface OrderCardProps {
  order: Order;
}

export function OrderCard({ order }: OrderCardProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" />
            Delivered
          </span>
        );
      case 'SHIPPED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <Truck className="w-3 h-3" />
            In Transit / Shipped
          </span>
        );
      case 'PROCESSING':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3 h-3" />
            Crafting & Processing
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-red-50 text-red-700 border border-red-200">
            Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-zen-100 text-foreground/80 border border-border">
            <Clock className="w-3 h-3" />
            Order Received
          </span>
        );
    }
  };

  const formattedDate = new Date(order.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="p-5 sm:p-6 rounded-3xl bg-white border border-border/70 shadow-2xs space-y-4 hover:border-shaad-300 transition-colors">
      {/* Header Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-shaad-50 border border-shaad-200/80 flex items-center justify-center text-shaad-800">
            <Package className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-sm text-foreground">
                {order.orderNumber}
              </span>
              <span className="text-[11px] text-muted-foreground font-mono">
                &middot; {formattedDate}
              </span>
            </div>
            <span className="text-xs text-muted-foreground block">
              {order.shippingMethod || 'Standard Delivery'} &middot; {order.shippingCarrier || 'Freight Carrier'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {getStatusBadge(order.status)}
          <Link
            href={`/checkout/success/${order.id}`}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-shaad-800 hover:bg-zen-100 transition-colors"
            title="View Commission Receipt"
          >
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Items Summary */}
      <div className="space-y-2.5">
        {order.items?.map((item) => (
          <div key={item.id} className="flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-lg bg-zen-100 border border-border/60 overflow-hidden shrink-0">
                {item.productImage ? (
                  <img
                    src={item.productImage}
                    alt={item.productName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground font-mono text-[10px]">
                    WOOD
                  </div>
                )}
              </div>
              <div className="truncate">
                <span className="font-medium text-foreground block truncate">
                  {item.productName}
                </span>
                <span className="text-[11px] text-muted-foreground font-mono">
                  Qty: {item.quantity} &times; ${Number(item.unitPrice).toLocaleString()}
                </span>
              </div>
            </div>

            <span className="font-mono font-semibold text-foreground shrink-0">
              ${Number(item.totalPrice).toLocaleString()}
            </span>
          </div>
        ))}
      </div>

      {/* Footer / Total & Tracking */}
      <div className="pt-3 border-t border-border/50 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          {order.trackingNumber ? (
            <span className="inline-flex items-center gap-1.5 font-mono text-shaad-800 bg-shaad-50 px-2.5 py-1 rounded-lg border border-shaad-200">
              <Truck className="w-3.5 h-3.5" />
              <span>Tracking: {order.trackingNumber}</span>
            </span>
          ) : (
            <span className="text-muted-foreground text-[11px]">
              Tracking will update once freight carrier is assigned.
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 font-mono">
          <span className="text-muted-foreground text-xs">Total:</span>
          <span className="font-bold text-base text-foreground">
            ${Number(order.totalAmount).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}
