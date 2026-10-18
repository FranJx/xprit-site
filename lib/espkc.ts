import fs from 'fs'
import path from 'path'
import sharp from 'sharp'

export interface EspMessage {
  id: number
  from: string
  to: string
  type: 'text' | 'image'
  content: string
  timestamp: number
  hasImage: boolean
  imageRawPath?: string
}

const dataDir = path.join(process.cwd(), 'data')
const storageFile = path.join(dataDir, 'espkc-messages.json')
const imagesDir = path.join(dataDir, 'espkc-images')

function ensureStorage() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true })
  }
  if (!fs.existsSync(storageFile)) {
    // Initial welcome message
    const initial: EspMessage[] = [
      {
        id: 1,
        from: 'XpriT',
        to: 'all',
        type: 'text',
        content: '¡Llavero XpriT inicializado con éxito!',
        timestamp: Date.now(),
        hasImage: false,
      },
    ]
    fs.writeFileSync(storageFile, JSON.stringify(initial, null, 2), 'utf-8')
  }
}

export function getMessages(): EspMessage[] {
  ensureStorage()
  try {
    const raw = fs.readFileSync(storageFile, 'utf-8')
    return JSON.parse(raw)
  } catch (err) {
    console.error('Error reading espkc messages:', err)
    return []
  }
}

export function saveMessages(messages: EspMessage[]) {
  ensureStorage()
  fs.writeFileSync(storageFile, JSON.stringify(messages, null, 2), 'utf-8')
}

export async function processAndSaveImage(
  inputBuffer: Buffer,
  messageId: number
): Promise<string> {
  ensureStorage()
  const rawFilename = `img_${messageId}_160x80.raw`
  const rawPath = path.join(imagesDir, rawFilename)

  // Resize to exactly 160x80 (horizontal landscape) with EXIF auto-rotation
  const { data } = await sharp(inputBuffer)
    .rotate()
    .resize(160, 80, { fit: 'cover' })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })

  // Convert RGB888 (3 bytes) to RGB565 Big Endian (2 bytes)
  const rgb565 = Buffer.alloc(160 * 80 * 2)
  for (let i = 0; i < 160 * 80; i++) {
    const r = data[i * 3]
    const g = data[i * 3 + 1]
    const b = data[i * 3 + 2]

    // 5 bits red, 6 bits green, 5 bits blue
    const val = ((r & 0xf8) << 8) | ((g & 0xfc) << 3) | (b >> 3)
    rgb565.writeUInt16BE(val, i * 2)
  }

  fs.writeFileSync(rawPath, rgb565)
  return rawFilename
}

export function getRawImageBuffer(filename: string): Buffer | null {
  const filePath = path.join(imagesDir, filename)
  if (!fs.existsSync(filePath)) return null
  return fs.readFileSync(filePath)
}
