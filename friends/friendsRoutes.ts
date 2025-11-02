import express from 'express';
import {
  sendFriendRequest,
  acceptFriendRequest,
  removeFriendship,
  getFriends,
  getPendingRequests,
  getSentRequests,
  searchUsers,
} from './friendsController';
import { authenticate } from '../auth/authMiddleware';

const router = express.Router();

/**
 * @swagger
 * /friends:
 *   get:
 *     summary: Get all friends (accepted friendships)
 *     tags: [Friends]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of friends
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   friendshipId:
 *                     type: string
 *                   friend:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       email:
 *                         type: string
 *                       avatar:
 *                         type: string
 *                   createdAt:
 *                     type: string
 *       401:
 *         description: Unauthorized
 */
router.get('/', authenticate, getFriends);

/**
 * @swagger
 * /friends/requests/pending:
 *   get:
 *     summary: Get pending friend requests (received)
 *     tags: [Friends]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of pending friend requests
 *       401:
 *         description: Unauthorized
 */
router.get('/requests/pending', authenticate, getPendingRequests);

/**
 * @swagger
 * /friends/requests/sent:
 *   get:
 *     summary: Get sent friend requests
 *     tags: [Friends]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of sent friend requests
 *       401:
 *         description: Unauthorized
 */
router.get('/requests/sent', authenticate, getSentRequests);

/**
 * @swagger
 * /friends/search:
 *   get:
 *     summary: Search for users to add as friends
 *     tags: [Friends]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Search query (name or email)
 *     responses:
 *       200:
 *         description: List of users matching the search query
 *       400:
 *         description: Search query is required
 *       401:
 *         description: Unauthorized
 */
router.get('/search', authenticate, searchUsers);

/**
 * @swagger
 * /friends/request:
 *   post:
 *     summary: Send a friend request
 *     tags: [Friends]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               receiverId:
 *                 type: string
 *                 description: ID of the user to send friend request to
 *     responses:
 *       200:
 *         description: Friend request sent successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.post('/request', authenticate, sendFriendRequest);

/**
 * @swagger
 * /friends/accept/{friendshipId}:
 *   put:
 *     summary: Accept a friend request
 *     tags: [Friends]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: friendshipId
 *         required: true
 *         schema:
 *           type: string
 *         description: Friendship ID
 *     responses:
 *       200:
 *         description: Friend request accepted
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Friend request not found
 */
router.put('/accept/:friendshipId', authenticate, acceptFriendRequest);

/**
 * @swagger
 * /friends/{friendshipId}:
 *   delete:
 *     summary: Remove a friendship or reject a friend request
 *     tags: [Friends]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: friendshipId
 *         required: true
 *         schema:
 *           type: string
 *         description: Friendship ID
 *     responses:
 *       200:
 *         description: Friendship removed successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Friendship not found
 */
router.delete('/:friendshipId', authenticate, removeFriendship);

export default router;
