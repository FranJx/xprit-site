import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { remark } from 'remark'
import html from 'remark-html'
import { getAllNoticiasFromDB, getNoticiaBySlugFromDB, getAllNoticias, getNoticiaBySlug, NoticiaData } from '../../lib/content'

interface NoticiaPageProps {
  noticia: NoticiaData & { contentHtml: string; photos?: string[] }
}

export async function getStaticPaths() {
  // Intenta cargar noticias desde BD
  let noticias = await getAllNoticiasFromDB()
  
  // Si no hay en BD, carga del filesystem (legacy)
  if (!noticias || noticias.length === 0) {
    console.log('📰 Loading noticia paths from filesystem (database unavailable or empty)')
    noticias = getAllNoticias()
  }
  
  const paths = noticias.map(n => ({ params: { slug: n.slug } }))
  return { paths, fallback: 'blocking' }
}

export async function getStaticProps({ params }: { params: { slug: string } }) {
  // Intenta cargar noticia publicada desde BD
  let noticia = await getNoticiaBySlugFromDB(params.slug)
  
  // Si no está en BD o no está publicada, intenta cargar del filesystem (legacy)
  if (!noticia) {
    console.log(`📰 Loading noticia ${params.slug} from filesystem (not found in database)`)
    noticia = getNoticiaBySlug(params.slug)
  }
  
  if (!noticia) return { notFound: true }
  
  // Procesar Markdown a HTML
  const processedContent = await remark()
    .use(html)
    .process(noticia.content || '')
  const contentHtml = processedContent.toString()
  
  return { 
    props: { 
      noticia: {
        ...noticia,
        contentHtml,
      }
    }, 
    revalidate: 10 
  }
}

export default function NoticiaPage({ noticia }: NoticiaPageProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null)
  
  // Determinar si la imagen es URL de Cloudinary o ruta relativa
  const isCloudinaryUrl = noticia.mainImage?.startsWith('http')
  const imageUrl = isCloudinaryUrl 
    ? noticia.mainImage 
    : `/content/noticias/${noticia.slug}/images/${noticia.mainImage}`
  
  const photos = noticia.photos || []
  const hasPhotos = photos && photos.length > 0
  
  return (
    <>
      <Head>
        <title>{noticia.title} — XpriT Robotics</title>
        <meta name="description" content={noticia.excerpt} />
        <meta property="og:image" content={imageUrl} />
      </Head>
      <main className="min-h-screen p-8">
        <div className="max-w-3xl mx-auto">
          <Link href="/noticias" className="text-cyan-400 hover:text-cyan-300 mb-6 inline-block">
            ← Volver a noticias
          </Link>

          {/* Portada */}
          {noticia.mainImage && (
            <div className="w-full h-96 bg-gray-700 rounded-lg mb-8 relative overflow-hidden">
              <Image
                src={imageUrl}
                alt={noticia.title}
                fill
                unoptimized={isCloudinaryUrl}
                className="object-cover"
              />
            </div>
          )}

          {/* Header */}
          <h1 className="text-4xl font-bold mb-4 text-cyan-300">{noticia.title}</h1>
          <div className="flex gap-4 mb-8 text-gray-400 text-sm">
            <span>{noticia.date}</span>
            <span>•</span>
            <span className="bg-gray-800 px-2 py-1 rounded">{noticia.category}</span>
          </div>

          {/* Contenido Markdown Renderizado */}
          <article className="bg-gray-800 p-8 rounded-lg border border-gray-700 markdown-content mb-8">
            <div 
              className="prose prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: noticia.contentHtml }}
            />
          </article>

          {/* Galería de Fotos */}
          {hasPhotos && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6 text-cyan-300">Galería</h2>
              
              {selectedPhoto !== null && (
                <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setSelectedPhoto(null)}>
                  <div className="relative w-full max-w-4xl h-96">
                    <Image
                      src={photos[selectedPhoto]}
                      alt={`Foto ${selectedPhoto + 1}`}
                      fill
                      unoptimized
                      className="object-contain"
                    />
                    <button
                      onClick={() => setSelectedPhoto(null)}
                      className="absolute top-4 right-4 text-white bg-black/50 hover:bg-black/70 rounded-full w-10 h-10 flex items-center justify-center text-2xl"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {photos.map((photo, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedPhoto(idx)}
                    className="relative h-48 bg-gray-700 rounded-lg overflow-hidden cursor-pointer hover:opacity-75 transition-opacity"
                  >
                    <Image
                      src={photo}
                      alt={`Foto ${idx + 1}`}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center">
                      <span className="text-white text-2xl opacity-0 hover:opacity-100 transition-opacity">🔍</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="mt-12 p-8 bg-gradient-to-r from-cyan-900/30 to-blue-900/30 rounded-lg text-center">
            <h3 className="text-2xl font-bold mb-4">¿Te gustó esta noticia?</h3>
            <Link href="/noticias" className="inline-block px-6 py-3 bg-cyan-500 text-black rounded-lg font-semibold hover:bg-cyan-400 transition-colors">
              Leer más noticias
            </Link>
          </div>
        </div>
      </main>
      
      <style jsx>{`
        :global(.prose-invert h1) {
          @apply text-3xl font-bold mb-4 text-cyan-300;
        }
        :global(.prose-invert h2) {
          @apply text-2xl font-bold mb-3 mt-6 text-cyan-300;
        }
        :global(.prose-invert h3) {
          @apply text-xl font-bold mb-2 mt-4 text-cyan-300;
        }
        :global(.prose-invert p) {
          @apply mb-4 text-gray-300 leading-relaxed;
        }
        :global(.prose-invert strong) {
          @apply font-bold text-cyan-200;
        }
        :global(.prose-invert em) {
          @apply italic text-cyan-100;
        }
        :global(.prose-invert ul) {
          @apply list-disc list-inside mb-4 text-gray-300;
        }
        :global(.prose-invert li) {
          @apply mb-2;
        }
      `}</style>
    </>
  )
}
