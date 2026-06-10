'use client';

import { motion } from 'framer-motion';
import { BrutalCard } from '@/components/ui/BrutalCard';
import { formatRelativeTime } from '@/lib/utils';
import type { MusicRecommendation } from '@/types';
import styles from './RecentMusicRecs.module.css';

interface RecentMusicRecsProps {
  initialData: MusicRecommendation[];
}

function getDomainLabel(domain: string): string {
  if (domain.includes('spotify')) return '🎵 Spotify';
  if (domain.includes('youtube')) return '▶ YouTube Music';
  if (domain.includes('apple')) return '🍎 Apple Music';
  return domain;
}

export function RecentMusicRecs({ initialData }: RecentMusicRecsProps) {
  if (initialData.length === 0) {
    return (
      <p className={styles.empty}>no music recs yet. drop one above!</p>
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
                  <a
                    href={rec.track_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.trackLink}
                  >
                    <span className={styles.platform}>
                      {getDomainLabel(rec.url_domain)}
                    </span>
                    <span className={styles.linkIcon}>↗</span>
                  </a>
                  <time className={styles.time}>
                    {formatRelativeTime(rec.created_at)}
                  </time>
                </div>
                {rec.note && (
                  <p className={styles.note}>&ldquo;{rec.note}&rdquo;</p>
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
