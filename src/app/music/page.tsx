import { SectionHeader } from '@/components/ui/SectionHeader';
import { TopTracks } from '@/components/music/TopTracks';
import { MusicRecommendForm } from '@/components/music/MusicRecommendForm';
import { RecentMusicRecs } from '@/components/music/RecentMusicRecs';
import { fetchTopTracks, fetchRecentMusicRecs } from '@/lib/api';
import styles from './page.module.css';

export const metadata = {
  title: 'music — vibes',
  description: "What's been on repeat. Tell me what I'm missing.",
};

export default async function MusicPage() {
  const [{ tracks, error }, recentRecs] = await Promise.all([
    fetchTopTracks(),
    fetchRecentMusicRecs(),
  ]);

  return (
    <div className={styles.page}>
      <div className="container">
        <SectionHeader
          phase="02"
          title="music"
          accentVar="--music-accent"
          subtitle="medium_term top tracks. rotates as the mood shifts."
        />
        <TopTracks tracks={tracks} error={error} />

        <div className={styles.divider} />

        <SectionHeader
          phase="RECOMMEND"
          title="what am i missing?"
          accentVar="--music-accent"
          subtitle="paste a link. any platform."
        />
        <MusicRecommendForm />
        <RecentMusicRecs initialData={recentRecs} />
      </div>
    </div>
  );
}
