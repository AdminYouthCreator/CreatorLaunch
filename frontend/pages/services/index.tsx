import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '@/components/common/Layout';
import AuthGuard from '@/components/common/AuthGuard';
import { serviceAPI } from '@/utils/api';

interface Service {
  _id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  deliveryTime: string;
  revisions: number;
  status: string;
  createdAt: string;
}

const ServicesPage: React.FC = () => {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const data = await serviceAPI.getAll();
      setServices(data.services || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    try {
      await serviceAPI.delete(id);
      setServices(prev => prev.filter(s => s._id !== id));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete service');
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'published' ? 'draft' : 'published';
    try {
      await serviceAPI.update(id, { status: newStatus });
      setServices(prev =>
        prev.map(s => s._id === id ? { ...s, status: newStatus } : s)
      );
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update service');
    }
  };

  const categoryLabel = (cat: string) => cat.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());

  return (
    <AuthGuard>
      <Layout title="My Services | CreatorLaunch">
        <div className="min-h-screen bg-light">
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-dark">My Services</h1>
                <p className="text-medium mt-1">Manage your digital service offerings</p>
              </div>
              <Link
                href="/services/new"
                className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-red-600 transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Service
              </Link>
            </div>

            {loading ? (
              <div className="flex justify-center py-16">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
              </div>
            ) : error ? (
              <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>
            ) : services.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.193 23.193 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <h2 className="text-xl font-bold text-dark mb-2">No services yet</h2>
                <p className="text-medium mb-6">Create your first digital service to start earning.</p>
                <Link
                  href="/services/new"
                  className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-red-600 transition-colors inline-block"
                >
                  Create Your First Service
                </Link>
              </div>
            ) : (
              <div className="grid gap-4">
                {services.map(service => (
                  <div key={service._id} className="bg-white rounded-lg shadow-sm p-6 flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-dark text-lg truncate">{service.title}</h3>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                          service.status === 'published'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {service.status}
                        </span>
                      </div>
                      <p className="text-sm text-medium line-clamp-1 mb-2">{service.description}</p>
                      <div className="flex items-center gap-4 text-xs text-medium">
                        <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded">{categoryLabel(service.category)}</span>
                        <span>${service.price.toFixed(2)}</span>
                        <span>{service.deliveryTime}</span>
                        <span>{service.revisions} revision{service.revisions !== 1 ? 's' : ''}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleToggleStatus(service._id, service.status)}
                        className="px-3 py-2 text-sm border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        {service.status === 'published' ? 'Unpublish' : 'Publish'}
                      </button>
                      <button
                        onClick={() => router.push(`/services/edit/${service._id}`)}
                        className="px-3 py-2 text-sm border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(service._id)}
                        className="px-3 py-2 text-sm border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </Layout>
    </AuthGuard>
  );
};

export default ServicesPage;
