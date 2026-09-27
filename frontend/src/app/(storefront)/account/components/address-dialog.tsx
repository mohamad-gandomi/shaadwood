'use client';

import * as React from 'react';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Address } from '@/types';

interface AddressDialogProps {
  isOpen: boolean;
  onClose: () => void;
  addressToEdit?: Address | null;
  onSave: (data: Partial<Address>) => Promise<void>;
}

export function AddressDialog({ isOpen, onClose, addressToEdit, onSave }: AddressDialogProps) {
  const [title, setTitle] = React.useState('');
  const [recipientName, setRecipientName] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [province, setProvince] = React.useState('تهران');
  const [city, setCity] = React.useState('تهران');
  const [street, setStreet] = React.useState('');
  const [postalCode, setPostalCode] = React.useState('');
  const [isDefaultShipping, setIsDefaultShipping] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);

  React.useEffect(() => {
    if (addressToEdit) {
      setTitle(addressToEdit.title || 'منزل');
      setRecipientName(addressToEdit.recipientName || '');
      setPhone(addressToEdit.phone || '');
      setProvince(addressToEdit.province || 'تهران');
      setCity(addressToEdit.city || 'تهران');
      setStreet(addressToEdit.street || '');
      setPostalCode(addressToEdit.postalCode || '');
      setIsDefaultShipping(addressToEdit.isDefaultShipping || false);
    } else {
      setTitle('منزل');
      setRecipientName('');
      setPhone('');
      setProvince('تهران');
      setCity('تهران');
      setStreet('');
      setPostalCode('');
      setIsDefaultShipping(false);
    }
  }, [addressToEdit, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientName.trim() || !phone.trim() || !street.trim() || !postalCode.trim()) {
      toast.error('لطفاً همه مشخصات الزامی نشانی را وارد کنید');
      return;
    }

    setIsSaving(true);
    try {
      await onSave({
        title: title.trim() || 'نشانی تحویل',
        recipientName: recipientName.trim(),
        phone: phone.trim(),
        province: province.trim(),
        city: city.trim(),
        street: street.trim(),
        postalCode: postalCode.trim(),
        isDefaultShipping,
      });
      onClose();
    } catch (err: any) {
      toast.error(err.message || 'خطا در ثبت نشانی');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg bg-white rounded-3xl p-6 sm:p-7 max-h-[90vh] overflow-y-auto text-right">
        <DialogHeader className="space-y-1">
          <DialogTitle className="font-serif text-xl font-bold text-foreground">
            {addressToEdit ? 'ویرایش نشانی تحویل' : 'افزودن نشانی جدید تحویل'}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            ثبت مشخصات دقیق مقصد باربری جهت ارسال ایمن و مونتاژ مبلمان کارگاه شادوود.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">عنوان نشانی *</label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="مثال: منزل، کارگاه، ویلا" className="h-10 rounded-xl" required />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">نام تحویل‌گیرنده *</label>
              <Input value={recipientName} onChange={(e) => setRecipientName(e.target.value)} placeholder="مثال: کوروش راد" className="h-10 rounded-xl" required />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">شماره تماس هماهنگی *</label>
              <Input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="۰۹۱۲۳۴۵۶۷۸۹" dir="ltr" className="h-10 rounded-xl font-sans text-left" required />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">کد پستی ۱۰ رقمی *</label>
              <Input value={postalCode} onChange={(e) => setPostalCode(e.target.value)} placeholder="بدون خط تیره" dir="ltr" className="h-10 rounded-xl font-sans text-left" required />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">استان *</label>
              <Input value={province} onChange={(e) => setProvince(e.target.value)} placeholder="مثال: تهران" className="h-10 rounded-xl" required />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">شهر *</label>
              <Input value={city} onChange={(e) => setCity(e.target.value)} placeholder="مثال: تهران" className="h-10 rounded-xl" required />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-foreground">نشانی دقیق پستی *</label>
            <Input value={street} onChange={(e) => setStreet(e.target.value)} placeholder="خیابان، کوچه، پلاک، طبقه و واحد" className="h-10 rounded-xl" required />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input type="checkbox" id="isDefaultShipping" checked={isDefaultShipping} onChange={(e) => setIsDefaultShipping(e.target.checked)} className="w-4 h-4 rounded text-shaad-800 focus:ring-shaad-800 cursor-pointer" />
            <label htmlFor="isDefaultShipping" className="text-xs text-foreground cursor-pointer select-none">
              تنظیم به‌عنوان نشانی اصلی و پیش‌فرض تحویل برای سفارش‌های آتی
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-border/60">
            <Button type="button" variant="outline" onClick={onClose} className="rounded-xl text-xs">
              انصراف
            </Button>
            <Button type="submit" disabled={isSaving} className="rounded-xl bg-shaad-800 hover:bg-shaad-900 text-white text-xs cursor-pointer">
              {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin ml-1.5" /> : null}
              <span>{addressToEdit ? 'ذخیره تغییرات' : 'ثبت نشانی جدید'}</span>
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
