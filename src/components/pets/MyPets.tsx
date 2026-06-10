import Image from 'next/image';
import { BrutalCard } from '@/components/ui/BrutalCard';
import { BrutalBadge } from '@/components/ui/BrutalBadge';
import { fetchMyPets } from '@/lib/api';
import styles from './MyPets.module.css';

export async function MyPets() {
  const pets = await fetchMyPets();

  if (pets.length === 0) return null;

  return (
    <div className={styles.grid}>
      {pets.map((pet) => (
        <BrutalCard
          key={pet.id}
          accentColor="hsl(var(--pets-accent))"
          tiltOnHover
        >
          <div className={styles.imageWrapper}>
            <Image
              src={pet.image_url}
              alt={pet.name}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className={styles.petImage}
              style={{ objectFit: 'cover' }}
            />
          </div>
          <div className={styles.petInfo}>
            <div className={styles.nameRow}>
              <h3 className={styles.petName}>{pet.name}</h3>
              <BrutalBadge variant="pets">{pet.animal_type}</BrutalBadge>
            </div>
            <p className={styles.personality}>{pet.personality}</p>
          </div>
        </BrutalCard>
      ))}
    </div>
  );
}
