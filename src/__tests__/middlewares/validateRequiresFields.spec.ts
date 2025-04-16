import { Request, Response, NextFunction } from 'express';
import { validateRequiredFields } from '../../middlewares/validateRequiredFields';

describe('validateRequiredFields middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    mockRequest = {
      body: {},
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    nextFunction = jest.fn();
  });

  it('should call next() if all required fields are present', () => {
    mockRequest.body = {
      name: 'Alice',
      email: 'alice@example.com',
      password: 'securepass',
    };

    const middleware = validateRequiredFields(['name', 'email', 'password']);
    middleware(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(nextFunction).toHaveBeenCalled();
    expect(mockResponse.status).not.toHaveBeenCalled();
  });

  it('should return 400 if any required fields are missing', () => {
    mockRequest.body = {
      name: 'Alice',
      password: 'securepass',
    }; // email missing

    const middleware = validateRequiredFields(['name', 'email', 'password']);
    middleware(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Missing required fields: email',
    });
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it('should list all missing fields in the error message', () => {
    mockRequest.body = {
      email: 'alice@example.com',
    }; // name and password missing

    const middleware = validateRequiredFields(['name', 'email', 'password']);
    middleware(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Missing required fields: name, password',
    });
    expect(nextFunction).not.toHaveBeenCalled();
  });
});
