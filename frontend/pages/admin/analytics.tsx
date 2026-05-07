import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { adminAPI } from '@/utils/adminApi';
import {
  FiRefreshCw,
  FiUsers,
  FiShoppingBag,
  FiDollarSign,
  FiPackage,
  FiTool,
  FiBarChart,
} from 'react-icons/fi';

interface Overview {
  totalUsers: number;
  totalStores: number;
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalServices: number;
  userGrowth: number;
  storeGrowth: number;
  revenueGrowth: number;
  orderGrowth: number;
}

interface ChartPoint {
  date: string;
  count?: number;
  amount?: number;
}

interface AnalyticsData {
  overview: Overview;
  chartData: {
    userRegistrations: ChartPoint[];
    storeCreations: ChartPoint[];
    revenue: ChartPoint[];
    orders: ChartPoint[];
  };
  demographics: {
    ageGroups: Array<{
      label: string;
      value: number;
      percent: number;
    }>;
    productStatuses: Array<{
      status: string;
      count: number;
    }>;
    serviceCategories: Array<{
      category: string;
      count: number;
    }>;
  };
}

const AdminAnalyticsPage: React.FC = () => {
  const [range, setRange] = useState('30d');
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadAnalytics();
  }, [range]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError('');

      const data = await adminAPI.getAnalytics(range);
      setAnalytics(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load analytics.');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount || 0);
  };

  const formatDate = (date: string) => {
    const parsed = new Date(date);
    return parsed.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
    });
  };

  const getMaxCount = (points: ChartPoint[], key: 'count' | 'amount') => {
    const max = Math.max(...points.map((point) => Number(point[key] || 0)), 1);
    return max;
  };

  const renderMiniBarChart = (
    title: string,
    points: ChartPoint[],
    key: 'count' | 'amount',
    type: 'number' | 'currency' = 'number'
  ) => {
    const max = getMaxCount(points, key);
    const visiblePoints = points.slice(-14);

    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-bold mb-4">{title}</h3>

        {visiblePoints.length === 0 ? (
          <p className="text-gray-500">No data yet.</p>
        ) : (
          <div className="flex items-end gap-2 h-48">
            {visiblePoints.map((point) => {
              const value = Number(point[key] || 0);
              const height = Math.max((value / max) * 100, value > 0 ? 8 : 2);

              return (
                <div key={point.date} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex items-end h-36">
                    <div
                      className="w-full bg-blue-600 rounded-t"
                      style={{ height: `${height}%` }}
                      title={`${formatDate(point.date)}: ${
                        type === 'currency' ? formatCurrency(value) : value
                      }`}
                    />
                  </div>

                  <span className="text-[10px] text-gray-500 rotate-45 origin-left whitespace-nowrap">
                    {formatDate(point.date)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const renderBreakdown = (
    title: string,
    items: Array<{ label?: string; status?: string; category?: string; value?: number; count?: number; percent?: number }>
  ) => {
    const normalized = items.map((item) => ({
      label: item.label || item.status || item.category || 'Unknown',
      value: Number(item.value ?? item.count ?? 0),
      percent: item.percent,
    }));

    const total = normalized.reduce((sum, item) => sum + item.value, 0) || 1;

    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-bold mb-4">{title}</h3>

        {normalized.length === 0 ? (
          <p className="text-gray-500">No data yet.</p>
        ) : (
          <div className="space-y-4">
            {normalized.map((item) => {
              const percent =
                typeof item.percent === 'number'
                  ? item.percent
                  : Math.round((item.value / total) * 100);

              return (
                <div key={item.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium capitalize">{item.label}</span>
                    <span className="text-gray-500">
                      {item.value} · {percent}%
                    </span>
                  </div>

                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  if (loading && !analytics) {
    return (
      <AdminLayout>
        <div className="admin-loading">
          <div className="admin-spinner"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="admin-page">
        <div className="admin-page-header">
          <div>
            <h1>Analytics</h1>
            <p>Real platform growth, revenue, product, service, and user analytics.</p>
          </div>

          <div className="flex gap-3">
            <select
              value={range}
              onChange={(event) => setRange(event.target.value)}
              className="px-4 py-2 border rounded-lg bg-white"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>

            <button onClick={loadAnalytics} className="admin-btn secondary">
              <FiRefreshCw />
              Refresh
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 mb-6">
            {error}
          </div>
        )}

        {analytics && (
          <>
            <div className="admin-stats-grid mb-8">
              <div className="admin-stat-card">
                <div className="admin-stat-header">
                  <div className="admin-stat-icon users">
                    <FiUsers />
                  </div>
                </div>
                <h3 className="admin-stat-value">{analytics.overview.totalUsers}</h3>
                <p className="admin-stat-label">Total Users</p>
                <p className="admin-stat-change positive">
                  +{analytics.overview.userGrowth} in range
                </p>
              </div>

              <div className="admin-stat-card">
                <div className="admin-stat-header">
                  <div className="admin-stat-icon stores">
                    <FiShoppingBag />
                  </div>
                </div>
                <h3 className="admin-stat-value">{analytics.overview.totalStores}</h3>
                <p className="admin-stat-label">Stores</p>
                <p className="admin-stat-change positive">
                  +{analytics.overview.storeGrowth} in range
                </p>
              </div>

              <div className="admin-stat-card">
                <div className="admin-stat-header">
                  <div className="admin-stat-icon revenue">
                    <FiDollarSign />
                  </div>
                </div>
                <h3 className="admin-stat-value">
                  {formatCurrency(analytics.overview.totalRevenue)}
                </h3>
                <p className="admin-stat-label">Revenue</p>
                <p className="admin-stat-change positive">
                  {formatCurrency(analytics.overview.revenueGrowth)} in range
                </p>
              </div>

              <div className="admin-stat-card">
                <div className="admin-stat-header">
                  <div className="admin-stat-icon alerts">
                    <FiBarChart />
                  </div>
                </div>
                <h3 className="admin-stat-value">{analytics.overview.totalOrders}</h3>
                <p className="admin-stat-label">Orders</p>
                <p className="admin-stat-change">
                  +{analytics.overview.orderGrowth} in range
                </p>
              </div>
            </div>

            <div className="admin-stats-grid mb-8">
              <div className="admin-stat-card">
                <div className="admin-stat-header">
                  <div className="admin-stat-icon stores">
                    <FiPackage />
                  </div>
                </div>
                <h3 className="admin-stat-value">{analytics.overview.totalProducts}</h3>
                <p className="admin-stat-label">Products</p>
                <p className="admin-stat-change">All stores</p>
              </div>

              <div className="admin-stat-card">
                <div className="admin-stat-header">
                  <div className="admin-stat-icon users">
                    <FiTool />
                  </div>
                </div>
                <h3 className="admin-stat-value">{analytics.overview.totalServices}</h3>
                <p className="admin-stat-label">Services</p>
                <p className="admin-stat-change">All stores</p>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6 mb-8">
              {renderMiniBarChart(
                'User Registrations',
                analytics.chartData.userRegistrations,
                'count'
              )}

              {renderMiniBarChart(
                'Store Creations',
                analytics.chartData.storeCreations,
                'count'
              )}

              {renderMiniBarChart(
                'Revenue',
                analytics.chartData.revenue,
                'amount',
                'currency'
              )}

              {renderMiniBarChart(
                'Orders',
                analytics.chartData.orders,
                'count'
              )}
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {renderBreakdown('User Age Groups', analytics.demographics.ageGroups)}
              {renderBreakdown('Product Statuses', analytics.demographics.productStatuses)}
              {renderBreakdown('Service Categories', analytics.demographics.serviceCategories)}
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminAnalyticsPage;
