import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import api, { apiErrorMessage } from '../lib/api';
import {
  clearAdminSession,
  getAdminSession,
  isAdminSessionActive,
  setAdminSession,
} from '../utils/adminSession';

const AdminAuthContext = createContext(null);

export const AdminAuthProvider = ({ children }) => {
  const [session, setSession] = useState(() => {
    const existing = getAdminSession();
    return isAdminSessionActive(existing) ? existing : null;
  });
  const [bootstrapped, setBootstrapped] = useState(false);

  useEffect(() => {
    const existing = getAdminSession();
    if (!isAdminSessionActive(existing)) {
      clearAdminSession();
      setSession(null);
    }
    setBootstrapped(true);
  }, []);

  const login = useCallback(async (email, password) => {
    const { data } = await api.post('/admin/login', { email, password });
    const expiresAt = Date.now() + (data.expiresIn * 1000);
    const nextSession = { ...data, expiresAt };
    setAdminSession(nextSession);
    setSession(nextSession);
    return nextSession;
  }, []);

  const logout = useCallback(() => {
    clearAdminSession();
    setSession(null);
  }, []);

  const value = useMemo(() => ({
    session,
    bootstrapped,
    isAuthenticated: isAdminSessionActive(session),
    admin: session?.admin ?? null,
    login,
    logout,
    apiErrorMessage,
  }), [bootstrapped, login, logout, session]);

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
