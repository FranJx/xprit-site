import Head from 'next/head'
import { useState } from 'react'

export default function Contacto() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState({ ...formState, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Aquí iría la lógica de envío (EmailJS, Netlify Forms, etc.)
    console.log('Form submitted:', formState)
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 5000)
    setFormState({ name: '', email: '', subject: '', message: '' })
  }

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
              
              {submitted && (
                <div className="mb-6 p-4 bg-green-500/20 border border-green-500 rounded text-green-300">
                  ✓ Mensaje enviado correctamente. Te contactaremos pronto.
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Nombre</label>
                  <input
                    type="text"
                    name="name"
                    value={formState.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none transition-colors"
                    placeholder="Tu nombre"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formState.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none transition-colors"
                    placeholder="tu@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Asunto</label>
                  <input
                    type="text"
                    name="subject"
                    value={formState.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none transition-colors"
                    placeholder="Asunto del mensaje"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Mensaje</label>
                  <textarea
                    name="message"
                    value={formState.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none transition-colors resize-none"
                    placeholder="Tu mensaje aquí..."
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 transform hover:scale-105"
                >
                  Enviar mensaje
                </button>
              </form>

              <p className="text-sm text-gray-500 mt-4">
                📝 Nota: Este formulario aún no está conectado a un servicio de email. Próximamente se integrará con EmailJS o Netlify Forms.
              </p>
            </div>

            {/* Información de contacto */}
            <div>
              <h2 className="text-2xl font-bold mb-6 text-cyan-300">Información</h2>

              <div className="space-y-8">
                <div className="p-6 bg-gray-800 border border-gray-700 rounded-lg">
                  <h3 className="font-semibold text-cyan-300 mb-2">Email</h3>
                  <a href="mailto:info@xprit.com" className="text-gray-300 hover:text-cyan-400 transition-colors">
                    info@xprit.com
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
