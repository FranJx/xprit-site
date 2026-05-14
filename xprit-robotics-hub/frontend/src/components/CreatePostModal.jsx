import { useState, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

export default function CreatePostModal({ isOpen, onClose, onPostCreated }) {
  const { user } = useContext(AuthContext)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState('proyecto')
  const [hashtags, setHashtags] = useState('')
  const [imagePreview, setImagePreview] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [imageError, setImageError] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    setImageError('')
    
    if (!file) {
      setImageFile(null)
      setImagePreview(null)
      return
    }

    // Validar tamaño máximo (5MB)
    if (file.size > MAX_FILE_SIZE) {
      setImageError(`La imagen es demasiado grande. Máximo 5MB (actual: ${(file.size / 1024 / 1024).toFixed(1)}MB)`)
      e.target.value = ''
      return
    }

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      setImageError('Solo se permiten archivos de imagen')
      e.target.value = ''
      return
    }

    setImageFile(file)
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result)
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user || !title.trim() || !description.trim()) {
      setError('Completa todos los campos')
      return
    }

    setLoading(true)
    setError('')

    try {
      // Procesar hashtags
      const hashtagArray = hashtags
        .split(',')
        .map(tag => tag.trim().replace('#', ''))
        .filter(tag => tag.length > 0)

      const body = {
        title: title.trim(),
        description: description.trim(),
        type,
        hashtags: hashtagArray,
      }

      // Si hay imagen, incluirla como base64 (evitamos multer)
      if (imageFile) {
        body.image = imagePreview
      }

      const response = await fetch(`${API_URL}/api/posts/${user.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}))
        throw new Error(errData.error || 'Error al crear post')
      }

      // Limpiar formulario
      setTitle('')
      setDescription('')
      setType('proyecto')
      setHashtags('')
      setImagePreview(null)
      setImageFile(null)
      setImageError('')

      onPostCreated()
      onClose()
    } catch (err) {
      console.error('Error:', err)
      setError(err.message || 'Error al crear el post')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  }

  const modalStyle = {
    background: 'var(--bg2, #111418)',
    border: '0.5px solid var(--border, rgba(255,255,255,0.07))',
    borderRadius: '14px',
    padding: '28px',
    width: '90%',
    maxWidth: '520px',
    maxHeight: '90vh',
    overflowY: 'auto',
    boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
  }

  const formInputStyle = {
    width: '100%',
    padding: '10px 12px',
    border: '0.5px solid var(--border2, rgba(255,255,255,0.12))',
    borderRadius: '6px',
    fontSize: '13px',
    fontFamily: 'var(--font-body)',
    background: 'var(--bg3, #181c22)',
    color: 'var(--text, #e8eaed)',
    outline: 'none',
    boxSizing: 'border-box',
  }

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ margin: 0, fontFamily: 'var(--font-ui)', fontSize: '20px', fontWeight: 700, color: 'var(--text, #e8eaed)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            Crear post
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--muted, #6b7280)', fontSize: '20px', cursor: 'pointer', padding: '4px 8px' }}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {error && (
            <div style={{
              padding: '10px',
              background: 'rgba(255,0,0,0.1)',
              border: '1px solid rgba(255,0,0,0.3)',
              borderRadius: '6px',
              color: '#f87171',
              fontSize: '12px',
            }}>
              ❌ {error}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--muted2, #9ca3af)' }}>Título</label>
            <input
              type="text"
              placeholder="Título de tu proyecto..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={formInputStyle}
              required
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--muted2, #9ca3af)' }}>Descripción</label>
            <textarea
              placeholder="Describe tu proyecto..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="4"
              style={{ ...formInputStyle, minHeight: '80px', resize: 'vertical' }}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--muted2, #9ca3af)' }}>Tipo</label>
              <select value={type} onChange={(e) => setType(e.target.value)} style={{
                ...formInputStyle,
                cursor: 'pointer',
                appearance: 'auto',
              }}>
                <option value="proyecto">Proyecto</option>
                <option value="avance">📈 Avance del Proyecto</option>
                <option value="remake">Remake</option>
                <option value="curso">Curso</option>
                <option value="archivo">Archivo</option>
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--muted2, #9ca3af)' }}>Tags (opcional)</label>
              <input
                type="text"
                placeholder="#ROS2, #Arduino"
                value={hashtags}
                onChange={(e) => setHashtags(e.target.value)}
                style={formInputStyle}
              />
            </div>
          </div>

          {/* Subida de imagen */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--muted2, #9ca3af)' }}>
              Imagen <span style={{ fontWeight: 400, color: 'var(--muted, #6b7280)' }}>(máx 5MB)</span>
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{
                ...formInputStyle,
                padding: '8px',
                fontSize: '12px',
              }}
            />
            {imageError && (
              <div style={{ fontSize: '11px', color: '#f87171' }}>⚠️ {imageError}</div>
            )}
            {imagePreview && (
              <div style={{
                position: 'relative',
                marginTop: '8px',
                borderRadius: '8px',
                overflow: 'hidden',
                maxWidth: '100%',
                border: '0.5px solid var(--border2, rgba(255,255,255,0.12))',
              }}>
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  style={{ 
                    width: '100%', 
                    maxHeight: '250px', 
                    objectFit: 'contain',
                    display: 'block',
                    background: 'var(--bg, #0a0c0f)',
                  }} 
                />
                <button
                  type="button"
                  onClick={() => {
                    setImagePreview(null)
                    setImageFile(null)
                    setImageError('')
                  }}
                  style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    padding: '4px 10px',
                    background: 'rgba(0,0,0,0.7)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '11px',
                    fontFamily: 'var(--font-ui)',
                  }}
                >
                  ✕ Eliminar
                </button>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '8px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '10px 20px',
                border: '0.5px solid var(--border2, rgba(255,255,255,0.12))',
                borderRadius: '6px',
                background: 'var(--bg3, #181c22)',
                color: 'var(--muted2, #9ca3af)',
                cursor: 'pointer',
                fontSize: '13px',
                fontFamily: 'var(--font-ui)',
                fontWeight: 600,
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '10px 20px',
                border: 'none',
                borderRadius: '6px',
                background: 'var(--accent, #1D9E75)',
                color: 'white',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '13px',
                fontFamily: 'var(--font-ui)',
                fontWeight: 600,
                opacity: loading ? 0.7 : 1,
                letterSpacing: '0.03em',
              }}
            >
              {loading ? 'Publicando...' : '📤 Publicar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}