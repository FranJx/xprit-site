import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { getAllRobotsFromDB } from '../lib/content'

interface Robot {
  slug: string
  name: string
  category: string
  year: number
  description: string
  mainImage: string
}

export async function getStaticProps() {
  const robots = await getAllRobotsFromDB()
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
          {robots.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {robots.map(robot => (
                <Link key={robot.slug} href={`/robots/${robot.slug}`} className="group">
                  <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden hover:border-cyan-500 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20 hover:scale-105">
                    <div className="w-full h-48 bg-gray-700/50 flex items-center justify-center group-hover:bg-gray-700 transition-colors relative">
                      {robot.mainImage && (
                        <Image
                          src={robot.mainImage}
                          alt={robot.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          unoptimized
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
          ) : null}
        </div>
      </main>
    </>
  )
}
