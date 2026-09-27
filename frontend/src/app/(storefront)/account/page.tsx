'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Package, ShoppingBag, ArrowRight, ShieldCheck, Loader2, User as UserIcon, MapPin } from 'lucide-react';
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

    // Refresh profile & fetch customer orders
    Promise.all([
      api.getProfile().catch(() => currentUser),
      api.getMyOrders().catch(() => []),
    ])
      .then(([freshUser, myOrders]) => {
        if (freshUser) setUser(freshUser);
        setOrders(myOrders || []);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handleLogout = () => {
    api.logout();
    setUser(null);
    setOrders([]);
    router.push('/auth/otp');
  };

  // State: Not Logged In
  if (!user && !isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-16 text-center">
        <div className="w-16 h-16 rounded-3xl bg-shaad-50 border border-shaad-200/80 flex items-center justify-center text-shaad-800 mb-5 shadow-xs">
          <ShieldCheck className="w-8 h-8 stroke-[1.5]" />
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mb-2">
          Customer Portal & Atelier Commissions
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-md mb-8 leading-relaxed">
          Access your commissioned solid wood furniture orders, dispatch timelines, and saved delivery details with passwordless SMS OTP.
        </p>
        <Link
          href="/auth/otp?redirect=/account"
          className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-shaad-800 hover:bg-shaad-900 text-white font-medium text-sm shadow-md transition-all group"
        >
          <span>Sign In with Mobile OTP</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zen-50/40 pb-24">
      {/* Header breadcrumb */}
      <div className="border-b border-border/60 bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <span className="text-xs font-mono text-muted-foreground">
            <Link href="/" className="hover:text-foreground">Home</Link> &gt; Customer Account
          </span>
          <Link href="/shop" className="text-xs font-mono text-shaad-800 hover:underline">
            Browse Atelier Catalog &rarr;
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Customer Profile Header */}
        <AccountHeader user={user} onLogout={handleLogout} />

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-border/60 pb-1 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'orders'
                ? 'bg-shaad-800 text-white shadow-xs'
                : 'text-foreground/70 hover:text-foreground hover:bg-zen-100'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Commissions & Orders</span>
            {orders.length > 0 && (
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                activeTab === 'orders' ? 'bg-white/20 text-white' : 'bg-zen-200 text-foreground'
              }`}>
                {orders.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'profile'
                ? 'bg-shaad-800 text-white shadow-xs'
                : 'text-foreground/70 hover:text-foreground hover:bg-zen-100'
            }`}
          >
            <UserIcon className="w-3.5 h-3.5" />
            <span>Profile & Mobile</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('addresses')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'addresses'
                ? 'bg-shaad-800 text-white shadow-xs'
                : 'text-foreground/70 hover:text-foreground hover:bg-zen-100'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Saved Addresses</span>
          </button>
        </div>

        {/* Tab 1: Orders */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-xl font-bold text-foreground">
                Your Commissions & Orders
              </h2>
              <span className="text-xs font-mono text-muted-foreground">
                {orders.length} {orders.length === 1 ? 'Order' : 'Orders'} Total
              </span>
            </div>

            {isLoading ? (
              <div className="p-12 rounded-3xl bg-white border border-border/70 flex flex-col items-center justify-center text-muted-foreground gap-3">
                <Loader2 className="w-6 h-6 animate-spin text-shaad-800" />
                <span className="text-xs font-mono">Fetching your commissions...</span>
              </div>
            ) : orders.length === 0 ? (
              <div className="p-12 rounded-3xl bg-white border border-border/70 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-zen-100 flex items-center justify-center text-muted-foreground mx-auto">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <h3 className="font-serif font-bold text-base text-foreground">
                  No Furniture Orders Found Yet
                </h3>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  Explore our handcrafted solid wood tables, seating, and architectural storage pieces.
                </p>
                <div className="pt-2">
                  <Link
                    href="/shop"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-shaad-800 hover:bg-shaad-900 text-white text-xs font-medium transition-all"
                  >
                    <span>Explore Catalog</span>
                    <ArrowRight className="w-3.5 h-3.5" />
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

        {/* Phone Change Modal with SMS OTP */}
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
