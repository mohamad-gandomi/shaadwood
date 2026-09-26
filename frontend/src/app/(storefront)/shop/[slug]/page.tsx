'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { TreePine, ChevronRight } from 'lucide-react';
import { api } from '@/lib/api';
import { ProductVariant } from '@/types';
import { Button } from '@/components/ui/button';
import { ProductGallery } from '@/components/storefront/product-detail/product-gallery';
import { ProductInfo } from '@/components/storefront/product-detail/product-info';
import { ProductSpecifications } from '@/components/storefront/product-detail/product-specifications';
import { ProductRelated } from '@/components/storefront/product-detail/product-related';

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [selectedVariant, setSelectedVariant] = React.useState<ProductVariant | null>(null);

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
          <Button asChild className="rounded-full bg-shaad-800 text-white hover:bg-shaad-900 mt-2">
            <Link href="/shop">Browse Studio Pieces</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zen-50/70 pt-6 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-xs text-muted-foreground font-medium overflow-x-auto whitespace-nowrap pb-1"
        >
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50 shrink-0" />
          <Link href="/shop" className="hover:text-foreground transition-colors">
            Studio Catalog
          </Link>
          {product.category && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50 shrink-0" />
              <Link
                href={`/shop?categorySlug=${product.category.slug}`}
                className="hover:text-foreground transition-colors"
              >
                {product.category.name}
              </Link>
            </>
          )}
          <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50 shrink-0" />
          <span className="text-foreground truncate max-w-[200px]">{product.name}</span>
        </nav>

        {/* Top Product Presentation: 7 cols Gallery + 5 cols Info */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          <div className="lg:col-span-7">
            <ProductGallery images={product.images} productName={product.name} />
          </div>

          <div className="lg:col-span-5">
            <ProductInfo
              product={product}
              selectedVariant={selectedVariant}
              onSelectVariant={setSelectedVariant}
            />
          </div>
        </div>

        {/* Dynamic Artisanal Specifications Repeater */}
        <ProductSpecifications product={product} />

        {/* Related Studio Pieces */}
        <ProductRelated products={filteredRelated} />
      </div>
    </div>
  );
}
