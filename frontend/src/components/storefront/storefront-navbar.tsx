'use client';

import * as React from 'react';
import Link from 'next/link';
import { Menu, ShoppingBag, User, LogOut, Layers, ExternalLink, ShieldCheck, ChevronRight } from 'lucide-react';
import { useCart } from '@/context/cart-context';
import { api } from '@/lib/api';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

export function StorefrontNavbar() {
  const { totalCount, setIsDrawerOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [currentUser, setCurrentUser] = React.useState<any>(null);

  // Check login state on mount
  React.useEffect(() => {
    setCurrentUser(api.getCurrentUser());
  }, []);

  const handleLogout = () => {
    api.logout();
    setCurrentUser(null);
  };

  // Concise essential desktop links - exactly 3 to prevent any logo collision
  const desktopNavLinks = [
    { label: 'Living', href: '#living' },
    { label: 'Bedroom', href: '#bedroom' },
    { label: 'Dining', href: '#dining' },
  ];

  // Mobile drawer links
  const mobileNavLinks = [
    { label: 'Living Collection', href: '#living' },
    { label: 'Bedroom Sanctuary', href: '#bedroom' },
    { label: 'Dining Tables', href: '#dining' },
    { label: 'Signature Pieces', href: '#collections' },
    { label: 'Craft & Joinery', href: '#craft' },
    { label: 'Studio Journal', href: '/blog' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-zen-50/95 backdrop-blur-md border-b border-border/60 transition-all">
      {/* 1. Concise, Single-Line Announcement Bar (Never wraps on mobile) */}
      <div className="bg-shaad-800 text-white text-[10px] sm:text-[11px] font-medium tracking-wide py-1.5 px-4 text-center select-none flex items-center justify-center gap-2 whitespace-nowrap overflow-hidden">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
        <span className="truncate">Free White-Glove In-Home Delivery on Orders $1,500+</span>
      </div>

      {/* 2. Main Luxury Navbar with Increased Height */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 sm:h-22 flex items-center justify-between">
        {/* Left Section: Mobile Drawer Trigger + 3 Clean Desktop Links */}
        <div className="flex-1 flex items-center justify-start gap-6 xl:gap-8 min-w-0">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                className="lg:hidden p-2.5 -ml-1 text-foreground/80 hover:text-foreground rounded-lg hover:bg-zen-100 transition-colors"
                aria-label="Open Navigation Menu"
              >
                <Menu className="w-6 h-6 stroke-[1.75]" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 p-0 bg-zen-50 flex flex-col justify-between">
              <div>
                <SheetHeader className="p-6 border-b border-border/60">
                  <SheetTitle className="text-left font-serif tracking-[0.2em] font-semibold text-lg text-shaad-900">
                    SHAADWOOD
                  </SheetTitle>
                  <p className="text-[11px] text-muted-foreground text-left">
                    Handcrafted Woodcraft Studio & Living
                  </p>
                </SheetHeader>
                <nav className="p-6 space-y-1">
                  {mobileNavLinks.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between py-3 text-sm font-medium text-foreground/80 hover:text-shaad-800 transition-colors border-b border-border/40"
                    >
                      <span>{link.label}</span>
                      <ChevronRight className="w-4 h-4 text-muted-foreground/60" />
                    </Link>
                  ))}

                  {/* Auth Link in Mobile Drawer */}
                  {currentUser ? (
                    <div className="pt-4 space-y-2">
                      <div className="text-xs font-semibold text-foreground">
                        {currentUser.firstName} {currentUser.lastName}
                      </div>
                      <div className="text-[11px] text-muted-foreground">{currentUser.email}</div>
                      {currentUser.role === 'ADMIN' && (
                        <Link
                          href="/admin"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center justify-between py-2 text-xs font-semibold text-shaad-800"
                        >
                          <span>Admin Workshop Portal</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      )}
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="text-xs text-red-600 hover:underline pt-2 block"
                      >
                        Sign Out
                      </button>
                    </div>
                  ) : (
                    <Link
                      href="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between py-3 text-xs font-semibold text-shaad-800 hover:text-shaad-900 transition-colors pt-4"
                    >
                      <span>Sign In / Register</span>
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  )}
                </nav>
              </div>

              {/* Mobile Drawer Footer */}
              <div className="p-6 border-t border-border/60 space-y-2 bg-white/50">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <ShieldCheck className="w-4 h-4 text-shaad-700" />
                  <span>25-Year Solid Wood Warranty</span>
                </div>
                <p className="text-[11px] text-muted-foreground/80">
                  Portland Studio: 550 NW 13th Ave, Oregon
                </p>
              </div>
            </SheetContent>
          </Sheet>

          {/* Desktop Nav Links - exactly 3 to ensure zero overlap */}
          <nav className="hidden lg:flex items-center gap-7">
            {desktopNavLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-xs tracking-[0.18em] uppercase font-medium text-foreground/75 hover:text-shaad-800 transition-colors relative py-1 group"
              >
                <span>{link.label}</span>
                <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-shaad-800 transition-all duration-200 group-hover:w-full" />
              </Link>
            ))}
          </nav>
        </div>

        {/* Center Section: Prominent Luxury Brand Identity */}
        <div className="shrink-0 px-2 sm:px-6 text-center">
          <Link href="/" className="inline-block group py-1">
            <span className="font-serif text-xl sm:text-2xl lg:text-[26px] font-bold tracking-[0.25em] text-shaad-900 block group-hover:text-shaad-700 transition-colors">
              SHAADWOOD
            </span>
            <span className="text-[8px] sm:text-[9px] tracking-[0.35em] text-muted-foreground uppercase block -mt-0.5 font-sans">
              Artisanal Studio
            </span>
          </Link>
        </div>

        {/* Right Section: Story Link + Dynamic User Account + Cart Trigger */}
        <div className="flex-1 flex items-center justify-end gap-1 md:gap-1 min-w-0">
          <Link
            href="#craft"
            className="hidden xl:inline-block text-xs tracking-[0.18em] uppercase font-medium text-foreground/75 hover:text-shaad-800 transition-colors mr-2"
          >
            Craft & Story
          </Link>

          {/* User Account / Auth Button */}
          {currentUser ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="p-2 text-foreground/80 hover:text-shaad-800 transition-colors rounded-full hover:bg-zen-100 flex items-center gap-1.5"
                  aria-label="User account menu"
                >
                  <div className="w-7 h-7 rounded-full bg-shaad-800 text-white text-xs font-semibold flex items-center justify-center">
                    {currentUser.firstName?.[0] || 'U'}
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 p-1.5 bg-white border border-border/70 shadow-lg">
                <DropdownMenuLabel className="font-normal px-2.5 py-2">
                  <div className="text-xs font-semibold text-foreground">
                    {currentUser.firstName} {currentUser.lastName}
                  </div>
                  <div className="text-[11px] text-muted-foreground truncate">{currentUser.email}</div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                {currentUser.role === 'ADMIN' && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin" className="flex items-center gap-2 py-2 cursor-pointer font-medium text-shaad-800">
                      <Layers className="w-3.5 h-3.5" />
                      <span>Admin Operations Portal</span>
                    </Link>
                  </DropdownMenuItem>
                )}

                <DropdownMenuItem
                  onClick={handleLogout}
                  className="flex items-center gap-2 py-2 cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link
              href="/login"
              className="p-2 text-foreground/80 hover:text-shaad-800 transition-colors rounded-full hover:bg-zen-100"
              title="Sign In / Register"
              aria-label="Sign In or Register"
            >
              <User className="w-5 h-5 stroke-[1.75]" />
            </Link>
          )}

          {/* Cart Trigger */}
          <button
            type="button"
            onClick={() => setIsDrawerOpen(true)}
            className="relative p-0 md:p-2 text-foreground/80 hover:text-shaad-800 transition-colors rounded-full hover:bg-zen-100"
            aria-label="View shopping cart"
          >
            <ShoppingBag className="w-5 h-5 stroke-[1.75]" />
            {totalCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-shaad-800 text-white font-mono text-[10px] font-bold flex items-center justify-center animate-in zoom-in-50 duration-150">
                {totalCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
