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

export function AddressDialog({
  isOpen,
  onClose,
  addressToEdit,
  onSave,
}: AddressDialogProps) {
  const [title, setTitle] = React.useState('');
  const [recipientName, setRecipientName] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [province, setProvince] = React.useState('Tehran');
  const [city, setCity] = React.useState('Tehran');
  const [street, setStreet] = React.useState('');
  const [postalCode, setPostalCode] = React.useState('');
  const [isDefaultShipping, setIsDefaultShipping] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);

  React.useEffect(() => {
    if (addressToEdit) {
      setTitle(addressToEdit.title || 'Home');
      setRecipientName(addressToEdit.recipientName || '');
      setPhone(addressToEdit.phone || '');
      setProvince(addressToEdit.province || 'Tehran');
      setCity(addressToEdit.city || 'Tehran');
      setStreet(addressToEdit.street || '');
      setPostalCode(addressToEdit.postalCode || '');
      setIsDefaultShipping(addressToEdit.isDefaultShipping || false);
    } else {
      setTitle('Home Residence');
      setRecipientName('');
      setPhone('');
      setProvince('Tehran');
      setCity('Tehran');
      setStreet('');
      setPostalCode('');
      setIsDefaultShipping(false);
    }
  }, [addressToEdit, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientName.trim() || !phone.trim() || !street.trim() || !postalCode.trim()) {
      toast.error('Please complete all required address fields');
      return;
    }

    setIsSaving(true);
    try {
      await onSave({
        title: title.trim() || 'Address',
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
      toast.error(err.message || 'Failed to save address');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg bg-white rounded-3xl p-6 sm:p-7 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-1">
          <DialogTitle className="font-serif text-xl font-bold text-foreground">
            {addressToEdit ? 'Edit Delivery Address' : 'Add New Delivery Address'}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Save delivery destinations for swift checkout and white-glove furniture freight dispatch.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-foreground">
                Label / Title *
              </label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Home, Office, Studio"
                className="h-10 rounded-xl"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-foreground">
                Recipient Full Name *
              </label>
              <Input
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="e.g. Kourosh Rad"
                className="h-10 rounded-xl"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-foreground">
                Delivery Phone Number *
              </label>
              <Input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0912 345 6789"
                className="h-10 rounded-xl font-mono"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-foreground">
                Province / State *
              </label>
              <Input
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                placeholder="e.g. Tehran, Isfahan, Fars"
                className="h-10 rounded-xl"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-foreground">
                City *
              </label>
              <Input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Tehran"
                className="h-10 rounded-xl"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-foreground">
                Postal Code *
              </label>
              <Input
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                placeholder="10-digit postal code"
                className="h-10 rounded-xl font-mono"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Street & Unit Address *
            </label>
            <Input
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              placeholder="e.g. Lavasan Blvd, Villa 42, Floor 2"
              className="h-10 rounded-xl"
              required
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="isDefaultShipping"
              checked={isDefaultShipping}
              onChange={(e) => setIsDefaultShipping(e.target.checked)}
              className="w-4 h-4 rounded text-shaad-800 focus:ring-shaad-800 cursor-pointer"
            />
            <label htmlFor="isDefaultShipping" className="text-xs text-foreground cursor-pointer select-none">
              Set as primary default delivery destination for future orders
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-border/60">
            <Button type="button" variant="outline" onClick={onClose} className="rounded-xl text-xs">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSaving}
              className="rounded-xl bg-shaad-800 hover:bg-shaad-900 text-white text-xs cursor-pointer"
            >
              {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" /> : null}
              <span>{addressToEdit ? 'Save Changes' : 'Create Address'}</span>
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
