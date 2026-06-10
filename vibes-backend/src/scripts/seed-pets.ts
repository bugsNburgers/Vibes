import 'dotenv/config';
import { db } from '../db';
import { myPets } from '../db/schema';

// Replace image_url values with your own pet photos uploaded to Cloudinary
const seedData = [
  {
    name: 'Luna',
    animalType: 'cat',
    personality:
      'Thinks she runs the house. She does. Expert at judging your life choices from the top of the bookshelf.',
    imageUrl:
      'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&h=600&fit=crop',
    displayOrder: 0,
  },
  {
    name: 'Miso',
    animalType: 'cat',
    personality:
      'The friendliest creature alive. Will sit on your laptop during important meetings. No regrets.',
    imageUrl:
      'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=600&h=600&fit=crop',
    displayOrder: 1,
  },
  {
    name: 'Biscuit',
    animalType: 'dog',
    personality:
      "Thinks every human exists solely to give belly rubs. He's not wrong.",
    imageUrl:
      'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&h=600&fit=crop',
    displayOrder: 2,
  },
];

async function main() {
  console.log('Seeding my_pets...');
  await db.insert(myPets).values(seedData).onConflictDoNothing();
  console.log('Done! 🐾');
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
