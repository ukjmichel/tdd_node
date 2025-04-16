import { Request, Response, NextFunction } from 'express';


/**
 * Middleware factory to validate required fields in req.body
 * @param requiredFields - list of field names that must exist in req.body
 */
export function validateRequiredFields(requiredFields: string[]): any {
  return (req: Request, res: Response, next: NextFunction) => {
    const missingFields = requiredFields.filter((field) => !req.body[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: `Missing required fields: ${missingFields.join(', ')}`,
      });
    }

    next();
  };
}
