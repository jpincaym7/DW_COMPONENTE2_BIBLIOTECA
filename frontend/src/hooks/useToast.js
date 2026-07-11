import { useContext } from 'react';

import { ToastContext } from '../context/ToastContext.jsx';

export const useToast = () => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast debe utilizarse dentro de ToastProvider');
  }

  return context;
};
