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

    const { name, slug, battery, category, motors, yearCreated, description, mainImage, photos, submittedBy } = req.body;

    // Validate required fields
    if (!name || !slug || !category) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    if (!mainImage) {
      return res.status(400).json({ message: 'Main image is required' });
    }

    // Check if slug already exists
    const existingRobot = await prisma.robotSubmission.findUnique({
      where: { slug },
    });

    if (existingRobot) {
      return res.status(409).json({ message: 'Robot con este slug ya existe' });
    }

    // Create robot submission
    const newRobot = await prisma.robotSubmission.create({
      data: {
        name,
        slug,
        battery: battery || null,
        category,
        motors: motors || null,
        yearCreated: yearCreated ? parseInt(yearCreated) : new Date().getFullYear(),
        description: description || null,
        mainImage,
        photos: photos || [],
        status: 'pending',
        submittedBy: submittedBy || decoded.username,
      },
    });

    return res.status(201).json({
      message: 'Robot submitted successfully',
      data: newRobot,
    });
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    console.error('Submission error:', error);
    return res.status(500).json({ message: 'Error submitting robot' });
  } finally {
    // Prisma is managed globally
  }
}
