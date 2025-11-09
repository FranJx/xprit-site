import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'

export default function Post() {
  const router = useRouter()
  const { slug } = router.query

  // Demo content — en el futuro esto vendrá de MDX o CMS
  const contentMap: { [key: string]: { title: string; date: string; content: string } } = {
    'lanzamiento-robot-2024': {
      title: 'Lanzamiento del nuevo robot de competición 2024',
      date: '2024-11-01',
      content: `
        <p>Hoy nos complace anunciar el lanzamiento oficial de nuestro nuevo robot competitivo para la temporada 2024.</p>
        <p>Este robot ha sido diseñado con innovaciones de última generación incluyendo:</p>
        <ul>
          <li>Sistema de tracción optimizado para mayor velocidad</li>
          <li>Brazos manipuladores de precisión con 6 grados de libertad</li>
          <li>Sistema de visión por computadora integrado</li>
          <li>Batería de alto rendimiento con autonomía extendida</li>
        </ul>
        <p>El equipo ha trabajado incansablemente para llevar este proyecto a realidad. ¡Estamos listos para la competencia!</p>
      `
    },
    'ruta-regional': {
      title: 'Ruta a la regional: cronograma y preparación',
      date: '2024-10-28',
      content: `
        <p>Aquí está el cronograma de nuestras actividades de preparación para la competencia regional:</p>
        <p><strong>Noviembre:</strong> Pruebas de integración y calibración del robot</p>
        <p><strong>Diciembre:</strong> Entrenamientos intensivos y simulaciones</p>
        <p><strong>Enero:</strong> Competencia regional</p>
        <p>Todos los miembros del equipo están comprometidos a dar lo mejor de sí.</p>
      `
    }
  }

  const post = slug && typeof slug === 'string' ? contentMap[slug] : null

  return (
    <>
      <Head>
        <title>{post?.title || 'Noticia'} — XpriT Robotics</title>
        <meta name="description" content={`${post?.title} | ${post?.date}`} />
      </Head>
      <main className="min-h-screen p-8">
        <div className="max-w-3xl mx-auto">
          <Link href="/noticias" className="text-cyan-400 hover:text-cyan-300 mb-8 inline-block">
            ← Volver a noticias
          </Link>

          {post ? (
            <>
              <h1 className="text-4xl font-bold mb-4 text-cyan-300">{post.title}</h1>
              <p className="text-gray-500 mb-8">{post.date}</p>
              
              <article className="bg-gray-800 p-8 rounded-lg border border-gray-700 prose prose-invert max-w-none">
                <div 
                  className="space-y-4 text-gray-300 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              </article>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400 mb-4">Noticia no encontrada</p>
              <Link href="/noticias" className="text-cyan-400 hover:text-cyan-300">
                Volver a noticias
              </Link>
            </div>
          )}
        </div>
      </main>
    </>
  )
}
