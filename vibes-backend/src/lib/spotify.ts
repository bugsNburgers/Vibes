import type { Track } from './types';

interface SpotifyTokenResponse {
  access_token: string;
  expires_in: number;
}

interface SpotifyTrack {
  id: string;
  name: string;
  artists: Array<{ name: string }>;
  album: {
    name: string;
    images: Array<{ url: string }>;
  };
  external_urls: { spotify: string };
}

// In-memory token cache
let cachedToken: string | null = null;
let tokenExpiresAt = 0;

async function getAccessToken(): Promise<string> {
  if (cachedToken && Date.now() < tokenExpiresAt - 60_000) {
    return cachedToken;
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID!;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET!;
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN!;

  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
    client_id: clientId,
  });

  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
    },
    body: body.toString(),
  });

  if (!res.ok) {
    throw new Error(`Spotify token refresh failed: ${res.status}`);
  }

  const data = (await res.json()) as SpotifyTokenResponse;
  cachedToken = data.access_token;
  tokenExpiresAt = Date.now() + data.expires_in * 1000;
  return cachedToken;
}

export async function getTopTracks(): Promise<Track[]> {
  const token = await getAccessToken();

  const res = await fetch(
    'https://api.spotify.com/v1/me/top/tracks?time_range=medium_term&limit=20',
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (!res.ok) {
    throw new Error(`Spotify top tracks failed: ${res.status}`);
  }

  const data = (await res.json()) as { items?: SpotifyTrack[] };
  const items: SpotifyTrack[] = data.items ?? [];

  return items.map((item) => ({
    id: item.id,
    name: item.name,
    artists: item.artists.map((a) => a.name),
    album: item.album.name,
    albumImageUrl: item.album.images[0]?.url ?? '',
    spotifyUrl: item.external_urls.spotify,
  }));
}

// Re-export the Track type for use in routes
export type { Track };
