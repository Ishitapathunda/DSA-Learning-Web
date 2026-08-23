import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  // `checkingSession` covers the initial GET /api/auth/me call on page load,
  // so protected routes don't briefly redirect to /login before we know
  // whether the httpOnly cookie is still valid.
  const [checkingSession, setCheckingSession] = useState(true);
  const [authError, setAuthError] = useState(null);

  const loadSession = useCallback(async () => {
    try {
      const data = await api.get('/auth/me');
      setUser(data.user);
    } catch {
      setUser(null);
    } finally {
      setCheckingSession(false);
    }
  }, []);

  useEffect(() => {
    loadSession();
  }, [loadSession]);

  const register = useCallback(async ({ username, email, password }) => {
    setAuthError(null);
    try {
      const data = await api.post('/auth/register', { username, email, password });
      setUser(data.user);
      return { success: true };
    } catch (err) {
      setAuthError(err.message);
      return { success: false, message: err.message, details: err.details };
    }
  }, []);

  const login = useCallback(async ({ email, password }) => {
    setAuthError(null);
    try {
      const data = await api.post('/auth/login', { email, password });
      setUser(data.user);
      return { success: true };
    } catch (err) {
      setAuthError(err.message);
      return { success: false, message: err.message, details: err.details };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      setUser(null);
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      checkingSession,
      authError,
      register,
      login,
      logout,
    }),
    [user, checkingSession, authError, register, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
};
