import express from 'express';
import cors from 'cors';
import authRoutes from './auth/authRoutes';
import postsRoutes from './posts/postsRoutes';
import { authenticate } from './auth/authMiddleware';
import { updateProfile } from './auth/authController';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Public routes
app.use('/auth', authRoutes);

// Protected routes
app.use('/posts', postsRoutes);
app.put('/profile', authenticate, updateProfile);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`📝 Health check: http://localhost:${PORT}/health`);
});

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
