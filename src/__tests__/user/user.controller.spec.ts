import { Request, Response } from 'express';
import {
  handleCreateUser,
  handleGetUser,
  handleUpdateUser,
  handleChangePassword,
  handleDeleteUser,
  handleSearchUsers,
  handleVerifyUser,
} from '../../controllers/user.controller';
import * as userService from '../../services/user.service';

type CreateUserRequest = Request<
  {},
  {},
  { name: string; email: string; password: string }
>;
type GetUserRequest = Request<{ id: string }>;
type UpdateUserRequest = Request<
  { id: string },
  {},
  { name?: string; email?: string }
>;
type ChangePasswordRequest = Request<
  { id: string },
  {},
  { currentPassword: string; newPassword: string }
>;
type DeleteUserRequest = Request<{ id: string }>;
type SearchUsersRequest = Request<
  {},
  {},
  {},
  { searchTerm: string; limit?: string; offset?: string }
>;

jest.mock('../../services/user.service');

describe('User Controller', () => {
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  // handleCreateUser
  describe('handleCreateUser', () => {
    const mockRequest: Partial<CreateUserRequest> = {
      body: {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      },
    };

    it('should return 400 if email is not unique', async () => {
      (userService.isEmailUnique as jest.Mock).mockResolvedValue(false);

      await handleCreateUser(
        mockRequest as CreateUserRequest,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Email already exists',
      });
    });

    it('should return 201 on successful creation', async () => {
      const mockUser = {
        id: '123',
        name: 'Test User',
        email: 'test@example.com',
        isVerified: false, // Ajouté
      };

      (userService.isEmailUnique as jest.Mock).mockResolvedValue(true);
      (userService.createUser as jest.Mock).mockResolvedValue(mockUser);

      await handleCreateUser(
        mockRequest as CreateUserRequest,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        user: mockUser,
        message: 'User created successfully',
      });
    });

    it('should return 500 if an error occurs', async () => {
      (userService.isEmailUnique as jest.Mock).mockRejectedValue(
        new Error('DB error')
      );
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      await handleCreateUser(
        mockRequest as CreateUserRequest,
        mockResponse as Response
      );

      expect(consoleSpy).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Internal server error',
      });

      consoleSpy.mockRestore();
    });
  });

  // handleGetUser
  describe('handleGetUser', () => {
    const mockRequest: Partial<GetUserRequest> = { params: { id: '123' } };

    it('should return 404 if user not found', async () => {
      (userService.getUserById as jest.Mock).mockResolvedValue(null);

      await handleGetUser(
        mockRequest as GetUserRequest,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'User not found',
      });
    });

    it('should return 200 if user found', async () => {
      const user = { id: '123', name: 'User', email: 'user@example.com' };
      (userService.getUserById as jest.Mock).mockResolvedValue(user);

      await handleGetUser(
        mockRequest as GetUserRequest,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(user);
    });

    it('should return 500 if error occurs', async () => {
      (userService.getUserById as jest.Mock).mockRejectedValue(
        new Error('DB error')
      );
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      await handleGetUser(
        mockRequest as GetUserRequest,
        mockResponse as Response
      );

      expect(consoleSpy).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Internal server error',
      });

      consoleSpy.mockRestore();
    });
  });

  // handleUpdateUser
  describe('handleUpdateUser', () => {
    const mockRequest: Partial<UpdateUserRequest> = {
      params: { id: '123' },
      body: { name: 'Updated', email: 'updated@example.com' },
    };

    it('should return 400 if email is not unique', async () => {
      (userService.isEmailUnique as jest.Mock).mockResolvedValue(false);

      await handleUpdateUser(
        mockRequest as UpdateUserRequest,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Email already exists',
      });
    });

    it('should return 404 if user not found', async () => {
      (userService.isEmailUnique as jest.Mock).mockResolvedValue(true);
      (userService.updateUser as jest.Mock).mockResolvedValue(null);

      await handleUpdateUser(
        mockRequest as UpdateUserRequest,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'User not found',
      });
    });

    it('should return 200 if updated successfully', async () => {
      const updatedUser = {
        id: '123',
        name: 'Updated',
        email: 'updated@example.com',
      };

      (userService.isEmailUnique as jest.Mock).mockResolvedValue(true);
      (userService.updateUser as jest.Mock).mockResolvedValue(updatedUser);

      await handleUpdateUser(
        mockRequest as UpdateUserRequest,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        user: updatedUser,
        message: 'User updated successfully',
      });
    });

    it('should return 500 on error', async () => {
      (userService.isEmailUnique as jest.Mock).mockRejectedValue(
        new Error('DB error')
      );
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      await handleUpdateUser(
        mockRequest as UpdateUserRequest,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Internal server error',
      });

      consoleSpy.mockRestore();
    });
  });

  // handleChangePassword
  describe('handleChangePassword', () => {
    const mockRequest: Partial<ChangePasswordRequest> = {
      params: { id: '123' },
      body: { currentPassword: 'old', newPassword: 'new' },
    };

    it('should return 400 if password change fails', async () => {
      (userService.changePassword as jest.Mock).mockResolvedValue(false);

      await handleChangePassword(
        mockRequest as ChangePasswordRequest,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Invalid current password or user not found',
      });
    });

    it('should return 200 on success', async () => {
      (userService.changePassword as jest.Mock).mockResolvedValue(true);

      await handleChangePassword(
        mockRequest as ChangePasswordRequest,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Password changed successfully',
      });
    });

    it('should return 500 on error', async () => {
      (userService.changePassword as jest.Mock).mockRejectedValue(
        new Error('DB error')
      );
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      await handleChangePassword(
        mockRequest as ChangePasswordRequest,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Internal server error',
      });

      consoleSpy.mockRestore();
    });
  });

  // handleDeleteUser
  describe('handleDeleteUser', () => {
    const mockRequest: Partial<DeleteUserRequest> = { params: { id: '123' } };

    it('should return 404 if user not found', async () => {
      (userService.deleteUser as jest.Mock).mockResolvedValue(false);

      await handleDeleteUser(
        mockRequest as DeleteUserRequest,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'User not found',
      });
    });

    it('should return 200 on success', async () => {
      (userService.deleteUser as jest.Mock).mockResolvedValue(true);

      await handleDeleteUser(
        mockRequest as DeleteUserRequest,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'User deleted successfully',
      });
    });

    it('should return 500 on error', async () => {
      (userService.deleteUser as jest.Mock).mockRejectedValue(
        new Error('DB error')
      );
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      await handleDeleteUser(
        mockRequest as DeleteUserRequest,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Internal server error',
      });

      consoleSpy.mockRestore();
    });
  });

  // handleSearchUsers
  describe('handleSearchUsers', () => {
    let mockRequest: Partial<SearchUsersRequest>;
    let mockUsers: any[];

    beforeEach(() => {
      mockRequest = {
        query: {
          searchTerm: 'test',
          limit: '10',
          offset: '0',
        },
      };

      mockUsers = [{ id: '1', name: 'Test User', email: 'test@example.com' }];
    });

    it('should return 400 if searchTerm is missing', async () => {
      mockRequest.query = { searchTerm: '' };

      await handleSearchUsers(
        mockRequest as SearchUsersRequest,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Search term is required',
      });
    });

    it('should return 200 with users and pagination', async () => {
      (userService.searchUsers as jest.Mock).mockResolvedValue(mockUsers);

      await handleSearchUsers(
        mockRequest as SearchUsersRequest,
        mockResponse as Response
      );

      expect(userService.searchUsers).toHaveBeenCalledWith('test', 10, 0);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        users: mockUsers,
        pagination: {
          limit: 10,
          offset: 0,
          count: mockUsers.length,
        },
      });
    });

    it('should apply default pagination if not provided', async () => {
      mockRequest.query = { searchTerm: 'test' }; // no limit/offset
      (userService.searchUsers as jest.Mock).mockResolvedValue(mockUsers);

      await handleSearchUsers(
        mockRequest as SearchUsersRequest,
        mockResponse as Response
      );

      expect(userService.searchUsers).toHaveBeenCalledWith('test', 10, 0);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });

    it('should return 500 if an error occurs', async () => {
      (userService.searchUsers as jest.Mock).mockRejectedValue(
        new Error('DB error')
      );
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      await handleSearchUsers(
        mockRequest as SearchUsersRequest,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Internal server error',
      });

      consoleSpy.mockRestore();
    });
  });

  // handleVerifyUser
  describe('handleVerifyUser', () => {
    const mockRequest: Partial<Request> = {
      params: { id: '123' },
    };

    it('should return 404 if user not found', async () => {
      (userService.updateUser as jest.Mock).mockResolvedValue(null);

      await handleVerifyUser(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'User not found',
      });
    });

    it('should return 200 if user is verified successfully', async () => {
      const mockUser = {
        id: '123',
        name: 'Verified User',
        email: 'verified@example.com',
        isVerified: true,
      };

      (userService.updateUser as jest.Mock).mockResolvedValue(mockUser);

      await handleVerifyUser(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        user: mockUser,
        message: 'User verified successfully',
      });
    });

    it('should return 500 on error', async () => {
      (userService.updateUser as jest.Mock).mockRejectedValue(
        new Error('Unexpected DB error')
      );
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      await handleVerifyUser(mockRequest as Request, mockResponse as Response);

      expect(consoleSpy).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Internal server error',
      });

      consoleSpy.mockRestore();
    });
  });
});
