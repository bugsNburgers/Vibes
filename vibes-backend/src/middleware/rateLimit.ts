import { Request, Response, NextFunction } from 'express';
import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Per-IP limiters keyed by route name
const limiters: Record<string, Ratelimit> = {
  anime: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(3, '1 d'),
    prefix: 'rl:anime',
  }),
  music: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(3, '1 d'),
    prefix: 'rl:music',
  }),
  pet: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(3, '1 d'),
    prefix: 'rl:pet-ip',
  }),
};

// Global pet upload limits (shared across all IPs)
const petPerMinute = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '1 m'),
  prefix: 'rl:pet-global-min',
});

const petPerDay = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, '1 d'),
  prefix: 'rl:pet-global-day',
});

function getIp(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') return forwarded.split(',')[0].trim();
  return req.socket.remoteAddress ?? 'unknown';
}

/** Per-IP sliding window rate limiter middleware factory. */
export function perIpLimit(
  route: keyof typeof limiters
): (req: Request, res: Response, next: NextFunction) => void {
  return async (req, res, next) => {
    const ip = getIp(req);
    const limiter = limiters[route];
    if (!limiter) { next(); return; }

    const { success, reset } = await limiter.limit(ip);
    if (!success) {
      res.setHeader('X-RateLimit-Reset', reset.toString());
      res.status(429).json({
        error: 'rate_limited',
        message: `Too many submissions. Max 3 per day per IP. Try again after ${new Date(reset).toLocaleTimeString()}.`,
      });
      return;
    }
    next();
  };
}

/** Global pet upload limiter — checks per-minute AND per-day limits. */
export async function petGlobalLimit(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const [perMin, perDay] = await Promise.all([
    petPerMinute.limit('global'),
    petPerDay.limit('global'),
  ]);

  if (!perMin.success) {
    res.status(429).json({
      error: 'rate_limited',
      message: 'Too many uploads right now. Try again in a minute.',
    });
    return;
  }
  if (!perDay.success) {
    res.status(429).json({
      error: 'rate_limited',
      message: 'Daily upload limit reached. Come back tomorrow!',
    });
    return;
  }
  next();
}
