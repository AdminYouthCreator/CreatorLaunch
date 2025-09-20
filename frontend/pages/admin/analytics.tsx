import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { 
  FiTrendingUp, 
  FiUsers, 
  FiShoppingBag, 
  FiDollarSign,
  FiCalendar,
  FiDownload,
  FiRefreshCw
} from 'react-icons/fi';

// ################## ----- ANALYTICS DATA INTERFACES ----- ##################
// Interfaces for analytics data structures
// ####################################################################
interface AnalyticsData {
  overview: {
    totalUsers: number;
    totalStores: number;
    totalRevenue: number;
    totalOrders: number;
    userGrowth: number;
    storeGrowth: number;
    revenueGrowth: number;
    orderGrowth: number;
  };
  chartData: {
    userRegistrations: { date: string; count: number }[];
    storeCreations: { date: string; count: number }[];
    revenue: { date: string; amount: number }[];
    orders: { date: string; count: number }[];
  };
  demographics: {
    ageGroups: { label: string; value: number }[];
    locations: { country: string; users: number; stores: number }[];
    categories: { category: string; stores: number; revenue: number }[];
  };
}

// ################## ----- ANALYTICS PAGE ----- ##################
// Admin analytics dashboard with comprehensive metrics
// ############################################################

const AnalyticsPage: React.FC = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30d');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadAnalyticsData();
  }, [dateRange]);

  const loadAnalyticsData = async () => {
    try {
      setIsLoading(true);
      
      // Mock data - replace with real API call
      const mockData: AnalyticsData = {
        overview: {
          totalUsers: 1247,
          totalStores: 156,
          totalRevenue: 45320.50,
          totalOrders: 892,
          userGrowth: 12.5,
          storeGrowth: 8.3,
          revenueGrowth: 15.7,
          orderGrowth: 10.2
        },
        chartData: {
          userRegistrations: [
            { date: '2024-01-01', count: 15 },
            { date: '2024-01-02', count: 23 },
            { date: '2024-01-03', count: 18 },
            { date: '2024-01-04', count: 31 },
            { date: '2024-01-05', count: 27 },
            { date: '2024-01-06', count: 19 },
            { date: '2024-01-07', count: 25 }
          ],
          storeCreations: [
            { date: '2024-01-01', count: 3 },
            { date: '2024-01-02', count: 5 },
            { date: '2024-01-03', count: 2 },
            { date: '2024-01-04', count: 7 },
            { date: '2024-01-05', count: 4 },
            { date: '2024-01-06', count: 6 },
            { date: '2024-01-07', count: 3 }
          ],
          revenue: [
            { date: '2024-01-01', amount: 1250.50 },
            { date: '2024-01-02', amount: 1890.75 },
            { date: '2024-01-03', amount: 1420.25 },
            { date: '2024-01-04', amount: 2150.00 },
            { date: '2024-01-05', amount: 1750.50 },
            { date: '2024-01-06', amount: 1980.25 },
            { date: '2024-01-07', amount: 1650.75 }
          ],
          orders: [
            { date: '2024-01-01', count: 25 },
            { date: '2024-01-02', count: 38 },
            { date: '2024-01-03', count: 29 },
            { date: '2024-01-04', count: 45 },
            { date: '2024-01-05', count: 35 },
            { date: '2024-01-06', count: 42 },
            { date: '2024-01-07', count: 33 }
          ]
        },
        demographics: {
          ageGroups: [
            { label: '13-17', value: 35 },
            { label: '18-24', value: 45 },
            { label: '25-30', value: 20 }
          ],
          locations: [
            { country: 'United States', users: 567, stores: 89 },
            { country: 'Canada', users: 234, stores: 34 },
            { country: 'United Kingdom', users: 189, stores: 22 },
            { country: 'Australia', users: 123, stores: 11 },
            { country: 'Germany', users: 89, stores: 8 }
          ],
          categories: [
            { category: 'Art & Design', stores: 45, revenue: 15250.75 },
            { category: 'Technology', stores: 32, revenue: 12890.50 },
            { category: 'Fashion', stores: 28, revenue: 8940.25 },
            { category: 'Music', stores: 25, revenue: 5670.00 },
            { category: 'Business', stores: 18, revenue: 3890.25 },
            { category: 'Other', stores: 8, revenue: 1290.50 }
          ]
        }
      };
      
      setData(mockData);
    } catch (error) {
      console.error('Failed to load analytics data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadAnalyticsData();
    setRefreshing(false);
  };

  const exportReport = () => {
    // TODO: Implement report export
    alert('Exporting analytics report...');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  const getGrowthColor = (growth: number) => {
    return growth > 0 ? 'text-green-600' : growth < 0 ? 'text-red-600' : 'text-gray-600';
  };

  if (isLoading) {
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
        {/* Header */}
        <div className="admin-page-header">
          <div>
            <h1 className="admin-page-title">Analytics Dashboard</h1>
            <p className="admin-page-subtitle">Platform performance metrics and insights</p>
          </div>
          <div className="admin-page-actions">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="admin-filter-select"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 3 months</option>
              <option value="1y">Last year</option>
            </select>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="admin-btn secondary"
            >
              <FiRefreshCw />
              Refresh
            </button>
            <button onClick={exportReport} className="admin-btn">
              <FiDownload />
              Export Report
            </button>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="admin-analytics-grid">
          <div className="admin-analytics-card">
            <div className="admin-analytics-header">
              <h3 className="admin-analytics-title">Total Users</h3>
              <div style={{ padding: '0.5rem', background: '#dbeafe', borderRadius: '0.5rem' }}>
                <FiUsers style={{ color: '#3b82f6' }} />
              </div>
            </div>
            <div className="admin-analytics-value">{data?.overview.totalUsers.toLocaleString()}</div>
            <div className={`admin-analytics-change ${(data?.overview.userGrowth || 0) > 0 ? 'positive' : 'negative'}`}>
              {formatPercentage(data?.overview.userGrowth || 0)}
            </div>
          </div>

          <div className="admin-analytics-card">
            <div className="admin-analytics-header">
              <h3 className="admin-analytics-title">Total Stores</h3>
              <div style={{ padding: '0.5rem', background: '#d1fae5', borderRadius: '0.5rem' }}>
                <FiShoppingBag style={{ color: '#10b981' }} />
              </div>
            </div>
            <div className="admin-analytics-value">{data?.overview.totalStores}</div>
            <div className={`admin-analytics-change ${(data?.overview.storeGrowth || 0) > 0 ? 'positive' : 'negative'}`}>
              {formatPercentage(data?.overview.storeGrowth || 0)}
            </div>
          </div>

          <div className="admin-analytics-card">
            <div className="admin-analytics-header">
              <h3 className="admin-analytics-title">Total Revenue</h3>
              <div style={{ padding: '0.5rem', background: '#fef3c7', borderRadius: '0.5rem' }}>
                <FiDollarSign style={{ color: '#f59e0b' }} />
              </div>
            </div>
            <div className="admin-analytics-value">{formatCurrency(data?.overview.totalRevenue || 0)}</div>
            <div className={`admin-analytics-change ${(data?.overview.revenueGrowth || 0) > 0 ? 'positive' : 'negative'}`}>
              {formatPercentage(data?.overview.revenueGrowth || 0)}
            </div>
          </div>

          <div className="admin-analytics-card">
            <div className="admin-analytics-header">
              <h3 className="admin-analytics-title">Total Orders</h3>
              <div style={{ padding: '0.5rem', background: '#e0e7ff', borderRadius: '0.5rem' }}>
                <FiTrendingUp style={{ color: '#6366f1' }} />
              </div>
            </div>
            <div className="admin-analytics-value">{data?.overview.totalOrders}</div>
            <div className={`admin-analytics-change ${(data?.overview.orderGrowth || 0) > 0 ? 'positive' : 'negative'}`}>
              {formatPercentage(data?.overview.orderGrowth || 0)}
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="admin-analytics-chart-grid">
          {/* User Registrations Chart */}
          <div className="admin-analytics-card">
            <div className="admin-analytics-header">
              <h3 className="admin-analytics-title">User Registrations</h3>
            </div>
            <div className="admin-chart-container">
              {data?.chartData.userRegistrations.map((item, index) => (
                <div key={index} className="admin-chart-bar">
                  <div
                    className="admin-chart-fill blue"
                    style={{
                      height: `${(item.count / Math.max(...data.chartData.userRegistrations.map(d => d.count))) * 100}%`
                    }}
                  ></div>
                  <span className="admin-chart-label">
                    {new Date(item.date).getDate()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Revenue Chart */}
          <div className="admin-analytics-card">
            <div className="admin-analytics-header">
              <h3 className="admin-analytics-title">Daily Revenue</h3>
            </div>
            <div className="admin-chart-container">
              {data?.chartData.revenue.map((item, index) => (
                <div key={index} className="admin-chart-bar">
                  <div
                    className="admin-chart-fill green"
                    style={{
                      height: `${(item.amount / Math.max(...data.chartData.revenue.map(d => d.amount))) * 100}%`
                    }}
                  ></div>
                  <span className="admin-chart-label">
                    {new Date(item.date).getDate()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Demographics Section */}
        <div className="admin-analytics-chart-grid demographics">
          {/* Age Demographics */}
          <div className="admin-analytics-card">
            <div className="admin-analytics-header">
              <h3 className="admin-analytics-title">Age Demographics</h3>
            </div>
            <div className="admin-demographics-list">
              {data?.demographics.ageGroups.map((group, index) => (
                <div key={index} className="admin-demographic-item">
                  <span className="admin-demographic-label">{group.label} years</span>
                  <div className="admin-progress-container">
                    <div className="admin-progress-bar">
                      <div
                        className="admin-progress-fill"
                        style={{ width: `${group.value}%` }}
                      ></div>
                    </div>
                    <span className="admin-demographic-value">{group.value}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Countries */}
          <div className="admin-analytics-card">
            <div className="admin-analytics-header">
              <h3 className="admin-analytics-title">Top Countries</h3>
            </div>
            <div className="admin-demographics-list">
              {data?.demographics.locations.map((location, index) => (
                <div key={index} className="admin-demographic-item">
                  <span className="admin-demographic-label">{location.country}</span>
                  <div className="admin-demographic-stats">
                    <div className="admin-stat-value">{location.users} users</div>
                    <div className="admin-stat-label">{location.stores} stores</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Store Categories */}
          <div className="admin-analytics-card">
            <div className="admin-analytics-header">
              <h3 className="admin-analytics-title">Store Categories</h3>
            </div>
            <div className="admin-demographics-list">
              {data?.demographics.categories.map((category, index) => (
                <div key={index} className="admin-demographic-item">
                  <span className="admin-demographic-label">{category.category}</span>
                  <div className="admin-demographic-stats">
                    <div className="admin-stat-value">{category.stores} stores</div>
                    <div className="admin-stat-label">{formatCurrency(category.revenue)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AnalyticsPage;
