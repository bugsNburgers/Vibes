import { Suspense } from 'react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { AnimeList } from '@/components/anime/AnimeList';
import { AdminAddAnime } from '@/components/anime/AdminAddAnime';
import { AnimeRecommendForm } from '@/components/anime/AnimeRecommendForm';
import { RecentAnimeRecs } from '@/components/anime/RecentAnimeRecs';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { fetchMyAnimeList, fetchRecentAnimeRecs } from '@/lib/api';
import styles from './page.module.css';

export const metadata = {
  title: 'anime — vibes',
  description: "What Suprateeky has watched, and what you think he should watch next.",
};

export default async function AnimePage() {
  const [anime, recentRecs] = await Promise.all([
    fetchMyAnimeList(),
    fetchRecentAnimeRecs(),
  ]);

  return (
    <div className={styles.page}>
      <div className="container">
        <SectionHeader
          phase="01"
          title="anime"
          accentVar="--anime-accent"
          subtitle="a curated list, not an exhaustive one."
        />
        <AdminAddAnime />
        <Suspense fallback={<LoadingSkeleton variant="card" count={6} />}>
          <AnimeList initialAnime={anime} />
        </Suspense>

        <div className={styles.divider} />

        <SectionHeader
          phase="RECOMMEND"
          title="got one for me?"
          accentVar="--anime-accent"
          subtitle="use the search to find it. tell me why i'd like it."
        />
        <AnimeRecommendForm />
        <RecentAnimeRecs initialData={recentRecs} />
      </div>
    </div>
  );
}
