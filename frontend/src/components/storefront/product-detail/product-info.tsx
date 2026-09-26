'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ShoppingBag,
  Check,
  Plus,
  Minus,
  Truck,
  ShieldCheck,
  HeartHandshake,
  RotateCcw,
} from 'lucide-react';
import { Product, ProductVariant } from '@/types';
import { formatCurrency, cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/cart-context';

interface ProductInfoProps {
  product: Product;
  selectedVariant: ProductVariant | null;
  onSelectVariant: (variant: ProductVariant) => void;
}

export function ProductInfo({
  product,
  selectedVariant,
  onSelectVariant,
}: ProductInfoProps) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = React.useState(1);
  const [isAdded, setIsAdded] = React.useState(false);

  // Price calculations based on selected variant or base product
  const currentPrice = selectedVariant
    ? Number(selectedVariant.salePrice || selectedVariant.price)
    : Number(product.salePrice || product.basePrice);

  const currentSKU = selectedVariant?.sku || product.sku || 'SW-STUDIO-PIECE';

  const handleAddToCart = () => {
    const primaryImg =
      selectedVariant?.image ||
      product.images?.find((img) => img.isPrimary)?.url ||
      product.images?.[0]?.url;

    const variantName = selectedVariant?.attributeValues
      ?.map((av) => av.attributeValue.name)
      .join(' / ');

    const itemId = selectedVariant ? `${product.id}-${selectedVariant.id}` : product.id;

    addItem({
      id: itemId,
      productId: product.id,
      variantId: selectedVariant?.id,
      name: product.name,
      finish: variantName || undefined,
      price: currentPrice,
      quantity,
      image: primaryImg,
      sku: currentSKU,
    });

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2200);
  };

  return (
    <div className="space-y-6">
      {/* Category & Badge */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          {product.category && (
            <Link
              href={`/shop?categorySlug=${product.category.slug}`}
              className="text-xs uppercase tracking-widest text-shaad-700 hover:text-shaad-900 font-semibold"
            >
              {product.category.name}
            </Link>
          )}
          <span className="text-muted-foreground/40">&bull;</span>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-shaad-50 text-shaad-800 text-[11px] font-semibold tracking-wider uppercase border border-shaad-200">
            <Sparkles className="w-3 h-3" />
            <span>Handcrafted Studio Piece</span>
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-serif tracking-tight text-foreground leading-tight">
          {product.name}
        </h1>

        <div className="flex items-center justify-between pt-1">
          <div className="text-2xl sm:text-3xl font-bold font-mono text-shaad-900">
            {formatCurrency(currentPrice)}
          </div>
          <div className="text-xs font-mono text-muted-foreground">
            SKU: <span className="text-foreground font-semibold">{currentSKU}</span>
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-xs sm:text-sm text-muted-foreground font-light leading-relaxed">
        {product.description ||
          product.shortDescription ||
          'Individually shaped and surfaced with traditional joinery. Built from certified sustainable American black walnut and European white oak, oiled with organic plant extracts.'}
      </p>

      {/* Variation Selector (Timber Specie / Upholstery) */}
      {product.variants && product.variants.length > 0 && (
        <div className="space-y-3 pt-3 border-t border-border/60">
          <label className="text-xs font-semibold text-foreground uppercase tracking-wider block">
            Timber Specie & Finish
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {product.variants.map((v) => {
              const isSelected = selectedVariant?.id === v.id;
              const label =
                v.attributeValues?.map((av) => av.attributeValue.name).join(' / ') ||
                v.sku;

              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => onSelectVariant(v)}
                  className={cn(
                    'p-3 rounded-2xl border text-left transition-all flex flex-col justify-between text-xs',
                    isSelected
                      ? 'bg-white border-shaad-800 ring-1 ring-shaad-800 shadow-2xs'
                      : 'bg-white/70 border-border/70 hover:border-border text-muted-foreground'
                  )}
                >
                  <span className="font-semibold text-foreground font-serif">{label}</span>
                  <div className="flex items-center justify-between mt-1 text-[11px] font-mono">
                    <span>{v.stockQuantity > 0 ? 'In Stock' : 'Made to Order'}</span>
                    <span className="font-bold text-shaad-900">
                      {formatCurrency(Number(v.salePrice || v.price))}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Quantity Stepper & Add to Cart:
          Responsive layout prevents mobile overflow (fixes user's screenshot issue) */}
      <div className="pt-4 border-t border-border/60 space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Stepper */}
          <div className="flex items-center justify-between sm:justify-start rounded-full border border-border/80 bg-white p-1 shadow-2xs">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              className="w-9 h-9 rounded-full flex items-center justify-center text-foreground hover:bg-zen-100 disabled:opacity-30 transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-12 text-center font-mono text-sm font-semibold text-foreground">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((q) => q + 1)}
              className="w-9 h-9 rounded-full flex items-center justify-center text-foreground hover:bg-zen-100 transition-colors"
              aria-label="Increase quantity"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add to Cart CTA: full width on mobile, flexible on desktop, truncated text */}
          <Button
            type="button"
            onClick={handleAddToCart}
            size="lg"
            className={cn(
              'w-full sm:flex-1 min-w-0 rounded-full font-semibold text-xs tracking-wider uppercase gap-2 py-6 px-4 shadow-sm transition-all',
              isAdded
                ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
                : 'bg-shaad-800 hover:bg-shaad-900 text-white'
            )}
          >
            {isAdded ? (
              <>
                <Check className="w-4 h-4 shrink-0" />
                <span className="truncate">Added to Studio Cart</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4 shrink-0" />
                <span className="truncate">Add to Studio Collection</span>
              </>
            )}
          </Button>
        </div>

        {/* Free Shipping Note */}
        <p className="text-[11px] text-muted-foreground flex items-center gap-2">
          <Truck className="w-3.5 h-3.5 text-shaad-700 shrink-0" />
          <span>Free White-Glove In-Home Placement on Orders $1,500+</span>
        </p>
      </div>

      {/* Trust Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-border/50">
        <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-white/60 border border-border/50">
          <ShieldCheck className="w-4 h-4 text-shaad-700 mt-0.5 shrink-0" />
          <div>
            <h4 className="text-xs font-semibold text-foreground">10-Year Warranty</h4>
            <p className="text-[10px] text-muted-foreground mt-0.5">Master joinery structural guarantee</p>
          </div>
        </div>

        <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-white/60 border border-border/50">
          <HeartHandshake className="w-4 h-4 text-shaad-700 mt-0.5 shrink-0" />
          <div>
            <h4 className="text-xs font-semibold text-foreground">Artisan Direct</h4>
            <p className="text-[10px] text-muted-foreground mt-0.5">Crafted in our Pacific Northwest atelier</p>
          </div>
        </div>

        <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-white/60 border border-border/50">
          <RotateCcw className="w-4 h-4 text-shaad-700 mt-0.5 shrink-0" />
          <div>
            <h4 className="text-xs font-semibold text-foreground">30-Day Trial</h4>
            <p className="text-[10px] text-muted-foreground mt-0.5">Experience in your home with confidence</p>
          </div>
        </div>
      </div>
    </div>
  );
}
