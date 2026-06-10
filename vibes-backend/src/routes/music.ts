import { Router } from 'express';
import { desc } from 'drizzle-orm';
import { db } from '../db';
import { musicRecommendations } from '../db/schema';
import { perIpLimit } from '../middleware/rateLimit';
import { hashIP } from '../middleware/hashIp';
import { musicRecommendationSchema, extractDomain } from '../lib/validation';
import { getTopTracks } from '../lib/spotify';

const router = Router();

// GET /api/music/top-tracks
router.get('/top-tracks', async (_req, res) => {
  try {
    const tracks = await getTopTracks();
    res.json({ tracks, error: false });
  } catch (err) {
    console.error('[spotify] error:', err);
    res.json({ tracks: [], error: true });
  }
});

// POST /api/music/recommend — rate limited per IP
router.post(
  '/recommend',
  perIpLimit('music'),
  async (req, res): Promise<void> => {
    const result = musicRecommendationSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({
        error: 'validation_error',
        message: result.error.errors[0].message,
      });
      return;
    }

    const ip =
      (req.headers['x-forwarded-for'] as string)
        ?.split(',')[0]
        ?.trim() ??
      req.socket.remoteAddress ??
      'unknown';

    await db.insert(musicRecommendations).values({
      trackUrl: result.data.track_url,
      urlDomain: extractDomain(result.data.track_url),
      note: result.data.note ?? null,
      submitterName: result.data.submitter_name ?? null,
      ipHash: hashIP(ip),
    });

    res.status(201).json({ success: true, message: 'Recommendation saved!' });
  }
);

// GET /api/music/recent
router.get('/recent', async (_req, res) => {
  const data = await db
    .select({
      id: musicRecommendations.id,
      track_url: musicRecommendations.trackUrl,
      url_domain: musicRecommendations.urlDomain,
      note: musicRecommendations.note,
      submitter_name: musicRecommendations.submitterName,
      created_at: musicRecommendations.createdAt,
    })
    .from(musicRecommendations)
    .orderBy(desc(musicRecommendations.createdAt))
    .limit(10);

  res.json({ data });
});

export default router;
