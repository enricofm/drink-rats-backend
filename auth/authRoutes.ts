import express from 'express';
import { login, register, getCurrentUser } from '../auth/authController';
import { authenticate } from './authMiddleware';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticate, getCurrentUser);

export default router;
