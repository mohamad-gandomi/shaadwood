'use client';

import * as React from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useCart } from '@/context/cart-context';
import { Product, Category } from '@/types';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { ShopHeader } from '@/components/storefront/shop/shop-header';
import { ShopFilterSidebar } from '@/components/storefront/shop/shop-filter-sidebar';
import { ShopActiveFilters } from '@/components/storefront/shop/shop-active-filters';
import { ShopProductCard } from '@/components/storefront/shop/shop-product-card';
import { TreePine } from 'lucide-react';
import { Button } from '@/components/ui/button';

function ShopCatalogContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Filters from URL
  const categorySlug = searchParams.get('categorySlug') || 'ALL';
  const searchQuery = searchParams.get('search') || '';
  const sortBy = searchParams.get('sortBy') || 'newest';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';

  const [inStockOnly, setInStockOnly] = React.useState<boolean>(false);
  const [mobileFilterOpen, setMobileFilterOpen] = React.useState<boolean>(false);
  const [addedId, setAddedId] = React.useState<string | null>(null);

  const { addItem } = useCart();

  // Update query params helper
  const updateQueryParam = React.useCallback(
    (updates: Record<string, string | null>) => {
      const current = new URLSearchParams(Array.from(searchParams.entries()));
      Object.entries(updates).forEach(([key, val]) => {
        if (!val || val === 'ALL') {
          current.delete(key);
        } else {
          current.set(key, val);
        }
      });
      const search = current.toString();
      const query = search ? `?${search}` : '';
      router.push(`/shop${query}`, { scroll: false });
    },
    [router, searchParams]
  );

  // Fetch Categories Tree from Backend
  const { data: categories = [] } = useQuery({
    queryKey: ['storefront-categories-catalog'],
    queryFn: () => api.getCategoriesTree(),
  });

  // Find active category name for display
  const activeCategoryName = React.useMemo(() => {
    if (categorySlug === 'ALL') return undefined;
    for (const parent of categories) {
      if (parent.slug === categorySlug) return parent.name;
      const child = parent.children?.find((c) => c.slug === categorySlug);
      if (child) return `${parent.name} — ${child.name}`;
    }
    return categorySlug;
  }, [categories, categorySlug]);

  // Fetch Products with Live Backend Filters
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['shop-products', categorySlug, searchQuery, sortBy, minPrice, maxPrice],
    queryFn: () =>
      api.getProducts({
        categorySlug: categorySlug !== 'ALL' ? categorySlug : undefined,
        search: searchQuery.trim() || undefined,
        minPrice: minPrice ? parseFloat(minPrice) : undefined,
        maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
        sortBy: sortBy || 'newest',
      }),
  });

  // Client-side in-stock filter
  const displayedProducts = React.useMemo(() => {
    if (!inStockOnly) return products;
    return products.filter((p) => !p.manageStock || p.stockQuantity > 0);
  }, [products, inStockOnly]);

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      productId: product.id,
      name: product.name,
      price: Number(product.salePrice ?? product.basePrice),
      image: product.images?.[0]?.url,
      sku: product.sku || undefined,
    });
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 2000);
  };

  const handleResetFilters = () => {
    setInStockOnly(false);
    router.push('/shop', { scroll: false });
  };

  return (
    <div className="min-h-screen bg-zen-50/70 pt-8 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <ShopHeader
          totalCount={displayedProducts.length}
          sortBy={sortBy}
          onSortChange={(sort) => updateQueryParam({ sortBy: sort })}
          onOpenMobileFilters={() => setMobileFilterOpen(true)}
        />

        {/* Active Filter Tags */}
        <ShopActiveFilters
          categorySlug={categorySlug}
          categoryName={activeCategoryName}
          onClearCategory={() => updateQueryParam({ categorySlug: null })}
          searchQuery={searchQuery}
          onClearSearch={() => updateQueryParam({ search: null })}
          minPrice={minPrice}
          maxPrice={maxPrice}
          onClearPrice={() => updateQueryParam({ minPrice: null, maxPrice: null })}
          inStockOnly={inStockOnly}
          onClearInStock={() => setInStockOnly(false)}
          onClearAll={handleResetFilters}
        />

        {/* Main Grid: Sidebar (3 cols) + Catalog Grid (9 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block lg:col-span-3 sticky top-24">
            <ShopFilterSidebar
              categories={categories}
              selectedCategorySlug={categorySlug}
              onSelectCategory={(slug) => updateQueryParam({ categorySlug: slug })}
              searchQuery={searchQuery}
              onSearchChange={(q) => updateQueryParam({ search: q })}
              minPrice={minPrice}
              maxPrice={maxPrice}
              onPriceChange={(min, max) => updateQueryParam({ minPrice: min || null, maxPrice: max || null })}
              inStockOnly={inStockOnly}
              onInStockChange={setInStockOnly}
              onResetFilters={handleResetFilters}
            />
          </div>

          {/* Product Catalog Grid */}
          <div className="lg:col-span-9">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl p-4 border border-border/50 space-y-3 animate-pulse">
                    <div className="aspect-[4/3] bg-zen-200 rounded-xl" />
                    <div className="h-4 bg-zen-200 rounded w-1/3" />
                    <div className="h-5 bg-zen-200 rounded w-3/4" />
                    <div className="h-4 bg-zen-100 rounded w-1/2" />
                    <div className="h-9 bg-zen-200 rounded-xl mt-4" />
                  </div>
                ))}
              </div>
            ) : displayedProducts.length === 0 ? (
              <div className="bg-white rounded-3xl border border-border/60 p-12 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-zen-100 text-shaad-800 flex items-center justify-center mx-auto">
                  <TreePine className="w-7 h-7" />
                </div>
                <h3 className="font-serif text-xl font-bold text-foreground">
                  No Studio Pieces Match Your Filters
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
                  Try broadening your price range, searching for another keyword, or exploring another collection.
                </p>
                <Button
                  onClick={handleResetFilters}
                  variant="outline"
                  size="sm"
                  className="rounded-full border-border/80 text-xs mt-2"
                >
                  Reset All Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedProducts.map((product) => (
                  <ShopProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                    isAdded={addedId === product.id}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Sheet */}
      <Sheet open={mobileFilterOpen} onOpenChange={setMobileFilterOpen}>
        <SheetContent side="left" className="w-[320px] sm:w-[380px] p-6 overflow-y-auto">
          <SheetHeader className="pb-4 border-b border-border/60 text-left">
            <SheetTitle className="font-serif text-lg">Filter Studio Pieces</SheetTitle>
          </SheetHeader>
          <div className="pt-6">
            <ShopFilterSidebar
              categories={categories}
              selectedCategorySlug={categorySlug}
              onSelectCategory={(slug) => {
                updateQueryParam({ categorySlug: slug });
                setMobileFilterOpen(false);
              }}
              searchQuery={searchQuery}
              onSearchChange={(q) => updateQueryParam({ search: q })}
              minPrice={minPrice}
              maxPrice={maxPrice}
              onPriceChange={(min, max) => {
                updateQueryParam({ minPrice: min || null, maxPrice: max || null });
                setMobileFilterOpen(false);
              }}
              inStockOnly={inStockOnly}
              onInStockChange={setInStockOnly}
              onResetFilters={() => {
                handleResetFilters();
                setMobileFilterOpen(false);
              }}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default function ShopPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-zen-50 flex items-center justify-center p-8">
          <div className="text-center space-y-3 animate-pulse">
            <div className="w-10 h-10 border-2 border-shaad-800 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="font-serif text-sm text-muted-foreground">Opening Studio Catalog...</p>
          </div>
        </div>
      }
    >
      <ShopCatalogContent />
    </React.Suspense>
  );
}
