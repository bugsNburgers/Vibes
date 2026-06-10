'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { BrutalCard } from '@/components/ui/BrutalCard';
import { BrutalBadge } from '@/components/ui/BrutalBadge';
import type { MyAnimeEntry } from '@/types';
import styles from './AnimeCard.module.css';

interface AnimeCardProps {
  anime: MyAnimeEntry;
  index: number;
  onDelete?: (id: number) => void;
  adminUnlocked: boolean;
}

export function AnimeCard({ anime, index, onDelete, adminUnlocked }: AnimeCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.08, 0.4) }}
    >
      <BrutalCard hover accentColor="hsl(var(--anime-accent))">
        <div className={styles.cardInner}>
          {anime.image_url && (
            <div className={styles.thumbWrapper}>
              <Image
                src={anime.image_url}
                alt={anime.title}
                width={60}
                height={84}
                className={styles.thumb}
                style={{ objectFit: 'cover', borderRadius: '2px' }}
              />
            </div>
          )}

          <div className={styles.body}>
            <div className={styles.titleRow}>
              <h3 className={styles.title}>{anime.title}</h3>
              <div className={styles.meta}>
                {anime.year && <span className={styles.year}>{anime.year}</span>}
                {anime.anime_type && (
                  <BrutalBadge variant="anime">{anime.anime_type}</BrutalBadge>
                )}
              </div>
            </div>

            {anime.title_japanese && anime.title_japanese !== anime.title && (
              <span className={styles.jp}>{anime.title_japanese}</span>
            )}

            <p className={styles.take}>"{anime.take}"</p>

            {anime.genres.length > 0 && (
              <div className={styles.genres}>
                {anime.genres.map((g) => (
                  <BrutalBadge key={g} variant="anime">{g}</BrutalBadge>
                ))}
              </div>
            )}
          </div>

          {adminUnlocked && onDelete && (
            <button
              className={styles.deleteBtn}
              onClick={() => onDelete(anime.id)}
              aria-label={`Remove ${anime.title} from list`}
            >
              ✕
            </button>
          )}
        </div>
      </BrutalCard>
    </motion.div>
  );
}
