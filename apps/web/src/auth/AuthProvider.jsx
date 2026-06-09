import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { api } from '@/lib/api.js';

const AuthContext = createContext(null);

// Holds the logged-in user and the auth actions. On mount it asks the API who we
// are (restoring a session from the cookies), so a page refresh keeps you in.
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Auth modal state (login/register), so it can be opened from anywhere
  // (header, or the "save your reading" prompt).
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [authRedirect, setAuthRedirect] = useState('/mi-codigo');
  const openAuth = useCallback((mode = 'login', redirectTo = '/mi-codigo') => {
    setAuthMode(mode);
    setAuthRedirect(redirectTo);
    setAuthOpen(true);
  }, []);
  const closeAuth = useCallback(() => setAuthOpen(false), []);

  useEffect(() => {
    api.get('/auth/me')
      .then((d) => setUser(d.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email, password) => {
    const d = await api.post('/auth/login', { email, password });
    setUser(d.user);
    return d.user;
  }, []);

  const register = useCallback(async ({ email, password, name }) => {
    const d = await api.post('/auth/register', { email, password, name });
    setUser(d.user);
    return d.user;
  }, []);

  const logout = useCallback(async () => {
    await api.post('/auth/logout').catch(() => {});
    setUser(null);
  }, []);

  const value = {
    user, loading, login, register, logout,
    authOpen, authMode, authRedirect, openAuth, closeAuth,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
}
