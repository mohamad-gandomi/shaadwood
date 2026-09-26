'use client';

import * as React from 'react';
import Link from 'next/link';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function CartEmptyState() {
  return (
    <div className="max-w-md mx-auto py-16 text-center space-y-6">
      <div className="w-20 h-20 rounded-full bg-zen-100 border border-border/70 flex items-center justify-center mx-auto text-shaad-800 shadow-2xs">
        <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
      </div>

      <div className="space-y-2">
        <h2 className="font-serif font-bold text-2xl text-foreground">
          Your Studio Cart is Empty
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground font-light leading-relaxed">
          You haven&apos;t selected any handcrafted timber pieces for your sanctuary yet. Explore our curated collections to discover heirloom furniture made to last generations.
        </p>
      </div>

      <Button
        asChild
        size="lg"
        className="rounded-full bg-shaad-800 hover:bg-shaad-900 text-white font-semibold text-xs tracking-wider uppercase px-8 py-6 shadow-sm gap-2"
      >
        <Link href="/shop">
          <span>Explore Studio Catalog</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </Button>
    </div>
  );
}
