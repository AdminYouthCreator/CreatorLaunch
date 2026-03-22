import React, { useState, useEffect } from 'react';
import Layout from '@/components/common/Layout';
import AuthGuard from '@/components/common/AuthGuard';
import { orderAPI } from '@/utils/api';

interface OrderItem {
  name: string;
  itemType: string;
  quantity: number;
  unitPrice: number;
  variant?: { size?: string; color?: string };
}

interface Order {
  _id: string;
  orderNumber: string;
  buyer: { name: string; email: string };
  items: OrderItem[];
  subtotal: number;
  total: number;
  profit: number;
  paymentStatus: string;
  fulfillmentStatus: string;
  trackingNumber?: string;
  createdAt: string;
}

const statusBadge = (status: string) => {
  const map: Record<string, string> = {
    paid: 'bg-green-100 text-green-700',
    pending: 'bg-yellow-100 text-yellow-700',
    failed: 'bg-red-100 text-red-700',
    refunded: 'bg-gray-100 text-gray-700',
    unfulfilled: 'bg-orange-100 text-orange-700',
    processing: 'bg-blue-100 text-blue-700',
    shipped: 'bg-indigo-100 text-indigo-700',
    delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
  };
  return map[status] || 'bg-gray-100 text-gray-700';
};

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, [page]);

  const fetchOrders = async () => {
    try {
      const data = await orderAPI.getAll(page);
      setOrders(data.orders || []);
      setTotalPages(data.pagination?.pages || 1);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateFulfillment = async (orderId: string, fulfillmentStatus: string) => {
    setUpdatingId(orderId);
    try {
      await orderAPI.updateFulfillment(orderId, { fulfillmentStatus });
      setOrders(prev =>
        prev.map(o => o._id === orderId ? { ...o, fulfillmentStatus } : o)
      );
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update order');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <AuthGuard>
      <Layout title="Orders | CreatorLaunch">
        <div className="min-h-screen bg-light">
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-dark mb-2">Orders</h1>
            <p className="text-medium mb-8">Track and manage your customer orders</p>

            {loading ? (
              <div className="flex justify-center py-16">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
              </div>
            ) : error ? (
              <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>
            ) : orders.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <h2 className="text-xl font-bold text-dark mb-2">No orders yet</h2>
                <p className="text-medium">When customers purchase from your store, orders will appear here.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map(order => (
                  <div key={order._id} className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-bold text-dark text-lg">{order.orderNumber}</h3>
                          <span className={`text-xs font-medium px-2 py-0.5 rounded ${statusBadge(order.paymentStatus)}`}>
                            {order.paymentStatus}
                          </span>
                          <span className={`text-xs font-medium px-2 py-0.5 rounded ${statusBadge(order.fulfillmentStatus)}`}>
                            {order.fulfillmentStatus}
                          </span>
                        </div>
                        <p className="text-sm text-medium">
                          {order.buyer.name} &middot; {order.buyer.email} &middot; {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-dark">${order.total.toFixed(2)}</p>
                        <p className="text-sm text-green-600 font-medium">Profit: ${order.profit.toFixed(2)}</p>
                      </div>
                    </div>

                    {/* Items */}
                    <div className="border-t pt-3 mb-4">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-sm py-1">
                          <span className="text-medium">
                            {item.name}
                            {item.variant?.size ? ` (${item.variant.size})` : ''}
                            {' '}&times; {item.quantity}
                          </span>
                          <span className="text-dark font-medium">${(item.unitPrice * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>

                    {/* Fulfillment Actions */}
                    {order.paymentStatus === 'paid' && order.fulfillmentStatus !== 'delivered' && order.fulfillmentStatus !== 'cancelled' && (
                      <div className="border-t pt-3 flex gap-2">
                        {order.fulfillmentStatus === 'unfulfilled' && (
                          <button
                            onClick={() => handleUpdateFulfillment(order._id, 'processing')}
                            disabled={updatingId === order._id}
                            className="px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50"
                          >
                            Mark Processing
                          </button>
                        )}
                        {order.fulfillmentStatus === 'processing' && (
                          <button
                            onClick={() => handleUpdateFulfillment(order._id, 'shipped')}
                            disabled={updatingId === order._id}
                            className="px-3 py-1.5 text-sm bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors disabled:opacity-50"
                          >
                            Mark Shipped
                          </button>
                        )}
                        {order.fulfillmentStatus === 'shipped' && (
                          <button
                            onClick={() => handleUpdateFulfillment(order._id, 'delivered')}
                            disabled={updatingId === order._id}
                            className="px-3 py-1.5 text-sm bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors disabled:opacity-50"
                          >
                            Mark Delivered
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ))}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center gap-2 pt-4">
                    <button
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="px-4 py-2 border rounded-lg text-sm disabled:opacity-50 hover:bg-gray-50"
                    >
                      Previous
                    </button>
                    <span className="px-4 py-2 text-sm text-medium">
                      Page {page} of {totalPages}
                    </span>
                    <button
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="px-4 py-2 border rounded-lg text-sm disabled:opacity-50 hover:bg-gray-50"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </Layout>
    </AuthGuard>
  );
};

export default OrdersPage;
