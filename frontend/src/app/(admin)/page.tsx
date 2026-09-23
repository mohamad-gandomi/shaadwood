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
  TrendingUp,
} from 'lucide-react';
import { api } from '@/lib/api';
import { Header } from '@/components/admin/header';
import { KpiCard } from '@/components/admin/kpi-card';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatCurrency } from '@/lib/utils';

export default function DashboardPage() {
  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => api.getProducts(),
  });

  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
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

  const { data: orderStats } = useQuery({
    queryKey: ['order-stats'],
    queryFn: () => api.getOrderStats(),
  });

  // Derived statistics
  const variableCount = products.filter((p) => p.productType === 'VARIABLE').length;
  const simpleCount = products.filter((p) => p.productType === 'SIMPLE').length;
  const totalVariants = products.reduce((acc, p) => acc + (p.variants?.length || 0), 0);

  return (
    <div className="space-y-8">
      <Header title="Furniture Shop Overview" />

      <div className="px-8 space-y-8 max-w-7xl mx-auto">
        {/* Welcome Banner */}
        <div className="rounded-2xl bg-gradient-to-r from-wood-800 via-wood-700 to-primary text-white p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>WooCommerce-Style Modular System</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Shaadwood Catalog & Commerce</h2>
            <p className="text-wood-200 text-sm max-w-xl leading-relaxed">
              Manage handcrafted furniture, multi-attribute variations (wood stains, upholstery fabrics), hierarchical category trees, and design editorial content.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href="/products">
              <Button variant="secondary" className="bg-white text-wood-900 hover:bg-wood-100 font-semibold gap-2">
                <Plus className="w-4 h-4" />
                Manage Products
              </Button>
            </Link>
            <Link href="/attributes">
              <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 gap-2">
                <Palette className="w-4 h-4" />
                Swatches & Terms
              </Button>
            </Link>
          </div>
        </div>

        {/* KPI Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <KpiCard
            title="Total Revenue"
            value={formatCurrency(orderStats?.totalRevenue || 0)}
            subtitle={`${orderStats?.totalOrders || 0} Orders · Avg: ${formatCurrency(orderStats?.averageOrderValue || 0)}`}
            icon={CreditCard}
            iconColor="text-emerald-700"
          />
          <KpiCard
            title="Orders to Fulfill"
            value={orderStats?.pendingCount || 0}
            subtitle={`${orderStats?.processingCount || 0} in Workshop Assembly`}
            icon={ShoppingBag}
            iconColor="text-amber-700"
          />
          <KpiCard
            title="Catalog Products"
            value={productsLoading ? '...' : products.length}
            subtitle={`${variableCount} Variable · ${simpleCount} Simple`}
            icon={Armchair}
          />
          <KpiCard
            title="Active Variations"
            value={productsLoading ? '...' : totalVariants}
            subtitle="Generated SKU combinations"
            icon={Layers}
            iconColor="text-wood-600"
          />
        </div>

        {/* Recent Products & Live Variations Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle>Catalog Products</CardTitle>
                <CardDescription>Live products and variations stored in PostgreSQL</CardDescription>
              </div>
              <Link href="/products">
                <Button variant="ghost" size="sm" className="text-xs gap-1 text-primary hover:text-primary">
                  View All <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Base Price</TableHead>
                    <TableHead>Variations</TableHead>
                    <TableHead>Category</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                        {productsLoading ? 'Loading products from backend...' : 'No products found.'}
                      </TableCell>
                    </TableRow>
                  ) : (
                    products.slice(0, 5).map((p) => (
                      <TableRow key={p.id}>
                        <TableCell className="font-semibold text-foreground">
                          <div>
                            <div>{p.name}</div>
                            {p.sku && <div className="text-xs text-muted-foreground font-mono">{p.sku}</div>}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={p.productType === 'VARIABLE' ? 'wood' : 'secondary'}>
                            {p.productType}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">
                          {formatCurrency(p.basePrice)}
                        </TableCell>
                        <TableCell>
                          {p.productType === 'VARIABLE' ? (
                            <span className="inline-flex items-center gap-1.5 font-medium text-xs text-wood-700 bg-wood-100 px-2 py-0.5 rounded-md">
                              <Layers className="w-3 h-3" />
                              {p.variants?.length || 0} variations
                            </span>
                          ) : (
                            <span className="text-xs text-muted-foreground">Single product</span>
                          )}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {p.category?.name || 'Uncategorized'}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Quick Actions & Attributes Overview */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Product Attributes & Swatches</CardTitle>
                <CardDescription>Global attributes used for product variants</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {attributes.map((attr) => (
                  <div key={attr.id} className="p-3 rounded-lg border border-border/70 bg-card/60 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm">{attr.name}</span>
                      <span className="text-xs font-mono text-muted-foreground">{attr.slug}</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {attr.values?.map((val) => (
                        <div
                          key={val.id}
                          className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-muted text-[11px] font-medium"
                        >
                          {val.image ? (
                            <img
                              src={val.image}
                              alt={val.name}
                              className="w-3 h-3 rounded-full object-cover border border-black/10 shrink-0"
                            />
                          ) : val.colorHex ? (
                            <span
                              className="w-2.5 h-2.5 rounded-full border border-black/20 shrink-0"
                              style={{ backgroundColor: val.colorHex }}
                            />
                          ) : null}
                          <span>{val.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                <Link href="/attributes" className="block pt-2">
                  <Button variant="outline" size="sm" className="w-full text-xs">
                    Manage Swatches & Attributes
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Orders Section */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-primary" />
                Recent Orders & Production Status
              </CardTitle>
              <CardDescription>Latest customer orders across all payment gateways</CardDescription>
            </div>
            <Link href="/orders">
              <Button variant="ghost" size="sm" className="text-xs gap-1 text-primary hover:text-primary">
                View All Orders <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]">Order #</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Carrier & Method</TableHead>
                  <TableHead>Gateway</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {!orderStats?.recentOrders || orderStats.recentOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6 text-muted-foreground text-xs">
                      No orders placed yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  orderStats.recentOrders.map((ord) => (
                    <TableRow key={ord.id} className="hover:bg-muted/40 transition-colors">
                      <TableCell className="font-semibold text-primary font-mono text-xs">
                        <Link href={`/orders/${ord.id}`} className="hover:underline">
                          {ord.orderNumber}
                        </Link>
                      </TableCell>
                      <TableCell className="text-xs">
                        <div className="font-medium text-foreground">{ord.customerName}</div>
                        <div className="text-muted-foreground text-[11px]">{ord.customerEmail}</div>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {ord.items?.length || 0} item{(ord.items?.length || 0) > 1 ? 's' : ''}
                      </TableCell>
                      <TableCell className="text-xs text-foreground font-medium">
                        {ord.shippingCarrier || ord.shippingMethod || 'Standard'}
                      </TableCell>
                      <TableCell className="text-xs">
                        <span className="font-medium text-foreground">
                          {ord.paymentMethod?.toUpperCase().includes('ZARINPAL')
                            ? 'زرین‌پال'
                            : ord.paymentMethod}
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-bold text-foreground text-xs">
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
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
