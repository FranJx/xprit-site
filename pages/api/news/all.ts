import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import prisma from '../../../lib/prisma';

interface DecodedToken {
  username: string;
  isAdmin: boolean;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
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

    // Only admin can view all news
    if (!decoded.isAdmin) {
      return res.status(403).json({ message: 'Access denied' });
    }

    console.log(`📰 Loading all news articles...`);

    // Get all news (draft + published)
    const allNews = await prisma.news.findMany({
      orderBy: { date: 'desc' },
    });

    console.log(`✓ Found ${allNews.length} news articles`);

    return res.status(200).json({
      message: 'News loaded',
      data: allNews,
    });
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    console.error('Get all news error:', error);
    return res.status(500).json({
      message: 'Error loading news',
      error: process.env.NODE_ENV === 'development' ? String(error) : undefined,
    });
  }
}
