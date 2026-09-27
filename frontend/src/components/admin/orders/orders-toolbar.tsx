'use client';

import * as React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface OrdersToolbarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
  totalOrdersCount: number;
}

const statusTabs = [
  { id: 'ALL', label: 'همه سفارش‌ها' },
  { id: 'PENDING', label: 'در انتظار بررسی' },
  { id: 'PROCESSING', label: 'در حال ساخت' },
  { id: 'SHIPPED', label: 'تحویل به باربری' },
  { id: 'DELIVERED', label: 'تحویل داده شده' },
  { id: 'CANCELLED', label: 'لغو شده' },
];

export function OrdersToolbar(props: OrdersToolbarProps) {
  const {
    searchTerm,
    setSearchTerm,
    selectedStatus,
    setSelectedStatus,
    totalOrdersCount,
  } = props;

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 font-sans" dir="rtl">
      <div className="flex items-center gap-3 flex-1 max-w-2xl">
        {/* Search input with right-placed icon for RTL */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2" />
          <Input
            placeholder="جستجو با شماره سفارش، نام مشتری، کد رهگیری، ایمیل..."
            className="pr-9 pl-3 bg-card h-9 text-xs text-right"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Status Filter Buttons */}
        <div className="flex items-center rounded-lg border border-border bg-card p-1 text-xs shrink-0 h-9 box-border overflow-x-auto">
          {statusTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSelectedStatus(tab.id)}
              className={`h-full px-2.5 sm:px-3 rounded-md font-medium transition-colors flex items-center justify-center whitespace-nowrap ${
                selectedStatus === tab.id
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="text-xs text-muted-foreground self-center sm:self-auto font-medium">
        نمایش <strong className="text-foreground">{totalOrdersCount}</strong> سفارش
      </div>
    </div>
  );
}
