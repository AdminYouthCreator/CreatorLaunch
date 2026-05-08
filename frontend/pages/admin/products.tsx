import React, { useEffect, useMemo, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { adminAPI } from '@/utils/adminApi';
import { FiRefreshCw, FiSearch, FiSave, FiX, FiPackage } from 'react-icons/fi';

interface AdminProduct {
  id: string;
  name: string;
  description: string;
  status: string;
  price: number;
  retailPrice: number;
  imageUrl?: string;
  mockupUrl?: string;
  createdAt: string;
  updatedAt: string;
  brand?: {
    id: string;
    name: string;
    subdomain: string;
    status: string;
    owner?: {
      name: string;
      email: string;
      accountStatus: string;
    } | null;
  } | null;
}

const productStatuses = [
  'published',
  'active',
  'inactive',
  'hidden',
  'removed',
  'under_review',
];

const AdminProductsPage: React.FC = () => {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null);
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const data = await adminAPI.getProducts();
      setProducts(data.products || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load products.');
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = useMemo(() => {
    const search = searchTerm.toLowerCase();

    return products.filter((product) => {
      const matchesSearch =
        product.name?.toLowerCase().includes(search) ||
        product.description?.toLowerCase().includes(search) ||
        product.brand?.name?.toLowerCase().includes(search) ||
        product.brand?.owner?.email?.toLowerCase().includes(search);

      const matchesStatus = statusFilter === 'all' || product.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [products, searchTerm, statusFilter]);

  const saveProduct = async () => {
    if (!editingProduct) return;

    try {
      setSaving(true);
      setError('');
      setSuccess('');

      await adminAPI.adminUpdateProduct(editingProduct.id, {
        name: editingProduct.name,
        description: editingProduct.description,
        price: Number(editingProduct.price || 0),
        retailPrice: Number(editingProduct.retailPrice || editingProduct.price || 0),
        status: editingProduct.status,
        reason,
      });

      setSuccess('Product updated successfully.');
      setEditingProduct(null);
      setReason('');
      await loadProducts();
    } catch (err: any) {
      setError(err.message || 'Failed to save product.');
    } finally {
      setSaving(false);
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'published':
      case 'active':
        return 'bg-green-100 text-green-700';
      case 'hidden':
      case 'under_review':
        return 'bg-yellow-100 text-yellow-700';
      case 'removed':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <AdminLayout>
      <div className="admin-page">
        <div className="admin-page-header">
          <div>
            <h1>Products</h1>
            <p>Review, edit, hide, or remove products across all stores.</p>
          </div>

          <button onClick={loadProducts} className="admin-btn secondary">
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
              <div className="admin-stat-icon stores">
                <FiPackage />
              </div>
            </div>
            <h3 className="admin-stat-value">{products.length}</h3>
            <p className="admin-stat-label">Total Products</p>
            <p className="admin-stat-change">Across all stores</p>
          </div>

          <div className="admin-stat-card">
            <h3 className="admin-stat-value">
              {products.filter((p) => ['published', 'active'].includes(p.status)).length}
            </h3>
            <p className="admin-stat-label">Public Products</p>
            <p className="admin-stat-change positive">Visible to customers</p>
          </div>

          <div className="admin-stat-card">
            <h3 className="admin-stat-value">
              {products.filter((p) => ['hidden', 'removed', 'under_review'].includes(p.status)).length}
            </h3>
            <p className="admin-stat-label">Moderated Products</p>
            <p className="admin-stat-change">Hidden, removed, or review</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
            <div className="relative">
              <FiSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search products..."
                className="pl-10 pr-4 py-2 border rounded-lg"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="px-4 py-2 border rounded-lg"
            >
              <option value="all">All Statuses</option>
              {productStatuses.map((status) => (
                <option key={status} value={status}>
                  {status.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="admin-table-container">
          {loading ? (
            <div className="p-8 text-center">Loading products...</div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Store</th>
                  <th>Owner</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        {product.imageUrl ? (
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                            <FiPackage />
                          </div>
                        )}

                        <div>
                          <div className="font-semibold">{product.name}</div>
                          <div className="text-sm text-gray-500 max-w-xs truncate">
                            {product.description || 'No description'}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div>{product.brand?.name || 'Unknown Store'}</div>
                      <div className="text-sm text-gray-500">{product.brand?.subdomain}</div>
                    </td>

                    <td>
                      <div>{product.brand?.owner?.name || 'Unknown'}</div>
                      <div className="text-sm text-gray-500">{product.brand?.owner?.email}</div>
                    </td>

                    <td>${Number(product.price || 0).toFixed(2)}</td>

                    <td>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${getStatusClass(product.status)}`}>
                        {product.status.replace(/_/g, ' ')}
                      </span>
                    </td>

                    <td>
                      <button
                        onClick={() => setEditingProduct(product)}
                        className="admin-btn secondary"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredProducts.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center p-8">
                      No products found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {editingProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Edit Product</h2>
                <button onClick={() => setEditingProduct(null)}>
                  <FiX />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input
                    value={editingProduct.name}
                    onChange={(event) =>
                      setEditingProduct({ ...editingProduct, name: event.target.value })
                    }
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    value={editingProduct.description}
                    onChange={(event) =>
                      setEditingProduct({ ...editingProduct, description: event.target.value })
                    }
                    rows={4}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Price</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={editingProduct.price}
                      onChange={(event) =>
                        setEditingProduct({
                          ...editingProduct,
                          price: Number(event.target.value),
                          retailPrice: Number(event.target.value),
                        })
                      }
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Status</label>
                    <select
                      value={editingProduct.status}
                      onChange={(event) =>
                        setEditingProduct({ ...editingProduct, status: event.target.value })
                      }
                      className="w-full px-4 py-2 border rounded-lg"
                    >
                      {productStatuses.map((status) => (
                        <option key={status} value={status}>
                          {status.replace(/_/g, ' ')}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Reason for audit log</label>
                  <textarea
                    value={reason}
                    onChange={(event) => setReason(event.target.value)}
                    rows={3}
                    placeholder="Example: Product hidden for content review."
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setEditingProduct(null)}
                    className="admin-btn secondary"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={saveProduct}
                    disabled={saving}
                    className="admin-btn"
                  >
                    <FiSave />
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminProductsPage;
