import bcrypt from 'bcryptjs';
import { User, sanitizeUser } from '../users/user.model.js';
import { getUserByEmail } from '../users/user.service.js';
import { AppError } from '../../utils/apiResponse.js';
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from '../../utils/jwt.js';
import { env } from '../../config/env.js';
import type { RegisterInput, LoginInput } from './auth.schema.js';

const BCRYPT_ROUNDS = 10;
const REFRESH_COOKIE_NAME = 'refreshToken';

export { REFRESH_COOKIE_NAME };

function getRefreshExpiryDate(): Date {
  return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
}
  
async function hashRefreshToken(token: string): Promise<string> {
  return bcrypt.hash(token, BCRYPT_ROUNDS);
}

async function storeRefreshToken(userId: string, token: string): Promise<void> {
  const tokenHash = await hashRefreshToken(token);
  const expiresAt = getRefreshExpiryDate();

  await User.findByIdAndUpdate(userId, {
    $push: {
      refreshTokens: {
        tokenHash,
        expiresAt,
        createdAt: new Date(),
      },
    },
  });
}

async function findMatchingRefreshToken(userId: string, token: string) {
  const user = await User.findById(userId);
  if (!user) return null;

  for (const entry of user.refreshTokens) {
    if (entry.expiresAt < new Date()) continue;
    const match = await bcrypt.compare(token, entry.tokenHash);
    if (match) return entry;
  }
  return null;
}

async function revokeAllRefreshTokens(userId: string): Promise<void> {
  await User.findByIdAndUpdate(userId, { $set: { refreshTokens: [] } });
}

async function rotateRefreshToken(userId: string, oldToken: string): Promise<string> {
  const user = await User.findById(userId);
  if (!user) {
      throw new AppError(401, 'REFRESH_TOKEN_INVALID');
  }

  let matchedHash: string | null = null;
  for (const entry of user.refreshTokens) {
    if (entry.expiresAt < new Date()) continue;
    const match = await bcrypt.compare(oldToken, entry.tokenHash);
    if (match) {
      matchedHash = entry.tokenHash;
      break;
    }
  }

  if (!matchedHash) {
    await revokeAllRefreshTokens(userId);
    throw new AppError(401, 'REFRESH_TOKEN_INVALID');
  }

  await User.findByIdAndUpdate(userId, {
    $pull: { refreshTokens: { tokenHash: matchedHash } },
  });

  const newToken = signRefreshToken(userId);
  await storeRefreshToken(userId, newToken);
  return newToken;
}

export async function register(input: RegisterInput) {
  const existing = await getUserByEmail(input.email);
  if (existing) {
    throw new AppError(409, 'CONFLICT');
  }

  const passwordHash = await bcrypt.hash(input.password, BCRYPT_ROUNDS);
  const user = await User.create({
    name: input.name,
    email: input.email,
    passwordHash,
    businessName: input.businessName,
  });

  const accessToken = signAccessToken({
    _id: user._id.toString(),
    email: user.email,
    name: user.name,
  });
  const refreshToken = signRefreshToken(user._id.toString());
  await storeRefreshToken(user._id.toString(), refreshToken);

  return {
    user: sanitizeUser(user),
    accessToken,
    refreshToken,
  };
}

export async function login(input: LoginInput) {
  const user = await getUserByEmail(input.email);
  if (!user) {
    throw new AppError(401, 'UNAUTHORIZED');
  }

  const valid = await bcrypt.compare(input.password, user.passwordHash);
  if (!valid) {
    throw new AppError(401, 'UNAUTHORIZED');
  }

  const accessToken = signAccessToken({
    _id: user._id.toString(),
    email: user.email,
    name: user.name,
  });
  const refreshToken = signRefreshToken(user._id.toString());
  await storeRefreshToken(user._id.toString(), refreshToken);

  return {
    user: sanitizeUser(user),
    accessToken,
    refreshToken,
  };
}

export async function refresh(refreshToken: string) {
  let userId: string;
  try {
    ({ userId } = verifyRefreshToken(refreshToken));
  } catch {
    throw new AppError(401, 'REFRESH_TOKEN_INVALID');
  }

  const match = await findMatchingRefreshToken(userId, refreshToken);
  if (!match) {
    await revokeAllRefreshTokens(userId);
    throw new AppError(401, 'REFRESH_TOKEN_INVALID');
  }

  const newRefreshToken = await rotateRefreshToken(userId, refreshToken);
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(401, 'REFRESH_TOKEN_INVALID');
  }

  const accessToken = signAccessToken({
    _id: user._id.toString(),
    email: user.email,
    name: user.name,
  });

  return { accessToken, refreshToken: newRefreshToken };
}

export async function logout(userId: string, refreshToken?: string) {
  if (refreshToken) {
    const user = await User.findById(userId);
    if (user) {
      for (const entry of user.refreshTokens) {
        const match = await bcrypt.compare(refreshToken, entry.tokenHash);
        if (match) {
          await User.findByIdAndUpdate(userId, {
            $pull: { refreshTokens: { tokenHash: entry.tokenHash } },
          });
          return;
        }
      }
    }
  }
  await revokeAllRefreshTokens(userId);
}
