import { Router } from 'express';
import { eq, desc } from 'drizzle-orm';
import { db } from '../db';
import { myAnime, animeRecommendations } from '../db/schema';
import { validateAdmin } from '../middleware/validateAdmin';
import { perIpLimit } from '../middleware/rateLimit';
import { hashIP } from '../middleware/hashIp';
import { addMyAnimeSchema, animeRecommendationSchema } from '../lib/validation';

const router = Router();

// GET /api/anime/list
router.get('/list', async (_req, res) => {
  const anime = await db
    .select()
    .from(myAnime)
    .orderBy(desc(myAnime.createdAt));
  res.json({ anime });
});

// POST /api/anime/list — admin only
router.post('/list', validateAdmin, async (req, res): Promise<void> => {
  const result = addMyAnimeSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({
      error: 'validation_error',
      message: result.error.errors[0].message,
    });
    return;
  }

  const d = result.data;

  // Duplicate check
  const existing = await db
    .select({ id: myAnime.id })
    .from(myAnime)
    .where(eq(myAnime.malId, d.mal_id))
    .limit(1);

  if (existing.length > 0) {
    res.status(409).json({
      error: 'duplicate',
      message: 'Already in your list.',
    });
    return;
  }

  const [inserted] = await db
    .insert(myAnime)
    .values({
      malId: d.mal_id,
      title: d.title,
      titleJapanese: d.title_japanese ?? null,
      imageUrl: d.image_url ?? null,
      animeType: d.anime_type ?? null,
      year: d.year ?? null,
      take: d.take,
      genres: d.genres,
    })
    .returning();

  res.status(201).json({ success: true, anime: inserted });
});

// DELETE /api/anime/list/:id — admin only
router.delete('/list/:id', validateAdmin, async (req, res): Promise<void> => {
  const id = parseInt(req.params.id as string, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: 'invalid_id' });
    return;
  }
  await db.delete(myAnime).where(eq(myAnime.id, id));
  res.json({ success: true });
});

// POST /api/anime/recommend — rate limited per IP
router.post(
  '/recommend',
  perIpLimit('anime'),
  async (req, res): Promise<void> => {
    const result = animeRecommendationSchema.safeParse(req.body);
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

    await db.insert(animeRecommendations).values({
      malId: result.data.mal_id,
      animeTitle: result.data.anime_title,
      reason: result.data.reason ?? null,
      submitterName: result.data.submitter_name ?? null,
      ipHash: hashIP(ip),
    });

    res.status(201).json({ success: true, message: 'Recommendation saved!' });
  }
);

// GET /api/anime/recent
router.get('/recent', async (_req, res) => {
  const data = await db
    .select({
      id: animeRecommendations.id,
      anime_title: animeRecommendations.animeTitle,
      reason: animeRecommendations.reason,
      submitter_name: animeRecommendations.submitterName,
      created_at: animeRecommendations.createdAt,
    })
    .from(animeRecommendations)
    .orderBy(desc(animeRecommendations.createdAt))
    .limit(10);

  res.json({ data });
});

export default router;
