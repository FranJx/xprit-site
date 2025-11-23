import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import prisma from '../../../lib/prisma';
import path from 'path';
import fs from 'fs';

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

    // Only admin can reject robots
    if (!decoded.isAdmin) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { robotId, comments } = req.body;

    if (!robotId) {
      return res.status(400).json({ message: 'Robot ID is required' });
    }

    // Get robot to delete its images
    const robot = await prisma.robotSubmission.findUnique({
      where: { id: robotId },
    });

    if (robot) {
      // Delete main image
      if (robot.mainImage) {
        const imagePath = path.join(process.cwd(), 'public', robot.mainImage);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }

      // Delete additional photos
      for (const photo of robot.photos) {
        const photoPath = path.join(process.cwd(), 'public', photo);
        if (fs.existsSync(photoPath)) {
          fs.unlinkSync(photoPath);
        }
      }
    }

    // Delete robot from database
    await prisma.robotSubmission.delete({
      where: { id: robotId },
    });

    return res.status(200).json({
      message: 'Robot rejected and deleted',
    });
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    console.error('Rejection error:', error);
    return res.status(500).json({ message: 'Error rejecting robot' });
  }
}
