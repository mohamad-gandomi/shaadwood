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
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { api } from '@/lib/api';

export interface NavItem {
  title: string;
  href: string;
  icon: any;
  badge?: string;
  onClick?: () => void;
}

export const shopNavItems: NavItem[] = [
  {
    title: 'Overview',
    href: '/',
    icon: LayoutDashboard,
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

  // Single-open accordion state: only one section can be open at a time
  const [openSection, setOpenSection] = React.useState<AccordionSection>(getSectionFromPath);

  // Keep accordion in sync when pathname changes
  React.useEffect(() => {
    setOpenSection(getSectionFromPath());
  }, [pathname, getSectionFromPath]);

  // Toggle handler ensuring exclusive single-open behavior
  const handleToggleSection = (section: AccordionSection) => {
    setOpenSection((prev) => (prev === section ? prev : section));
  };

  // Optional: fetch media count for live badge
  const { data: mediaItems } = useQuery({
    queryKey: ['media-count'],
    queryFn: () => api.getMedia(),
    staleTime: 30000,
  });

  const renderNavItems = (items: NavItem[]) => (
    <div className="space-y-1 pt-1 pb-2 pl-1 pr-1">
      {items.map((item) => {
        const isActive =
          item.href === '/'
            ? pathname === '/'
            : item.href.includes('?')
            ? pathname === item.href.split('?')[0] && typeof window !== 'undefined' && window.location.search.includes('action=upload')
            : pathname === item.href || pathname.startsWith(`${item.href}/`);
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
    <div className="flex flex-col justify-between h-full">
      <div className="p-3 space-y-2">
        {/* ======================================================== */}
        {/* ACCORDION SECTION 1: FURNITURE SHOP                      */}
        {/* ======================================================== */}
        <div className="rounded-xl border border-border/60 bg-card/50 overflow-hidden shadow-2xs">
          <button
            type="button"
            onClick={() => handleToggleSection('shop')}
            className={cn(
              'w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all text-left select-none',
              openSection === 'shop'
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
                  openSection === 'shop' && 'rotate-180 text-foreground',
                )}
              />
            </div>
          </button>

          {openSection === 'shop' && (
            <div className="animate-in fade-in-50 duration-150">
              {renderNavItems(shopNavItems)}
            </div>
          )}
        </div>

        {/* ======================================================== */}
        {/* ACCORDION SECTION 2: MEDIA & ASSETS                      */}
        {/* ======================================================== */}
        <div className="rounded-xl border border-border/60 bg-card/50 overflow-hidden shadow-2xs">
          <button
            type="button"
            onClick={() => handleToggleSection('media')}
            className={cn(
              'w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all text-left select-none',
              openSection === 'media'
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
                  openSection === 'media' && 'rotate-180 text-foreground',
                )}
              />
            </div>
          </button>

          {openSection === 'media' && (
            <div className="animate-in fade-in-50 duration-150">
              {renderNavItems(mediaNavItems)}
            </div>
          )}
        </div>

        {/* ======================================================== */}
        {/* ACCORDION SECTION 3: BLOG & EDITORIAL                    */}
        {/* ======================================================== */}
        <div className="rounded-xl border border-border/60 bg-card/50 overflow-hidden shadow-2xs">
          <button
            type="button"
            onClick={() => handleToggleSection('blog')}
            className={cn(
              'w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all text-left select-none',
              openSection === 'blog'
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
                  openSection === 'blog' && 'rotate-180 text-foreground',
                )}
              />
            </div>
          </button>

          {openSection === 'blog' && (
            <div className="animate-in fade-in-50 duration-150">
              {renderNavItems(blogNavItems)}
            </div>
          )}
        </div>

        {/* ======================================================== */}
        {/* ACCORDION SECTION 4: DEVELOPER TOOLS                     */}
        {/* ======================================================== */}
        <div className="rounded-xl border border-border/60 bg-card/50 overflow-hidden shadow-2xs">
          <button
            type="button"
            onClick={() => handleToggleSection('tools')}
            className={cn(
              'w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all text-left select-none',
              openSection === 'tools'
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
                  openSection === 'tools' && 'rotate-180 text-foreground',
                )}
              />
            </div>
          </button>

          {openSection === 'tools' && (
            <div className="p-2 space-y-1 animate-in fade-in-50 duration-150">
              <a
                href="http://localhost:3000/api/docs"
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

      {/* FOOTER INFO */}
      <div className="p-4 border-t border-border/60 bg-muted/10">
        <div className="text-[11px] text-muted-foreground text-center">
          Shaadwood Admin v1.0 • Exclusive Nav
        </div>
      </div>
    </div>
  );
}
