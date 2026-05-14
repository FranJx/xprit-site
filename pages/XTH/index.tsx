import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'

export default function XTH() {
  const features = [
    {
      icon: '📱',
      title: 'Red Social de Robótica',
      desc: 'Comparte tus proyectos, remakes y tutoriales con la comunidad global de robótica'
    },
    {
      icon: '🤝',
      title: 'Conecta con Expertos',
      desc: 'Sigue a otros entusiastas, colabora y aprende de diferentes perspectivas'
    },
    {
      icon: '🏆',
      title: 'Exhibe tus Logros',
      desc: 'Muestra tus robots, competiciones y hitos alcanzados en tu carrera robótica'
    },
    {
      icon: '💡',
      title: 'Descubre Inspiración',
      desc: 'Explora proyectos innovadores y encuentra nuevas ideas para tus próximos robots'
    },
    {
      icon: '📚',
      title: 'Comunidad Activa',
      desc: 'Comenta, da like y debate sobre los temas más candentes de la robótica'
    },
    {
      icon: '🌍',
      title: 'Alcance Global',
      desc: 'Conecta con roboticistas de todo el mundo en una plataforma única'
    }
  ]

  return (
    <>
      <Head>
        <title>XTH — XpriT Robotics Hub | Red Social de Robótica</title>
        <meta name="description" content="XTH es la red social de la comunidad robótica. Comparte proyectos, conecta con expertos y exhibe tus logros en robótica." />
        <meta name="robots" content="index, follow" />
      </Head>
      
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="py-24 px-8 bg-gradient-to-br from-cyan-900/50 via-blue-900/40 to-purple-900/30 border-b border-gray-800">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-6 inline-block">
              <div className="text-6xl mb-4">🤖</div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-cyan-300">XTH</h1>
            <p className="text-2xl md:text-3xl font-semibold mb-4 text-white">XpriT Robotics Hub</p>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              La red social de la comunidad global de robótica. Comparte proyectos, conecta con expertos y exhibe tus logros.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link 
                href="/XTH/app"
                className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-lg hover:from-cyan-400 hover:to-blue-400 transition-all hover:shadow-lg hover:shadow-cyan-500/50"
              >
                Entrar al Hub →
              </Link>
              <a 
                href="#features"
                className="px-8 py-4 border-2 border-cyan-400 text-cyan-300 font-semibold rounded-lg hover:bg-cyan-900/20 transition-all"
              >
                Conocer Más
              </a>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 px-8 bg-gray-900/50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-12 text-center text-cyan-300">
              ¿Qué puedes hacer en XTH?
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, idx) => (
                <div 
                  key={idx}
                  className="p-6 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border border-gray-700 hover:border-cyan-500 transition-all hover:shadow-lg hover:shadow-cyan-500/20"
                >
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-lg font-semibold text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-400">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="py-20 px-8 border-t border-gray-800">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-cyan-300">Sobre XTH</h2>
            
            <div className="space-y-6 text-gray-300 leading-relaxed">
              <p>
                <span className="text-cyan-400 font-semibold">XTH (XpriT Robotics Hub)</span> es una plataforma social diseñada específicamente para la comunidad de robótica mundial. Nace de la experiencia de <span className="text-cyan-400">XpriT Robotics</span>, equipo argentino de robótica competitiva con más de 90 podios en competencias nacionales e internacionales.
              </p>

              <p>
                La misión de XTH es crear un espacio donde roboticistas de todas las edades y niveles puedan:
              </p>

              <ul className="list-disc list-inside space-y-3 text-gray-300">
                <li>Compartir sus proyectos y remakes de robots famosos</li>
                <li>Documentar y exhibir sus logros en competiciones</li>
                <li>Colaborar en soluciones y compartir tutoriales</li>
                <li>Conectar con otros entusiastas y expertos alrededor del mundo</li>
                <li>Descubrir inspiración en los proyectos de la comunidad</li>
                <li>Construir una red profesional en el sector robótico</li>
              </ul>

              <p>
                Con características como autenticación segura, gestión de posts, sistema de likes y comentarios, búsqueda global y perfiles de usuarios, XTH es tu espacio para ser parte de la revolución robótica.
              </p>

              <p className="pt-4 border-t border-gray-700">
                <span className="text-cyan-400 font-semibold">Tecnología moderna:</span> Construido con React, Node.js y bases de datos modernas para una experiencia rápida y confiable en cualquier dispositivo.
              </p>
            </div>

            {/* CTA */}
            <div className="mt-12 p-8 bg-gradient-to-r from-cyan-900/30 to-blue-900/30 rounded-lg border border-cyan-500/50 text-center">
              <h3 className="text-2xl font-bold mb-4 text-cyan-300">¿Listo para unirte a la comunidad?</h3>
              <p className="text-gray-300 mb-6">Crea tu cuenta y comienza a compartir tus proyectos robóticos hoy mismo.</p>
              <Link 
                href="/XTH/app"
                className="inline-block px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-lg hover:from-cyan-400 hover:to-blue-400 transition-all hover:shadow-lg hover:shadow-cyan-500/50"
              >
                Acceder a XTH →
              </Link>
            </div>
          </div>
        </section>

        {/* Tech Stack */}
        <section className="py-20 px-8 bg-gray-900/50 border-t border-gray-800">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center text-cyan-300">
              Stack Tecnológico
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-blue-400 mb-4">Frontend</h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-center gap-2">
                    <span className="text-cyan-400">▸</span> React 19
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-cyan-400">▸</span> Vite 8 (HMR rápido)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-cyan-400">▸</span> Tailwind CSS
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-cyan-400">▸</span> Context API
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-blue-400 mb-4">Backend</h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-center gap-2">
                    <span className="text-cyan-400">▸</span> Node.js 18 LTS
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-cyan-400">▸</span> Express.js
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-cyan-400">▸</span> Sequelize ORM
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-cyan-400">▸</span> JWT + bcrypt
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
