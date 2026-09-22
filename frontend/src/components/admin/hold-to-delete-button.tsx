'use client';

import * as React from 'react';
import { Trash2, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface HoldToDeleteButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
  /**
   * Callback fired once user holds the button for the full duration
   */
  onTrigger?: () => void;
  /**
   * Alias for onTrigger
   */
  onConfirm?: () => void;
  /**
   * Duration in milliseconds required to confirm the action (default: 1500ms)
   */
  holdDurationMs?: number;
  /**
   * Loading state while delete request is processing
   */
  isPending?: boolean;
  /**
   * Normal button label when resting
   */
  label?: string;
  /**
   * Label while user is actively holding down the button
   */
  holdingLabel?: string;
  /**
   * Label when deletion is actively running
   */
  pendingLabel?: string;
  /**
   * Size variant
   */
  size?: 'sm' | 'default' | 'lg';
  /**
   * Show live percentage pill during hold
   */
  showPercentage?: boolean;
}

export function HoldToDeleteButton({
  onTrigger,
  onConfirm,
  holdDurationMs = 1500,
  isPending = false,
  disabled = false,
  label = 'Hold to Delete',
  holdingLabel = 'Keep Holding...',
  pendingLabel = 'Deleting...',
  size = 'default',
  showPercentage = true,
  className,
  ...props
}: HoldToDeleteButtonProps) {
  const [progress, setProgress] = React.useState(0);
  const [isHolding, setIsHolding] = React.useState(false);

  const startTimeRef = React.useRef<number | null>(null);
  const animFrameRef = React.useRef<number | null>(null);
  const hasTriggeredRef = React.useRef(false);
  const pointerIdRef = React.useRef<number | null>(null);

  const handleAction = React.useCallback(() => {
    if (onTrigger) {
      onTrigger();
    } else if (onConfirm) {
      onConfirm();
    }
  }, [onTrigger, onConfirm]);

  const cancelHold = React.useCallback(() => {
    if (hasTriggeredRef.current) return;

    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }

    startTimeRef.current = null;
    pointerIdRef.current = null;

    if (isHolding) {
      setIsHolding(false);
      setProgress(0);
    }
  }, [isHolding]);

  const startHold = React.useCallback(() => {
    if (disabled || isPending) return;

    hasTriggeredRef.current = false;
    setIsHolding(true);
    startTimeRef.current = performance.now();

    // Haptic feedback tap on mobile if supported
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(15);
      } catch {}
    }

    const step = (now: number) => {
      if (!startTimeRef.current) return;
      const elapsed = now - startTimeRef.current;
      const cur = Math.min(100, (elapsed / holdDurationMs) * 100);
      setProgress(cur);

      if (cur >= 100) {
        if (!hasTriggeredRef.current) {
          hasTriggeredRef.current = true;
          setIsHolding(false);
          setProgress(100);

          // Success confirmation haptics
          if (typeof window !== 'undefined' && 'vibrate' in navigator) {
            try {
              navigator.vibrate([40, 30, 40]);
            } catch {}
          }

          handleAction();
        }
        return;
      }

      animFrameRef.current = requestAnimationFrame(step);
    };

    animFrameRef.current = requestAnimationFrame(step);
  }, [disabled, isPending, holdDurationMs, handleAction]);

  // Clean up timers on unmount or modal close
  React.useEffect(() => {
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // Reset progress if isPending stops
  React.useEffect(() => {
    if (!isPending) {
      setProgress(0);
      setIsHolding(false);
      hasTriggeredRef.current = false;
      startTimeRef.current = null;
    }
  }, [isPending]);

  // Unified Pointer handlers for seamless desktop mouse + mobile touch support
  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    // Only respond to primary click / single touch
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    if (disabled || isPending) return;

    pointerIdRef.current = e.pointerId;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}

    startHold();
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (pointerIdRef.current === e.pointerId) {
      try {
        if (e.currentTarget.hasPointerCapture(e.pointerId)) {
          e.currentTarget.releasePointerCapture(e.pointerId);
        }
      } catch {}
    }
    cancelHold();
  };

  const handlePointerCancel = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (pointerIdRef.current === e.pointerId) {
      try {
        if (e.currentTarget.hasPointerCapture(e.pointerId)) {
          e.currentTarget.releasePointerCapture(e.pointerId);
        }
      } catch {}
    }
    cancelHold();
  };

  const sizeClasses = {
    sm: 'h-8 px-3 text-xs gap-1.5',
    default: 'h-9 px-4 text-xs sm:text-sm gap-2',
    lg: 'h-10 px-5 text-sm gap-2.5',
  }[size];

  return (
    <button
      type="button"
      disabled={disabled || isPending}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      onPointerLeave={cancelHold}
      onContextMenu={(e) => e.preventDefault()}
      onKeyDown={(e) => {
        if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) {
          e.preventDefault();
          startHold();
        }
      }}
      onKeyUp={(e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          cancelHold();
        }
      }}
      aria-busy={isPending}
      aria-label={`${label}. Press and hold for ${holdDurationMs / 1000} seconds to confirm.`}
      style={{
        touchAction: 'none',
        WebkitUserSelect: 'none',
        WebkitTouchCallout: 'none',
      }}
      className={cn(
        'relative overflow-hidden group select-none transition-all duration-150 inline-flex items-center justify-center font-medium rounded-lg border',
        'touch-none',
        // Base Idle / Neutral appearance
        'bg-destructive/10 text-destructive border-destructive/30 hover:bg-destructive/15 dark:bg-destructive/20 dark:hover:bg-destructive/25',
        // Active Holding animation states
        isHolding &&
          'scale-[0.98] border-destructive shadow-md ring-2 ring-destructive/30 bg-destructive/20 text-white',
        // Disabled or pending
        (disabled || isPending) && 'opacity-60 cursor-not-allowed pointer-events-none',
        sizeClasses,
        className
      )}
      {...props}
    >
      {/* Animated Fill Progress Bar */}
      <div
        className={cn(
          'absolute inset-y-0 left-0 bg-destructive pointer-events-none transition-all',
          isHolding ? 'duration-0 ease-linear' : 'duration-200 ease-out'
        )}
        style={{ width: `${progress}%` }}
      />

      {/* Glowing Edge Line on Progress Front */}
      {isHolding && progress > 0 && progress < 100 && (
        <div
          className="absolute top-0 bottom-0 w-1 bg-white/90 shadow-[0_0_10px_rgba(255,255,255,0.9)] pointer-events-none transition-none"
          style={{ left: `calc(${progress}% - 2px)` }}
        />
      )}

      {/* Dynamic Foreground Content */}
      <span
        className={cn(
          'relative z-10 flex items-center justify-center gap-1.5 transition-colors duration-150 w-full',
          (isHolding || progress > 25) && 'text-white font-semibold drop-shadow-xs'
        )}
      >
        {isPending ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : isHolding ? (
          <Trash2 className="w-3.5 h-3.5 animate-pulse text-white shrink-0" />
        ) : (
          <Trash2 className="w-3.5 h-3.5 transition-transform group-hover:scale-110 shrink-0" />
        )}

        <span className="truncate">
          {isPending ? pendingLabel : isHolding ? holdingLabel : label}
        </span>

        {/* Progress Indicator pill */}
        {isHolding && showPercentage && (
          <span className="ml-1 text-[10px] font-mono font-bold tracking-tight px-1.5 py-0.2 rounded bg-black/40 text-white backdrop-blur-xs shrink-0">
            {Math.round(progress)}%
          </span>
        )}

        {/* Subtle (Hold) cue when idle */}
        {!isHolding && !isPending && (
          <span className="text-[10px] font-mono opacity-60 ml-0.5 uppercase tracking-wider font-semibold shrink-0">
            (Hold)
          </span>
        )}
      </span>
    </button>
  );
}
