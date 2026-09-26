'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Product } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface ProductRelatedProps {
  products: Product[];
}

export function ProductRelated({ products }: ProductRelatedProps) {
  if (!products || products.length === 0) return null;

  return (
    <section className="pt-16 border-t border-border/70 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-shaad-700 font-semibold mb-1">
            Complementary Craft
          </p>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-foreground">
            Complete the Living Sanctuary
          </h2>
        </div>
        <Link
          href="/shop"
          className="text-xs font-semibold text-shaad-800 hover:text-shaad-900 inline-flex items-center gap-1.5 underline underline-offset-4"
        >
          <span>View Entire Catalog</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((p) => {
          const imgUrl =
            p.images?.find((img) => img.isPrimary)?.url ||
            p.images?.[0]?.url ||
            '/images/hero-bedroom-zen.webp';

          const price = Number(p.salePrice ?? p.basePrice);

          return (
            <div
              key={p.id}
              className="group bg-white rounded-2xl border border-border/60 overflow-hidden hover:shadow-md transition-all flex flex-col justify-between"
            >
              <Link href={`/shop/${p.slug}`} className="block relative aspect-[4/3] bg-zen-100 overflow-hidden">
                <img
                  src={imgUrl}
                  alt={p.name}
                  onError={(e) => {
                    e.currentTarget.src = '/images/hero-bedroom-zen.webp';
                  }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </Link>

              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1">
                  {p.category && (
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                      {p.category.name}
                    </span>
                  )}
                  <Link href={`/shop/${p.slug}`} className="block">
                    <h3 className="font-serif font-bold text-base text-foreground line-clamp-1 group-hover:text-shaad-800 transition-colors">
                      {p.name}
                    </h3>
                  </Link>
                  <p className="text-xs text-muted-foreground line-clamp-1 font-light">
                    {p.shortDescription || p.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border/50">
                  <span className="font-mono font-bold text-sm text-foreground">
                    {formatCurrency(price)}
                  </span>
                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="h-8 text-xs font-semibold text-shaad-800 hover:text-shaad-900 gap-1 px-2.5 rounded-full"
                  >
                    <Link href={`/shop/${p.slug}`}>
                      <span>View Piece</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
