import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { getAllNoticias, getNoticiaBySlug, NoticiaData } from '../../lib/content'

export async function getStaticPaths() {
  const noticias = getAllNoticias()
  const paths = noticias.map(n => ({ params: { slug: n.slug } }))
  return { paths, fallback: 'blocking' }
}

export async function getStaticProps({ params }: { params: { slug: string } }) {
  const noticia = getNoticiaBySlug(params.slug)
  if (!noticia) return { notFound: true }
  return { props: { noticia }, revalidate: 60 }
}

export default function NoticiaPage({ noticia }: { noticia: NoticiaData }) {
  return (
    <>
      <Head>
        <title>{noticia.title} — XpriT Robotics</title>
        <meta name="description" content={noticia.excerpt} />
        <meta property="og:image" content={`/content/noticias/${noticia.slug}/images/${noticia.mainImage}`} />
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
                src={`/content/noticias/${noticia.slug}/images/${noticia.mainImage}`}
                alt={noticia.title}
                fill
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
