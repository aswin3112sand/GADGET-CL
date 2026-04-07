const STORAGE_KEY = 'gadget69:last-checkout-success';

const hasSessionStorage = () => typeof window !== 'undefined' && typeof window.sessionStorage !== 'undefined';

export const saveCheckoutSuccess = (payload) => {
  if (!hasSessionStorage() || !payload) {
    return;
  }

  window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
};

export const readCheckoutSuccess = () => {
  if (!hasSessionStorage()) {
    return null;
  }

  const raw = window.sessionStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch {
    window.sessionStorage.removeItem(STORAGE_KEY);
    return null;
  }
};

export const clearCheckoutSuccess = () => {
  if (!hasSessionStorage()) {
    return;
  }

  window.sessionStorage.removeItem(STORAGE_KEY);
};
