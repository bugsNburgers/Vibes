'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AnimeCard } from './AnimeCard';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { removeFromMyAnime } from '@/lib/api';
import type { MyAnimeEntry } from '@/types';
import styles from './AnimeList.module.css';

interface AnimeListProps {
  initialAnime: MyAnimeEntry[];
}

export function AnimeList({ initialAnime }: AnimeListProps) {
  const router = useRouter();
  const [anime, setAnime] = useState(initialAnime);
  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    const secret = sessionStorage.getItem('vibes_admin');
    setAdminUnlocked(!!secret);
  }, []);

  // Keep in sync if SSR data refreshes
  useEffect(() => {
    setAnime(initialAnime);
  }, [initialAnime]);

  async function handleDelete(id: number) {
    const secret = sessionStorage.getItem('vibes_admin') ?? '';
    setDeletingId(id);
    const { success } = await removeFromMyAnime(id, secret);
    if (success) {
      setAnime((prev) => prev.filter((a) => a.id !== id));
      router.refresh();
    }
    setDeletingId(null);
  }

  if (anime.length === 0) {
    return (
      <p className={styles.empty}>
        nothing here yet — check back soon.
      </p>
    );
  }

  return (
    <div className={styles.grid}>
      {anime.map((a, i) => (
        deletingId === a.id ? (
          <LoadingSkeleton key={a.id} variant="card" />
        ) : (
          <AnimeCard
            key={a.id}
            anime={a}
            index={i}
            adminUnlocked={adminUnlocked}
            onDelete={handleDelete}
          />
        )
      ))}
    </div>
  );
}
