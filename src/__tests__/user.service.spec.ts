import { createUser } from '../services/user.service';
import { UserModel } from '../models/user.model'; // Import the correct model
import bcrypt from 'bcrypt';

// Mock the UserModel class
jest.mock('../models/user.model', () => ({
  UserModel: {
    create: jest.fn().mockImplementation((userData) => {
      return Promise.resolve({
        id: '123e4567-e89b-12d3-a456-426614174000',
        ...userData,
        get: jest.fn(() => ({
          id: '123e4567-e89b-12d3-a456-426614174000',
          ...userData,
        })),
      });
    }),
  },
}));

// Mock bcrypt
jest.mock('bcrypt', () => ({
  hash: jest
    .fn()
    .mockImplementation((password) => Promise.resolve(`hashed_${password}`)),
}));

describe('createUser', () => {
  it('should create a new user with UUID and provided name/email/password', async () => {
    const name = 'Alice';
    const email = 'alice@example.com';
    const password = 'Secure123!';

    const user = await createUser(name, email, password);

    // Verify bcrypt was called
    expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);

    // Verify Sequelize model's create was called correctly
    expect(UserModel.create).toHaveBeenCalledWith({
      name,
      email,
      password: `hashed_${password}`,
    });

    // Verify the returned user has expected properties
    expect(user).toEqual({
      id: '123e4567-e89b-12d3-a456-426614174000',
      name,
      email,
      password: `hashed_${password}`,
    });
  });
});
