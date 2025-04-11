import { Request, Response } from 'express';

// Assuming createUser is a function that handles user creation in your database
import { createUser } from '../services/user.service';

export async function handleCreateUser(
  req: Request<{ name: string; email: string; password: string }>, // Request with specific body type
  res: Response<{ message: string }> // Response with a message field
): Promise<any> {
  // Return type simplified
  const { name, email, password } = req.body;

  // Check if all required fields are provided
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // Await the user creation function to ensure it completes before sending a response
    const user = await createUser(name, email, password);

    // Respond with a success message
    return res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    // Log the error and return a 500 status code with an error message
    console.error('User creation failed:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
