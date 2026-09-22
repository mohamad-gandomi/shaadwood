'use client';

import { Armchair } from 'lucide-react';
import { NavContent } from './nav-content';

export function Sidebar() {
  return (
    <aside className="w-64 border-r border-border/70 bg-card/70 backdrop-blur-sm hidden lg:flex flex-col h-screen sticky top-0 shrink-0">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-border/60 gap-3 shrink-0">
        <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-primary-foreground shadow-xs">
          <Armchair className="w-5 h-5 text-wood-100" />
        </div>
        <div>
          <span className="font-bold text-base tracking-tight block text-foreground">
            Shaadwood
          </span>
          <span className="text-[11px] text-muted-foreground uppercase font-medium tracking-wider block -mt-0.5">
            Furniture Admin
          </span>
        </div>
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 overflow-y-auto">
        <NavContent />
      </div>
    </aside>
  );
}
