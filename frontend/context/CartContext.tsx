import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// ################## ----- CART ITEM INTERFACE ----- ##################
interface CartItem {
  id: string;
  brandId: string;
  brandSubdomain: string;
  name: string;
  unitPrice: number;
  quantity: number;
  itemType: 'product' | 'service';
  variant?: {
    size?: string;
    color?: string;
    printfulVariantId?: number;
  };
  mockupUrl?: string;
}

// ################## ----- CART CONTEXT TYPE ----- ##################
interface CartContextType {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  removeItem: (id: string, variantSize?: string) => void;
  updateQuantity: (id: string, quantity: number, variantSize?: string) => void;
  clearCart: () => void;
  getCartBrandId: () => string | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'creatorlaunch_cart';

// ################## ----- CART PROVIDER ----- ##################
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load cart:', e);
    }
  }, []);

  // Persist cart to localStorage
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);
  const toggleCart = () => setIsOpen(prev => !prev);

  const addItem = (newItem: Omit<CartItem, 'quantity'>, quantity = 1) => {
    setItems(prev => {
      // Cart items must all be from the same store
      if (prev.length > 0 && prev[0].brandId !== newItem.brandId) {
        if (!window.confirm('Your cart has items from a different store. Clear cart and add this item?')) {
          return prev;
        }
        return [{ ...newItem, quantity }];
      }

      const key = `${newItem.id}-${newItem.variant?.size || ''}`;
      const existing = prev.find(
        i => `${i.id}-${i.variant?.size || ''}` === key
      );

      if (existing) {
        return prev.map(i =>
          `${i.id}-${i.variant?.size || ''}` === key
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }

      return [...prev, { ...newItem, quantity }];
    });
    setIsOpen(true);
  };

  const removeItem = (id: string, variantSize?: string) => {
    setItems(prev =>
      prev.filter(i => !(i.id === id && (i.variant?.size || '') === (variantSize || '')))
    );
  };

  const updateQuantity = (id: string, quantity: number, variantSize?: string) => {
    if (quantity <= 0) {
      removeItem(id, variantSize);
      return;
    }
    setItems(prev =>
      prev.map(i =>
        i.id === id && (i.variant?.size || '') === (variantSize || '')
          ? { ...i, quantity }
          : i
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    setIsOpen(false);
  };

  const getCartBrandId = () => {
    return items.length > 0 ? items[0].brandId : null;
  };

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        isOpen,
        openCart,
        closeCart,
        toggleCart,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getCartBrandId,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCartContext = (): CartContextType => {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCartContext must be used within CartProvider');
  }
  return ctx;
};
