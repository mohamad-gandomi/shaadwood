'use client';

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Armchair,
  FolderTree,
  BookOpen,
  Users,
  Palette,
  ShoppingBag,
  Tag,
  Image as ImageIcon,
} from 'lucide-react';
import { api } from '@/lib/api';
import { Header } from '@/components/admin/header';
import { DashboardHeader } from '@/components/admin/dashboard/dashboard-header';
import { DashboardSearch, type SearchResultsData } from '@/components/admin/dashboard/dashboard-search';
import { DashboardKpis } from '@/components/admin/dashboard/dashboard-kpis';
import { DashboardOrdersCard } from '@/components/admin/dashboard/dashboard-orders-card';
import { DashboardShortcuts } from '@/components/admin/dashboard/dashboard-shortcuts';
import { DashboardInventoryCard } from '@/components/admin/dashboard/dashboard-inventory-card';
import { DashboardPromosCard } from '@/components/admin/dashboard/dashboard-promos-card';
import { DashboardSnapshotCard } from '@/components/admin/dashboard/dashboard-snapshot-card';

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [activeFilter, setActiveFilter] = React.useState<'all' | 'pending' | 'low_stock' | 'coupons'>('all');

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

  const { data: attributes = [] } = useQuery({
    queryKey: ['attributes'],
    queryFn: () => api.getAttributes(),
  });

  const { data: blogPosts = [] } = useQuery({
    queryKey: ['blog-posts'],
    queryFn: () => api.getBlogPosts(),
  });

  const { data: mediaItems = [] } = useQuery({
    queryKey: ['media-count'],
    queryFn: () => api.getMedia(),
  });

  const totalRevenue = orderStats?.totalRevenue || 0;
  const totalOrders = orderStats?.totalOrders || 0;
  const averageOrderValue = orderStats?.averageOrderValue || 0;
  const pendingCount = orderStats?.pendingCount || 0;
  const processingCount = orderStats?.processingCount || 0;
  const ordersToFulfill = pendingCount + processingCount;

  const lowStockProducts = React.useMemo(() => {
    return products.filter((p) => p.stockQuantity !== null && p.stockQuantity !== undefined && p.stockQuantity <= 5);
  }, [products]);

  const outOfStockCount = React.useMemo(() => {
    return products.filter((p) => p.stockQuantity === 0).length;
  }, [products]);

  const activeCoupons = React.useMemo(() => coupons.filter((c) => c.isActive), [coupons]);
  const variableCount = products.filter((p) => p.productType === 'VARIABLE').length;
  const simpleCount = products.filter((p) => p.productType === 'SIMPLE').length;
  const totalVariants = products.reduce((acc, p) => acc + (p.variants?.length || 0), 0);

  const quickActions = React.useMemo(() => [
    { title: 'ثبت اثر دست‌ساز جدید', description: 'ایجاد اثر چوبی ساده یا چندویژگی', href: '/products', icon: Armchair, category: 'عملیات' },
    { title: 'صف سفارش‌ها و ارسال', description: 'بررسی سفارش‌های نیازمند ساخت و تحویل به باربری', href: '/orders', icon: ShoppingBag, category: 'عملیات' },
    { title: 'تعریف کد تخفیف جدید', description: 'راه‌اندازی جشنواره و تخفیف‌های درصدی یا ثابت', href: '/coupons', icon: Tag, category: 'عملیات' },
    { title: 'فینیش‌های چوب و کالیته', description: 'مدیریت ویژگی‌ها، بافت‌ها و روغن‌های گیاهی', href: '/attributes', icon: Palette, category: 'عملیات' },
    { title: 'سلسله‌مراتب دسته‌بندی‌ها', description: 'سازماندهی نشیمن، ناهارخوری و آثار سفارشی', href: '/categories', icon: FolderTree, category: 'عملیات' },
    { title: 'کتابخانه پرونده‌ها و رسانه', description: 'تصاویر عکاسی باکیفیت و بافت‌های وب‌پی', href: '/media', icon: ImageIcon, category: 'عملیات' },
    { title: 'وبلاگ و مقالات درودگری', description: 'انتشار راهنماهای مراقبت چوب و داستان‌های کارگاه', href: '/blog', icon: BookOpen, category: 'عملیات' },
    { title: 'فهرست مشتریان کارگاه', description: 'مدیریت کاربران ثبت‌نام‌شده، نشانی‌ها و پروفایل‌ها', href: '/users', icon: Users, category: 'عملیات' },
  ], []);

  const searchResults: SearchResultsData | null = React.useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return null;

    const matchedOrders = (orderStats?.recentOrders || []).filter((o) =>
      o.orderNumber.toLowerCase().includes(q) ||
      o.customerName.toLowerCase().includes(q) ||
      o.customerEmail.toLowerCase().includes(q) ||
      o.status.toLowerCase().includes(q)
    );

    const matchedProducts = products.filter((p) =>
      p.name.toLowerCase().includes(q) ||
      (p.sku && p.sku.toLowerCase().includes(q))
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

  const displayedOrders = React.useMemo(() => {
    const list = orderStats?.recentOrders || [];
    if (activeFilter === 'pending') {
      return list.filter((o) => o.status === 'PENDING' || o.status === 'PROCESSING');
    }
    return list;
  }, [orderStats?.recentOrders, activeFilter]);

  return (
    <div className="space-y-6 sm:space-y-8 pb-12 font-sans" dir="rtl">
      <Header title="پیشخوان مدیریت" />

      <div className="px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8 max-w-7xl mx-auto">
        <DashboardHeader ordersToFulfill={ordersToFulfill} />

        <DashboardSearch
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          ordersToFulfill={ordersToFulfill}
          lowStockCount={lowStockProducts.length}
          activeCouponsCount={activeCoupons.length}
          searchResults={searchResults}
        />

        <DashboardKpis
          statsLoading={statsLoading} totalRevenue={totalRevenue} totalOrders={totalOrders}
          averageOrderValue={averageOrderValue} ordersToFulfill={ordersToFulfill}
          pendingCount={pendingCount} processingCount={processingCount}
          productsLoading={productsLoading} lowStockProducts={lowStockProducts}
          outOfStockCount={outOfStockCount} couponsLoading={couponsLoading}
          activeCoupons={activeCoupons} totalCouponsCount={coupons.length}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          <div className="lg:col-span-7 xl:col-span-8 space-y-6 sm:space-y-8">
            <DashboardOrdersCard
              statsLoading={statsLoading}
              displayedOrders={displayedOrders}
              activeFilter={activeFilter}
            />
            <DashboardShortcuts />
          </div>

          <div className="lg:col-span-5 xl:col-span-4 space-y-6 sm:space-y-8">
            <DashboardInventoryCard
              productsLoading={productsLoading}
              lowStockProducts={lowStockProducts}
            />
            <DashboardPromosCard
              couponsLoading={couponsLoading}
              activeCoupons={activeCoupons}
            />
            <DashboardSnapshotCard
              productsCount={products.length} variableCount={variableCount}
              totalVariants={totalVariants} simpleCount={simpleCount}
              attributesCount={attributes.length} blogPostsCount={blogPosts.length}
              mediaItemsCount={mediaItems.length}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
