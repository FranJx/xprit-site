import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)

  const navLinks = [
    { href: '/', label: 'Inicio' },
    { href: '/robots', label: 'Robots' },
    { href: '/noticias', label: 'Noticias' },
    { href: '/sponsors', label: 'Sponsors' },
    { href: '/quien-somos', label: 'Quiénes somos' },
    { href: '/contacto', label: 'Contacto' },
  ]

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

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="text-gray-300 hover:text-cyan-400 transition-colors duration-200"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          <span className={`block w-6 h-0.5 bg-gray-300 transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
          <span className={`block w-6 h-0.5 bg-gray-300 transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`}></span>
          <span className={`block w-6 h-0.5 bg-gray-300 transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <nav className="md:hidden bg-gray-800 border-t border-gray-700 py-4 px-6 space-y-3">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="block text-gray-300 hover:text-cyan-400 transition-colors duration-200 py-2"
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  )
}
