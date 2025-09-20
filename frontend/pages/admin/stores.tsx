import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { 
  FiSearch, 
  FiFilter, 
  FiEye, 
  FiEdit, 
  FiTrash2, 
  FiExternalLink,
  FiDollarSign,
  FiPackage,
  FiTrendingUp,
  FiDownload
} from 'react-icons/fi';

// ################## ----- STORE INTERFACE ----- ##################
// Interface for store data in admin panel
// ################################################################
interface Store {
  id: string;
  name: string;
  url: string;
  owner: {
    id: string;
    name: string;
    email: string;
  };
  status: 'active' | 'inactive' | 'suspended' | 'pending_approval';
  createdDate: Date;
  lastActivity?: Date;
  productCount: number;
  totalSales: number;
  monthlyRevenue: number;
  category: string;
  isApproved: boolean;
}

// ################## ----- STORES MANAGEMENT PAGE ----- ##################
// Admin page for managing all platform stores
// ####################################################################

const StoresManagementPage: React.FC = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [filteredStores, setFilteredStores] = useState<Store[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'suspended' | 'pending_approval'>('all');
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);

  useEffect(() => {
    loadStores();
  }, []);

  useEffect(() => {
    filterStores();
  }, [stores, searchTerm, statusFilter]);

  const loadStores = async () => {
    try {
      // Mock data - replace with real API call
      const mockStores: Store[] = [
        {
          id: '1',
          name: 'Creative Designs',
          url: 'creative-designs',
          owner: {
            id: '1',
            name: 'Sarah Johnson',
            email: 'sarah@example.com'
          },
          status: 'active',
          createdDate: new Date('2024-01-15'),
          lastActivity: new Date('2024-02-01'),
          productCount: 25,
          totalSales: 1250.50,
          monthlyRevenue: 320.75,
          category: 'Art & Design',
          isApproved: true
        },
        {
          id: '2',
          name: 'Tech Innovations',
          url: 'tech-innovations',
          owner: {
            id: '3',
            name: 'Emma Davis',
            email: 'emma@example.com'
          },
          status: 'suspended',
          createdDate: new Date('2024-01-10'),
          lastActivity: new Date('2024-01-25'),
          productCount: 15,
          totalSales: 890.25,
          monthlyRevenue: 0,
          category: 'Technology',
          isApproved: true
        },
        {
          id: '3',
          name: 'Young Entrepreneur',
          url: 'young-entrepreneur',
          owner: {
            id: '4',
            name: 'Alex Smith',
            email: 'alex@example.com'
          },
          status: 'pending_approval',
          createdDate: new Date('2024-02-01'),
          lastActivity: new Date('2024-02-01'),
          productCount: 3,
          totalSales: 0,
          monthlyRevenue: 0,
          category: 'Business',
          isApproved: false
        }
      ];
      
      setStores(mockStores);
    } catch (error) {
      console.error('Failed to load stores:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterStores = () => {
    let filtered = stores;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(store =>
        store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.owner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.url.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(store => store.status === statusFilter);
    }

    setFilteredStores(filtered);
  };

  const getStatusColor = (status: Store['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      case 'pending_approval': return 'bg-yellow-100 text-yellow-800';
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const handleApproveStore = (store: Store) => {
    // TODO: Implement store approval
    alert(`Store "${store.name}" approved`);
  };

  const handleSuspendStore = (store: Store) => {
    // TODO: Implement store suspension
    alert(`Store "${store.name}" suspended`);
  };

  const handleDeleteStore = (store: Store) => {
    if (confirm(`Are you sure you want to delete store "${store.name}"? This action cannot be undone.`)) {
      // TODO: Implement store deletion
      alert(`Store "${store.name}" deleted`);
    }
  };

  const exportStores = () => {
    // TODO: Implement CSV export
    alert('Exporting stores to CSV...');
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
            <h1 className="admin-page-title">Store Management</h1>
            <p className="admin-page-subtitle">Manage all platform stores and their status</p>
          </div>
          <div className="admin-page-actions">
            <button onClick={exportStores} className="admin-btn secondary">
              <FiDownload />
              Export
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="admin-stats-grid">
          <div className="admin-stat-card">
            <div className="admin-stat-header">
              <div style={{ padding: '0.5rem', background: '#dbeafe', borderRadius: '0.5rem' }}>
                <FiPackage style={{ color: '#3b82f6' }} />
              </div>
              <div>
                <div className="admin-stat-label">Total Stores</div>
                <div className="admin-stat-value">{stores.length}</div>
              </div>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-header">
              <div style={{ padding: '0.5rem', background: '#d1fae5', borderRadius: '0.5rem' }}>
                <FiTrendingUp style={{ color: '#10b981' }} />
              </div>
              <div>
                <div className="admin-stat-label">Active Stores</div>
                <div className="admin-stat-value">
                  {stores.filter(s => s.status === 'active').length}
                </div>
              </div>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-header">
              <div style={{ padding: '0.5rem', background: '#fef3c7', borderRadius: '0.5rem' }}>
                <FiDollarSign style={{ color: '#f59e0b' }} />
              </div>
              <div>
                <div className="admin-stat-label">Total Revenue</div>
                <div className="admin-stat-value">
                  {formatCurrency(stores.reduce((sum, store) => sum + store.totalSales, 0))}
                </div>
              </div>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-header">
              <div style={{ padding: '0.5rem', background: '#fed7aa', borderRadius: '0.5rem' }}>
                <FiPackage style={{ color: '#ea580c' }} />
              </div>
              <div>
                <div className="admin-stat-label">Pending Approval</div>
                <div className="admin-stat-value">
                  {stores.filter(s => s.status === 'pending_approval').length}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="admin-filter-section">
          <div className="admin-filter-grid">
            {/* Search */}
            <div className="admin-filter-group">
              <div className="admin-search-input">
                <FiSearch />
                <input
                  type="text"
                  placeholder="Search stores..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="admin-filter-group">
              <div className="admin-select-wrapper">
                <FiFilter />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                  <option value="pending_approval">Pending Approval</option>
                </select>
              </div>
            </div>

            {/* Results Count */}
            <div className="admin-filter-results">
              Showing {filteredStores.length} of {stores.length} stores
            </div>
          </div>
        </div>

        {/* Stores Table */}
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Store</th>
                <th>Owner</th>
                <th>Status</th>
                <th>Products</th>
                <th>Revenue</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStores.map((store) => (
                <tr key={store.id}>
                  <td>
                    <div className="admin-table-cell-content">
                      <div className="admin-user-avatar">
                        {store.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="admin-user-info">
                        <div className="admin-user-name">{store.name}</div>
                        <div className="admin-user-email">/{store.url}</div>
                        <div className="admin-user-role">{store.category}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="admin-table-cell-content">
                      <div className="admin-user-name">{store.owner.name}</div>
                      <div className="admin-user-email">{store.owner.email}</div>
                    </div>
                  </td>
                  <td>
                    <span className={`admin-badge ${store.status}`}>
                      {store.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td>{store.productCount}</td>
                  <td>
                    <div className="admin-table-cell-content">
                      <div className="admin-stat-value">{formatCurrency(store.totalSales)}</div>
                      <div className="admin-stat-label">{formatCurrency(store.monthlyRevenue)} this month</div>
                    </div>
                  </td>
                  <td>{formatDate(store.createdDate)}</td>
                  <td>
                    <div className="admin-actions">
                      <button className="admin-action-btn view" title="View">
                        <FiEye />
                      </button>
                      <button className="admin-action-btn external" title="Visit Store">
                        <FiExternalLink />
                      </button>
                      {store.status === 'pending_approval' && (
                        <button
                          onClick={() => handleApproveStore(store)}
                          className="admin-action-btn approve"
                          title="Approve"
                        >
                          ✓
                        </button>
                      )}
                      <button className="admin-action-btn edit" title="Edit">
                        <FiEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteStore(store)}
                        className="admin-action-btn danger"
                        title="Delete"
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

export default StoresManagementPage;
