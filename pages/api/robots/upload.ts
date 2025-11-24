import { NextApiRequest, NextApiResponse } from 'next';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import jwt from 'jsonwebtoken';
import prisma from '../../../lib/prisma';
import { IncomingForm } from 'formidable';
import fs from 'fs';

interface DecodedToken {
  username: string;
  isAdmin: boolean;
}

export const config = {
  api: {
    bodyParser: false,
  },
};

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

    // Parse form data
    const form = new IncomingForm({
      multiples: true,
      maxFileSize: 100 * 1024 * 1024, // 100MB
    });

    const [fields, files] = await form.parse(req);

    const name = Array.isArray(fields.name) ? fields.name[0] : fields.name;
    const battery = Array.isArray(fields.battery) ? fields.battery[0] : fields.battery;
    const category = Array.isArray(fields.category) ? fields.category[0] : fields.category;
    const motors = Array.isArray(fields.motors) ? fields.motors[0] : fields.motors;
    const yearCreated = Array.isArray(fields.yearCreated) ? fields.yearCreated[0] : fields.yearCreated;
    const description = Array.isArray(fields.description) ? fields.description[0] : fields.description;
    const mainBoard = Array.isArray(fields.mainBoard) ? fields.mainBoard[0] : fields.mainBoard;
    const weight = Array.isArray(fields.weight) ? fields.weight[0] : fields.weight;
    const dimensions = Array.isArray(fields.dimensions) ? fields.dimensions[0] : fields.dimensions;
    const maxSpeed = Array.isArray(fields.maxSpeed) ? fields.maxSpeed[0] : fields.maxSpeed;
    const sensors = Array.isArray(fields.sensors) ? fields.sensors[0] : fields.sensors;
    const achievements = Array.isArray(fields.achievements) ? fields.achievements[0] : fields.achievements;
    const submittedBy = Array.isArray(fields.submittedBy) ? fields.submittedBy[0] : fields.submittedBy;

    // Validate required fields
    if (!name || !category) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Handle image uploads
    const imageUrls: string[] = [];
    
    if (files.images) {
      const submissionsDir = path.join(process.cwd(), 'public/content/robots/submissions');
      
      // Create directory if it doesn't exist
      try {
        await mkdir(submissionsDir, { recursive: true });
        console.log(`✓ Submissions dir created/verified: ${submissionsDir}`);
      } catch (mkdirError) {
        console.error('❌ Failed to create submissions directory:', mkdirError);
      }

      const imageFiles = Array.isArray(files.images) ? files.images : [files.images];

      for (const file of imageFiles) {
        try {
          const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}-${file.originalFilename}`;
          const filepath = path.join(submissionsDir, filename);
          
          // Copy file from temp location to permanent location
          const fileContent = fs.readFileSync(file.filepath);
          await writeFile(filepath, fileContent);
          
          // Verify file was written
          if (fs.existsSync(filepath)) {
            const stats = fs.statSync(filepath);
            console.log(`✓ Image saved: ${filepath} (${stats.size} bytes)`);
            // Store path that works in Next.js (public prefix not needed for browser)
            imageUrls.push(`/content/robots/submissions/${filename}`);
          } else {
            console.error(`❌ File not found after write: ${filepath}`);
          }
        } catch (fileError) {
          console.error(`❌ Failed to save image ${file.originalFilename}:`, fileError);
        }
      }
    }

    if (imageUrls.length === 0) {
      return res.status(400).json({ message: 'At least one image is required' });
    }

    // Create robot submission in database
    // Generate slug from robot name
    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

    const newRobot = await prisma.robotSubmission.create({
      data: {
        name,
        slug: slug, // Set slug immediately
        battery: battery || null,
        category,
        motors: motors || null,
        yearCreated: yearCreated ? parseInt(yearCreated as string) : new Date().getFullYear(),
        description: description || null,
        mainBoard: mainBoard || null,
        weight: weight || null,
        dimensions: dimensions || null,
        maxSpeed: maxSpeed || null,
        sensors: sensors || null,
        achievements: achievements || null,
        mainImage: imageUrls[0] || null,
        photos: imageUrls.slice(1),
        status: 'pending',
        submittedBy: submittedBy || decoded.username,
        comments: null,
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

    console.error('Upload error:', error);
    
    // Si es error de Prisma (DB), devolver error amigable
    if (error instanceof Error && (error.message.includes('Prisma') || error.message.includes('P'))) {
      console.warn('⚠️ Database error during upload');
      return res.status(503).json({ 
        message: 'Database temporarily unavailable. Please try again later.',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }

    return res.status(500).json({ 
      message: 'Error submitting robot',
      error: process.env.NODE_ENV === 'development' ? String(error) : undefined
    });
  }
}
