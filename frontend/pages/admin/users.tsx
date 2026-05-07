import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { FiUserPlus, FiCopy, FiRefreshCw, FiXCircle } from 'react-icons/fi';

interface Invite {
  id: string;
  code: string;
  email: string;
  role: 'Creator' | 'Admin';
  status: 'active' | 'used' | 'revoked' | 'expired';
  notes?: string;
  usedBy?: {
    username?: string;
    email?: string;
  };
  usedAt?: string;
  expiresAt?: string;
  createdAt?: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

const AdminUsersPage: React.FC = () => {
  const { getAdminToken } = useAdminAuth();

  const [invites, setInvites] = useState<Invite[]>([]);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'Creator' | 'Admin'>('Creator');
  const [notes, setNotes] = useState('');
  const [expiresInDays, setExpiresInDays] = useState(30);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [copiedCode, setCopiedCode] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadInvites();
  }, []);

  const request = async (path: string, options: RequestInit = {}) => {
    const token = getAdminToken();

    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        ...(options.headers || {}),
      },
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.message || 'Request failed.');
    }

    return data;
  };

  const loadInvites = async () => {
    try {
      setLoading(true);
      setError('');

      const data = await request('/api/invites');
      setInvites(data.invites || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load invites.');
    } finally {
      setLoading(false);
    }
  };

  const createInvite = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      setCreating(true);
      setError('');

      await request('/api/invites', {
        method: 'POST',
        body: JSON.stringify({
          email,
          role,
          notes,
          expiresInDays,
        }),
      });

      setEmail('');
      setRole('Creator');
      setNotes('');
      setExpiresInDays(30);

      await loadInvites();
    } catch (err: any) {
      setError(err.message || 'Failed to create invite.');
    } finally {
      setCreating(false);
    }
  };

  const revokeInvite = async (inviteId: string) => {
    const confirmed = window.confirm('Revoke this invite code?');

    if (!confirmed) return;

    try {
      setError('');

      await request(`/api/invites/${inviteId}/revoke`, {
        method: 'PATCH',
      });

      await loadInvites();
    } catch (err: any) {
      setError(err.message || 'Failed to revoke invite.');
    }
  };

  const copyInvite = async (code: string) => {
    await navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(''), 1800);
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700';
      case 'used':
        return 'bg-blue-100 text-blue-700';
      case 'revoked':
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
            <h1>Invites & User Access</h1>
            <p>CreatorLaunch is invite-only. Create invite codes for approved users.</p>
          </div>

          <button onClick={loadInvites} className="admin-btn secondary">
            <FiRefreshCw />
            Refresh
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 mb-6">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <FiUserPlus />
            Create Invite
          </h2>

          <form onSubmit={createInvite} className="grid md:grid-cols-5 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Email optional</label>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="student@example.com"
                className="w-full px-4 py-2 border rounded-lg"
              />
              <p className="text-xs text-gray-500 mt-1">
                Leave blank to create a general invite code.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Role</label>
              <select
                value={role}
                onChange={(event) => setRole(event.target.value as 'Creator' | 'Admin')}
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="Creator">Creator</option>
                <option value="Admin">Admin</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Expires in days</label>
              <input
                type="number"
                min="1"
                max="365"
                value={expiresInDays}
                onChange={(event) => setExpiresInDays(Number(event.target.value))}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                disabled={creating}
                className="admin-btn w-full justify-center"
              >
                {creating ? 'Creating...' : 'Create'}
              </button>
            </div>

            <div className="md:col-span-5">
              <label className="block text-sm font-medium mb-1">Notes optional</label>
              <input
                type="text"
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="Example: First workshop cohort"
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
          </form>
        </div>

        <div className="admin-table-container">
          {loading ? (
            <div className="p-8 text-center">Loading invites...</div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Used By</th>
                  <th>Expires</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {invites.map((invite) => (
                  <tr key={invite.id}>
                    <td>
                      <code className="font-bold">{invite.code}</code>
                    </td>

                    <td>{invite.email || 'Any email'}</td>

                    <td>{invite.role}</td>

                    <td>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusClass(invite.status)}`}>
                        {invite.status}
                      </span>
                    </td>

                    <td>
                      {invite.usedBy
                        ? invite.usedBy.username || invite.usedBy.email
                        : '—'}
                    </td>

                    <td>
                      {invite.expiresAt
                        ? new Date(invite.expiresAt).toLocaleDateString()
                        : 'No expiration'}
                    </td>

                    <td>
                      <div className="flex gap-2">
                        <button
                          onClick={() => copyInvite(invite.code)}
                          className="admin-btn secondary"
                          type="button"
                        >
                          <FiCopy />
                          {copiedCode === invite.code ? 'Copied' : 'Copy'}
                        </button>

                        {invite.status === 'active' && (
                          <button
                            onClick={() => revokeInvite(invite.id)}
                            className="admin-btn danger"
                            type="button"
                          >
                            <FiXCircle />
                            Revoke
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}

                {invites.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center p-8">
                      No invites created yet.
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

export default AdminUsersPage;
