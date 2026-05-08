import React, { useEffect, useMemo, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { adminAPI } from '@/utils/adminApi';
import { FiRefreshCw, FiSearch, FiSave, FiX, FiTool } from 'react-icons/fi';

interface AdminService {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  deliveryTime: string;
  revisions: number;
  requirements: string;
  status: string;
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

const serviceStatuses = [
  'published',
  'draft',
  'hidden',
  'removed',
  'under_review',
];

const serviceCategories = [
  'graphic-design',
  'video-editing',
  'social-media',
  'web-design',
  'music',
  'writing',
  'photography',
  'other',
];

const AdminServicesPage: React.FC = () => {
  const [services, setServices] = useState<AdminService[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editingService, setEditingService] = useState<AdminService | null>(null);
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const data = await adminAPI.getServices();
      setServices(data.services || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load services.');
    } finally {
      setLoading(false);
    }
  };

  const filteredServices = useMemo(() => {
    const search = searchTerm.toLowerCase();

    return services.filter((service) => {
      const matchesSearch =
        service.title?.toLowerCase().includes(search) ||
        service.description?.toLowerCase().includes(search) ||
        service.category?.toLowerCase().includes(search) ||
        service.brand?.name?.toLowerCase().includes(search) ||
        service.brand?.owner?.email?.toLowerCase().includes(search);

      const matchesStatus = statusFilter === 'all' || service.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [services, searchTerm, statusFilter]);

  const saveService = async () => {
    if (!editingService) return;

    try {
      setSaving(true);
      setError('');
      setSuccess('');

      await adminAPI.adminUpdateService(editingService.id, {
        title: editingService.title,
        description: editingService.description,
        category: editingService.category,
        price: Number(editingService.price || 0),
        deliveryTime: editingService.deliveryTime,
        revisions: Number(editingService.revisions || 0),
        requirements: editingService.requirements,
        status: editingService.status,
        reason,
      });

      setSuccess('Service updated successfully.');
      setEditingService(null);
      setReason('');
      await loadServices();
    } catch (err: any) {
      setError(err.message || 'Failed to save service.');
    } finally {
      setSaving(false);
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'published':
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
            <h1>Services</h1>
            <p>Review, edit, hide, or remove services across all stores.</p>
          </div>

          <button onClick={loadServices} className="admin-btn secondary">
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
                <FiTool />
              </div>
            </div>
            <h3 className="admin-stat-value">{services.length}</h3>
            <p className="admin-stat-label">Total Services</p>
            <p className="admin-stat-change">Across all stores</p>
          </div>

          <div className="admin-stat-card">
            <h3 className="admin-stat-value">
              {services.filter((s) => s.status === 'published').length}
            </h3>
            <p className="admin-stat-label">Published Services</p>
            <p className="admin-stat-change positive">Visible to customers</p>
          </div>

          <div className="admin-stat-card">
            <h3 className="admin-stat-value">
              {services.filter((s) => ['hidden', 'removed', 'under_review'].includes(s.status)).length}
            </h3>
            <p className="admin-stat-label">Moderated Services</p>
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
                placeholder="Search services..."
                className="pl-10 pr-4 py-2 border rounded-lg"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="px-4 py-2 border rounded-lg"
            >
              <option value="all">All Statuses</option>
              {serviceStatuses.map((status) => (
                <option key={status} value={status}>
                  {status.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="admin-table-container">
          {loading ? (
            <div className="p-8 text-center">Loading services...</div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Service</th>
                  <th>Store</th>
                  <th>Owner</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredServices.map((service) => (
                  <tr key={service.id}>
                    <td>
                      <div>
                        <div className="font-semibold">{service.title}</div>
                        <div className="text-sm text-gray-500 max-w-xs truncate">
                          {service.description || 'No description'}
                        </div>
                        <div className="text-xs text-gray-500 capitalize">
                          {service.category?.replace(/-/g, ' ')}
                        </div>
                      </div>
                    </td>

                    <td>
                      <div>{service.brand?.name || 'Unknown Store'}</div>
                      <div className="text-sm text-gray-500">{service.brand?.subdomain}</div>
                    </td>

                    <td>
                      <div>{service.brand?.owner?.name || 'Unknown'}</div>
                      <div className="text-sm text-gray-500">{service.brand?.owner?.email}</div>
                    </td>

                    <td>${Number(service.price || 0).toFixed(2)}</td>

                    <td>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${getStatusClass(service.status)}`}>
                        {service.status.replace(/_/g, ' ')}
                      </span>
                    </td>

                    <td>
                      <button
                        onClick={() => setEditingService(service)}
                        className="admin-btn secondary"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredServices.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center p-8">
                      No services found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {editingService && (
          <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Edit Service</h2>
                <button onClick={() => setEditingService(null)}>
                  <FiX />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <input
                    value={editingService.title}
                    onChange={(event) =>
                      setEditingService({ ...editingService, title: event.target.value })
                    }
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    value={editingService.description}
                    onChange={(event) =>
                      setEditingService({ ...editingService, description: event.target.value })
                    }
                    rows={4}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Category</label>
                    <select
                      value={editingService.category}
                      onChange={(event) =>
                        setEditingService({ ...editingService, category: event.target.value })
                      }
                      className="w-full px-4 py-2 border rounded-lg"
                    >
                      {serviceCategories.map((category) => (
                        <option key={category} value={category}>
                          {category.replace(/-/g, ' ')}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Status</label>
                    <select
                      value={editingService.status}
                      onChange={(event) =>
                        setEditingService({ ...editingService, status: event.target.value })
                      }
                      className="w-full px-4 py-2 border rounded-lg"
                    >
                      {serviceStatuses.map((status) => (
                        <option key={status} value={status}>
                          {status.replace(/_/g, ' ')}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Price</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={editingService.price}
                      onChange={(event) =>
                        setEditingService({
                          ...editingService,
                          price: Number(event.target.value),
                        })
                      }
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Delivery Time</label>
                    <input
                      value={editingService.deliveryTime}
                      onChange={(event) =>
                        setEditingService({
                          ...editingService,
                          deliveryTime: event.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Revisions</label>
                    <input
                      type="number"
                      min="0"
                      value={editingService.revisions}
                      onChange={(event) =>
                        setEditingService({
                          ...editingService,
                          revisions: Number(event.target.value),
                        })
                      }
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Requirements</label>
                  <textarea
                    value={editingService.requirements || ''}
                    onChange={(event) =>
                      setEditingService({
                        ...editingService,
                        requirements: event.target.value,
                      })
                    }
                    rows={3}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Reason for audit log</label>
                  <textarea
                    value={reason}
                    onChange={(event) => setReason(event.target.value)}
                    rows={3}
                    placeholder="Example: Service hidden for content review."
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setEditingService(null)}
                    className="admin-btn secondary"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={saveService}
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

export default AdminServicesPage;
