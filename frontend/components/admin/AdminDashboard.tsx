import React, { useState, useEffect } from 'react';
import { 
  FiUsers, 
  FiShoppingBag, 
  FiDollarSign, 
  FiTrendingUp,
  FiActivity,
  FiAlertTriangle,
  FiCheckCircle,
  FiClock
} from 'react-icons/fi';

// ################## ----- DASHBOARD STATS INTERFACE ----- ##################
// Interface for dashboard statistics
// ####################################################################
interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalStores: number;
  activeStores: number;
  totalRevenue: number;
  monthlyRevenue: number;
  pendingApprovals: number;
  systemAlerts: number;
}

// ################## ----- RECENT ACTIVITY INTERFACE ----- ##################
// Interface for recent activity items
// ####################################################################
interface RecentActivity {
  id: string;
  type: 'user_registration' | 'store_creation' | 'order_placed' | 'user_login';
  description: string;
  timestamp: Date;
  user?: string;
  status: 'success' | 'warning' | 'error';
}

// ################## ----- ADMIN DASHBOARD COMPONENT ----- ##################
// Main dashboard showing system overview and statistics
// ####################################################################

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Mock data - replace with real API calls
      const mockStats: DashboardStats = {
        totalUsers: 1247,
        activeUsers: 892,
        totalStores: 156,
        activeStores: 134,
        totalRevenue: 45320.50,
        monthlyRevenue: 8750.25,
        pendingApprovals: 12,
        systemAlerts: 3
      };

      const mockActivity: RecentActivity[] = [
        {
          id: '1',
          type: 'user_registration',
          description: 'New user registered: sarah@example.com',
          timestamp: new Date(Date.now() - 1000 * 60 * 15),
          user: 'sarah@example.com',
          status: 'success'
        },
        {
          id: '2',
          type: 'store_creation',
          description: 'New store created: "Creative Designs"',
          timestamp: new Date(Date.now() - 1000 * 60 * 30),
          user: 'john@example.com',
          status: 'success'
        },
        {
          id: '3',
          type: 'user_login',
          description: 'Multiple failed login attempts detected',
          timestamp: new Date(Date.now() - 1000 * 60 * 45),
          status: 'warning'
        },
        {
          id: '4',
          type: 'order_placed',
          description: 'Order #12345 placed - $89.99',
          timestamp: new Date(Date.now() - 1000 * 60 * 60),
          user: 'mike@example.com',
          status: 'success'
        }
      ];

      setStats(mockStats);
      setRecentActivity(mockActivity);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const getActivityIcon = (type: RecentActivity['type']) => {
    switch (type) {
      case 'user_registration': return FiUsers;
      case 'store_creation': return FiShoppingBag;
      case 'order_placed': return FiDollarSign;
      case 'user_login': return FiActivity;
      default: return FiActivity;
    }
  };

  const getStatusColor = (status: RecentActivity['status']) => {
    switch (status) {
      case 'success': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'error': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  if (isLoading) {
    return (
      <div className="admin-loading">
        <div className="admin-spinner"></div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* Stats Grid */}
      <div className="admin-stats-grid">
        {/* Total Users */}
        <div className="admin-stat-card">
          <div className="admin-stat-header">
            <div className="admin-stat-icon users">
              <FiUsers />
            </div>
          </div>
          <h3 className="admin-stat-value">{stats?.totalUsers.toLocaleString()}</h3>
          <p className="admin-stat-label">Total Users</p>
          <p className="admin-stat-change positive">{stats?.activeUsers} active</p>
        </div>

        {/* Total Stores */}
        <div className="admin-stat-card">
          <div className="admin-stat-header">
            <div className="admin-stat-icon stores">
              <FiShoppingBag />
            </div>
          </div>
          <h3 className="admin-stat-value">{stats?.totalStores}</h3>
          <p className="admin-stat-label">Total Stores</p>
          <p className="admin-stat-change positive">{stats?.activeStores} active</p>
        </div>

        {/* Revenue */}
        <div className="admin-stat-card">
          <div className="admin-stat-header">
            <div className="admin-stat-icon revenue">
              <FiDollarSign />
            </div>
          </div>
          <h3 className="admin-stat-value">{formatCurrency(stats?.totalRevenue || 0)}</h3>
          <p className="admin-stat-label">Total Revenue</p>
          <p className="admin-stat-change positive">{formatCurrency(stats?.monthlyRevenue || 0)} this month</p>
        </div>

        {/* System Status */}
        <div className="admin-stat-card">
          <div className="admin-stat-header">
            <div className="admin-stat-icon alerts">
              <FiAlertTriangle />
            </div>
          </div>
          <h3 className="admin-stat-value">{stats?.systemAlerts}</h3>
          <p className="admin-stat-label">System Alerts</p>
          <p className="admin-stat-change negative">{stats?.pendingApprovals} pending approvals</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="admin-activity">
        <h3>Recent Activity</h3>
        {recentActivity.map((activity) => {
          const IconComponent = getActivityIcon(activity.type);
          return (
            <div key={activity.id} className="admin-activity-item">
              <div className={`admin-activity-icon ${activity.type === 'user_registration' ? 'user' : activity.type === 'store_creation' ? 'store' : 'warning'}`}>
                <IconComponent />
              </div>
              <div className="admin-activity-content">
                <p className="admin-activity-text">{activity.description}</p>
                <p className="admin-activity-time">{formatTimeAgo(activity.timestamp)}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminDashboard;
