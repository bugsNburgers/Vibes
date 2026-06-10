import { Request, Response, NextFunction } from 'express';

export function validateAdmin(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const secret = req.headers['x-admin-secret'];
  const expected = process.env.ADMIN_SECRET;

  if (!expected) {
    res.status(500).json({ error: 'server_misconfigured', message: 'ADMIN_SECRET not set.' });
    return;
  }

  if (!secret || secret !== expected) {
    res.status(401).json({ error: 'unauthorized', message: 'Invalid admin secret.' });
    return;
  }

  next();
}
