'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Package, ShoppingBag, ArrowLeft, ShieldCheck, Loader2, User as UserIcon, MapPin } from 'lucide-react';
import { api } from '@/lib/api';
import { Order, User } from '@/types';
import { AccountHeader } from './components/account-header';
import { OrderCard } from './components/order-card';
import { ProfileInfoForm } from './components/profile-info-form';
import { PhoneChangeDialog } from './components/phone-change-dialog';
import { AddressesManager } from './components/addresses-manager';

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = React.useState<User | null>(null);
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [activeTab, setActiveTab] = React.useState<'orders' | 'profile' | 'addresses'>('orders');
  const [isPhoneDialogOpen, setIsPhoneDialogOpen] = React.useState(false);

  React.useEffect(() => {
    const currentUser = api.getCurrentUser();
    setUser(currentUser);
    if (!currentUser) {
      setIsLoading(false);
      return;
    }
    Promise.all([
      api.getProfile().catch(() => currentUser),
      api.getMyOrders().catch(() => []),
    ])
      .then(([freshUser, myOrders]) => {
        if (freshUser) setUser(freshUser);
        setOrders(myOrders || []);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleLogout = () => {
    api.logout();
    setUser(null);
    setOrders([]);
    router.push('/auth/otp');
  };

  if (!user && !isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-16 text-center">
        <div className="w-16 h-16 rounded-3xl bg-shaad-50 border border-shaad-200/80 flex items-center justify-center text-shaad-800 mb-5 shadow-xs">
          <ShieldCheck className="w-8 h-8 stroke-[1.5]" />
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mb-2">
          پورتال همراهان کارگاه شادوود
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-md mb-8 leading-relaxed">
          دسترسی به سفارش‌های مبلمان دست‌ساز، مراحل ساخت کارگاه، زمان‌بندی باربری و نشانی‌های ذخیره‌شده با ورود امن پیامکی.
        </p>
        <Link
          href="/auth/otp?redirect=/account"
          className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-shaad-800 hover:bg-shaad-900 text-white font-medium text-sm shadow-md transition-all group"
        >
          <span>ورود با پیامک رمز یکبارمصرف</span>
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zen-50/40 pb-24">
      {/* Header breadcrumb */}
      <div className="border-b border-border/60 bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between text-xs">
          <span className="text-muted-foreground font-sans">
            <Link href="/" className="hover:text-foreground">خانه</Link> &gt; حساب کاربری
          </span>
          <Link href="/shop" className="text-shaad-800 hover:underline flex items-center gap-1">
            <span>مشاهده کاتالوگ آثار</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        <AccountHeader user={user} onLogout={handleLogout} />

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-border/60 pb-1 overflow-x-auto">
          <button type="button" onClick={() => setActiveTab('orders')} className={`px-4 py-2.5 rounded-2xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${activeTab === 'orders' ? 'bg-shaad-800 text-white shadow-xs' : 'text-foreground/70 hover:text-foreground hover:bg-zen-100'}`}>
            <Package className="w-3.5 h-3.5" />
            <span>سفارش‌ها و پروژه‌ها</span>
            {orders.length > 0 && (
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-sans ${activeTab === 'orders' ? 'bg-white/20 text-white' : 'bg-zen-200 text-foreground'}`}>
                {new Intl.NumberFormat('fa-IR').format(orders.length)}
              </span>
            )}
          </button>
          <button type="button" onClick={() => setActiveTab('profile')} className={`px-4 py-2.5 rounded-2xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${activeTab === 'profile' ? 'bg-shaad-800 text-white shadow-xs' : 'text-foreground/70 hover:text-foreground hover:bg-zen-100'}`}>
            <UserIcon className="w-3.5 h-3.5" />
            <span>مشخصات و شماره همراه</span>
          </button>
          <button type="button" onClick={() => setActiveTab('addresses')} className={`px-4 py-2.5 rounded-2xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${activeTab === 'addresses' ? 'bg-shaad-800 text-white shadow-xs' : 'text-foreground/70 hover:text-foreground hover:bg-zen-100'}`}>
            <MapPin className="w-3.5 h-3.5" />
            <span>نشانی‌های ذخیره‌شده</span>
          </button>
        </div>

        {/* Tab 1: Orders */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-xl font-bold text-foreground">
                سفارش‌های ساخت و مبلمان شما
              </h2>
              <span className="text-xs font-sans text-muted-foreground">
                {new Intl.NumberFormat('fa-IR').format(orders.length)} سفارش کل
              </span>
            </div>

            {isLoading ? (
              <div className="p-12 rounded-3xl bg-white border border-border/70 flex flex-col items-center justify-center text-muted-foreground gap-3">
                <Loader2 className="w-6 h-6 animate-spin text-shaad-800" />
                <span className="text-xs font-sans">در حال دریافت فهرست سفارشات کارگاه...</span>
              </div>
            ) : orders.length === 0 ? (
              <div className="p-12 rounded-3xl bg-white border border-border/70 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-zen-100 flex items-center justify-center text-muted-foreground mx-auto">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <h3 className="font-serif font-bold text-base text-foreground">
                  هنوز سفارشی در کارگاه ثبت نکرده‌اید
                </h3>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  از دسته‌بندی میزها، صندلی‌ها و سازه‌های ذخیره‌سازی چوب خالص استودیو دیدن فرمایید.
                </p>
                <div className="pt-2">
                  <Link
                    href="/shop"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-shaad-800 hover:bg-shaad-900 text-white text-xs font-medium transition-all"
                  >
                    <span>مشاهده کاتالوگ آثار</span>
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Profile & Phone */}
        {activeTab === 'profile' && user && (
          <ProfileInfoForm
            user={user}
            onUserUpdated={(updated) => setUser(updated)}
            onRequestChangePhone={() => setIsPhoneDialogOpen(true)}
          />
        )}

        {/* Tab 3: Saved Addresses */}
        {activeTab === 'addresses' && <AddressesManager />}

        <PhoneChangeDialog
          isOpen={isPhoneDialogOpen}
          onClose={() => setIsPhoneDialogOpen(false)}
          currentPhone={user?.phone}
          onPhoneUpdated={(updated) => setUser(updated)}
        />
      </div>
    </div>
  );
}
