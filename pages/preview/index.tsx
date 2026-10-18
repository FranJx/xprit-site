import { ReactElement } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { getAllRobotsFromDB } from '../../lib/content'
import PreviewLayout from '../../components/preview/Layout'
import Particles from '../../components/preview/Particles'

interface Robot {
  slug: string
  name: string
  category: string
  description: string
  mainImage: string
}

export async function getStaticProps() {
  const allRobots = await getAllRobotsFromDB()
  const robots = allRobots.slice(0, 3)
  return {
    props: { robots },
    revalidate: 30,
  }
}

export default function PreviewHome({ robots }: { robots: Robot[] }) {
  // Los 3 Pilares Oficiales de XpriT Robotics
  const pilaresOficiales = [
    {
      badge: 'PILAR 01 // COMPETICIÓN',
      title: 'Robots de Competición',
      subtitle: 'Minisumo Pro, Velocistas & WRO',
      desc: 'Diseño, construcción y programación de robots preparados para competir al más alto nivel provincial, nacional e internacional. Desde la categoría Minisumo Pro hasta vehículos autónomos con visión computarizada.',
      specs: 'WINNER XT • TOKIO XT • SPEEDY BEE • KMIONCITO',
      image: '/images/velocista-open.webp',
      link: '/preview/robots',
      action: 'EXPLORAR CATÁLOGO',
    },
    {
      badge: 'PILAR 02 // HARDWARE PROPIO',
      title: 'Hardware & Placas PCB',
      subtitle: 'Sistemas Embebidos & Control',
      desc: 'Desarrollo integral de placas electrónicas fabricadas y probadas en Misiones para robótica competitiva y educativa. Placas Dragon XT (con ESP32 y drivers duales), XT-Prime, XT-RC y XT-Samurai.',
      specs: 'DRAGON XT • XT-PRIME • XT-RC • XT-SAMURAI',
      image: '/images/board-hero.webp',
      link: '/preview/boards',
      action: 'VER HARDWARE & PLACAS',
    },
    {
      badge: 'PILAR 03 // COMUNIDAD',
      title: 'Educación & Trayectoria',
      subtitle: 'Formando el Futuro Tecnológico',
      desc: 'Formación de nuevos talentos, mentorías y una sólida trayectoria en competencias internacionales. Demostramos que desde Misiones es posible crear tecnología de clase mundial que conquista horizontes.',
      specs: '90+ PODIOS • 2x CAMPEÓN WRO • TALLERES',
      image: '/images/minisumo-open.webp',
      link: '/preview/quien-somos',
      action: 'CONOCER AL EQUIPO',
    },
  ]

  // Robots destacados del historial
  const robotsDestacados = [
    {
      name: 'Kmioncito',
      category: 'WRO Future Engineers // Vehículo Autónomo',
      desc: 'Vehículo autónomo campeón nacional WRO 2025. Equipado con visión inteligente HuskyLens, IMU BNO055, dirección Ackermann y procesador Arduino Nano.',
      status: 'WRO Singapur 2025',
      tag: 'CAMPEÓN NACIONAL',
      link: '/preview/robots',
      image: '/images/laberinto-open.webp',
    },
    {
      name: 'Winner XT',
      category: 'Minisumo Pro Autónomo',
      desc: 'Robot de combate autónomo de última generación. Múltiples podios y victorias consecutivas en la Copa Robótica Misiones 2026.',
      status: 'Activo en Competición',
      tag: 'VICTORIAS 2026',
      link: '/preview/robots',
      image: '/images/minisumo-closed.webp',
    },
    {
      name: 'Speedy Bee',
      category: 'Seguidor de Línea / Velocista',
      desc: 'Robot de alta velocidad optimizado para máxima tracción y trayectoria milimétrica. Representó al equipo en el RoboChallenge 2024 de Rumania.',
      status: 'Trayectoria Internacional',
      tag: 'ROBOCHALLENGE RUMANIA',
      link: '/preview/robots',
      image: '/images/velocista-closed.webp',
    },
  ]

  return (
    <div className="relative w-full text-white">
      {/* Background Grid Lines & Ambience */}
      <div className="absolute inset-0 grid-lines opacity-[0.08] pointer-events-none z-0" />
      <Particles />

      {/* =========================================================================
          HERO SECTION (Basado en Figma con Contenido Oficial de XpriT Robotics)
          ========================================================================= */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pt-10 pb-16">
        
        {/* Top Split: Dark Box + XpriT Logo */}
        <div className="grid md:grid-cols-12 gap-8 items-center">
          
          {/* Left Dark Card */}
          <motion.div 
            className="md:col-span-8 bg-[#0c0d12] border border-white/10 rounded-2xl p-8 sm:p-12 shadow-2xl relative overflow-hidden group"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Status indicator */}
            <div className="absolute top-4 right-4 flex items-center gap-2 font-mono text-[0.6rem] text-zinc-500 tracking-widest uppercase">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
              MISIONES // ARGENTINA
            </div>

            <h1 className="font-display font-black text-4xl sm:text-6xl lg:text-7xl tracking-tight text-white uppercase leading-none mb-6">
              XPRIT ROBOTICS
            </h1>

            {/* Official Subtitle / Mission */}
            <p className="font-mono text-xs sm:text-sm tracking-[0.14em] text-zinc-300 uppercase leading-relaxed font-medium max-w-2xl">
              “Desde Misiones, Argentina, llevamos la robótica competitiva más allá de sus límites, combinando ingeniería, innovación y educación para desarrollar tecnología y formar nuevas generaciones.”
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4 pt-6 border-t border-white/5">
              <Link 
                href="/preview/robots"
                className="font-mono text-xs font-semibold tracking-widest px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded transition-colors duration-200"
              >
                VER ROBOTS →
              </Link>
              <Link 
                href="/preview/boards"
                className="font-mono text-xs font-semibold tracking-widest px-6 py-3 border border-white/20 hover:border-white text-zinc-300 hover:text-white rounded transition-colors duration-200"
              >
                PLACAS DRAGON XT
              </Link>
              <a
                href="https://github.com/FranJx"
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs tracking-widest text-zinc-400 hover:text-white flex items-center gap-1.5 ml-auto pt-2 sm:pt-0"
              >
                GITHUB OFICIAL ↗
              </a>
            </div>
          </motion.div>

          {/* Right Logo Presentation */}
          <motion.div 
            className="md:col-span-4 flex items-center justify-center p-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
              <div className="absolute inset-0 bg-red-600/15 rounded-full filter blur-3xl pointer-events-none" />
              
              <Image 
                src="/images/logo.png" 
                alt="XpriT Robotics Emblem" 
                width={280} 
                height={280} 
                className="object-contain relative z-10 drop-shadow-[0_15px_35px_rgba(239,68,68,0.25)] hover:scale-105 transition-transform duration-500" 
                priority
                unoptimized
              />
            </div>
          </motion.div>

        </div>

        {/* Big Central Statement: BREAK YOUR LIMITS. */}
        <motion.div 
          className="text-center mt-12 md:mt-20 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <h2 className="font-display font-black text-5xl sm:text-7xl md:text-8xl lg:text-[8.5rem] tracking-tight text-white uppercase leading-none select-none drop-shadow-sm">
            BREAK YOUR LIMITS.
          </h2>
          <p className="mt-4 font-mono text-xs tracking-[0.3em] text-zinc-400 uppercase">
            // ESPÍRITU COMPETITIVO • SUPERACIÓN CONSTANTE • DESAFÍOS TECNOLÓGICOS
          </p>
        </motion.div>

      </section>


      {/* =========================================================================
          SECCIÓN DE 3 TARJETAS (Los 3 Pilares Oficiales de XpriT)
          ========================================================================= */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        <div className="bg-[#14151b] border border-white/10 rounded-[36px] p-6 sm:p-10 md:p-12 shadow-2xl relative overflow-hidden">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-white/5">
            <div>
              <span className="font-mono text-[0.68rem] tracking-[0.25em] text-red-500 uppercase font-semibold">
                [ TRES PILARES FUNDAMENTALES ]
              </span>
              <h3 className="font-display font-bold text-2xl sm:text-3xl text-white mt-1">
                Ingeniería, Hardware y Educación
              </h3>
            </div>
            <Link 
              href="/preview/quien-somos"
              className="font-mono text-xs tracking-widest text-zinc-400 hover:text-white transition-colors self-start sm:self-auto flex items-center gap-1.5"
            >
              CONOCER TRAYECTORIA COMPLETA →
            </Link>
          </div>

          {/* Las 3 Cards Verticales Redondeadas */}
          <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
            {pilaresOficiales.map((pilar, idx) => (
              <motion.div
                key={idx}
                className="bg-[#1d1f27] border border-white/10 hover:border-red-500/50 rounded-[28px] overflow-hidden flex flex-col justify-between group transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 * idx }}
              >
                {/* Card Top: Image / Preview */}
                <div className="relative w-full h-56 bg-[#111218] overflow-hidden flex items-center justify-center p-4 border-b border-white/5">
                  <div className="absolute top-3 left-3 z-20">
                    <span className="font-mono text-[0.58rem] tracking-wider uppercase px-2.5 py-1 rounded bg-black/60 backdrop-blur-md text-zinc-300 border border-white/10">
                      {pilar.badge}
                    </span>
                  </div>

                  <div className="relative w-full h-full flex items-center justify-center">
                    <Image
                      src={pilar.image}
                      alt={pilar.title}
                      width={240}
                      height={180}
                      className="object-contain max-h-48 group-hover:scale-105 transition-transform duration-500"
                      unoptimized
                    />
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 flex flex-col flex-grow justify-between">
                  <div>
                    <h4 className="font-display font-bold text-xl text-white mb-1 group-hover:text-red-400 transition-colors">
                      {pilar.title}
                    </h4>
                    <p className="font-mono text-[0.68rem] text-red-500 tracking-wider uppercase mb-3 font-semibold">
                      {pilar.subtitle}
                    </p>
                    <p className="text-xs text-zinc-400 leading-relaxed font-sans mb-4">
                      {pilar.desc}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/5">
                    <div className="font-mono text-[0.62rem] text-zinc-500 tracking-wider mb-4 truncate">
                      {pilar.specs}
                    </div>
                    <Link
                      href={pilar.link}
                      className="w-full text-center block font-mono text-[0.7rem] font-semibold tracking-wider py-2.5 px-4 rounded-xl border border-white/10 hover:border-red-500 hover:bg-red-600 hover:text-white text-zinc-300 transition-all duration-200"
                    >
                      {pilar.action} →
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>


      {/* =========================================================================
          ROBOTS DESTACADOS DEL HISTORIAL (Fichas Rápidas)
          ========================================================================= */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <span className="font-mono text-[0.68rem] tracking-[0.25em] text-red-500 uppercase font-semibold">
              [ LINEA COMPETITIVA ]
            </span>
            <h3 className="font-display font-bold text-2xl sm:text-3xl text-white mt-1">
              Robots Emblemáticos del Equipo
            </h3>
          </div>
          <Link 
            href="/preview/robots"
            className="font-mono text-xs tracking-widest text-red-400 hover:text-white transition-colors"
          >
            VER LISTADO COMPLETO (TOKIO XT, MAROMERO, ETC.) →
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {robotsDestacados.map((robot, i) => (
            <div 
              key={i}
              className="bg-[#111218] border border-white/10 hover:border-white/20 rounded-2xl p-6 flex flex-col justify-between transition-colors"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="font-mono text-[0.58rem] text-red-400 tracking-widest uppercase px-2 py-0.5 rounded bg-red-600/10 border border-red-500/20">
                    {robot.tag}
                  </span>
                  <span className="font-mono text-[0.6rem] text-zinc-500">
                    {robot.status}
                  </span>
                </div>

                <h4 className="font-display font-bold text-xl text-white mb-1">
                  {robot.name}
                </h4>
                <div className="font-mono text-[0.65rem] text-zinc-400 mb-3">
                  {robot.category}
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed font-sans mb-4">
                  {robot.desc}
                </p>
              </div>

              <Link
                href={robot.link}
                className="font-mono text-[0.68rem] text-zinc-300 hover:text-white tracking-wider flex items-center gap-1 mt-2"
              >
                VER DETALLES TÉCNICOS →
              </Link>
            </div>
          ))}
        </div>
      </section>


      {/* =========================================================================
          LOGROS & TRAYECTORIA (Números Oficiales)
          ========================================================================= */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <span className="font-mono text-[0.68rem] tracking-[0.25em] text-red-500 uppercase font-semibold">
            [ HISTORIAL DE COMPETENCIA ]
          </span>
          <h3 className="font-display font-extrabold text-3xl sm:text-4xl text-white mt-1">
            Resultados que Avalan el Trabajo
          </h3>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { num: '90+', label: 'PODIOS ACUMULADOS', sub: 'Provincial, Nacional e Internacional' },
            { num: '2x', label: 'CAMPEONES NACIONALES WRO', sub: 'Future Engineers (2023 y 2025)' },
            { num: '10+', label: 'AÑOS DE EXPERIENCIA', sub: 'Trayectoria e Ingeniería Robótica' },
            { num: '20+', label: 'ROBOTS DESARROLLADOS', sub: 'Minisumo, Velocistas y Autónomos' },
          ].map((item, i) => (
            <div 
              key={i} 
              className="bg-[#121319] border border-white/10 rounded-2xl p-6 text-center hover:border-white/20 transition-colors"
            >
              <div className="font-display font-black text-4xl sm:text-5xl text-white mb-2">
                {item.num}
              </div>
              <div className="font-mono text-[0.68rem] tracking-wider text-red-400 font-semibold mb-1">
                {item.label}
              </div>
              <div className="text-[0.65rem] text-zinc-500 font-mono">
                {item.sub}
              </div>
            </div>
          ))}
        </div>
      </section>


      {/* =========================================================================
          SPONSORS, ALIANZAS & DISTRIBUCIÓN
          ========================================================================= */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-16">
        <div className="bg-[#111218] border border-white/10 rounded-[32px] p-8 sm:p-12 text-center relative overflow-hidden">
          <div className="max-w-2xl mx-auto">
            <span className="font-mono text-[0.68rem] tracking-[0.25em] text-red-500 uppercase font-semibold">
              [ ALIANZAS & PATROCINIO ]
            </span>
            <h3 className="font-display font-bold text-3xl sm:text-4xl text-white mt-2 mb-4">
              Impulsa la Robótica Competitiva Argentina
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed mb-6">
              El programa de patrocinio ofrece visibilidad de marca en nuestros robots de combate, indumentaria oficial, torneos internacionales (WRO, RoboChallenge) y material de difusión técnica.
            </p>

            {/* Mención comercial a JJ Robótica */}
            <div className="p-4 rounded-xl bg-black/40 border border-white/5 mb-8 inline-block text-left max-w-lg">
              <div className="font-mono text-[0.65rem] text-red-400 font-semibold mb-1">
                // SOCIO COMERCIAL & DISTRIBUCIÓN:
              </div>
              <p className="font-sans text-xs text-zinc-300">
                <strong>JJ Robótica</strong> comercializa y distribuye la placa controladora <strong>Dragon XT</strong> (ESP32 con puente H dual) desarrollada por XpriT Robotics.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/preview/sponsors"
                className="font-mono text-xs font-semibold tracking-widest px-8 py-3.5 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors duration-200 shadow-lg shadow-red-600/20"
              >
                PROGRAMA DE PATROCINIO →
              </Link>
              <Link
                href="/preview/contacto"
                className="font-mono text-xs font-semibold tracking-widest px-8 py-3.5 border border-white/20 hover:border-white text-zinc-300 hover:text-white rounded-xl transition-colors duration-200"
              >
                CONTACTAR AL EQUIPO
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}

PreviewHome.getLayout = function getLayout(page: ReactElement) {
  return <PreviewLayout>{page}</PreviewLayout>
}
