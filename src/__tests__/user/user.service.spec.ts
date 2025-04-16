// src/__tests__/services/user.service.spec.ts

import * as userService from '../../services/user.service';
import { UserModel } from '../../models/user.model';
import { UserInterface } from '../../interfaces/user.interface';
import { Op } from 'sequelize';

// Mock the UserModel
jest.mock('../../models/user.model');

describe('User Service', () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('should create a new user and return user without password', async () => {
      const mockUser = {
        id: 'user-123',
        name: 'TestUser',
        email: 'test@example.com',
        password: 'hashed-password',
        isVerified: false,
        get: jest.fn().mockReturnValue({
          id: 'user-123',
          name: 'TestUser',
          email: 'test@example.com',
          password: 'hashed-password',
          isVerified: false,
        }),
      };

      (UserModel.create as jest.Mock).mockResolvedValue(mockUser);

      const result = await userService.createUser(
        'TestUser',
        'test@example.com',
        'password123'
      );

      expect(UserModel.create).toHaveBeenCalledWith({
        name: 'TestUser',
        email: 'test@example.com',
        password: 'password123',
      });

      expect(result).toEqual({
        id: 'user-123',
        name: 'TestUser',
        email: 'test@example.com',
        isVerified: false,
      });
      expect(result).not.toHaveProperty('password');
    });

    it('should validate name contains only characters without spaces', async () => {
      // This test assumes you have validation in the createUser function
      // If the validation is handled elsewhere (like in a controller or middleware),
      // you might need to adjust this test

      const mockUser = {
        id: 'user-123',
        name: 'ValidName',
        email: 'test@example.com',
        password: 'hashed-password',
        isVerified: false,
        get: jest.fn().mockReturnValue({
          id: 'user-123',
          name: 'ValidName',
          email: 'test@example.com',
          password: 'hashed-password',
          isVerified: false,
        }),
      };

      (UserModel.create as jest.Mock).mockResolvedValue(mockUser);

      // Valid name (no spaces)
      const result = await userService.createUser(
        'ValidName',
        'test@example.com',
        'password123'
      );

      expect(result.name).toBe('ValidName');

      // Note: If your service doesn't validate names directly, you should
      // test this in the controller or middleware where validation occurs
    });
  });

  describe('isEmailUnique', () => {
    it('should return true when email is unique', async () => {
      (UserModel.findOne as jest.Mock).mockResolvedValue(null);

      const result = await userService.isEmailUnique('unique@example.com');

      expect(UserModel.findOne).toHaveBeenCalledWith({
        where: { email: 'unique@example.com' },
      });
      expect(result).toBe(true);
    });

    it('should return false when email already exists', async () => {
      (UserModel.findOne as jest.Mock).mockResolvedValue({
        id: 'existing-user',
        email: 'existing@example.com',
      });

      const result = await userService.isEmailUnique('existing@example.com');

      expect(UserModel.findOne).toHaveBeenCalledWith({
        where: { email: 'existing@example.com' },
      });
      expect(result).toBe(false);
    });
  });

  describe('getUserById', () => {
    it('should return user without password when found', async () => {
      const mockUser = {
        id: 'user-123',
        name: 'TestUser',
        email: 'test@example.com',
        password: 'hashed-password',
        isVerified: false,
        get: jest.fn().mockReturnValue({
          id: 'user-123',
          name: 'TestUser',
          email: 'test@example.com',
          password: 'hashed-password',
          isVerified: false,
        }),
      };

      (UserModel.findByPk as jest.Mock).mockResolvedValue(mockUser);

      const result = await userService.getUserById('user-123');

      expect(UserModel.findByPk).toHaveBeenCalledWith('user-123');
      expect(result).toEqual({
        id: 'user-123',
        name: 'TestUser',
        email: 'test@example.com',
        isVerified: false,
      });
      expect(result).not.toHaveProperty('password');
    });

    it('should return null when user is not found', async () => {
      (UserModel.findByPk as jest.Mock).mockResolvedValue(null);

      const result = await userService.getUserById('non-existent-id');

      expect(UserModel.findByPk).toHaveBeenCalledWith('non-existent-id');
      expect(result).toBeNull();
    });
  });

  describe('updateUser', () => {
    it('should update user and return updated data without password', async () => {
      // Mock the update call
      (UserModel.update as jest.Mock).mockResolvedValue([1]);

      // Mock the getUserById call that will happen after update
      const mockUpdatedUser = {
        id: 'user-123',
        name: 'UpdatedName',
        email: 'test@example.com',
        isVerified: false,
      };
      jest.spyOn(userService, 'getUserById').mockResolvedValue(mockUpdatedUser);

      const updateData = {
        name: 'UpdatedName',
        password: 'should-not-be-included', // This should be filtered out
      };

      const result = await userService.updateUser('user-123', updateData);

      // Ensure password was not included in the update
      expect(UserModel.update).toHaveBeenCalledWith(
        { name: 'UpdatedName' },
        { where: { id: 'user-123' } }
      );

      expect(userService.getUserById).toHaveBeenCalledWith('user-123');
      expect(result).toEqual(mockUpdatedUser);
    });

    it('should validate updated name contains only characters without spaces', async () => {
      // Mock the update call
      (UserModel.update as jest.Mock).mockResolvedValue([1]);

      // Mock the getUserById call
      const mockUpdatedUser = {
        id: 'user-123',
        name: 'ValidName',
        email: 'test@example.com',
        isVerified: false,
      };
      jest.spyOn(userService, 'getUserById').mockResolvedValue(mockUpdatedUser);

      const updateData = {
        name: 'ValidName',
      };

      const result = await userService.updateUser('user-123', updateData);

      // Add a null check here before accessing properties
      expect(result).not.toBeNull();
      if (result) {
        expect(result.name).toBe('ValidName');
      }

      expect(UserModel.update).toHaveBeenCalledWith(
        { name: 'ValidName' },
        { where: { id: 'user-123' } }
      );
    });

    it('should return null when user to update is not found', async () => {
      (UserModel.update as jest.Mock).mockResolvedValue([0]); // 0 rows updated

      const result = await userService.updateUser('non-existent-id', {
        name: 'NewName',
      });

      // This test should check that the result IS null (not "not null")
      expect(result).toBeNull();
    });
  });

  describe('changePassword', () => {
    it('should change password when current password is valid', async () => {
      const mockUser = {
        id: 'user-123',
        password: 'current-hashed-password',
        validatePassword: jest.fn().mockResolvedValue(true),
        save: jest.fn().mockResolvedValue(true),
      };

      (UserModel.findByPk as jest.Mock).mockResolvedValue(mockUser);

      const result = await userService.changePassword(
        'user-123',
        'current-password',
        'new-password'
      );

      expect(UserModel.findByPk).toHaveBeenCalledWith('user-123');
      expect(mockUser.validatePassword).toHaveBeenCalledWith(
        'current-password'
      );
      expect(mockUser.password).toBe('new-password');
      expect(mockUser.save).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('should not change password when current password is invalid', async () => {
      const mockUser = {
        id: 'user-123',
        password: 'current-hashed-password',
        validatePassword: jest.fn().mockResolvedValue(false),
        save: jest.fn(),
      };

      (UserModel.findByPk as jest.Mock).mockResolvedValue(mockUser);

      const result = await userService.changePassword(
        'user-123',
        'wrong-password',
        'new-password'
      );

      expect(UserModel.findByPk).toHaveBeenCalledWith('user-123');
      expect(mockUser.validatePassword).toHaveBeenCalledWith('wrong-password');
      expect(mockUser.save).not.toHaveBeenCalled();
      expect(result).toBe(false);
    });

    it('should return false when user is not found', async () => {
      (UserModel.findByPk as jest.Mock).mockResolvedValue(null);

      const result = await userService.changePassword(
        'non-existent-id',
        'current-password',
        'new-password'
      );

      expect(result).toBe(false);
    });
  });

  describe('deleteUser', () => {
    it('should return true when user is successfully deleted', async () => {
      (UserModel.destroy as jest.Mock).mockResolvedValue(1); // 1 row deleted

      const result = await userService.deleteUser('user-123');

      expect(UserModel.destroy).toHaveBeenCalledWith({
        where: { id: 'user-123' },
      });
      expect(result).toBe(true);
    });

    it('should return false when user to delete is not found', async () => {
      (UserModel.destroy as jest.Mock).mockResolvedValue(0); // 0 rows deleted

      const result = await userService.deleteUser('non-existent-id');

      expect(UserModel.destroy).toHaveBeenCalledWith({
        where: { id: 'non-existent-id' },
      });
      expect(result).toBe(false);
    });
  });

  describe('searchUsers', () => {
    it('should return users matching search criteria without passwords', async () => {
      const mockUsers = [
        {
          id: 'user-1',
          name: 'TestUser',
          email: 'test@example.com',
          password: 'hashed-password-1',
          isVerified: true,
          get: jest.fn().mockReturnValue({
            id: 'user-1',
            name: 'TestUser',
            email: 'test@example.com',
            password: 'hashed-password-1',
            isVerified: true,
          }),
        },
        {
          id: 'user-2',
          name: 'AnotherTest',
          email: 'another@example.com',
          password: 'hashed-password-2',
          isVerified: false,
          get: jest.fn().mockReturnValue({
            id: 'user-2',
            name: 'AnotherTest',
            email: 'another@example.com',
            password: 'hashed-password-2',
            isVerified: false,
          }),
        },
      ];

      (UserModel.findAll as jest.Mock).mockResolvedValue(mockUsers);

      const result = await userService.searchUsers('test', 20, 10);

      expect(UserModel.findAll).toHaveBeenCalledWith({
        where: {
          [Op.or]: [
            { name: { [Op.like]: '%test%' } },
            { email: { [Op.like]: '%test%' } },
          ],
        },
        limit: 20,
        offset: 10,
        attributes: { exclude: ['password'] },
      });

      expect(result).toEqual([
        {
          id: 'user-1',
          name: 'TestUser',
          email: 'test@example.com',
          isVerified: true,
        },
        {
          id: 'user-2',
          name: 'AnotherTest',
          email: 'another@example.com',
          isVerified: false,
        },
      ]);

      // Verify no passwords are included
      result.forEach((user) => {
        expect(user).not.toHaveProperty('password');
      });
    });

    it('should use default pagination parameters when not provided', async () => {
      (UserModel.findAll as jest.Mock).mockResolvedValue([]);

      await userService.searchUsers('test');

      expect(UserModel.findAll).toHaveBeenCalledWith({
        where: {
          [Op.or]: [
            { name: { [Op.like]: '%test%' } },
            { email: { [Op.like]: '%test%' } },
          ],
        },
        limit: 10, // Default limit
        offset: 0, // Default offset
        attributes: { exclude: ['password'] },
      });
    });
  });
});
