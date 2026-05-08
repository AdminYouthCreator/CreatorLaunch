import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { adminAPI } from '@/utils/adminApi';
import { FiRefreshCw, FiSave, FiLock, FiUnlock, FiMessageSquare, FiUserPlus } from 'react-icons/fi';

interface PlatformSettings {
  platformLocked: boolean;
  platformLockMessage: string;
  inviteOnlyEnabled: boolean;
  siteAnnouncementEnabled: boolean;
  siteAnnouncementText: string;
  updatedAt?: string;
}

const AdminSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<PlatformSettings>({
    platformLocked: false,
    platformLockMessage: '',
    inviteOnlyEnabled: true,
    siteAnnouncementEnabled: true,
    siteAnnouncementText: '',
  });

  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const data = await adminAPI.getSettings();

      setSettings({
        platformLocked: Boolean(data.settings?.platformLocked),
        platformLockMessage: data.settings?.platformLockMessage || '',
        inviteOnlyEnabled: Boolean(data.settings?.inviteOnlyEnabled),
        siteAnnouncementEnabled: Boolean(data.settings?.siteAnnouncementEnabled),
        siteAnnouncementText: data.settings?.siteAnnouncementText || '',
        updatedAt: data.settings?.updatedAt,
      });
    } catch (err: any) {
      setError(err.message || 'Failed to load platform settings.');
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field: keyof PlatformSettings, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const saveSettings = async () => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');

      const data = await adminAPI.updateSettings({
        platformLocked: settings.platformLocked,
        platformLockMessage: settings.platformLockMessage,
        inviteOnlyEnabled: settings.inviteOnlyEnabled,
        siteAnnouncementEnabled: settings.siteAnnouncementEnabled,
        siteAnnouncementText: settings.siteAnnouncementText,
        reason,
      });

      setSettings({
        platformLocked: Boolean(data.settings?.platformLocked),
        platformLockMessage: data.settings?.platformLockMessage || '',
        inviteOnlyEnabled: Boolean(data.settings?.inviteOnlyEnabled),
        siteAnnouncementEnabled: Boolean(data.settings?.siteAnnouncementEnabled),
        siteAnnouncementText: data.settings?.siteAnnouncementText || '',
        updatedAt: data.settings?.updatedAt,
      });

      setReason('');
      setSuccess('Platform settings saved.');
    } catch (err: any) {
      setError(err.message || 'Failed to save platform settings.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
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
        <div className="admin-page-header">
          <div>
            <h1>Platform Settings</h1>
            <p>Control access, invites, and public announcements.</p>
          </div>

          <div className="flex gap-3">
            <button onClick={loadSettings} className="admin-btn secondary">
              <FiRefreshCw />
              Refresh
            </button>

            <button onClick={saveSettings} disabled={saving} className="admin-btn">
              <FiSave />
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
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
              <div className="admin-stat-icon alerts">
                {settings.platformLocked ? <FiLock /> : <FiUnlock />}
              </div>
            </div>
            <h3 className="admin-stat-value">
              {settings.platformLocked ? 'Locked' : 'Open'}
            </h3>
            <p className="admin-stat-label">Platform Access</p>
            <p className="admin-stat-change">
              {settings.platformLocked ? 'Creators blocked' : 'Creators allowed'}
            </p>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-header">
              <div className="admin-stat-icon users">
                <FiUserPlus />
              </div>
            </div>
            <h3 className="admin-stat-value">
              {settings.inviteOnlyEnabled ? 'Invite Only' : 'Open Signup'}
            </h3>
            <p className="admin-stat-label">Registration</p>
            <p className="admin-stat-change">
              {settings.inviteOnlyEnabled ? 'Invite code required' : 'No invite required'}
            </p>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-header">
              <div className="admin-stat-icon stores">
                <FiMessageSquare />
              </div>
            </div>
            <h3 className="admin-stat-value">
              {settings.siteAnnouncementEnabled ? 'On' : 'Off'}
            </h3>
            <p className="admin-stat-label">Announcement</p>
            <p className="admin-stat-change">Public site banner</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <section className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h2 className="text-xl font-bold mb-1">Platform Lock Mode</h2>
                <p className="text-gray-600">
                  When enabled, creators are blocked from protected platform routes. Admins can still log in and manage the site.
                </p>
              </div>

              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.platformLocked}
                  onChange={(event) => updateField('platformLocked', event.target.checked)}
                  className="sr-only"
                />
                <span
                  className={`w-14 h-8 rounded-full p-1 transition-colors ${
                    settings.platformLocked ? 'bg-red-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`block w-6 h-6 bg-white rounded-full transition-transform ${
                      settings.platformLocked ? 'translate-x-6' : ''
                    }`}
                  />
                </span>
              </label>
            </div>

            <label className="block text-sm font-semibold mb-2">
              Platform lock message
            </label>
            <textarea
              value={settings.platformLockMessage}
              onChange={(event) => updateField('platformLockMessage', event.target.value)}
              rows={4}
              className="w-full px-4 py-3 border rounded-lg"
              placeholder="Message shown when a creator is blocked by platform lock."
            />
          </section>

          <section className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h2 className="text-xl font-bold mb-1">Invite-Only Registration</h2>
                <p className="text-gray-600">
                  When enabled, new creator accounts must register using an admin-created invite code.
                </p>
              </div>

              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.inviteOnlyEnabled}
                  onChange={(event) => updateField('inviteOnlyEnabled', event.target.checked)}
                  className="sr-only"
                />
                <span
                  className={`w-14 h-8 rounded-full p-1 transition-colors ${
                    settings.inviteOnlyEnabled ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`block w-6 h-6 bg-white rounded-full transition-transform ${
                      settings.inviteOnlyEnabled ? 'translate-x-6' : ''
                    }`}
                  />
                </span>
              </label>
            </div>

            <p className="text-sm text-gray-500">
              Bootstrap admin email registration still bypasses invite-only mode.
            </p>
          </section>

          <section className="bg-white rounded-lg shadow-sm p-6 lg:col-span-2">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h2 className="text-xl font-bold mb-1">Site Announcement</h2>
                <p className="text-gray-600">
                  Controls the announcement banner shown at the top of public pages using the shared header.
                </p>
              </div>

              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.siteAnnouncementEnabled}
                  onChange={(event) => updateField('siteAnnouncementEnabled', event.target.checked)}
                  className="sr-only"
                />
                <span
                  className={`w-14 h-8 rounded-full p-1 transition-colors ${
                    settings.siteAnnouncementEnabled ? 'bg-green-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`block w-6 h-6 bg-white rounded-full transition-transform ${
                      settings.siteAnnouncementEnabled ? 'translate-x-6' : ''
                    }`}
                  />
                </span>
              </label>
            </div>

            <label className="block text-sm font-semibold mb-2">
              Announcement text
            </label>
            <input
              value={settings.siteAnnouncementText}
              onChange={(event) => updateField('siteAnnouncementText', event.target.value)}
              className="w-full px-4 py-3 border rounded-lg"
              placeholder="CreatorLaunch is building the next generation of founders."
            />
          </section>

          <section className="bg-white rounded-lg shadow-sm p-6 lg:col-span-2">
            <label className="block text-sm font-semibold mb-2">
              Reason for audit log
            </label>
            <textarea
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              rows={3}
              className="w-full px-4 py-3 border rounded-lg"
              placeholder="Example: Temporarily locking platform during private beta setup."
            />
            <p className="text-xs text-gray-500 mt-2">
              This reason is saved in Audit Logs when settings are changed.
            </p>
          </section>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettingsPage;
