import Link from 'next/link'
import Image from 'next/image'

export default function PreviewFooter() {
  const year = new Date().getFullYear()
  
  return (
    <footer className="w-full border-t border-[rgba(0,240,255,0.06)] bg-[#050508]/80 backdrop-blur-md relative z-10 py-16">
      
      {/* Decorative vertical lines and layout settings */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          
          {/* Logo & Description */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 flex items-center justify-center border border-[rgba(0,240,255,0.15)] rounded">
                <Image
                  src="/images/logo.png"
                  alt="XpriT Robotics Logo"
                  width={16}
                  height={16}
                  unoptimized
                />
              </div>
              <h4 className="font-display font-bold text-base tracking-wider text-white">
                XpriT <span className="text-[var(--preview-cyan)]">Robotics</span>
              </h4>
            </div>
            
            <p className="text-[var(--preview-fg-dim)] text-xs font-sans leading-relaxed">
              Diseño, desarrollo y fabricación de robots competitivos de nivel internacional con hardware propio. Campeón Nacional WRO.
            </p>
            
            <div className="font-mono text-[0.6rem] text-[var(--preview-fg-faint)] tracking-widest uppercase mt-2">
              SYSTEM.VER.2.0.0 // LIVE
            </div>
          </div>

          {/* Column 1: Robots & Competencias */}
          <div>
            <h5 className="font-mono text-[0.68rem] tracking-[0.25em] text-white uppercase mb-6 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-red-600 rounded-full"></span>
              Robots & Categorías
            </h5>
            <ul className="space-y-3 font-mono text-[0.68rem] tracking-[0.15em] text-zinc-400">
              <li><Link href="/preview/robots" className="hover:text-white transition-colors">VELOCISTAS (TOKIO XT)</Link></li>
              <li><Link href="/preview/robots" className="hover:text-white transition-colors">MINISUMO AUTÓNOMO</Link></li>
              <li><Link href="/preview/robots" className="hover:text-white transition-colors">LABERINTO & MICROMOUSE</Link></li>
              <li><Link href="/preview/robots" className="hover:text-white transition-colors">FÚTBOL RC & SUMO</Link></li>
            </ul>
          </div>

          {/* Column 2: Hardware & Placas */}
          <div>
            <h5 className="font-mono text-[0.68rem] tracking-[0.25em] text-white uppercase mb-6 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-red-600 rounded-full"></span>
              Hardware & Placas
            </h5>
            <ul className="space-y-3 font-mono text-[0.68rem] tracking-[0.15em] text-zinc-400">
              <li><Link href="/preview/boards" className="hover:text-white transition-colors">PLACAS CONTROLADORAS</Link></li>
              <li><Link href="/preview/boards" className="hover:text-white transition-colors">SENSORES & IMU</Link></li>
              <li><Link href="/preview/boards" className="hover:text-white transition-colors">FIRMWARE & DRIVERS</Link></li>
              <li><Link href="/preview/boards" className="hover:text-white transition-colors">ESPECIFICACIONES TÉCNICAS</Link></li>
            </ul>
          </div>

          {/* Column 3: Institucional & Recursos */}
          <div>
            <h5 className="font-mono text-[0.68rem] tracking-[0.25em] text-white uppercase mb-6 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-red-600 rounded-full"></span>
              Recursos & Equipo
            </h5>
            <ul className="space-y-3 font-mono text-[0.68rem] tracking-[0.15em] text-zinc-400">
              <li><Link href="/preview/quien-somos" className="hover:text-white transition-colors">SOBRE EL EQUIPO</Link></li>
              <li><Link href="/preview/sponsors" className="hover:text-white transition-colors">PROGRAMA SPONSOR</Link></li>
              <li><Link href="/preview/contacto" className="hover:text-white transition-colors">CONTACTAR / MAIL</Link></li>
              <li><Link href="/XTH" className="hover:text-red-400 transition-colors">PORTAL XTH HUB →</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom line */}
        <div className="border-t border-[rgba(0,240,255,0.06)] pt-10 flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-[0.65rem] tracking-wider text-[var(--preview-fg-faint)]">
          <p>© {year} XpriT Robotics. Todos los derechos reservados.</p>
          <p>
            HECHO CON <span className="text-[var(--preview-accent)]">♥</span> EN MISIONES, ARGENTINA // PREVIEW_MODE
          </p>
        </div>

      </div>
    </footer>
  )
}
