'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import {
  TreePine,
  ShieldCheck,
  Truck,
  HeartHandshake,
  Check,
  Plus,
  Minus,
  ArrowRight,
  ChevronRight,
  Sparkles,
  ShoppingBag,
  RotateCcw,
} from 'lucide-react';
import { api } from '@/lib/api';
import { useCart } from '@/context/cart-context';
import { formatCurrency, cn } from '@/lib/utils';
import { Product, ProductVariant } from '@/types';
import { Button } from '@/components/ui/button';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const { addItem } = useCart();
  const [selectedVariant, setSelectedVariant] = React.useState<ProductVariant | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = React.useState<number>(0);
  const [quantity, setQuantity] = React.useState<number>(1);
  const [isAdded, setIsAdded] = React.useState<boolean>(false);

  // Fetch product by slug
  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product-detail', slug],
    queryFn: () => api.getProductBySlug(slug),
    enabled: Boolean(slug),
  });

  // Fetch related products in the same category
  const { data: relatedProducts = [] } = useQuery({
    queryKey: ['related-products', product?.categoryId],
    queryFn: () =>
      api.getProducts({
        categorySlug: product?.category?.slug || undefined,
        limit: 4,
      }),
    enabled: Boolean(product?.id),
  });

  // Filter out current product from related
  const filteredRelated = React.useMemo(() => {
    return (relatedProducts || []).filter((p) => p.id !== product?.id).slice(0, 3);
  }, [relatedProducts, product?.id]);

  // Set default variant on load
  React.useEffect(() => {
    if (product?.variants && product.variants.length > 0 && !selectedVariant) {
      setSelectedVariant(product.variants[0]);
    }
  }, [product, selectedVariant]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zen-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-pulse">
          <div className="h-4 bg-zen-200 rounded w-48" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-7 aspect-[4/3] bg-zen-200 rounded-3xl" />
            <div className="lg:col-span-5 space-y-4">
              <div className="h-6 bg-zen-200 rounded w-24" />
              <div className="h-10 bg-zen-200 rounded w-3/4" />
              <div className="h-6 bg-zen-200 rounded w-1/3" />
              <div className="h-24 bg-zen-100 rounded" />
              <div className="h-12 bg-zen-200 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-[70vh] bg-zen-50 flex items-center justify-center p-6">
        <div className="text-center space-y-4 max-w-md">
          <div className="w-16 h-16 rounded-full bg-zen-100 text-shaad-800 flex items-center justify-center mx-auto">
            <TreePine className="w-8 h-8" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-foreground">
            Piece Not Found in Studio Catalog
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            The handcrafted piece you are looking for may have been archived or is temporarily out of production.
          </p>
          <Link href="/shop">
            <Button className="bg-shaad-800 hover:bg-shaad-900 text-white rounded-full text-xs px-6 py-2.5">
              Browse Studio Collection
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Active Images
  const galleryImages =
    product.images && product.images.length > 0
      ? product.images
      : [{ id: 'fallback', url: '/images/hero-bedroom-zen.webp', isPrimary: true, displayOrder: 0 }];

  const activeImage = galleryImages[selectedImageIndex]?.url || galleryImages[0]?.url;

  // Active Price
  const currentPrice = selectedVariant
    ? Number(selectedVariant.salePrice || selectedVariant.price)
    : Number(product.salePrice || product.basePrice);

  const currentSKU = selectedVariant?.sku || product.sku || 'SHD-NATURAL';

  const handleAddToCart = () => {
    const finishLabel = selectedVariant
      ? selectedVariant.attributeValues?.map((av) => av.attributeValue.name).join(' / ') ||
        'Custom Finish'
      : product.productType === 'VARIABLE'
      ? 'Selected Hardwood'
      : 'Natural Solid Finish';

    addItem({
      id: selectedVariant ? `${product.id}-${selectedVariant.id}` : product.id,
      productId: product.id,
      variantId: selectedVariant?.id,
      name: product.name,
      sku: currentSKU,
      price: currentPrice,
      image: activeImage,
      finish: finishLabel,
      quantity,
    });

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="min-h-screen bg-zen-50 pb-20">
      {/* 1. Breadcrumbs */}
      <div className="bg-white border-b border-border/50 py-3.5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-widest text-muted-foreground overflow-x-auto whitespace-nowrap">
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3 h-3 text-muted-foreground/60" />
            <Link href="/shop" className="hover:text-foreground transition-colors">
              Catalog
            </Link>
            {product.category && (
              <>
                <ChevronRight className="w-3 h-3 text-muted-foreground/60" />
                <Link
                  href={`/shop?categorySlug=${product.category.slug}`}
                  className="hover:text-foreground transition-colors"
                >
                  {product.category.name}
                </Link>
              </>
            )}
            <ChevronRight className="w-3 h-3 text-muted-foreground/60" />
            <span className="text-shaad-900 font-semibold truncate">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* 2. Main Product Showcase */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* Gallery Viewport (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Primary Main Image */}
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-white border border-border/60 shadow-sm group">
              <img
                src={activeImage}
                alt={product.name}
                onError={(e) => {
                  e.currentTarget.src = '/images/hero-bedroom-zen.webp';
                }}
                className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-700 ease-out"
              />

              {/* Tag / Category Badge */}
              <div className="absolute top-4 left-4">
                <span className="text-[11px] font-medium tracking-wider uppercase px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-shaad-900 border border-black/5 shadow-2xs">
                  {product.category?.name || 'Heirloom Furniture'}
                </span>
              </div>
            </div>

            {/* Thumbnail Row */}
            {galleryImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
                {galleryImages.map((img, idx) => (
                  <button
                    key={img.id || idx}
                    type="button"
                    onClick={() => setSelectedImageIndex(idx)}
                    className={cn(
                      'relative w-20 sm:w-24 aspect-[4/3] rounded-xl overflow-hidden bg-white border-2 transition-all shrink-0',
                      selectedImageIndex === idx
                        ? 'border-shaad-800 shadow-sm'
                        : 'border-border/60 opacity-70 hover:opacity-100'
                    )}
                  >
                    <img
                      src={img.url}
                      alt={`${product.name} thumbnail ${idx + 1}`}
                      onError={(e) => {
                        e.currentTarget.src = '/images/hero-bedroom-zen.webp';
                      }}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details & Purchasing Configuration (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-shaad-50 text-shaad-800 text-[11px] font-semibold tracking-wider uppercase border border-shaad-200">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Handcrafted Studio Piece</span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-serif tracking-tight text-foreground leading-tight">
                {product.name}
              </h1>

              <div className="flex items-center justify-between pt-1">
                <div className="text-2xl font-bold font-mono text-shaad-900">
                  {formatCurrency(currentPrice)}
                </div>
                <div className="text-xs font-mono text-muted-foreground">
                  SKU: <span className="text-foreground">{currentSKU}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-muted-foreground font-light leading-relaxed">
              {product.description ||
                product.shortDescription ||
                'Individually shaped and surfaced with traditional joinery. Built from certified sustainable American black walnut and European white oak, oiled with organic plant extracts.'}
            </p>

            {/* Variation / Finish Selector */}
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
                        onClick={() => setSelectedVariant(v)}
                        className={cn(
                          'p-3 rounded-xl border text-left transition-all flex flex-col justify-between text-xs',
                          isSelected
                            ? 'bg-white border-shaad-800 ring-1 ring-shaad-800 shadow-2xs'
                            : 'bg-white/70 border-border/70 hover:border-border text-muted-foreground'
                        )}
                      >
                        <span className="font-semibold text-foreground font-serif">{label}</span>
                        <div className="flex items-center justify-between mt-1 text-[11px] font-mono">
                          <span>{v.stockQuantity > 0 ? 'In Stock' : 'Made to Order'}</span>
                          <span className="font-bold text-shaad-900">
                            {formatCurrency(v.salePrice || v.price)}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity Stepper & Add to Cart */}
            <div className="pt-4 border-t border-border/60 space-y-4">
              <div className="flex items-center gap-3">
                {/* Stepper */}
                <div className="flex items-center rounded-full border border-border/80 bg-white p-1 shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-foreground hover:bg-zen-100 disabled:opacity-30 transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-10 text-center font-mono text-sm font-semibold text-foreground">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-foreground hover:bg-zen-100 transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Add to Cart CTA */}
                <Button
                  onClick={handleAddToCart}
                  size="lg"
                  className={cn(
                    'flex-1 rounded-full font-semibold text-xs tracking-wider uppercase gap-2 py-6 shadow-sm transition-all',
                    isAdded
                      ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
                      : 'bg-shaad-800 hover:bg-shaad-900 text-white'
                  )}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Studio Cart</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Studio Collection</span>
                    </>
                  )}
                </Button>
              </div>

              {/* Delivery Assurance */}
              <div className="flex items-center gap-2 text-[11px] text-muted-foreground pt-1">
                <Truck className="w-3.5 h-3.5 text-shaad-800 shrink-0" />
                <span>Free White-Glove In-Home Placement on Orders $1,500+</span>
              </div>
            </div>

            {/* Specifications Details */}
            <div className="pt-4 border-t border-border/60 space-y-3">
              <h3 className="font-serif font-bold text-xs uppercase tracking-wider text-foreground">
                Artisanal Specifications
              </h3>
              <div className="rounded-2xl bg-white border border-border/60 p-4 space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">Timber Material</span>
                  <span className="font-semibold text-foreground font-serif">100% Solid Kiln-Dried Hardwood</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">Joinery</span>
                  <span className="font-semibold text-foreground">Traditional Mortise & Tenon</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">Surface Seal</span>
                  <span className="font-semibold text-foreground">Organic Cold-Pressed Linseed Oil & Beeswax</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">Dimensions</span>
                  <span className="font-mono text-foreground">{product.dimensions || 'Custom Studio Proportions'}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-muted-foreground">Warranty</span>
                  <span className="font-semibold text-shaad-800 font-serif">25-Year Structural Heritage Warranty</span>
                </div>
              </div>
            </div>

            {/* Three Trust Pillars */}
            <div className="grid grid-cols-3 gap-2 pt-2">
              <div className="p-3 rounded-xl bg-white border border-border/60 text-center space-y-1">
                <TreePine className="w-4 h-4 text-shaad-800 mx-auto" />
                <div className="text-[10px] font-semibold font-serif text-foreground">Zero Veneers</div>
              </div>
              <div className="p-3 rounded-xl bg-white border border-border/60 text-center space-y-1">
                <ShieldCheck className="w-4 h-4 text-shaad-800 mx-auto" />
                <div className="text-[10px] font-semibold font-serif text-foreground">25-Yr Warranty</div>
              </div>
              <div className="p-3 rounded-xl bg-white border border-border/60 text-center space-y-1">
                <HeartHandshake className="w-4 h-4 text-shaad-800 mx-auto" />
                <div className="text-[10px] font-semibold font-serif text-foreground">White-Glove</div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Related Studio Pieces */}
        {filteredRelated.length > 0 && (
          <section className="mt-20 pt-16 border-t border-border/60 space-y-8">
            <div className="flex items-end justify-between">
              <div className="space-y-1">
                <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-shaad-800">
                  Harmonious Pairings
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold font-serif text-foreground">
                  Complementary Studio Pieces
                </h2>
              </div>
              <Link
                href="/shop"
                className="text-xs font-semibold uppercase tracking-wider text-shaad-800 hover:text-shaad-900 inline-flex items-center gap-1 group"
              >
                <span>View Full Catalog</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredRelated.map((related) => {
                const img = related.images?.[0]?.url || '/images/hero-bedroom-zen.webp';
                return (
                  <Link
                    key={related.id}
                    href={`/shop/${related.slug}`}
                    className="group rounded-2xl bg-white border border-border/60 overflow-hidden shadow-2xs hover:shadow-lg transition-all duration-300 block"
                  >
                    <div className="aspect-[4/3] bg-zen-100 overflow-hidden relative">
                      <img
                        src={img}
                        alt={related.name}
                        onError={(e) => {
                          e.currentTarget.src = '/images/hero-bedroom-zen.webp';
                        }}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      />
                    </div>
                    <div className="p-4 space-y-1">
                      <h4 className="font-serif font-bold text-sm text-foreground group-hover:text-shaad-800 transition-colors truncate">
                        {related.name}
                      </h4>
                      <div className="flex items-center justify-between text-xs pt-1">
                        <span className="text-muted-foreground text-[11px] font-mono">
                          {related.category?.name || 'Solid Timber'}
                        </span>
                        <span className="font-mono font-bold text-shaad-900">
                          {formatCurrency(related.basePrice)}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
