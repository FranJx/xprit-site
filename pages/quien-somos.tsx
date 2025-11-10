import Head from 'next/head'
import Link from 'next/link'

export default function QuienSomos() {
  const team = [
    { name: 'Franco Joaquín Aguirre Elizalde', role: 'Fundador y Líder técnico', area: '8+ años en robótica, 40+ podios en competencias' },
    { name: 'Marcelo David Benitez', role: 'Co-lider y Diseñador', area: 'Años de experiencia en Robotica educativa y de Competencia' },
    { name: 'Equipo de electrónica', role: 'Diseño de placas y firmware', area: 'XT-Prime, XT-RC, XT-Samurai' },
    { name: 'Equipo de programación', role: 'Software y algoritmos', area: 'IA, visión por computadora, sistemas autónomos' },
  ]

  const logros = [
    { num: '90+', desc: 'Podios en competiciones nacionales e internacionales' },
    { num: '2', desc: 'Campeonatos Nacionales WRO (2023, 2025)' },
    { num: '20+', desc: 'Robots desarrollados para competencia' },
    { num: '3+', desc: 'Placas electrónicas propias diseñadas' },
  ]

  const robots = [
    'Tokio XT', 'Seúl XT', 'IkarI XT', 'Predator XT', 'BoltBot XT', 'Thunder XT',
    'Snorlax XT', 'ElTitán XT', 'Sharp XT', 'Winner XT', 'Mike XT', 'Speedy Be XT',
    'Speedy Be Turbo XT'
  ]

  const placas = [
    { nombre: 'XT-Prime', desc: 'Placa principal para robots autónomos multisensores' },
    { nombre: 'XT-RC', desc: 'Placa compacta para control por radiocontrol y motores' },
    { nombre: 'XT-Samurai', desc: 'Versión avanzada para robots de alto rendimiento' },
  ]

  return (
    <>
      <Head>
        <title>Quiénes somos — XpriT Robotics</title>
        <meta name="description" content="XpriT Robotics: equipo argentino de robótica con 90+ podios, campeón WRO 2023 y 2025, hardware propio y tecnología de nivel internacional." />
      </Head>
      <main className="min-h-screen">
        {/* Hero */}
        <section className="py-16 px-8 bg-gradient-to-br from-cyan-900/30 to-blue-900/30 border-b border-gray-800">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold mb-4 text-cyan-300">XpriT Robotics</h1>
            <p className="text-xl text-gray-300">Robótica argentina de nivel internacional</p>
          </div>
        </section>

        <div className="max-w-4xl mx-auto p-8">
          
          {/* Historia */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-6 text-cyan-300">📖 Historia</h2>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>
                XpriT Robotics fue fundado alrededor del año <strong>2020</strong> como un proyecto independiente dedicado al desarrollo de robots competitivos y hardware electrónico propio.
              </p>
              <p>
                El equipo nació en <strong>Misiones, Argentina</strong>, impulsado por <strong>Franco Joaquín Aguirre Elizalde</strong>, competidor con más de 8 años de experiencia en robótica y más de 40 podios en competencias provinciales, nacionales e internacionales.
              </p>
              <p>
                Con el tiempo, XpriT Robotics pasó de ser un simple proyecto personal a una marca completa dedicada al diseño de robots, placas electrónicas y sistemas para competencias de alto rendimiento.
              </p>
            </div>
          </section>

          {/* Misión y Visión */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="p-6 bg-gray-800 border border-gray-700 rounded-lg">
              <h3 className="text-2xl font-bold mb-4 text-cyan-300">🎯 Misión</h3>
              <p className="text-gray-300 leading-relaxed">
                Crear tecnología robótica de alta calidad de forma accesible, eficiente y abierta, demostrando que desde Argentina se puede desarrollar hardware de nivel competitivo internacional.
              </p>
            </div>
            <div className="p-6 bg-gray-800 border border-gray-700 rounded-lg">
              <h3 className="text-2xl font-bold mb-4 text-cyan-300">🔭 Visión</h3>
              <p className="text-gray-300 leading-relaxed">
                Convertirse en una de las marcas de robótica más reconocidas de Latinoamérica, impulsando nuevos competidores, proyectos y desarrolladores mediante robots, placas y comunidad.
              </p>
            </div>
          </div>

          {/* Logros */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-cyan-300">🏆 Logros principales</h2>
            <div className="grid md:grid-cols-4 gap-4 mb-8">
              {logros.map((l, i) => (
                <div key={i} className="p-6 bg-gray-800 border border-gray-700 rounded-lg text-center">
                  <div className="text-4xl font-bold text-cyan-400 mb-2">{l.num}</div>
                  <p className="text-gray-300 text-sm">{l.desc}</p>
                </div>
              ))}
            </div>
            <div className="bg-gray-800 p-8 border border-gray-700 rounded-lg">
              <ul className="space-y-3 text-gray-300">
                <li>✅ Más de 40 podios en competiciones de robótica (Minisumo, Velocistas, Sumo, Laberinto, VSSS, etc.)</li>
                <li>✅ Campeón Nacional WRO 2023</li>
                <li>✅ Campeón Nacional WRO 2025</li>
                <li>✅ 3.er puesto en Minisumo Pro 2023 a nivel nacional (Argentina)</li>
                <li>✅ Campeón Sumo RC Robotic People Fest 2020</li>
                <li>✅ Participación en torneos internacionales (Robotic People Fest en Colombia, RoboChallenge en Rumania)</li>
                <li>✅ Desarrollo continuo de robots y hardware propio optimizado para competencia</li>
              </ul>
            </div>
          </section>

          {/* Robots */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-6 text-cyan-300">🤖 Robots desarrollados</h2>
            <div className="bg-gray-800 p-8 border border-gray-700 rounded-lg">
              <div className="grid md:grid-cols-3 gap-4">
                {robots.map((robot, i) => (
                  <div key={i} className="p-3 bg-gray-700/50 rounded text-center text-gray-300">
                    {robot}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Hardware */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-6 text-cyan-300">🔌 Hardware diseñado por XpriT</h2>
            <div className="space-y-4">
              {placas.map((placa, i) => (
                <div key={i} className="p-6 bg-gray-800 border border-gray-700 rounded-lg hover:border-cyan-500 transition-colors">
                  <h4 className="text-xl font-semibold text-cyan-300 mb-2">{placa.nombre}</h4>
                  <p className="text-gray-400">{placa.desc}</p>
                </div>
              ))}
            </div>
            <p className="text-gray-400 text-sm mt-4">
              Todas las placas están pensadas para categorías como Minisumo, Velocistas, Futboleros, VSSS y sumos autónomos.
            </p>
          </section>

          {/* Equipo */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-6 text-cyan-300">👥 Equipo</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {team.map((member, i) => (
                <div key={i} className="p-6 bg-gray-800 border border-gray-700 rounded-lg hover:border-cyan-500 transition-colors">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg mb-4"></div>
                  <h3 className="text-lg font-semibold text-cyan-300 mb-1">{member.name}</h3>
                  <p className="text-gray-400 text-sm mb-2">{member.role}</p>
                  <p className="text-gray-500 text-xs">{member.area}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Ubicación */}
          <section className="mb-16 p-8 bg-gray-800 border border-gray-700 rounded-lg">
            <h2 className="text-2xl font-bold mb-4 text-cyan-300">📍 Ubicación</h2>
            <p className="text-gray-300 mb-4">
              <strong>Misiones, Argentina</strong>
            </p>
            <p className="text-gray-400 text-sm mb-6">
              XpriT Robotics opera de forma independiente como marca/autoequipo, sin estar asociado formalmente a ninguna institución educativa o empresa. Esto nos permite mantener libertad de desarrollo y enfoque en la excelencia técnica.
            </p>
            <Link href="/contacto" className="inline-block px-6 py-3 bg-cyan-500 text-black rounded-lg font-semibold hover:bg-cyan-400 transition-colors">
              Contacta con nosotros
            </Link>
          </section>

          {/* Qué hacemos */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6 text-cyan-300">💡 Qué hacemos</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-800 border border-gray-700 rounded">
                <p className="text-cyan-300 font-semibold mb-2">🤖 Desarrollo de robots autónomos</p>
                <p className="text-gray-400 text-sm">Para competencias de alto rendimiento</p>
              </div>
              <div className="p-4 bg-gray-800 border border-gray-700 rounded">
                <p className="text-cyan-300 font-semibold mb-2">🔌 Fabricación de placas electrónicas</p>
                <p className="text-gray-400 text-sm">Para robótica competitiva</p>
              </div>
              <div className="p-4 bg-gray-800 border border-gray-700 rounded">
                <p className="text-cyan-300 font-semibold mb-2">🧠 Investigación y experimentación</p>
                <p className="text-gray-400 text-sm">IA, visión y sensores avanzados</p>
              </div>
              <div className="p-4 bg-gray-800 border border-gray-700 rounded">
                <p className="text-cyan-300 font-semibold mb-2">📚 Difusión y formación</p>
                <p className="text-gray-400 text-sm">A nivel local y online</p>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="text-center p-8 bg-gradient-to-r from-cyan-900/30 to-blue-900/30 rounded-lg">
            <h3 className="text-2xl font-bold mb-4">¿Quieres unirte al equipo?</h3>
            <p className="text-gray-300 mb-6">Buscamos personas apasionadas por la robótica y la innovación.</p>
            <Link href="/contacto" className="inline-block px-6 py-3 bg-cyan-500 text-black rounded-lg font-semibold hover:bg-cyan-400 transition-colors">
              Contacta con nosotros
            </Link>
          </section>
        </div>
      </main>
    </>
  )
}

