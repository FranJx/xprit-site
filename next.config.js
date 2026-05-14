/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return {
      fallback: [
        // Para rutas del XTH que no existan en Next.js, servir index.html del hub
        {
          source: '/hub/:path*',
          destination: '/hub/index.html',
        },
      ],
    }
  },
}
module.exports = nextConfig
