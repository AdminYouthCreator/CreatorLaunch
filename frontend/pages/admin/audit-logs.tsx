import React, { useEffect, useMemo, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { adminAPI } from '@/utils/adminApi';
import { FiRefreshCw, FiSearch, FiClock, FiShield, FiUser, FiDatabase } from 'react-icons/fi';

interface AuditLog {
  id: string;
  admin?: {
    username?: string;
    email?: string;
    role?: string;
  } | null;
  action: string;
  targetType: string;
  targetId?: string | null;
  reason?: string;
  metadata?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

const AdminAuditLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [limit, setLimit] = useState(100);
  const [searchTerm, setSearchTerm] = useState('');
  const [targetFilter, setTargetFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

  useEffect(() => {
    loadLogs();
  }, [limit]);

  const loadLogs = async () => {
    try {
      setLoading(true);
      setError('');

      const data = await adminAPI.getAuditLogs(limit);
      setLogs(data.logs || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load audit logs.');
    } finally {
      setLoading(false);
    }
  };

  const targetTypes = useMemo(() => {
    const types = new Set(logs.map((log) => log.targetType));
    return ['all', ...Array.from(types)];
  }, [logs]);

  const filteredLogs = useMemo(() => {
    const search = searchTerm.toLowerCase();

    return logs.filter((log) => {
      const matchesSearch =
        log.action?.toLowerCase().includes(search) ||
        log.targetType?.toLowerCase().includes(search) ||
        log.reason?.toLowerCase().includes(search) ||
        log.admin?.email?.toLowerCase().includes(search) ||
        log.admin?.username?.toLowerCase().includes(search);

      const matchesTarget = targetFilter === 'all' || log.targetType === targetFilter;

      return matchesSearch && matchesTarget;
    });
  }, [logs, searchTerm, targetFilter]);

  const formatDateTime = (date: string) => {
    return new Date(date).toLocaleString();
  };

  const formatAction = (action: string) => {
    return action.replace(/\./g, ' ').replace(/_/g, ' ');
  };

  const getActionClass = (action: string) => {
    if (action.includes('banned') || action.includes('suspended') || action.includes('hidden')) {
      return 'bg-red-100 text-red-700';
    }

    if (action.includes('locked') || action.includes('under_review')) {
      return 'bg-yellow-100 text-yellow-700';
    }

    if (action.includes('active') || action.includes('created')) {
      return 'bg-green-100 text-green-700';
    }

    return 'bg-blue-100 text-blue-700';
  };

  const safeStringify = (value: any) => {
    try {
      return JSON.stringify(value || {}, null, 2);
    } catch {
      return '{}';
    }
  };

  return (
    <AdminLayout>
      <div className="admin-page">
        <div className="admin-page-header">
          <div>
            <h1>Audit Logs</h1>
            <p>Review sensitive admin actions and platform moderation history.</p>
          </div>

          <button onClick={loadLogs} className="admin-btn secondary">
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
              <div className="admin-stat-icon users">
                <FiClock />
              </div>
            </div>
            <h3 className="admin-stat-value">{logs.length}</h3>
            <p className="admin-stat-label">Loaded Logs</p>
            <p className="admin-stat-change">Most recent first</p>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-header">
              <div className="admin-stat-icon stores">
                <FiShield />
              </div>
            </div>
            <h3 className="admin-stat-value">
              {logs.filter((log) => log.action.includes('status')).length}
            </h3>
            <p className="admin-stat-label">Status Actions</p>
            <p className="admin-stat-change">Users and stores</p>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-header">
              <div className="admin-stat-icon alerts">
                <FiDatabase />
              </div>
            </div>
            <h3 className="admin-stat-value">{targetTypes.length - 1}</h3>
            <p className="admin-stat-label">Target Types</p>
            <p className="admin-stat-change">Entities affected</p>
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
                placeholder="Search logs..."
                className="pl-10 pr-4 py-2 border rounded-lg"
              />
            </div>

            <div className="flex gap-3">
              <select
                value={targetFilter}
                onChange={(event) => setTargetFilter(event.target.value)}
                className="px-4 py-2 border rounded-lg"
              >
                {targetTypes.map((type) => (
                  <option key={type} value={type}>
                    {type === 'all' ? 'All Targets' : type}
                  </option>
                ))}
              </select>

              <select
                value={limit}
                onChange={(event) => setLimit(Number(event.target.value))}
                className="px-4 py-2 border rounded-lg"
              >
                <option value={50}>50 logs</option>
                <option value={100}>100 logs</option>
                <option value={250}>250 logs</option>
              </select>
            </div>
          </div>
        </div>

        <div className="admin-table-container">
          {loading ? (
            <div className="p-8 text-center">Loading audit logs...</div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Action</th>
                  <th>Admin</th>
                  <th>Target</th>
                  <th>Reason</th>
                  <th>Time</th>
                  <th>Details</th>
                </tr>
              </thead>

              <tbody>
                {filteredLogs.map((log) => (
                  <React.Fragment key={log.id}>
                    <tr>
                      <td>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${getActionClass(
                            log.action
                          )}`}
                        >
                          {formatAction(log.action)}
                        </span>
                      </td>

                      <td>
                        <div className="flex items-center gap-2">
                          <FiUser />
                          <div>
                            <div className="font-medium">
                              {log.admin?.username || log.admin?.email || 'System'}
                            </div>
                            {log.admin?.email && (
                              <div className="text-xs text-gray-500">{log.admin.email}</div>
                            )}
                          </div>
                        </div>
                      </td>

                      <td>
                        <div>
                          <div className="font-medium">{log.targetType}</div>
                          <div className="text-xs text-gray-500">{log.targetId || '—'}</div>
                        </div>
                      </td>

                      <td>
                        <span className="text-sm text-gray-700">
                          {log.reason || '—'}
                        </span>
                      </td>

                      <td>{formatDateTime(log.createdAt)}</td>

                      <td>
                        <button
                          type="button"
                          onClick={() =>
                            setExpandedLogId(expandedLogId === log.id ? null : log.id)
                          }
                          className="admin-btn secondary"
                        >
                          {expandedLogId === log.id ? 'Hide' : 'View'}
                        </button>
                      </td>
                    </tr>

                    {expandedLogId === log.id && (
                      <tr>
                        <td colSpan={6}>
                          <div className="bg-gray-50 rounded-lg p-4">
                            <div className="grid md:grid-cols-2 gap-4 mb-4">
                              <div>
                                <h4 className="font-semibold mb-1">IP Address</h4>
                                <p className="text-sm text-gray-600">{log.ipAddress || '—'}</p>
                              </div>

                              <div>
                                <h4 className="font-semibold mb-1">User Agent</h4>
                                <p className="text-sm text-gray-600 break-all">
                                  {log.userAgent || '—'}
                                </p>
                              </div>
                            </div>

                            <h4 className="font-semibold mb-2">Metadata</h4>
                            <pre className="bg-white border rounded-lg p-3 overflow-x-auto text-xs">
                              {safeStringify(log.metadata)}
                            </pre>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}

                {filteredLogs.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center p-8">
                      No audit logs found.
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

export default AdminAuditLogsPage;
