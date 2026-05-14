import { useState, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export default function EditProfileModal({ isOpen, onClose }) {
  const { user, token } = useContext(AuthContext)
  const [firstName, setFirstName] = useState(user?.firstName || '')
  const [lastName, setLastName] = useState(user?.lastName || '')
  const [bio, setBio] = useState(user?.bio || '')
  const [location, setLocation] = useState(user?.location || '')
  const [website, setWebsite] = useState(user?.website || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  if (!isOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch(`${API_URL}/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          firstName,
          lastName,
          bio,
          location,
          website,
        })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Error al actualizar')
      }

      const data = await response.json()

      // Actualizar usuario en localStorage
      localStorage.setItem('user', JSON.stringify(data.user))
      
      setSuccess('✅ Perfil actualizado correctamente')
      
      // Recargar la página para reflejar cambios
      setTimeout(() => {
        window.location.reload()
      }, 1500)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const modalOverlayStyle = {
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
    padding: '32px',
    width: '90%',
    maxWidth: '500px',
    maxHeight: '90vh',
    overflowY: 'auto',
  }

  const inputStyle = {
    width: '100%',
    padding: '10px 14px',
    border: '0.5px solid var(--border2, rgba(255,255,255,0.12))',
    borderRadius: '6px',
    fontSize: '14px',
    fontFamily: 'var(--font-body)',
    background: 'var(--bg3, #181c22)',
    color: 'var(--text, #e8eaed)',
    outline: 'none',
    boxSizing: 'border-box',
  }

  const textareaStyle = {
    ...inputStyle,
    minHeight: '80px',
    resize: 'vertical',
  }

  return (
    <div style={modalOverlayStyle} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={modalStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ 
            margin: 0, 
            fontFamily: 'var(--font-ui)', 
            fontSize: '20px',
            fontWeight: 700,
            color: 'var(--text, #e8eaed)',
            letterSpacing: '0.05em',
            textTransform: 'uppercase'
          }}>
            Editar Perfil
          </h2>
          <button onClick={onClose} style={{
            background: 'none',
            border: 'none',
            color: 'var(--muted, #6b7280)',
            fontSize: '20px',
            cursor: 'pointer',
            padding: '4px 8px',
            borderRadius: '4px',
          }}>
            ✕
          </button>
        </div>

        {error && (
          <div style={{
            padding: '10px',
            background: 'rgba(255,0,0,0.1)',
            border: '1px solid rgba(255,0,0,0.3)',
            borderRadius: '6px',
            color: '#f87171',
            fontSize: '13px',
            marginBottom: '16px'
          }}>
            ❌ {error}
          </div>
        )}

        {success && (
          <div style={{
            padding: '10px',
            background: 'rgba(29,158,117,0.1)',
            border: '1px solid rgba(29,158,117,0.3)',
            borderRadius: '6px',
            color: 'var(--accent, #1D9E75)',
            fontSize: '13px',
            marginBottom: '16px'
          }}>
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--muted2, #9ca3af)' }}>
                Nombre
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Tu nombre"
                style={inputStyle}
                required
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--muted2, #9ca3af)' }}>
                Apellido
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Tu apellido"
                style={inputStyle}
                required
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--muted2, #9ca3af)' }}>
              Bio
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Cuéntanos sobre ti..."
              style={textareaStyle}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--muted2, #9ca3af)' }}>
              Ubicación
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Ej: Buenos Aires, Argentina"
              style={inputStyle}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--muted2, #9ca3af)' }}>
              Website
            </label>
            <input
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://tusitio.com"
              style={inputStyle}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '12px',
              border: 'none',
              borderRadius: '6px',
              background: 'var(--accent, #1D9E75)',
              color: 'white',
              fontSize: '14px',
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              fontFamily: 'var(--font-ui)',
              letterSpacing: '0.03em',
              marginTop: '8px'
            }}
          >
            {loading ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </form>
      </div>
    </div>
  )
}