import jwt from 'jsonwebtoken';
import { UserModel } from '../models/user.model';
import { UserInterface, SafeUser } from '../interfaces/user.interface';
import { loadEnv } from '../config/loadenv';

loadEnv();

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret_key';

/**
 * Génère un JWT à partir des données utilisateur (sans le mot de passe)
 */
const generateToken = (user: UserInterface): string => {
  const payload: SafeUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    isVerified: user.isVerified,
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
};

/**
 * Vérifie un token JWT et retourne les données de l'utilisateur s'il est valide
 */
function verifyToken(token: string): SafeUser | null {
  try {
    return jwt.verify(token, JWT_SECRET) as SafeUser;
  } catch (error) {
    return null;
  }
}

/**
 * Connecte un utilisateur en vérifiant les identifiants, retourne un token et les infos sans mot de passe
 */
async function login(
  email: string = '',
  password: string = ''
): Promise<{
  token: string;
  user: SafeUser;
} | null> {
  const user = await UserModel.findOne({ where: { email } });
  if (!user) return null;

  const isValid = await user.validatePassword(password);
  if (!isValid) return null;

  const token = generateToken(user);
  const safeUser: SafeUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    isVerified: user.isVerified,
  };

  return { token, user: safeUser };
}

export { login, verifyToken };
``;
