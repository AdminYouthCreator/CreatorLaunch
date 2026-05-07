import React, { useEffect, useMemo, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { adminAPI } from '@/utils/adminApi';
import {
  FiUserPlus,
  FiCopy,
  FiRefreshCw,
  FiXCircle,
  FiUsers,
  FiMail,
  FiShield,
  FiSearch,
} from 'react-icons/fi';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'Creator' | 'Admin';
  status: 'active' | 'inactive';
  registrationDate: string;
  lastLogin?: string | null;
  storeCount: number;
  hasCompletedOnboarding: boolean;
  guardianEmail?: string;
  isMinor: boolean;
  age?: number | null;
  emailVerified: boolean;
  invitedByCode?: string | null;
}

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

const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [invites, setInvites] = useState<Invite[]>([]);

  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'Creator' | 'Admin'>('Creator');
  const [notes, setNotes] = useState('');
  const [expiresInDays, setExpiresInDays] = useState(30);

  const [activeTab, setActiveTab] = useState<'users' | 'invites'>('users');
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'Creator' | 'Admin'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [copiedCode, setCopiedCode] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadPageData();
  }, []);

  const loadPageData = async () => {
    try {
      setLoading(true);
      setError('');

      const [usersData, invitesData] = await Promise.all([
        adminAPI.getUsers(),
        adminAPI.getInvites(),
      ]);

      setUsers(usersData.users || []);
      setInvites(invitesData.invites || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load users and invites.');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const search = searchTerm.toLowerCase();

      const matchesSearch =
        user.name?.toLowerCase().includes(search) ||
        user.email?.toLowerCase().includes(search) ||
        user.invitedByCode?.toLowerCase().includes(search);

      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      const matchesStatus = statusFilter === 'all' || user.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchTerm, roleFilter, statusFilter]);

  const activeInvites = invites.filter((invite) => invite.status === 'active').length;
  const usedInvites = invites.filter((invite) => invite.status === 'used').length;
  const verifiedUsers = users.filter((user) => user.emailVerified).length;
  const minorUsers = users.filter((user) => user.isMinor).length;

  const createInvite = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      setCreating(true);
      setError('');

      await adminAPI.createInvite({
        email,
        role,
        notes,
        expiresInDays,
      });

      setEmail('');
      setRole('Creator');
      setNotes('');
      setExpiresInDays(30);

      const invitesData = await adminAPI.getInvites();
      setInvites(invitesData.invites || []);
      setActiveTab('invites');
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

      await adminAPI.revokeInvite(inviteId);

      const invitesData = await adminAPI.getInvites();
      setInvites(invitesData.invites || []);
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
      case 'inactive':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-yellow-100 text-yellow-700';
    }
  };

  const formatDate = (date?: string | null) => {
    if (!date) return '—';
    return new Date(date).toLocaleDateString();
  };

  return (
    <AdminLayout>
      <div className="admin-page">
        <div className="admin-page-header">
          <div>
            <h1>Users & Invites</h1>
            <p>Manage real users and invite-only platform access.</p>
          </div>

          <button onClick={loadPageData} className="admin-btn secondary">
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
                <FiUsers />
              </div>
            </div>
            <h3 className="admin-stat-value">{users.length}</h3>
            <p className="admin-stat-label">Total Users</p>
            <p className="admin-stat-change positive">{verifiedUsers} verified</p>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-header">
              <div className="admin-stat-icon stores">
                <FiShield />
              </div>
            </div>
            <h3 className="admin-stat-value">{activeInvites}</h3>
            <p className="admin-stat-label">Active Invites</p>
            <p className="admin-stat-change">{usedInvites} used</p>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-header">
              <div className="admin-stat-icon alerts">
                <FiUsers />
              </div>
            </div>
            <h3 className="admin-stat-value">{minorUsers}</h3>
            <p className="admin-stat-label">Minor Users</p>
            <p className="admin-stat-change">Guardian info tracked</p>
          </div>
        </div>

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
                onClick={() => setActiveTab('invites')}
                className={`px-4 py-2 rounded-lg font-medium ${
                  activeTab === 'invites'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                Invites
              </button>
            </div>

            {activeTab === 'users' && (
              <div className="flex flex-col md:flex-row gap-3">
                <div className="relative">
                  <FiSearch className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Search users..."
                    className="pl-10 pr-4 py-2 border rounded-lg"
                  />
                </div>

                <select
                  value={roleFilter}
                  onChange={(event) => setRoleFilter(event.target.value as any)}
                  className="px-4 py-2 border rounded-lg"
                >
                  <option value="all">All Roles</option>
                  <option value="Creator">Creators</option>
                  <option value="Admin">Admins</option>
                </select>

                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value as any)}
                  className="px-4 py-2 border rounded-lg"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            )}
          </div>
        </div>

        <div className="admin-table-container">
          {loading ? (
            <div className="p-8 text-center">Loading...</div>
          ) : activeTab === 'users' ? (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Age</th>
                  <th>Stores</th>
                  <th>Onboarding</th>
                  <th>Invite</th>
                  <th>Joined</th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div>
                        <div className="font-semibold">{user.name}</div>
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                          <FiMail />
                          {user.email}
                        </div>
                        {user.guardianEmail && (
                          <div className="text-xs text-gray-500">
                            Guardian: {user.guardianEmail}
                          </div>
                        )}
                      </div>
                    </td>

                    <td>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          user.role === 'Admin'
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusClass(
                          user.status
                        )}`}
                      >
                        {user.emailVerified ? 'verified' : 'unverified'}
                      </span>
                    </td>

                    <td>
                      {typeof user.age === 'number' ? (
                        <span>{user.age}</span>
                      ) : (
                        <span>—</span>
                      )}
                    </td>

                    <td>{user.storeCount}</td>

                    <td>
                      {user.hasCompletedOnboarding ? (
                        <span className="text-green-600 font-medium">Complete</span>
                      ) : (
                        <span className="text-yellow-600 font-medium">Pending</span>
                      )}
                    </td>

                    <td>
                      {user.invitedByCode ? (
                        <code>{user.invitedByCode}</code>
                      ) : (
                        <span>—</span>
                      )}
                    </td>

                    <td>{formatDate(user.registrationDate)}</td>
                  </tr>
                ))}

                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={8} className="text-center p-8">
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
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusClass(
                          invite.status
                        )}`}
                      >
                        {invite.status}
                      </span>
                    </td>

                    <td>
                      {invite.usedBy
                        ? invite.usedBy.username || invite.usedBy.email
                        : '—'}
                    </td>

                    <td>{formatDate(invite.expiresAt)}</td>

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
