import { useState, ReactElement } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { getRobotBySlugFromDB, getAllRobotsFromDB, getRobotBySlug, getAllRobots, RobotData } from '../../../lib/content'
import PreviewLayout from '../../../components/preview/Layout'

export async function getStaticPaths() {
  // Get all approved robots from database with file fallback
  let robots = await getAllRobotsFromDB()
  if (!robots || robots.length === 0) {
    robots = getAllRobots()
  }
  
  const paths = robots.map(r => ({ params: { slug: r.slug } }))
  return { paths, fallback: 'blocking' }
}

export async function getStaticProps({ params }: { params: { slug: string } }) {
  let robot = await getRobotBySlugFromDB(params.slug)
  if (!robot) {
    robot = getRobotBySlug(params.slug)
  }
  
  if (!robot) return { notFound: true }
  return { props: { robot }, revalidate: 10 }
}

export default function PreviewRobotPage({ robot }: { robot: RobotData }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  
  const gallery = robot.gallery && robot.gallery.length > 0 ? robot.gallery : [robot.mainImage]
  const currentImage = gallery[currentImageIndex]
  
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % gallery.length)
  }
  
  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + gallery.length) % gallery.length)
  }

  return (
    <div className="relative w-full py-12 px-6 min-h-screen">
      <div className="absolute inset-0 grid-lines opacity-[0.08] pointer-events-none z-0" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Back Link */}
        <div className="mb-8">
          <Link 
            href="/preview/robots" 
            className="font-mono text-[0.65rem] tracking-[0.2em] text-[var(--preview-cyan)] hover:text-white transition-colors duration-300 pointer-events-auto"
          >
            ← VOLVER_A_GALERIA.exe
          </Link>
        </div>

        {/* Title */}
        <div className="mb-12 border-b border-[rgba(0,240,255,0.06)] pb-6 flex flex-col md:flex-row md:items-baseline justify-between gap-4">
          <div>
            <span className="font-mono text-[0.55rem] text-[var(--preview-fg-faint)] tracking-[0.3em] uppercase">
              RECORDS.SLUG // {robot.slug}
            </span>
            <h1 className="font-display font-bold text-4xl md:text-5xl text-white mt-2">
              {robot.name}
            </h1>
          </div>
          
          <div className="font-mono text-[0.65rem] text-[var(--preview-cyan)] tracking-widest uppercase border border-[var(--preview-cyan)]/25 px-4 py-2 rounded bg-[var(--preview-cyan-soft)]/20">
            CAT: {robot.category}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          
          {/* LEFT: Image Gallery */}
          <div className="glass-panel p-6 rounded-lg relative flex flex-col">
            <div className="hud-corner tl" />
            <div className="hud-corner tr" />
            <div className="hud-corner bl" />
            <div className="hud-corner br" />

            <div className="font-mono text-[0.55rem] text-[var(--preview-fg-faint)] tracking-[0.25em] mb-4">
              IMAGE.TELEMETRY // VIEW_0{currentImageIndex+1}
            </div>

            {/* Main Image */}
            <div className="w-full aspect-[4/3] bg-[var(--preview-void)] border border-fine rounded relative overflow-hidden flex items-center justify-center group mb-4">
              {currentImage ? (
                <Image
                  src={currentImage}
                  alt={robot.name}
                  fill
                  className="object-contain p-4 transition-transform duration-500"
                  priority
                  unoptimized
                />
              ) : (
                <div className="font-mono text-[0.6rem] text-[var(--preview-fg-faint)] tracking-widest">
                  NO_IMAGE.raw
                </div>
              )}

              {/* Controls */}
              {gallery.length > 1 && (
                <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none z-20">
                  <button
                    onClick={prevImage}
                    className="w-8 h-8 rounded border border-fine bg-[var(--preview-ink)]/90 text-white flex items-center justify-center hover:border-[var(--preview-cyan)] transition-colors pointer-events-auto"
                    aria-label="Previous"
                  >
                    ←
                  </button>
                  <button
                    onClick={nextImage}
                    className="w-8 h-8 rounded border border-fine bg-[var(--preview-ink)]/90 text-white flex items-center justify-center hover:border-[var(--preview-cyan)] transition-colors pointer-events-auto"
                    aria-label="Next"
                  >
                    →
                  </button>
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {gallery.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {gallery.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`relative w-16 aspect-square rounded border flex-shrink-0 overflow-hidden transition-all duration-300 pointer-events-auto ${
                      idx === currentImageIndex 
                        ? 'border-[var(--preview-cyan)] shadow-[0_0_10px_var(--preview-cyan-glow)]' 
                        : 'border-fine hover:border-[var(--preview-line-strong)]'
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${robot.name} thumbnail ${idx + 1}`}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </button>
                ))}
              </div>
            )}
            
            {gallery.length > 1 && (
              <div className="font-mono text-[0.6rem] text-[var(--preview-fg-faint)] tracking-wider text-center mt-3">
                METADATA: {currentImageIndex + 1} OF {gallery.length} IMAGES
              </div>
            )}
          </div>

          {/* RIGHT: Specifications & Downloads */}
          <div className="space-y-8">
            
            {/* Telemetry Ficha Técnica */}
            <div className="glass-panel p-6 rounded-lg relative">
              <div className="hud-corner tl" />
              <div className="hud-corner tr" />
              <div className="hud-corner bl" />
              <div className="hud-corner br" />

              <h3 className="font-mono text-[0.68rem] tracking-[0.25em] text-white uppercase mb-6 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[var(--preview-cyan)] rounded-full animate-pulse"></span>
                Especificaciones Técnicas
              </h3>

              <div className="space-y-4">
                {(robot.specs || []).map((s) => (
                  <div key={s.label} className="flex justify-between border-b border-[rgba(255,255,255,0.02)] pb-3 text-xs">
                    <span className="font-mono text-[var(--preview-fg-dim)] tracking-wider uppercase">{s.label}:</span>
                    <span className="font-mono text-white text-right">{s.value}</span>
                  </div>
                ))}
                
                {(!robot.specs || robot.specs.length === 0) && (
                  <div className="text-center font-mono text-[0.65rem] text-[var(--preview-fg-faint)] tracking-widest py-8">
                    NO_SPECS_FOUND.dat
                  </div>
                )}
              </div>
            </div>

            {/* Downloads / Files */}
            <div className="glass-panel p-6 rounded-lg relative">
              <div className="hud-corner tl" />
              <div className="hud-corner tr" />
              
              <h3 className="font-mono text-[0.68rem] tracking-[0.25em] text-white uppercase mb-6 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[var(--preview-cyan)] rounded-full"></span>
                Archivos del Sistema
              </h3>

              <ul className="space-y-3 font-mono text-[0.68rem] tracking-[0.15em] text-[var(--preview-fg-dim)]">
                <li>
                  <a href="#" className="flex justify-between items-center hover:text-[var(--preview-cyan)] transition-colors pointer-events-auto py-1">
                    <span>📄 PLANOS_GENERALES.pdf</span>
                    <span className="text-[0.6rem] text-[var(--preview-fg-faint)]">DOWNLOAD</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="flex justify-between items-center hover:text-[var(--preview-cyan)] transition-colors pointer-events-auto py-1">
                    <span>📦 MODELO_3D_COMPLETO.glb</span>
                    <span className="text-[0.6rem] text-[var(--preview-fg-faint)]">DOWNLOAD</span>
                  </a>
                </li>
                <li>
                  <div className="flex justify-between items-center py-1 opacity-50">
                    <span>📋 BILL_OF_MATERIALS.csv</span>
                    <span className="text-[0.6rem] text-[var(--preview-fg-faint)]">RESTRICTED</span>
                  </div>
                </li>
              </ul>
            </div>

          </div>
        </div>

        {/* Full description */}
        <div className="glass-panel p-8 rounded-lg mt-12 relative">
          <div className="hud-corner tl" />
          <div className="hud-corner tr" />
          <div className="hud-corner bl" />
          <div className="hud-corner br" />

          <h3 className="font-mono text-[0.68rem] tracking-[0.25em] text-white uppercase mb-6 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-[var(--preview-cyan)] rounded-full"></span>
            Reporte de Diseño / Descripción
          </h3>

          <p className="text-xs md:text-sm text-[var(--preview-fg-dim)] leading-relaxed whitespace-pre-wrap font-sans">
            {robot.fullDescription || robot.description}
          </p>
        </div>

        {/* Related News Redirect */}
        <div className="relative p-10 border border-fine bg-[var(--preview-ink)]/60 rounded-lg mt-12 overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="absolute inset-0 bg-radial-gradient from-[rgba(0,102,255,0.03)] to-transparent pointer-events-none" />
          
          <div className="text-center md:text-left z-10">
            <h4 className="font-display font-bold text-lg text-white mb-2">
              ¿Quieres conocer noticias sobre este robot?
            </h4>
            <p className="text-[0.68rem] font-mono text-[var(--preview-fg-dim)] tracking-wider">
              Encuentra los últimos registros de telemetría y novedades del robot.
            </p>
          </div>
          
          <Link 
            href="/preview" 
            className="font-mono text-[0.68rem] tracking-[0.2em] px-6 py-3 border border-[var(--preview-cyan)] text-white bg-[var(--preview-cyan-soft)] hover:bg-[var(--preview-cyan)] hover:text-black transition-all duration-300 shadow-[0_0_10px_rgba(0,240,255,0.05)] z-10"
          >
            LEER_NOTICIAS.bin
          </Link>
        </div>

      </div>
    </div>
  )
}

PreviewRobotPage.getLayout = function getLayout(page: ReactElement) {
  return <PreviewLayout>{page}</PreviewLayout>
}
