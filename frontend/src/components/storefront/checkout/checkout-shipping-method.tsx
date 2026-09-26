'use client';

import * as React from 'react';
import { Truck, CheckCircle2, ShieldCheck, Clock, Store } from 'lucide-react';
import { ShippingMethodOption } from '@/types';

interface CheckoutShippingMethodProps {
  methods: ShippingMethodOption[];
  selectedMethodId: string;
  onSelect: (method: ShippingMethodOption) => void;
}

export function CheckoutShippingMethod({
  methods,
  selectedMethodId,
  onSelect,
}: CheckoutShippingMethodProps) {
  return (
    <div className="p-6 rounded-3xl bg-white border border-border/70 shadow-2xs space-y-4">
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-shaad-800 text-white text-xs font-mono font-bold flex items-center justify-center">
            3
          </span>
          <h3 className="font-serif font-bold text-base text-foreground">
            Shipping & Delivery Method
          </h3>
        </div>
        <span className="text-[11px] text-muted-foreground font-mono">Specialized Logistics</span>
      </div>

      <div className="space-y-3">
        {methods.map((method) => {
          const isSelected = selectedMethodId === method.id;

          return (
            <div
              key={method.id}
              onClick={() => onSelect(method)}
              className={`group relative flex items-start gap-4 p-4 rounded-2xl border cursor-pointer transition-all ${
                isSelected
                  ? 'border-shaad-800 bg-shaad-50/40 ring-1 ring-shaad-800'
                  : 'border-border/70 bg-zen-50/50 hover:border-shaad-300 hover:bg-zen-50'
              }`}
            >
              <div className="pt-0.5 shrink-0">
                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                    isSelected ? 'border-shaad-800 bg-shaad-800 text-white' : 'border-border bg-white'
                  }`}
                >
                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm text-foreground">{method.name}</span>
                    {method.id === 'white-glove-freight' && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-shaad-100 text-shaad-900 border border-shaad-200">
                        Signature
                      </span>
                    )}
                  </div>
                  <span className="font-mono font-bold text-sm text-foreground">
                    {method.price === 0 ? (
                      <span className="text-emerald-700">Free</span>
                    ) : (
                      `$${method.price.toFixed(2)}`
                    )}
                  </span>
                </div>

                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  {method.description}
                </p>

                <div className="flex items-center gap-4 mt-2.5 text-[11px] text-muted-foreground font-mono">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-shaad-700" />
                    {method.estimatedDays}
                  </span>
                  <span className="flex items-center gap-1">
                    {method.id === 'local-workshop-pickup' ? (
                      <Store className="w-3.5 h-3.5 text-shaad-700" />
                    ) : (
                      <Truck className="w-3.5 h-3.5 text-shaad-700" />
                    )}
                    {method.carrier}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
