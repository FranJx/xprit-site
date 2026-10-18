import { NextApiRequest, NextApiResponse } from 'next'
import { getMessages } from '../../../lib/espkc'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { recipient, sinceId } = req.query

    const targetRecipient = (typeof recipient === 'string' ? recipient : 'all').trim().toLowerCase()
    const lastId = parseInt(typeof sinceId === 'string' ? sinceId : '0', 10) || 0

    const messages = getMessages()

    // Find all messages targeted to this user or 'all'
    const userMessages = messages.filter(
      (m) =>
        m.to.toLowerCase() === targetRecipient || m.to.toLowerCase() === 'all'
    )

    if (userMessages.length === 0) {
      return res.status(200).json({
        hasMessage: false,
        hasNew: false,
        message: null,
      })
    }

    // Deliver the absolute latest message sent to this recipient
    const latestMsg = userMessages[userMessages.length - 1]
    const isNew = latestMsg.id > lastId

    return res.status(200).json({
      hasMessage: true,
      hasNew: isNew,
      isNew: isNew,
      pendingCount: userMessages.length,
      message: {
        id: latestMsg.id,
        from: latestMsg.from,
        to: latestMsg.to,
        type: latestMsg.type,
        content: latestMsg.content,
        timestamp: latestMsg.timestamp,
        hasImage: latestMsg.hasImage,
        rawImageUrl: latestMsg.hasImage ? `/api/espkc/raw/${latestMsg.id}` : null,
      },
    })
  } catch (error) {
    console.error('Error in espkc/poll:', error)
    return res.status(500).json({ message: 'Internal server error', hasNew: false })
  }
}
