// ─── Jikan API ───
export interface JikanAnimeResult {
  mal_id: number;
  title: string;
  title_english: string | null;
  title_japanese: string | null;
  type: string;
  year: number | null;
  aired: { prop: { from: { year: number | null } } } | null;
  images: { jpg: { small_image_url: string; image_url: string } };
}

export interface AnimeSearchResult {
  mal_id: number;
  title: string;
  title_japanese: string | null;
  year: number | null;
  type: string;
  image: string;
}

export interface SelectedAnime {
  mal_id: number;
  title: string;
  title_japanese: string | null;
  type: string;
  year: number | null;
  image: string;
}

// ─── DB row types (frontend-safe, no IP hash) ───
export interface AnimeRecommendation {
  id: number;
  anime_title: string;
  reason: string | null;
  submitter_name: string | null;
  created_at: string;
}

export interface MusicRecommendation {
  id: number;
  track_url: string;
  url_domain: string;
  note: string | null;
  submitter_name: string | null;
  created_at: string;
}

export interface GalleryPet {
  id: number;
  pet_name: string | null;
  animal_type: string;
  uploader_name: string;
  cloudinary_url: string;
  created_at: string;
}

// ─── Spotify ───
export interface Track {
  id: string;
  name: string;
  artists: string[];
  album: string;
  albumImageUrl: string;
  spotifyUrl: string;
}

// ─── My Anime (from backend) ───
export interface MyAnimeEntry {
  id: number;
  mal_id: number;
  title: string;
  title_japanese: string | null;
  image_url: string | null;
  anime_type: string | null;
  year: number | null;
  take: string;
  genres: string[];
  created_at: string;
}

// ─── My Pets (from backend) ───
export interface MyPet {
  id: number;
  name: string;
  animal_type: string;
  personality: string;
  image_url: string;
  display_order: number;
}
