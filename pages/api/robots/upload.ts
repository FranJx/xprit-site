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

    console.log('📋 Parsing form data...');
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
      console.error('❌ Missing required fields');
      return res.status(400).json({ message: 'Missing required fields: name, category' });
    }

    if (!files.images) {
      console.error('❌ No images uploaded');
      return res.status(400).json({ message: 'At least one image is required' });
    }

    // Generate slug
    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

    console.log(`📝 Robot slug: ${slug}`);

    // Create directory structure in /public/content/robots/
    const robotDir = path.join(process.cwd(), 'public/content/robots', slug);
    const imagesDir = path.join(robotDir, 'images');

    console.log(`📁 Creating directories...`);
    console.log(`   - Robot dir: ${robotDir}`);
    console.log(`   - Images dir: ${imagesDir}`);

    try {
      await mkdir(imagesDir, { recursive: true });
      console.log(`✓ Directories created successfully`);
    } catch (mkdirError) {
      console.error('❌ Failed to create directories:', mkdirError);
      return res.status(500).json({ message: 'Failed to create directories' });
    }

    // Save images
    const imageUrls: string[] = [];
    const imageFiles = Array.isArray(files.images) ? files.images : [files.images];

    console.log(`📸 Processing ${imageFiles.length} images...`);

    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i];
      try {
        // Generate unique filename
        const ext = path.extname(file.originalFilename || '.jpg');
        const filename = `img-${i + 1}${ext}`;
        const filepath = path.join(imagesDir, filename);

        console.log(`   - Saving image ${i + 1}: ${filename}`);

        // Read from temp location and write to final location
        const fileContent = fs.readFileSync(file.filepath);
        await writeFile(filepath, fileContent);

        // Verify file exists
        if (fs.existsSync(filepath)) {
          const stats = fs.statSync(filepath);
          console.log(`   ✓ Saved successfully (${stats.size} bytes)`);
          // Store relative path from public
          imageUrls.push(`/content/robots/${slug}/images/${filename}`);
        } else {
          console.error(`   ❌ File not found after save: ${filepath}`);
        }
      } catch (fileError) {
        console.error(`   ❌ Error saving image:`, fileError);
      }
    }

    if (imageUrls.length === 0) {
      console.error('❌ No images were saved successfully');
      return res.status(500).json({ message: 'Failed to save images' });
    }

    console.log(`✓ All images saved. URLs: ${imageUrls.join(', ')}`);

    // Create robot submission in database
    console.log(`💾 Creating database record...`);

    const newRobot = await prisma.robotSubmission.create({
      data: {
        name,
        slug,
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

    console.log(`✓ Robot submission created: ${newRobot.id}`);

    return res.status(201).json({
      message: 'Robot submitted successfully',
      data: newRobot,
    });
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      console.error('❌ JWT Error:', error.message);
      return res.status(401).json({ message: 'Invalid token' });
    }

    console.error('❌ Upload error:', error);

    return res.status(500).json({
      message: 'Error submitting robot',
      error: process.env.NODE_ENV === 'development' ? String(error) : undefined,
    });
  }
}
