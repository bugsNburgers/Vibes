import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
  secure: true,
});

// Magic bytes for MIME detection (no relying on file extension)
const MAGIC: Record<string, string> = {
  'ffd8ff':             'image/jpeg',
  '89504e47':           'image/png',
  '52494646':           'image/webp', // RIFF....WEBP
};

export function detectMime(buffer: Buffer): string | null {
  const hex4 = buffer.slice(0, 4).toString('hex').toLowerCase();
  const hex3 = hex4.slice(0, 6);

  if (MAGIC[hex3]) return MAGIC[hex3];
  if (MAGIC[hex4]) return MAGIC[hex4];

  // WebP: check for WEBP signature at bytes 8-11
  if (
    buffer.length >= 12 &&
    buffer.slice(8, 12).toString('ascii') === 'WEBP'
  ) {
    return 'image/webp';
  }

  return null;
}

export async function uploadPetPhoto(
  buffer: Buffer,
  mimeType: string
): Promise<{ url: string; publicId: string }> {
  const b64 = buffer.toString('base64');
  const dataUri = `data:${mimeType};base64,${b64}`;

  const result = await cloudinary.uploader.upload(dataUri, {
    folder: 'vibes/pets',
    transformation: [
      { width: 800, height: 800, crop: 'limit', quality: 'auto:good' },
    ],
    resource_type: 'image',
  });

  return { url: result.secure_url, publicId: result.public_id };
}
