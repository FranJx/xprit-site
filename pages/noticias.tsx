import Head from 'next/head'
import Link from 'next/link'
import { getAllNoticiasFromDB, getAllNoticias } from '../lib/content'

export async function getStaticProps() {
  // Intenta cargar noticias publicadas desde BD
  let noticias = await getAllNoticiasFromDB()
  
  // Si no hay noticias en BD, carga del filesystem (legacy)
  if (noticias.length === 0) {
    noticias = getAllNoticias()
  }
  
  return {
    props: { noticias },
    revalidate: 10, // ISR: revalidar cada 10 segundos para actualizaciones rápidas
  }
}

export default function Noticias({ noticias }: any) {
  return (
    <>
      <Head>
        <title>Noticias — XpriT Robotics</title>
        <meta name="description" content="Últimas noticias, artículos y actualizaciones del equipo de robótica XpriT Robotics." />
      </Head>
      <main className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Noticias</h1>
          <p className="text-gray-400 mb-12">Mantente al día con las últimas novedades de XpriT Robotics</p>
          
          <div className="space-y-6">
            {noticias.length > 0 ? (
              noticias.map((noticia: any) => (
                <Link key={noticia.slug} href={`/noticias-new/${noticia.slug}`} className="group block p-6 bg-gray-800 border border-gray-700 rounded-lg hover:border-cyan-500 hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-300 hover:scale-105">
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-2xl font-semibold text-cyan-300 group-hover:text-cyan-200 transition-colors flex-1">
                      {noticia.title}
                    </h2>
                    <span className="text-sm text-gray-500 ml-4 whitespace-nowrap">{noticia.date}</span>
                  </div>
                  <p className="text-gray-400 group-hover:text-gray-300 transition-colors mb-2">{noticia.excerpt}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-1 bg-gray-700 text-gray-300 rounded">{noticia.category}</span>
                  </div>
                  <div className="mt-4 flex items-center text-cyan-400 group-hover:text-cyan-300 text-sm font-semibold">
                    Leer más →
                  </div>
                </Link>
              ))
            ) : (
              <div className="p-8 bg-gray-800 border border-gray-700 rounded-lg text-center">
                <p className="text-gray-400">No hay noticias aún. ¡Vuelve pronto!</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  )
}

