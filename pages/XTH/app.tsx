import Head from 'next/head'
import { useEffect } from 'react'
import Link from 'next/link'

export default function XTHApp() {
  useEffect(() => {
    // Redirigir a /hub
    window.location.href = '/hub'
  }, [])

  return (
    <>
      <Head>
        <title>XTH App — XpriT Robotics Hub</title>
        <meta name="description" content="Redirigiendo a XTH..." />
        <meta name="robots" content="noindex" />
      </Head>

      <main className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block mb-6">
            <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h1 className="text-2xl font-bold text-cyan-300 mb-2">Cargando XTH...</h1>
          <p className="text-gray-400 text-sm mb-8">
            Redirigiendo a la red social de robótica
          </p>
          <Link 
            href="/hub"
            className="inline-block px-6 py-3 bg-cyan-500 text-white font-semibold rounded-lg hover:bg-cyan-400 transition-all"
          >
            Click aquí si no se redirige automáticamente
          </Link>
        </div>
      </main>
    </>
  )
}
