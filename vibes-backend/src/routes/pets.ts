import { Router } from 'express';
import multer from 'multer';
import { desc, count } from 'drizzle-orm';
import { db } from '../db';
import { petUploads, myPets } from '../db/schema';
import { perIpLimit, petGlobalLimit } from '../middleware/rateLimit';
import { hashIP } from '../middleware/hashIp';
import { petUploadSchema } from '../lib/validation';
import { detectMime, uploadPetPhoto } from '../lib/cloudinary';

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// GET /api/pets/mine — Suprateeky's own pets
router.get('/mine', async (_req, res) => {
  const pets = await db
    .select()
    .from(myPets)
    .orderBy(myPets.displayOrder);
  res.json({ pets });
});

// GET /api/pets/gallery?page=1&limit=12
router.get('/gallery', async (req, res) => {
  const page = Math.max(
    1,
    parseInt(String(req.query.page ?? '1'), 10)
  );
  const limit = Math.min(
    24,
    Math.max(1, parseInt(String(req.query.limit ?? '12'), 10))
  );
  const offset = (page - 1) * limit;

  const [pets, totalResult] = await Promise.all([
    db
      .select({
        id: petUploads.id,
        pet_name: petUploads.petName,
        animal_type: petUploads.animalType,
        uploader_name: petUploads.uploaderName,
        cloudinary_url: petUploads.cloudinaryUrl,
        created_at: petUploads.createdAt,
      })
      .from(petUploads)
      .orderBy(desc(petUploads.createdAt))
      .limit(limit)
      .offset(offset),
    db.select({ count: count() }).from(petUploads),
  ]);

  const total = totalResult[0]?.count ?? 0;
  res.json({ pets, hasMore: offset + limit < total, total });
});

// POST /api/pets/upload — global + per-IP rate limited
router.post(
  '/upload',
  petGlobalLimit,
  perIpLimit('pet'),
  upload.single('file'),
  async (req, res): Promise<void> => {
    // Validate text fields
    const validation = petUploadSchema.safeParse({
      pet_name: req.body.pet_name,
      animal_type: req.body.animal_type,
      uploader_name: req.body.uploader_name,
    });

    if (!validation.success) {
      res.status(400).json({
        error: 'validation_error',
        message: validation.error.errors[0].message,
      });
      return;
    }

    if (!req.file) {
      res.status(400).json({
        error: 'validation_error',
        message: 'No file uploaded.',
      });
      return;
    }

    // MIME detection from buffer (not extension)
    const mimeType = detectMime(req.file.buffer);
    if (!mimeType) {
      res.status(400).json({
        error: 'validation_error',
        message: 'Only JPG, PNG, or WebP images are allowed.',
      });
      return;
    }

    const ip =
      (req.headers['x-forwarded-for'] as string)
        ?.split(',')[0]
        ?.trim() ??
      req.socket.remoteAddress ??
      'unknown';

    const { url, publicId } = await uploadPetPhoto(req.file.buffer, mimeType);

    await db.insert(petUploads).values({
      petName: validation.data.pet_name ?? null,
      animalType: validation.data.animal_type,
      uploaderName: validation.data.uploader_name,
      cloudinaryUrl: url,
      cloudinaryPublicId: publicId,
      ipHash: hashIP(ip),
    });

    res.status(201).json({
      success: true,
      message: 'Pet uploaded!',
      imageUrl: url,
    });
  }
);

export default router;
