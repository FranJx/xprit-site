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
    console.error('API Error:', error);
    
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    // Si es error de Prisma o conexión, devolver array vacío
    // Esto es temporal hasta que la DB esté configurada en producción
    if (error instanceof Error) {
      console.warn('⚠️ Database error, returning empty list:', error.message);
      return res.status(200).json({
        message: 'Robots fetched successfully (empty - DB unavailable)',
        data: [],
      });
    }

    console.error('Unknown error type:', error);
    return res.status(500).json({ 
      message: 'Error fetching robots',
      error: process.env.NODE_ENV === 'development' ? String(error) : undefined
    });
  } finally {
    // Prisma is managed globally
  }
}
