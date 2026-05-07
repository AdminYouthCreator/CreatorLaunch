import React, { useEffect, useMemo, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { adminAPI } from '@/utils/adminApi';
import {
  FiRefreshCw,
  FiSearch,
  FiExternalLink,
  FiShoppingBag,
  FiPackage,
  FiDollarSign,
  FiTool,
} from 'react-icons/fi';

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
  status: string;
  createdDate: string;
  lastActivity: string;
  productCount: number;
  serviceCount: number;
  totalSales: number;
  monthlyRevenue: number;
  category: string;
  isApproved: boolean;
}

const AdminStoresPage: React.FC = () => {
  const [stores, setStores] = useState<AdminStore[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const rootDomain = process.env.NEXT_PUBLIC_BASE_DOMAIN || 'youthcreatorlaunch.org';

  useEffect(() => {
    loadStores();
  }, []);

  const loadStores = async () => {
    try {
      setLoading(true);
      setError('');

      const data = await adminAPI.getStores();
      setStores(data.stores || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load stores.');
    } finally {
      setLoading(false);
    }
  };

  const filteredStores = useMemo(() => {
    const search = searchTerm.toLowerCase();

    return stores.filter((store) => {
      return (
        store.name?.toLowerCase().includes(search) ||
        store.url?.toLowerCase().includes(search) ||
        store.owner?.name?.toLowerCase().includes(search) ||
        store.owner?.email?.toLowerCase().includes(search)
      );
    });
  }, [stores, searchTerm]);

  const totalProducts = stores.reduce((sum, store) => sum + Number(store.productCount || 0), 0);
  const totalServices = stores.reduce((sum, store) => sum + Number(store.serviceCount || 0), 0);
  const totalRevenue = stores.reduce((sum, store) => sum + Number(store.totalSales || 0), 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount || 0);
  };

  const formatDate = (date?: string) => {
    if (!date) return '—';
    return new Date(date).toLocaleDateString();
  };

  const getStorePreviewUrl = (subdomain: string) => {
    return `/store/${subdomain}`;
  };

  const getFutureDomainUrl = (subdomain: string) => {
    return `https://${subdomain}.${rootDomain}`;
  };

  return (
    <AdminLayout>
      <div className="admin-page">
        <div className="admin-page-header">
          <div>
            <h1>Stores</h1>
            <p>View real CreatorLaunch stores, owners, products, services, and revenue.</p>
          </div>

          <button onClick={loadStores} className="admin-btn secondary">
            <FiRefreshCw />
            Refresh
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 mb-6">
            {error}
          </div>
        )}

        <div className="admin-stats-grid mb-8">
          <div className="admin-stat-card">
            <div className="admin-stat-header">
              <div className="admin-stat-icon stores">
                <FiShoppingBag />
              </div>
            </div>
            <h3 className="admin-stat-value">{stores.length}</h3>
            <p className="admin-stat-label">Total Stores</p>
            <p className="admin-stat-change positive">Creator brands</p>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-header">
              <div className="admin-stat-icon users">
                <FiPackage />
              </div>
            </div>
            <h3 className="admin-stat-value">{totalProducts}</h3>
            <p className="admin-stat-label">Products</p>
            <p className="admin-stat-change">Across all stores</p>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-header">
              <div className="admin-stat-icon alerts">
                <FiTool />
              </div>
            </div>
            <h3 className="admin-stat-value">{totalServices}</h3>
            <p className="admin-stat-label">Services</p>
            <p className="admin-stat-change">Across all stores</p>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-header">
              <div className="admin-stat-icon revenue">
                <FiDollarSign />
              </div>
            </div>
            <h3 className="admin-stat-value">{formatCurrency(totalRevenue)}</h3>
            <p className="admin-stat-label">Total Sales</p>
            <p className="admin-stat-change positive">Paid orders only</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="relative max-w-md">
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search stores, owners, or URLs..."
              className="pl-10 pr-4 py-2 border rounded-lg w-full"
            />
          </div>
        </div>

        <div className="admin-table-container">
          {loading ? (
            <div className="p-8 text-center">Loading stores...</div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Store</th>
                  <th>Owner</th>
                  <th>Products</th>
                  <th>Services</th>
                  <th>Total Sales</th>
                  <th>Monthly Revenue</th>
                  <th>Created</th>
                  <th>Preview</th>
                </tr>
              </thead>

              <tbody>
                {filteredStores.map((store) => (
                  <tr key={store.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        {store.logoUrl ? (
                          <img
                            src={store.logoUrl}
                            alt={store.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                            {store.name.charAt(0).toUpperCase()}
                          </div>
                        )}

                        <div>
                          <div className="font-semibold">{store.name}</div>
                          <div className="text-sm text-gray-500">
                            {store.url}.{rootDomain}
                          </div>
                          {store.description && (
                            <div className="text-xs text-gray-500 max-w-xs truncate">
                              {store.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    <td>
                      <div>
                        <div className="font-medium">{store.owner.name}</div>
                        <div className="text-sm text-gray-500">{store.owner.email}</div>
                      </div>
                    </td>

                    <td>{store.productCount}</td>

                    <td>{store.serviceCount}</td>

                    <td>{formatCurrency(store.totalSales)}</td>

                    <td>{formatCurrency(store.monthlyRevenue)}</td>

                    <td>{formatDate(store.createdDate)}</td>

                    <td>
                      <div className="flex flex-col gap-2">
                        <a
                          href={getStorePreviewUrl(store.url)}
                          target="_blank"
                          rel="noreferrer"
                          className="admin-btn secondary"
                        >
                          <FiExternalLink />
                          Internal
                        </a>

                        <a
                          href={getFutureDomainUrl(store.url)}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-blue-600 hover:underline"
                        >
                          Future domain
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredStores.length === 0 && (
                  <tr>
                    <td colSpan={8} className="text-center p-8">
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

export default AdminStoresPage;
