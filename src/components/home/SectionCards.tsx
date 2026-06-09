'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { BrutalCard } from '@/components/ui/BrutalCard';
import styles from './SectionCards.module.css';

const sections = [
  {
    href: '/anime',
    accentVar: '--anime-accent',
    emoji: '📺',
    label: 'SECTION 01',
    title: 'anime',
    description: "what i've watched. a search bar that tells you what to watch next.",
  },
  {
    href: '/music',
    accentVar: '--music-accent',
    emoji: '🎵',
    label: 'SECTION 02',
    title: 'music',
    description: "what's been on repeat, and your hot takes on what i'm missing.",
  },
  {
    href: '/pets',
    accentVar: '--pets-accent',
    emoji: '🐱',
    label: 'SECTION 03',
    title: 'pets',
    description: 'my animals, your animals, and a collective appreciation for cats.',
  },
];

export function SectionCards() {
  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.grid}>
          {sections.map((s, i) => (
            <motion.div
              key={s.href}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.12 }}
            >
              <Link href={s.href} className={styles.cardLink}>
                <BrutalCard
                  tiltOnHover
                  accentColor={`hsl(var(${s.accentVar}))`}
                  className={styles.card}
                >
                  <div className={styles.cardBody}>
                    <span className={styles.emoji}>{s.emoji}</span>
                    <span className={styles.label}>{s.label}</span>
                    <h2 className={styles.title}>{s.title}</h2>
                    <p className={styles.description}>{s.description}</p>
                    <span className={styles.arrow}>→</span>
                  </div>
                </BrutalCard>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
