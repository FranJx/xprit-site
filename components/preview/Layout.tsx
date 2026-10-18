import { useEffect, useState, useRef } from 'react'
import Head from 'next/head'
import Header from './Header'
import Footer from './Footer'

interface LayoutProps {
  children: React.ReactNode
  title?: string
  description?: string
}

export default function PreviewLayout({ children, title = 'XpriT Robotics — Preview', description = 'Preview del rediseño' }: LayoutProps) {
  const [coords, setCoords] = useState({ x: 0, y: 0 })
  const [ringCoords, setRingCoords] = useState({ x: 0, y: 0 })
  const [hovered, setHovered] = useState(false)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCoords({ x: e.clientX, y: e.clientY })
    }

    const addHoverListeners = () => {
      const interactiveElements = document.querySelectorAll('a, button, [role="button"], input, select, textarea, .interactive-card')
      interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => setHovered(true))
        el.addEventListener('mouseleave', () => setHovered(false))
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    
    // Tiny delay to make sure DOM elements are mounted
    const timeoutId = setTimeout(addHoverListeners, 100)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      clearTimeout(timeoutId)
    }
  }, [children]) // Re-run when layout children update to attach listeners to new elements

  // Smooth ring follow effect
  useEffect(() => {
    let animationFrameId: number

    const updateRing = () => {
      setRingCoords(prev => {
        const dx = coords.x - prev.x
        const dy = coords.y - prev.y
        // Speed coefficient
        return {
          x: prev.x + dx * 0.15,
          y: prev.y + dy * 0.15
        }
      })
      animationFrameId = requestAnimationFrame(updateRing)
    }

    animationFrameId = requestAnimationFrame(updateRing)
    return () => cancelAnimationFrame(animationFrameId)
  }, [coords])

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
      </Head>

      <div className="preview-theme min-h-screen relative flex flex-col overflow-x-hidden selection:bg-cyan-900/40">
        {/* Grain Noise overlay */}
        <div className="grain-overlay" />

        {/* Custom cursor (Hidden on mobile via CSS) */}
        <div 
          className="custom-cursor" 
          style={{ 
            left: `${coords.x}px`, 
            top: `${coords.y}px`,
            width: hovered ? '0px' : '6px',
            height: hovered ? '0px' : '6px'
          }} 
        />
        <div 
          ref={ringRef}
          className="custom-cursor-ring" 
          style={{ 
            left: `${ringCoords.x}px`, 
            top: `${ringCoords.y}px`,
            width: hovered ? '50px' : '30px',
            height: hovered ? '50px' : '30px',
            borderColor: hovered ? 'var(--preview-cyan)' : 'rgba(0, 240, 255, 0.3)',
            backgroundColor: hovered ? 'rgba(0, 240, 255, 0.05)' : 'transparent'
          }} 
        />

        {/* Header/Nav for Preview */}
        <Header />

        {/* Content body */}
        <main className="flex-grow z-10 pt-20">
          {children}
        </main>

        {/* Footer for Preview */}
        <Footer />
      </div>
    </>
  )
}
