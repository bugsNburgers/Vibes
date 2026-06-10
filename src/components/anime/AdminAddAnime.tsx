'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AnimeSearchDropdown } from './AnimeSearchDropdown';
import { BrutalButton } from '@/components/ui/BrutalButton';
import { FormField } from '@/components/ui/FormField';
import { addToMyAnime } from '@/lib/api';
import type { SelectedAnime } from '@/types';
import styles from './AdminAddAnime.module.css';

export function AdminAddAnime() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [isLocked, setIsLocked] = useState(true);
  const [secretInput, setSecretInput] = useState('');
  const [enteredSecret, setEnteredSecret] = useState('');

  // Search state
  const [query, setQuery] = useState('');
  const [selectedAnime, setSelectedAnime] = useState<SelectedAnime | null>(null);
  const [take, setTake] = useState('');
  const [genres, setGenres] = useState<string[]>([]);
  const [newGenre, setNewGenre] = useState('');

  // Submit state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    'idle' | 'success' | 'error' | 'duplicate'
  >('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // On mount — restore secret from sessionStorage
  useEffect(() => {
    const stored = sessionStorage.getItem('vibes_admin');
    if (stored) {
      setEnteredSecret(stored);
      setIsLocked(false);
    }
  }, []);

  function unlock() {
    if (!secretInput.trim()) return;
    sessionStorage.setItem('vibes_admin', secretInput);
    setEnteredSecret(secretInput);
    setIsLocked(false);
    setIsVisible(true);
  }

  function lock() {
    sessionStorage.removeItem('vibes_admin');
    setEnteredSecret('');
    setIsLocked(true);
    setIsVisible(false);
  }

  function addGenre() {
    const g = newGenre.trim();
    if (g && !genres.includes(g)) setGenres((prev) => [...prev, g]);
    setNewGenre('');
  }

  function removeGenre(g: string) {
    setGenres((prev) => prev.filter((x) => x !== g));
  }

  async function handleAdd() {
    if (!selectedAnime || !take.trim()) return;
    setIsSubmitting(true);
    setSubmitStatus('idle');

    const result = await addToMyAnime(
      {
        mal_id: selectedAnime.mal_id,
        title: selectedAnime.title,
        title_japanese: selectedAnime.title_japanese,
        image_url: selectedAnime.image,
        anime_type: selectedAnime.type,
        year: selectedAnime.year,
        take: take.trim(),
        genres,
      },
      enteredSecret
    );

    if (result.success) {
      setSubmitStatus('success');
      setSelectedAnime(null);
      setTake('');
      setQuery('');
      setGenres([]);
      router.refresh();
    } else if (result.error?.includes('409') || result.error?.includes('already')) {
      setSubmitStatus('duplicate');
    } else {
      setSubmitStatus('error');
      setErrorMessage(result.error ?? 'Something went wrong.');
    }
    setIsSubmitting(false);
  }

  return (
    <div className={styles.container}>
      {/* Lock/unlock toggle */}
      {isLocked ? (
        <div className={styles.lockRow}>
          <button
            className={styles.lockBtn}
            onClick={() => setIsVisible((v) => !v)}
          >
            🔑 admin mode
          </button>
        </div>
      ) : (
        <button className={styles.lockBtn} onClick={lock}>
          🔒 lock admin
        </button>
      )}

      {/* Unlock form */}
      {isLocked && isVisible && (
        <div className={styles.unlockForm}>
          <FormField
            label="Admin secret"
            name="admin-secret"
            type="text"
            placeholder="enter secret..."
            value={secretInput}
            onChange={setSecretInput}
          />
          <div className={styles.unlockActions}>
            <BrutalButton size="sm" variant="primary" onClick={unlock}>
              Unlock
            </BrutalButton>
            <BrutalButton
              size="sm"
              variant="ghost"
              onClick={() => setIsVisible(false)}
            >
              Cancel
            </BrutalButton>
          </div>
        </div>
      )}

      {/* Admin panel — unlocked */}
      {!isLocked && (
        <div className={styles.adminPanel}>
          <div className={styles.adminHeader}>
            <span className={styles.adminBadge}>🔑 admin mode</span>
          </div>

          <div className={styles.searchRow}>
            <label className={styles.searchLabel}>Search anime to add</label>
            <AnimeSearchDropdown
              inputValue={query}
              onInputChange={setQuery}
              onSelect={(a) => {
                setSelectedAnime(a);
                setQuery(a.title);
                // pre-fill genres from type
                if (a.type && !genres.includes(a.type)) {
                  setGenres([a.type]);
                }
              }}
              inputId="admin-anime-search"
              placeholder="Type to search Jikan..."
            />
          </div>

          {selectedAnime && (
            <div className={styles.addForm}>
              <div className={styles.selectedPreview}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selectedAnime.image}
                  alt={selectedAnime.title}
                  className={styles.previewThumb}
                />
                <div>
                  <p className={styles.previewTitle}>{selectedAnime.title}</p>
                  <p className={styles.previewMeta}>
                    {selectedAnime.year ?? '?'} · {selectedAnime.type}
                  </p>
                </div>
                <button
                  className={styles.clearBtn}
                  onClick={() => {
                    setSelectedAnime(null);
                    setQuery('');
                    setGenres([]);
                  }}
                >
                  ✕
                </button>
              </div>

              <FormField
                label="Your take *"
                name="take"
                type="textarea"
                rows={2}
                placeholder="your one-liner on this anime..."
                value={take}
                onChange={setTake}
                maxLength={500}
              />

              <div className={styles.genreEditor}>
                <label className={styles.searchLabel}>Genres</label>
                <div className={styles.genreTags}>
                  {genres.map((g) => (
                    <span key={g} className={styles.genreTag}>
                      {g}
                      <button onClick={() => removeGenre(g)}>✕</button>
                    </span>
                  ))}
                  <input
                    className={styles.genreInput}
                    placeholder="add genre..."
                    value={newGenre}
                    onChange={(e) => setNewGenre(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addGenre();
                      }
                    }}
                  />
                </div>
              </div>

              <BrutalButton
                variant="primary"
                loading={isSubmitting}
                onClick={handleAdd}
                disabled={!take.trim()}
              >
                Add to My List
              </BrutalButton>

              {submitStatus === 'success' && (
                <p className={styles.success}>Added! ✓</p>
              )}
              {submitStatus === 'duplicate' && (
                <p className={styles.error}>Already in your list!</p>
              )}
              {submitStatus === 'error' && (
                <p className={styles.error}>{errorMessage}</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
