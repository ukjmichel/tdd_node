import { Request, Response, NextFunction } from 'express';
import { SafeUser } from '../interfaces/user.interface';

/**
 * Middleware to check if a user's account is verified
 * This middleware should be used after the authenticateJWT middleware
 * to ensure req.user is populated
 */
export const checkVerifiedAccount = (
  req: Request,
  res: Response,
  next: NextFunction
): any => {
  // First, check if user is authenticated
  const user = (req as any).user as SafeUser | undefined;

  if (!user) {
    return res.status(401).json({
      message: 'Authentication required',
    });
  }

  // Check if the user account is verified
  if (!user.isVerified) {
    return res.status(403).json({
      message:
        'Account not verified. Please verify your email to access this resource',
    });
  }

  // If user is verified, proceed to the next middleware
  next();
};
