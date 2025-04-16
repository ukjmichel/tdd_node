import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import handleValidationErrors from '../../middlewares/handleValidationErrors';

// Mock express-validator's validationResult
jest.mock('express-validator', () => ({
  validationResult: jest.fn(),
}));

describe('handleValidationErrors middleware', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: jest.Mock;

  beforeEach(() => {
    mockReq = {
      body: {},
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
  });

  it('should call next() if there are no validation errors', () => {
    // Type-safe override with `as unknown as jest.Mock`
    (validationResult as unknown as jest.Mock).mockReturnValue({
      isEmpty: () => true,
    });

    handleValidationErrors(
      mockReq as Request,
      mockRes as Response,
      mockNext as NextFunction
    );

    expect(mockNext).toHaveBeenCalled();
    expect(mockRes.status).not.toHaveBeenCalled();
  });

  it('should return 400 with errors if validation fails', () => {
    const errorsArray = [{ msg: 'Email is required', param: 'email' }];

    (validationResult as unknown as jest.Mock).mockReturnValue({
      isEmpty: () => false,
      array: () => errorsArray,
    });

    handleValidationErrors(
      mockReq as Request,
      mockRes as Response,
      mockNext as NextFunction
    );

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'Validation failed',
      errors: errorsArray,
    });
    expect(mockNext).not.toHaveBeenCalled();
  });
});
