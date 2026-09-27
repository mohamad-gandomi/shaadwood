'use client';

import * as React from 'react';
import { MapPin, Phone, User, Edit3, Trash2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Address } from '@/types';

interface AddressCardProps {
  address: Address;
  onEdit: (address: Address) => void;
  onDelete: (address: Address) => void;
  onSetDefault: (address: Address) => void;
}

export function AddressCard({
  address,
  onEdit,
  onDelete,
  onSetDefault,
}: AddressCardProps) {
  return (
    <div className="p-5 sm:p-6 rounded-3xl bg-white border border-border/70 shadow-2xs space-y-4 hover:border-shaad-300 transition-colors flex flex-col justify-between">
      <div className="space-y-3">
        {/* Title & Default Badges */}
        <div className="flex items-center justify-between gap-2 border-b border-border/60 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-shaad-50 border border-shaad-200/80 flex items-center justify-center text-shaad-800">
              <MapPin className="w-4 h-4" />
            </span>
            <span className="font-serif font-bold text-base text-foreground">
              {address.title || 'نشانی تحویل'}
            </span>
          </div>

          {address.isDefaultShipping ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 font-sans">
              <CheckCircle2 className="w-3 h-3" />
              پیش‌فرض ارسال
            </span>
          ) : (
            <button
              type="button"
              onClick={() => onSetDefault(address)}
              className="text-[11px] text-muted-foreground hover:text-shaad-800 transition-colors font-medium cursor-pointer font-sans"
            >
              انتخاب به‌عنوان پیش‌فرض
            </button>
          )}
        </div>

        {/* Recipient & Contact */}
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2 text-foreground font-semibold">
            <User className="w-3.5 h-3.5 text-shaad-800 shrink-0" />
            <span>{address.recipientName}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground font-sans">
            <Phone className="w-3.5 h-3.5 text-shaad-800 shrink-0" />
            <span>{address.phone}</span>
          </div>
        </div>

        {/* Address Location */}
        <div className="text-xs text-foreground/90 leading-relaxed bg-zen-50 p-3.5 rounded-2xl border border-border/60 space-y-1">
          <p className="font-medium text-foreground">{address.street}</p>
          <p className="text-muted-foreground text-[11px] font-sans">
            {address.province}، {address.city} &middot; کد پستی: {address.postalCode}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-2 flex items-center justify-end gap-2 border-t border-border/50">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onEdit(address)}
          className="rounded-xl text-xs gap-1.5 h-8 px-3 cursor-pointer"
        >
          <Edit3 className="w-3 h-3 text-shaad-800" />
          <span>ویرایش</span>
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onDelete(address)}
          className="rounded-xl text-xs gap-1.5 h-8 px-2.5 text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer"
        >
          <Trash2 className="w-3 h-3" />
          <span>حذف</span>
        </Button>
      </div>
    </div>
  );
}
