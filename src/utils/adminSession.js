const ADMIN_SESSION_KEY = 'gadget69_admin_session';

export const getAdminSession = () => {
  try {
    const raw = localStorage.getItem(ADMIN_SESSION_KEY);
    if (!raw) {
      return null;
    }
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const setAdminSession = (session) => {
  localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
};

export const clearAdminSession = () => {
  localStorage.removeItem(ADMIN_SESSION_KEY);
};

export const isAdminSessionActive = (session) => {
  if (!session?.token) {
    return false;
  }
  if (!session.expiresAt) {
    return true;
  }
  return session.expiresAt > Date.now();
};
