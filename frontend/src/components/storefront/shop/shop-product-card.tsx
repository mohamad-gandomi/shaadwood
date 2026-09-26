'use client';

import * as React from 'react';
import Link from 'next/link';
import { ShoppingBag, Check, ArrowRight, Eye, SlidersHorizontal } from 'lucide-react';
import { Product } from '@/types';
import { formatCurrency, cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface ShopProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  isAdded?: boolean;
}

export function ShopProductCard({
  product,
  onAddToCart,
  isAdded = false,
}: ShopProductCardProps) {
  const isVariable = product.productType === 'VARIABLE';
  const primaryImage =
    product.images?.find((img) => img.isPrimary)?.url ||
    product.images?.[0]?.url ||
    '/images/hero-bedroom-zen.webp';

  const numericPrice = Number(product.basePrice) || 0;
  const numericSale = product.salePrice ? Number(product.salePrice) : null;
  const inStock = !product.manageStock || product.stockQuantity > 0;

  return (
    <div className="group flex flex-col bg-white rounded-2xl border border-border/60 overflow-hidden hover:shadow-lg hover:border-shaad-200 transition-all duration-300">
      {/* Image Container with Link to Detail Page */}
      <Link
        href={`/shop/${product.slug}`}
        className="relative aspect-[4/3] bg-zen-100 overflow-hidden block"
      >
        <img
          src={primaryImage}
          alt={product.name}
          onError={(e) => {
            e.currentTarget.src = '/images/hero-bedroom-zen.webp';
          }}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
        />

        {/* Overlay Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 pointer-events-none">
          {isVariable ? (
            <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-white/90 backdrop-blur-xs text-foreground shadow-2xs">
              Customizable
            </span>
          ) : inStock ? (
            <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-shaad-50 text-shaad-900 border border-shaad-200 shadow-2xs">
              In Stock
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-zen-200/90 text-muted-foreground shadow-2xs">
              Made to Order
            </span>
          )}
        </div>

        {/* Quick View Button on Hover */}
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/95 text-foreground text-xs font-semibold shadow-md transform translate-y-2 group-hover:translate-y-0 transition-transform">
            <Eye className="w-3.5 h-3.5 text-shaad-800" />
            <span>Inspect Piece</span>
          </span>
        </div>
      </Link>

      {/* Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-1.5">
          {product.category?.name && (
            <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-widest">
              {product.category.name}
            </p>
          )}

          <Link href={`/shop/${product.slug}`} className="block group-hover:text-shaad-900 transition-colors">
            <h3 className="font-serif font-bold text-base sm:text-lg text-foreground line-clamp-1 leading-snug">
              {product.name}
            </h3>
          </Link>

          <p className="text-xs text-muted-foreground line-clamp-2 font-light leading-relaxed">
            {product.shortDescription || product.description}
          </p>
        </div>

        {/* Price & Action Row */}
        <div className="pt-3 border-t border-border/50 space-y-3">
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-base sm:text-lg font-bold font-mono text-foreground">
                {isVariable && <span className="text-xs font-sans font-normal text-muted-foreground mr-1">From</span>}
                {formatCurrency(numericSale ?? numericPrice)}
              </span>
              {numericSale && (
                <span className="text-xs text-muted-foreground line-through font-mono">
                  {formatCurrency(numericPrice)}
                </span>
              )}
            </div>

            {product.sku && (
              <span className="text-[10px] font-mono text-muted-foreground/80 truncate max-w-[100px]">
                {product.sku}
              </span>
            )}
          </div>

          {/* Action Buttons: Requirements:
              1. If variable: Change label to "Select Options" / "View Piece" navigating to inner page.
              2. Add button that navigates user to inner page. */}
          <div className="grid grid-cols-2 gap-2">
            {/* Explicit Inner Page Link Button */}
            <Button
              asChild
              variant="outline"
              size="sm"
              className="w-full rounded-xl text-xs font-medium border-border/80 hover:border-shaad-800 hover:text-shaad-900 transition-colors h-9"
            >
              <Link href={`/shop/${product.slug}`} className="flex items-center justify-center gap-1.5">
                <span>View Details</span>
                <ArrowRight className="w-3 h-3 text-muted-foreground" />
              </Link>
            </Button>

            {/* Primary Action Button */}
            {isVariable ? (
              <Button
                asChild
                size="sm"
                className="w-full rounded-xl text-xs font-semibold bg-shaad-800 hover:bg-shaad-900 text-white transition-colors h-9"
              >
                <Link href={`/shop/${product.slug}`} className="flex items-center justify-center gap-1.5">
                  <SlidersHorizontal className="w-3 h-3" />
                  <span>Select Options</span>
                </Link>
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={() => onAddToCart?.(product)}
                className={cn(
                  'w-full rounded-xl text-xs font-semibold transition-all h-9',
                  isAdded
                    ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
                    : 'bg-shaad-800 hover:bg-shaad-900 text-white'
                )}
              >
                {isAdded ? (
                  <span className="flex items-center justify-center gap-1.5">
                    <Check className="w-3 h-3" />
                    <span>Added</span>
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-1.5">
                    <ShoppingBag className="w-3 h-3" />
                    <span>Add to Cart</span>
                  </span>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
