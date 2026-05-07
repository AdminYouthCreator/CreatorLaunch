import React, { useEffect, useMemo, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { adminAPI } from '@/utils/adminApi';
import {
  FiRefreshCw,
  FiSearch,
  FiShield,
  FiLock,
  FiSlash,
  FiAlertTriangle,
  FiCheckCircle,
  FiUserX,
  FiShoppingBag,
} from 'react-icons/fi';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'Creator' | 'Admin';
  status: 'active' | 'inactive';
  accountStatus?: 'active' | 'pending_verification' | 'suspended' | 'banned' | 'locked';
  accountStatusReason?: string;
  emailVerified: boolean;
  storeCount: number;
  hasCompletedOnboarding: boolean;
  guardianEmail?: string;
  isMinor: boolean;
  age?: number | null;
}

interface AdminStore {
  id: string;
  name: string;
  url: string;
  description: string;
  logoUrl?: string | null;
  owner: {
    id: string;
    name: string;
    email: string;
  };
  status: 'active' | 'locked' | 'hidden' | 'suspended' | 'under_review';
  statusReason?: string;
  productCount: number;
  serviceCount: number;
  totalSales: number;
  monthlyRevenue: number;
}

type UserStatus = 'active' | 'pending_verification' | 'suspended' | 'banned' | 'locked';
type StoreStatus = 'active' | 'locked' | 'hidden' | 'suspended' | 'under_review';

const userStatuses: UserStatus[] = [
  'active',
  'pending_verification',
  'suspended',
  'banned',
  'locked',
];

const storeStatuses: StoreStatus[] = [
  'active',
  'locked',
  'hidden',
  'suspended',
  'under_review',
];

const AdminSecurityPage: React.FC = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [stores, setStores] = useState<AdminStore[]>([]);
  const [activeTab, setActiveTab] = useState<'users' | 'stores'>('users');
  const [searchTerm, setSearchTerm] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(true);
  const [updatingKey, setUpdatingKey] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadSecurityData();
  }, []);

  const loadSecurityData = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const [usersData, storesData] = await Promise.all([
        adminAPI.getUsers(),
        adminAPI.getStores(),
      ]);

      setUsers(usersData.users || []);
      setStores(storesData.stores || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load security data.');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = useMemo(() => {
    const search = searchTerm.toLowerCase();

    return users.filter((user) => {
      return (
        user.name?.toLowerCase().includes(search) ||
        user.email?.toLowerCase().includes(search) ||
        user.role?.toLowerCase().includes(search)
      );
    });
  }, [users, searchTerm]);

  const filteredStores = useMemo(() => {
    const search = searchTerm.toLowerCase();

    return stores.filter((store) => {
      return (
        store.name?.toLowerCase().includes(search) ||
        store.url?.toLowerCase().includes(search) ||
        store.owner?.email?.toLowerCase().includes(search) ||
        store.owner?.name?.toLowerCase().includes(search)
      );
    });
  }, [stores, searchTerm]);

  const restrictedUsers = users.filter((user) =>
    ['suspended', 'banned', 'locked'].includes(user.accountStatus || '')
  ).length;

  const restrictedStores = stores.filter((store) =>
    ['locked', 'hidden', 'suspended', 'under_review'].includes(store.status)
  ).length;

  const handleUserStatusChange = async (userId: string, status: UserStatus) => {
    const confirmed = window.confirm(`Change this user's status to "${status}"?`);

    if (!confirmed) return;

    try {
      setUpdatingKey(`user-${userId}`);
      setError('');
      setSuccess('');

      await adminAPI.updateUserStatus(userId, {
        status,
        reason,
      });

      setSuccess(`User status updated to ${status}.`);
      setReason('');
      await loadSecurityData();
    } catch (err: any) {
      setError(err.message || 'Failed to update user status.');
    } finally {
      setUpdatingKey('');
    }
  };

  const handleForcePasswordReset = async (userId: string) => {
    const confirmed = window.confirm('Force this user to reset their password?');

    if (!confirmed) return;

    try {
      setUpdatingKey(`reset-${userId}`);
      setError('');
      setSuccess('');

      await adminAPI.forceUserPasswordReset(userId, {
        reason,
      });

      setSuccess('User has been marked for password reset.');
      setReason('');
    } catch (err: any) {
      setError(err.message || 'Failed to force password reset.');
    } finally {
      setUpdatingKey('');
    }
  };

  const handleStoreStatusChange = async (storeId: string, status: StoreStatus) => {
    const confirmed = window.confirm(`Change this store's status to "${status}"?`);

    if (!confirmed) return;

    try {
      setUpdatingKey(`store-${storeId}`);
      setError('');
      setSuccess('');

      await adminAPI.updateStoreStatus(storeId, {
        status,
        reason,
      });

      setSuccess(`Store status updated to ${status}.`);
      setReason('');
      await loadSecurityData();
    } catch (err: any) {
      setError(err.message || 'Failed to update store status.');
    } finally {
      setUpdatingKey('');
    }
  };

  const getStatusClass = (status?: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700';
      case 'pending_verification':
      case 'under_review':
        return 'bg-yellow-100 text-yellow-700';
      case 'suspended':
      case 'locked':
      case 'hidden':
        return 'bg-orange-100 text-orange-700';
      case 'banned':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const formatStatus = (status?: string) => {
    return (status || 'active').replace(/_/g, ' ');
  };

  return (
    <AdminLayout>
      <div className="admin-page">
        <div className="admin-page-header">
          <div>
            <h1>Security Management</h1>
            <p>Suspend users, ban accounts, lock stores, and enforce platform safety.</p>
          </div>

          <button onClick={loadSecurityData} className="admin-btn secondary">
            <FiRefreshCw />
            Refresh
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 mb-6">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg p-4 mb-6">
            {success}
          </div>
        )}

        <div className="admin-stats-grid mb-8">
          <div className="admin-stat-card">
            <div className="admin-stat-header">
              <div className="admin-stat-icon users">
                <FiShield />
              </div>
            </div>
            <h3 className="admin-stat-value">{restrictedUsers}</h3>
            <p className="admin-stat-label">Restricted Users</p>
            <p className="admin-stat-change">Suspended, banned, or locked</p>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-header">
              <div className="admin-stat-icon alerts">
                <FiShoppingBag />
              </div>
            </div>
            <h3 className="admin-stat-value">{restrictedStores}</h3>
            <p className="admin-stat-label">Restricted Stores</p>
            <p className="admin-stat-change">Hidden, locked, or under review</p>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-header">
              <div className="admin-stat-icon stores">
                <FiCheckCircle />
              </div>
            </div>
            <h3 className="admin-stat-value">{users.length}</h3>
            <p className="admin-stat-label">Users Monitored</p>
            <p className="admin-stat-change positive">Real account data</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <label className="block text-sm font-semibold mb-2">
            Reason for next moderation action
          </label>
          <textarea
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            placeholder="Example: Store temporarily locked because product content needs review."
            rows={3}
            className="w-full px-4 py-3 border rounded-lg"
          />
          <p className="text-xs text-gray-500 mt-2">
            This reason will be saved in the audit log.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('users')}
                className={`px-4 py-2 rounded-lg font-medium ${
                  activeTab === 'users'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                Users
              </button>

              <button
                onClick={() => setActiveTab('stores')}
                className={`px-4 py-2 rounded-lg font-medium ${
                  activeTab === 'stores'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                Stores
              </button>
            </div>

            <div className="relative">
              <FiSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder={`Search ${activeTab}...`}
                className="pl-10 pr-4 py-2 border rounded-lg"
              />
            </div>
          </div>
        </div>

        <div className="admin-table-container">
          {loading ? (
            <div className="p-8 text-center">Loading security data...</div>
          ) : activeTab === 'users' ? (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Current Status</th>
                  <th>Verification</th>
                  <th>Security Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.map((user) => {
                  const accountStatus = user.accountStatus || 'active';

                  return (
                    <tr key={user.id}>
                      <td>
                        <div>
                          <div className="font-semibold">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                          {user.isMinor && (
                            <div className="text-xs text-yellow-700">
                              Minor user · Guardian: {user.guardianEmail || 'Not provided'}
                            </div>
                          )}
                        </div>
                      </td>

                      <td>{user.role}</td>

                      <td>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${getStatusClass(
                            accountStatus
                          )}`}
                        >
                          {formatStatus(accountStatus)}
                        </span>
                      </td>

                      <td>
                        {user.emailVerified ? (
                          <span className="text-green-600 font-medium">Verified</span>
                        ) : (
                          <span className="text-yellow-600 font-medium">Unverified</span>
                        )}
                      </td>

                      <td>
                        <div className="flex flex-wrap gap-2">
                          {userStatuses.map((status) => (
                            <button
                              key={status}
                              type="button"
                              onClick={() => handleUserStatusChange(user.id, status)}
                              disabled={updatingKey === `user-${user.id}` || accountStatus === status}
                              className={`admin-btn ${
                                status === 'active'
                                  ? 'secondary'
                                  : status === 'banned'
                                    ? 'danger'
                                    : 'secondary'
                              }`}
                            >
                              {status === 'active' && <FiCheckCircle />}
                              {status === 'locked' && <FiLock />}
                              {status === 'banned' && <FiUserX />}
                              {status === 'suspended' && <FiSlash />}
                              {status === 'pending_verification' && <FiAlertTriangle />}
                              {formatStatus(status)}
                            </button>
                          ))}

                          <button
                            type="button"
                            onClick={() => handleForcePasswordReset(user.id)}
                            disabled={updatingKey === `reset-${user.id}`}
                            className="admin-btn secondary"
                          >
                            Force Password Reset
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center p-8">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Store</th>
                  <th>Owner</th>
                  <th>Current Status</th>
                  <th>Products</th>
                  <th>Security Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredStores.map((store) => (
                  <tr key={store.id}>
                    <td>
                      <div>
                        <div className="font-semibold">{store.name}</div>
                        <div className="text-sm text-gray-500">{store.url}</div>
                      </div>
                    </td>

                    <td>
                      <div>
                        <div className="font-medium">{store.owner.name}</div>
                        <div className="text-sm text-gray-500">{store.owner.email}</div>
                      </div>
                    </td>

                    <td>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${getStatusClass(
                          store.status
                        )}`}
                      >
                        {formatStatus(store.status)}
                      </span>
                    </td>

                    <td>
                      {store.productCount} products · {store.serviceCount} services
                    </td>

                    <td>
                      <div className="flex flex-wrap gap-2">
                        {storeStatuses.map((status) => (
                          <button
                            key={status}
                            type="button"
                            onClick={() => handleStoreStatusChange(store.id, status)}
                            disabled={updatingKey === `store-${store.id}` || store.status === status}
                            className={`admin-btn ${
                              status === 'active'
                                ? 'secondary'
                                : status === 'suspended' || status === 'hidden'
                                  ? 'danger'
                                  : 'secondary'
                            }`}
                          >
                            {status === 'active' && <FiCheckCircle />}
                            {status === 'locked' && <FiLock />}
                            {status === 'hidden' && <FiSlash />}
                            {status === 'suspended' && <FiUserX />}
                            {status === 'under_review' && <FiAlertTriangle />}
                            {formatStatus(status)}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredStores.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center p-8">
                      No stores found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSecurityPage;
