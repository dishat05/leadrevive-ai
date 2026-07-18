import { User, sanitizeUser } from './user.model.js';
import { AppError } from '../../utils/apiResponse.js';

export async function getUserById(userId: string) {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(404, 'NOT_FOUND', 'User not found');
  }
  return sanitizeUser(user);
}

export async function getUserByEmail(email: string) {
  return User.findOne({ email: email.toLowerCase() });
}
