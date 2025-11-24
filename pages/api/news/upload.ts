import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { v2 as cloudinary } from 'cloudinary';
import formidable from 'formidable';
import prisma from '../../../lib/prisma';
import fs from 'fs';

interface DecodedToken {
  username: string;
  isAdmin: boolean;
}

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const config = {
  api: {
    bodyParser: false,
  },
};

async function parseForm(req: NextApiRequest): Promise<{ fields: formidable.Fields; files: formidable.Files }> {
  const form = formidable({ multiples: true });
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });
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

    // Only admin can upload news
    if (!decoded.isAdmin) {
      return res.status(403).json({ message: 'Access denied - admin only' });
    }

    const { fields, files } = await parseForm(req);

    const title = Array.isArray(fields.title) ? fields.title[0] : fields.title;
    const slug = Array.isArray(fields.slug) ? fields.slug[0] : fields.slug;
    const excerpt = Array.isArray(fields.excerpt) ? fields.excerpt[0] : fields.excerpt;
    const content = Array.isArray(fields.content) ? fields.content[0] : fields.content;
    const category = Array.isArray(fields.category) ? fields.category[0] : 'noticias';

    if (!title || !slug || !content) {
      return res.status(400).json({ message: 'Title, slug, and content are required' });
    }

    console.log(`📰 Creating news article: ${title} (slug: ${slug})`);

    // Check if slug already exists
    const existing = await prisma.news.findUnique({ where: { slug } });
    if (existing) {
      return res.status(400).json({ message: 'Slug already exists' });
    }

    // Upload main image if provided
    let mainImageUrl = null;
    if (files.mainImage) {
      const mainImageFile = Array.isArray(files.mainImage) ? files.mainImage[0] : files.mainImage;
      const fileContent = fs.readFileSync(mainImageFile.filepath);
      
      const result = await new Promise<any>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'xprit-robotics/news',
            public_id: `${slug}-main`,
            resource_type: 'auto',
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(fileContent);
      });
      
      mainImageUrl = result.secure_url;
      console.log(`✓ Main image uploaded: ${mainImageUrl}`);
    }

    // Upload additional photos if provided
    const photoUrls: string[] = [];
    if (files.photos) {
      const photoFiles = Array.isArray(files.photos) ? files.photos : [files.photos];
      
      for (let i = 0; i < photoFiles.length; i++) {
        const photoFile = photoFiles[i];
        const fileContent = fs.readFileSync(photoFile.filepath);
        
        const result = await new Promise<any>((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: 'xprit-robotics/news',
              public_id: `${slug}-photo-${i}`,
              resource_type: 'auto',
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          uploadStream.end(fileContent);
        });

        photoUrls.push(result.secure_url);
        console.log(`✓ Photo ${i + 1} uploaded: ${result.secure_url}`);
      }
    }

    // Create news in database
    console.log(`💾 Creating news record in database...`);
    const news = await prisma.news.create({
      data: {
        title,
        slug,
        excerpt: excerpt || content.substring(0, 160),
        content,
        category,
        mainImage: mainImageUrl,
        photos: photoUrls,
        author: decoded.username,
        status: 'draft',
      },
    });

    console.log(`✓ News created: ${news.id}`);

    return res.status(200).json({
      message: 'News uploaded successfully',
      news: {
        id: news.id,
        title: news.title,
        slug: news.slug,
      },
    });
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    console.error('News upload error:', error);
    return res.status(500).json({
      message: 'Error uploading news',
      error: process.env.NODE_ENV === 'development' ? String(error) : undefined,
    });
  }
}
