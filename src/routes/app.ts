// src/server.ts
import express from 'express';
import { sequelize } from '../config/db';
import { setupSwagger } from '../config/swagger';
import userRoutes from './user.routes';


const app = express(); 
const port = process.env.PORT || 3000;

setupSwagger(app);
app.use(express.json());

app.get('/health/db', async (req, res) => {
  try {
    await sequelize.authenticate();
    res
      .status(200)
      .json({ status: 'ok', message: 'Database connection is healthy' });
  } catch (error) {
    console.error('Database connection error:', error);
    res
      .status(500)
      .json({ status: 'error', message: 'Database connection failed', error });
  }
});

app.get('/', (req, res) => {
  res.send('Hello, Express with TypeScript!');
});

app.use('/api/users', userRoutes); 

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;
