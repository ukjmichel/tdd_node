// src/__tests__/user.controller.spec.ts
import { User } from '../interfaces/user.interface'; // Import the interface
import request from 'supertest';
import app from '../routes/app'; // Import your app
import { createUser } from '../services/user.service';

jest.mock('../services/user.service', () => ({
  createUser: jest.fn().mockResolvedValue({
    id: 'some-id',
    name: 'John Doe',
    email: 'john@example.com',
    password: 'hashedpassword',
  }),
}));

describe('POST /api/users', () => {
  it('should return 400 if required fields are missing', async () => {
    const response = await request(app).post('/api/users').send({
      name: '', // Missing name
      email: '', // Missing email
      password: '', // Missing password
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Missing required fields');
  });

  it('should return 201 if the user is created successfully', async () => {
    const response = await request(app).post('/api/users').send({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
    });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('User created successfully');
  });

  it('should return 500 if user creation fails', async () => {
    (createUser as jest.Mock).mockRejectedValueOnce(
      new Error('Database error')
    );

    const response = await request(app).post('/api/users').send({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
    });

    expect(response.status).toBe(500);
    expect(response.body.message).toBe('Internal server error');
  });
});
