import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { getAllRobots } from '../lib/content'

interface Robot {
  slug: string
  name: string
  category: string
  year: number
  description: string
  mainImage: string
}

export async function getStaticProps() {
  const robots = getAllRobots()
  return {
    props: { robots },
    revalidate: 60, // Re-generar cada 60 segundos
  }
}

export default function RobotsPage({ robots }: { robots: Robot[] }) {
  const categories = ['Todos', ...Array.from(new Set(robots.map(r => r.category)))]
  
  return (
    <>
      <Head>
        <title>Robots — XpriT Robotics</title>
        <meta name="description" content="Galería completa de robots de XpriT Robotics con especificaciones, planos y visores 3D." />
      </Head>
      <main className="min-h-screen p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Nuestros Robots</h1>
          <p className="text-gray-400 mb-12">Explora nuestros robots, planos y modelos 3D interactivos.</p>

          {/* Filtros */}
          <div className="flex gap-2 mb-12 flex-wrap">
            {categories.map(cat => (
              <button
                key={cat}
                className="px-4 py-2 rounded border border-gray-700 hover:border-cyan-500 transition-all duration-300 text-gray-300 hover:text-cyan-300"
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid de robots */}
          {robots.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p>No hay robots aún. ¡Sube uno en content/robots/!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {robots.map(robot => (
                <Link key={robot.slug} href={`/robots/${robot.slug}`} className="group">
                  <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden hover:border-cyan-500 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20 hover:scale-105">
                    <div className="w-full h-48 bg-gray-700/50 flex items-center justify-center group-hover:bg-gray-700 transition-colors relative">
                      {robot.mainImage && (
                        <Image
                          src={`/content/robots/${robot.slug}/images/${robot.mainImage}`}
                          alt={robot.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-cyan-300 group-hover:text-cyan-200 mb-2">{robot.name}</h3>
                      <p className="text-sm text-gray-400 mb-2">{robot.description}</p>
                      <div className="flex justify-between text-sm text-gray-400">
                        <span>{robot.category}</span>
                        <span>{robot.year}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* CTA */}
          <div className="mt-16 p-8 bg-gray-800 border border-gray-700 rounded-lg text-center">
            <h3 className="text-2xl font-bold mb-4">¿Quieres agregar un robot?</h3>
            <p className="text-gray-400 mb-6">
              Solo crea una carpeta en <code className="bg-gray-900 px-2 py-1 rounded text-cyan-300">content/robots/</code> con los archivos JSON e imágenes. ¡Se actualiza automáticamente!
            </p>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="inline-block px-6 py-3 bg-cyan-500 text-black rounded-lg font-semibold hover:bg-cyan-400 transition-colors">
              Ver documentación en GitHub
            </a>
          </div>
        </div>
      </main>
    </>
  )
}
