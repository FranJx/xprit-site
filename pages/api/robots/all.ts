import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import prisma from '../../../lib/prisma';
import fs from 'fs';
import path from 'path';

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

    // Only admin can view all robots
    if (!decoded.isAdmin) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Get pending robots from database
    const pendingRobots = await prisma.robotSubmission.findMany({
      where: { status: 'pending' },
      orderBy: { submittedAt: 'desc' },
    });

    // Get approved robots from /content/robots/ directory
    const approvedRobots: any[] = [];
    const robotsDir = path.join(process.cwd(), 'content/robots');

    if (fs.existsSync(robotsDir)) {
      const dirs = fs.readdirSync(robotsDir);
      
      for (const dir of dirs) {
        const metadataPath = path.join(robotsDir, dir, 'metadata.json');
        if (fs.existsSync(metadataPath)) {
          try {
            const metadataContent = fs.readFileSync(metadataPath, 'utf-8');
            const metadata = JSON.parse(metadataContent);
            approvedRobots.push({
              id: dir, // Use slug as ID for approved robots
              slug: dir,
              name: metadata.name,
              category: metadata.category,
              yearCreated: metadata.year,
              description: metadata.description,
              mainImage: metadata.mainImage,
              photos: metadata.specs ? [] : [],
              status: 'approved',
              submittedBy: 'system',
              submittedAt: new Date().toISOString(),
            });
          } catch (parseError) {
            console.error(`Failed to parse metadata for ${dir}:`, parseError);
          }
        }
      }
    }

    const allRobots = [...pendingRobots, ...approvedRobots];

    return res.status(200).json({
      message: 'Robots loaded',
      data: allRobots,
    });
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    console.error('Get all robots error:', error);
    return res.status(500).json({
      message: 'Error loading robots',
      error: process.env.NODE_ENV === 'development' ? String(error) : undefined,
    });
  }
}
