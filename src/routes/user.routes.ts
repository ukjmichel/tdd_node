import express from 'express';
import * as userController from '../controllers/user.controller';
import { validateRequiredFields } from '../middlewares/validateRequiredFields';
import handleValidationErrors from '../middlewares/handleValidationErrors';
import { authenticateJWT } from '../middlewares/authenticateJWT';
import { body } from 'express-validator';

const router = express.Router();

// Create user route (public - no authentication required)
router.post(
  '/',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').trim().isEmail().withMessage('Valid email is required'),
    body('password').trim().notEmpty().withMessage('Password is required'),
    handleValidationErrors,
  ],
  userController.handleCreateUser
);

// Search users route - must come before /:id route for precedence
router.get('/search', authenticateJWT, userController.handleSearchUsers);

// Verify user route
router.patch('/:id/verify', userController.handleVerifyUser);

// Change password route
router.put(
  '/:id/password',
  authenticateJWT,
  [
    body('currentPassword')
      .trim()
      .notEmpty()
      .withMessage('Current password is required'),
    body('newPassword')
      .trim()
      .notEmpty()
      .withMessage('New password is required'),
    handleValidationErrors,
  ],
  userController.handleChangePassword
);

// Get user by ID
router.get('/:id', authenticateJWT, userController.handleGetUser);

// Update user
router.put('/:id', authenticateJWT, userController.handleUpdateUser);

// Delete user
router.delete('/:id', authenticateJWT, userController.handleDeleteUser);

export default router;
