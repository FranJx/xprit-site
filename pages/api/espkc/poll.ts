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

    // Find pending messages targeted to this user or 'all', with ID > lastId
    const pending = messages.filter(
      (m) =>
        m.id > lastId &&
        (m.to.toLowerCase() === targetRecipient || m.to.toLowerCase() === 'all')
    )

    if (pending.length === 0) {
      return res.status(200).json({
        hasNew: false,
        lastCheckedId: lastId,
      })
    }

    // Deliver the next unread message in order
    const nextMsg = pending[0]

    return res.status(200).json({
      hasNew: true,
      pendingCount: pending.length,
      message: {
        id: nextMsg.id,
        from: nextMsg.from,
        to: nextMsg.to,
        type: nextMsg.type,
        content: nextMsg.content,
        timestamp: nextMsg.timestamp,
        hasImage: nextMsg.hasImage,
        rawImageUrl: nextMsg.hasImage ? `/api/espkc/raw/${nextMsg.id}` : null,
      },
    })
  } catch (error) {
    console.error('Error in espkc/poll:', error)
    return res.status(500).json({ message: 'Internal server error', hasNew: false })
  }
}
