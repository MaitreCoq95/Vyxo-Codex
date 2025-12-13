'use client';

/**
 * Vyxo Codex 2.0 - useAuth Hook
 * Hook centralisé pour l'authentification et la gestion de session
 */

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/infrastructure/supabase/client';
import type { User, Session } from '@supabase/supabase-js';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: 'operator' | 'manager' | 'director';
  company_id: string;
  team_id: string | null;
  current_streak: number;
  longest_streak: number;
  total_xp: number;
  mentor_level: boolean;
}

export interface AuthState {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface UseAuthReturn extends AuthState {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string, companyName: string, role: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
  refreshSession: () => Promise<void>;
  hasPermission: (requiredRole: 'operator' | 'manager' | 'director') => boolean;
}

const roleHierarchy = {
  operator: 0,
  manager: 1,
  director: 2,
};

export function useAuth(): UseAuthReturn {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    session: null,
    isLoading: true,
    isAuthenticated: false,
  });

  const router = useRouter();
  const supabase = createClient();

  // Load initial session
  useEffect(() => {
    loadSession();

    // Subscribe to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session) {
        await loadProfile(session.user);
      } else {
        setState({
          user: null,
          profile: null,
          session: null,
          isLoading: false,
          isAuthenticated: false,
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function loadSession() {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        await loadProfile(session.user);
      } else {
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    } catch (error) {
      console.error('Failed to load session:', error);
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }

  async function loadProfile(user: User) {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      setState({
        user,
        profile: profile as Profile,
        session: (await supabase.auth.getSession()).data.session,
        isLoading: false,
        isAuthenticated: true,
      });
    } catch (error) {
      console.error('Failed to load profile:', error);
      setState((prev) => ({
        ...prev,
        user,
        isLoading: false,
        isAuthenticated: true,
      }));
    }
  }

  async function signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    if (data.session) {
      await loadProfile(data.user);
      router.push('/dashboard');
      router.refresh();
    }
  }

  async function signUp(
    email: string,
    password: string,
    fullName: string,
    companyName: string,
    role: string
  ) {
    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (authError) throw authError;

    if (authData.user) {
      // Create company
      const { data: company, error: companyError } = await supabase
        .from('companies')
        .insert({ name: companyName })
        .select()
        .single();

      if (companyError) throw companyError;

      // Create profile
      const { error: profileError } = await supabase.from('profiles').insert({
        id: authData.user.id,
        email,
        full_name: fullName,
        role,
        company_id: company.id,
      });

      if (profileError) throw profileError;
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
    setState({
      user: null,
      profile: null,
      session: null,
      isLoading: false,
      isAuthenticated: false,
    });
    router.push('/login');
    router.refresh();
  }

  async function resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    });

    if (error) throw error;
  }

  async function updatePassword(newPassword: string) {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) throw error;
  }

  async function refreshSession() {
    const {
      data: { session },
    } = await supabase.auth.refreshSession();

    if (session) {
      await loadProfile(session.user);
    }
  }

  function hasPermission(requiredRole: 'operator' | 'manager' | 'director'): boolean {
    if (!state.profile) return false;

    const userRoleLevel = roleHierarchy[state.profile.role];
    const requiredRoleLevel = roleHierarchy[requiredRole];

    return userRoleLevel >= requiredRoleLevel;
  }

  return {
    ...state,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
    refreshSession,
    hasPermission,
  };
}

/**
 * Hook pour protéger les pages nécessitant une authentification
 */
export function useRequireAuth(requiredRole?: 'operator' | 'manager' | 'director') {
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!auth.isLoading) {
      if (!auth.isAuthenticated) {
        router.push('/login');
      } else if (requiredRole && !auth.hasPermission(requiredRole)) {
        router.push('/dashboard');
      }
    }
  }, [auth.isLoading, auth.isAuthenticated, requiredRole]);

  return auth;
}
