'use client';

import * as React from 'react';
import { User, Phone, Mail, Calendar, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AccountHeaderProps {
  user: any;
  onLogout: () => void;
}

export function AccountHeader({ user, onLogout }: AccountHeaderProps) {
  const memberDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
      })
    : 'Recent';

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-white border border-border/70 shadow-2xs space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-shaad-800 text-white font-serif font-bold text-xl flex items-center justify-center shadow-xs shrink-0">
            {user?.firstName?.[0] || 'C'}
          </div>
          <div>
            <h1 className="font-serif text-2xl font-bold text-foreground">
              {user?.firstName} {user?.lastName}
            </h1>
            <p className="text-xs text-muted-foreground font-mono mt-0.5">
              Customer Atelier Member &middot; Since {memberDate}
            </p>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={onLogout}
          className="rounded-xl border-border/80 text-red-600 hover:text-red-700 hover:bg-red-50 text-xs font-semibold gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2 border-t border-border/50 text-xs">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Phone className="w-3.5 h-3.5 text-shaad-800 shrink-0" />
          <span className="font-mono text-foreground">{user?.phone || 'No phone registered'}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Mail className="w-3.5 h-3.5 text-shaad-800 shrink-0" />
          <span className="truncate text-foreground font-mono">{user?.email || 'Guest Account'}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="w-3.5 h-3.5 text-shaad-800 shrink-0" />
          <span>SMS OTP Authenticated</span>
        </div>
      </div>
    </div>
  );
}
