import '@/styles/global.css';
import '@/styles/admin.css';
import '@bible-strong/avatar-react/styles.css';

import type { AppProps } from 'next/app';
import { AuthProvider } from '@/context/AuthContext';
import { AdminAuthProvider } from '@/context/AdminAuthContext';
import { CartProvider } from '@/context/CartContext';
import MoxSurprise from '@/components/common/MoxSurprise';

// ################## ----- MAIN APP COMPONENT ----- ##################
// Root application component that wraps all pages
// Provides global context providers and styling
// ##########################################################
export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <AdminAuthProvider>
        <CartProvider>
          <Component {...pageProps} />
          <MoxSurprise />
        </CartProvider>
      </AdminAuthProvider>
    </AuthProvider>
  );
}
