import { Request, Response } from 'express';
import {
  createUser,
  isEmailUnique,
  getUserById,
  updateUser,
  changePassword,
  deleteUser,
  searchUsers,
} from '../services/user.service';

export async function handleCreateUser(
  req: Request,
  res: Response
): Promise<any> {
  const { name, email, password } = req.body;

  try {
    const emailIsUnique = await isEmailUnique(email);
    if (!emailIsUnique) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const user = await createUser(name, email, password);
    return res.status(201).json({ user, message: 'User created successfully' });
  } catch (error) {
    console.error('User creation failed:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

export async function handleGetUser(req: Request, res: Response): Promise<any> {
  const { id } = req.params;

  try {
    const user = await getUserById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

export async function handleUpdateUser(
  req: Request,
  res: Response
): Promise<any> {
  const { id } = req.params;
  const { name, email } = req.body;

  if (!name && !email) {
    return res
      .status(400)
      .json({ message: 'At least one field to update is required' });
  }

  try {
    if (email) {
      const emailIsUnique = await isEmailUnique(email);
      if (!emailIsUnique) {
        return res.status(400).json({ message: 'Email already exists' });
      }
    }

    const updatedUser = await updateUser(id, { name, email });
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res
      .status(200)
      .json({ user: updatedUser, message: 'User updated successfully' });
  } catch (error) {
    console.error('Error updating user:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

export async function handleChangePassword(
  req: Request,
  res: Response
): Promise<any> {
  const { id } = req.params;
  const { currentPassword, newPassword } = req.body;

  try {
    const success = await changePassword(id, currentPassword, newPassword);

    if (!success) {
      return res
        .status(400)
        .json({ message: 'Invalid current password or user not found' });
    }

    return res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

export async function handleDeleteUser(
  req: Request,
  res: Response
): Promise<any> {
  const { id } = req.params;

  try {
    const deleted = await deleteUser(id);
    if (!deleted) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

export async function handleSearchUsers(
  req: Request,
  res: Response
): Promise<any> {
  const { searchTerm } = req.query;
  const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
  const offset = req.query.offset
    ? parseInt(req.query.offset as string, 10)
    : 0;

  if (!searchTerm || typeof searchTerm !== 'string') {
    return res.status(400).json({ message: 'Search term is required' });
  }

  try {
    const users = await searchUsers(searchTerm, limit, offset);

    return res.status(200).json({
      users,
      pagination: {
        limit,
        offset,
        count: users.length,
      },
    });
  } catch (error) {
    console.error('Error searching users:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

export async function handleVerifyUser(
  req: Request,
  res: Response
): Promise<any> {
  const { id } = req.params;

  try {
    const user = await updateUser(id, { isVerified: true });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res
      .status(200)
      .json({ user, message: 'User verified successfully' });
  } catch (error) {
    console.error('Error verifying user:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
