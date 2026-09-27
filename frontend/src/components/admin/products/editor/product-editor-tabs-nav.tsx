'use client';

import * as React from 'react';
import { Info, DollarSign, Image as ImageIcon, Layers, TreePine } from 'lucide-react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ProductEditorTabsNavProps {
  specCount: number;
  variantCount: number;
  imageCount: number;
}

export function ProductEditorTabsNav({
  specCount,
  variantCount,
  imageCount,
}: ProductEditorTabsNavProps) {
  return (
    <TabsList className="bg-muted/80 p-1 rounded-xl">
      <TabsTrigger value="overview" className="gap-2 text-xs font-semibold rounded-lg font-sans">
        <Info className="w-3.5 h-3.5" />
        <span>مشخصات پایه</span>
      </TabsTrigger>
      <TabsTrigger value="specifications" className="gap-2 text-xs font-semibold rounded-lg font-sans">
        <TreePine className="w-3.5 h-3.5" />
        <span>مشخصات فنی ({specCount})</span>
      </TabsTrigger>
      <TabsTrigger value="pricing" className="gap-2 text-xs font-semibold rounded-lg font-sans">
        <DollarSign className="w-3.5 h-3.5" />
        <span>قیمت و انبار</span>
      </TabsTrigger>
      <TabsTrigger value="variations" className="gap-2 text-xs font-semibold rounded-lg font-sans">
        <Layers className="w-3.5 h-3.5" />
        <span>تنوع‌ها ({variantCount})</span>
      </TabsTrigger>
      <TabsTrigger value="media" className="gap-2 text-xs font-semibold rounded-lg font-sans">
        <ImageIcon className="w-3.5 h-3.5" />
        <span>گالری ({imageCount})</span>
      </TabsTrigger>
    </TabsList>
  );
}
