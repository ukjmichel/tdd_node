import { authenticateJWT as authenticate } from '../../middlewares/authenticateJWT';
import * as authService from '../../services/auth.service';
import { Request, Response, NextFunction } from 'express';
import { SafeUser } from '../../interfaces/user.interface';

describe('authenticate middleware', () => {
  let req: Partial<Request> & { user?: SafeUser };
  let res: Partial<Response>;
  let next: NextFunction;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });
    req = { headers: {} };
    res = {
      status: statusMock,
      json: jsonMock,
    };
    next = jest.fn();
  });

  it('should call next() and set req.user if token is valid', () => {
    req.headers = { authorization: 'Bearer valid.token' };

    // Définir l'utilisateur simulé (l'objet `SafeUser`)
    const decodedUser: SafeUser = {
      id: 'uuid-123',
      name: 'John Doe',
      email: 'john@example.com',
      isVerified: true,
    };

    // Simuler `jwt.verify` pour qu'il renvoie l'utilisateur simulé
    jest.spyOn(authService, 'verifyToken').mockReturnValue(decodedUser);

    authenticate(req as Request, res as Response, next);

    // Vérifier que `req.user` a bien été défini
    const typedReq = req as Request & { user?: SafeUser };
    expect(typedReq.user).toEqual(decodedUser);
    expect(next).toHaveBeenCalled();
    expect(statusMock).not.toHaveBeenCalled();
  });

  it('should return 401 if Authorization header is missing', () => {
    authenticate(req as Request, res as Response, next);

    expect(statusMock).toHaveBeenCalledWith(401);
    expect(jsonMock).toHaveBeenCalledWith({
      message: 'Unauthorized: No token provided',
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 if Authorization header is malformed', () => {
    req.headers = { authorization: 'Token invalid' };

    authenticate(req as Request, res as Response, next);

    expect(statusMock).toHaveBeenCalledWith(401);
    expect(jsonMock).toHaveBeenCalledWith({
      message: 'Unauthorized: No token provided',
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 if token is invalid', () => {
    req.headers = { authorization: 'Bearer invalid.token' };
    jest.spyOn(authService, 'verifyToken').mockReturnValue(null);

    authenticate(req as Request, res as Response, next);

    expect(statusMock).toHaveBeenCalledWith(401);
    expect(jsonMock).toHaveBeenCalledWith({
      message: 'Unauthorized: Invalid token',
    });
    expect(next).not.toHaveBeenCalled();
  });
});
