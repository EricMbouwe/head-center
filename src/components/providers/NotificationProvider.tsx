import { Toaster, toast, type ToastOptions } from 'react-hot-toast';
import { createContext, useContext, useMemo } from 'react';
import type { PropsWithChildren } from 'react';

type PromiseMessages<T> = {
  loading: string;
  success: string | ((value: T) => string);
  error: string | ((error: unknown) => string);
};

type NotificationContextValue = {
  success: (message: string, options?: ToastOptions) => string;
  error: (message: string, options?: ToastOptions) => string;
  info: (message: string, options?: ToastOptions) => string;
  promise: <T>(promise: Promise<T>, messages: PromiseMessages<T>, options?: ToastOptions) => Promise<T>;
  dismiss: (toastId?: string) => void;
};

const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);

const baseOptions: ToastOptions = {
  duration: 4000
};

export function NotificationProvider({ children }: PropsWithChildren) {
  const value = useMemo<NotificationContextValue>(
    () => ({
      success: (message, options) => toast.success(message, { ...baseOptions, ...options }),
      error: (message, options) => toast.error(message, { ...baseOptions, ...options }),
      info: (message, options) => toast(message, { icon: 'ℹ️', ...baseOptions, ...options }),
      promise: (promise, messages, options) =>
        toast.promise(promise, messages, {
          ...baseOptions,
          ...options
        }),
      dismiss: (toastId) => toast.dismiss(toastId)
    }),
    []
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          className: 'shadow-card',
          style: {
            background: 'rgba(15, 23, 42, 0.92)',
            color: '#E2E8F0',
            borderRadius: '16px',
            border: '1px solid rgba(148, 163, 184, 0.25)',
            backdropFilter: 'blur(16px)',
            fontFamily: 'Plus Jakarta Sans, system-ui, -apple-system'
          },
          success: {
            iconTheme: {
              primary: '#34d399',
              secondary: '#0f172a'
            }
          },
          error: {
            iconTheme: {
              primary: '#f87171',
              secondary: '#0f172a'
            }
          }
        }}
      />
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}

