'use client';

import * as React from 'react';
import { Share2, Check, Copy } from 'lucide-react';
import { toast } from 'sonner';

interface BlogShareButtonProps {
  title: string;
}

export function BlogShareButton({ title }: BlogShareButtonProps) {
  const [copied, setCopied] = React.useState(false);

  const handleShare = async () => {
    if (typeof window === 'undefined') return;

    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          url,
        });
        return;
      } catch {
        // Fallback to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success('Article link copied to clipboard');
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error('Unable to copy link to clipboard');
    }
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-border/80 bg-white hover:bg-zen-100/70 text-xs font-medium text-foreground transition-all cursor-pointer shadow-2xs"
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5 text-emerald-600" />
          <span className="text-emerald-700 font-semibold">Link Copied</span>
        </>
      ) : (
        <>
          <Share2 className="w-3.5 h-3.5 text-shaad-800" />
          <span>Share Article</span>
        </>
      )}
    </button>
  );
}
