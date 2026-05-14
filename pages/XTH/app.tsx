import Head from 'next/head'
import { useState, useEffect } from 'react'

export default function XTHApp() {
  const [hubUrl, setHubUrl] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Configurar la URL del hub basado en el ambiente
    // En desarrollo, usar localhost; en producción, usar el dominio correspondiente
    const isDev = process.env.NODE_ENV === 'development'
    const url = isDev 
      ? 'http://localhost:5173' // Puerto por defecto de Vite
      : process.env.NEXT_PUBLIC_XTH_URL || 'https://xprit-robotics.com/hub'
    
    setHubUrl(url)
    setIsLoading(false)
  }, [])

  return (
    <>
      <Head>
        <title>XTH App — XpriT Robotics Hub</title>
        <meta name="description" content="Accede a la red social de robótica XTH" />
        <meta name="robots" content="noindex" />
      </Head>

      <main className="min-h-screen bg-gray-950">
        {isLoading ? (
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="inline-block">
                <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              </div>
              <p className="text-cyan-300 text-lg">Cargando XTH...</p>
            </div>
          </div>
        ) : hubUrl ? (
          <iframe
            src={hubUrl}
            className="w-full h-screen border-none"
            title="XTH - XpriT Robotics Hub"
            allow="camera; microphone; clipboard-write"
          />
        ) : (
          <div className="flex items-center justify-center min-h-screen px-8">
            <div className="max-w-lg text-center">
              <h1 className="text-3xl font-bold text-cyan-300 mb-4">⚙️ Configuración Pendiente</h1>
              <p className="text-gray-300 mb-6">
                El XTH está siendo configurado. La URL del hub no ha sido establecida correctamente.
              </p>
              <p className="text-gray-400 text-sm mb-8">
                Por favor, configura la variable de ambiente <code className="bg-gray-800 px-2 py-1 rounded">NEXT_PUBLIC_XTH_URL</code> con la URL correcta del XTH.
              </p>
              <a 
                href="/XTH"
                className="inline-block px-6 py-3 bg-cyan-500 text-white font-semibold rounded-lg hover:bg-cyan-400 transition-all"
              >
                Volver a XTH
              </a>
            </div>
          </div>
        )}
      </main>
    </>
  )
}
