import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import sequelize from './config/database.js'
import { User, Post, Hashtag, PostHashtag, Follow, Like, Comment } from './models/index.js'
import userRoutes from './routes/users.js'
import postRoutes from './routes/posts.js'
import followRoutes from './routes/follows.js'
import likeRoutes from './routes/likes.js'
import commentRoutes from './routes/comments.js'

dotenv.config()

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = process.env.PORT || 5000

// CORS Configuration
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS 
    ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
    : ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
  optionsSuccessStatus: 200
}
app.use(cors(corsOptions))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// API Routes
app.use('/api/users', userRoutes)
app.use('/api/posts', postRoutes)
app.use('/api/follows', followRoutes)
app.use('/api/likes', likeRoutes)
app.use('/api/comments', commentRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'XTH Backend is running' })
})

// Servir archivos estáticos del frontend compilado
const frontendDistPath = path.join(__dirname, '../../frontend/dist')
app.use(express.static(frontendDistPath))

// SPA fallback - para que React Router funcione
app.get('*', (req, res) => {
  // Si empieza con /api, no servir el index.html
  if (req.path.startsWith('/api')) {
    res.status(404).json({ error: 'API endpoint not found' })
  } else {
    // Para cualquier otra ruta, servir el index.html del frontend
    res.sendFile(path.join(frontendDistPath, 'index.html'))
  }
})

// Error handler
app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ error: 'Internal server error' })
})

// Sincronizar base de datos e iniciar servidor
sequelize.sync({ force: false }).then(() => {
  console.log('✅ Base de datos sincronizada')
  
  app.listen(PORT, () => {
    console.log(`✅ XTH Backend corriendo en http://localhost:${PORT}`)
    console.log(`📍 API: http://localhost:${PORT}/api/posts`)
    console.log(`🌐 Frontend: http://localhost:${PORT}`)
    console.log(`💚 Health check: http://localhost:${PORT}/api/health`)
  })
}).catch(err => {
  console.error('❌ Error al sincronizar base de datos:', err)
})

