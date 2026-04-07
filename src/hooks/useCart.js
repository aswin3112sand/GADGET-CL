import { useCallback, useEffect, useMemo, useState } from 'react';
import { clampQuantityToStock, getNumericStock } from '../utils/inventory';

const CART_STORAGE_KEY = 'gadget69_cart';

export const useCart = () => {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  const addToCart = useCallback((product, quantity = 1) => {
    const requested = Math.max(1, quantity);
    const stockQuantity = getNumericStock(product.stockQuantity);
    if (stockQuantity === 0) {
      return false;
    }

    let added = false;
    setCart(prev => {
      const existing = prev.find(i => i.productId === product.id);
      const nextQty = clampQuantityToStock((existing?.qty || 0) + requested, stockQuantity);
      if (nextQty === 0 || nextQty === existing?.qty) {
        return prev;
      }

      added = true;
      if (existing) {
        return prev.map(i =>
          i.productId === product.id
            ? { ...i, qty: nextQty, stockQuantity: stockQuantity ?? i.stockQuantity ?? null }
            : i
        );
      }
      return [...prev, {
        productId: product.id,
        name: product.name,
        imageUrl: product.imageUrl,
        sectionName: product.sectionName,
        price: Number(product.price),
        qty: nextQty,
        stockQuantity,
      }];
    });
    if (added) {
      setDrawerOpen(true);
    }
    return added;
  }, []);

  const removeFromCart = useCallback((productId) => {
    setCart(prev => prev.filter(i => i.productId !== productId));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const updateQuantity = useCallback((productId, quantity) => {
    setCart((current) => current.flatMap((item) => {
      if (item.productId !== productId) {
        return [item];
      }

      const nextQty = clampQuantityToStock(quantity, item.stockQuantity);
      if (nextQty <= 0) {
        return [];
      }

      return [{ ...item, qty: nextQty }];
    }));
  }, []);

  const totalItems = useMemo(() => cart.reduce((sum, item) => sum + item.qty, 0), [cart]);
  const totalPrice = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.qty, 0), [cart]);

  return {
    cart, setCart,
    drawerOpen, setDrawerOpen,
    addToCart, removeFromCart, clearCart, updateQuantity,
    totalItems, totalPrice,
  };
};
