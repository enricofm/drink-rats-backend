import type { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const sendFriendRequest = async (req: Request, res: Response) => {
  try {
    const senderId = (req as any).user.id;
    const { receiverId } = req.body;

    if (!receiverId) {
      return res.status(400).json({ error: 'Receiver ID is required' });
    }

    if (senderId === receiverId) {
      return res
        .status(400)
        .json({ error: 'Cannot send friend request to yourself' });
    }

    const receiver = await prisma.user.findUnique({
      where: { id: receiverId },
    });
    if (!receiver) {
      return res.status(404).json({ error: 'User not found' });
    }

    const existingFriendship = await prisma.friendship.findFirst({
      where: {
        OR: [
          { senderId, receiverId },
          { senderId: receiverId, receiverId: senderId },
        ],
      },
    });

    if (existingFriendship) {
      return res
        .status(400)
        .json({ error: 'Friendship request already exists' });
    }

    const friendship = await prisma.friendship.create({
      data: {
        senderId,
        receiverId,
        status: 'pending',
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
    });

    res.json({
      id: friendship.id,
      senderId: friendship.senderId,
      receiverId: friendship.receiverId,
      status: friendship.status,
      createdAt: friendship.createdAt.toISOString(),
      sender: friendship.sender,
      receiver: friendship.receiver,
    });
  } catch (err) {
    res.status(400).json({ error: String(err) });
  }
};

export const acceptFriendRequest = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { friendshipId } = req.params;

    const friendship = await prisma.friendship.findUnique({
      where: { id: friendshipId },
    });

    if (!friendship) {
      return res.status(404).json({ error: 'Friend request not found' });
    }

    if (friendship.receiverId !== userId) {
      return res
        .status(403)
        .json({ error: 'Not authorized to accept this request' });
    }

    if (friendship.status === 'accepted') {
      return res.status(400).json({ error: 'Friend request already accepted' });
    }

    const updatedFriendship = await prisma.friendship.update({
      where: { id: friendshipId },
      data: { status: 'accepted' },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
    });

    res.json({
      id: updatedFriendship.id,
      senderId: updatedFriendship.senderId,
      receiverId: updatedFriendship.receiverId,
      status: updatedFriendship.status,
      createdAt: updatedFriendship.createdAt.toISOString(),
      sender: updatedFriendship.sender,
      receiver: updatedFriendship.receiver,
    });
  } catch (err) {
    res.status(400).json({ error: String(err) });
  }
};

export const removeFriendship = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { friendshipId } = req.params;

    const friendship = await prisma.friendship.findUnique({
      where: { id: friendshipId },
    });

    if (!friendship) {
      return res.status(404).json({ error: 'Friendship not found' });
    }

    if (friendship.senderId !== userId && friendship.receiverId !== userId) {
      return res
        .status(403)
        .json({ error: 'Not authorized to remove this friendship' });
    }

    await prisma.friendship.delete({
      where: { id: friendshipId },
    });

    res.json({ success: true, message: 'Friendship removed' });
  } catch (err) {
    res.status(400).json({ error: String(err) });
  }
};

export const getFriends = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const friendships = await prisma.friendship.findMany({
      where: {
        OR: [
          { senderId: userId, status: 'accepted' },
          { receiverId: userId, status: 'accepted' },
        ],
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
    });

    const friends = friendships.map((friendship) => {
      const friend =
        friendship.senderId === userId
          ? friendship.receiver
          : friendship.sender;
      return {
        friendshipId: friendship.id,
        friend,
        createdAt: friendship.createdAt.toISOString(),
      };
    });

    res.json(friends);
  } catch (err) {
    res.status(400).json({ error: String(err) });
  }
};

export const getPendingRequests = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const pendingRequests = await prisma.friendship.findMany({
      where: {
        receiverId: userId,
        status: 'pending',
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const formattedRequests = pendingRequests.map((request) => ({
      friendshipId: request.id,
      sender: request.sender,
      createdAt: request.createdAt.toISOString(),
    }));

    res.json(formattedRequests);
  } catch (err) {
    res.status(400).json({ error: String(err) });
  }
};

export const getSentRequests = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const sentRequests = await prisma.friendship.findMany({
      where: {
        senderId: userId,
        status: 'pending',
      },
      include: {
        receiver: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const formattedRequests = sentRequests.map((request) => ({
      friendshipId: request.id,
      receiver: request.receiver,
      createdAt: request.createdAt.toISOString(),
    }));

    res.json(formattedRequests);
  } catch (err) {
    res.status(400).json({ error: String(err) });
  }
};

export const searchUsers = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { query } = req.query;

    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const users = await prisma.user.findMany({
      where: {
        AND: [
          { id: { not: userId } },
          {
            OR: [{ name: { contains: query } }, { email: { contains: query } }],
          },
        ],
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
      },
      take: 20,
    });

    const userIds = users.map((u) => u.id);
    const friendships = await prisma.friendship.findMany({
      where: {
        OR: [
          { senderId: userId, receiverId: { in: userIds } },
          { senderId: { in: userIds }, receiverId: userId },
        ],
      },
    });

    const usersWithStatus = users.map((user) => {
      const friendship = friendships.find(
        (f) =>
          (f.senderId === userId && f.receiverId === user.id) ||
          (f.senderId === user.id && f.receiverId === userId)
      );

      let friendshipStatus = 'none';
      if (friendship) {
        if (friendship.status === 'accepted') {
          friendshipStatus = 'friends';
        } else if (friendship.senderId === userId) {
          friendshipStatus = 'request_sent';
        } else {
          friendshipStatus = 'request_received';
        }
      }

      return {
        ...user,
        friendshipStatus,
        friendshipId: friendship?.id,
      };
    });

    res.json(usersWithStatus);
  } catch (err) {
    res.status(400).json({ error: String(err) });
  }
};
