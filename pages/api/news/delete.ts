import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import prisma from '../../../lib/prisma';

interface DecodedToken {
  username: string;
  isAdmin: boolean;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Verify JWT token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No authorization token' });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as DecodedToken;

    // Only admin can delete news
    if (!decoded.isAdmin) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { newsId } = req.body;

    if (!newsId) {
      return res.status(400).json({ message: 'News ID is required' });
    }

    console.log(`🗑️ Deleting news: ${newsId}`);

    // Get news from database
    const news = await prisma.news.findUnique({
      where: { id: newsId },
    });

    if (!news) {
      return res.status(404).json({ message: 'News not found' });
    }

    console.log(`✓ News found: ${news.title}`);

    // Mark as archived (soft delete)
    console.log(`🗑️ Archiving news...`);
    await prisma.news.update({
      where: { id: newsId },
      data: {
        status: 'archived',
      },
    });

    console.log(`✓ News archived`);

    return res.status(200).json({
      message: 'News deleted successfully',
      newsId,
    });
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    console.error('Delete error:', error);
    return res.status(500).json({
      message: 'Error deleting news',
      error: process.env.NODE_ENV === 'development' ? String(error) : undefined,
    });
  }
}
