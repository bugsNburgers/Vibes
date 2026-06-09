import styles from './BrutalBadge.module.css';

interface BrutalBadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'primary' | 'accent' | 'anime' | 'music' | 'pets';
  icon?: React.ReactNode;
}

export function BrutalBadge({
  children,
  className = '',
  variant = 'default',
  icon,
}: BrutalBadgeProps) {
  const classes = [styles.badge, styles[variant], className].filter(Boolean).join(' ');
  return (
    <span className={classes}>
      {icon && <span className={styles.icon}>{icon}</span>}
      {children}
    </span>
  );
}
