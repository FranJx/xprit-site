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

    // Only admin can view pending robots
    if (!decoded.isAdmin) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Fetch all robots (pending, approved, rejected)
    const robots = await prisma.robotSubmission.findMany({
      orderBy: [{ status: 'asc' }, { submittedAt: 'desc' }],
    });

    return res.status(200).json({
      message: 'Robots fetched successfully',
      data: robots,
    });
  } catch (error) {
    console.error('Fetch error:', error);
    
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    // Si es error de conexión, devolver array vacío (útil para desarrollo sin DB)
    if (error instanceof Error && error.message.includes('Can\'t reach database')) {
      console.warn('⚠️ Database not accessible, returning empty list');
      return res.status(200).json({
        message: 'Robots fetched successfully (empty - DB not connected)',
        data: [],
      });
    }

    console.error('Full error:', error);
    return res.status(500).json({ message: 'Error fetching robots', error: String(error) });
  } finally {
    // Prisma is managed globally
  }
}
