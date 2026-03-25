import styles from './styles.module.css';

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'frontend' | 'backend' | 'devops' | 'tools';
}

export function Badge({ children, className, variant = 'default' }: BadgeProps) {
  return (
    <span className={`${styles.badge} ${styles[variant]} ${className ?? ''}`}>
      {children}
    </span>
  );
}
