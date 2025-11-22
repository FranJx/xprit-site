import Head from 'next/head'
import Link from 'next/link'

export default function Home() {
  return (
    <>
      <Head>
        <title>XpriT Robotics — Ingenio en movimiento</title>
        <meta name="description" content="XpriT Robotics: equipo de robótica con robots de competición, noticias y proyectos innovadores." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="XpriT Robotics" />
        <meta property="og:description" content="Ingenio. Diseño. Competencia. Conoce nuestros robots." />
        <meta property="og:type" content="website" />
      </Head>

      <main>
        {/* Hero Section */}
        <section className="min-h-screen flex flex-col items-center justify-center px-6 text-center bg-gradient-to-br from-gray-900 via-gray-900 to-cyan-900/20 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-2000"></div>
          </div>
          
          <div className="relative z-10 max-w-4xl">
            <h1 className="gang-of-three-xxl mb-6 bg-gradient-to-r from-cyan-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent">
              XpriT Robotics
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-4 font-light">Ingenio. Diseño. Competencia.</p>
            <p className="text-lg text-gray-400 mb-10">Conoce nuestros robots, planos, noticias y únete a la revolución robótica.</p>
            
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/robots" className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 transform hover:scale-105">
                Ver robots
              </Link>
              <Link href="/noticias" className="px-8 py-4 border-2 border-cyan-400 text-cyan-300 rounded-lg font-semibold hover:bg-cyan-400/10 transition-all duration-300">
                Últimas noticias
              </Link>
              <Link href="/quien-somos" className="px-8 py-4 border-2 border-gray-600 text-gray-300 rounded-lg font-semibold hover:bg-gray-600/10 transition-all duration-300">
                Quiénes somos
              </Link>
            </div>
          </div>
        </section>

        {/* Destacados */}
        <section className="py-24 px-6 bg-gray-800/50 border-t border-gray-700">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12">Robots destacados</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { slug: 'tokio-xt', name: 'Tokio XT', category: 'Minisumo', desc: 'Campeón Nacional WRO 2023' },
                { slug: 'seul-xt', name: 'Seúl XT', category: 'Velocistas', desc: 'Robot velocista con visión' },
                { slug: 'predator-xt', name: 'Predator XT', category: 'Sumo', desc: 'Diseño agresivo de empuje' },
              ].map((robot) => (
                <Link key={robot.slug} href={`/robots/${robot.slug}`} className="group p-6 bg-gray-900 border border-gray-700 rounded-lg hover:border-cyan-500 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20 hover:scale-105 cursor-pointer">
                  <div className="w-full h-48 bg-gray-700/50 rounded mb-4 flex items-center justify-center group-hover:bg-gray-700 transition-colors">
                    <span className="text-gray-500">{robot.category}</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-cyan-300">{robot.name}</h3>
                  <p className="text-gray-400 text-sm">{robot.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Logros */}
        <section className="py-24 px-6 bg-gray-900 border-t border-gray-700">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12">Logros y reconocimientos</h2>
            <div className="grid md:grid-cols-4 gap-8 mb-12">
              {[
                { num: '40+', label: 'Podios en competencias' },
                { num: '2', label: 'Campeonatos WRO' },
                { num: '20+', label: 'Robots desarrollados' },
                { num: '8+', label: 'Años de experiencia' },
              ].map((item, i) => (
                <div key={i} className="p-6 bg-gray-800 border border-gray-700 rounded-lg text-center hover:border-cyan-500 transition-colors">
                  <div className="text-4xl font-bold text-cyan-400 mb-2">{item.num}</div>
                  <p className="text-gray-400">{item.label}</p>
                </div>
              ))}
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="p-8 bg-gray-800 border border-gray-700 rounded-lg">
                <p className="text-lg text-cyan-300 font-semibold mb-4">Campeón Nacional WRO 2023</p>
                <p className="text-gray-400">Tokio XT se coronó campeón en la categoría de robótica de alto rendimiento.</p>
              </div>
              <div className="p-8 bg-gray-800 border border-gray-700 rounded-lg">
                <p className="text-lg text-cyan-300 font-semibold mb-4">Campeón Nacional WRO 2025</p>
                <p className="text-gray-400">Seguimos demostrando excelencia con nuevas innovaciones y diseños.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="py-16 px-6 bg-gradient-to-r from-cyan-900/30 to-blue-900/30 text-center">
          <h3 className="text-3xl font-bold mb-6">¿Listo para conocer nuestros proyectos?</h3>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">Explora nuestros robots, lee las últimas noticias y entérate de los avances de XpriT Robotics.</p>
          <Link href="/noticias" className="inline-block px-8 py-4 bg-cyan-500 text-black rounded-lg font-semibold hover:bg-cyan-400 transition-colors duration-300">
            Lee nuestro blog
          </Link>
        </section>
      </main>
    </>
  )
}
