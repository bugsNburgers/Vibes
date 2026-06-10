import { SectionHeader } from '@/components/ui/SectionHeader';
import { MyPets } from '@/components/pets/MyPets';
import { PetUploadForm } from '@/components/pets/PetUploadForm';
import { CommunityGallery } from '@/components/pets/CommunityGallery';
import { fetchPetsGallery } from '@/lib/api';
import styles from './page.module.css';

export const metadata = {
  title: 'pets — vibes',
  description: "My animals, your animals, and a collective appreciation for cats.",
};

export default async function PetsPage() {
  const { pets: initialPets, hasMore, total } = await fetchPetsGallery(1, 12);

  return (
    <div className={styles.page}>
      <div className="container">
        <SectionHeader
          phase="03"
          title="pets"
          accentVar="--pets-accent"
          subtitle="i love animals more than most things."
        />
        <p className={styles.intro}>
          Cats specifically have my whole heart — there&apos;s something about the way they
          exist on their own terms that I deeply respect. These are some of the creatures
          that have made the internet (and my life) better.
        </p>

        <MyPets />

        <div className={styles.divider} />

        <SectionHeader
          phase="UPLOAD"
          title="show me yours"
          accentVar="--pets-accent"
          subtitle="any animal. any size. strays welcome."
        />
        <PetUploadForm />

        <div className={styles.divider} />

        <SectionHeader
          phase="GALLERY"
          title="community gallery"
          accentVar="--pets-accent"
          subtitle={`${total} animal${total !== 1 ? 's' : ''} and counting.`}
        />
        <CommunityGallery initialData={{ pets: initialPets, hasMore, total }} />
      </div>
    </div>
  );
}
