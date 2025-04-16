import { Request, Response, NextFunction } from 'express';

export function isSelf(req: Request, res: Response, next: NextFunction) {
  const userIdFromParams = req.params.id;
  const userIdFromToken = (req as any).user?.id;

  if (!userIdFromToken) {
    return res.status(401).json({ message: 'Unauthorized: no token' });
  }

  if (userIdFromParams !== userIdFromToken) {
    return res.status(403).json({ message: 'Forbidden: access denied' });
  }

  next();
}
