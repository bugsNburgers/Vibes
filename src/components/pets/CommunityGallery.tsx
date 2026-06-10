'use client';

import { useState, useEffect, useRef } from 'react';
import { PetCard } from './PetCard';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { fetchPetsGallery } from '@/lib/api';
import type { GalleryPet } from '@/types';
import styles from './CommunityGallery.module.css';

interface CommunityGalleryProps {
  initialData: { pets: GalleryPet[]; hasMore: boolean; total: number };
}

export function CommunityGallery({ initialData }: CommunityGalleryProps) {
  const [pets, setPets] = useState(initialData.pets);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialData.hasMore);
  const [isLoading, setIsLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sentinelRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasMore && !isLoading) {
          loadNext();
        }
      },
      { rootMargin: '200px' }
    );
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasMore, isLoading]);

  async function loadNext() {
    setIsLoading(true);
    const nextPage = page + 1;
    const { pets: next, hasMore: more } = await fetchPetsGallery(nextPage, 12);
    setPets((prev) => [...prev, ...next]);
    setPage(nextPage);
    setHasMore(more);
    setIsLoading(false);
  }

  if (pets.length === 0 && !isLoading) {
    return (
      <p className={styles.empty}>
        no pets yet. be the first to upload! 🐾
      </p>
    );
  }

  return (
    <div>
      <div className={styles.grid}>
        {pets.map((p) => (
          <PetCard key={p.id} pet={p} />
        ))}
        {isLoading && (
          <>
            <LoadingSkeleton variant="pet-card" />
            <LoadingSkeleton variant="pet-card" />
            <LoadingSkeleton variant="pet-card" />
          </>
        )}
      </div>
      <div ref={sentinelRef} style={{ height: 1 }} aria-hidden />
      {!hasMore && pets.length > 0 && (
        <p className={styles.endMessage}>you&apos;ve seen them all 🐾</p>
      )}
    </div>
  );
}
