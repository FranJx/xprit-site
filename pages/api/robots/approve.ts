import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import prisma from '../../../lib/prisma';
import { mkdir, writeFile } from 'fs/promises';
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

    // Only admin can approve robots
    if (!decoded.isAdmin) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { robotId, comments } = req.body;

    if (!robotId) {
      return res.status(400).json({ message: 'Robot ID is required' });
    }

    // Get robot from database
    const robot = await prisma.robotSubmission.findUnique({
      where: { id: robotId },
    });

    if (!robot) {
      return res.status(404).json({ message: 'Robot not found' });
    }

    // Generate slug from robot name
    const slug = robot.name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

    // Create robot directory in /content/robots/
    const robotDir = path.join(process.cwd(), 'content/robots', slug);
    await mkdir(robotDir, { recursive: true });

    // Create images subdirectory
    const imagesDir = path.join(robotDir, 'images');
    await mkdir(imagesDir, { recursive: true });

    // Copy images from submissions to robot directory
    const mainImageFilename = robot.mainImage?.split('/').pop();
    if (robot.mainImage && mainImageFilename) {
      const sourceImagePath = path.join(process.cwd(), 'public', robot.mainImage);
      const destImagePath = path.join(imagesDir, mainImageFilename);
      
      if (fs.existsSync(sourceImagePath)) {
        const fileContent = fs.readFileSync(sourceImagePath);
        await writeFile(destImagePath, fileContent);
      }
    }

    // Copy additional photos
    const photoFiles: string[] = [];
    for (const photo of robot.photos) {
      const photoFilename = photo.split('/').pop();
      if (photoFilename) {
        const sourcePhotoPath = path.join(process.cwd(), 'public', photo);
        const destPhotoPath = path.join(imagesDir, photoFilename);
        
        if (fs.existsSync(sourcePhotoPath)) {
          const fileContent = fs.readFileSync(sourcePhotoPath);
          await writeFile(destPhotoPath, fileContent);
          photoFiles.push(`/images/${photoFilename}`);
        }
      }
    }

    // Create metadata.json
    const metadata = {
      slug,
      name: robot.name,
      category: robot.category,
      year: robot.yearCreated,
      description: robot.description || '',
      mainImage: `/images/${mainImageFilename || 'main.jpg'}`,
      features: [
        robot.battery && `Batería: ${robot.battery}`,
        robot.motors && `Motores: ${robot.motors}`,
      ].filter(Boolean),
    };

    const metadataPath = path.join(robotDir, 'metadata.json');
    await writeFile(metadataPath, JSON.stringify(metadata, null, 2));

    // Create especificaciones.json (empty specs for now)
    const specsPath = path.join(robotDir, 'especificaciones.json');
    await writeFile(specsPath, JSON.stringify({}, null, 2));

    // Update robot in database - mark as approved with slug
    const updatedRobot = await prisma.robotSubmission.update({
      where: { id: robotId },
      data: {
        status: 'approved',
        slug,
        comments: comments || '',
        reviewedAt: new Date(),
        reviewedBy: decoded.username,
      },
    });

    // Delete robot from database to free space
    await prisma.robotSubmission.delete({
      where: { id: robotId },
    });

    return res.status(200).json({
      message: 'Robot approved and saved to repository',
      data: updatedRobot,
    });
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    console.error('Approval error:', error);
    
    // Si es error de Prisma (DB), devolver error amigable
    if (error instanceof Error && (error.message.includes('Prisma') || error.message.includes('P'))) {
      return res.status(503).json({ 
        message: 'Database temporarily unavailable. Please try again later.',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }

    return res.status(500).json({ 
      message: 'Error approving robot',
      error: process.env.NODE_ENV === 'development' ? String(error) : undefined
    });
  }
}
