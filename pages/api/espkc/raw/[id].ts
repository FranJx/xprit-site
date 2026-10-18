import { NextApiRequest, NextApiResponse } from 'next'
import { getMessages, getRawImageBuffer } from '../../../../lib/espkc'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { id } = req.query
    const msgId = parseInt(typeof id === 'string' ? id : '', 10)

    if (isNaN(msgId)) {
      return res.status(400).json({ message: 'Invalid ID' })
    }

    const messages = getMessages()
    const msg = messages.find((m) => m.id === msgId)

    if (!msg || !msg.hasImage || !msg.imageRawPath) {
      return res.status(404).json({ message: 'Image not found' })
    }

    const buffer = getRawImageBuffer(msg.imageRawPath)
    if (!buffer) {
      return res.status(404).json({ message: 'Raw binary file missing' })
    }

    res.setHeader('Content-Type', 'application/octet-stream')
    res.setHeader('Content-Length', buffer.length.toString())
    res.setHeader('Cache-Control', 'public, max-age=86400')
    return res.status(200).send(buffer)
  } catch (err) {
    console.error('Error serving raw image:', err)
    return res.status(500).json({ message: 'Error reading raw image' })
  }
}
