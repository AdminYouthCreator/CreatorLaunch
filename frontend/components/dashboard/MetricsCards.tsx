import React, { useState, useEffect } from 'react';
import { orderAPI } from '@/utils/api';

interface Metrics {
  totalRevenue: number;
  totalProfit: number;
  totalOrders: number;
  recentOrders: Array<{
    _id: string;
    orderNumber: string;
    buyer: { name: string };
    total: number;
    paymentStatus: string;
    createdAt: string;
  }>;
}

interface MetricsCardsProps {
  className?: string;
}

const MetricsCards: React.FC<MetricsCardsProps> = ({ className = '' }) => {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderAPI.getMetrics()
      .then(data => setMetrics(data))
      .catch(() => setMetrics({ totalRevenue: 0, totalProfit: 0, totalOrders: 0, recentOrders: [] }))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className={`grid md:grid-cols-3 gap-4 ${className}`}>
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-24 mb-3"></div>
            <div className="h-8 bg-gray-200 rounded w-32"></div>
          </div>
        ))}
      </div>
    );
  }

  const cards = [
    {
      label: 'Total Revenue',
      value: `$${(metrics?.totalRevenue || 0).toFixed(2)}`,
      icon: (
        <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      bg: 'bg-green-50',
    },
    {
      label: 'Your Earnings',
      value: `$${(metrics?.totalProfit || 0).toFixed(2)}`,
      icon: (
        <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      bg: 'bg-blue-50',
    },
    {
      label: 'Total Sales',
      value: String(metrics?.totalOrders || 0),
      icon: (
        <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
        </svg>
      ),
      bg: 'bg-purple-50',
    },
  ];

  return (
    <div className={className}>
      {/* Metric Cards */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        {cards.map(card => (
          <div key={card.label} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-10 h-10 ${card.bg} rounded-lg flex items-center justify-center`}>
                {card.icon}
              </div>
              <span className="text-sm text-medium font-medium">{card.label}</span>
            </div>
            <p className="text-2xl font-bold text-dark">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      {metrics && metrics.recentOrders.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="font-bold text-dark mb-4">Recent Orders</h3>
          <div className="space-y-3">
            {metrics.recentOrders.map(order => (
              <div key={order._id} className="flex items-center justify-between py-2 border-b last:border-0">
                <div>
                  <p className="text-sm font-medium text-dark">{order.orderNumber}</p>
                  <p className="text-xs text-medium">{order.buyer.name} &middot; {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <span className="font-bold text-dark">${order.total.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MetricsCards;
