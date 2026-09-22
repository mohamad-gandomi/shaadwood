'use client';

import * as React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Image as ImageIcon,
  Search,
  UploadCloud,
  Check,
  Plus,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { api, MediaSettings } from '@/lib/api';
import { MediaItem } from '@/types';
import { cn } from '@/lib/utils';

function formatBytes(bytes: number, decimals = 1) {
  if (!+bytes) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export interface MediaPickerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (media: MediaItem) => void;
  title?: string;
  description?: string;
}

export function MediaPickerDialog({
  open,
  onOpenChange,
  onSelect,
  title = 'Select Media from Library',
  description = 'Choose an existing catalog asset or upload a new file directly into PostgreSQL storage.',
}: MediaPickerDialogProps) {
  const queryClient = useQueryClient();
  const [search, setSearch] = React.useState('');
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [convertToWebp, setConvertToWebp] = React.useState(true);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  // System Settings query
  const { data: mediaSettings } = useQuery<MediaSettings>({
    queryKey: ['system-setting', 'media'],
    queryFn: () => api.getSetting<MediaSettings>('media'),
    staleTime: 1000 * 60 * 5,
  });

  React.useEffect(() => {
    if (mediaSettings && typeof mediaSettings.convertToWebp === 'boolean') {
      setConvertToWebp(mediaSettings.convertToWebp);
    }
  }, [mediaSettings]);

  const {
    data: mediaList = [],
    isLoading,
    isRefetching,
    refetch,
  } = useQuery({
    queryKey: ['media-picker', search],
    queryFn: () => api.getMedia(search.trim() || undefined),
    enabled: open,
  });

  const uploadMutation = useMutation({
    mutationFn: (file: File) =>
      api.uploadMedia(file, {
        convertToWebp,
        quality: mediaSettings?.qualityPreset ?? 80,
        maxWidth: mediaSettings?.maxWidthOption ?? 2048,
      }),
    onSuccess: (uploaded) => {
      toast.success(`Uploaded "${uploaded.originalName}" to Media Library`);
      queryClient.invalidateQueries({ queryKey: ['media'] });
      queryClient.invalidateQueries({ queryKey: ['media-picker'] });
      queryClient.invalidateQueries({ queryKey: ['media-count'] });
      queryClient.invalidateQueries({ queryKey: ['media-storage-stats'] });
      onSelect(uploaded);
      onOpenChange(false);
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Upload failed');
    },
  });

  const handleUploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    uploadMutation.mutate(file);
  };

  const handleChoose = (media: MediaItem) => {
    setSelectedId(media.id);
    onSelect(media);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl w-[calc(100vw-1.5rem)] sm:w-full max-h-[90dvh] flex flex-col p-3.5 sm:p-6 overflow-x-hidden overscroll-contain">
        <DialogHeader className="pb-3 border-b border-border/60">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pr-7 sm:pr-6">
            <div>
              <DialogTitle className="text-base flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-primary" />
                <span>{title}</span>
              </DialogTitle>
              <DialogDescription className="text-xs mt-0.5">
                {description}
              </DialogDescription>
            </div>

            {/* Quick Upload Action */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                disabled={isRefetching}
                className="h-8 text-xs gap-1.5"
                title="Refresh assets"
              >
                <RefreshCw className={cn('w-3.5 h-3.5', isRefetching && 'animate-spin')} />
              </Button>

              <Button
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadMutation.isPending}
                className="h-8 text-xs font-semibold gap-1.5 shadow-xs shrink-0"
              >
                <UploadCloud className="w-3.5 h-3.5" />
                <span>{uploadMutation.isPending ? 'Uploading...' : 'Upload New'}</span>
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleUploadFile}
                accept="image/*"
                className="hidden"
              />
            </div>
          </div>

          {/* Search Bar & WebP Option */}
          <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search media by filename, joinery, or alt text..."
                className="pl-8 text-xs h-8"
              />
            </div>

            <label className="flex items-center gap-1.5 cursor-pointer text-xs text-muted-foreground select-none shrink-0 hover:text-foreground">
              <input
                type="checkbox"
                checked={convertToWebp}
                onChange={(e) => setConvertToWebp(e.target.checked)}
                className="rounded border-border w-3.5 h-3.5 text-primary focus:ring-primary"
              />
              <Sparkles className="w-3 h-3 text-emerald-600" />
              <span>Convert to WebP</span>
            </label>
          </div>
        </DialogHeader>

        {/* Media Grid */}
        <div className="flex-1 overflow-y-auto py-3">
          {isLoading ? (
            <div className="text-center py-16 text-xs text-muted-foreground">
              Loading Media Library assets...
            </div>
          ) : mediaList.length === 0 ? (
            <div className="text-center py-16 space-y-2 text-muted-foreground">
              <ImageIcon className="w-8 h-8 mx-auto opacity-40" />
              <p className="text-xs font-medium text-foreground">No media assets found</p>
              <p className="text-[11px]">
                {search ? `No matches for "${search}"` : 'Upload an image above to populate the library.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 p-1">
              {mediaList.map((item) => {
                const isSelected = selectedId === item.id;
                const ext = item.filename.split('.').pop()?.toUpperCase() || 'IMG';

                return (
                  <div
                    key={item.id}
                    onClick={() => handleChoose(item)}
                    className={cn(
                      'group rounded-xl border p-1.5 bg-card cursor-pointer transition-all hover:border-primary hover:shadow-xs relative flex flex-col justify-between select-none',
                      isSelected ? 'border-primary ring-2 ring-primary/40 bg-primary/5' : 'border-border',
                    )}
                  >
                    <div className="aspect-square bg-muted/60 rounded-lg overflow-hidden relative flex items-center justify-center">
                      <img
                        src={item.url}
                        alt={item.altText || item.originalName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        loading="lazy"
                      />
                      {ext === 'WEBP' ? (
                        <span className="absolute top-1 left-1 text-[9px] font-mono font-bold bg-emerald-700/90 text-white px-1 py-0.2 rounded shadow-2xs flex items-center gap-0.5 backdrop-blur-xs">
                          <Sparkles className="w-2 h-2" />
                          WEBP
                        </span>
                      ) : (
                        <span className="absolute top-1 left-1 text-[9px] font-mono font-bold bg-black/60 text-white px-1 py-0.2 rounded">
                          {ext}
                        </span>
                      )}

                      {item.width && item.height ? (
                        <span className="absolute bottom-1 left-1 text-[8px] font-mono font-medium bg-black/60 text-white/90 px-1 rounded backdrop-blur-xs">
                          {item.width}×{item.height}
                        </span>
                      ) : null}

                      {isSelected && (
                        <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                          <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-xs">
                            <Check className="w-3.5 h-3.5" />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="pt-1.5 px-0.5 space-y-0.5">
                      <p className="text-[11px] font-semibold text-foreground truncate" title={item.originalName}>
                        {item.originalName}
                      </p>
                      <div className="flex items-center justify-between text-[10px] text-muted-foreground font-mono">
                        <span>{formatBytes(item.size)}</span>
                        <span className="text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                          Select →
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
