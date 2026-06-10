import Image from 'next/image';
import { BrutalCard } from '@/components/ui/BrutalCard';
import { BrutalBadge } from '@/components/ui/BrutalBadge';
import { formatRelativeTime } from '@/lib/utils';
import type { GalleryPet } from '@/types';
import styles from './PetCard.module.css';

interface PetCardProps {
  pet: GalleryPet;
}

export function PetCard({ pet }: PetCardProps) {
  return (
    <BrutalCard hover borderWidth={2} shadowSize="sm">
      <div className={styles.imageWrapper}>
        <Image
          src={pet.cloudinary_url}
          alt={pet.pet_name || pet.animal_type}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className={styles.image}
          style={{ objectFit: 'cover' }}
        />
      </div>
      <div className={styles.info}>
        <div className={styles.nameRow}>
          <h3 className={styles.name}>{pet.pet_name || 'Stray'}</h3>
          <BrutalBadge variant="pets">{pet.animal_type}</BrutalBadge>
        </div>
        <div className={styles.meta}>
          <span className={styles.uploader}>
            by {pet.uploader_name}
          </span>
          <time className={styles.time}>
            {formatRelativeTime(pet.created_at)}
          </time>
        </div>
      </div>
    </BrutalCard>
  );
}
