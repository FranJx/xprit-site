import { ReactElement } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import PreviewLayout from '../../components/preview/Layout'

export default function PreviewQuienSomos() {
  const team = [
    { 
      name: 'Franco Joaquín Aguirre Elizalde', 
      role: 'Fundador & Desarrollador Principal', 
      area: '10+ años de experiencia en robótica. Diseño de hardware embebido, ruteado de PCBs, programación en C/C++ y construcción de robots de competición.' 
    },
    { 
      name: 'Marcelo Benitez', 
      role: 'CO-Líder de XpriT Robotics', 
      area: 'Desarrollador de Hardware y Software. Especialista en optimización de sistemas embebidos, pruebas en pista y desarrollo de robots autónomos.' 
    },
    { 
      name: 'Sub-Equipo de Hardware & PCBs', 
      role: 'Ingeniería Electrónica', 
      area: 'Diseño integral de las placas Dragon XT (ESP32 con control dual de motores), XT-Prime, XT-RC y XT-Samurai.' 
    },
    { 
      name: 'Área de Educación & Mentoría', 
      role: 'Capacitación y Divulgación', 
      area: 'Talleres prácticos de robótica, electrónica y programación para jóvenes y estudiantes en la provincia de Misiones.' 
    },
  ]

  const logros = [
    { num: '90+', desc: 'Podios y victorias acumuladas en torneos provinciales, nacionales e internacionales.' },
    { num: '2', desc: 'Campeonatos Nacionales WRO Future Engineers (2023 y 2025).' },
    { num: '10+', desc: 'Años de experiencia aplicada en ingeniería y robótica competitiva.' },
    { num: '20+', desc: 'Robots desarrollados e investigados en el historial de XpriT.' },
  ]

  const hitos = [
    { year: '2026', torneo: 'Copa Robótica Misiones', resultado: 'Podios y victorias en Minisumo Pro y Minisumo RC (Winner XT)' },
    { year: '2025', torneo: 'WRO Internacional Singapur', resultado: 'Representación argentina con el vehículo autónomo Kmioncito' },
    { year: '2025', torneo: 'WRO Argentina', resultado: 'Campeón Nacional, categoría Future Engineers' },
    { year: '2025', torneo: 'RSM Challenge Brasil', resultado: 'Participación internacional de alta competencia' },
    { year: '2025', torneo: 'Copa Robótica Misiones', resultado: 'Podios en Minisumo Autónomo, Minisumo RC y otras categorías' },
    { year: '2024', torneo: 'RoboChallenge Rumania', resultado: 'Top 30 internacional disputando entre los mejores equipos del mundo con Speedy Bee' },
    { year: '2024', torneo: 'WRO Argentina', resultado: 'Subcampeón Nacional, categoría Future Engineers' },
    { year: '2023', torneo: 'WRO Internacional Panamá', resultado: 'Representación oficial de Argentina' },
    { year: '2023', torneo: 'WRO Argentina', resultado: 'Campeón Nacional, categoría Future Engineers' },
    { year: '2023', torneo: 'Liga Nacional de Robótica (LNR)', resultado: '3.er puesto a nivel nacional en Minisumo Pro' },
  ]

  const robots = [
    'Kmioncito (WRO 2025)', 'Winner XT (2026)', 'Tokio XT', 'Speedy Bee (RoboChallenge)',
    'Seúl XT', 'Maromero (Invicto)', 'Marlboro', 'Marciano', 'Predator XT', 'IkarI XT',
    'BoltBot XT', 'Thunder XT', 'Snorlax XT', 'ElTitan XT', 'Sharp XT', 'Mike XT'
  ]

  const placas = [
    { 
      nombre: 'Dragon XT (ESP32)', 
      desc: 'Placa de control robótico basada en ESP32 con controlador dual de motores de hasta 1,2 A continuos por canal, WiFi, Bluetooth Classic, BLE y protocolo ESP-NOW. Comercializada y distribuida en alianza con JJ Robótica.' 
    },
    { 
      nombre: 'XT-Prime', 
      desc: 'Plataforma electrónica propia para proyectos de robótica modular y sensores analógicos/digitales integrados.' 
    },
    { 
      nombre: 'XT-RC', 
      desc: 'Desarrollo electrónico de alta respuesta orientado a sistemas robóticos radiocontrolados de combate.' 
    },
    { 
      nombre: 'XT-Samurai', 
      desc: 'Placa perteneciente a la línea de hardware propio de combate optimizada para algoritmos de alta velocidad.' 
    },
  ]

  return (
    <div className="relative w-full py-16 px-6 min-h-[85vh] text-white">
      <div className="absolute inset-0 grid-lines opacity-[0.08] pointer-events-none z-0" />
      
      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* Page Header */}
        <div className="flex flex-col mb-16 border-b border-white/10 pb-8">
          <span className="font-mono text-[0.62rem] tracking-[0.3em] text-red-500 uppercase mb-3 block font-semibold">
            // HISTORIAL OFICIAL // QUIÉNES SOMOS
          </span>
          <h1 className="font-display font-black text-4xl sm:text-6xl text-white">
            XpriT Robotics
          </h1>
          <p className="text-sm text-zinc-400 mt-3 max-w-2xl leading-relaxed">
            Desde Misiones, Argentina, combinamos ingeniería, innovación y educación para desarrollar tecnología propia y competir en los escenarios más exigentes del mundo.
          </p>
        </div>

        {/* ORIGEN & HISTORIA */}
        <section className="mb-16 bg-[#0c0d12] border border-white/10 rounded-[28px] p-8 sm:p-12 relative overflow-hidden shadow-2xl">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
            <span className="font-mono text-[0.65rem] text-red-500 tracking-[0.2em] uppercase font-semibold">
              ORIGEN // MISIONES, ARGENTINA
            </span>
          </div>
          
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white mb-6">
            Nuestra Historia
          </h2>
          
          <div className="space-y-4 text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans">
            <p>
              <strong>XpriT Robotics</strong> es un equipo independiente de robótica competitiva originario de <strong>Misiones, Argentina</strong>, fundado por <strong>Franco Joaquín Aguirre Elizalde</strong> alrededor de 2020.
            </p>
            <p>
              Nació de la pasión por diseñar, construir y competir con robots, y evolucionó rápidamente hacia un proyecto integral que abarca ingeniería electrónica, programación en sistemas embebidos, diseño mecánico en 3D, desarrollo de hardware propietario y educación tecnológica.
            </p>
            <p>
              A lo largo de su trayectoria, el equipo ha participado en competencias provinciales, nacionales e internacionales, representando con orgullo a Misiones y a la Argentina en eventos mundiales como la <strong>World Robot Olympiad (WRO)</strong> en Panamá y Singapur, y el <strong>RoboChallenge</strong> en Rumania.
            </p>
            <blockquote className="p-4 rounded-xl bg-white/5 border-l-2 border-red-500 font-mono text-xs text-zinc-200 my-4">
              “Nuestro objetivo es superar los límites de la tecnología y del conocimiento, demostrando que desde Misiones es posible desarrollar proyectos de clase mundial capaces de competir de igual a igual a nivel internacional.”
            </blockquote>
          </div>
        </section>

        {/* INTEGRANTES DEL EQUIPO */}
        <section className="mb-16">
          <div className="flex flex-col mb-8">
            <span className="font-mono text-[0.65rem] text-red-500 tracking-[0.25em] uppercase font-semibold mb-2">
              [ LIDERAZGO & DESARROLLO ]
            </span>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white">
              Equipo de Trabajo
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {team.map((member, i) => (
              <div 
                key={i} 
                className="bg-[#111218] border border-white/10 hover:border-red-500/40 rounded-2xl p-6 sm:p-8 flex flex-col justify-between transition-colors shadow-lg"
              >
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-mono text-[0.6rem] text-red-500 font-bold">
                      0{i + 1} //
                    </span>
                    <span className="font-mono text-[0.62rem] text-zinc-400 tracking-wider uppercase font-semibold">
                      {member.role}
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-xl text-white mb-3">
                    {member.name}
                  </h3>
                </div>
                
                <p className="text-xs text-zinc-400 leading-relaxed font-sans pt-3 border-t border-white/5">
                  {member.area}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* LOGROS DESTACADOS */}
        <section className="mb-16">
          <div className="flex flex-col mb-8">
            <span className="font-mono text-[0.65rem] text-red-500 tracking-[0.25em] uppercase font-semibold mb-2">
              [ PALMARÉS DE COMPETENCIA ]
            </span>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white">
              Trayectoria en Cifras
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {logros.map((l, i) => (
              <div key={i} className="bg-[#121319] border border-white/10 rounded-2xl p-6 text-center">
                <div className="font-display font-black text-4xl sm:text-5xl text-white mb-2">
                  {l.num}
                </div>
                <p className="font-mono text-[0.65rem] text-zinc-400 leading-relaxed">
                  {l.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Tabla de Hitos y Competencias Memorables */}
          <div className="bg-[#111218] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
            <div className="p-4 sm:p-6 border-b border-white/10 bg-[#161720] flex items-center justify-between">
              <span className="font-mono text-xs text-red-400 font-semibold tracking-wider">
                // CRONOLOGÍA DE COMPETENCIAS MEMORABLES
              </span>
              <span className="font-mono text-[0.65rem] text-zinc-500">
                WRO • LNR • ROBOCHALLENGE • COPA MISIONES
              </span>
            </div>

            <div className="divide-y divide-white/5">
              {hitos.map((hito, idx) => (
                <div key={idx} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold px-2.5 py-1 rounded bg-red-600/20 text-red-400 border border-red-500/30">
                      {hito.year}
                    </span>
                    <span className="font-display font-bold text-sm text-white">
                      {hito.torneo}
                    </span>
                  </div>
                  <div className="font-sans text-xs text-zinc-300 sm:text-right">
                    {hito.resultado}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* EDUCACIÓN Y COMUNIDAD */}
        <section className="mb-16 bg-[#14151b] border border-white/10 rounded-[28px] p-8 sm:p-10 shadow-2xl">
          <div className="flex items-center gap-2 mb-3">
            <span className="font-mono text-[0.65rem] text-red-500 tracking-[0.2em] uppercase font-semibold">
              [ FORMACIÓN & MENTORÍAS ]
            </span>
          </div>
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white mb-4">
            Educación Robótica en Misiones
          </h2>
          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans mb-4">
            La educación es uno de los pilares fundamentales de XpriT Robotics. Además de competir, desarrollamos actividades constantes de enseñanza, mentoría y divulgación tecnológica, compartiendo conocimientos de programación, electrónica, diseño de circuitos y construcción de robots.
          </p>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-sans">
            Buscamos acercar la robótica a jóvenes y estudiantes, promoviendo la creatividad, el pensamiento crítico, el trabajo en equipo y la formación de futuros profesionales de la tecnología argentina.
          </p>
        </section>

        {/* HARDWARE PROPIO (DRAGON XT Y LÍNEA XT) */}
        <section className="mb-16">
          <div className="flex flex-col mb-8">
            <span className="font-mono text-[0.65rem] text-red-500 tracking-[0.25em] uppercase font-semibold mb-2">
              [ HARDWARE PROPIO FABRICADO EN MISIONES ]
            </span>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white">
              Línea Electrónica XT
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {placas.map((placa, i) => (
              <div key={i} className="bg-[#111218] border border-white/10 rounded-2xl p-6 hover:border-red-500/40 transition-colors">
                <div className="font-mono text-[0.6rem] text-red-500 font-bold mb-2">
                  HARDWARE // 0{i + 1}
                </div>
                <h4 className="font-display font-bold text-lg text-white mb-2">{placa.nombre}</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">{placa.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 text-center">
            <Link 
              href="/preview/boards" 
              className="inline-block font-mono text-xs text-red-400 hover:text-white tracking-widest pt-2"
            >
              EXPLORAR ESPECIFICACIONES DE LAS PLACAS →
            </Link>
          </div>
        </section>

        {/* ROBOTS EN EL HISTORIAL */}
        <section className="mb-16">
          <div className="flex flex-col mb-6">
            <span className="font-mono text-[0.65rem] text-red-500 tracking-[0.25em] uppercase font-semibold mb-2">
              [ REGISTRO DE DESARROLLO ]
            </span>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white">
              Robots Desarrollados
            </h2>
          </div>

          <div className="bg-[#111218] border border-white/10 rounded-2xl p-6">
            <div className="flex flex-wrap gap-2.5">
              {robots.map((robot, i) => (
                <span 
                  key={i} 
                  className="font-mono text-xs px-3.5 py-1.5 rounded-lg bg-black/50 border border-white/10 text-zinc-300"
                >
                  ⚡ {robot}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="text-center bg-[#111218] border border-white/10 rounded-[28px] p-8 sm:p-12">
          <h3 className="font-display font-bold text-2xl sm:text-3xl text-white mb-3">
            ¿Querés colaborar con XpriT Robotics?
          </h3>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto leading-relaxed mb-6 font-sans">
            Estamos abiertos a nuevas oportunidades, alianzas con sponsors y desafíos que nos permitan seguir impulsando la robótica argentina.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              href="/preview/contacto" 
              className="font-mono text-xs font-semibold tracking-widest px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors"
            >
              CONTACTAR AL EQUIPO →
            </Link>
            <Link 
              href="/preview/sponsors" 
              className="font-mono text-xs font-semibold tracking-widest px-6 py-3 border border-white/20 hover:border-white text-zinc-300 hover:text-white rounded-xl transition-colors"
            >
              PROGRAMA DE SPONSORSHIP
            </Link>
          </div>
        </section>

      </div>
    </div>
  )
}

PreviewQuienSomos.getLayout = function getLayout(page: ReactElement) {
  return <PreviewLayout>{page}</PreviewLayout>
}
