import Link from 'next/link'
import Image from 'next/image'

export default function Header() {
  return (
    <header className="w-full bg-gray-900 border-b border-gray-800 sticky top-0 z-50 backdrop-blur-sm bg-gray-900/95">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          {/* Logo Image */}
          <div className="w-10 h-10 flex items-center justify-center">
            <Image
              src="/images/logo.png"
              alt="XpriT Robotics Logo"
              width={40}
              height={40}
              className="group-hover:opacity-80 transition-opacity"
            />
          </div>
          {/* Logo Text */}
          <span className="gang-of-three text-2xl bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent group-hover:opacity-80 transition-opacity">
            XpriT Robotics
          </span>
        </Link>
        <nav className="hidden md:flex space-x-8">
          <Link href="/" className="text-gray-300 hover:text-cyan-400 transition-colors duration-200">Inicio</Link>
          <Link href="/robots" className="text-gray-300 hover:text-cyan-400 transition-colors duration-200">Robots</Link>
          <Link href="/noticias" className="text-gray-300 hover:text-cyan-400 transition-colors duration-200">Noticias</Link>
          <Link href="/sponsors" className="text-gray-300 hover:text-cyan-400 transition-colors duration-200">Sponsors</Link>
          <Link href="/quien-somos" className="text-gray-300 hover:text-cyan-400 transition-colors duration-200">Quiénes somos</Link>
          <Link href="/contacto" className="text-gray-300 hover:text-cyan-400 transition-colors duration-200">Contacto</Link>
        </nav>
      </div>
    </header>
  )
}
