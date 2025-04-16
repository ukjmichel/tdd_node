// src/__tests__/user/user.routes.spec.ts

import request from 'supertest';
import express from 'express';
import userRoutes from '../../routes/user.routes';
import * as userController from '../../controllers/user.controller';

// Mock the authenticateJWT middleware
jest.mock('../../middlewares/authenticateJWT', () => ({
  authenticateJWT: (req: any, res: any, next: any) => {
    // Add a mock authenticated user to the request
    req.user = {
      id: 'test-user-id',
      name: 'Test User',
      email: 'test@example.com',
      isVerified: true,
    };
    next();
  },
}));

// Mock the user controller
jest.mock('../../controllers/user.controller');

describe('User Routes', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/users', userRoutes);

    // Clear all mocks before each test
    jest.clearAllMocks();

    // Setup controller mocks
    (userController.handleCreateUser as jest.Mock).mockImplementation(
      (req, res) => {
        res.status(201).json({ id: '123', ...req.body });
      }
    );

    (userController.handleGetUser as jest.Mock).mockImplementation(
      (req, res) => {
        res.status(200).json({ id: req.params.id, name: 'Test User' });
      }
    );

    (userController.handleUpdateUser as jest.Mock).mockImplementation(
      (req, res) => {
        res.status(200).json({ id: req.params.id, ...req.body });
      }
    );

    (userController.handleChangePassword as jest.Mock).mockImplementation(
      (req, res) => {
        res.status(200).json({ message: 'Password updated successfully' });
      }
    );

    (userController.handleDeleteUser as jest.Mock).mockImplementation(
      (req, res) => {
        res.status(200).json({ message: 'User deleted successfully' });
      }
    );

    (userController.handleSearchUsers as jest.Mock).mockImplementation(
      (req, res) => {
        res.status(200).json({
          users: [],
          pagination: {
            page: parseInt(req.query.page as string) || 1,
            limit: parseInt(req.query.limit as string) || 10,
            total: 0,
          },
        });
      }
    );

    (userController.handleVerifyUser as jest.Mock).mockImplementation(
      (req, res) => {
        res.status(200).json({ message: 'User verified successfully' });
      }
    );
  });

  describe('POST /users', () => {
    it('should route to handleCreateUser controller', async () => {
      const response = await request(app)
        .post('/users')
        .send({ name: 'Test', email: 'test@test.com', password: 'password' });

      expect(response.status).toBe(201);
      expect(userController.handleCreateUser).toHaveBeenCalled();
    });

    it('should return 400 if name is missing or invalid', async () => {
      const response = await request(app)
        .post('/users')
        .send({ email: 'test@test.com', password: 'password' });

      expect(response.status).toBe(400);
    });

    it('should return 400 if email is missing or invalid', async () => {
      const response = await request(app)
        .post('/users')
        .send({ name: 'Test', password: 'password' });

      expect(response.status).toBe(400);
    });

    it('should return 400 if email (invalid format) is missing or invalid', async () => {
      const response = await request(app)
        .post('/users')
        .send({ name: 'Test', email: 'invalid-email', password: 'password' });

      expect(response.status).toBe(400);
    });

    it('should return 400 if password is missing or invalid', async () => {
      const response = await request(app)
        .post('/users')
        .send({ name: 'Test', email: 'test@test.com' });

      expect(response.status).toBe(400);
    });
  });

  describe('GET /users/:id', () => {
    it('should route to handleGetUser controller', async () => {
      const response = await request(app).get('/users/123');

      expect(response.status).toBe(200);
      expect(userController.handleGetUser).toHaveBeenCalled();
      expect(response.body).toEqual({ id: '123', name: 'Test User' });
    });
  });

  describe('PUT /users/:id', () => {
    it('should route to handleUpdateUser controller', async () => {
      const response = await request(app)
        .put('/users/123')
        .send({ name: 'Updated User' });

      expect(response.status).toBe(200);
      expect(userController.handleUpdateUser).toHaveBeenCalled();
    });
  });

  describe('PUT /users/:id/password', () => {
    it('should route to handleChangePassword controller', async () => {
      const response = await request(app)
        .put('/users/123/password')
        .send({ currentPassword: 'old', newPassword: 'new' });

      expect(response.status).toBe(200);
      expect(userController.handleChangePassword).toHaveBeenCalled();
    });

    it('should return 400 if currentPassword is missing', async () => {
      const response = await request(app)
        .put('/users/123/password')
        .send({ newPassword: 'new' });

      expect(response.status).toBe(400);
    });

    it('should return 400 if newPassword is missing', async () => {
      const response = await request(app)
        .put('/users/123/password')
        .send({ currentPassword: 'old' });

      expect(response.status).toBe(400);
    });
  });

  describe('DELETE /users/:id', () => {
    it('should route to handleDeleteUser controller', async () => {
      const response = await request(app).delete('/users/123');

      expect(response.status).toBe(200);
      expect(userController.handleDeleteUser).toHaveBeenCalled();
    });
  });

  describe('GET /users/search', () => {
    it('should route to handleSearchUsers controller', async () => {
      const response = await request(app).get('/users/search?searchTerm=test');

      expect(response.status).toBe(200);
      expect(userController.handleSearchUsers).toHaveBeenCalled();
      expect(response.body).toEqual({
        users: [],
        pagination: {
          page: 1,
          limit: 10,
          total: 0,
        },
      });
    });

    it('should route to handleSearchUsers with pagination parameters', async () => {
      const response = await request(app).get(
        '/users/search?searchTerm=test&page=2&limit=20'
      );

      expect(response.status).toBe(200);
      expect(userController.handleSearchUsers).toHaveBeenCalled();

      const req = (userController.handleSearchUsers as jest.Mock).mock
        .calls[0][0];
      expect(req.query).toEqual({
        searchTerm: 'test',
        page: '2',
        limit: '20',
      });
    });
  });

  describe('PATCH /users/:id/verify', () => {
    it('should route to handleVerifyUser controller', async () => {
      const response = await request(app).patch('/users/123/verify');

      expect(response.status).toBe(200);
      expect(userController.handleVerifyUser).toHaveBeenCalled();
    });
  });

  describe('Route Precedence', () => {
    it('should route /users/search before /users/:id', async () => {
      await request(app).get('/users/search?searchTerm=test');

      expect(userController.handleSearchUsers).toHaveBeenCalled();
      expect(userController.handleGetUser).not.toHaveBeenCalled();

      jest.clearAllMocks();

      await request(app).get('/users/123');
      expect(userController.handleGetUser).toHaveBeenCalled();
    });
  });
});
