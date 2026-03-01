'use client';

import { createContext, useContext, ReactNode } from 'react';
import type { User, UserCredential } from 'firebase/auth';

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<UserCredential>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

/** Fallback when auth is not loaded yet (mobile: defer Firebase until after load). No Firebase import. */
export function FallbackAuthProvider({ children }: { children: ReactNode }) {
  const value: AuthContextType = {
    user: null,
    loading: true,
    signIn: async () => { throw new Error('Auth is loading'); },
    signOut: async () => {},
  };
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext };
