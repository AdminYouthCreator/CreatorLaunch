import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { 
  FiSearch, 
  FiFilter, 
  FiMoreVertical, 
  FiEdit, 
  FiTrash2, 
  FiMail, 
  FiKey,
  FiEye,
  FiUserPlus,
  FiDownload
} from 'react-icons/fi';

// ################## ----- USER INTERFACE ----- ##################
// Interface for user data in admin panel
// ################################################################
interface User {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'inactive' | 'suspended';
  registrationDate: Date;
  lastLogin?: Date;
  storeCount: number;
  hasCompletedOnboarding: boolean;
  role: 'user' | 'store_owner' | 'admin';
  guardianEmail?: string;
  isMinor: boolean;
}

// ################## ----- USERS MANAGEMENT PAGE ----- ##################
// Admin page for managing all platform users
// ####################################################################

const UsersManagementPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'suspended'>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, statusFilter]);

  const loadUsers = async () => {
    try {
      // Mock data - replace with real API call
      const mockUsers: User[] = [
        {
          id: '1',
          name: 'Sarah Johnson',
          email: 'sarah@example.com',
          status: 'active',
          registrationDate: new Date('2024-01-15'),
          lastLogin: new Date('2024-02-01'),
          storeCount: 1,
          hasCompletedOnboarding: true,
          role: 'store_owner',
          isMinor: false
        },
        {
          id: '2',
          name: 'Mike Chen',
          email: 'mike@example.com',
          status: 'active',
          registrationDate: new Date('2024-01-20'),
          lastLogin: new Date('2024-01-31'),
          storeCount: 0,
          hasCompletedOnboarding: false,
          role: 'user',
          isMinor: true,
          guardianEmail: 'parent@example.com'
        },
        {
          id: '3',
          name: 'Emma Davis',
          email: 'emma@example.com',
          status: 'suspended',
          registrationDate: new Date('2024-01-10'),
          lastLogin: new Date('2024-01-25'),
          storeCount: 2,
          hasCompletedOnboarding: true,
          role: 'store_owner',
          isMinor: false
        }
      ];
      
      setUsers(mockUsers);
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(user => user.status === statusFilter);
    }

    setFilteredUsers(filtered);
  };

  const getStatusColor = (status: User['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  const handleResetPassword = (user: User) => {
    // TODO: Implement password reset
    alert(`Password reset link sent to ${user.email}`);
  };

  const handleSuspendUser = (user: User) => {
    // TODO: Implement user suspension
    alert(`User ${user.name} suspended`);
  };

  const handleDeleteUser = (user: User) => {
    if (confirm(`Are you sure you want to delete user ${user.name}? This action cannot be undone.`)) {
      // TODO: Implement user deletion
      alert(`User ${user.name} deleted`);
    }
  };

  const exportUsers = () => {
    // TODO: Implement CSV export
    alert('Exporting users to CSV...');
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
            <h1 className="admin-page-title">Users Management</h1>
            <p className="admin-page-subtitle">Manage all platform users and their permissions</p>
          </div>
          <div className="admin-page-actions">
            <button onClick={exportUsers} className="admin-btn secondary">
              <FiDownload />
              Export
            </button>
            <button className="admin-btn">
              <FiUserPlus />
              Add User
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="admin-stats-row">
          <div className="admin-mini-stat">
            <div className="admin-mini-stat-icon users">👥</div>
            <div className="admin-mini-stat-value">{users.length}</div>
            <div className="admin-mini-stat-label">Total Users</div>
          </div>
          <div className="admin-mini-stat">
            <div className="admin-mini-stat-icon users">✅</div>
            <div className="admin-mini-stat-value">{users.filter(u => u.status === 'active').length}</div>
            <div className="admin-mini-stat-label">Active Users</div>
          </div>
          <div className="admin-mini-stat">
            <div className="admin-mini-stat-icon users">🏪</div>
            <div className="admin-mini-stat-value">{users.filter(u => u.storeCount > 0).length}</div>
            <div className="admin-mini-stat-label">Store Owners</div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="admin-search-container">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="admin-search-input"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="admin-filter-select"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
          </select>
          <span style={{ marginLeft: '1rem', color: '#6b7280', fontSize: '0.875rem' }}>
            Showing {filteredUsers.length} of {users.length} users
          </span>
        </div>

        {/* Users Table */}
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Status</th>
                <th>Registration</th>
                <th>Last Login</th>
                <th>Stores</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div style={{ 
                        width: '2.5rem', 
                        height: '2.5rem', 
                        backgroundColor: '#dbeafe', 
                        borderRadius: '50%', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        marginRight: '1rem'
                      }}>
                        <span style={{ fontWeight: '600', color: '#3b82f6' }}>
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div style={{ fontWeight: '500' }}>{user.name}</div>
                        <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>{user.email}</div>
                        {user.isMinor && (
                          <div style={{ fontSize: '0.75rem', color: '#f59e0b' }}>
                            Minor (Guardian: {user.guardianEmail})
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`admin-status-badge ${user.status}`}>
                      {user.status}
                    </span>
                    {!user.hasCompletedOnboarding && (
                      <div style={{ fontSize: '0.75rem', color: '#f59e0b', marginTop: '0.25rem' }}>
                        Onboarding incomplete
                      </div>
                    )}
                  </td>
                  <td>{formatDate(user.registrationDate)}</td>
                  <td>{user.lastLogin ? formatDate(user.lastLogin) : 'Never'}</td>
                  <td>{user.storeCount}</td>
                  <td>
                    <div className="admin-table-actions">
                      <button
                        onClick={() => setSelectedUser(user)}
                        className="admin-action-btn view"
                        title="View User"
                      >
                        <FiEye />
                      </button>
                      <button
                        onClick={() => handleResetPassword(user)}
                        className="admin-action-btn edit"
                        title="Reset Password"
                      >
                        <FiKey />
                      </button>
                      <button className="admin-action-btn edit" title="Edit User">
                        <FiEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user)}
                        className="admin-action-btn delete"
                        title="Delete User"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default UsersManagementPage;
