import Head from 'next/head'

export default function Contacto() {
  const handleMailtoClick = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    const name = (document.getElementById('name') as HTMLInputElement)?.value || '';
    const email = (document.getElementById('email') as HTMLInputElement)?.value || '';
    const subject = (document.getElementById('subject') as HTMLInputElement)?.value || '';
    const message = (document.getElementById('message') as HTMLTextAreaElement)?.value || '';
    
    if (!name || !email || !subject || !message) {
      alert('Por favor completa todos los campos');
      e.preventDefault();
      return;
    }

    const mailtoLink = `mailto:info@xprit-robotics.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`De: ${name} (${email})\n\n${message}`)}`;
    window.location.href = mailtoLink;
  };

  return (
    <>
      <Head>
        <title>Contacto — XpriT Robotics</title>
        <meta name="description" content="Contacta con XpriT Robotics para preguntas, patrocinios o colaboraciones." />
      </Head>
      <main className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Contacto</h1>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Formulario */}
            <div>
              <h2 className="text-2xl font-bold mb-6 text-cyan-300">Envíanos un mensaje</h2>
              
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Nombre</label>
                  <input
                    type="text"
                    id="name"
                    required
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none transition-colors"
                    placeholder="Tu nombre"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Email</label>
                  <input
                    type="email"
                    id="email"
                    required
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none transition-colors"
                    placeholder="tu@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Asunto</label>
                  <input
                    type="text"
                    id="subject"
                    required
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none transition-colors"
                    placeholder="Asunto del mensaje"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Mensaje</label>
                  <textarea
                    id="message"
                    required
                    rows={4}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none transition-colors resize-none"
                    placeholder="Tu mensaje"
                  ></textarea>
                </div>

                <button
                  type="button"
                  onClick={handleMailtoClick}
                  className="w-full block px-6 py-3 bg-cyan-500 text-black font-semibold rounded-lg hover:bg-cyan-400 transition-colors text-center cursor-pointer"
                >
                  📧 Enviar por email
                </button>
              </form>

              <p className="text-sm text-gray-500 mt-4">
                ✓ Al hacer click, se abrirá tu cliente de email con el mensaje pre-rellenado.
              </p>
            </div>

            {/* Información de contacto */}
            <div>
              <h2 className="text-2xl font-bold mb-6 text-cyan-300">Información</h2>

              <div className="space-y-8">
                <div className="p-6 bg-gray-800 border border-gray-700 rounded-lg">
                  <h3 className="font-semibold text-cyan-300 mb-2">Email</h3>
                  <a href="mailto:info@xprit-robotics.com" className="text-gray-300 hover:text-cyan-400 transition-colors">
                    info@xprit-robotics.com
                  </a>
                </div>

                <div className="p-6 bg-gray-800 border border-gray-700 rounded-lg">
                  <h3 className="font-semibold text-cyan-300 mb-2">Ubicación</h3>
                  <p className="text-gray-300">
                    Laboratorio de Robótica<br />
                    Tu institución<br />
                    Ciudad, País
                  </p>
                </div>

                <div className="p-6 bg-gray-800 border border-gray-700 rounded-lg">
                  <h3 className="font-semibold text-cyan-300 mb-4">Redes sociales</h3>
                  <div className="space-y-2">
                    <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="block text-gray-300 hover:text-cyan-400 transition-colors">
                      GitHub →
                    </a>
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="block text-gray-300 hover:text-cyan-400 transition-colors">
                      Twitter →
                    </a>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="block text-gray-300 hover:text-cyan-400 transition-colors">
                      Instagram →
                    </a>
                    <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="block text-gray-300 hover:text-cyan-400 transition-colors">
                      YouTube →
                    </a>
                  </div>
                </div>

                <div className="p-6 bg-gray-800 border border-gray-700 rounded-lg">
                  <h3 className="font-semibold text-cyan-300 mb-2">Horario</h3>
                  <p className="text-gray-300 text-sm">
                    Lunes a Viernes: 16:00 - 20:00<br />
                    Sábados: 10:00 - 14:00<br />
                    Domingos: Cerrado
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Mapa (placeholder) */}
          <div className="mt-16 p-8 bg-gray-800 border border-gray-700 rounded-lg text-center">
            <h3 className="text-2xl font-bold mb-4 text-cyan-300">Ubicación</h3>
            <div className="w-full h-96 bg-gray-700/50 rounded flex items-center justify-center text-gray-500">
              Mapa embebido próximamente
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
