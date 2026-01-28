import { Router } from 'express';
import {
  signup,
  login,
  forgotPassword,
  resetPassword
} from '../controllers/auth.controller';

const router = Router();

// POST /api/auth/signup - Register new user
router.post('/signup', signup);

// POST /api/auth/login - Login user
router.post('/login', login);

// POST /api/auth/forgot-password - Request password reset
router.post('/forgot-password', forgotPassword);

// POST /api/auth/reset-password - Reset password with token
router.post('/reset-password', resetPassword);

export default router;