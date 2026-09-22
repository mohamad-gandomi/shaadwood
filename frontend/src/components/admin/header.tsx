'use client';

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Server, Menu, Armchair, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { NavContent } from './nav-content';
import { api } from '@/lib/api';

export function Header({ title }: { title?: string }) {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  // Query backend categories tree to verify live connection status
  const { isSuccess, isError } = useQuery({
    queryKey: ['backend-health'],
    queryFn: async () => {
      const res = await fetch('http://localhost:3000/api/v1/categories');
      return res.ok;
    },
    refetchInterval: 10000,
  });

  return (
    <header className="h-16 border-b border-border/70 bg-card/60 backdrop-blur-sm px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        {/* Mobile Hamburger Drawer */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="lg:hidden h-9 w-9 shrink-0 text-muted-foreground hover:text-foreground"
              aria-label="Toggle navigation menu"
            >
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-72 flex flex-col">
            <div className="h-16 flex items-center px-6 border-b border-border/60 gap-3 shrink-0">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground shadow-xs">
                <Armchair className="w-4 h-4 text-wood-100" />
              </div>
              <div>
                <span className="font-bold text-sm tracking-tight block text-foreground">
                  Shaadwood
                </span>
                <span className="text-[10px] text-muted-foreground uppercase font-medium tracking-wider block -mt-0.5">
                  Furniture Admin
                </span>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              <NavContent onItemClick={() => setMobileOpen(false)} />
            </div>
          </SheetContent>
        </Sheet>

        <h1 className="text-base sm:text-lg md:text-xl font-bold text-foreground tracking-tight truncate">
          {title || 'Dashboard Overview'}
        </h1>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        {/* Backend Connectivity Status */}
        <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 rounded-full border border-border/60 bg-background/80 text-xs shadow-2xs">
          <Server className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
          <span className="text-muted-foreground font-medium hidden sm:inline">NestJS API:</span>
          {isSuccess ? (
            <span className="flex items-center gap-1.5 text-emerald-600 font-semibold text-[11px] sm:text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              Connected
            </span>
          ) : isError ? (
            <span className="flex items-center gap-1.5 text-destructive font-semibold text-[11px] sm:text-xs">
              <span className="w-2 h-2 rounded-full bg-destructive shrink-0" />
              Offline
            </span>
          ) : (
            <span className="text-muted-foreground text-[11px] sm:text-xs">Checking...</span>
          )}
        </div>

        {/* Current Admin User */}
        <div className="flex items-center gap-2 pl-2 border-l border-border/60">
          <div className="w-8 h-8 rounded-full bg-wood-200 text-wood-900 font-bold flex items-center justify-center text-xs border border-wood-300 shrink-0">
            SA
          </div>
          <div className="text-left hidden md:block">
            <div className="text-xs font-semibold leading-tight">Shaad Admin</div>
            <div className="text-[11px] text-muted-foreground leading-tight">admin@shaadwood.com</div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => api.logout()}
            className="h-8 w-8 p-0 text-muted-foreground hover:text-red-600 hover:bg-red-50"
            title="Sign Out of Admin"
          >
            <LogOut className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
