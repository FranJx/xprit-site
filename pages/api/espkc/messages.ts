import { NextApiRequest, NextApiResponse } from 'next'
import { getMessages, saveMessages, processAndSaveImage, EspMessage } from '../../../lib/espkc'

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '8mb', // Allow image uploads up to 8MB
    },
  },
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const { user } = req.query
      const messages = getMessages()

      if (typeof user === 'string' && user.trim() !== '') {
        const u = user.trim().toLowerCase()
        const filtered = messages.filter(
          (m) =>
            m.from.toLowerCase() === u ||
            m.to.toLowerCase() === u ||
            m.to.toLowerCase() === 'all'
        )
        return res.status(200).json(filtered)
      }

      return res.status(200).json(messages)
    } catch (err) {
      console.error('Error fetching messages:', err)
      return res.status(500).json({ message: 'Error fetching messages' })
    }
  }

  if (req.method === 'POST') {
    try {
      const { from, to, type = 'text', content, imageBase64 } = req.body

      if (!from || !to) {
        return res.status(400).json({ message: 'Remitente (from) y Destinatario (to) son requeridos.' })
      }

      const messages = getMessages()
      const nextId = messages.length > 0 ? Math.max(...messages.map((m) => m.id)) + 1 : 1

      let hasImage = false
      let imageRawPath: string | undefined = undefined

      if (type === 'image' && imageBase64) {
        // Strip data prefix if exists
        const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '')
        const imgBuffer = Buffer.from(base64Data, 'base64')
        imageRawPath = await processAndSaveImage(imgBuffer, nextId)
        hasImage = true
      }

      const newMsg: EspMessage = {
        id: nextId,
        from: from.trim(),
        to: to.trim(),
        type: hasImage ? 'image' : 'text',
        content: content ? content.trim() : (hasImage ? '[Foto]' : ''),
        timestamp: Date.now(),
        hasImage,
        imageRawPath,
      }

      messages.push(newMsg)
      saveMessages(messages)

      return res.status(201).json({
        success: true,
        message: newMsg,
      })
    } catch (err) {
      console.error('Error creating espkc message:', err)
      return res.status(500).json({ message: 'Error al procesar el mensaje o la imagen' })
    }
  }

  return res.status(405).json({ message: 'Method not allowed' })
}
