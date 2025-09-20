import '@/styles/global.css';
import '@/styles/admin.css';

import type { AppProps } from 'next/app';
import { AuthProvider } from '@/context/AuthContext';
import { AdminAuthProvider } from '@/context/AdminAuthContext';

// ################## ----- MAIN APP COMPONENT ----- ##################
// Root application component that wraps all pages
// Provides global context providers and styling
// ##########################################################
export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <AdminAuthProvider>
        <Component {...pageProps} />
      </AdminAuthProvider>
    </AuthProvider>
  );
}
