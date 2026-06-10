/**
 * Merge CSS module class names, filtering falsy values.
 */
export function cn(...classes: Array<string | undefined | null | false>): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Format an ISO date string as a human-readable relative time.
 * e.g. "just now", "3 hours ago", "2 days ago"
 */
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const diffMs = Date.now() - date.getTime();
  const s = Math.floor(diffMs / 1000);
  const m = Math.floor(s / 60);
  const h = Math.floor(m / 60);
  const d = Math.floor(h / 24);
  const w = Math.floor(d / 7);

  if (s < 60)  return 'just now';
  if (m < 60)  return `${m} minute${m !== 1 ? 's' : ''} ago`;
  if (h < 24)  return `${h} hour${h !== 1 ? 's' : ''} ago`;
  if (d < 7)   return `${d} day${d !== 1 ? 's' : ''} ago`;
  if (w < 5)   return `${w} week${w !== 1 ? 's' : ''} ago`;
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}
