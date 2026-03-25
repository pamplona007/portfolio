import * as ToastPrimitive from '@radix-ui/react-toast';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';
import styles from './styles.module.css';

interface ToastProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  variant?: 'success' | 'error' | 'info';
}

const icons = {
  success: CheckCircle,
  error: XCircle,
  info: Info,
};

export function Toast({ open, onOpenChange, title, description, variant = 'info' }: ToastProps) {
  const Icon = icons[variant];

  return (
    <ToastPrimitive.Root
      className={`${styles.toast} ${styles[variant]}`}
      open={open}
      onOpenChange={onOpenChange}
    >
      <div className={styles.iconWrapper}>
        <Icon size={18} />
      </div>
      <div className={styles.content}>
        <ToastPrimitive.Title className={styles.title}>{title}</ToastPrimitive.Title>
        {description && (
          <ToastPrimitive.Description className={styles.description}>{description}</ToastPrimitive.Description>
        )}
      </div>
      <ToastPrimitive.Close className={styles.close}>
        <X size={14} />
      </ToastPrimitive.Close>
    </ToastPrimitive.Root>
  );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  return (
    <ToastPrimitive.Provider swipeDirection="right">
      {children}
      <ToastPrimitive.Viewport className={styles.viewport} />
    </ToastPrimitive.Provider>
  );
}
