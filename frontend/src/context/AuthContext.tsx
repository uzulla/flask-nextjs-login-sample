'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { User, authAPI } from '@/services/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Check if user is authenticated on initial load
  useEffect(() => {
    const initAuth = async () => {
      try {
        const userData = await authAPI.getCurrentUser();
        setUser(userData);
      } catch (err) {
        console.error('Not authenticated or failed to fetch user data:', err);
        // User is not authenticated, no action needed
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Login function
  const login = async (username: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await authAPI.login({ username, password });
      setUser(response.user);
      router.push('/dashboard');
    } catch (err) {
      const error = err as Error;
      setError(error.message || 'Failed to login');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (username: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      await authAPI.register({ username, password });
      await login(username, password);
    } catch (err) {
      const error = err as Error;
      setError(error.message || 'Failed to register');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await authAPI.logout();
      setUser(null);
      router.push('/login');
    } catch (err) {
      console.error('Failed to logout:', err);
      // Even if the server logout fails, we still want to clear the local state
      setUser(null);
      router.push('/login');
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
