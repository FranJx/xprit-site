import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { getAllNoticiasFromDB, getNoticiaBySlugFromDB, getAllNoticias, getNoticiaBySlug, NoticiaData } from '../../lib/content'

export async function getStaticPaths() {
  // Intenta cargar noticias desde BD
  let noticias = await getAllNoticiasFromDB()
  
  // Si no hay en BD, carga del filesystem (legacy)
  if (noticias.length === 0) {
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
    noticia = getNoticiaBySlug(params.slug)
  }
  
  if (!noticia) return { notFound: true }
  return { props: { noticia }, revalidate: 10 }
}

export default function NoticiaPage({ noticia }: { noticia: NoticiaData }) {
  // Determinar si la imagen es URL de Cloudinary o ruta relativa
  const isCloudinaryUrl = noticia.mainImage?.startsWith('http')
  const imageUrl = isCloudinaryUrl 
    ? noticia.mainImage 
    : `/content/noticias/${noticia.slug}/images/${noticia.mainImage}`
  
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

          {/* Contenido Markdown */}
          <article className="bg-gray-800 p-8 rounded-lg border border-gray-700 prose prose-invert max-w-none">
            <div className="space-y-4 text-gray-300 leading-relaxed whitespace-pre-wrap">
              {noticia.content}
            </div>
          </article>

          {/* CTA */}
          <div className="mt-12 p-8 bg-gradient-to-r from-cyan-900/30 to-blue-900/30 rounded-lg text-center">
            <h3 className="text-2xl font-bold mb-4">¿Te gustó esta noticia?</h3>
            <Link href="/noticias" className="inline-block px-6 py-3 bg-cyan-500 text-black rounded-lg font-semibold hover:bg-cyan-400 transition-colors">
              Leer más noticias
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}
