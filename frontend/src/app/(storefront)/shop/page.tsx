'use client';

import * as React from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useCart } from '@/context/cart-context';
import { Product } from '@/types';
import { ShopHeader } from '@/components/storefront/shop/shop-header';
import { ShopFilterSidebar } from '@/components/storefront/shop/shop-filter-sidebar';
import { ShopActiveFilters } from '@/components/storefront/shop/shop-active-filters';
import { ShopProductCard } from '@/components/storefront/shop/shop-product-card';
import { ShopMobileFilterSheet } from '@/components/storefront/shop/shop-mobile-filter-sheet';
import { TreePine } from 'lucide-react';
import { Button } from '@/components/ui/button';

function ShopCatalogContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const categorySlug = searchParams.get('categorySlug') || 'ALL';
  const searchQuery = searchParams.get('search') || '';
  const sortBy = searchParams.get('sortBy') || 'newest';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';

  const [inStockOnly, setInStockOnly] = React.useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = React.useState(false);
  const [addedId, setAddedId] = React.useState<string | null>(null);

  const { addItem } = useCart();

  const updateQueryParam = React.useCallback(
    (updates: Record<string, string | null>) => {
      const current = new URLSearchParams(Array.from(searchParams.entries()));
      Object.entries(updates).forEach(([key, val]) => {
        if (!val || val === 'ALL') current.delete(key);
        else current.set(key, val);
      });
      const query = current.toString() ? `?${current.toString()}` : '';
      router.push(`/shop${query}`, { scroll: false });
    },
    [router, searchParams]
  );

  const { data: categories = [] } = useQuery({
    queryKey: ['storefront-categories-catalog'],
    queryFn: () => api.getCategoriesTree(),
  });

  const activeCategoryName = React.useMemo(() => {
    if (categorySlug === 'ALL') return undefined;
    for (const parent of categories) {
      if (parent.slug === categorySlug) return parent.name;
      const child = parent.children?.find((c) => c.slug === categorySlug);
      if (child) return `${parent.name} — ${child.name}`;
    }
    return categorySlug;
  }, [categories, categorySlug]);

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
    <div className="min-h-screen bg-zen-50/70 pt-8 pb-20 text-right">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <ShopHeader
          totalCount={displayedProducts.length}
          sortBy={sortBy}
          onSortChange={(sort) => updateQueryParam({ sortBy: sort })}
          onOpenMobileFilters={() => setMobileFilterOpen(true)}
        />

        <ShopActiveFilters
          categorySlug={categorySlug} categoryName={activeCategoryName} onClearCategory={() => updateQueryParam({ categorySlug: null })}
          searchQuery={searchQuery} onClearSearch={() => updateQueryParam({ search: null })}
          minPrice={minPrice} maxPrice={maxPrice} onClearPrice={() => updateQueryParam({ minPrice: null, maxPrice: null })}
          inStockOnly={inStockOnly} onClearInStock={() => setInStockOnly(false)} onClearAll={handleResetFilters}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="hidden lg:block lg:col-span-3 sticky top-24">
            <ShopFilterSidebar
              categories={categories} selectedCategorySlug={categorySlug}
              onSelectCategory={(slug) => updateQueryParam({ categorySlug: slug })}
              searchQuery={searchQuery} onSearchChange={(q) => updateQueryParam({ search: q })}
              minPrice={minPrice} maxPrice={maxPrice}
              onPriceChange={(min, max) => updateQueryParam({ minPrice: min || null, maxPrice: max || null })}
              inStockOnly={inStockOnly} onInStockChange={setInStockOnly} onResetFilters={handleResetFilters}
            />
          </div>

          <div className="lg:col-span-9">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl p-4 border border-border/50 space-y-3 animate-pulse">
                    <div className="aspect-[4/3] bg-zen-200 rounded-xl" />
                    <div className="h-4 bg-zen-200 rounded w-1/3" />
                    <div className="h-5 bg-zen-200 rounded w-3/4" />
                    <div className="h-4 bg-zen-100 rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : displayedProducts.length === 0 ? (
              <div className="bg-white rounded-3xl border border-border/60 p-12 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-zen-100 text-shaad-800 flex items-center justify-center mx-auto">
                  <TreePine className="w-7 h-7" />
                </div>
                <h3 className="font-serif text-xl font-bold text-foreground">
                  اثری منطبق با فیلترهای انتخابی یافت نشد
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
                  محدوده قیمت، عبارت جستجو یا دسته‌بندی انتخابی را تغییر دهید تا آثار بیشتری را مشاهده کنید.
                </p>
                <Button onClick={handleResetFilters} variant="outline" size="sm" className="rounded-full text-xs mt-2">
                  پاک‌سازی تمام فیلترها
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

      <ShopMobileFilterSheet
        open={mobileFilterOpen} onOpenChange={setMobileFilterOpen} categories={categories} categorySlug={categorySlug}
        searchQuery={searchQuery} minPrice={minPrice} maxPrice={maxPrice} inStockOnly={inStockOnly}
        onSelectCategory={(slug) => updateQueryParam({ categorySlug: slug })}
        onSearchChange={(q) => updateQueryParam({ search: q })}
        onPriceChange={(min, max) => updateQueryParam({ minPrice: min || null, maxPrice: max || null })}
        onInStockChange={setInStockOnly} onResetFilters={handleResetFilters}
      />
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
            <p className="font-serif text-sm text-muted-foreground">در حال بازگشایی کاتالوگ آثار شادوود...</p>
          </div>
        </div>
      }
    >
      <ShopCatalogContent />
    </React.Suspense>
  );
}
