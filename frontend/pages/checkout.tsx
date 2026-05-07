import React, { useState } from 'react';
import { useRouter } from 'next/router';
import StoreLayout from '@/components/store/StoreLayout';
import { useCartContext } from '@/context/CartContext';
import { checkoutAPI } from '@/utils/api';

const CheckoutPage: React.FC = () => {
  const router = useRouter();
  const { items, subtotal, clearCart, getCartStore } = useCartContext();

  const cartStore = getCartStore();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    name: '',
    email: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    zip: '',
  });

  const hasProducts = items.some((item) => item.itemType === 'product');
  const shipping = hasProducts ? 4.99 : 0;
  const tax = parseFloat((subtotal * 0.08).toFixed(2));
  const total = subtotal + shipping + tax;

  const store = cartStore
    ? {
        _id: cartStore.brandId,
        brandName: cartStore.brandName || 'Creator Store',
        subdomain: cartStore.brandSubdomain,
        logoUrl: cartStore.brandLogoUrl || null,
      }
    : null;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (items.length === 0) return;

    const brandId = items[0]?.brandId;

    if (!brandId || brandId === items[0]?.brandSubdomain) {
      setError('Checkout is missing a valid store ID. Please return to the store and add the item again.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const checkoutItems = items.map((item) => ({
        id: item.id,
        name: item.name,
        unitPrice: item.unitPrice,
        quantity: item.quantity,
        variant: item.variant,
        mockupUrl: item.mockupUrl,
        itemType: item.itemType as 'product' | 'service',
      }));

      const response = await checkoutAPI.createSession({
        items: checkoutItems,
        brandId,
        buyer: {
          name: form.name,
          email: form.email,
        },
      });

      if (response.url) {
        clearCart();
        window.location.href = response.url;
      } else {
        setError('Failed to create checkout session.');
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Checkout failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <StoreLayout store={store} title="Checkout | CreatorLaunch">
        <div className="min-h-screen bg-light flex items-center justify-center">
          <div className="text-center px-4">
            <svg className="w-20 h-20 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
            </svg>
            <h1 className="text-2xl font-bold text-dark mb-2">Your cart is empty</h1>
            <p className="text-medium mb-6">Add items to your cart before checking out.</p>
            <button
              onClick={() => router.back()}
              className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-red-600 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </StoreLayout>
    );
  }

  return (
    <StoreLayout store={store} title="Checkout | CreatorLaunch">
      <div className="min-h-screen bg-light">
        <div className="container mx-auto px-4 py-8">
          <button
            onClick={() => router.back()}
            className="text-medium hover:text-dark transition-colors mb-4"
          >
            ← Back to Store
          </button>

          <h1 className="text-3xl font-bold text-dark mb-8">Checkout</h1>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-lg font-bold text-dark mb-4">Contact Information</h2>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-dark mb-1">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={form.name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="John Doe"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-dark mb-1">Email</label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={form.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>
                </div>

                {hasProducts && (
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-lg font-bold text-dark mb-4">Shipping Address</h2>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-dark mb-1">Address Line 1</label>
                        <input
                          type="text"
                          name="line1"
                          required
                          value={form.line1}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder="123 Main St"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-dark mb-1">Address Line 2 (optional)</label>
                        <input
                          type="text"
                          name="line2"
                          value={form.line2}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder="Apt 4B"
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-dark mb-1">City</label>
                          <input
                            type="text"
                            name="city"
                            required
                            value={form.city}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-dark mb-1">State</label>
                          <input
                            type="text"
                            name="state"
                            required
                            value={form.state}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-dark mb-1">ZIP</label>
                          <input
                            type="text"
                            name="zip"
                            required
                            value={form.zip}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-white py-4 rounded-lg font-bold text-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Processing...' : `Pay $${total.toFixed(2)}`}
                </button>

                <p className="text-center text-xs text-medium">
                  Secure payment powered by Stripe. You will be redirected to complete payment.
                </p>
              </form>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                <h2 className="text-lg font-bold text-dark mb-4">Order Summary</h2>

                <div className="space-y-3 mb-6">
                  {items.map((item, index) => (
                    <div key={`${item.id}-${index}`} className="flex justify-between text-sm">
                      <div className="flex-1 min-w-0 mr-2">
                        <p className="font-medium text-dark truncate">{item.name}</p>
                        <p className="text-medium text-xs">Qty: {item.quantity}</p>
                      </div>

                      <span className="font-semibold text-dark whitespace-nowrap">
                        ${(item.unitPrice * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-medium">Subtotal</span>
                    <span className="text-dark">${subtotal.toFixed(2)}</span>
                  </div>

                  {hasProducts && (
                    <div className="flex justify-between">
                      <span className="text-medium">Shipping</span>
                      <span className="text-dark">${shipping.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span className="text-medium">Tax (est.)</span>
                    <span className="text-dark">${tax.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between border-t pt-2 text-lg font-bold">
                    <span className="text-dark">Total</span>
                    <span className="text-primary">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StoreLayout>
  );
};

export default CheckoutPage;
