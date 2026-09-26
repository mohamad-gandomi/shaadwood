'use client';

import * as React from 'react';
import { CreditCard, Landmark, CheckCircle2, ShieldCheck, Wallet, Banknote } from 'lucide-react';
import { PaymentGatewayOption } from '@/types';

interface CheckoutPaymentMethodProps {
  gateways: PaymentGatewayOption[];
  selectedGatewayId: string;
  onSelect: (gatewayId: string) => void;
}

export function CheckoutPaymentMethod({
  gateways,
  selectedGatewayId,
  onSelect,
}: CheckoutPaymentMethodProps) {
  const getGatewayIcon = (type: string, id: string) => {
    if (type === 'IRANIAN_SHAPARAK') {
      return <CreditCard className="w-4 h-4 text-amber-700" />;
    }
    if (type === 'INTERNATIONAL_CARD') {
      return <CreditCard className="w-4 h-4 text-blue-700" />;
    }
    if (id === 'BANK_TRANSFER') {
      return <Landmark className="w-4 h-4 text-emerald-700" />;
    }
    return <Banknote className="w-4 h-4 text-shaad-800" />;
  };

  const getGatewayBadge = (type: string) => {
    switch (type) {
      case 'IRANIAN_SHAPARAK':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wider bg-amber-50 text-amber-800 border border-amber-200">
            شتاب / شاپرک
          </span>
        );
      case 'INTERNATIONAL_CARD':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wider bg-blue-50 text-blue-800 border border-blue-200">
            Visa / Master / Stripe
          </span>
        );
      case 'OFFLINE':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wider bg-stone-100 text-stone-700 border border-stone-200">
            Offline / Wire
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6 rounded-3xl bg-white border border-border/70 shadow-2xs space-y-4">
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-shaad-800 text-white text-xs font-mono font-bold flex items-center justify-center">
            4
          </span>
          <h3 className="font-serif font-bold text-base text-foreground">
            Payment & Settlement Gateway
          </h3>
        </div>
        <span className="text-[11px] text-muted-foreground font-mono flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          Encrypted 256-Bit
        </span>
      </div>

      <div className="space-y-3">
        {gateways.map((gw) => {
          const isSelected = selectedGatewayId === gw.id;

          return (
            <div
              key={gw.id}
              onClick={() => onSelect(gw.id)}
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
                    <span className="p-1 rounded-lg bg-white border border-border/60">
                      {getGatewayIcon(gw.type, gw.id)}
                    </span>
                    <span className="font-medium text-sm text-foreground">{gw.name}</span>
                  </div>
                  {getGatewayBadge(gw.type)}
                </div>

                <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                  {gw.description}
                </p>

                {gw.currencies && gw.currencies.length > 0 && (
                  <div className="flex items-center gap-1.5 mt-2">
                    <span className="text-[10px] text-muted-foreground font-mono">Accepted:</span>
                    <div className="flex items-center gap-1">
                      {gw.currencies.map((c) => (
                        <span
                          key={c}
                          className="px-1.5 py-0.5 rounded text-[9px] font-mono font-medium bg-muted/60 text-muted-foreground"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
