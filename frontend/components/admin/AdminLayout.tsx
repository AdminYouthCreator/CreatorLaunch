import React, { ReactNode, useState } from 'react';
import Link from 'next/link';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { 
  FiUsers, 
  FiShoppingBag, 
  FiBarChart, 
  FiSettings, 
  FiLogOut, 
  FiMenu, 
  FiX,
  FiHome,
  FiKey,
  FiShield,
  FiEdit3
} from 'react-icons/fi';

// ################## ----- ADMIN LAYOUT PROPS ----- ##################
// Props interface for the admin layout component
// ################################################################
interface AdminLayoutProps {
  children: ReactNode;
}

// ################## ----- SIDEBAR MENU ITEMS ----- ##################
// Navigation menu items for the admin sidebar
// ################################################################
const menuItems = [
  { 
    href: '/admin', 
    icon: FiHome, 
    label: 'Dashboard',
    permission: null 
  },
  { 
    href: '/admin/users', 
    icon: FiUsers, 
    label: 'Users Management',
    permission: 'users.read' 
  },
  { 
    href: '/admin/stores', 
    icon: FiShoppingBag, 
    label: 'Store Management',
    permission: 'stores.read' 
  },
  { 
    href: '/admin/blog', 
    icon: FiEdit3, 
    label: 'Blog Management',
    permission: null 
  },
  { 
    href: '/admin/analytics', 
    icon: FiBarChart, 
    label: 'Analytics',
    permission: 'analytics.read' 
  },
  { 
    href: '/admin/passwords', 
    icon: FiKey, 
    label: 'Password Management',
    permission: 'users.write' 
  },
  { 
    href: '/admin/permissions', 
    icon: FiShield, 
    label: 'Permissions',
    permission: 'users.write' 
  },
  { 
    href: '/admin/settings', 
    icon: FiSettings, 
    label: 'Settings',
    permission: 'settings.read' 
  }
];

// ################## ----- ADMIN LAYOUT COMPONENT ----- ##################
// Main layout component for admin pages
// Provides sidebar navigation and header
// ####################################################################
const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { admin, logout, hasPermission } = useAdminAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <div className={`admin-sidebar ${sidebarOpen ? 'mobile-open' : ''}`}>
        <div className="admin-sidebar-header">
          <img src="/assets/logo.png" alt="YouthCreator" className="admin-logo" />
          <h2>Creator Launch</h2>
        </div>
        
        <nav className="admin-nav">
          <ul>
            {menuItems.map((item) => {
              // Check if user has permission for this menu item
              if (item.permission && !hasPermission(item.permission)) {
                return null;
              }
              
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="admin-sidebar-footer">
          <button onClick={handleLogout} className="admin-sidebar-logout">
            <FiLogOut />
            Logout
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="admin-main">
        {/* Header */}
        <header className="admin-header">
          {/* Welcome Section */}
          <div className="admin-welcome">
            <h2>Welcome to Admin Dashboard</h2>
            <p>Overview of YouthCreator platform</p>
          </div>
          
          <div className="admin-user-info">
            <span>Welcome, {admin?.name}</span>
            <span className="admin-role-badge">{admin?.role}</span>
          </div>
        </header>

        {/* Page content */}
        <div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
