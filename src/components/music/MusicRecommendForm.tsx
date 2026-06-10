'use client';

import { useState } from 'react';
import { BrutalButton } from '@/components/ui/BrutalButton';
import { FormField } from '@/components/ui/FormField';
import { submitMusicRec } from '@/lib/api';
import styles from './MusicRecommendForm.module.css';

const VALID_DOMAINS = [
  /^https?:\/\/(open\.)?spotify\.com\//,
  /^https?:\/\/music\.youtube\.com\//,
  /^https?:\/\/music\.apple\.com\//,
];

function isValidMusicUrl(url: string): boolean {
  return VALID_DOMAINS.some((r) => r.test(url));
}

export function MusicRecommendForm() {
  const [trackUrl, setTrackUrl] = useState('');
  const [note, setNote] = useState('');
  const [submitterName, setSubmitterName] = useState('');
  const [urlError, setUrlError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    'idle' | 'success' | 'error' | 'rate-limited'
  >('idle');
  const [errorMessage, setErrorMessage] = useState('');

  function validateUrl(url: string) {
    if (!url) { setUrlError(''); return true; }
    if (!isValidMusicUrl(url)) {
      setUrlError('Must be a Spotify, YouTube Music, or Apple Music link.');
      return false;
    }
    setUrlError('');
    return true;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!trackUrl || !validateUrl(trackUrl)) return;
    setIsSubmitting(true);
    setSubmitStatus('idle');

    const result = await submitMusicRec({
      track_url: trackUrl,
      note: note || undefined,
      submitter_name: submitterName || undefined,
    });

    if (result.success) {
      setSubmitStatus('success');
      setTrackUrl('');
      setNote('');
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
      <FormField
        label="Track link *"
        name="track-url"
        type="url"
        placeholder="https://open.spotify.com/track/..."
        required
        value={trackUrl}
        onChange={(v) => { setTrackUrl(v); if (v) validateUrl(v); }}
        error={urlError}
        hint="open.spotify.com · music.youtube.com · music.apple.com"
      />

      <FormField
        label="Why I should listen"
        name="note"
        type="textarea"
        rows={2}
        maxLength={200}
        hint="optional"
        value={note}
        onChange={setNote}
        placeholder="one sentence is enough."
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
        disabled={!trackUrl || !!urlError}
      >
        send it
      </BrutalButton>

      {submitStatus === 'success' && (
        <p className={styles.success}>Added to the queue 🎵</p>
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
