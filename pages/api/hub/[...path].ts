import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { path } = req.query
  const pathString = Array.isArray(path) ? path.join('/') : path || ''
  
  // URL del XTH Backend
  const xthBackendUrl = process.env.XTH_BACKEND_URL || 'http://localhost:5000'
  const targetUrl = `${xthBackendUrl}/${pathString}${
    Object.keys(req.query).filter(k => k !== 'path').length > 0
      ? '?' + new URLSearchParams(
          Object.entries(req.query)
            .filter(([k]) => k !== 'path')
            .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {})
        ).toString()
      : ''
  }`

  try {
    const fetchOptions: RequestInit = {
      method: req.method,
      headers: {
        ...req.headers,
        host: new URL(xthBackendUrl).hostname,
      },
    }

    // Para métodos que envíen body
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      fetchOptions.body = JSON.stringify(req.body)
      fetchOptions.headers['Content-Type'] = 'application/json'
    }

    const response = await fetch(targetUrl, fetchOptions)
    
    // Copiar headers de respuesta
    response.headers.forEach((value, key) => {
      if (!['content-encoding', 'transfer-encoding'].includes(key.toLowerCase())) {
        res.setHeader(key, value)
      }
    })

    res.status(response.status)
    
    // Para HTML/texto
    if (response.headers.get('content-type')?.includes('text/html')) {
      const text = await response.text()
      res.send(text)
    } else {
      // Para JSON y otros
      const data = await response.json()
      res.json(data)
    }
  } catch (error) {
    console.error('Proxy error:', error)
    res.status(500).json({ error: 'Failed to connect to XTH Backend' })
  }
}
