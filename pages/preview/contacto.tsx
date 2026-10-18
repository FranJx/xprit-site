import { ReactElement } from 'react'
import Head from 'next/head'
import PreviewLayout from '../../components/preview/Layout'

export default function PreviewContacto() {
  const handleMailtoClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const name = (document.getElementById('name') as HTMLInputElement)?.value || '';
    const email = (document.getElementById('email') as HTMLInputElement)?.value || '';
    const subject = (document.getElementById('subject') as HTMLInputElement)?.value || '';
    const message = (document.getElementById('message') as HTMLTextAreaElement)?.value || '';
    
    if (!name || !email || !subject || !message) {
      alert('Por favor completa todos los campos del formulario.');
      e.preventDefault();
      return;
    }

    const mailtoLink = `mailto:info@xprit-robotics.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`De: ${name} (${email})\n\n${message}`)}`;
    window.location.href = mailtoLink;
  };

  return (
    <div className="relative w-full py-16 px-6 min-h-[85vh] text-white">
      <div className="absolute inset-0 grid-lines opacity-[0.08] pointer-events-none z-0" />
      
      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* Page Header */}
        <div className="flex flex-col mb-16 border-b border-white/10 pb-8">
          <span className="font-mono text-[0.65rem] tracking-[0.3em] text-red-500 uppercase mb-3 block font-semibold">
            // COMUNICACIÓN OFICIAL // CONTACTO
          </span>
          <h1 className="font-display font-black text-4xl sm:text-6xl text-white">
            Conectá con XpriT
          </h1>
          <p className="text-sm text-zinc-300 mt-4 leading-relaxed max-w-2xl font-sans">
            “¿Querés colaborar con XpriT Robotics, apoyar nuestros proyectos o conocer más sobre nuestro trabajo? Estamos abiertos a nuevas oportunidades, alianzas y desafíos que nos permitan seguir impulsando la robótica argentina.”
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          
          {/* LEFT: Contact Form */}
          <div className="bg-[#0c0d12] border border-white/10 rounded-[28px] p-8 relative shadow-2xl">
            <h2 className="font-mono text-[0.68rem] tracking-[0.25em] text-red-500 uppercase mb-6 flex items-center gap-2 font-semibold">
              <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
              ENVIAR MENSAJE DIRECTO
            </h2>

            <form className="space-y-5">
              <div>
                <label className="block font-mono text-[0.62rem] text-zinc-400 tracking-wider uppercase mb-2">
                  // TU NOMBRE O INSTITUCIÓN
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  className="w-full px-4 py-3 bg-[#14151b] border border-white/10 rounded-xl text-white font-mono text-xs placeholder-zinc-600 focus:border-red-500 focus:outline-none transition-colors"
                  placeholder="Ej. Juan Pérez / Escuela Técnica..."
                />
              </div>

              <div>
                <label className="block font-mono text-[0.62rem] text-zinc-400 tracking-wider uppercase mb-2">
                  // CORREO ELECTRÓNICO
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  className="w-full px-4 py-3 bg-[#14151b] border border-white/10 rounded-xl text-white font-mono text-xs placeholder-zinc-600 focus:border-red-500 focus:outline-none transition-colors"
                  placeholder="nombre@ejemplo.com"
                />
              </div>

              <div>
                <label className="block font-mono text-[0.62rem] text-zinc-400 tracking-wider uppercase mb-2">
                  // MOTIVO / ASUNTO
                </label>
                <input
                  type="text"
                  id="subject"
                  required
                  className="w-full px-4 py-3 bg-[#14151b] border border-white/10 rounded-xl text-white font-mono text-xs placeholder-zinc-600 focus:border-red-500 focus:outline-none transition-colors"
                  placeholder="Patrocinio / Consulta Técnica / Capacitación..."
                />
              </div>

              <div>
                <label className="block font-mono text-[0.62rem] text-zinc-400 tracking-wider uppercase mb-2">
                  // MENSAJE O PROPUESTA
                </label>
                <textarea
                  id="message"
                  required
                  rows={4}
                  className="w-full px-4 py-3 bg-[#14151b] border border-white/10 rounded-xl text-white font-mono text-xs placeholder-zinc-600 focus:border-red-500 focus:outline-none transition-colors resize-none"
                  placeholder="Detalla tu propuesta o consulta..."
                ></textarea>
              </div>

              <button
                type="button"
                onClick={handleMailtoClick}
                className="w-full block font-mono text-xs font-semibold tracking-widest px-6 py-4 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors shadow-lg shadow-red-600/20 cursor-pointer text-center"
              >
                ENVIAR MENSAJE POR CORREO →
              </button>
            </form>

            <p className="font-mono text-[0.6rem] text-zinc-500 tracking-wider mt-4 text-center">
              * Se abrirá tu aplicación de correo para enviar el mensaje directamente al equipo.
            </p>
          </div>

          {/* RIGHT: Contact Information */}
          <div className="space-y-6">
            
            {/* Ubicación y Sede */}
            <div className="bg-[#111218] border border-white/10 rounded-2xl p-6">
              <span className="font-mono text-[0.62rem] tracking-[0.25em] text-red-500 uppercase mb-2 block font-semibold">
                // SEDE & ORIGEN
              </span>
              <h3 className="font-display font-bold text-lg text-white mb-2">
                Misiones, Argentina
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                Equipo independiente de robótica competitiva. Diseñamos hardware propio, fabricamos piezas en 3D e investigamos sistemas autónomos de control.
              </p>
            </div>

            {/* GitHub Oficial */}
            <div className="bg-[#111218] border border-white/10 rounded-2xl p-6">
              <span className="font-mono text-[0.62rem] tracking-[0.25em] text-red-500 uppercase mb-2 block font-semibold">
                // REPOSITORIO & OPEN SOURCE
              </span>
              <h3 className="font-display font-bold text-lg text-white mb-2">
                GitHub Oficial
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed font-sans mb-3">
                Consulta los repositorios de hardware libre, código de control y modelos 3D de nuestros proyectos como Kmioncito (WRO 2025).
              </p>
              <a
                href="https://github.com/FranJx"
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs text-red-400 hover:text-white font-semibold transition-colors flex items-center gap-1.5"
              >
                github.com/FranJx →
              </a>
            </div>

            {/* Alianzas & Distribución */}
            <div className="bg-[#111218] border border-white/10 rounded-2xl p-6">
              <span className="font-mono text-[0.62rem] tracking-[0.25em] text-red-500 uppercase mb-2 block font-semibold">
                // SOCIO COMERCIAL DE HARDWARE
              </span>
              <h3 className="font-display font-bold text-lg text-white mb-2">
                JJ Robótica
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                Distribuidor oficial y canal de comercialización de la placa controladora <strong>Dragon XT</strong> (ESP32 con puente H dual integrado).
              </p>
            </div>

            {/* Redes Sociales */}
            <div className="bg-[#111218] border border-white/10 rounded-2xl p-6">
              <span className="font-mono text-[0.62rem] tracking-[0.25em] text-red-500 uppercase mb-3 block font-semibold">
                // REDES SOCIALES OFICIALES
              </span>
              <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                <a 
                  href="https://github.com/FranJx" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-zinc-300 hover:text-white p-2.5 rounded-lg bg-black/40 border border-white/5 hover:border-red-500/40 transition-colors"
                >
                  GITHUB ↗
                </a>
                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-zinc-300 hover:text-white p-2.5 rounded-lg bg-black/40 border border-white/5 hover:border-red-500/40 transition-colors"
                >
                  INSTAGRAM ↗
                </a>
                <a 
                  href="https://youtube.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-zinc-300 hover:text-white p-2.5 rounded-lg bg-black/40 border border-white/5 hover:border-red-500/40 transition-colors"
                >
                  YOUTUBE ↗
                </a>
                <a 
                  href="https://twitter.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-zinc-300 hover:text-white p-2.5 rounded-lg bg-black/40 border border-white/5 hover:border-red-500/40 transition-colors"
                >
                  TWITTER / X ↗
                </a>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}

PreviewContacto.getLayout = function getLayout(page: ReactElement) {
  return <PreviewLayout>{page}</PreviewLayout>
}
