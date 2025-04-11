import express from 'express';
import sequelize from '../config/db';
import { setupSwagger } from '../config/swagger';

const app = express();
const port = process.env.PORT || 3000;
setupSwagger(app);
app.use(express.json());

/**
 * @swagger
 * /health/db:
 *   get:
 *     summary: Check the database connection status
 *     description: Returns the status of the database connection (healthy or failed).
 *     tags:
 *       - Health
 *     responses:
 *       200:
 *         description: Database connection is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *       500:
 *         description: Database connection failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *                 error:
 *                   type: object
 */
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

/**
 * @swagger
 * /:
 *   get:
 *     summary: Root route
 *     description: Simple welcome message from the API.
 *     tags:
 *       - General
 *     responses:
 *       200:
 *         description: Welcome message
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Hello from the app!
 */
app.get('/', (req, res) => {
  res.send('Hello from the app!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;
