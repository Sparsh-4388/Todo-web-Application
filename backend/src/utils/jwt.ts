import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

export const generateToken = (userId: mongoose.Types.ObjectId): string => {
  const jwtSecret = process.env.JWT_SECRET;
  
  if (!jwtSecret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }

  return jwt.sign(
    { userId: userId.toString() },
    jwtSecret,
    { expiresIn: '7d' }
  );
};

export const generateResetToken = (): string => {
  return jwt.sign(
    { purpose: 'password-reset' },
    process.env.JWT_SECRET || 'fallback-secret',
    { expiresIn: '1h' }
  );
};