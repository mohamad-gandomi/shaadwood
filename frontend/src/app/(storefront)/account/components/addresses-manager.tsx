'use client';

import * as React from 'react';
import { Plus, MapPin, Loader2, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog';
import { HoldToDeleteButton } from '@/components/admin/hold-to-delete-button';
import { api } from '@/lib/api';
import { Address } from '@/types';
import { AddressCard } from './address-card';
import { AddressDialog } from './address-dialog';

export function AddressesManager() {
  const [addresses, setAddresses] = React.useState<Address[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [editingAddress, setEditingAddress] = React.useState<Address | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<Address | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const fetchAddresses = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await api.getMyAddresses();
      setAddresses(data || []);
    } catch (err: any) {
      console.error('Failed to load addresses:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const handleOpenAdd = () => {
    setEditingAddress(null);
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (addr: Address) => {
    setEditingAddress(addr);
    setIsDialogOpen(true);
  };

  const handleSaveAddress = async (data: Partial<Address>) => {
    if (editingAddress) {
      const updated = await api.updateMyAddress(editingAddress.id, data);
      setAddresses((prev) => prev.map((a) => (a.id === editingAddress.id ? updated : a)));
      toast.success('نشانی با موفقیت به‌روزرسانی شد');
    } else {
      const created = await api.addMyAddress(data);
      setAddresses((prev) => [created, ...prev]);
      toast.success('نشانی جدید تحویل با موفقیت ثبت شد');
    }
    fetchAddresses();
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await api.deleteMyAddress(deleteTarget.id);
      setAddresses((prev) => prev.filter((a) => a.id !== deleteTarget.id));
      toast.success(`نشانی «${deleteTarget.title}» حذف شد`);
      setDeleteTarget(null);
    } catch (err: any) {
      toast.error(err.message || 'خطا در حذف نشانی');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSetDefault = async (addr: Address) => {
    try {
      await api.updateMyAddress(addr.id, { isDefaultShipping: true });
      toast.success(`«${addr.title}» به‌عنوان نشانی پیش‌فرض تنظیم شد`);
      fetchAddresses();
    } catch {
      toast.error('خطا در تنظیم نشانی پیش‌فرض');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
        <div>
          <h3 className="font-serif font-bold text-lg text-foreground">نشانی‌های ثبت‌شده تحویل</h3>
          <p className="text-xs text-muted-foreground mt-0.5">نشانی‌های منزل یا پروژه خود را جهت ثبت و تحویل بی‌درنگ مبلمان مدیریت کنید.</p>
        </div>
        <Button type="button" onClick={handleOpenAdd} className="rounded-xl bg-shaad-800 hover:bg-shaad-900 text-white text-xs font-semibold gap-1.5 shadow-sm self-start sm:self-auto cursor-pointer">
          <Plus className="w-4 h-4" />
          <span>افزودن نشانی جدید</span>
        </Button>
      </div>

      {isLoading ? (
        <div className="p-12 rounded-3xl bg-white border border-border/70 flex flex-col items-center justify-center text-muted-foreground gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-shaad-800" />
          <span className="text-xs font-sans">در حال دریافت نشانی‌های ذخیره‌شده...</span>
        </div>
      ) : addresses.length === 0 ? (
        <div className="p-10 rounded-3xl bg-white border border-border/70 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-zen-100 flex items-center justify-center text-muted-foreground mx-auto">
            <MapPin className="w-6 h-6" />
          </div>
          <h4 className="font-serif font-bold text-base text-foreground">هنوز نشانی تحویلی ثبت نکرده‌اید</h4>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">نشانی فضای خود را اضافه کنید تا در سفارش‌های بعدی فرایند ثبت بی‌درنگ انجام پذیرد.</p>
          <Button type="button" onClick={handleOpenAdd} variant="outline" className="rounded-xl text-xs gap-1.5 cursor-pointer mt-2">
            <Plus className="w-3.5 h-3.5" />
            <span>افزودن نشانی تحویل</span>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((address) => (
            <AddressCard key={address.id} address={address} onEdit={handleOpenEdit} onDelete={(addr) => setDeleteTarget(addr)} onSetDefault={handleSetDefault} />
          ))}
        </div>
      )}

      <AddressDialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} addressToEdit={editingAddress} onSave={handleSaveAddress} />

      <Dialog open={!!deleteTarget} onOpenChange={(open) => { if (!open && !isDeleting) setDeleteTarget(null); }}>
        <DialogContent className="sm:max-w-md w-[calc(100vw-1.5rem)] bg-white rounded-3xl p-6 text-right">
          <DialogHeader className="space-y-1">
            <DialogTitle className="flex items-center gap-2 text-destructive font-serif text-lg font-bold">
              <AlertTriangle className="w-5 h-5 text-destructive shrink-0" />
              <span>حذف نشانی ذخیره‌شده؟</span>
            </DialogTitle>
            <DialogDescription className="text-right text-xs sm:text-sm pt-1 leading-relaxed text-muted-foreground">
              آیا از حذف نشانی «{deleteTarget?.title}» ({deleteTarget?.street}، {deleteTarget?.city}) از حساب خود اطمینان دارید؟ این عملیات غیرقابل بازگشت است.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="pt-4 flex flex-col-reverse sm:flex-row gap-2 sm:gap-2 justify-end w-full">
            <Button type="button" variant="outline" className="w-full sm:w-auto rounded-xl text-xs" onClick={() => setDeleteTarget(null)} disabled={isDeleting}>
              انصراف
            </Button>
            <HoldToDeleteButton className="w-full sm:w-auto font-semibold rounded-xl text-xs" onTrigger={handleConfirmDelete} isPending={isDeleting} label="نگه‌دارید برای حذف نشانی" holdingLabel="همچنان نگه‌دارید..." pendingLabel="در حال حذف..." />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
