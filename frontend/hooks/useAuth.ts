import { useContext } from 'react';
import { useAuthContext } from '@/context/AuthContext';

// ################## ----- AUTH HOOK ----- ##################
// Custom hook for accessing authentication context
// Provides authentication methods and user state
// ##########################################################
export const useAuth = () => {
  const context = useAuthContext();
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  // Return the context methods directly - they're already implemented with real API calls
  return context;
};
