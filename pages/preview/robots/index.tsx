import { useState, ReactElement } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { getAllRobotsFromDB, getAllRobots } from '../../../lib/content'
import PreviewLayout from '../../../components/preview/Layout'

interface Robot {
  slug: string
  name: string
  category: string
  year: number
  description: string
  mainImage: string
}

export async function getStaticProps() {
  // Load robots from database with filesystem fallback
  let robots = await getAllRobotsFromDB()
  if (!robots || robots.length === 0) {
    robots = getAllRobots()
  }
  return {
    props: { robots },
    revalidate: 10,
  }
}

export default function PreviewRobotsPage({ robots }: { robots: Robot[] }) {
  const [selectedCategory, setSelectedCategory] = useState('Todos')
  
  const categories = ['Todos', ...Array.from(new Set(robots.map(r => r.category)))]
  
  const filteredRobots = selectedCategory === 'Todos'
    ? robots
    : robots.filter(r => r.category === selectedCategory)

  return (
    <div className="relative w-full py-16 px-6 min-h-[85vh]">
      <div className="absolute inset-0 grid-lines opacity-[0.1] pointer-events-none z-0" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Page Header */}
        <div className="flex flex-col mb-16 border-b border-[rgba(0,240,255,0.06)] pb-8">
          <span className="font-mono text-[0.62rem] tracking-[0.35em] text-[var(--preview-cyan)] uppercase mb-3 block">
            // DATABASE_RECORDS // ROBOTICS.dat
          </span>
          <h1 className="font-display font-bold text-4xl md:text-5xl text-white">
            Nuestros Robots
          </h1>
          <p className="text-xs text-[var(--preview-fg-dim)] mt-3 leading-relaxed max-w-lg">
            Explora las especificaciones completas, placas de control y diseños de los robots que representan a XpriT en competencias de alto rendimiento.
          </p>
        </div>

        {/* HUD Category Filters */}
        <div className="flex gap-3 mb-12 flex-wrap items-center">
          <span className="font-mono text-[0.6rem] text-[var(--preview-fg-faint)] tracking-widest uppercase mr-2">
            FILTRAR_POR:
          </span>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`font-mono text-[0.65rem] tracking-[0.15em] px-4 py-2 border rounded transition-all duration-300 pointer-events-auto uppercase ${
                selectedCategory === cat
                  ? 'border-[var(--preview-cyan)] bg-[var(--preview-cyan-soft)] text-white shadow-[0_0_10px_rgba(0,240,255,0.05)]'
                  : 'border-fine bg-[var(--preview-ink)]/50 text-[var(--preview-fg-dim)] hover:border-[var(--preview-line-strong)] hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Robots Grid */}
        {filteredRobots.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRobots.map(robot => (
              <Link 
                key={robot.slug} 
                href={`/preview/robots/${robot.slug}`}
                className="glass-panel rounded-lg p-6 group cursor-pointer relative overflow-hidden flex flex-col justify-between min-h-[380px]"
              >
                {/* HUD Corners */}
                <div className="hud-corner tl" />
                <div className="hud-corner tr" />
                <div className="hud-corner bl" />
                <div className="hud-corner br" />

                <div>
                  {/* Image Viewport */}
                  <div className="w-full h-48 bg-[var(--preview-void)] border border-fine rounded relative overflow-hidden mb-6 flex items-center justify-center">
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--preview-void)]/60 to-transparent z-10" />
                    {robot.mainImage ? (
                      <Image
                        src={robot.mainImage}
                        alt={robot.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        unoptimized
                      />
                    ) : (
                      <div className="font-mono text-[0.6rem] text-[var(--preview-fg-faint)] tracking-widest">
                        NO_IMAGE.raw
                      </div>
                    )}
                    
                    {/* Glowing border scanlines on hover */}
                    <div className="absolute inset-0 border border-transparent group-hover:border-[var(--preview-cyan)]/25 transition-colors duration-300 pointer-events-none rounded" />
                  </div>

                  <div className="flex justify-between items-baseline mb-2">
                    <span className="font-mono text-[0.6rem] text-[var(--preview-cyan)] tracking-widest uppercase">
                      {robot.category}
                    </span>
                    <span className="font-mono text-[0.6rem] text-[var(--preview-fg-faint)]">
                      YEAR_{robot.year}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-xl text-white mb-3 group-hover:text-[var(--preview-cyan)] transition-colors duration-300">
                    {robot.name}
                  </h3>
                </div>

                <p className="text-xs text-[var(--preview-fg-dim)] leading-relaxed line-clamp-3">
                  {robot.description}
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 font-mono text-[0.72rem] text-[var(--preview-fg-faint)] tracking-widest border border-dashed border-fine max-w-xl mx-auto rounded-lg bg-[var(--preview-ink)]/30">
            NO_ROBOTS_IN_CATEGORY.err
          </div>
        )}

      </div>
    </div>
  )
}

PreviewRobotsPage.getLayout = function getLayout(page: ReactElement) {
  return <PreviewLayout>{page}</PreviewLayout>
}
