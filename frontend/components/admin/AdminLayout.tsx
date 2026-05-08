import React, { ReactNode, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import {
  FiUsers,
  FiShoppingBag,
  FiBarChart,
  FiLogOut,
  FiMenu,
  FiX,
  FiHome,
  FiShield,
  FiClock,
  FiPackage,
  FiTool,
  FiEdit3,
} from 'react-icons/fi';

interface AdminLayoutProps {
  children: ReactNode;
  FiSettings,
}

const menuItems = [
  {
    href: '/admin',
    icon: FiHome,
    label: 'Dashboard',
    permission: null,
  },
  {
    href: '/admin/users',
    icon: FiUsers,
    label: 'Users & Invites',
    permission: 'users.read',
  },
  {
    href: '/admin/stores',
    icon: FiShoppingBag,
    label: 'Stores',
    permission: 'stores.read',
  },
  {
    href: '/admin/products',
    icon: FiPackage,
    label: 'Products',
    permission: 'stores.write',
  },
  {
    href: '/admin/services',
    icon: FiTool,
    label: 'Services',
    permission: 'stores.write',
  },
  {
    href: '/admin/blog',
    icon: FiEdit3,
    label: 'Blog',
    permission: 'settings.write',
  },
  {
    href: '/admin/security',
    icon: FiShield,
    label: 'Security',
    permission: 'users.write',
  },
  {
    href: '/admin/analytics',
    icon: FiBarChart,
    label: 'Analytics',
    permission: 'analytics.read',
  },
  {
  href: '/admin/settings',
  icon: FiSettings,
  label: 'Settings',
  permission: 'settings.write',
},
  {
    href: '/admin/audit-logs',
    icon: FiClock,
    label: 'Audit Logs',
    permission: 'settings.read',
  },
];

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { admin, logout, hasPermission } = useAdminAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/admin');
  };

  return (
    <div className="admin-layout">
      <button
        className="admin-mobile-menu-btn"
        onClick={() => setSidebarOpen(true)}
        aria-label="Open admin menu"
      >
        <FiMenu />
      </button>

      {sidebarOpen && (
        <button
          className="admin-mobile-overlay"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close admin menu"
        />
      )}

      <div className={`admin-sidebar ${sidebarOpen ? 'mobile-open' : ''}`}>
        <div className="admin-sidebar-header">
          <img src="/assets/header-logo.png" alt="CreatorLaunch" className="admin-logo" />

          <div>
            <h2>CreatorLaunch</h2>
            <p style={{ color: '#9ca3af', fontSize: '0.8rem' }}>Admin Panel</p>
          </div>

          <button
            className="admin-mobile-close"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close admin menu"
          >
            <FiX />
          </button>
        </div>

        <nav className="admin-nav">
          <ul>
            {menuItems.map((item) => {
              if (item.permission && !hasPermission(item.permission)) {
                return null;
              }

              const active =
                item.href === '/admin'
                  ? router.pathname === '/admin'
                  : router.pathname.startsWith(item.href);

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={active ? 'active' : ''}
                  >
                    <item.icon />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="admin-sidebar-footer">
          <button onClick={handleLogout} className="admin-sidebar-logout">
            <FiLogOut />
            Logout
          </button>
        </div>
      </div>

      <div className="admin-main">
        <header className="admin-header">
          <div className="admin-welcome">
            <h2>Admin Dashboard</h2>
            <p>Real-time CreatorLaunch platform management</p>
          </div>

          <div className="admin-user-info">
            <span>Welcome, {admin?.name || admin?.email || 'Admin'}</span>
            <span className="admin-role-badge">{admin?.role || 'Admin'}</span>
          </div>
        </header>

        <div>{children}</div>
      </div>
    </div>
  );
};

export default AdminLayout;
