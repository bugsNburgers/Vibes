import type {
  MyAnimeEntry,
  AnimeRecommendation,
  Track,
  MusicRecommendation,
  GalleryPet,
  MyPet,
} from '@/types';

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL!;

// ─── ANIME ────────────────────────────────────────────────────────────────────

export async function fetchMyAnimeList(): Promise<MyAnimeEntry[]> {
  try {
    const res = await fetch(`${BACKEND}/api/anime/list`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.anime ?? [];
  } catch {
    return [];
  }
}

export async function addToMyAnime(
  anime: Omit<MyAnimeEntry, 'id' | 'created_at'>,
  adminSecret: string
): Promise<{ success: boolean; error?: string }> {
  const res = await fetch(`${BACKEND}/api/anime/list`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-secret': adminSecret,
    },
    body: JSON.stringify(anime),
  });
  const data = await res.json();
  if (!res.ok) {
    return { success: false, error: `${res.status}: ${data.message ?? 'error'}` };
  }
  return { success: true };
}

export async function removeFromMyAnime(
  id: number,
  adminSecret: string
): Promise<{ success: boolean }> {
  const res = await fetch(`${BACKEND}/api/anime/list/${id}`, {
    method: 'DELETE',
    headers: { 'x-admin-secret': adminSecret },
  });
  return { success: res.ok };
}

export async function submitAnimeRecommendation(body: {
  mal_id: number;
  anime_title: string;
  reason?: string;
  submitter_name?: string;
}): Promise<{ success: boolean; status: number; message: string }> {
  const res = await fetch(`${BACKEND}/api/anime/recommend`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return { success: res.ok, status: res.status, message: data.message ?? '' };
}

export async function fetchRecentAnimeRecs(): Promise<AnimeRecommendation[]> {
  try {
    const res = await fetch(`${BACKEND}/api/anime/recent`, {
      next: { revalidate: 30 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data ?? [];
  } catch {
    return [];
  }
}

// ─── MUSIC ────────────────────────────────────────────────────────────────────

export async function fetchTopTracks(): Promise<{
  tracks: Track[];
  error: boolean;
}> {
  try {
    const res = await fetch(`${BACKEND}/api/music/top-tracks`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return { tracks: [], error: true };
    const data = await res.json();
    return { tracks: data.tracks ?? [], error: data.error ?? false };
  } catch {
    return { tracks: [], error: true };
  }
}

export async function submitMusicRec(body: {
  track_url: string;
  note?: string;
  submitter_name?: string;
}): Promise<{ success: boolean; status: number; message: string }> {
  const res = await fetch(`${BACKEND}/api/music/recommend`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return { success: res.ok, status: res.status, message: data.message ?? '' };
}

export async function fetchRecentMusicRecs(): Promise<MusicRecommendation[]> {
  try {
    const res = await fetch(`${BACKEND}/api/music/recent`, {
      next: { revalidate: 30 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data ?? [];
  } catch {
    return [];
  }
}

// ─── PETS ─────────────────────────────────────────────────────────────────────

export async function fetchMyPets(): Promise<MyPet[]> {
  try {
    const res = await fetch(`${BACKEND}/api/pets/mine`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.pets ?? [];
  } catch {
    return [];
  }
}

export async function fetchPetsGallery(
  page: number,
  limit = 12
): Promise<{ pets: GalleryPet[]; hasMore: boolean; total: number }> {
  try {
    const res = await fetch(
      `${BACKEND}/api/pets/gallery?page=${page}&limit=${limit}`
    );
    if (!res.ok) return { pets: [], hasMore: false, total: 0 };
    return res.json();
  } catch {
    return { pets: [], hasMore: false, total: 0 };
  }
}

export async function uploadPet(
  formData: FormData
): Promise<{ success: boolean; message: string; imageUrl?: string }> {
  const res = await fetch(`${BACKEND}/api/pets/upload`, {
    method: 'POST',
    body: formData,
  });
  const data = await res.json();
  return {
    success: res.ok,
    message: data.message ?? '',
    imageUrl: data.imageUrl,
  };
}
