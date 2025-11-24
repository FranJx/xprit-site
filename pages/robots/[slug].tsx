import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { getRobotBySlugFromDB, getAllRobotsFromDB, RobotData } from '../../lib/content'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function getStaticPaths() {
  // Get all approved robots from database
  const robots = await getAllRobotsFromDB()
  const paths = robots.map(r => ({ params: { slug: r.slug } }))
  return { paths, fallback: 'blocking' }
}

export async function getStaticProps({ params }: { params: { slug: string } }) {
  const robot = await getRobotBySlugFromDB(params.slug)
  if (!robot) return { notFound: true }
  return { props: { robot }, revalidate: 10 } // Re-generar cada 10 segundos para reflejar cambios rápidamente
}

export default function RobotPage({ robot }: { robot: RobotData }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  
  // Use photos array from DB (Cloudinary URLs)
  const gallery = robot.gallery && robot.gallery.length > 0 ? robot.gallery : [robot.mainImage]
  const currentImage = gallery[currentImageIndex]
  
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % gallery.length)
  }
  
  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + gallery.length) % gallery.length)
  }
  return (
    <>
      <Head>
        <title>{robot.name} — XpriT Robotics</title>
        <meta name="description" content={robot.description} />
        <meta property="og:image" content={currentImage} />
      </Head>

      <main className="min-h-screen p-8">
        <div className="max-w-6xl mx-auto">
          <Link href="/robots" className="text-cyan-400 hover:text-cyan-300 mb-6 inline-block">
            ← Volver a robots
          </Link>

          <h1 className="text-4xl font-bold mb-8 text-cyan-300">{robot.name}</h1>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Galería de imágenes */}
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h2 className="text-xl font-semibold mb-4">Galería</h2>
              <div className="w-full h-96 bg-gray-900 rounded relative overflow-hidden flex items-center justify-center group">
                {currentImage && (
                  <Image
                    src={currentImage}
                    alt={robot.name}
                    fill
                    className="object-contain"
                    priority
                    unoptimized
                  />
                )}
                
                {/* Controles de navegación */}
                {gallery.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-cyan-500 hover:bg-cyan-600 text-white p-2 rounded-full z-10 transition-colors"
                      aria-label="Imagen anterior"
                    >
                      ←
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-cyan-500 hover:bg-cyan-600 text-white p-2 rounded-full z-10 transition-colors"
                      aria-label="Siguiente imagen"
                    >
                      →
                    </button>
                  </>
                )}
              </div>
              
              {/* Miniaturas */}
              {gallery.length > 1 && (
                <div className="flex gap-2 mt-4 overflow-x-auto">
                  {gallery.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`flex-shrink-0 w-16 h-16 rounded border-2 transition-all ${
                        idx === currentImageIndex ? 'border-cyan-400' : 'border-gray-600 hover:border-gray-500'
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`${robot.name} ${idx + 1}`}
                        fill
                        className="object-cover rounded"
                        unoptimized
                      />
                    </button>
                  ))}
                </div>
              )}
              
              {/* Contador */}
              {gallery.length > 1 && (
                <p className="text-sm text-gray-400 mt-3 text-center">
                  {currentImageIndex + 1} de {gallery.length}
                </p>
              )}
            </div>

            {/* Info y especificaciones */}
            <div>
              <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 mb-6">
                <h3 className="text-xl font-semibold mb-4">Especificaciones</h3>
                <div className="space-y-3">
                  {(robot.specs || []).map((s) => (
                    <div key={s.label} className="flex justify-between border-b border-gray-700 pb-2">
                      <span className="text-gray-400">{s.label}</span>
                      <span className="font-semibold text-white">{s.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                <h3 className="text-xl font-semibold mb-4">Descargas</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-cyan-400 hover:text-cyan-300">📄 Planos generales (PDF)</a></li>
                  <li><a href="#" className="text-cyan-400 hover:text-cyan-300">🎨 Modelo 3D (GLB)</a></li>
                  <li><a href="#" className="text-gray-500">📋 Bill of Materials</a></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Descripción completa */}
          <div className="mt-12 bg-gray-800 p-8 rounded-lg border border-gray-700">
            <h2 className="text-2xl font-bold mb-4">Descripción</h2>
            <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{robot.fullDescription || robot.description}</p>
          </div>

          {/* Proyecto relacionado */}
          <div className="mt-12 p-8 bg-gradient-to-r from-cyan-900/30 to-blue-900/30 rounded-lg text-center">
            <h3 className="text-2xl font-bold mb-4">¿Quieres conocer noticias sobre este robot?</h3>
            <Link href="/noticias" className="inline-block px-6 py-3 bg-cyan-500 text-black rounded-lg font-semibold hover:bg-cyan-400 transition-colors">
              Leer noticias
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}
