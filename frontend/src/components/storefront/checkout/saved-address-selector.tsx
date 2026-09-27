'use client';

import * as React from 'react';
import { MapPin, Home, Briefcase, CheckCircle2, Circle } from 'lucide-react';
import { Address } from '@/types';
import { CheckoutShippingData } from './checkout-shipping-form';

interface SavedAddressSelectorProps {
  addresses: Address[];
  currentShipping: CheckoutShippingData;
  onSelectAddress: (address: Address) => void;
}

export function SavedAddressSelector({
  addresses,
  currentShipping,
  onSelectAddress,
}: SavedAddressSelectorProps) {
  if (!addresses || addresses.length === 0) return null;

  return (
    <div className="space-y-3 p-4 rounded-2xl bg-zen-50/80 border border-border/80">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-shaad-800" />
            <span>Saved Delivery Addresses</span>
          </h4>
          <p className="text-[11px] text-muted-foreground">
            Select a saved address to instantly populate your destination details.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        {addresses.map((addr) => {
          const isSelected =
            currentShipping.street === addr.street &&
            currentShipping.postalCode === addr.postalCode &&
            currentShipping.city === addr.city;

          const titleLower = (addr.title || '').toLowerCase();
          const IconComponent = titleLower.includes('home')
            ? Home
            : titleLower.includes('office') || titleLower.includes('work')
              ? Briefcase
              : MapPin;

          return (
            <button
              key={addr.id}
              type="button"
              onClick={() => onSelectAddress(addr)}
              className={`p-3.5 rounded-xl text-left transition-all border flex flex-col justify-between gap-2.5 cursor-pointer text-xs relative group ${
                isSelected
                  ? 'border-shaad-800 bg-white ring-2 ring-shaad-800/15 shadow-xs'
                  : 'border-border/80 bg-white hover:border-shaad-600 hover:shadow-2xs'
              }`}
            >
              {/* Header: Title, Default Tag, Radio Indicator */}
              <div className="flex items-center justify-between gap-2 w-full">
                <div className="flex items-center gap-1.5 font-semibold text-foreground">
                  <IconComponent className={`w-3.5 h-3.5 ${isSelected ? 'text-shaad-800' : 'text-muted-foreground'}`} />
                  <span className="truncate max-w-[120px]">{addr.title || 'Address'}</span>
                  {addr.isDefaultShipping && (
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                      Default
                    </span>
                  )}
                </div>

                <div className="shrink-0">
                  {isSelected ? (
                    <CheckCircle2 className="w-4 h-4 text-shaad-800 fill-shaad-800/10" />
                  ) : (
                    <Circle className="w-4 h-4 text-muted-foreground/40 group-hover:text-shaad-600" />
                  )}
                </div>
              </div>

              {/* Body: Recipient & Address Line */}
              <div className="space-y-1 w-full text-[11px] leading-relaxed">
                <div className="font-medium text-foreground/90 truncate">
                  {addr.recipientName} &middot; <span className="font-mono text-muted-foreground">{addr.phone}</span>
                </div>
                <div className="text-muted-foreground line-clamp-2">
                  {addr.street}, {addr.city}, {addr.province}
                </div>
                <div className="text-muted-foreground font-mono text-[10px] pt-0.5">
                  Postal: {addr.postalCode}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
