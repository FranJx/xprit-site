import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

export default function PreviewHeader() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { href: '/preview/quien-somos', label: 'NOSOTROS' },
    { href: '/preview/robots', label: 'ROBOTS' },
    { href: '/preview/boards', label: 'RECURSOS & PLACAS' },
    { href: '/preview/sponsors', label: 'SPONSOR' },
    { href: '/preview/contacto', label: 'CONTACTO' },
  ]

  const isActive = (path: string) => {
    if (path === '/preview') {
      return router.pathname === '/preview'
    }
    return router.pathname.startsWith(path)
  }

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b ${
        scrolled 
          ? 'bg-[#050508]/85 backdrop-blur-md py-4 border-[rgba(0,240,255,0.08)]' 
          : 'bg-transparent py-6 border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        
        {/* LOGO */}
        <Link href="/preview" className="flex items-center gap-3 group relative pointer-events-auto">
          <div className="relative w-8 h-8 flex items-center justify-center border border-[rgba(0,240,255,0.2)] rounded group-hover:border-[var(--preview-cyan)] transition-colors duration-300">
            <Image
              src="/images/logo.png"
              alt="XpriT Robotics Logo"
              width={22}
              height={22}
              className="group-hover:scale-110 transition-transform duration-300 filter brightness-110"
              unoptimized
            />
            <div className="absolute inset-0 bg-[rgba(0,240,255,0.05)] opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          
          <div className="flex flex-col">
            <span className="font-display font-bold text-lg tracking-wider text-white group-hover:text-[var(--preview-cyan)] transition-colors duration-300">
              XpriT <span className="text-[var(--preview-cyan)] font-light font-sans text-xs uppercase tracking-[0.2em] ml-1">Robotics</span>
            </span>
          </div>
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map(link => {
            const active = isActive(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`font-mono text-[0.72rem] tracking-[0.2em] relative py-1 transition-colors duration-300 ${
                  active ? 'text-white' : 'text-[var(--preview-fg-dim)] hover:text-white'
                }`}
              >
                {link.label}
                {active && (
                  <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-[var(--preview-cyan)] to-[var(--preview-blue)] shadow-[0_0_8px_var(--preview-cyan-glow)]" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* STATUS HUD & CTA */}
        <div className="hidden md:flex items-center gap-6">
          <div className="flex items-center gap-2 font-mono text-[0.62rem] tracking-wider text-[var(--preview-fg-dim)] border border-fine px-3 py-1.5 rounded bg-[var(--preview-ink)]/50">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--preview-cyan)] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--preview-cyan)] shadow-[0_0_6px_var(--preview-cyan-glow)]"></span>
            </span>
            <span>HUB.ONLINE</span>
          </div>

          <Link
            href="/XTH"
            className="font-mono text-[0.7rem] font-bold tracking-[0.15em] px-4 py-2 border border-[var(--preview-cyan)] text-white rounded bg-[var(--preview-cyan-soft)] hover:bg-[var(--preview-cyan)] hover:text-black transition-all duration-300 shadow-[0_0_15px_rgba(0,240,255,0.1)] hover:shadow-[0_0_20px_var(--preview-cyan-glow)]"
          >
            ACCEDER XTH
          </Link>
        </div>

        {/* MOBILE MENU TRIGGER */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2 border border-fine rounded bg-[var(--preview-ink)]/40 hover:border-[var(--preview-cyan)] transition-colors pointer-events-auto"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
          <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`}></span>
          <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
        </button>

      </div>

      {/* MOBILE NAV DROPDOWN */}
      <div 
        className={`md:hidden fixed inset-x-0 top-[72px] bg-[#050508]/95 border-b border-[rgba(0,240,255,0.08)] backdrop-blur-lg transition-all duration-300 ease-in-out ${
          isOpen ? 'opacity-100 max-h-screen py-6' : 'opacity-0 max-h-0 overflow-hidden pointer-events-none'
        }`}
      >
        <nav className="flex flex-col gap-4 px-6">
          {navLinks.map(link => {
            const active = isActive(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`font-mono text-xs tracking-widest py-2 border-b border-[rgba(255,255,255,0.02)] transition-colors ${
                  active ? 'text-[var(--preview-cyan)]' : 'text-[var(--preview-fg-dim)] hover:text-white'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            )
          })}
          
          <div className="pt-4 flex items-center justify-between">
            <div className="flex items-center gap-2 font-mono text-[0.62rem] tracking-wider text-[var(--preview-fg-dim)]">
              <span className="relative flex h-2 w-2">
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--preview-cyan)]"></span>
              </span>
              <span>HUB.ONLINE</span>
            </div>
            
            <Link
              href="/XTH"
              className="font-mono text-[0.7rem] font-bold tracking-[0.15em] px-4 py-2 border border-[var(--preview-cyan)] text-white rounded bg-[var(--preview-cyan-soft)]"
              onClick={() => setIsOpen(false)}
            >
              ACCEDER XTH
            </Link>
          </div>
        </nav>
      </div>
    </header>
  )
}
