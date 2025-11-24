import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { rm } from 'fs/promises';
import path from 'path';
import fs from 'fs';
import { PrismaClient } from '@prisma/client';

interface DecodedToken {
  username: string;
  isAdmin: boolean;
}

const prisma = new PrismaClient();

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

    // Only admin can delete robots
    if (!decoded.isAdmin) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { slug } = req.body;

    if (!slug) {
      return res.status(400).json({ message: 'Robot slug is required' });
    }

    // First, find the robot in database
    console.log(`🔍 Looking for robot with slug: ${slug}`);
    const robot = await prisma.robotSubmission.findUnique({
      where: { slug },
    });

    if (!robot) {
      return res.status(404).json({ message: 'Robot not found' });
    }

    console.log(`✓ Found robot: ${robot.name} (ID: ${robot.id})`);

    // Mark robot as deleted in database (soft delete)
    console.log(`🗑️ Marking robot as deleted in database...`);
    await prisma.robotSubmission.update({
      where: { id: robot.id },
      data: {
        status: 'deleted',
      },
    });

    console.log(`✓ Robot marked as deleted in database`);

    // Also try to delete the directory from /content/robots/ if it exists
    const robotDir = path.join(process.cwd(), 'content/robots', slug);
    
    if (fs.existsSync(robotDir)) {
      try {
        await rm(robotDir, { recursive: true, force: true });
        console.log(`✓ Robot directory deleted: ${robotDir}`);
      } catch (error) {
        console.error(`⚠️ Failed to delete robot directory (non-critical): ${robotDir}`, error);
      }
    }

    return res.status(200).json({
      message: 'Robot deleted successfully',
      slug,
    });
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    console.error('Delete error:', error);
    return res.status(500).json({
      message: 'Error deleting robot',
      error: process.env.NODE_ENV === 'development' ? String(error) : undefined,
    });
  }
}
