'use client';

import * as React from 'react';
import { User as UserIcon, Mail, Phone, ShieldCheck, Loader2, CheckCircle2, Smartphone } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { User } from '@/types';

interface ProfileInfoFormProps {
  user: User;
  onUserUpdated: (updatedUser: User) => void;
  onRequestChangePhone: () => void;
}

export function ProfileInfoForm({
  user,
  onUserUpdated,
  onRequestChangePhone,
}: ProfileInfoFormProps) {
  const [firstName, setFirstName] = React.useState(user.firstName || '');
  const [lastName, setLastName] = React.useState(user.lastName || '');
  const [email, setEmail] = React.useState(
    user.email?.endsWith('@guest.shaadwood.com') ? '' : user.email || ''
  );
  const [isSaving, setIsSaving] = React.useState(false);

  // Keep form in sync if user changes
  React.useEffect(() => {
    setFirstName(user.firstName || '');
    setLastName(user.lastName || '');
    setEmail(user.email?.endsWith('@guest.shaadwood.com') ? '' : user.email || '');
  }, [user]);

  const hasChanges =
    firstName.trim() !== (user.firstName || '').trim() ||
    lastName.trim() !== (user.lastName || '').trim() ||
    (email.trim() !== '' && email.trim().toLowerCase() !== (user.email || '').toLowerCase());

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim()) {
      toast.error('First name cannot be empty');
      return;
    }

    setIsSaving(true);
    try {
      const payload: { firstName: string; lastName: string; email?: string } = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      };
      if (email.trim()) {
        payload.email = email.trim().toLowerCase();
      }

      const updated = await api.updateProfile(payload);
      onUserUpdated(updated);
      toast.success('Profile information saved successfully');
    } catch (err: any) {
      toast.error(err.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Personal Identity & Email Form */}
      <form onSubmit={handleSave} className="p-6 sm:p-8 rounded-3xl bg-white border border-border/70 shadow-2xs space-y-5">
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <div className="flex items-center gap-2">
            <UserIcon className="w-5 h-5 text-shaad-800" />
            <h3 className="font-serif font-bold text-base text-foreground">
              Personal Information
            </h3>
          </div>
          <span className="text-[11px] text-muted-foreground font-mono">Atelier Profile</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-foreground">
              First Name *
            </label>
            <Input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="e.g. Kourosh"
              className="h-11 rounded-xl"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Last Name
            </label>
            <Input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="e.g. Rad"
              className="h-11 rounded-xl"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-foreground flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-shaad-800" />
              <span>Email Address</span>
            </span>
            <span className="text-[10px] text-muted-foreground font-normal">For commission invoices</span>
          </label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="e.g. yourname@domain.com"
            className="h-11 rounded-xl font-mono text-sm"
          />
          {user.email?.endsWith('@guest.shaadwood.com') && (
            <p className="text-[11px] text-amber-700 bg-amber-50/80 p-2 rounded-lg border border-amber-200/60 leading-relaxed">
              You checked out as a guest. Add your primary email here to receive digital receipts and crafting updates.
            </p>
          )}
        </div>

        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            disabled={isSaving || !hasChanges}
            className="h-11 px-6 rounded-xl bg-shaad-800 hover:bg-shaad-900 text-white font-medium text-xs transition-all shadow-sm cursor-pointer disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin mr-2" />
                <span>Saving Changes...</span>
              </>
            ) : (
              <span>Save Profile Changes</span>
            )}
          </Button>
        </div>
      </form>

      {/* 2. Mobile Phone Number & SMS OTP Action */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-border/70 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <div className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-shaad-800" />
            <h3 className="font-serif font-bold text-base text-foreground">
              Mobile Phone & Authentication
            </h3>
          </div>
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" />
            Verified
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-zen-50 border border-border/60">
          <div>
            <span className="text-[11px] text-muted-foreground uppercase font-semibold tracking-wider block">
              Current Mobile Number
            </span>
            <span className="font-mono font-bold text-base text-foreground">
              {user.phone || 'No phone registered'}
            </span>
            <p className="text-xs text-muted-foreground mt-0.5">
              Used for passwordless SMS OTP login and carrier delivery dispatch notifications.
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={onRequestChangePhone}
            className="rounded-xl border-shaad-300 text-shaad-800 hover:bg-shaad-50 text-xs font-semibold shrink-0 cursor-pointer"
          >
            <Phone className="w-3.5 h-3.5 mr-1.5" />
            <span>Change Phone Number</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
