import fs from 'fs'
import path from 'path'

const contentDir = path.join(process.cwd(), 'content')

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
}

/**
 * Lee todos los robots desde content/robots/
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
 * Lee un robot específico con todas sus especificaciones
 */
export function getRobotBySlug(slug: string): RobotData | null {
  const robotDir = path.join(contentDir, 'robots', slug)
  
  if (!fs.existsSync(robotDir)) return null
  
  const metadataPath = path.join(robotDir, 'metadata.json')
  const specsPath = path.join(robotDir, 'especificaciones.json')
  
  if (!fs.existsSync(metadataPath) || !fs.existsSync(specsPath)) return null
  
  const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'))
  const specs = JSON.parse(fs.readFileSync(specsPath, 'utf-8'))
  
  return {
    ...metadata,
    specs: Array.isArray(specs) ? specs : specs.specs || [],
    fullDescription: specs.description || '',
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
