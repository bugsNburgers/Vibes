'use client';

import { motion } from 'framer-motion';
import styles from './HeroSection.module.css';

export function HeroSection() {
  return (
    <section className={styles.hero}>
      <div className="container">
        <motion.div
          className={styles.content}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="phase-label">you found the human side</span>

          <h1 className={styles.heading}>
            not in the{' '}
            <span className="brutal-highlight">README</span>
            .
          </h1>

          <p className={styles.subtitle}>
            this is where the anime lists live, the spotify is on repeat,
            and strangers upload pictures of their cats.
            welcome to the unpolished corner.
          </p>

          <motion.div
            className={styles.scrollHint}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            <span className={styles.scrollLine} />
            <span className={styles.scrollText}>scroll</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
