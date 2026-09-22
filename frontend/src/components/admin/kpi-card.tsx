import * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  iconColor?: string;
}

export function KpiCard({ title, value, subtitle, icon: Icon, iconColor }: KpiCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {title}
            </p>
            <div className="text-2xl font-bold tracking-tight">{value}</div>
            {subtitle && (
              <p className="text-xs text-muted-foreground font-medium">{subtitle}</p>
            )}
          </div>
          <div
            className={cn(
              'w-11 h-11 rounded-xl flex items-center justify-center bg-wood-100/70 border border-wood-200/60',
              iconColor || 'text-primary',
            )}
          >
            <Icon className="w-5 h-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
