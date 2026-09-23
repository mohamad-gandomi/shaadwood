'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import {
  LayoutDashboard,
  Armchair,
  Palette,
  FolderTree,
  BookOpen,
  BookmarkCheck,
  Users,
  Image as ImageIcon,
  UploadCloud,
  ExternalLink,
  Database,
  Layers,
  ChevronDown,
  ShoppingBag,
  Tag,
  Server,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { api, API_BASE } from '@/lib/api';

export interface NavItem {
  title: string;
  href: string;
  icon: any;
  badge?: string;
  onClick?: () => void;
}

export const shopNavItems: NavItem[] = [
  {
    title: 'Orders',
    href: '/orders',
    icon: ShoppingBag,
  },
  {
    title: 'Coupons & Promos',
    href: '/coupons',
    icon: Tag,
  },
  {
    title: 'Products',
    href: '/products',
    icon: Armchair,
  },
  {
    title: 'Attributes & Swatches',
    href: '/attributes',
    icon: Palette,
  },
  {
    title: 'Product Categories',
    href: '/categories',
    icon: FolderTree,
  },
  {
    title: 'Users & Customers',
    href: '/users',
    icon: Users,
  },
];

export const mediaNavItems: NavItem[] = [
  {
    title: 'Media Library',
    href: '/media',
    icon: ImageIcon,
  },
  {
    title: 'Upload Media',
    href: '/media?action=upload',
    icon: UploadCloud,
  },
];

export const blogNavItems: NavItem[] = [
  {
    title: 'Blog Articles',
    href: '/blog',
    icon: BookOpen,
  },
  {
    title: 'Blog Categories',
    href: '/blog/categories',
    icon: BookmarkCheck,
  },
];

interface NavContentProps {
  onItemClick?: () => void;
}

type AccordionSection = 'shop' | 'media' | 'blog' | 'tools';

export function NavContent({ onItemClick }: NavContentProps) {
  const pathname = usePathname();

  // Determine which section corresponds to the current URL
  const getSectionFromPath = React.useCallback((): AccordionSection => {
    if (pathname.startsWith('/media')) return 'media';
    if (pathname.startsWith('/blog')) return 'blog';
    return 'shop';
  }, [pathname]);

  // Multi-section state: keep all useful sections open by default so sidebar is never blank
  const [openSections, setOpenSections] = React.useState<Record<AccordionSection, boolean>>({
    shop: true,
    media: true,
    blog: true,
    tools: true,
  });

  // Toggle handler allowing independent accordion expand/collapse
  const handleToggleSection = (section: AccordionSection) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Query backend categories tree to verify live connection status
  const { isSuccess, isError } = useQuery({
    queryKey: ['backend-health'],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/categories`);
      return res.ok;
    },
    refetchInterval: 10000,
  });

  // Media count for live badge
  const { data: mediaItems } = useQuery({
    queryKey: ['media-count'],
    queryFn: () => api.getMedia(),
    staleTime: 30000,
  });

  const renderNavItems = (items: NavItem[]) => (
    <div className="space-y-1 pt-1 pb-2 pl-1 pr-1">
      {items.map((item) => {
        let isActive = false;
        if (item.href === '/') {
          isActive = pathname === '/';
        } else if (item.href.includes('?')) {
          isActive =
            pathname === item.href.split('?')[0] &&
            typeof window !== 'undefined' &&
            window.location.search.includes('action=upload');
        } else if (item.href === '/blog') {
          // Highlight Blog Articles on /blog, /blog/new, /blog/[id], but NOT on /blog/categories
          isActive = pathname === '/blog' || (pathname.startsWith('/blog/') && !pathname.startsWith('/blog/categories'));
        } else {
          isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
        }
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onItemClick}
            className={cn(
              'flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all group',
              isActive
                ? 'bg-primary text-primary-foreground shadow-xs font-semibold'
                : 'text-muted-foreground hover:text-foreground hover:bg-accent/60',
            )}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <Icon
                className={cn(
                  'w-4 h-4 shrink-0 transition-colors',
                  isActive ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-foreground',
                )}
              />
              <span className="truncate">{item.title}</span>
            </div>
            {item.badge && (
              <span
                className={cn(
                  'text-[10px] px-1.5 py-0.5 rounded font-mono shrink-0',
                  isActive
                    ? 'bg-primary-foreground/20 text-primary-foreground'
                    : 'bg-wood-100 text-wood-800',
                )}
              >
                {item.badge}
              </span>
            )}
          </Link>
        );
      })}
    </div>
  );

  return (
    <div className="flex flex-col min-h-full">
      <div className="p-3 space-y-2.5 flex-1">
        {/* ======================================================== */}
        {/* TOP-LEVEL: DASHBOARD                                    */}
        {/* ======================================================== */}
        <Link
          href="/"
          onClick={onItemClick}
          className={cn(
            'flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all border group shadow-2xs',
            pathname === '/'
              ? 'bg-primary text-primary-foreground border-primary shadow-xs'
              : 'bg-card/70 text-muted-foreground hover:text-foreground hover:bg-accent/60 border-border/60',
          )}
        >
          <div className="flex items-center gap-2.5">
            <LayoutDashboard
              className={cn(
                'w-4 h-4 shrink-0 transition-colors',
                pathname === '/' ? 'text-primary-foreground' : 'text-primary group-hover:text-primary',
              )}
            />
            <span>Dashboard</span>
          </div>
          <span
            className={cn(
              'text-[10px] font-mono px-1.5 py-0.5 rounded tracking-wide font-medium',
              pathname === '/'
                ? 'bg-primary-foreground/20 text-primary-foreground'
                : 'text-muted-foreground bg-muted/60',
            )}
          >
            Live
          </span>
        </Link>

        {/* ======================================================== */}
        {/* SECTION 1: FURNITURE SHOP                                */}
        {/* ======================================================== */}
        <div className="rounded-xl border border-border/60 bg-card/50 overflow-hidden shadow-2xs">
          <button
            type="button"
            onClick={() => handleToggleSection('shop')}
            className={cn(
              'w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all text-left select-none',
              openSections.shop
                ? 'bg-wood-50/80 text-wood-900 border-b border-border/50'
                : 'text-muted-foreground hover:text-foreground hover:bg-accent/30',
            )}
          >
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-3.5 h-3.5 text-primary shrink-0" />
              <span>Furniture Shop</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-muted-foreground bg-muted px-1.5 py-0.2 rounded">
                {shopNavItems.length}
              </span>
              <ChevronDown
                className={cn(
                  'w-3.5 h-3.5 text-muted-foreground transition-transform duration-200',
                  openSections.shop && 'rotate-180 text-foreground',
                )}
              />
            </div>
          </button>

          {openSections.shop && (
            <div className="animate-in fade-in-50 duration-150">
              {renderNavItems(shopNavItems)}
            </div>
          )}
        </div>

        {/* ======================================================== */}
        {/* SECTION 2: MEDIA & ASSETS                                */}
        {/* ======================================================== */}
        <div className="rounded-xl border border-border/60 bg-card/50 overflow-hidden shadow-2xs">
          <button
            type="button"
            onClick={() => handleToggleSection('media')}
            className={cn(
              'w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all text-left select-none',
              openSections.media
                ? 'bg-blue-50/80 text-blue-900 border-b border-border/50'
                : 'text-muted-foreground hover:text-foreground hover:bg-accent/30',
            )}
          >
            <div className="flex items-center gap-2.5">
              <ImageIcon className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>Media & Assets</span>
            </div>
            <div className="flex items-center gap-2">
              {mediaItems && (
                <span className="text-[10px] font-mono text-blue-700 bg-blue-100/70 px-1.5 py-0.2 rounded font-semibold">
                  {mediaItems.length}
                </span>
              )}
              <ChevronDown
                className={cn(
                  'w-3.5 h-3.5 text-muted-foreground transition-transform duration-200',
                  openSections.media && 'rotate-180 text-foreground',
                )}
              />
            </div>
          </button>

          {openSections.media && (
            <div className="animate-in fade-in-50 duration-150">
              {renderNavItems(mediaNavItems)}
            </div>
          )}
        </div>

        {/* ======================================================== */}
        {/* SECTION 3: BLOG & EDITORIAL                              */}
        {/* ======================================================== */}
        <div className="rounded-xl border border-border/60 bg-card/50 overflow-hidden shadow-2xs">
          <button
            type="button"
            onClick={() => handleToggleSection('blog')}
            className={cn(
              'w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all text-left select-none',
              openSections.blog
                ? 'bg-emerald-50/80 text-emerald-900 border-b border-border/50'
                : 'text-muted-foreground hover:text-foreground hover:bg-accent/30',
            )}
          >
            <div className="flex items-center gap-2.5">
              <BookOpen className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Blog & Editorial</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-muted-foreground bg-muted px-1.5 py-0.2 rounded">
                {blogNavItems.length}
              </span>
              <ChevronDown
                className={cn(
                  'w-3.5 h-3.5 text-muted-foreground transition-transform duration-200',
                  openSections.blog && 'rotate-180 text-foreground',
                )}
              />
            </div>
          </button>

          {openSections.blog && (
            <div className="animate-in fade-in-50 duration-150">
              {renderNavItems(blogNavItems)}
            </div>
          )}
        </div>

        {/* ======================================================== */}
        {/* SECTION 4: DEVELOPER TOOLS                               */}
        {/* ======================================================== */}
        <div className="rounded-xl border border-border/60 bg-card/50 overflow-hidden shadow-2xs">
          <button
            type="button"
            onClick={() => handleToggleSection('tools')}
            className={cn(
              'w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all text-left select-none',
              openSections.tools
                ? 'bg-muted/80 text-foreground border-b border-border/50'
                : 'text-muted-foreground hover:text-foreground hover:bg-accent/30',
            )}
          >
            <div className="flex items-center gap-2.5">
              <Layers className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              <span>Developer & DB</span>
            </div>
            <div className="flex items-center gap-2">
              <ChevronDown
                className={cn(
                  'w-3.5 h-3.5 text-muted-foreground transition-transform duration-200',
                  openSections.tools && 'rotate-180 text-foreground',
                )}
              />
            </div>
          </button>

          {openSections.tools && (
            <div className="p-2 space-y-1.5 animate-in fade-in-50 duration-150">
              {/* Backend API Connectivity Status */}
              <div className="flex items-center justify-between px-3 py-2 rounded-lg border border-border/60 bg-background/70 text-xs">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Server className="w-3.5 h-3.5 shrink-0" />
                  <span className="font-medium">NestJS API</span>
                </div>
                {isSuccess ? (
                  <span className="flex items-center gap-1.5 text-emerald-600 font-semibold text-[11px]">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                    Connected
                  </span>
                ) : isError ? (
                  <span className="flex items-center gap-1.5 text-destructive font-semibold text-[11px]">
                    <span className="w-2 h-2 rounded-full bg-destructive shrink-0" />
                    Offline
                  </span>
                ) : (
                  <span className="text-muted-foreground text-[11px]">Checking...</span>
                )}
              </div>

              <a
                href={process.env.NEXT_PUBLIC_SWAGGER_URL || 'http://localhost:4000/api/docs'}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between px-3 py-2 rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Layers className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Swagger OpenAPI</span>
                </div>
                <ExternalLink className="w-3 h-3 opacity-60" />
              </a>
              <a
                href="http://localhost:5050"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between px-3 py-2 rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Database className="w-3.5 h-3.5 text-blue-600" />
                  <span>pgAdmin 4 GUI</span>
                </div>
                <ExternalLink className="w-3 h-3 opacity-60" />
              </a>
            </div>
          )}
        </div>
      </div>

      {/* FOOTER STATUS */}
      <div className="p-3 border-t border-border/60 bg-muted/20 mt-auto">
        <div className="text-[11px] text-muted-foreground text-center font-medium flex items-center justify-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Shaadwood Furniture Admin</span>
        </div>
      </div>
    </div>
  );
}
