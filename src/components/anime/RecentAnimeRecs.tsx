'use client';

import { motion } from 'framer-motion';
import { BrutalCard } from '@/components/ui/BrutalCard';
import { formatRelativeTime } from '@/lib/utils';
import type { AnimeRecommendation } from '@/types';
import styles from './RecentAnimeRecs.module.css';

interface RecentAnimeRecsProps {
  initialData: AnimeRecommendation[];
}

export function RecentAnimeRecs({ initialData }: RecentAnimeRecsProps) {
  if (initialData.length === 0) {
    return (
      <p className={styles.empty}>
        no recommendations yet. be the first!
      </p>
    );
  }

  return (
    <div className={styles.feed}>
      <h3 className={styles.feedTitle}>recent recommendations</h3>
      <div className={styles.list}>
        {initialData.map((rec, i) => (
          <motion.div
            key={rec.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: i * 0.06 }}
          >
            <BrutalCard borderWidth={2} shadowSize="sm">
              <div className={styles.recItem}>
                <div className={styles.recHeader}>
                  <span className={styles.animeTitle}>{rec.anime_title}</span>
                  <time className={styles.time}>
                    {formatRelativeTime(rec.created_at)}
                  </time>
                </div>
                {rec.reason && (
                  <p className={styles.reason}>
                    &ldquo;{rec.reason}&rdquo;
                  </p>
                )}
                <span className={styles.submitter}>
                  — {rec.submitter_name || 'anonymous'}
                </span>
              </div>
            </BrutalCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
