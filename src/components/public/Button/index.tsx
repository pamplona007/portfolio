import { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';
import styles from './styles.module.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, disabled, children, className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`${styles.btn} ${styles[variant]} ${styles[size]} ${loading ? styles.loading : ''} ${className ?? ''}`}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 size={16} className={styles.spinner} />}
        <span className={loading ? styles.hiddenText : ''}>{children}</span>
      </button>
    );
  }
);
Button.displayName = 'Button';
