import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { 
  FiShield, 
  FiUsers, 
  FiEdit, 
  FiTrash2, 
  FiPlus,
  FiSave,
  FiX,
  FiCheck
} from 'react-icons/fi';

// ################## ----- PERMISSION INTERFACES ----- ##################
// Interfaces for role and permission management
// ################################################################
interface Permission {
  id: string;
  name: string;
  description: string;
  category: 'users' | 'stores' | 'analytics' | 'settings' | 'system';
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
  isSystemRole: boolean;
}

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  lastLogin?: Date;
  isActive: boolean;
}

// ################## ----- PERMISSIONS MANAGEMENT PAGE ----- ##################
// Admin page for managing roles and permissions
// ####################################################################

const PermissionsPage: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'roles' | 'users'>('roles');
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [showRoleModal, setShowRoleModal] = useState(false);

  useEffect(() => {
    loadPermissionData();
  }, []);

  const loadPermissionData = async () => {
    try {
      // Mock data - replace with real API calls
      const mockPermissions: Permission[] = [
        { id: 'users.read', name: 'View Users', description: 'View user accounts and information', category: 'users' },
        { id: 'users.write', name: 'Manage Users', description: 'Create, edit, and manage user accounts', category: 'users' },
        { id: 'users.delete', name: 'Delete Users', description: 'Delete user accounts permanently', category: 'users' },
        { id: 'stores.read', name: 'View Stores', description: 'View store information and details', category: 'stores' },
        { id: 'stores.write', name: 'Manage Stores', description: 'Approve, edit, and manage stores', category: 'stores' },
        { id: 'stores.delete', name: 'Delete Stores', description: 'Delete stores permanently', category: 'stores' },
        { id: 'analytics.read', name: 'View Analytics', description: 'Access analytics and reports', category: 'analytics' },
        { id: 'settings.read', name: 'View Settings', description: 'View system settings', category: 'settings' },
        { id: 'settings.write', name: 'Manage Settings', description: 'Modify system settings', category: 'settings' },
        { id: 'system.admin', name: 'System Administration', description: 'Full system access and control', category: 'system' }
      ];

      const mockRoles: Role[] = [
        {
          id: '1',
          name: 'Super Admin',
          description: 'Full access to all system functions',
          permissions: mockPermissions.map(p => p.id),
          userCount: 1,
          isSystemRole: true
        },
        {
          id: '2',
          name: 'Admin',
          description: 'Standard admin access with most permissions',
          permissions: ['users.read', 'users.write', 'stores.read', 'stores.write', 'analytics.read', 'settings.read'],
          userCount: 3,
          isSystemRole: false
        },
        {
          id: '3',
          name: 'Moderator',
          description: 'Limited admin access for content moderation',
          permissions: ['users.read', 'stores.read', 'stores.write'],
          userCount: 5,
          isSystemRole: false
        },
        {
          id: '4',
          name: 'Analyst',
          description: 'Read-only access for analytics and reporting',
          permissions: ['users.read', 'stores.read', 'analytics.read'],
          userCount: 2,
          isSystemRole: false
        }
      ];

      const mockAdminUsers: AdminUser[] = [
        {
          id: '1',
          name: 'System Administrator',
          email: 'admin@youthcreator.com',
          role: 'Super Admin',
          lastLogin: new Date(Date.now() - 1000 * 60 * 30),
          isActive: true
        },
        {
          id: '2',
          name: 'Sarah Johnson',
          email: 'sarah.admin@youthcreator.com',
          role: 'Admin',
          lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 2),
          isActive: true
        },
        {
          id: '3',
          name: 'Mike Chen',
          email: 'mike.mod@youthcreator.com',
          role: 'Moderator',
          lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 5),
          isActive: true
        },
        {
          id: '4',
          name: 'Emma Davis',
          email: 'emma.analyst@youthcreator.com',
          role: 'Analyst',
          lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 24),
          isActive: false
        }
      ];

      setPermissions(mockPermissions);
      setRoles(mockRoles);
      setAdminUsers(mockAdminUsers);
    } catch (error) {
      console.error('Failed to load permission data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const groupPermissionsByCategory = () => {
    const grouped: Record<string, Permission[]> = {};
    permissions.forEach(permission => {
      if (!grouped[permission.category]) {
        grouped[permission.category] = [];
      }
      grouped[permission.category].push(permission);
    });
    return grouped;
  };

  const handleCreateRole = () => {
    setEditingRole({
      id: '',
      name: '',
      description: '',
      permissions: [],
      userCount: 0,
      isSystemRole: false
    });
    setShowRoleModal(true);
  };

  const handleEditRole = (role: Role) => {
    setEditingRole({ ...role });
    setShowRoleModal(true);
  };

  const handleSaveRole = () => {
    if (!editingRole) return;

    if (editingRole.id) {
      // Update existing role
      setRoles(roles.map(r => r.id === editingRole.id ? editingRole : r));
    } else {
      // Create new role
      const newRole = { ...editingRole, id: Date.now().toString() };
      setRoles([...roles, newRole]);
    }

    setShowRoleModal(false);
    setEditingRole(null);
  };

  const handleDeleteRole = (roleId: string) => {
    const role = roles.find(r => r.id === roleId);
    if (role?.isSystemRole) {
      alert('Cannot delete system roles');
      return;
    }

    if (confirm('Are you sure you want to delete this role? Users with this role will lose access.')) {
      setRoles(roles.filter(r => r.id !== roleId));
    }
  };

  const togglePermission = (permissionId: string) => {
    if (!editingRole) return;

    const hasPermission = editingRole.permissions.includes(permissionId);
    if (hasPermission) {
      setEditingRole({
        ...editingRole,
        permissions: editingRole.permissions.filter(p => p !== permissionId)
      });
    } else {
      setEditingRole({
        ...editingRole,
        permissions: [...editingRole.permissions, permissionId]
      });
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
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
            <h1 className="admin-page-title">Permissions Management</h1>
            <p className="admin-page-subtitle">Manage admin roles and permissions</p>
          </div>
          <div className="admin-page-actions">
            <button onClick={handleCreateRole} className="admin-btn">
              <FiPlus />
              Create Role
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="admin-table-container">
          <div className="admin-tabs">
            <button
              onClick={() => setActiveTab('roles')}
              className={`admin-tab ${activeTab === 'roles' ? 'active' : ''}`}
            >
              Roles ({roles.length})
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`admin-tab ${activeTab === 'users' ? 'active' : ''}`}
            >
              Admin Users ({adminUsers.length})
            </button>
          </div>

          <div style={{ padding: '1.5rem' }}>
            {/* Roles Tab */}
            {activeTab === 'roles' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {roles.map((role) => (
                  <div key={role.id} className="admin-role-card">
                    <div className="admin-role-header">
                      <div className="admin-table-cell-content">
                        <div className="admin-user-avatar" style={{ background: '#dbeafe' }}>
                          <FiShield style={{ color: '#3b82f6' }} />
                        </div>
                        <div className="admin-user-info">
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <h3 className="admin-role-title">{role.name}</h3>
                            {role.isSystemRole && (
                              <span className="admin-badge inactive">
                                System Role
                              </span>
                            )}
                          </div>
                          <p className="admin-role-subtitle">{role.description}</p>
                          <div className="admin-role-stats">
                            <span>{role.permissions.length} permissions</span>
                            <span>{role.userCount} users</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="admin-actions">
                        <button
                          onClick={() => handleEditRole(role)}
                          className="admin-action-btn edit"
                          title="Edit Role"
                        >
                          <FiEdit />
                        </button>
                        {!role.isSystemRole && (
                          <button
                            onClick={() => handleDeleteRole(role.id)}
                            className="admin-action-btn danger"
                            title="Delete Role"
                          >
                            <FiTrash2 />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Permissions Preview */}
                    <div className="admin-permissions-list">
                      {role.permissions.slice(0, 6).map((permissionId) => {
                        const permission = permissions.find(p => p.id === permissionId);
                        return permission ? (
                          <span key={permissionId} className="admin-permission-tag">
                            {permission.name}
                          </span>
                        ) : null;
                      })}
                      {role.permissions.length > 6 && (
                        <span className="admin-permission-tag" style={{ background: '#e5e7eb', color: '#6b7280' }}>
                          +{role.permissions.length - 6} more
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Admin Users Tab */}
            {activeTab === 'users' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {adminUsers.map((user) => (
                  <div key={user.id} className="admin-role-card">
                    <div className="admin-role-header">
                      <div className="admin-table-cell-content">
                        <div className="admin-user-avatar">
                          <span>{user.name.charAt(0).toUpperCase()}</span>
                        </div>
                        <div className="admin-user-info">
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <h3 className="admin-role-title">{user.name}</h3>
                            {!user.isActive && (
                              <span className="admin-badge danger">
                                Inactive
                              </span>
                            )}
                          </div>
                          <p className="admin-role-subtitle">{user.email}</p>
                          <div className="admin-role-stats">
                            <span>Role: {user.role}</span>
                            {user.lastLogin && (
                              <span>Last login: {formatTimeAgo(user.lastLogin)}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="admin-actions">
                        <button className="admin-action-btn edit" title="Edit User">
                          <FiEdit />
                        </button>
                        {user.isActive ? (
                          <button className="admin-action-btn danger" title="Deactivate User">
                            Deactivate
                          </button>
                        ) : (
                          <button className="admin-action-btn success" title="Activate User">
                            Activate
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Role Edit Modal */}
        {showRoleModal && editingRole && (
          <div className="admin-modal">
            <div className="admin-modal-content">
              <div className="admin-modal-header">
                <h2 className="admin-modal-title">
                  {editingRole.id ? 'Edit Role' : 'Create New Role'}
                </h2>
                <button
                  onClick={() => setShowRoleModal(false)}
                  className="admin-modal-close"
                >
                  <FiX />
                </button>
              </div>

              <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {/* Role Details */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
                  <div className="admin-form-group">
                    <label className="admin-form-label">
                      Role Name
                    </label>
                    <input
                      type="text"
                      value={editingRole.name}
                      onChange={(e) => setEditingRole({...editingRole, name: e.target.value})}
                      className="admin-form-input"
                      placeholder="Enter role name"
                    />
                  </div>
                  
                  <div className="admin-form-group">
                    <label className="admin-form-label">
                      Description
                    </label>
                    <input
                      type="text"
                      value={editingRole.description}
                      onChange={(e) => setEditingRole({...editingRole, description: e.target.value})}
                      className="admin-form-input"
                      placeholder="Describe this role"
                    />
                  </div>
                </div>

                {/* Permissions */}
                <div>
                  <h3 className="admin-section-title">Permissions</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {Object.entries(groupPermissionsByCategory()).map(([category, categoryPermissions]) => (
                      <div key={category} className="admin-form" style={{ background: '#f9fafb' }}>
                        <h4 className="admin-section-subtitle" style={{ textTransform: 'capitalize', marginBottom: '1rem' }}>
                          {category} Permissions
                        </h4>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '0.75rem' }}>
                          {categoryPermissions.map((permission) => (
                            <label key={permission.id} className="admin-checkbox-group">
                              <input
                                type="checkbox"
                                checked={editingRole.permissions.includes(permission.id)}
                                onChange={() => togglePermission(permission.id)}
                                className="admin-checkbox"
                              />
                              <div className="admin-checkbox-content">
                                <div className="admin-checkbox-label">{permission.name}</div>
                                <div className="admin-checkbox-description">{permission.description}</div>
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="admin-modal-footer">
                <button
                  onClick={() => setShowRoleModal(false)}
                  className="admin-btn secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveRole}
                  className="admin-btn primary"
                >
                  <FiSave />
                  {editingRole.id ? 'Update Role' : 'Create Role'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default PermissionsPage;
