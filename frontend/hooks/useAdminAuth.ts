import { useContext } from 'react';
import { AdminAuthContext } from '@/context/AdminAuthContext';

// ################## ----- USE ADMIN AUTH HOOK ----- ##################
// Custom hook to access admin authentication context
// Provides easy access to admin state and methods
// ################################################################
export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  
  return context;
};
