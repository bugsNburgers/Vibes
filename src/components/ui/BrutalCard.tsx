'use client';

import { motion } from 'framer-motion';
import styles from './BrutalCard.module.css';

interface BrutalCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  tiltOnHover?: boolean;
  shadowSize?: 'sm' | 'md' | 'lg' | 'xl';
  borderWidth?: 2 | 3;
  accentColor?: string;
}

export function BrutalCard({
  children,
  className = '',
  hover = false,
  tiltOnHover = false,
  shadowSize = 'md',
  borderWidth = 3,
  accentColor,
}: BrutalCardProps) {
  const shadowClass = {
    sm: styles.shadowSm,
    md: styles.shadowMd,
    lg: styles.shadowLg,
    xl: styles.shadowXl,
  }[shadowSize];

  const borderClass = borderWidth === 2 ? styles.border2 : styles.border3;

  const cardClasses = [
    styles.card,
    borderClass,
    shadowClass,
    hover ? styles.hover : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  if (tiltOnHover) {
    return (
      <motion.div
        className={cardClasses}
        whileHover={{ x: -2, y: -2, transition: { duration: 0.15 } }}
        whileTap={{ x: 1, y: 1, transition: { duration: 0.1 } }}
      >
        {accentColor && (
          <div className={styles.accentStrip} style={{ background: accentColor }} />
        )}
        {children}
      </motion.div>
    );
  }

  return (
    <div className={cardClasses}>
      {accentColor && (
        <div className={styles.accentStrip} style={{ background: accentColor }} />
      )}
      {children}
    </div>
  );
}
