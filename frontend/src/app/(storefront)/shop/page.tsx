'use client';

import * as React from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import {
  SlidersHorizontal,
  Search,
  X,
  ChevronDown,
  Plus,
  Check,
  ArrowUpDown,
  Sparkles,
  TreePine,
  RotateCcw,
} from 'lucide-react';
import { api } from '@/lib/api';
import { useCart } from '@/context/cart-context';
import { formatCurrency, cn } from '@/lib/utils';
import { Product, Category } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

function ShopCatalogContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL state filters
  const initialCategory = searchParams.get('categorySlug') || 'ALL';
  const initialSearch = searchParams.get('search') || '';
  const initialSort = searchParams.get('sortBy') || 'newest';
  const initialMinPrice = searchParams.get('minPrice') || '';
  const initialMaxPrice = searchParams.get('maxPrice') || '';

  const [categorySlug, setCategorySlug] = React.useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = React.useState<string>(initialSearch);
  const [sortBy, setSortBy] = React.useState<string>(initialSort);
  const [minPrice, setMinPrice] = React.useState<string>(initialMinPrice);
  const [maxPrice, setMaxPrice] = React.useState<string>(initialMaxPrice);
  const [inStockOnly, setInStockOnly] = React.useState<boolean>(false);
  const [mobileFilterOpen, setMobileFilterOpen] = React.useState<boolean>(false);

  const { addItem } = useCart();
  const [addedId, setAddedId] = React.useState<string | null>(null);

  // Sync state when URL params change
  React.useEffect(() => {
    const cat = searchParams.get('categorySlug') || 'ALL';
    setCategorySlug(cat);
    const q = searchParams.get('search') || '';
    setSearchQuery(q);
  }, [searchParams]);

  // Fetch Categories from Backend
  const { data: categories = [] } = useQuery({
    queryKey: ['storefront-categories-catalog'],
    queryFn: () => api.getCategoriesTree(),
  });

  // Flatten categories for easy selection
  const flattenedCategories = React.useMemo(() => {
    const list: { name: string; slug: string }[] = [];
    categories.forEach((cat: Category) => {
      list.push({ name: cat.name, slug: cat.slug });
      if (cat.children && cat.children.length > 0) {
        cat.children.forEach((sub: Category) => {
          list.push({ name: `${cat.name} — ${sub.name}`, slug: sub.slug });
        });
      }
    });
    return list;
  }, [categories]);

  // Fetch Products Live from Backend with Filters
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

  // Filter in-stock client side if active
  const filteredProducts = React.useMemo(() => {
    if (!inStockOnly) return products;
    return products.filter((p) => !p.manageStock || p.stockQuantity > 0);
  }, [products, inStockOnly]);

  const handleQuickAdd = (p: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const imageUrl =
      p.images?.[0]?.url || '/images/hero-bedroom-zen.webp';
    addItem({
      id: p.id,
      productId: p.id,
      name: p.name,
      price: typeof p.basePrice === 'string' ? parseFloat(p.basePrice) : p.basePrice,
      image: imageUrl,
      finish: p.productType === 'VARIABLE' ? 'Custom Hardwood' : 'Solid Kiln-Dried Timber',
    });

    setAddedId(p.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  const handleResetFilters = () => {
    setCategorySlug('ALL');
    setSearchQuery('');
    setSortBy('newest');
    setMinPrice('');
    setMaxPrice('');
    setInStockOnly(false);
    router.push('/shop');
  };

  const activeFiltersCount =
    (categorySlug !== 'ALL' ? 1 : 0) +
    (searchQuery ? 1 : 0) +
    (minPrice ? 1 : 0) +
    (maxPrice ? 1 : 0) +
    (inStockOnly ? 1 : 0);

  return (
    <div className="min-h-screen bg-zen-50">
      {/* 1. Catalog Atmospheric Header */}
      <section className="bg-white border-b border-border/60 pt-10 pb-12 sm:pt-14 sm:pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-shaad-800 font-semibold">Studio Catalog</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2 max-w-2xl">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.25em] text-shaad-800">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Heirloom Timber Furniture</span>
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif tracking-tight text-foreground">
                The Studio Collection
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground font-light leading-relaxed">
                Handcrafted from certified American black walnut and European white oak. Built without composite boards or veneers, shaped for quiet, slow living.
              </p>
            </div>

            <div className="text-xs text-muted-foreground self-start md:self-auto font-mono bg-zen-50 px-3.5 py-1.5 rounded-full border border-border/50">
              <span>{filteredProducts.length} pieces available</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Main Catalog Viewport */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Filter Sidebar (1 col) */}
          <aside className="hidden lg:block space-y-8 pr-2">
            <div className="flex items-center justify-between pb-3 border-b border-border/60">
              <h2 className="font-serif font-bold text-base text-foreground flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-shaad-800" />
                <span>Refine Selection</span>
              </h2>
              {activeFiltersCount > 0 && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-[11px] text-shaad-800 hover:text-shaad-900 font-medium flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset ({activeFiltersCount})</span>
                </button>
              )}
            </div>

            {/* Search Filter */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground tracking-wide uppercase">
                Search Catalog
              </label>
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Walnut bed, oak table..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 text-xs h-9 bg-white border-border/80 rounded-xl"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>

            {/* Category Filter */}
            <div className="space-y-2.5">
              <label className="text-xs font-semibold text-foreground tracking-wide uppercase">
                Collections & Spaces
              </label>
              <div className="space-y-1 text-xs">
                <button
                  type="button"
                  onClick={() => setCategorySlug('ALL')}
                  className={cn(
                    'w-full text-left px-3 py-2 rounded-xl transition-all flex items-center justify-between',
                    categorySlug === 'ALL'
                      ? 'bg-shaad-800 text-white font-medium shadow-2xs'
                      : 'text-muted-foreground hover:text-foreground hover:bg-white/80'
                  )}
                >
                  <span>All Studio Collections</span>
                  <span className="text-[10px] font-mono opacity-80">{products.length}</span>
                </button>
                {flattenedCategories.map((cat) => (
                  <button
                    key={cat.slug}
                    type="button"
                    onClick={() => setCategorySlug(cat.slug)}
                    className={cn(
                      'w-full text-left px-3 py-2 rounded-xl transition-all flex items-center justify-between',
                      categorySlug === cat.slug
                        ? 'bg-shaad-800 text-white font-medium shadow-2xs'
                        : 'text-muted-foreground hover:text-foreground hover:bg-white/80'
                    )}
                  >
                    <span className="truncate">{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range Filter */}
            <div className="space-y-2.5 pt-2 border-t border-border/50">
              <label className="text-xs font-semibold text-foreground tracking-wide uppercase">
                Price Range ($)
              </label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min="0"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="text-xs h-9 bg-white border-border/80 rounded-xl"
                />
                <span className="text-muted-foreground text-xs">—</span>
                <Input
                  type="number"
                  min="0"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="text-xs h-9 bg-white border-border/80 rounded-xl"
                />
              </div>
            </div>

            {/* In-Stock Filter */}
            <div className="pt-2 border-t border-border/50">
              <label className="flex items-center gap-2.5 cursor-pointer text-xs select-none">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="w-4 h-4 rounded border-border text-shaad-800 focus:ring-shaad-800"
                />
                <span className="text-foreground font-medium">In-Stock Pieces Only</span>
              </label>
            </div>

            {/* Studio Guarantee Banner */}
            <div className="p-4 rounded-2xl bg-white border border-border/60 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-shaad-800 font-semibold font-serif">
                <TreePine className="w-4 h-4" />
                <span>100% Solid Hardwood</span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Zero veneers, plywood, or particle board. Each piece includes white-glove room delivery & assembly.
              </p>
            </div>
          </aside>

          {/* Catalog Content Stage (3 cols) */}
          <main className="lg:col-span-3 space-y-6">
            {/* Top Bar: Sort By & Mobile Filter Trigger */}
            <div className="bg-white p-4 rounded-2xl border border-border/60 flex flex-wrap items-center justify-between gap-4">
              {/* Mobile Filter Button */}
              <div className="lg:hidden flex items-center gap-2">
                <Sheet open={mobileFilterOpen} onOpenChange={setMobileFilterOpen}>
                  <SheetTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-xl border-border/80 text-xs gap-1.5 h-9"
                    >
                      <SlidersHorizontal className="w-3.5 h-3.5 text-shaad-800" />
                      <span>Filters</span>
                      {activeFiltersCount > 0 && (
                        <span className="w-4 h-4 rounded-full bg-shaad-800 text-white text-[10px] flex items-center justify-center font-mono">
                          {activeFiltersCount}
                        </span>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80 bg-zen-50 overflow-y-auto">
                    <SheetHeader className="pb-4 border-b border-border/60">
                      <SheetTitle className="text-left font-serif text-lg">Filter Studio Pieces</SheetTitle>
                    </SheetHeader>
                    <div className="space-y-6 pt-4">
                      {/* Mobile Search */}
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-foreground uppercase">Search</label>
                        <Input
                          type="text"
                          placeholder="Search piece..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="text-xs h-9 bg-white"
                        />
                      </div>

                      {/* Mobile Categories */}
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-foreground uppercase">Collection</label>
                        <div className="space-y-1 text-xs">
                          <button
                            type="button"
                            onClick={() => {
                              setCategorySlug('ALL');
                              setMobileFilterOpen(false);
                            }}
                            className={cn(
                              'w-full text-left px-3 py-2 rounded-lg',
                              categorySlug === 'ALL' ? 'bg-shaad-800 text-white' : 'hover:bg-zen-100'
                            )}
                          >
                            All Collections
                          </button>
                          {flattenedCategories.map((cat) => (
                            <button
                              key={cat.slug}
                              type="button"
                              onClick={() => {
                                setCategorySlug(cat.slug);
                                setMobileFilterOpen(false);
                              }}
                              className={cn(
                                'w-full text-left px-3 py-2 rounded-lg truncate',
                                categorySlug === cat.slug ? 'bg-shaad-800 text-white' : 'hover:bg-zen-100'
                              )}
                            >
                              {cat.name}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Mobile Price */}
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-foreground uppercase">Price Range ($)</label>
                        <div className="flex gap-2">
                          <Input
                            type="number"
                            placeholder="Min"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                            className="text-xs h-9 bg-white"
                          />
                          <Input
                            type="number"
                            placeholder="Max"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                            className="text-xs h-9 bg-white"
                          />
                        </div>
                      </div>

                      <Button
                        className="w-full bg-shaad-800 text-white text-xs mt-4 rounded-xl"
                        onClick={() => setMobileFilterOpen(false)}
                      >
                        Apply Filters ({filteredProducts.length} Results)
                      </Button>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>

              {/* Active Filter Badges */}
              <div className="hidden sm:flex items-center gap-2 flex-wrap">
                {categorySlug !== 'ALL' && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zen-100 text-shaad-900 text-xs border border-border/60">
                    <span>Collection: {categorySlug}</span>
                    <button
                      type="button"
                      onClick={() => setCategorySlug('ALL')}
                      className="hover:text-destructive"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {searchQuery && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zen-100 text-shaad-900 text-xs border border-border/60">
                    <span>Query: &ldquo;{searchQuery}&rdquo;</span>
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="hover:text-destructive"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {(minPrice || maxPrice) && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zen-100 text-shaad-900 text-xs border border-border/60">
                    <span>Price: ${minPrice || '0'} - ${maxPrice || '∞'}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setMinPrice('');
                        setMaxPrice('');
                      }}
                      className="hover:text-destructive"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </div>

              {/* Sorting Dropdown */}
              <div className="flex items-center gap-2 ml-auto">
                <span className="text-xs text-muted-foreground font-medium hidden sm:inline">Sort:</span>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-zen-50 border border-border/80 text-foreground text-xs rounded-xl px-3 py-2 pr-8 focus:outline-hidden focus:ring-1 focus:ring-shaad-800 font-medium cursor-pointer"
                  >
                    <option value="newest">Newest Additions</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="name_asc">Name: A to Z</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Product Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="rounded-2xl bg-white p-4 border border-border/60 space-y-4 animate-pulse"
                  >
                    <div className="aspect-[4/3] bg-zen-100 rounded-xl" />
                    <div className="h-4 bg-zen-200 rounded w-3/4" />
                    <div className="h-3 bg-zen-100 rounded w-1/2" />
                    <div className="h-4 bg-zen-200 rounded w-1/3" />
                  </div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="rounded-3xl bg-white p-12 text-center border border-border/60 space-y-4 max-w-md mx-auto my-12">
                <div className="w-12 h-12 rounded-full bg-zen-100 text-muted-foreground flex items-center justify-center mx-auto">
                  <Search className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-serif font-bold text-lg text-foreground">
                    No Matching Furniture Pieces
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Try adjusting your category filter, clearing price limits, or searching for broader terms.
                  </p>
                </div>
                <Button
                  onClick={handleResetFilters}
                  variant="outline"
                  size="sm"
                  className="rounded-full text-xs"
                >
                  Reset All Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {filteredProducts.map((product) => {
                  const imgUrl =
                    product.images?.[0]?.url || '/images/hero-bedroom-zen.webp';
                  const isAdded = addedId === product.id;

                  return (
                    <Link
                      key={product.id}
                      href={`/shop/${product.slug}`}
                      className="group rounded-2xl bg-white border border-border/60 overflow-hidden shadow-2xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between block focus:outline-hidden focus-visible:ring-2 focus-visible:ring-shaad-800"
                    >
                      {/* Image Stage */}
                      <div className="relative aspect-[4/3] bg-zen-100/60 overflow-hidden">
                        <img
                          src={imgUrl}
                          alt={product.name}
                          onError={(e) => {
                            e.currentTarget.src = '/images/hero-bedroom-zen.webp';
                          }}
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                        />

                        {/* Category Pill */}
                        <div className="absolute top-3 left-3">
                          <span className="text-[10px] font-medium tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur-sm text-shaad-900 border border-black/5 shadow-2xs">
                            {product.category?.name || 'Solid Timber'}
                          </span>
                        </div>

                        {/* Quick Add Pill */}
                        <button
                          type="button"
                          onClick={(e) => handleQuickAdd(product, e)}
                          className={cn(
                            'absolute bottom-3 right-3 h-9 px-3 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all shadow-md',
                            isAdded
                              ? 'bg-emerald-700 text-white'
                              : 'bg-shaad-800 text-white hover:bg-shaad-900 opacity-90 group-hover:opacity-100'
                          )}
                          aria-label="Add to cart"
                        >
                          {isAdded ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>Added</span>
                            </>
                          ) : (
                            <>
                              <Plus className="w-3.5 h-3.5" />
                              <span>Add to Cart</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Content */}
                      <div className="p-5 space-y-2.5">
                        <div className="space-y-1">
                          <h3 className="font-semibold text-base text-foreground font-serif group-hover:text-shaad-800 transition-colors line-clamp-1">
                            {product.name}
                          </h3>
                          <p className="text-xs text-muted-foreground line-clamp-2 font-light leading-relaxed">
                            {product.shortDescription || '100% Solid Kiln-Dried Hardwood'}
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-2.5 border-t border-border/50 text-xs">
                          <span className="text-muted-foreground font-mono text-[11px]">
                            {product.productType === 'VARIABLE' ? 'Custom Finishes' : 'Natural Finish'}
                          </span>
                          <span className="font-bold text-sm font-mono text-shaad-900">
                            {formatCurrency(product.basePrice)}
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default function ShopCatalogPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-zen-50 flex items-center justify-center p-12">
          <div className="text-xs font-mono text-muted-foreground animate-pulse">
            Loading Studio Catalog...
          </div>
        </div>
      }
    >
      <ShopCatalogContent />
    </React.Suspense>
  );
}
