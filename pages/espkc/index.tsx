import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'

interface EspMessage {
  id: number
  from: string
  to: string
  type: 'text' | 'image'
  content: string
  timestamp: number
  hasImage: boolean
}

export default function EspKcPage() {
  const [messages, setMessages] = useState<EspMessage[]>([])
  const [fromUser, setFromUser] = useState('Fran')
  const [toUser, setToUser] = useState('Lore')
  const [textMessage, setTextMessage] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [statusMsg, setStatusMsg] = useState('')

  const fetchMessages = async () => {
    try {
      const res = await fetch('/api/espkc/messages')
      if (res.ok) {
        const data = await res.json()
        setMessages(data.reverse())
      }
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchMessages()
    const interval = setInterval(fetchMessages, 5000)
    return () => clearInterval(interval)
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setSelectedFile(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!textMessage.trim() && !selectedFile) {
      setStatusMsg('Escribe un texto o selecciona una foto.')
      return
    }

    setLoading(true)
    setStatusMsg('Enviando al servidor...')

    try {
      let imageBase64 = null
      if (selectedFile) {
        imageBase64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result as string)
          reader.onerror = reject
          reader.readAsDataURL(selectedFile)
        })
      }

      const res = await fetch('/api/espkc/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: fromUser,
          to: toUser,
          type: imageBase64 ? 'image' : 'text',
          content: textMessage,
          imageBase64,
        }),
      })

      if (res.ok) {
        setStatusMsg('¡Mensaje enviado con éxito al llavero!')
        setTextMessage('')
        setSelectedFile(null)
        setPreviewUrl(null)
        fetchMessages()
      } else {
        setStatusMsg('Error al enviar mensaje.')
      }
    } catch (err) {
      setStatusMsg('Error de conexión.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>XpriT ESP-KC — Llavero IoT</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <div className="min-h-screen bg-[#07080c] text-white p-4 sm:p-8 font-sans">
        <div className="max-w-2xl mx-auto">
          
          {/* Header */}
          <div className="flex items-center justify-between pb-6 border-b border-white/10 mb-8">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
              <div>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white uppercase">
                  XpriT ESP-KC <span className="text-red-500 text-sm font-mono">// LLAVERO IOT</span>
                </h1>
                <p className="text-xs text-zinc-400">
                  ESP32-C3 SuperMini • ST7735S 80x160 IPS • Mensajería P2P
                </p>
              </div>
            </div>
            <Link
              href="/preview"
              className="text-xs font-mono text-zinc-400 hover:text-white border border-white/10 px-3 py-1.5 rounded-lg"
            >
              ← Web
            </Link>
          </div>

          {/* Form Card */}
          <div className="bg-[#101118] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl mb-8">
            <h2 className="text-sm font-mono uppercase tracking-wider text-red-400 mb-6 font-semibold flex items-center gap-2">
              <span>✉</span> Enviar Mensaje a un Llavero
            </h2>

            <form onSubmit={handleSend} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[0.68rem] font-mono uppercase text-zinc-400 mb-1.5">
                    De (Tu Nombre/ID)
                  </label>
                  <input
                    type="text"
                    value={fromUser}
                    onChange={(e) => setFromUser(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white font-mono text-sm focus:border-red-500 focus:outline-none"
                    placeholder="ej: Fran"
                  />
                </div>
                <div>
                  <label className="block text-[0.68rem] font-mono uppercase text-zinc-400 mb-1.5">
                    Para (Destinatario)
                  </label>
                  <input
                    type="text"
                    value={toUser}
                    onChange={(e) => setToUser(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white font-mono text-sm focus:border-red-500 focus:outline-none"
                    placeholder="ej: Lore o all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[0.68rem] font-mono uppercase text-zinc-400 mb-1.5">
                  Mensaje de Texto
                </label>
                <textarea
                  rows={3}
                  value={textMessage}
                  onChange={(e) => setTextMessage(e.target.value)}
                  placeholder="Escribe algo lindo o un aviso para la pantalla..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:border-red-500 focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-[0.68rem] font-mono uppercase text-zinc-400 mb-1.5">
                  Foto / Imagen (Se recortará a 160x80 px)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="text-xs text-zinc-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-mono file:bg-white/10 file:text-white hover:file:bg-white/20 cursor-pointer"
                />

                {previewUrl && (
                  <div className="mt-3 p-3 bg-black/50 border border-white/10 rounded-xl inline-block">
                    <p className="text-[0.62rem] font-mono text-zinc-400 mb-2">
                      Vista previa (160x80):
                    </p>
                    <div className="w-[160px] h-[80px] overflow-hidden rounded border border-red-500/50 bg-black">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}
              </div>

              {statusMsg && (
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-zinc-300">
                  {statusMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-mono text-xs font-bold tracking-widest uppercase rounded-xl transition-colors shadow-lg shadow-red-600/20 cursor-pointer"
              >
                {loading ? 'ENVIANDO...' : 'ENVIAR AL LLAVERO →'}
              </button>
            </form>
          </div>

          {/* Historial de Mensajes */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                Historial de Mensajes en el Servidor
              </h3>
              <span className="text-[0.65rem] font-mono text-zinc-500">
                {messages.length} mensajes guardados
              </span>
            </div>

            <div className="space-y-3">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className="p-4 bg-[#111218] border border-white/10 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[0.6rem] font-bold px-2 py-0.5 rounded bg-red-600/20 text-red-400 border border-red-500/30">
                        ID #{msg.id}
                      </span>
                      <span className="font-mono text-[0.65rem] text-zinc-300">
                        <strong>De:</strong> {msg.from} → <strong>Para:</strong> {msg.to}
                      </span>
                      <span className="font-mono text-[0.6rem] text-zinc-500 ml-auto sm:ml-0">
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </span>
                    </div>

                    <p className="text-zinc-200 mt-1">
                      {msg.content || (msg.hasImage ? '[Foto Enviada]' : '')}
                    </p>
                  </div>

                  {msg.hasImage && (
                    <a
                      href={`/api/espkc/raw/${msg.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-[0.65rem] text-red-400 hover:text-white border border-red-500/30 px-3 py-1.5 rounded-lg self-start sm:self-auto"
                    >
                      Ver Raw RGB565 ↗
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </>
  )
}
