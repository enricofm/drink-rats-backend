import express from 'express';
import {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
} from './postsController';
import { authenticate } from '../auth/authMiddleware';

const router = express.Router();

// All post routes require authentication
router.get('/', authenticate, getPosts);
router.get('/:id', authenticate, getPost);
router.post('/', authenticate, createPost);
router.put('/:id', authenticate, updatePost);
router.delete('/:id', authenticate, deletePost);

export default router;
