import {
  pgTable,
  serial,
  integer,
  varchar,
  text,
  timestamp,
  index,
} from 'drizzle-orm/pg-core';

// ─── Suprateeky's watched anime list ─────────────────────────────────────────
export const myAnime = pgTable(
  'my_anime',
  {
    id: serial('id').primaryKey(),
    malId: integer('mal_id').notNull().unique(),
    title: varchar('title', { length: 500 }).notNull(),
    titleJapanese: varchar('title_japanese', { length: 500 }),
    imageUrl: varchar('image_url', { length: 1000 }),
    animeType: varchar('anime_type', { length: 50 }),
    year: integer('year'),
    take: text('take').notNull(),
    genres: text('genres').array().notNull().default([]),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => ({ malIdx: index('my_anime_mal_idx').on(t.malId) })
);

// ─── Community anime recommendations ─────────────────────────────────────────
export const animeRecommendations = pgTable(
  'anime_recommendations',
  {
    id: serial('id').primaryKey(),
    malId: integer('mal_id').notNull(),
    animeTitle: varchar('anime_title', { length: 500 }).notNull(),
    reason: text('reason'),
    submitterName: varchar('submitter_name', { length: 100 }),
    ipHash: varchar('ip_hash', { length: 64 }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => ({
    createdIdx: index('anime_rec_created_idx').on(t.createdAt),
  })
);

// ─── Community music recommendations ─────────────────────────────────────────
export const musicRecommendations = pgTable(
  'music_recommendations',
  {
    id: serial('id').primaryKey(),
    trackUrl: varchar('track_url', { length: 2000 }).notNull(),
    urlDomain: varchar('url_domain', { length: 100 }).notNull(),
    note: text('note'),
    submitterName: varchar('submitter_name', { length: 100 }),
    ipHash: varchar('ip_hash', { length: 64 }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => ({
    createdIdx: index('music_rec_created_idx').on(t.createdAt),
  })
);

// ─── Community pet uploads ────────────────────────────────────────────────────
export const petUploads = pgTable(
  'pet_uploads',
  {
    id: serial('id').primaryKey(),
    petName: varchar('pet_name', { length: 100 }),
    animalType: varchar('animal_type', { length: 30 }).notNull(),
    uploaderName: varchar('uploader_name', { length: 100 }).notNull(),
    cloudinaryUrl: varchar('cloudinary_url', { length: 2000 }).notNull(),
    cloudinaryPublicId: varchar('cloudinary_public_id', {
      length: 500,
    }).notNull(),
    ipHash: varchar('ip_hash', { length: 64 }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => ({
    createdIdx: index('pet_uploads_created_idx').on(t.createdAt),
  })
);

// ─── Suprateeky's own pets ────────────────────────────────────────────────────
export const myPets = pgTable('my_pets', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  animalType: varchar('animal_type', { length: 50 }).notNull(),
  personality: text('personality').notNull(),
  imageUrl: varchar('image_url', { length: 2000 }).notNull(),
  displayOrder: integer('display_order').notNull().default(0),
});
