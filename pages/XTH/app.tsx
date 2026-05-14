import Head from 'next/head'
import { useEffect } from 'react'

export default function XTHApp() {
  useEffect(() => {
    // Redirigir automáticamente al XTH Backend
    // En desarrollo: http://localhost:5000
    // En producción: mismo dominio en puerto 5000 o URL configurada
    const isDev = process.env.NODE_ENV === 'development'
    const xthUrl = isDev 
      ? 'http://localhost:5000' // Puerto del XTH Backend
      : (process.env.NEXT_PUBLIC_XTH_URL || window.location.origin.replace(':3000', ':5000'))
    
    console.log('🤖 Redirigiendo a XTH:', xthUrl)
    window.location.href = xthUrl
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
          <p className="text-gray-400 text-sm">
            Redirigiendo a la red social de robótica
          </p>
        </div>
      </main>
    </>
  )
}
