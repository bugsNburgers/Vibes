import { z } from 'zod';

// ─── Anime ────────────────────────────────────────────────────────────────────

export const addMyAnimeSchema = z.object({
  mal_id: z.number().int().positive(),
  title: z.string().min(1).max(500),
  title_japanese: z.string().max(500).nullable().optional(),
  image_url: z.string().url().max(1000).nullable().optional(),
  anime_type: z.string().max(50).nullable().optional(),
  year: z.number().int().min(1900).max(2100).nullable().optional(),
  take: z.string().min(1).max(500),
  genres: z.array(z.string().max(50)).default([]),
});

export const animeRecommendationSchema = z.object({
  mal_id: z.number().int().positive(),
  anime_title: z.string().min(1).max(500),
  reason: z.string().max(300).optional(),
  submitter_name: z.string().max(100).optional(),
});

// ─── Music ────────────────────────────────────────────────────────────────────

const MUSIC_DOMAIN_REGEX =
  /^https?:\/\/(open\.)?spotify\.com\//i;
const YTM_REGEX = /^https?:\/\/music\.youtube\.com\//i;
const APPLE_REGEX = /^https?:\/\/music\.apple\.com\//i;

export const musicRecommendationSchema = z.object({
  track_url: z
    .string()
    .url()
    .max(2000)
    .refine(
      (url) =>
        MUSIC_DOMAIN_REGEX.test(url) ||
        YTM_REGEX.test(url) ||
        APPLE_REGEX.test(url),
      {
        message:
          'Must be a Spotify, YouTube Music, or Apple Music link.',
      }
    ),
  note: z.string().max(200).optional(),
  submitter_name: z.string().max(100).optional(),
});

export function extractDomain(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

// ─── Pets ─────────────────────────────────────────────────────────────────────

export const petUploadSchema = z.object({
  pet_name: z.string().max(100).optional(),
  animal_type: z
    .string()
    .min(1)
    .max(30)
    .refine(
      (v) =>
        [
          'cat', 'dog', 'bird', 'rabbit', 'hamster',
          'fish', 'reptile', 'other',
        ].includes(v),
      { message: 'Invalid animal type.' }
    ),
  uploader_name: z.string().min(1).max(100),
});
