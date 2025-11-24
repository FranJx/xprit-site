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

    console.log(`🤖 Approving robot: ${robotId}`);

    // Get robot from database
    const robot = await prisma.robotSubmission.findUnique({
      where: { id: robotId },
    });

    if (!robot) {
      return res.status(404).json({ message: 'Robot not found' });
    }

    console.log(`✓ Robot found: ${robot.name} (slug: ${robot.slug})`);

    // Create robot directory in /content/robots/ (different from /public/)
    const robotDir = path.join(process.cwd(), 'content/robots', robot.slug);

    console.log(`📁 Creating content directory: ${robotDir}`);
    await mkdir(robotDir, { recursive: true });

    // Create metadata.json with all specs
    const specs = [
      robot.category && { label: 'Categoría', value: robot.category },
      robot.mainBoard && { label: 'Placa electrónica', value: robot.mainBoard },
      robot.weight && { label: 'Peso', value: robot.weight },
      robot.dimensions && { label: 'Dimensiones', value: robot.dimensions },
      robot.maxSpeed && { label: 'Velocidad máxima', value: robot.maxSpeed },
      robot.sensors && { label: 'Sensores', value: robot.sensors },
      robot.battery && { label: 'Batería', value: robot.battery },
      robot.motors && { label: 'Motores', value: robot.motors },
      robot.achievements && { label: 'Logros', value: robot.achievements },
    ].filter(Boolean);

    const metadata = {
      slug: robot.slug,
      name: robot.name,
      category: robot.category,
      year: robot.yearCreated,
      description: robot.description || '',
      mainImage: robot.mainImage || '/images/default.jpg',
      specs: specs,
      features: [
        robot.battery && `Batería: ${robot.battery}`,
        robot.motors && `Motores: ${robot.motors}`,
      ].filter(Boolean),
    };

    const metadataPath = path.join(robotDir, 'metadata.json');
    await writeFile(metadataPath, JSON.stringify(metadata, null, 2));

    console.log(`✓ Metadata created: ${metadataPath}`);

    // Create symlink or copy images from /public/content/robots/[slug] to /content/robots/[slug]
    const publicRobotDir = path.join(process.cwd(), 'public/content/robots', robot.slug);
    const publicImagesDir = path.join(publicRobotDir, 'images');
    const contentImagesDir = path.join(robotDir, 'images');

    console.log(`📸 Copying images from ${publicImagesDir} to ${contentImagesDir}`);

    if (fs.existsSync(publicImagesDir)) {
      await mkdir(contentImagesDir, { recursive: true });
      const imageFiles = fs.readdirSync(publicImagesDir);
      
      for (const imageFile of imageFiles) {
        const sourceFile = path.join(publicImagesDir, imageFile);
        const destFile = path.join(contentImagesDir, imageFile);
        const fileContent = fs.readFileSync(sourceFile);
        await writeFile(destFile, fileContent);
        console.log(`   ✓ Copied: ${imageFile}`);
      }
    }

    // Delete robot submission from database
    console.log(`🗑️ Deleting submission from database...`);
    await prisma.robotSubmission.delete({
      where: { id: robotId },
    });

    return res.status(200).json({
      message: 'Robot approved successfully',
      slug: robot.slug,
    });
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      console.error('❌ JWT Error:', error.message);
      return res.status(401).json({ message: 'Invalid token' });
    }

    console.error('❌ Approve error:', error);

    return res.status(500).json({
      message: 'Error approving robot',
      error: process.env.NODE_ENV === 'development' ? String(error) : undefined,
    });
  }
}
