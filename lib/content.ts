import fs from 'fs'
import path from 'path'
import { PrismaClient } from '@prisma/client'

const contentDir = path.join(process.cwd(), 'content')
const prisma = new PrismaClient()

export interface RobotMetadata {
  slug: string
  name: string
  category: string
  year: number
  description: string
  mainImage: string
  features?: string[]
}

export interface RobotData extends RobotMetadata {
  specs: Array<{ label: string; value: string }>
  fullDescription: string
  gallery: string[]
}

export interface NoticiasMetadata {
  slug: string
  title: string
  date: string
  category: string
  excerpt: string
  mainImage: string
}

export interface NoticiaData extends NoticiasMetadata {
  content: string
  photos?: string[]
}

/**
 * Lee todos los robots APROBADOS desde la base de datos
 */
export async function getAllRobotsFromDB(): Promise<RobotMetadata[]> {
  try {
    const robots = await prisma.robotSubmission.findMany({
      where: { status: 'approved' },
      orderBy: { submittedAt: 'desc' },
    })
    
    return robots.map(r => ({
      slug: r.slug,
      name: r.name,
      category: r.category || 'General',
      year: r.yearCreated || new Date().getFullYear(),
      description: r.description || '',
      mainImage: r.mainImage || '/images/default.jpg',
      features: r.sensors ? [r.sensors] : [],
    }))
  } catch (error) {
    console.error('⚠️ Error reading robots from DB (will use filesystem fallback):', error instanceof Error ? error.message : String(error))
    return []
  }
}

/**
 * Lee un robot APROBADO específico desde la base de datos
 */
export async function getRobotBySlugFromDB(slug: string): Promise<RobotData | null> {
  try {
    const robot = await prisma.robotSubmission.findUnique({
      where: { slug },
    })
    
    if (!robot || robot.status !== 'approved') {
      return null
    }
    
    // Construir specs desde los campos del robot
    const specs: Array<{ label: string; value: string }> = []
    
    if (robot.category) specs.push({ label: 'Categoría', value: robot.category })
    if (robot.mainBoard) specs.push({ label: 'Placa electrónica', value: robot.mainBoard })
    if (robot.weight) specs.push({ label: 'Peso', value: robot.weight })
    if (robot.dimensions) specs.push({ label: 'Dimensiones', value: robot.dimensions })
    if (robot.maxSpeed) specs.push({ label: 'Velocidad máxima', value: robot.maxSpeed })
    if (robot.sensors) specs.push({ label: 'Sensores', value: robot.sensors })
    if (robot.battery) specs.push({ label: 'Batería', value: robot.battery })
    if (robot.motors) specs.push({ label: 'Motores', value: robot.motors })
    if (robot.achievements) specs.push({ label: 'Logros', value: robot.achievements })
    
    return {
      slug: robot.slug,
      name: robot.name,
      category: robot.category || 'General',
      year: robot.yearCreated || new Date().getFullYear(),
      description: robot.description || '',
      mainImage: robot.mainImage || '/images/default.jpg',
      features: robot.sensors ? [robot.sensors] : [],
      specs,
      fullDescription: robot.description || '',
      gallery: Array.isArray(robot.photos) ? robot.photos : [],
    }
  } catch (error) {
    console.error('⚠️ Error reading robot from DB (will use filesystem fallback):', error instanceof Error ? error.message : String(error))
    return null
  }
}

/**
 * Lee todos los robots desde content/robots/ (legacy filesystem)
 */
export function getAllRobots(): RobotMetadata[] {
  const robotsDir = path.join(contentDir, 'robots')
  
  if (!fs.existsSync(robotsDir)) return []
  
  const folders = fs.readdirSync(robotsDir).filter(f => 
    fs.statSync(path.join(robotsDir, f)).isDirectory()
  )

  return folders
    .map(folder => {
      const metadataPath = path.join(robotsDir, folder, 'metadata.json')
      if (!fs.existsSync(metadataPath)) return null
      
      const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'))
      return metadata
    })
    .filter(Boolean)
}

/**
 * Lee un robot específico con todas sus especificaciones (legacy filesystem)
 */
export function getRobotBySlug(slug: string): RobotData | null {
  const robotDir = path.join(contentDir, 'robots', slug)
  
  if (!fs.existsSync(robotDir)) return null
  
  const metadataPath = path.join(robotDir, 'metadata.json')
  
  if (!fs.existsSync(metadataPath)) return null
  
  const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'))
  
  // Intenta leer specs del metadata.json (nuevo formato)
  // Si no existen, intenta leer de especificaciones.json (formato antiguo)
  let specs = metadata.specs || []
  if (!specs || specs.length === 0) {
    const specsPath = path.join(robotDir, 'especificaciones.json')
    if (fs.existsSync(specsPath)) {
      try {
        const specsFile = JSON.parse(fs.readFileSync(specsPath, 'utf-8'))
        specs = specsFile || []
      } catch {
        specs = []
      }
    }
  }
  
  // Cargar galería de imágenes desde content/robots/[slug]/images/
  const imagesDir = path.join(robotDir, 'images')
  let gallery: string[] = []
  
  if (fs.existsSync(imagesDir)) {
    const files = fs.readdirSync(imagesDir)
    gallery = files
      .filter(file => /\.(png|jpg|jpeg|webp)$/i.test(file))
      .map(file => `images/${file}`)
      .sort()
  }
  
  return {
    ...metadata,
    specs: Array.isArray(specs) ? specs : [],
    fullDescription: metadata.fullDescription || '',
    gallery: gallery,
  }
}

/**
 * Lee todas las noticias PUBLICADAS desde la base de datos
 */
export async function getAllNoticiasFromDB(): Promise<NoticiasMetadata[]> {
  try {
    const noticias = await prisma.news.findMany({
      where: { status: 'published' },
      orderBy: { date: 'desc' },
    })
    
    return noticias.map(n => ({
      slug: n.slug,
      title: n.title,
      date: n.date ? new Date(n.date).toLocaleDateString('es-ES') : new Date().toLocaleDateString('es-ES'),
      category: n.category || 'General',
      excerpt: n.excerpt || '',
      mainImage: n.mainImage || '/images/default.jpg',
    }))
  } catch (error) {
    console.error('⚠️ Error reading noticias from DB (will use filesystem fallback):', error instanceof Error ? error.message : String(error))
    return []
  }
}

/**
 * Lee una noticia PUBLICADA específica desde la base de datos
 */
export async function getNoticiaBySlugFromDB(slug: string): Promise<NoticiaData | null> {
  try {
    const noticia = await prisma.news.findUnique({
      where: { slug },
    })
    
    if (!noticia || noticia.status !== 'published') {
      return null
    }
    
    return {
      slug: noticia.slug,
      title: noticia.title,
      date: noticia.date ? new Date(noticia.date).toLocaleDateString('es-ES') : new Date().toLocaleDateString('es-ES'),
      category: noticia.category || 'General',
      excerpt: noticia.excerpt || '',
      mainImage: noticia.mainImage || '/images/default.jpg',
      content: noticia.content || '',
      photos: Array.isArray(noticia.photos) ? noticia.photos : [],
    }
  } catch (error) {
    console.error('⚠️ Error reading noticia from DB (will use filesystem fallback):', error instanceof Error ? error.message : String(error))
    return null
  }
}

/**
 * Lee todas las noticias desde content/noticias/
 */
export function getAllNoticias(): NoticiasMetadata[] {
  const noticiasDir = path.join(contentDir, 'noticias')
  
  if (!fs.existsSync(noticiasDir)) return []
  
  const folders = fs.readdirSync(noticiasDir).filter(f => 
    fs.statSync(path.join(noticiasDir, f)).isDirectory()
  )

  return folders
    .map(folder => {
      const metadataPath = path.join(noticiasDir, folder, 'metadata.json')
      if (!fs.existsSync(metadataPath)) return null
      
      const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'))
      return metadata
    })
    .filter(Boolean)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

/**
 * Lee una noticia específica con su contenido Markdown
 */
export function getNoticiaBySlug(slug: string): NoticiaData | null {
  const noticiaDir = path.join(contentDir, 'noticias', slug)
  
  if (!fs.existsSync(noticiaDir)) return null
  
  const metadataPath = path.join(noticiaDir, 'metadata.json')
  const contentPath = path.join(noticiaDir, 'content.md')
  
  if (!fs.existsSync(metadataPath) || !fs.existsSync(contentPath)) return null
  
  const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'))
  const content = fs.readFileSync(contentPath, 'utf-8')
  
  return {
    ...metadata,
    content,
  }
}

/**
 * Obtiene la ruta de una imagen desde el slug del robot/noticia
 */
export function getImagePath(type: 'robots' | 'noticias', slug: string, imageName: string): string {
  return `/content/${type}/${slug}/images/${imageName}`
}
