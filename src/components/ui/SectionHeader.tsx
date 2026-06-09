import { motion } from 'framer-motion';
import styles from './SectionHeader.module.css';

interface SectionHeaderProps {
  phase: string;
  title: string;
  subtitle?: string;
  accentVar?: string;
  align?: 'left' | 'center';
}

export function SectionHeader({
  phase,
  title,
  subtitle,
  accentVar = '--primary',
  align = 'left',
}: SectionHeaderProps) {
  return (
    <motion.div
      className={`${styles.wrapper} ${align === 'center' ? styles.center : ''}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      <div className={styles.phaseRow}>
        <span
          className={styles.phaseLine}
          style={{ background: `hsl(var(${accentVar}))` }}
        />
        <span className={styles.phaseText}>{phase}</span>
      </div>
      <h2 className={styles.title}>{title}</h2>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
    </motion.div>
  );
}
