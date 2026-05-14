import { useState, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export default function CreatePost({ onPostCreated }) {
  const { user } = useContext(AuthContext)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState('proyecto')
  const [hashtags, setHashtags] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    setError('')

    try {
      const hashtagArray = hashtags
        .split(',')
        .map(tag => tag.trim().replace('#', ''))
        .filter(tag => tag.length > 0)

      const response = await fetch(`${API_URL}/api/posts/${user.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          type,
          hashtags: hashtagArray,
          image: 'https://images.unsplash.com/photo-1561557404-fc0cdc007a11?w=500&h=500&fit=crop'
        })
      })

      if (!response.ok) {
        throw new Error('Error al crear post')
      }

      const data = await response.json()
      
      // Limpiar formulario
      setTitle('')
      setDescription('')
      setType('proyecto')
      setHashtags('')

      if (onPostCreated) {
        onPostCreated(data.post)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="create-post-container">
      <div className="create-post-card">
        <h3>✨ Crea un nuevo post</h3>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="create-form">
          <div className="form-group">
            <label>Título</label>
            <input
              type="text"
              placeholder="Título de tu proyecto..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Descripción</label>
            <textarea
              placeholder="Describe tu proyecto..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="4"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Tipo</label>
              <select value={type} onChange={(e) => setType(e.target.value)}>
                <option value="proyecto">Proyecto</option>
                <option value="remake">Remake</option>
                <option value="tutorial">Tutorial</option>
                <option value="tip">Tip</option>
                <option value="noticia">Noticia</option>
              </select>
            </div>

            <div className="form-group">
              <label>Hashtags (separados por coma)</label>
              <input
                type="text"
                placeholder="#ROS2, #Arduino, #Python"
                value={hashtags}
                onChange={(e) => setHashtags(e.target.value)}
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? '📤 Publicando...' : '📤 Publicar'}
          </button>
        </form>
      </div>
    </div>
  )
}
