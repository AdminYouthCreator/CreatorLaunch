import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { 
  FiSearch, 
  FiKey, 
  FiMail, 
  FiRefreshCw,
  FiCheck,
  FiX,
  FiClock,
  FiAlertTriangle,
  FiEye,
  FiCopy
} from 'react-icons/fi';

// ################## ----- PASSWORD RESET INTERFACE ----- ##################
// Interface for password reset requests and user data
// ####################################################################
interface PasswordResetRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  requestDate: Date;
  status: 'pending' | 'completed' | 'expired';
  requestedBy: 'user' | 'admin';
  resetToken?: string;
  expiresAt: Date;
}

interface UserPasswordInfo {
  id: string;
  name: string;
  email: string;
  lastPasswordChange: Date;
  passwordStrength: 'weak' | 'medium' | 'strong';
  loginAttempts: number;
  isLocked: boolean;
  lastLogin?: Date;
}

// ################## ----- PASSWORD MANAGEMENT PAGE ----- ##################
// Admin page for managing user passwords and reset requests
// ####################################################################

const PasswordManagementPage: React.FC = () => {
  const [resetRequests, setResetRequests] = useState<PasswordResetRequest[]>([]);
  const [userPasswords, setUserPasswords] = useState<UserPasswordInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'requests' | 'users'>('requests');
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [showGeneratedPassword, setShowGeneratedPassword] = useState(false);

  useEffect(() => {
    loadPasswordData();
  }, []);

  const loadPasswordData = async () => {
    try {
      // Mock data - replace with real API calls
      const mockResetRequests: PasswordResetRequest[] = [
        {
          id: '1',
          userId: '1',
          userName: 'Sarah Johnson',
          userEmail: 'sarah@example.com',
          requestDate: new Date(Date.now() - 1000 * 60 * 30),
          status: 'pending',
          requestedBy: 'user',
          resetToken: 'abc123def456',
          expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24)
        },
        {
          id: '2',
          userId: '2',
          userName: 'Mike Chen',
          userEmail: 'mike@example.com',
          requestDate: new Date(Date.now() - 1000 * 60 * 60 * 2),
          status: 'completed',
          requestedBy: 'admin',
          expiresAt: new Date(Date.now() - 1000 * 60 * 60)
        },
        {
          id: '3',
          userId: '3',
          userName: 'Emma Davis',
          userEmail: 'emma@example.com',
          requestDate: new Date(Date.now() - 1000 * 60 * 60 * 25),
          status: 'expired',
          requestedBy: 'user',
          expiresAt: new Date(Date.now() - 1000 * 60 * 60)
        }
      ];

      const mockUserPasswords: UserPasswordInfo[] = [
        {
          id: '1',
          name: 'Sarah Johnson',
          email: 'sarah@example.com',
          lastPasswordChange: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
          passwordStrength: 'strong',
          loginAttempts: 0,
          isLocked: false,
          lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 2)
        },
        {
          id: '2',
          name: 'Mike Chen',
          email: 'mike@example.com',
          lastPasswordChange: new Date(Date.now() - 1000 * 60 * 60 * 24 * 90),
          passwordStrength: 'weak',
          loginAttempts: 3,
          isLocked: false,
          lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5)
        },
        {
          id: '3',
          name: 'Emma Davis',
          email: 'emma@example.com',
          lastPasswordChange: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
          passwordStrength: 'medium',
          loginAttempts: 5,
          isLocked: true,
          lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 6)
        }
      ];

      setResetRequests(mockResetRequests);
      setUserPasswords(mockUserPasswords);
    } catch (error) {
      console.error('Failed to load password data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generatePassword = () => {
    const length = 12;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setGeneratedPassword(password);
    setShowGeneratedPassword(true);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const sendPasswordReset = (email: string) => {
    // TODO: Implement password reset email
    alert(`Password reset email sent to ${email}`);
  };

  const approveResetRequest = (requestId: string) => {
    // TODO: Implement reset request approval
    alert(`Reset request ${requestId} approved`);
  };

  const denyResetRequest = (requestId: string) => {
    // TODO: Implement reset request denial
    alert(`Reset request ${requestId} denied`);
  };

  const unlockUser = (userId: string) => {
    // TODO: Implement user unlock
    alert(`User ${userId} unlocked`);
  };

  const forcePasswordChange = (userId: string) => {
    // TODO: Implement force password change
    alert(`User ${userId} will be required to change password on next login`);
  };

  const getStatusColor = (status: PasswordResetRequest['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'expired': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStrengthColor = (strength: UserPasswordInfo['passwordStrength']) => {
    switch (strength) {
      case 'strong': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'weak': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
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

  const filteredRequests = resetRequests.filter(request =>
    request.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.userEmail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredUsers = userPasswords.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <h1 className="admin-page-title">Password Management</h1>
            <p className="admin-page-subtitle">Manage user passwords and reset requests</p>
          </div>
          <div className="admin-page-actions">
            <button onClick={generatePassword} className="admin-btn">
              <FiKey />
              Generate Password
            </button>
          </div>
        </div>

        {/* Generated Password Modal */}
        {showGeneratedPassword && (
          <div className="admin-form" style={{ background: '#eff6ff', border: '1px solid #bfdbfe' }}>
            <div className="admin-page-header" style={{ borderBottom: 'none', marginBottom: '0' }}>
              <div>
                <h3 style={{ fontSize: '0.875rem', fontWeight: '500', color: '#1e40af', margin: '0' }}>Generated Password</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <code style={{ background: 'white', padding: '0.5rem 0.75rem', borderRadius: '0.25rem', border: '1px solid #d1d5db', fontSize: '0.875rem', fontFamily: 'monospace' }}>
                    {generatedPassword}
                  </code>
                  <button
                    onClick={() => copyToClipboard(generatedPassword)}
                    className="admin-action-btn view"
                    title="Copy"
                  >
                    <FiCopy />
                  </button>
                </div>
              </div>
              <button
                onClick={() => setShowGeneratedPassword(false)}
                className="admin-action-btn edit"
                title="Close"
              >
                <FiX />
              </button>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="admin-table-container">
          <div className="admin-tabs">
            <button
              onClick={() => setActiveTab('requests')}
              className={`admin-tab ${activeTab === 'requests' ? 'active' : ''}`}
            >
              Reset Requests ({resetRequests.filter(r => r.status === 'pending').length})
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`admin-tab ${activeTab === 'users' ? 'active' : ''}`}
            >
              User Passwords ({userPasswords.filter(u => u.isLocked).length} locked)
            </button>
          </div>

          <div style={{ padding: '1.5rem' }}>
            {/* Search */}
            <div className="admin-search-input">
              <FiSearch />
              <input
                type="text"
                placeholder="Search users or requests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Reset Requests Tab */}
            {activeTab === 'requests' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {filteredRequests.length === 0 ? (
                  <div className="admin-empty-state">
                    No password reset requests found
                  </div>
                ) : (
                  filteredRequests.map((request) => (
                    <div key={request.id} className="admin-role-card">
                      <div className="admin-role-header">
                        <div className="admin-table-cell-content">
                          <div className="admin-user-avatar">
                            <FiKey />
                          </div>
                          <div className="admin-user-info">
                            <h3 className="admin-role-title">{request.userName}</h3>
                            <p className="admin-role-subtitle">{request.userEmail}</p>
                            <div className="admin-role-stats">
                              <span>Requested {formatTimeAgo(request.requestDate)}</span>
                              <span>by {request.requestedBy}</span>
                              <span className={`admin-badge ${request.status}`}>
                                {request.status}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        {request.status === 'pending' && (
                          <div className="admin-actions">
                            <button
                              onClick={() => approveResetRequest(request.id)}
                              className="admin-action-btn success"
                              title="Approve"
                            >
                              <FiCheck />
                            </button>
                            <button
                              onClick={() => denyResetRequest(request.id)}
                              className="admin-action-btn danger"
                              title="Deny"
                            >
                              <FiX />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* User Passwords Tab */}
            {activeTab === 'users' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {filteredUsers.length === 0 ? (
                  <div className="admin-empty-state">
                    No users found
                  </div>
                ) : (
                  filteredUsers.map((user) => (
                    <div key={user.id} className="admin-role-card">
                      <div className="admin-role-header">
                        <div className="admin-table-cell-content">
                          <div className="admin-user-avatar">
                            <span>{user.name.charAt(0).toUpperCase()}</span>
                          </div>
                          <div className="admin-user-info">
                            <h3 className="admin-role-title">{user.name}</h3>
                            <p className="admin-role-subtitle">{user.email}</p>
                            <div className="admin-role-stats">
                              <span>Last changed: {formatTimeAgo(user.lastPasswordChange)}</span>
                              <span className={`admin-badge ${user.passwordStrength}`}>
                                {user.passwordStrength} password
                              </span>
                              {user.isLocked && (
                                <span className="admin-badge danger">LOCKED</span>
                              )}
                              {user.loginAttempts > 0 && (
                                <span className="admin-badge warning">
                                  {user.loginAttempts} failed attempts
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="admin-actions">
                          <button
                            onClick={() => sendPasswordReset(user.email)}
                            className="admin-action-btn edit"
                            title="Send Password Reset"
                          >
                            <FiMail />
                          </button>
                          {user.isLocked && (
                            <button
                              onClick={() => unlockUser(user.id)}
                              className="admin-action-btn success"
                              title="Unlock User"
                            >
                              <FiRefreshCw />
                            </button>
                          )}
                          <button
                            onClick={() => forcePasswordChange(user.id)}
                            className="admin-action-btn warning"
                            title="Force Password Change"
                          >
                            <FiAlertTriangle />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default PasswordManagementPage;
