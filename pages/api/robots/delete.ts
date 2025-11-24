import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { rm } from 'fs/promises';
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

    // Only admin can delete robots
    if (!decoded.isAdmin) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { slug } = req.body;

    if (!slug) {
      return res.status(400).json({ message: 'Robot slug is required' });
    }

    // Delete robot directory from /content/robots/
    const robotDir = path.join(process.cwd(), 'content/robots', slug);
    
    if (fs.existsSync(robotDir)) {
      try {
        await rm(robotDir, { recursive: true, force: true });
        console.log(`✓ Robot directory deleted: ${robotDir}`);
      } catch (error) {
        console.error(`❌ Failed to delete robot directory: ${robotDir}`, error);
        return res.status(500).json({ message: 'Failed to delete robot directory' });
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
