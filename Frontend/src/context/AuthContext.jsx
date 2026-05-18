import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { authApi } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(
    () => (typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null)
  );
  const [ready, setReady] = useState(false);

  const persistToken = useCallback((token) => {
    if (token) {
      localStorage.setItem('accessToken', token);
      setAccessToken(token);
    } else {
      localStorage.removeItem('accessToken');
      setAccessToken(null);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function tryRefresh() {
      if (accessToken) {
        setReady(true);
        return;
      }
      try {
        const res = await authApi.refresh();
        const next = res?.data?.accessToken;
        if (!cancelled && next) persistToken(next);
      } catch {
        /* no session */
      } finally {
        if (!cancelled) setReady(true);
      }
    }
    tryRefresh();
    return () => {
      cancelled = true;
    };
  }, [accessToken, persistToken]);

  const login = useCallback(
    async (email, password) => {
      const res = await authApi.login({ email, password });
      const token = res?.data?.accessToken;
      const u = res?.data?.user;
      if (token) persistToken(token);
      setUser(u ?? null);
      return res;
    },
    [persistToken]
  );

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      /* ignore */
    }
    persistToken(null);
    setUser(null);
  }, [persistToken]);

  const value = useMemo(
    () => ({
      user,
      setUser,
      accessToken,
      isAuthenticated: Boolean(accessToken),
      ready,
      login,
      logout,
      persistToken,
    }),
    [user, accessToken, ready, login, logout, persistToken]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
