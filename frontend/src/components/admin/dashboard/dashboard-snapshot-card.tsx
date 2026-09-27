'use client';

import * as React from 'react';
import { Layers } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

interface DashboardSnapshotCardProps {
  productsCount: number;
  variableCount: number;
  totalVariants: number;
  simpleCount: number;
  attributesCount: number;
  blogPostsCount: number;
  mediaItemsCount: number;
}

export function DashboardSnapshotCard(props: DashboardSnapshotCardProps) {
  const {
    productsCount,
    variableCount,
    totalVariants,
    simpleCount,
    attributesCount,
    blogPostsCount,
    mediaItemsCount,
  } = props;

  return (
    <Card className="shadow-2xs border-border/70 font-sans" dir="rtl">
      <CardHeader className="pb-3 px-4 sm:px-6">
        <CardTitle className="text-sm font-bold flex items-center gap-2">
          <Layers className="w-4 h-4 text-primary" />
          <span>آمار کاتالوگ و پایگاه داده</span>
        </CardTitle>
        <CardDescription className="text-xs">
          توزیع اطلاعات و موجودیت‌ها در دیتابیس شادوود
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4 sm:px-6 pb-5 space-y-2 text-xs">
        <div className="flex items-center justify-between py-1.5 border-b border-border/50">
          <span className="text-muted-foreground">کل مدل‌های مبلمان و آثار</span>
          <span className="font-bold text-foreground font-sans">{productsCount}</span>
        </div>
        <div className="flex items-center justify-between py-1.5 border-b border-border/50">
          <span className="text-muted-foreground">مدل‌های متغیر چندویژگی</span>
          <span className="font-bold text-foreground font-sans">{variableCount} ({totalVariants} شناسه تنوع)</span>
        </div>
        <div className="flex items-center justify-between py-1.5 border-b border-border/50">
          <span className="text-muted-foreground">محصولات تک‌مدل ساده</span>
          <span className="font-bold text-foreground font-sans">{simpleCount}</span>
        </div>
        <div className="flex items-center justify-between py-1.5 border-b border-border/50">
          <span className="text-muted-foreground">ویژگی‌های چوب و کالیته پارچه</span>
          <span className="font-bold text-foreground font-sans">{attributesCount}</span>
        </div>
        <div className="flex items-center justify-between py-1.5 border-b border-border/50">
          <span className="text-muted-foreground">نوشته‌ها و مقالات وبلاگ</span>
          <span className="font-bold text-foreground font-sans">{blogPostsCount}</span>
        </div>
        <div className="flex items-center justify-between py-1.5">
          <span className="text-muted-foreground">پرونده‌ها و بافت‌های رسانه</span>
          <span className="font-bold text-foreground font-sans">{mediaItemsCount}</span>
        </div>
      </CardContent>
    </Card>
  );
}
