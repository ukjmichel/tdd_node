import request from 'supertest';
import express from 'express';
import appRouter from '../routes/appRouter'; // Adjust this to your actual route file

const app = express();
app.use('/', appRouter);

describe('GET /', () => {
  it('should return a welcome message', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toBe('Hello, Express with TypeScript!');
  });
});
