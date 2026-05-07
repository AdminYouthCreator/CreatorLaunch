import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// ################## ----- CART ITEM INTERFACE ----- ##################
interface CartItem {
  id: string;
  brandId: string; // MongoDB Brand _id, NOT the subdomain
  brandSubdomain: string;
  brandName?: string;
  brandLogoUrl?: string | null;
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
  getCartStore: () => {
    brandId: string;
    brandSubdomain: string;
    brandName?: string;
    brandLogoUrl?: string | null;
  } | null;
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
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setItems(parsed);
        }
      }
    } catch (error) {
      console.error('Failed to load cart:', error);
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
  const toggleCart = () => setIsOpen((prev) => !prev);

  const addItem = (newItem: Omit<CartItem, 'quantity'>, quantity = 1) => {
    setItems((prev) => {
      // Cart items must all be from the same store.
      // brandId MUST be the Mongo Brand _id, not the subdomain.
      if (prev.length > 0 && prev[0].brandId !== newItem.brandId) {
        const confirmed = window.confirm(
          'Your cart has items from a different store. Clear cart and add this item?'
        );

        if (!confirmed) {
          return prev;
        }

        return [{ ...newItem, quantity }];
      }

      const key = `${newItem.id}-${newItem.variant?.size || ''}-${newItem.variant?.color || ''}`;
      const existing = prev.find(
        (item) => `${item.id}-${item.variant?.size || ''}-${item.variant?.color || ''}` === key
      );

      if (existing) {
        return prev.map((item) =>
          `${item.id}-${item.variant?.size || ''}-${item.variant?.color || ''}` === key
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      return [...prev, { ...newItem, quantity }];
    });

    setIsOpen(true);
  };

  const removeItem = (id: string, variantSize?: string) => {
    setItems((prev) =>
      prev.filter((item) => !(item.id === id && (item.variant?.size || '') === (variantSize || '')))
    );
  };

  const updateQuantity = (id: string, quantity: number, variantSize?: string) => {
    if (quantity <= 0) {
      removeItem(id, variantSize);
      return;
    }

    setItems((prev) =>
      prev.map((item) =>
        item.id === id && (item.variant?.size || '') === (variantSize || '')
          ? { ...item, quantity }
          : item
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

  const getCartStore = () => {
    if (items.length === 0) return null;

    const firstItem = items[0];

    return {
      brandId: firstItem.brandId,
      brandSubdomain: firstItem.brandSubdomain,
      brandName: firstItem.brandName,
      brandLogoUrl: firstItem.brandLogoUrl,
    };
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
        getCartStore,
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
