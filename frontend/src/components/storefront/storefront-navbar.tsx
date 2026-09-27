'use client';

import * as React from 'react';
import Link from 'next/link';
import { Menu, ShoppingBag, User, LogOut, Layers, PackageCheck } from 'lucide-react';
import { useCart } from '@/context/cart-context';
import { api } from '@/lib/api';
import { Sheet, SheetTrigger } from '@/components/ui/sheet';
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { MobileNavDrawer } from './mobile-nav-drawer';

const PRODUCT_NAV_LINKS = [
  { label: 'فروشگاه', href: '/shop' },
  { label: 'نشیمن', href: '/shop?categorySlug=living-room' },
  { label: 'غذاخوری', href: '/shop?categorySlug=dining-room' },
  { label: 'سرویس خواب', href: '/shop?categorySlug=bedroom' },
];

const EDITORIAL_NAV_LINKS = [
  { label: 'یادداشت‌ها', href: '/blog' },
  { label: 'درباره ما', href: '/about' },
  { label: 'تماس و شوروم', href: '/contact' },
];

export function StorefrontNavbar() {
  const { totalCount, setIsDrawerOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [currentUser, setCurrentUser] = React.useState<any>(null);

  React.useEffect(() => {
    const updateUser = () => setCurrentUser(api.getCurrentUser());
    updateUser();
    window.addEventListener('shaadwood_auth_changed', updateUser);
    window.addEventListener('storage', updateUser);
    return () => {
      window.removeEventListener('shaadwood_auth_changed', updateUser);
      window.removeEventListener('storage', updateUser);
    };
  }, []);

  const handleLogout = () => {
    api.logout();
    setCurrentUser(null);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-zen-50/95 backdrop-blur-md border-b border-border/60 transition-all">
      {/* Announcement Bar */}
      <div className="bg-shaad-800 text-white text-[10px] sm:text-[11px] font-medium tracking-wide py-1.5 px-4 text-center select-none flex items-center justify-center gap-2 whitespace-nowrap overflow-hidden">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
        <span className="truncate">ارسال اختصاصی و تحویل رایگان سفارش‌های بالای ۵۰ میلیون تومان در سراسر کشور</span>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 sm:h-22 flex items-center justify-between">
        {/* Right side in RTL: Mobile Drawer Trigger + Product Links */}
        <div className="flex-1 flex items-center justify-start gap-6 xl:gap-8 min-w-0">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                className="lg:hidden p-2.5 -mr-1 text-foreground/80 hover:text-foreground rounded-lg hover:bg-zen-100 transition-colors"
                aria-label="باز کردن منو"
              >
                <Menu className="w-6 h-6 stroke-[1.75]" />
              </button>
            </SheetTrigger>
            <MobileNavDrawer
              currentUser={currentUser}
              onClose={() => setMobileMenuOpen(false)}
              onLogout={handleLogout}
            />
          </Sheet>

          <nav className="hidden lg:flex items-center gap-5 xl:gap-7">
            {PRODUCT_NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-xs tracking-wider font-medium text-foreground/80 hover:text-shaad-800 transition-colors relative py-1 group shrink-0"
              >
                <span>{link.label}</span>
                <span className="absolute bottom-0 right-0 w-0 h-[1.5px] bg-shaad-800 transition-all duration-200 group-hover:w-full" />
              </Link>
            ))}
          </nav>
        </div>

        {/* Center: Brand Identity */}
        <div className="shrink-0 px-2 sm:px-6 text-center">
          <Link href="/" className="inline-block group py-1">
            <span className="font-serif text-xl sm:text-2xl lg:text-[26px] font-bold tracking-[0.2em] text-shaad-900 block group-hover:text-shaad-700 transition-colors">
              شادوود
            </span>
            <span className="text-[9px] sm:text-[10px] tracking-widest text-muted-foreground block -mt-0.5 font-sans">
              آتلیه نجاری چوب طبیعی
            </span>
          </Link>
        </div>

        {/* Left side in RTL: Editorial Links + User Account + Cart Trigger */}
        <div className="flex-1 flex items-center justify-end gap-5 xl:gap-7 min-w-0">
          <nav className="hidden lg:flex items-center gap-5 xl:gap-7">
            {EDITORIAL_NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-xs tracking-wider font-medium text-foreground/80 hover:text-shaad-800 transition-colors relative py-1 group shrink-0"
              >
                <span>{link.label}</span>
                <span className="absolute bottom-0 right-0 w-0 h-[1.5px] bg-shaad-800 transition-all duration-200 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1 md:gap-1.5 shrink-0">
            {currentUser ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="p-2 text-foreground/80 hover:text-shaad-800 transition-colors rounded-full hover:bg-zen-100 flex items-center gap-1.5"
                    aria-label="حساب کاربری"
                  >
                    <div className="w-7 h-7 rounded-full bg-shaad-800 text-white text-xs font-semibold flex items-center justify-center">
                      {currentUser.firstName?.[0] || 'ک'}
                    </div>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56 p-1.5 bg-white border border-border/70 shadow-lg text-right">
                  <DropdownMenuLabel className="font-normal px-2.5 py-2">
                    <div className="text-xs font-semibold text-foreground">
                      {currentUser.firstName} {currentUser.lastName}
                    </div>
                    <div className="text-[11px] text-muted-foreground truncate">{currentUser.phone || currentUser.email}</div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/account" className="flex items-center gap-2 py-2 cursor-pointer font-medium text-foreground">
                      <PackageCheck className="w-3.5 h-3.5 text-shaad-800" />
                      <span>سفارش‌ها و پروفایل من</span>
                    </Link>
                  </DropdownMenuItem>
                  {currentUser.role === 'ADMIN' && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin" className="flex items-center gap-2 py-2 cursor-pointer font-medium text-shaad-800">
                        <Layers className="w-3.5 h-3.5" />
                        <span>پنل مدیریت کارگاه</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="flex items-center gap-2 py-2 cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>خروج از حساب</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                href="/auth/otp"
                className="p-2 text-foreground/80 hover:text-shaad-800 transition-colors rounded-full hover:bg-zen-100"
                title="ورود با رمز یکبارمصرف"
                aria-label="ورود به حساب کاربری"
              >
                <User className="w-5 h-5 stroke-[1.75]" />
              </Link>
            )}

            <button
              type="button"
              onClick={() => setIsDrawerOpen(true)}
              className="relative p-0 md:p-2 text-foreground/80 hover:text-shaad-800 transition-colors rounded-full hover:bg-zen-100"
              aria-label="مشاهده سبد خرید"
            >
              <ShoppingBag className="w-5 h-5 stroke-[1.75]" />
              {totalCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-shaad-800 text-white font-sans text-[10px] font-bold flex items-center justify-center animate-in zoom-in-50 duration-150">
                  {totalCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
