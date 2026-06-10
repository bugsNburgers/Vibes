'use client';

import { useState } from 'react';
import { AnimeSearchDropdown } from './AnimeSearchDropdown';
import { BrutalButton } from '@/components/ui/BrutalButton';
import { FormField } from '@/components/ui/FormField';
import { submitAnimeRecommendation } from '@/lib/api';
import type { SelectedAnime } from '@/types';
import styles from './AnimeRecommendForm.module.css';

export function AnimeRecommendForm() {
  const [query, setQuery] = useState('');
  const [selectedAnime, setSelectedAnime] = useState<SelectedAnime | null>(null);
  const [reason, setReason] = useState('');
  const [submitterName, setSubmitterName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    'idle' | 'success' | 'error' | 'rate-limited'
  >('idle');
  const [errorMessage, setErrorMessage] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedAnime) {
      setErrorMessage('Please select an anime from the dropdown.');
      setSubmitStatus('error');
      return;
    }
    setIsSubmitting(true);
    setSubmitStatus('idle');

    const result = await submitAnimeRecommendation({
      mal_id: selectedAnime.mal_id,
      anime_title: selectedAnime.title,
      reason: reason || undefined,
      submitter_name: submitterName || undefined,
    });

    if (result.success) {
      setSubmitStatus('success');
      setSelectedAnime(null);
      setQuery('');
      setReason('');
      setSubmitterName('');
    } else if (result.status === 429) {
      setSubmitStatus('rate-limited');
    } else {
      setSubmitStatus('error');
      setErrorMessage(result.message || 'Something went wrong.');
    }
    setIsSubmitting(false);
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      {/* Anime search */}
      <div className={styles.fieldWrapper}>
        <label className={styles.label} htmlFor="rec-anime-search">
          Anime Name <span className={styles.required}>*</span>
        </label>
        {selectedAnime ? (
          <div className={styles.selected}>
            <span className={styles.selectedCheck}>✓</span>
            <span className={styles.selectedTitle}>{selectedAnime.title}</span>
            <button
              type="button"
              className={styles.clearBtn}
              onClick={() => {
                setSelectedAnime(null);
                setQuery('');
              }}
            >
              ✕
            </button>
          </div>
        ) : (
          <AnimeSearchDropdown
            inputValue={query}
            onInputChange={setQuery}
            onSelect={(a) => {
              setSelectedAnime(a);
              setQuery(a.title);
            }}
            inputId="rec-anime-search"
            placeholder="Search for an anime..."
          />
        )}
      </div>

      <FormField
        label="Why you think I'd like it"
        name="reason"
        type="textarea"
        rows={3}
        maxLength={300}
        hint="optional"
        value={reason}
        onChange={setReason}
        placeholder="one sentence or three, i'm not picky."
      />

      <FormField
        label="Your name or handle"
        name="submitter"
        type="text"
        placeholder="anonymous is fine"
        value={submitterName}
        onChange={setSubmitterName}
      />

      <BrutalButton
        type="submit"
        variant="primary"
        loading={isSubmitting}
        disabled={!selectedAnime}
      >
        send recommendation
      </BrutalButton>

      {submitStatus === 'success' && (
        <p className={styles.success}>Thanks! I&apos;ll check it out 🎬</p>
      )}
      {submitStatus === 'rate-limited' && (
        <p className={styles.rateLimited}>
          Easy — max 3 per day. Come back tomorrow!
        </p>
      )}
      {submitStatus === 'error' && (
        <p className={styles.error}>{errorMessage}</p>
      )}
    </form>
  );
}
