import express, { Request, Response } from 'express';
import { setupSwagger } from './config/swagger';

const app = express();
const port = 3000;
setupSwagger(app);

/**
 * @openapi
 * /api/hello:
 *   get:
 *     tags:
 *       - Hello
 *     summary: Returns a greeting
 *     responses:
 *       200:
 *         description: Greeting message
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Hello, world!
 */
app.get('/', (req: Request, res: Response) => {
  res.send('Hello, Express with TypeScript!');
});

app.listen(port, () => {
  console.log(`Server running at http://127.0.0.1:${port}/`);
});
