import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import styles from './styles.module.css';

interface StatsCardProps {
  label: string;
  value: string | number;
  trend?: number; // percentage, positive = up
  icon?: React.ReactNode;
}

export function StatsCard({ label, value, trend, icon }: StatsCardProps) {
  const TrendIcon = trend === undefined || trend === 0 ? Minus : trend > 0 ? TrendingUp : TrendingDown;
  const trendClass = trend === undefined || trend === 0 ? styles.trendNeutral : trend > 0 ? styles.trendUp : styles.trendDown;

  return (
    <div className={styles.card}>
      <div className={styles.top}>
        <span className={styles.label}>{label}</span>
        {icon && <span className={styles.icon}>{icon}</span>}
      </div>
      <div className={styles.value}>{value}</div>
      {trend !== undefined && (
        <div className={`${styles.trend} ${trendClass}`}>
          <TrendIcon size={14} />
          <span>{Math.abs(trend)}%</span>
        </div>
      )}
    </div>
  );
}
