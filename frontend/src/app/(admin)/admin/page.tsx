'use client';

import * as React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import {
  Armchair,
  FolderTree,
  BookOpen,
  Users,
  Plus,
  ArrowRight,
  Sparkles,
  Layers,
  Palette,
  Package,
  ShoppingBag,
  CreditCard,
  Tag,
  Search,
  X,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Truck,
  Percent,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Image as ImageIcon,
} from 'lucide-react';
import { api } from '@/lib/api';
import { Header } from '@/components/admin/header';
import { KpiCard } from '@/components/admin/kpi-card';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatCurrency, formatDate, cn } from '@/lib/utils';
import { Order, Product, Coupon } from '@/types';

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [activeFilter, setActiveFilter] = React.useState<'all' | 'pending' | 'low_stock' | 'coupons'>('all');

  // Queries
  const { data: orderStats, isLoading: statsLoading } = useQuery({
    queryKey: ['order-stats'],
    queryFn: () => api.getOrderStats(),
  });

  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => api.getProducts(),
  });

  const { data: coupons = [], isLoading: couponsLoading } = useQuery({
    queryKey: ['coupons'],
    queryFn: () => api.getCoupons(),
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['categories-flat'],
    queryFn: () => api.getCategoriesFlat(),
  });

  const { data: attributes = [] } = useQuery({
    queryKey: ['attributes'],
    queryFn: () => api.getAttributes(),
  });

  const { data: blogPosts = [] } = useQuery({
    queryKey: ['blog-posts'],
    queryFn: () => api.getBlogPosts(),
  });

  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: () => api.getUsers(),
  });

  const { data: mediaItems = [] } = useQuery({
    queryKey: ['media-count'],
    queryFn: () => api.getMedia(),
  });

  // Derived metrics
  const totalRevenue = orderStats?.totalRevenue || 0;
  const totalOrders = orderStats?.totalOrders || 0;
  const averageOrderValue = orderStats?.averageOrderValue || 0;
  const pendingCount = orderStats?.pendingCount || 0;
  const processingCount = orderStats?.processingCount || 0;
  const ordersToFulfill = pendingCount + processingCount;

  // Inventory calculations
  const lowStockProducts = React.useMemo(() => {
    return products.filter((p) => p.stockQuantity !== null && p.stockQuantity !== undefined && p.stockQuantity <= 5);
  }, [products]);

  const outOfStockCount = React.useMemo(() => {
    return products.filter((p) => p.stockQuantity === 0).length;
  }, [products]);

  const activeCoupons = React.useMemo(() => {
    return coupons.filter((c) => c.isActive);
  }, [coupons]);

  const variableCount = products.filter((p) => p.productType === 'VARIABLE').length;
  const simpleCount = products.filter((p) => p.productType === 'SIMPLE').length;
  const totalVariants = products.reduce((acc, p) => acc + (p.variants?.length || 0), 0);

  // Quick Action Destinations for Omnibar Search
  const quickActions = React.useMemo(() => [
    { title: 'New Handcrafted Product', description: 'Create simple or multi-attribute furniture', href: '/products', icon: Armchair, category: 'Action' },
    { title: 'Orders Fulfillment Queue', description: 'Review pending orders and shipping status', href: '/orders', icon: ShoppingBag, category: 'Action' },
    { title: 'Create Coupon Code', description: 'Launch percentage or fixed Tomans promotion', href: '/coupons', icon: Tag, category: 'Action' },
    { title: 'Wood Stains & Finishes', description: 'Manage swatch colors, grain textures & attributes', href: '/attributes', icon: Palette, category: 'Action' },
    { title: 'Category Tree Hierarchy', description: 'Organize living room, dining, and custom pieces', href: '/categories', icon: FolderTree, category: 'Action' },
    { title: 'Media Library & Textures', description: 'High-resolution furniture photography and WebP assets', href: '/media', icon: ImageIcon, category: 'Action' },
    { title: 'Blog & Woodcraft Editorial', description: 'Publish articles, woodworking care guides and stories', href: '/blog', icon: BookOpen, category: 'Action' },
    { title: 'Customer Directory', description: 'Manage registered clients, addresses and profiles', href: '/users', icon: Users, category: 'Action' },
  ], []);

  // Filtered search results
  const searchResults = React.useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return null;

    const matchedOrders = (orderStats?.recentOrders || []).filter((o) =>
      o.orderNumber.toLowerCase().includes(q) ||
      o.customerName.toLowerCase().includes(q) ||
      o.customerEmail.toLowerCase().includes(q) ||
      o.status.toLowerCase().includes(q) ||
      (o.shippingCarrier && o.shippingCarrier.toLowerCase().includes(q))
    );

    const matchedProducts = products.filter((p) =>
      p.name.toLowerCase().includes(q) ||
      (p.sku && p.sku.toLowerCase().includes(q)) ||
      (p.category?.name && p.category.name.toLowerCase().includes(q))
    );

    const matchedCoupons = coupons.filter((c) =>
      c.code.toLowerCase().includes(q) ||
      (c.description && c.description.toLowerCase().includes(q))
    );

    const matchedActions = quickActions.filter((a) =>
      a.title.toLowerCase().includes(q) ||
      a.description.toLowerCase().includes(q)
    );

    return {
      orders: matchedOrders,
      products: matchedProducts,
      coupons: matchedCoupons,
      actions: matchedActions,
      totalCount: matchedOrders.length + matchedProducts.length + matchedCoupons.length + matchedActions.length,
    };
  }, [searchQuery, orderStats?.recentOrders, products, coupons, quickActions]);

  // Orders filtered by active chip
  const displayedOrders = React.useMemo(() => {
    const list = orderStats?.recentOrders || [];
    if (activeFilter === 'pending') {
      return list.filter((o) => o.status === 'PENDING' || o.status === 'PROCESSING');
    }
    return list;
  }, [orderStats?.recentOrders, activeFilter]);

  // Formatted current date
  const todayFormatted = React.useMemo(() => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date());
  }, []);

  return (
    <div className="space-y-6 sm:space-y-8 pb-12">
      <Header title="Dashboard" />

      <div className="px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8 max-w-7xl mx-auto">
        {/* ======================================================== */}
        {/* 1. WELCOME & OPERATIONS HEADER                           */}
        {/* ======================================================== */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 text-xs text-muted-foreground font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Woodcraft Studio Operations</span>
              <span className="text-border">•</span>
              <span>{todayFormatted}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Shaadwood Commerce & Workshop
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Handcrafted furniture catalog, order fulfillment pipelines, and live inventory watch.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 shrink-0">
            <Link href="/products">
              <Button
                size="sm"
                className="gap-1.5 text-xs shadow-2xs font-semibold"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Product
              </Button>
            </Link>
            <Link href="/orders">
              <Button
                size="sm"
                variant="outline"
                className="gap-1.5 text-xs shadow-2xs bg-card hover:bg-accent"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-primary" />
                Orders ({ordersToFulfill})
              </Button>
            </Link>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 2. SMART OMNIBAR & DASHBOARD SEARCH                      */}
        {/* ======================================================== */}
        <div className="space-y-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
              <Search className="w-4 h-4" />
            </div>
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search orders (e.g. #ORD-2026-001, customer name), catalog products, coupons, or actions..."
              className="pl-10 pr-10 py-2.5 h-11 bg-card/70 border-border/70 rounded-xl text-xs sm:text-sm shadow-2xs focus-visible:ring-primary/30 transition-all placeholder:text-muted-foreground/70"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-muted-foreground hover:text-foreground"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Filter Status Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-0.5">
            <button
              type="button"
              onClick={() => {
                setActiveFilter('all');
                setSearchQuery('');
              }}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium transition-all border select-none',
                activeFilter === 'all' && !searchQuery
                  ? 'bg-primary text-primary-foreground border-primary shadow-2xs'
                  : 'bg-card/70 text-muted-foreground hover:text-foreground border-border/60 hover:bg-accent/50'
              )}
            >
              All Operations
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveFilter('pending');
                setSearchQuery('');
              }}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium transition-all border flex items-center gap-1.5 select-none',
                activeFilter === 'pending' && !searchQuery
                  ? 'bg-amber-600 text-white border-amber-600 shadow-2xs'
                  : 'bg-card/70 text-muted-foreground hover:text-foreground border-border/60 hover:bg-accent/50'
              )}
            >
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              <span>Needs Fulfillment</span>
              <span className="font-mono text-[10px] bg-amber-500/20 text-amber-700 dark:text-amber-300 px-1.5 py-0.2 rounded font-semibold">
                {ordersToFulfill}
              </span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveFilter('low_stock');
                setSearchQuery('');
              }}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium transition-all border flex items-center gap-1.5 select-none',
                activeFilter === 'low_stock' && !searchQuery
                  ? 'bg-red-600 text-white border-red-600 shadow-2xs'
                  : 'bg-card/70 text-muted-foreground hover:text-foreground border-border/60 hover:bg-accent/50'
              )}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
              <span>Low Stock Alerts</span>
              <span className="font-mono text-[10px] bg-red-500/20 text-red-700 dark:text-red-300 px-1.5 py-0.2 rounded font-semibold">
                {lowStockProducts.length}
              </span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveFilter('coupons');
                setSearchQuery('');
              }}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium transition-all border flex items-center gap-1.5 select-none',
                activeFilter === 'coupons' && !searchQuery
                  ? 'bg-wood-700 text-white border-wood-700 shadow-2xs'
                  : 'bg-card/70 text-muted-foreground hover:text-foreground border-border/60 hover:bg-accent/50'
              )}
            >
              <Tag className="w-3.5 h-3.5 text-wood-600" />
              <span>Active Promos</span>
              <span className="font-mono text-[10px] bg-wood-500/20 text-wood-700 dark:text-wood-300 px-1.5 py-0.2 rounded font-semibold">
                {activeCoupons.length}
              </span>
            </button>
          </div>

          {/* Instant Omnibar Search Results Panel */}
          {searchResults && (
            <Card className="border-primary/40 shadow-md bg-card animate-in fade-in-50 duration-150">
              <CardHeader className="py-3 px-4 border-b border-border/60 flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-primary" />
                  <CardTitle className="text-xs font-bold uppercase tracking-wider text-foreground">
                    Search Results ({searchResults.totalCount} matches)
                  </CardTitle>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSearchQuery('')}
                  className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
                >
                  Close
                </Button>
              </CardHeader>
              <CardContent className="p-4 space-y-4 max-h-[420px] overflow-y-auto">
                {searchResults.totalCount === 0 ? (
                  <div className="text-center py-6 text-xs text-muted-foreground">
                    No orders, catalog products, coupons, or actions matching &quot;{searchQuery}&quot;
                  </div>
                ) : (
                  <>
                    {/* Matching Orders */}
                    {searchResults.orders.length > 0 && (
                      <div className="space-y-1.5">
                        <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground px-1">
                          Orders ({searchResults.orders.length})
                        </div>
                        <div className="space-y-1">
                          {searchResults.orders.map((ord) => (
                            <Link
                              key={ord.id}
                              href={`/orders/${ord.id}`}
                              className="flex items-center justify-between p-2.5 rounded-lg border border-border/60 hover:bg-accent/60 transition-colors text-xs"
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <span className="font-mono font-bold text-primary shrink-0">{ord.orderNumber}</span>
                                <div className="truncate">
                                  <span className="font-semibold text-foreground">{ord.customerName}</span>
                                  <span className="text-muted-foreground text-[11px] ml-2 truncate">({ord.customerEmail})</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-3 shrink-0">
                                <span className="font-bold text-foreground font-mono">{formatCurrency(ord.totalAmount)}</span>
                                <Badge variant="outline" className="text-[10px]">
                                  {ord.status}
                                </Badge>
                                <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Matching Products */}
                    {searchResults.products.length > 0 && (
                      <div className="space-y-1.5">
                        <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground px-1">
                          Products ({searchResults.products.length})
                        </div>
                        <div className="space-y-1">
                          {searchResults.products.map((p) => (
                            <Link
                              key={p.id}
                              href={`/products`}
                              className="flex items-center justify-between p-2.5 rounded-lg border border-border/60 hover:bg-accent/60 transition-colors text-xs"
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <Armchair className="w-3.5 h-3.5 text-wood-700 shrink-0" />
                                <div className="truncate">
                                  <span className="font-semibold text-foreground">{p.name}</span>
                                  {p.sku && <span className="text-muted-foreground font-mono text-[11px] ml-2">SKU: {p.sku}</span>}
                                </div>
                              </div>
                              <div className="flex items-center gap-3 shrink-0">
                                <span className="font-medium text-foreground">{formatCurrency(p.basePrice)}</span>
                                <Badge
                                  variant={p.stockQuantity <= 0 ? 'destructive' : 'outline'}
                                  className="text-[10px]"
                                >
                                  {p.stockQuantity <= 0 ? 'Out of stock' : `${p.stockQuantity} in stock`}
                                </Badge>
                                <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Matching Coupons */}
                    {searchResults.coupons.length > 0 && (
                      <div className="space-y-1.5">
                        <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground px-1">
                          Promotional Coupons ({searchResults.coupons.length})
                        </div>
                        <div className="space-y-1">
                          {searchResults.coupons.map((c) => (
                            <Link
                              key={c.id}
                              href={`/coupons`}
                              className="flex items-center justify-between p-2.5 rounded-lg border border-border/60 hover:bg-accent/60 transition-colors text-xs"
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <Tag className="w-3.5 h-3.5 text-primary shrink-0" />
                                <div className="truncate">
                                  <span className="font-mono font-bold text-primary">{c.code}</span>
                                  {c.description && <span className="text-muted-foreground text-[11px] ml-2">({c.description})</span>}
                                </div>
                              </div>
                              <div className="flex items-center gap-3 shrink-0">
                                <span className="font-medium text-foreground">
                                  {c.discountType === 'PERCENTAGE' ? `${c.discountValue}% OFF` : `${formatCurrency(c.discountValue)} OFF`}
                                </span>
                                <Badge variant={c.isActive ? 'wood' : 'secondary'} className="text-[10px]">
                                  {c.isActive ? 'Active' : 'Disabled'}
                                </Badge>
                                <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Matching Quick Actions */}
                    {searchResults.actions.length > 0 && (
                      <div className="space-y-1.5">
                        <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground px-1">
                          Admin Actions ({searchResults.actions.length})
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                          {searchResults.actions.map((act) => {
                            const Icon = act.icon;
                            return (
                              <Link
                                key={act.title}
                                href={act.href}
                                className="flex items-center gap-2.5 p-2 rounded-lg border border-border/60 hover:bg-accent/60 transition-colors text-xs"
                              >
                                <div className="w-7 h-7 rounded-md bg-wood-100 flex items-center justify-center text-primary shrink-0">
                                  <Icon className="w-3.5 h-3.5" />
                                </div>
                                <div className="min-w-0 truncate">
                                  <div className="font-semibold text-foreground truncate">{act.title}</div>
                                  <div className="text-[11px] text-muted-foreground truncate">{act.description}</div>
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* ======================================================== */}
        {/* 3. CORE OPERATIONAL KPIS                                  */}
        {/* ======================================================== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          <Link href="/orders" className="block group">
            <KpiCard
              title="Gross Revenue"
              value={statsLoading ? '...' : formatCurrency(totalRevenue)}
              subtitle={`${totalOrders} Orders · Avg: ${formatCurrency(averageOrderValue)}`}
              icon={CreditCard}
              iconColor="text-emerald-700 dark:text-emerald-400 group-hover:scale-105 transition-transform"
            />
          </Link>

          <Link href="/orders" className="block group">
            <KpiCard
              title="Orders to Fulfill"
              value={statsLoading ? '...' : ordersToFulfill}
              subtitle={`${pendingCount} Pending · ${processingCount} in Workshop`}
              icon={ShoppingBag}
              iconColor="text-amber-700 dark:text-amber-400 group-hover:scale-105 transition-transform"
            />
          </Link>

          <Link href="/products" className="block group">
            <KpiCard
              title="Inventory Health"
              value={productsLoading ? '...' : lowStockProducts.length > 0 ? `${lowStockProducts.length} Items Low` : 'Optimal'}
              subtitle={
                lowStockProducts.length > 0
                  ? `${outOfStockCount} out of stock · ${lowStockProducts.length - outOfStockCount} critical`
                  : 'All catalog items well-stocked'
              }
              icon={Package}
              iconColor={
                lowStockProducts.length > 0
                  ? 'text-red-700 dark:text-red-400 group-hover:scale-105 transition-transform'
                  : 'text-emerald-700 dark:text-emerald-400 group-hover:scale-105 transition-transform'
              }
            />
          </Link>

          <Link href="/coupons" className="block group">
            <KpiCard
              title="Promotional Codes"
              value={couponsLoading ? '...' : `${activeCoupons.length} Active`}
              subtitle={`${coupons.length} Total Promotional Rules`}
              icon={Tag}
              iconColor="text-wood-700 dark:text-wood-400 group-hover:scale-105 transition-transform"
            />
          </Link>
        </div>

        {/* ======================================================== */}
        {/* 4. MAIN OPERATIONAL GRID (2 COLUMNS DESKTOP / 1 MOBILE)  */}
        {/* ======================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          {/* ------------------------------------------------------ */}
          {/* LEFT COLUMN: ORDERS STREAM & QUICK SHORTCUTS (8/12)    */}
          {/* ------------------------------------------------------ */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-6 sm:space-y-8">
            {/* Recent Orders & Workshop Dispatch */}
            <Card className="shadow-2xs border-border/70 overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between pb-3 px-4 sm:px-6">
                <div>
                  <CardTitle className="text-sm sm:text-base flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-primary" />
                    <span>Recent Orders & Workshop Stream</span>
                  </CardTitle>
                  <CardDescription className="text-xs">
                    {activeFilter === 'pending'
                      ? 'Showing orders awaiting workshop assembly and shipment'
                      : 'Live customer orders across all payment gateways'}
                  </CardDescription>
                </div>
                <Link href="/orders">
                  <Button variant="ghost" size="sm" className="text-xs gap-1 text-primary hover:text-primary px-2">
                    View All <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </CardHeader>

              {/* Desktop Orders Table */}
              <div className="hidden sm:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="w-[120px]">Order #</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Carrier & Method</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                      <TableHead className="text-right pr-4">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {statsLoading ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground text-xs">
                          Loading recent orders...
                        </TableCell>
                      </TableRow>
                    ) : displayedOrders.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground text-xs">
                          {activeFilter === 'pending'
                            ? 'No orders awaiting fulfillment.'
                            : 'No customer orders recorded yet.'}
                        </TableCell>
                      </TableRow>
                    ) : (
                      displayedOrders.slice(0, 6).map((ord) => (
                        <TableRow key={ord.id} className="hover:bg-muted/40 transition-colors">
                          <TableCell className="font-semibold text-primary font-mono text-xs">
                            <Link href={`/orders/${ord.id}`} className="hover:underline flex items-center gap-1">
                              {ord.orderNumber}
                            </Link>
                          </TableCell>
                          <TableCell className="text-xs">
                            <div className="font-medium text-foreground">{ord.customerName}</div>
                            <div className="text-muted-foreground text-[11px] truncate max-w-[160px]">{ord.customerEmail}</div>
                          </TableCell>
                          <TableCell className="text-xs">
                            <div className="text-foreground font-medium flex items-center gap-1.5">
                              <Truck className="w-3 h-3 text-muted-foreground" />
                              <span>{ord.shippingCarrier || ord.shippingMethod || 'Standard Delivery'}</span>
                            </div>
                            <div className="text-[11px] text-muted-foreground">
                              {ord.paymentMethod?.toUpperCase().includes('ZARINPAL') ? 'زرین‌پال (شاپرک)' : ord.paymentMethod}
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-bold text-foreground text-xs font-mono">
                            {formatCurrency(ord.totalAmount)}
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge
                              variant="outline"
                              className={
                                ord.status === 'DELIVERED'
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300 text-[10px]'
                                  : ord.status === 'PROCESSING'
                                  ? 'bg-blue-50 text-blue-700 border-blue-300 text-[10px]'
                                  : ord.status === 'SHIPPED'
                                  ? 'bg-purple-50 text-purple-700 border-purple-300 text-[10px]'
                                  : ord.status === 'CANCELLED'
                                  ? 'bg-zinc-100 text-zinc-600 border-zinc-300 text-[10px]'
                                  : 'bg-amber-50 text-amber-700 border-amber-300 text-[10px]'
                              }
                            >
                              {ord.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right pr-4">
                            <Link href={`/orders/${ord.id}`}>
                              <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground">
                                <ArrowRight className="w-3.5 h-3.5" />
                              </Button>
                            </Link>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Orders Responsive Card View (No Horizontal Table Overflow) */}
              <div className="block sm:hidden divide-y divide-border/60">
                {statsLoading ? (
                  <div className="text-center py-6 text-xs text-muted-foreground">
                    Loading orders...
                  </div>
                ) : displayedOrders.length === 0 ? (
                  <div className="text-center py-6 text-xs text-muted-foreground">
                    No orders found.
                  </div>
                ) : (
                  displayedOrders.slice(0, 5).map((ord) => (
                    <Link
                      key={ord.id}
                      href={`/orders/${ord.id}`}
                      className="block p-4 hover:bg-accent/40 transition-colors space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-primary">{ord.orderNumber}</span>
                        <Badge
                          variant="outline"
                          className={
                            ord.status === 'DELIVERED'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-300 text-[10px]'
                              : ord.status === 'PROCESSING'
                              ? 'bg-blue-50 text-blue-700 border-blue-300 text-[10px]'
                              : ord.status === 'SHIPPED'
                              ? 'bg-purple-50 text-purple-700 border-purple-300 text-[10px]'
                              : ord.status === 'CANCELLED'
                              ? 'bg-zinc-100 text-zinc-600 border-zinc-300 text-[10px]'
                              : 'bg-amber-50 text-amber-700 border-amber-300 text-[10px]'
                          }
                        >
                          {ord.status}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-foreground">{ord.customerName}</span>
                        <span className="font-bold text-foreground font-mono">{formatCurrency(ord.totalAmount)}</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                        <span>{ord.shippingCarrier || 'Standard Delivery'}</span>
                        <span>{formatDate(ord.createdAt)}</span>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </Card>

            {/* Quick Admin Navigation Shortcuts (2x2 Grid) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Quick Studio Shortcuts
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <Link
                  href="/products"
                  className="p-4 rounded-xl border border-border/70 bg-card/60 hover:bg-accent/50 hover:border-border transition-all flex items-start gap-3.5 group shadow-2xs"
                >
                  <div className="w-10 h-10 rounded-xl bg-wood-100 dark:bg-wood-900/40 text-wood-800 dark:text-wood-200 flex items-center justify-center shrink-0 border border-wood-200/50 group-hover:scale-105 transition-transform">
                    <Armchair className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-xs text-foreground flex items-center justify-between">
                      <span>Catalog Products</span>
                      <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all" />
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                      Handcrafted simple & multi-variant models, pricing and specifications.
                    </p>
                  </div>
                </Link>

                <Link
                  href="/orders"
                  className="p-4 rounded-xl border border-border/70 bg-card/60 hover:bg-accent/50 hover:border-border transition-all flex items-start gap-3.5 group shadow-2xs"
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-200 flex items-center justify-center shrink-0 border border-amber-200/50 group-hover:scale-105 transition-transform">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-xs text-foreground flex items-center justify-between">
                      <span>Orders & Shipping</span>
                      <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all" />
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                      Review payments, mark as shipped, and track dispatch status.
                    </p>
                  </div>
                </Link>

                <Link
                  href="/coupons"
                  className="p-4 rounded-xl border border-border/70 bg-card/60 hover:bg-accent/50 hover:border-border transition-all flex items-start gap-3.5 group shadow-2xs"
                >
                  <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-200 flex items-center justify-center shrink-0 border border-purple-200/50 group-hover:scale-105 transition-transform">
                    <Tag className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-xs text-foreground flex items-center justify-between">
                      <span>Coupons & Promos</span>
                      <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all" />
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                      Issue discount codes with date restrictions and usage quotas.
                    </p>
                  </div>
                </Link>

                <Link
                  href="/attributes"
                  className="p-4 rounded-xl border border-border/70 bg-card/60 hover:bg-accent/50 hover:border-border transition-all flex items-start gap-3.5 group shadow-2xs"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-200 flex items-center justify-center shrink-0 border border-emerald-200/50 group-hover:scale-105 transition-transform">
                    <Palette className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-xs text-foreground flex items-center justify-between">
                      <span>Wood Finishes & Swatches</span>
                      <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all" />
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                      Walnut, Oak stains, and upholstery fabric color swatches.
                    </p>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* ------------------------------------------------------ */}
          {/* RIGHT COLUMN: INVENTORY WATCH & ACTIVE CAMPAIGNS (4/12) */}
          {/* ------------------------------------------------------ */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-6 sm:space-y-8">
            {/* Inventory Attention / Low Stock Card */}
            <Card className="shadow-2xs border-border/70">
              <CardHeader className="pb-3 px-4 sm:px-6 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Package className="w-4 h-4 text-primary" />
                    <span>Inventory Attention</span>
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Stock replenishment and reorder watch
                  </CardDescription>
                </div>
                <Link href="/products">
                  <Button variant="ghost" size="sm" className="text-xs text-primary hover:text-primary h-7 px-2">
                    Manage
                  </Button>
                </Link>
              </CardHeader>
              <CardContent className="px-4 sm:px-6 pb-5 space-y-2.5">
                {productsLoading ? (
                  <div className="text-center py-6 text-xs text-muted-foreground">
                    Checking inventory levels...
                  </div>
                ) : lowStockProducts.length === 0 ? (
                  <div className="p-4 rounded-xl border border-emerald-200/60 bg-emerald-50/50 dark:bg-emerald-950/20 text-center space-y-1.5">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400 mx-auto" />
                    <div className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                      Catalog Stock Optimal
                    </div>
                    <div className="text-[11px] text-emerald-700/80 dark:text-emerald-400/80">
                      All active handcrafted models have sufficient inventory in workshop.
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {lowStockProducts.slice(0, 5).map((p) => (
                      <div
                        key={p.id}
                        className="flex items-center justify-between p-2.5 rounded-lg border border-border/60 bg-card/60 hover:bg-accent/40 transition-colors text-xs"
                      >
                        <div className="min-w-0 pr-2">
                          <div className="font-semibold text-foreground truncate">{p.name}</div>
                          <div className="text-[11px] text-muted-foreground flex items-center gap-1.5 mt-0.5">
                            {p.sku && <span className="font-mono">{p.sku}</span>}
                            {p.sku && <span>·</span>}
                            <span>{formatCurrency(p.basePrice)}</span>
                          </div>
                        </div>
                        <Badge
                          variant={p.stockQuantity <= 0 ? 'destructive' : 'outline'}
                          className={cn(
                            'text-[10px] shrink-0 font-medium',
                            p.stockQuantity <= 0
                              ? 'bg-red-500/15 text-red-700 dark:text-red-300 border-red-300'
                              : 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-300'
                          )}
                        >
                          {p.stockQuantity <= 0 ? '0 Left' : `${p.stockQuantity} Left`}
                        </Badge>
                      </div>
                    ))}
                    {lowStockProducts.length > 5 && (
                      <Link href="/products" className="block pt-1 text-center">
                        <span className="text-[11px] text-primary hover:underline font-medium">
                          + {lowStockProducts.length - 5} more low stock products
                        </span>
                      </Link>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Active Promotional Campaigns */}
            <Card className="shadow-2xs border-border/70">
              <CardHeader className="pb-3 px-4 sm:px-6 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Tag className="w-4 h-4 text-primary" />
                    <span>Active Promo Codes</span>
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Live promotional codes running in storefront
                  </CardDescription>
                </div>
                <Link href="/coupons">
                  <Button variant="ghost" size="sm" className="text-xs text-primary hover:text-primary h-7 px-2">
                    View All
                  </Button>
                </Link>
              </CardHeader>
              <CardContent className="px-4 sm:px-6 pb-5 space-y-2.5">
                {couponsLoading ? (
                  <div className="text-center py-6 text-xs text-muted-foreground">
                    Loading promotional campaigns...
                  </div>
                ) : activeCoupons.length === 0 ? (
                  <div className="p-4 rounded-xl border border-dashed border-border/70 text-center space-y-2">
                    <Tag className="w-5 h-5 text-muted-foreground mx-auto" />
                    <div className="text-xs font-semibold text-foreground">No Active Campaigns</div>
                    <div className="text-[11px] text-muted-foreground">
                      Create a discount code to boost sales for new collections.
                    </div>
                    <Link href="/coupons" className="inline-block pt-1">
                      <Button size="sm" variant="outline" className="text-xs h-7">
                        Create Promo Code
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {activeCoupons.slice(0, 4).map((c) => (
                      <div
                        key={c.id}
                        className="flex items-center justify-between p-2.5 rounded-lg border border-border/60 bg-card/60 hover:bg-accent/40 transition-colors text-xs"
                      >
                        <div className="min-w-0 pr-2">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono font-bold text-primary">{c.code}</span>
                            <span className="text-[10px] text-muted-foreground font-mono">({c.usageCount} uses)</span>
                          </div>
                          <div className="text-[11px] text-muted-foreground mt-0.5 truncate">
                            {c.endDate ? `Valid until ${formatDate(c.endDate)}` : 'No expiration date'}
                          </div>
                        </div>
                        <Badge variant="wood" className="text-[10px] shrink-0">
                          {c.discountType === 'PERCENTAGE'
                            ? `${c.discountValue}% OFF`
                            : `${formatCurrency(c.discountValue)} OFF`}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Studio Distribution & Health Summary */}
            <Card className="shadow-2xs border-border/70">
              <CardHeader className="pb-3 px-4 sm:px-6">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Layers className="w-4 h-4 text-primary" />
                  <span>Studio Catalog Snapshot</span>
                </CardTitle>
                <CardDescription className="text-xs">
                  PostgreSQL database inventory distribution
                </CardDescription>
              </CardHeader>
              <CardContent className="px-4 sm:px-6 pb-5 space-y-2 text-xs">
                <div className="flex items-center justify-between py-1.5 border-b border-border/50">
                  <span className="text-muted-foreground">Total Furniture Models</span>
                  <span className="font-bold text-foreground">{products.length}</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-border/50">
                  <span className="text-muted-foreground">Multi-Attribute Variable Models</span>
                  <span className="font-bold text-foreground">{variableCount} ({totalVariants} SKUs)</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-border/50">
                  <span className="text-muted-foreground">Simple Standalone Products</span>
                  <span className="font-bold text-foreground">{simpleCount}</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-border/50">
                  <span className="text-muted-foreground">Wood & Fabric Swatch Attributes</span>
                  <span className="font-bold text-foreground">{attributes.length}</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-border/50">
                  <span className="text-muted-foreground">Published Editorial Articles</span>
                  <span className="font-bold text-foreground">{blogPosts.length}</span>
                </div>
                <div className="flex items-center justify-between py-1.5">
                  <span className="text-muted-foreground">Media & Texture Assets</span>
                  <span className="font-bold text-foreground">{mediaItems.length}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
