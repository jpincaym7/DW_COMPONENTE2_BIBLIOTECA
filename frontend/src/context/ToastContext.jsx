import { createContext, useCallback, useMemo, useState } from 'react';

import { ToastContainer } from '../components/ui/Toast.jsx';

const TOAST_DURATION = 4000;

export const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const dismissToast = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    ({ type = 'info', message }) => {
      const id = `${Date.now()}-${Math.random()}`;

      setToasts((current) => [...current, { id, type, message }]);
      setTimeout(() => dismissToast(id), TOAST_DURATION);
    },
    [dismissToast]
  );

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </ToastContext.Provider>
  );
};
