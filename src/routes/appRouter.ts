import { Router, Request, Response } from 'express';

const router = Router();

/**
 * @swagger
 * /:
 *   get:
 *     summary: Welcome endpoint
 *     description: Returns a welcome message
 *     responses:
 *       200:
 *         description: Success response
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: 'Hello, Express with TypeScript!'
 */
router.get('/', (req: Request, res: Response) => {
  res.send('Hello, Express with TypeScript!');
});

// Change to ES Module export
export default router;
