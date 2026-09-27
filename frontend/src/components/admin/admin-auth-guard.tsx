'use client';

import * as React from 'react';
import { notFound } from 'next/navigation';
import { api } from '@/lib/api';

interface AdminAuthGuardProps {
  children: React.ReactNode;
}

export function AdminAuthGuard({ children }: AdminAuthGuardProps) {
  const [isAuthorized, setIsAuthorized] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    const checkAuth = () => {
      const user = api.getCurrentUser();
      if (!user || user.role !== 'ADMIN') {
        setIsAuthorized(false);
      } else {
        setIsAuthorized(true);
      }
    };

    checkAuth();

    window.addEventListener('shaadwood_auth_changed', checkAuth);
    return () => {
      window.removeEventListener('shaadwood_auth_changed', checkAuth);
    };
  }, []);

  if (isAuthorized === false) {
    notFound();
  }

  if (isAuthorized === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 rounded-full border-2 border-shaad-800 border-t-transparent animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
