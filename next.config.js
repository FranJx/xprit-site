/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    const xthBackendUrl = process.env.XTH_BACKEND_URL || 'http://localhost:5000'
    
    return {
      beforeFiles: [
        {
          source: '/hub/:path*',
          destination: `${xthBackendUrl}/:path*`,
        },
      ],
    }
  },
}
module.exports = nextConfig
