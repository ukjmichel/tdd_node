// src/routes/user.routes.ts
import { Router } from 'express';
import { handleCreateUser } from '../controllers/user.controller';

const userRouter = Router();

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     description: Creates a new user in the system with the provided name, email, and password.
 *     operationId: createUser
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The user's name
 *                 example: Alice
 *               email:
 *                 type: string
 *                 description: The user's email address
 *                 example: alice@example.com
 *               password:
 *                 type: string
 *                 description: The user's password
 *                 example: Secure123!
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The unique ID of the newly created user
 *                   example: 123e4567-e89b-12d3-a456-426614174000
 *                 name:
 *                   type: string
 *                   description: The user's name
 *                   example: Alice
 *                 email:
 *                   type: string
 *                   description: The user's email
 *                   example: alice@example.com
 *       400:
 *         description: Bad request, validation failed
 *       500:
 *         description: Internal server error
 */
userRouter.post('/', handleCreateUser);

export default userRouter;
