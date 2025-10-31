import type { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getPosts = async (req: Request, res: Response) => {
  try {
    const posts = await prisma.post.findMany({
      include: { user: true },
      orderBy: { createdAt: 'desc' },
    });

    const formattedPosts = posts.map((post) => ({
      id: post.id,
      userId: post.userId,
      userName: post.user.name,
      userAvatar: post.user.avatar,
      beerName: post.beerName,
      place: post.place,
      rating: post.rating,
      notes: post.notes,
      imageUrl: post.imageUrl,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
    }));

    res.json(formattedPosts);
  } catch (err) {
    res.status(400).json({ error: String(err) });
  }
};

export const getPost = async (req: Request, res: Response) => {
  try {
    const post = await prisma.post.findUnique({
      where: { id: req.params.id },
      include: { user: true },
    });

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const formattedPost = {
      id: post.id,
      userId: post.userId,
      userName: post.user.name,
      userAvatar: post.user.avatar,
      beerName: post.beerName,
      place: post.place,
      rating: post.rating,
      notes: post.notes,
      imageUrl: post.imageUrl,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
    };

    res.json(formattedPost);
  } catch (err) {
    res.status(400).json({ error: String(err) });
  }
};

export const createPost = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { beerName, place, rating, notes, imageUri } = req.body;

    const post = await prisma.post.create({
      data: {
        userId,
        beerName,
        place,
        rating,
        notes,
        imageUrl: imageUri,
      },
      include: { user: true },
    });

    const formattedPost = {
      id: post.id,
      userId: post.userId,
      userName: post.user.name,
      userAvatar: post.user.avatar,
      beerName: post.beerName,
      place: post.place,
      rating: post.rating,
      notes: post.notes,
      imageUrl: post.imageUrl,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
    };

    res.json(formattedPost);
  } catch (err) {
    res.status(400).json({ error: String(err) });
  }
};

export const updatePost = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { id } = req.params;
    const { beerName, place, rating, notes, imageUri } = req.body;

    const existingPost = await prisma.post.findUnique({ where: { id } });
    if (!existingPost) {
      return res.status(404).json({ error: 'Post not found' });
    }
    if (existingPost.userId !== userId) {
      return res
        .status(403)
        .json({ error: 'Not authorized to update this post' });
    }

    const post = await prisma.post.update({
      where: { id },
      data: {
        ...(beerName && { beerName }),
        ...(place && { place }),
        ...(rating && { rating }),
        ...(notes && { notes }),
        ...(imageUri && { imageUrl: imageUri }),
      },
      include: { user: true },
    });

    const formattedPost = {
      id: post.id,
      userId: post.userId,
      userName: post.user.name,
      userAvatar: post.user.avatar,
      beerName: post.beerName,
      place: post.place,
      rating: post.rating,
      notes: post.notes,
      imageUrl: post.imageUrl,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
    };

    res.json(formattedPost);
  } catch (err) {
    res.status(400).json({ error: String(err) });
  }
};

export const deletePost = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { id } = req.params;

    const existingPost = await prisma.post.findUnique({ where: { id } });
    if (!existingPost) {
      return res.status(404).json({ error: 'Post not found' });
    }
    if (existingPost.userId !== userId) {
      return res
        .status(403)
        .json({ error: 'Not authorized to delete this post' });
    }

    await prisma.post.delete({ where: { id } });
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: String(err) });
  }
};
