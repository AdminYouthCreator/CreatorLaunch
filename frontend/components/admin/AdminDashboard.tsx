import React, { useEffect, useState } from 'react';
import {
  FiUsers,
  FiShoppingBag,
  FiDollarSign,
  FiActivity,
  FiAlertTriangle,
  FiPackage,
  FiTool,
} from 'react-icons/fi';
import { adminAPI } from '@/utils/adminApi';

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalStores: number;
  activeStores: number;
  totalProducts: number;
  totalServices: number;
  totalRevenue: number;
  monthlyRevenue: number;
  pendingApprovals: number;
  systemAlerts: number;
}

interface RecentActivity {
  id: string;
  type:
    | 'user_registration'
    | 'store_creation'
    | 'order_placed'
    | 'user_login'
    | 'product_created';
  description: string;
  timestamp: string;
  user?: string;
  status: 'success' | 'warning' | 'error';
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      setError('');

      const data = await adminAPI.getOverview();

      setStats(data.stats);
      setRecentActivity(data.recentActivity || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load admin dashboard.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount || 0);
  };

  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const getActivityIcon = (type: RecentActivity['type']) => {
    switch (type) {
      case 'user_registration':
        return FiUsers;
      case 'store_creation':
        return FiShoppingBag;
      case 'order_placed':
        return FiDollarSign;
      case 'product_created':
        return FiPackage;
      case 'user_login':
      default:
        return FiActivity;
    }
  };

  if (isLoading) {
    return (
      <div className="admin-loading">
        <div className="admin-spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-page">
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4">
          {error}
        </div>

        <button onClick={loadDashboardData} className="admin-btn mt-4">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-header">
            <div className="admin-stat-icon users">
              <FiUsers />
            </div>
          </div>
          <h3 className="admin-stat-value">{stats?.totalUsers.toLocaleString() || 0}</h3>
          <p className="admin-stat-label">Total Users</p>
          <p className="admin-stat-change positive">{stats?.activeUsers || 0} verified</p>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-header">
            <div className="admin-stat-icon stores">
              <FiShoppingBag />
            </div>
          </div>
          <h3 className="admin-stat-value">{stats?.totalStores || 0}</h3>
          <p className="admin-stat-label">Total Stores</p>
          <p className="admin-stat-change positive">{stats?.activeStores || 0} active</p>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-header">
            <div className="admin-stat-icon revenue">
              <FiDollarSign />
            </div>
          </div>
          <h3 className="admin-stat-value">{formatCurrency(stats?.totalRevenue || 0)}</h3>
          <p className="admin-stat-label">Total Revenue</p>
          <p className="admin-stat-change positive">
            {formatCurrency(stats?.monthlyRevenue || 0)} this month
          </p>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-header">
            <div className="admin-stat-icon alerts">
              <FiAlertTriangle />
            </div>
          </div>
          <h3 className="admin-stat-value">{stats?.pendingApprovals || 0}</h3>
          <p className="admin-stat-label">Active Invites</p>
          <p className="admin-stat-change">
            {stats?.systemAlerts || 0} system alerts
          </p>
        </div>
      </div>

      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-header">
            <div className="admin-stat-icon stores">
              <FiPackage />
            </div>
          </div>
          <h3 className="admin-stat-value">{stats?.totalProducts || 0}</h3>
          <p className="admin-stat-label">Products</p>
          <p className="admin-stat-change">Created by users</p>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-header">
            <div className="admin-stat-icon users">
              <FiTool />
            </div>
          </div>
          <h3 className="admin-stat-value">{stats?.totalServices || 0}</h3>
          <p className="admin-stat-label">Services</p>
          <p className="admin-stat-change">Published or drafted</p>
        </div>
      </div>

      <div className="admin-activity">
        <div className="flex items-center justify-between mb-4">
          <h3>Recent Activity</h3>
          <button onClick={loadDashboardData} className="admin-btn secondary">
            Refresh
          </button>
        </div>

        {recentActivity.length === 0 ? (
          <div className="text-gray-500 p-6 text-center">
            No platform activity yet.
          </div>
        ) : (
          recentActivity.map((activity) => {
            const IconComponent = getActivityIcon(activity.type);

            return (
              <div key={activity.id} className="admin-activity-item">
                <div
                  className={`admin-activity-icon ${
                    activity.type === 'user_registration'
                      ? 'user'
                      : activity.type === 'store_creation'
                        ? 'store'
                        : activity.status === 'warning'
                          ? 'warning'
                          : 'store'
                  }`}
                >
                  <IconComponent />
                </div>

                <div className="admin-activity-content">
                  <p className="admin-activity-text">{activity.description}</p>
                  <p className="admin-activity-time">{formatTimeAgo(activity.timestamp)}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
