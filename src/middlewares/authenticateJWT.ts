import { Request, Response, NextFunction } from 'express';
import { SafeUser } from '../interfaces/user.interface';
import * as authService from '../services/auth.service';

export const authenticateJWT = (
  req: Request,
  res: Response,
  next: NextFunction
): any => {
  const authHeader = req.headers.authorization;

  // Check for the presence of the authorization header and the "Bearer" prefix
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Use the authService.verifyToken function instead of jwt.verify directly
    const decoded = authService.verifyToken(token);

    // If token verification fails, return unauthorized
    if (!decoded) {
      return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }

    // Attach the decoded user information to the request
    (req as any).user = decoded;

    // Proceed to the next middleware
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};
