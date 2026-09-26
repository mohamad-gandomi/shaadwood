'use client';

import * as React from 'react';
import { Tag, Check, X, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { api } from '@/lib/api';
import { ValidatedCoupon } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';

interface CartCouponFormProps {
  cartSubtotal: number;
  appliedCoupon: ValidatedCoupon | null;
  discountAmount: number;
  onApplyCoupon: (coupon: ValidatedCoupon, discountAmount: number) => void;
  onRemoveCoupon: () => void;
}

export function CartCouponForm({
  cartSubtotal,
  appliedCoupon,
  discountAmount,
  onApplyCoupon,
  onRemoveCoupon,
}: CartCouponFormProps) {
  const [code, setCode] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await api.validateCoupon(code.trim(), cartSubtotal);
      if (res && res.valid) {
        onApplyCoupon(res.coupon, res.discountAmount);
        setCode('');
        toast.success(`Coupon "${res.coupon.code}" applied! You saved ${formatCurrency(res.discountAmount)}.`);
      } else {
        setErrorMsg('Invalid or expired coupon code');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to apply coupon');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3 p-4 sm:p-5 rounded-2xl bg-white border border-border/60 shadow-2xs">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        <Tag className="w-3.5 h-3.5 text-shaad-800" />
        <span>Studio Atelier Privilege Code</span>
      </div>

      {appliedCoupon ? (
        <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-200">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center">
              <Check className="w-3 h-3" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-xs text-emerald-900 uppercase">
                  {appliedCoupon.code}
                </span>
                <span className="text-[11px] text-emerald-700">
                  (-{formatCurrency(discountAmount)})
                </span>
              </div>
              <p className="text-[10px] text-emerald-700">Privilege applied to order</p>
            </div>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onRemoveCoupon}
            className="h-7 px-2 text-xs text-emerald-900 hover:text-destructive hover:bg-emerald-100"
          >
            <X className="w-3.5 h-3.5 mr-1" />
            Remove
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-2">
          <div className="flex gap-2">
            <Input
              value={code}
              onChange={(e) => {
                setCode(e.target.value.toUpperCase());
                if (errorMsg) setErrorMsg(null);
              }}
              placeholder="Enter promo code (e.g. WOODCRAFT15)"
              className="h-10 text-xs uppercase font-mono bg-zen-50 border-border/70"
            />
            <Button
              type="submit"
              disabled={loading || !code.trim()}
              className="h-10 px-4 text-xs font-semibold bg-shaad-800 hover:bg-shaad-900 text-white shrink-0"
            >
              {loading ? 'Checking...' : 'Apply'}
            </Button>
          </div>

          {errorMsg && (
            <p className="text-xs text-destructive flex items-center gap-1.5 pt-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errorMsg}</span>
            </p>
          )}
        </form>
      )}
    </div>
  );
}
