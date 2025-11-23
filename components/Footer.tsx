import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  const year = new Date().getFullYear()
  
  return (
    <footer className="w-full border-t border-gray-800 bg-gray-900">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Image
                src="/images/logo.png"
                alt="XpriT Robotics Logo"
                width={32}
                height={32}
              />
              <h4 className="gang-of-three text-xl text-cyan-400">XpriT Robotics</h4>
            </div>
            <p className="text-gray-400 text-sm mb-3">
              Desarrollamos robots competitivos de nivel internacional con hardware propio. Campeón Nacional WRO 2023 y 2025.
            </p>
            <p className="text-xs text-gray-500">📍 Misiones, Argentina</p>
          </div>
          <div>
            <h5 className="font-semibold text-gray-300 mb-4">Navegación</h5>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link href="/" className="hover:text-cyan-400 transition-colors">Inicio</Link></li>
              <li><Link href="/robots" className="hover:text-cyan-400 transition-colors">Robots</Link></li>
              <li><Link href="/noticias" className="hover:text-cyan-400 transition-colors">Noticias</Link></li>
              <li><Link href="/quien-somos" className="hover:text-cyan-400 transition-colors">Quiénes somos</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold text-gray-300 mb-4">📧 Contacto</h5>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="mailto:info@xprit-robotics.com" className="text-cyan-400 hover:text-cyan-300">info@xprit-robotics.com</a></li>
              <li><Link href="/contacto" className="text-cyan-400 hover:text-cyan-300">→ Envía un mensaje</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold text-gray-300 mb-4">🌐 Síguenos</h5>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="https://instagram.com/xprit_robotics" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors">Instagram</a></li>
              <li><a href="https://youtube.com/@xprit-robotics" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors">YouTube</a></li>
              <li><a href="https://github.com/xprit-robotics" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors">GitHub</a></li>
              <li><a href="https://twitter.com/xprit_robotics" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors">Twitter/X</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
          <p>© {year} XpriT Robotics. Todos los derechos reservados. | Hecho con ❤️ en Misiones, Argentina</p>
        </div>
      </div>
    </footer>
  )
}
