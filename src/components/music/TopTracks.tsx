'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { BrutalCard } from '@/components/ui/BrutalCard';
import type { Track } from '@/types';
import styles from './TopTracks.module.css';

interface TopTracksProps {
  tracks: Track[];
  error: boolean;
}

export function TopTracks({ tracks, error }: TopTracksProps) {
  if (error) {
    return (
      <BrutalCard shadowSize="sm" className={styles.fallback}>
        <div className={styles.fallbackInner}>
          <span className={styles.fallbackEmoji}>🎵</span>
          <p className={styles.fallbackText}>
            Spotify is being shy right now. Check back in a bit.
          </p>
        </div>
      </BrutalCard>
    );
  }

  if (tracks.length === 0) {
    return (
      <p className={styles.empty}>
        nothing cached yet — check back soon.
      </p>
    );
  }

  return (
    <ol className={styles.trackList}>
      {tracks.map((track, i) => (
        <motion.li
          key={track.id}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: Math.min(i * 0.06, 0.4) }}
          style={{ listStyle: 'none' }}
        >
          <BrutalCard hover borderWidth={2} shadowSize="sm">
            <div className={styles.trackRow}>
              <span className={styles.trackNum}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className={styles.albumArtWrapper}>
                <Image
                  src={track.albumImageUrl}
                  alt={track.album}
                  width={56}
                  height={56}
                  className={styles.albumArt}
                />
              </div>
              <div className={styles.trackInfo}>
                <span className={styles.trackName}>{track.name}</span>
                <span className={styles.trackArtist}>
                  {track.artists.join(', ')}
                </span>
                <span className={styles.trackAlbum}>{track.album}</span>
              </div>
              <a
                href={track.spotifyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.spotifyLink}
                aria-label={`Open ${track.name} on Spotify`}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden
                >
                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                </svg>
                <span>open</span>
              </a>
            </div>
          </BrutalCard>
        </motion.li>
      ))}
    </ol>
  );
}
