'use client';

import * as React from 'react';
import { Tag, Check, X } from 'lucide-react';
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
        toast.success(`کد تخفیف «${res.coupon.code}» اعمال شد! مبلغ ${formatCurrency(res.discountAmount)} از سفارش کسر گردید.`);
      } else {
        setErrorMsg('کد تخفیف واردشده نامعتبر یا منقضی شده است.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'خطا در اعتبارسنجی کد تخفیف');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3 p-4 sm:p-5 rounded-2xl bg-white border border-border/60 shadow-2xs text-right">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        <Tag className="w-3.5 h-3.5 text-shaad-800" />
        <span>کد تخفیف و امتیاز اختصاصی کارگاه</span>
      </div>

      {appliedCoupon ? (
        <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-200">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <Check className="w-3 h-3" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-sans font-bold text-xs text-emerald-900 uppercase">
                  {appliedCoupon.code}
                </span>
                <span className="text-[11px] text-emerald-700 font-sans">
                  (-{formatCurrency(discountAmount)})
                </span>
              </div>
              <p className="text-[10px] text-emerald-700">تخفیف اختصاصی روی سفارش شما اعمال شد</p>
            </div>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onRemoveCoupon}
            className="h-7 px-2 text-xs text-emerald-900 hover:text-destructive hover:bg-emerald-100"
          >
            <X className="w-3.5 h-3.5 ml-1" />
            حذف
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
              placeholder="کد تخفیف را وارد کنید (مثلاً SHAADWOOD)..."
              className="h-10 text-xs font-sans rounded-xl bg-zen-50 border-border/70 text-right focus-visible:ring-shaad-800"
            />
            <Button
              type="submit"
              disabled={loading || !code.trim()}
              className="bg-shaad-800 hover:bg-shaad-900 text-white text-xs px-5 h-10 rounded-xl shrink-0 font-medium disabled:opacity-50"
            >
              {loading ? 'بررسی...' : 'اعمال کد'}
            </Button>
          </div>

          {errorMsg && <p className="text-[11px] text-destructive">{errorMsg}</p>}
        </form>
      )}
    </div>
  );
}
