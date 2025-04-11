import { User as UserInterface } from '../interfaces/user.interface';
import { UserModel as UserModel } from '../models/user.model'; // Assuming you have a Sequelize model
import bcrypt from 'bcrypt'; // For password hashing

/**
 * Creates a new user and adds it to the database.
 * @param name The full name of the user.
 * @param email The user's email address.
 * @param password The user's password (will be hashed before storing).
 * @returns The newly created user.
 */
export async function createUser(
  name: string,
  email: string,
  password: string
): Promise<UserInterface> {
  // Hash the password before storing
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // Create user in database using Sequelize
  const newUser = await UserModel.create({
    name,
    email,
    password: hashedPassword, // Store hashed password
  });

  // Return user data (convert Sequelize model to plain object)
  return newUser.get({ plain: true }) as UserInterface;
}

// You might also want to add a function to check if email already exists
export async function isEmailUnique(email: string): Promise<boolean> {
  const existingUser = await UserModel.findOne({ where: { email } });
  return !existingUser;
}
