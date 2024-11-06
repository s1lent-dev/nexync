"use client"

import { createContext, ReactNode, useContext } from 'react';
import { Toaster, toast, ToastOptions } from 'react-hot-toast';

interface ToastContextType {
  showToast: (message: string, options?: ToastOptions) => void;
  showSuccessToast: (message: string) => void;
  showErrorToast: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const showToast = (message: string, options?: ToastOptions) => {
    toast(message, options);
  };

  const showSuccessToast = (message: string) => {
    toast.success(message, {
      style: { background: '#00a884', color: '#fff' },
    });
  };

  const showErrorToast = (message: string) => {
    toast.error(message, {
      style: { background: '#F44336', color: '#fff' },
    });
  };

  return (
    <ToastContext.Provider value={{ showToast, showSuccessToast, showErrorToast }}>
      {children}
      <Toaster
        position='top-center'
        toastOptions={{
          loading: { style: { background: '#333', color: '#fff' } },
          style: {
            borderRadius: '8px',
            background: '#333',
            color: '#fff',
            fontSize: '16px',
            animation: 'fadeIn 0.5s',
          },
          success: { style: { background: '#00a884' } },
          error: { style: { background: '#F44336' } },
        }}
      />

    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

