'use client';

import * as React from 'react';
import { CartProvider } from '@/context/cart-context';
import { StorefrontNavbar } from '@/components/storefront/storefront-navbar';
import { StorefrontFooter } from '@/components/storefront/storefront-footer';
import { CartDrawer } from '@/components/storefront/cart-drawer';

export default function StorefrontLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col bg-zen-50 text-foreground selection:bg-shaad-800 selection:text-white">
        <StorefrontNavbar />
        <main className="flex-1">{children}</main>
        <StorefrontFooter />
        <CartDrawer />
      </div>
    </CartProvider>
  );
}
