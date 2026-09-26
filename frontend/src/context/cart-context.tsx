'use client';

import * as React from 'react';
import { toast } from 'sonner';
import { ValidatedCoupon } from '@/types';

export interface CartItem {
  id: string;
  productId: string;
  variantId?: string;
  name: string;
  sku?: string;
  price: number;
  image?: string;
  finish?: string;
  quantity: number;
}

export interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  totalCount: number;
  totalPrice: number;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
  appliedCoupon: ValidatedCoupon | null;
  discountAmount: number;
  applyCoupon: (coupon: ValidatedCoupon, discountAmount: number) => void;
  removeCoupon: () => void;
}

const CartContext = React.createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'shaadwood_storefront_cart';
const COUPON_STORAGE_KEY = 'shaadwood_storefront_coupon';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<CartItem[]>([]);
  const [appliedCoupon, setAppliedCoupon] = React.useState<ValidatedCoupon | null>(null);
  const [discountAmount, setDiscountAmount] = React.useState<number>(0);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [isMounted, setIsMounted] = React.useState(false);

  // Load cart and coupon from localStorage on mount
  React.useEffect(() => {
    setIsMounted(true);
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        setItems(JSON.parse(stored));
      }
      const storedCoupon = localStorage.getItem(COUPON_STORAGE_KEY);
      if (storedCoupon) {
        const parsed = JSON.parse(storedCoupon);
        if (parsed?.coupon) {
          setAppliedCoupon(parsed.coupon);
          setDiscountAmount(parsed.discountAmount || 0);
        }
      }
    } catch {
      // Ignore parse errors
    }
  }, []);

  // Sync cart items to localStorage
  React.useEffect(() => {
    if (isMounted) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
      } catch {
        // Ignore storage errors
      }
    }
  }, [items, isMounted]);

  const totalCount = React.useMemo(() => {
    return items.reduce((acc, item) => acc + item.quantity, 0);
  }, [items]);

  const totalPrice = React.useMemo(() => {
    return items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }, [items]);

  // Keep discount amount in sync if cart price changes
  React.useEffect(() => {
    if (appliedCoupon && totalPrice > 0) {
      let disc = 0;
      if (appliedCoupon.discountType === 'PERCENTAGE') {
        disc = Math.round(((totalPrice * Number(appliedCoupon.discountValue)) / 100) * 100) / 100;
      } else {
        disc = Math.min(totalPrice, Number(appliedCoupon.discountValue));
      }
      setDiscountAmount(disc);
      try {
        localStorage.setItem(
          COUPON_STORAGE_KEY,
          JSON.stringify({ coupon: appliedCoupon, discountAmount: disc }),
        );
      } catch {
        // Ignore storage error
      }
    } else if (!appliedCoupon || totalPrice === 0) {
      setDiscountAmount(0);
      try {
        localStorage.removeItem(COUPON_STORAGE_KEY);
      } catch {
        // Ignore storage error
      }
    }
  }, [totalPrice, appliedCoupon]);

  const addItem = React.useCallback(
    (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
      const qty = item.quantity || 1;
      setItems((prev) => {
        const existingIndex = prev.findIndex((i) => i.id === item.id);
        if (existingIndex > -1) {
          const updated = [...prev];
          updated[existingIndex].quantity += qty;
          return updated;
        }
        return [...prev, { ...item, quantity: qty }];
      });

      toast.success(`${item.name} added to your collection`, {
        description: item.finish ? `Finish: ${item.finish}` : 'Handcrafted solid wood furniture',
      });
      setIsDrawerOpen(true);
    },
    [],
  );

  const removeItem = React.useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    toast.info('Item removed from cart');
  }, []);

  const updateQuantity = React.useCallback((id: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[],
    );
  }, []);

  const applyCoupon = React.useCallback((coupon: ValidatedCoupon, discount: number) => {
    setAppliedCoupon(coupon);
    setDiscountAmount(discount);
    try {
      localStorage.setItem(
        COUPON_STORAGE_KEY,
        JSON.stringify({ coupon, discountAmount: discount }),
      );
    } catch {
      // Ignore storage error
    }
  }, []);

  const removeCoupon = React.useCallback(() => {
    setAppliedCoupon(null);
    setDiscountAmount(0);
    try {
      localStorage.removeItem(COUPON_STORAGE_KEY);
    } catch {
      // Ignore storage error
    }
  }, []);

  const clearCart = React.useCallback(() => {
    setItems([]);
    setAppliedCoupon(null);
    setDiscountAmount(0);
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
      localStorage.removeItem(COUPON_STORAGE_KEY);
    } catch {
      // Ignore storage error
    }
  }, []);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalCount,
        totalPrice,
        isDrawerOpen,
        setIsDrawerOpen,
        appliedCoupon,
        discountAmount,
        applyCoupon,
        removeCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = React.useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
