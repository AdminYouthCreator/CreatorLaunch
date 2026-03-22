import React from 'react';
import { useCartContext } from '@/context/CartContext';
import { useRouter } from 'next/router';

const CartDrawer: React.FC = () => {
  const { items, itemCount, subtotal, isOpen, closeCart, removeItem, updateQuantity, clearCart } = useCartContext();
  const router = useRouter();

  if (!isOpen) return null;

  const handleCheckout = () => {
    closeCart();
    router.push('/checkout');
  };

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={closeCart} />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-bold text-dark">
            Shopping Cart ({itemCount})
          </h2>
          <button onClick={closeCart} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
              </svg>
              <p className="text-medium">Your cart is empty</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item, idx) => (
                <div key={`${item.id}-${item.variant?.size || idx}`} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                  {/* Thumbnail */}
                  <div className="w-16 h-16 bg-gray-200 rounded-md flex-shrink-0 overflow-hidden">
                    {item.mockupUrl ? (
                      <img src={item.mockupUrl} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-dark truncate">{item.name}</h3>
                    {item.variant?.size && (
                      <p className="text-xs text-medium mt-0.5">Size: {item.variant.size}</p>
                    )}
                    {item.variant?.color && (
                      <p className="text-xs text-medium">Color: {item.variant.color}</p>
                    )}
                    <p className="text-sm font-bold text-primary mt-1">${item.unitPrice.toFixed(2)}</p>

                    {/* Quantity */}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1, item.variant?.size)}
                        className="w-6 h-6 flex items-center justify-center rounded bg-gray-200 hover:bg-gray-300 text-sm font-bold"
                      >
                        −
                      </button>
                      <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1, item.variant?.size)}
                        className="w-6 h-6 flex items-center justify-center rounded bg-gray-200 hover:bg-gray-300 text-sm font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeItem(item.id, item.variant?.size)}
                    className="text-gray-400 hover:text-red-500 transition-colors self-start"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t p-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-medium">Subtotal</span>
              <span className="font-bold text-dark">${subtotal.toFixed(2)}</span>
            </div>
            <p className="text-xs text-medium">Shipping and taxes calculated at checkout</p>
            <button
              onClick={handleCheckout}
              className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors"
            >
              Proceed to Checkout
            </button>
            <button
              onClick={clearCart}
              className="w-full text-medium text-sm py-2 hover:text-red-500 transition-colors"
            >
              Clear Cart
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
