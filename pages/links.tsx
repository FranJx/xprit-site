import Head from 'next/head'

export default function LinksPage() {
  const links = [
    {
      name: 'Instagram',
      icon: '📷',
      url: 'https://www.instagram.com/xprit_robotics/',
      color: 'from-pink-500 to-purple-500'
    },
    {
      name: 'YouTube - FrnJx',
      icon: '▶️',
      url: 'https://www.youtube.com/@FrnJx_',
      color: 'from-red-500 to-red-600'
    },
    {
      name: 'YouTube - XpriT Robotics',
      icon: '▶️',
      url: 'https://www.youtube.com/@XpriT_Robotics',
      color: 'from-red-500 to-red-600'
    },
    {
      name: 'GitHub',
      icon: '🐙',
      url: 'https://github.com/FranJx/XpriT-Robots-OS',
      color: 'from-gray-800 to-gray-900'
    },
    {
      name: 'Contacto',
      icon: '✉️',
      url: 'mailto:info@xprit-robotics.com',
      color: 'from-cyan-500 to-blue-500'
    },
    {
      name: 'Robots',
      icon: '🤖',
      url: '/robots',
      color: 'from-green-500 to-emerald-500'
    },
    {
      name: 'Noticias',
      icon: '📰',
      url: '/noticias',
      color: 'from-yellow-500 to-orange-500'
    }
  ]

  return (
    <>
      <Head>
        <title>XpriT Robotics — Enlaces</title>
        <meta name="description" content="Todos nuestros enlaces en un solo lugar" />
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <main className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-900 via-gray-900 to-cyan-900/20">
        <div className="w-full max-w-sm">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="text-6xl mb-4">🤖</div>
            <h1 className="text-4xl font-bold text-cyan-300 mb-2">XpriT Robotics</h1>
            <p className="text-gray-400">Ingenio. Diseño. Competencia.</p>
          </div>

          {/* Links Grid */}
          <div className="space-y-4 mb-8">
            {links.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target={link.url.startsWith('http') ? '_blank' : undefined}
                rel={link.url.startsWith('http') ? 'noopener noreferrer' : undefined}
                className={`
                  block w-full p-6 rounded-lg 
                  bg-gradient-to-r ${link.color}
                  hover:shadow-lg hover:shadow-cyan-500/30 
                  transform hover:scale-105 
                  transition-all duration-300
                  text-white font-semibold
                  border-0 cursor-pointer
                  flex items-center justify-center gap-3
                `}
              >
                <span className="text-2xl">{link.icon}</span>
                <span>{link.name}</span>
              </a>
            ))}
          </div>

          {/* Footer */}
          <div className="text-center text-gray-500 text-sm border-t border-gray-700 pt-6">
            <p>Escanea el código QR o accede directamente a nuestros enlaces</p>
          </div>
        </div>
      </main>
    </>
  )
}
