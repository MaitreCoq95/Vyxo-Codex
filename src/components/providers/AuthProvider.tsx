'use client';

import * as React from 'react';
import { useAuth, type UseAuthReturn } from '@/hooks/use-auth';

/* ==========================================
 * AUTH CONTEXT
 * Provides authentication state throughout the app
 * ========================================== */

const AuthContext = React.createContext<UseAuthReturn | null>(null);

export interface AuthProviderProps {
  children: React.ReactNode;
}

/**
 * AuthProvider
 *
 * Wraps the application with authentication context.
 * Makes useAuth hook available to all child components.
 *
 * @example
 * ```tsx
 * <AuthProvider>
 *   <App />
 * </AuthProvider>
 * ```
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const auth = useAuth();

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * useAuthContext
 *
 * Hook to access authentication state from context.
 * Use this instead of useAuth() hook when you need auth state
 * in a component that's already wrapped in AuthProvider.
 *
 * @throws {Error} If used outside of AuthProvider
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { user, profile, isAuthenticated } = useAuthContext();
 *
 *   if (!isAuthenticated) {
 *     return <p>Please log in</p>;
 *   }
 *
 *   return <p>Welcome {profile.full_name}</p>;
 * }
 * ```
 */
export const useAuthContext = (): UseAuthReturn => {
  const context = React.useContext(AuthContext);

  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }

  return context;
};
