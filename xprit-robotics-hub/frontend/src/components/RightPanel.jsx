import { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export default function RightPanel({ user, onNavigate }) {
  const { token } = useContext(AuthContext)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [searching, setSearching] = useState(false)
  const [showResults, setShowResults] = useState(false)

  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSearchResults([])
      setShowResults(false)
      return
    }

    const delay = setTimeout(() => {
      performSearch(searchQuery)
    }, 300)

    return () => clearTimeout(delay)
  }, [searchQuery])

  const performSearch = async (query) => {
    setSearching(true)
    try {
      // Buscar usuarios
      const userRes = await fetch(`${API_URL}/api/users/search?q=${encodeURIComponent(query)}&limit=5`)
      const userData = await userRes.json()

      // Buscar posts/proyectos
      const postRes = await fetch(`${API_URL}/api/posts/search?q=${encodeURIComponent(query)}`)
      const postData = await postRes.json()

      const results = [
        ...(userData.users || []).map(u => ({ ...u, type: 'user' })),
        ...(postData.posts || []).map(p => ({ 
          ...p, 
          type: 'post', 
          displayName: p.title,
          subtitle: p.author?.firstName + ' ' + p.author?.lastName || 'Usuario',
          username: p.author?.username || '',
        }))
      ]

      setSearchResults(results)
      setShowResults(true)
    } catch (err) {
      console.error('Error en búsqueda:', err)
    } finally {
      setSearching(false)
    }
  }

  const handleSelectResult = (item) => {
    setShowResults(false)
    setSearchQuery('')
    if (item.type === 'user' && onNavigate) {
      onNavigate('profile', item.id)
    }
  }

  return (
    <aside className="right-panel">
      <div className="search-box" style={{ position: 'relative' }}>
        <i className="fa-solid fa-magnifying-glass"></i>
        <input 
          type="text" 
          placeholder="Buscar usuarios o proyectos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => searchResults.length > 0 && setShowResults(true)}
        />
        {searching && <span style={{ color: 'var(--muted, #6b7280)', fontSize: '12px' }}>🔍</span>}
        
        {showResults && searchResults.length > 0 && (
          <div style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            marginTop: '4px',
            background: 'var(--bg2, #111418)',
            border: '0.5px solid var(--border2, rgba(255,255,255,0.12))',
            borderRadius: '10px',
            overflow: 'hidden',
            zIndex: 100,
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
          }}>
            {searchResults.map((item, i) => (
              <div
                key={`${item.type}-${item.id || i}`}
                onClick={() => handleSelectResult(item)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 14px',
                  cursor: 'pointer',
                  transition: 'background 0.12s',
                  borderBottom: i < searchResults.length - 1 ? '0.5px solid var(--border, rgba(255,255,255,0.07))' : 'none',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg3, #181c22)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: item.type === 'user' ? 'var(--accent, #1D9E75)' : 'var(--bg3, #181c22)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontSize: '12px',
                  fontWeight: 600,
                  flexShrink: 0,
                }}>
                  {item.type === 'user' 
                    ? ((item.firstName?.[0] || '') + (item.lastName?.[0] || '')).toUpperCase() || 'U'
                    : '📦'
                  }
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ 
                    fontSize: '13px', 
                    fontWeight: 600, 
                    color: 'var(--text, #e8eaed)',
                    fontFamily: 'var(--font-ui)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {item.type === 'user' ? `${item.firstName || ''} ${item.lastName || ''}` : item.title}
                  </div>
                  <div style={{ 
                    fontSize: '11px', 
                    color: 'var(--muted, #6b7280)',
                    fontFamily: 'var(--font-mono)'
                  }}>
                    {item.type === 'user' ? `@${item.username}` : `📄 ${item.subtitle}`}
                  </div>
                </div>
                <span style={{ 
                  fontSize: '10px', 
                  color: 'var(--muted, #6b7280)',
                  fontFamily: 'var(--font-mono)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  {item.type === 'user' ? 'Usuario' : 'Proyecto'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {user && (
        <div className="panel-card" style={{ 
          background: 'var(--bg2, #111418)', 
          border: '0.5px solid var(--border, rgba(255,255,255,0.07))',
          borderRadius: '14px',
          padding: '14px'
        }}>
          <div style={{ textAlign: 'center', paddingBottom: '16px', borderBottom: '0.5px solid var(--border, rgba(255,255,255,0.07))' }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'var(--accent, #1D9E75)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '24px',
              fontWeight: 'bold',
              margin: '0 auto 12px',
              fontFamily: 'var(--font-ui)'
            }}>
              {(user.firstName?.[0] + user.lastName?.[0] || 'U').toUpperCase()}
            </div>
            <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: 600, color: 'var(--text, #e8eaed)', fontFamily: 'var(--font-ui)' }}>
              {user.firstName} {user.lastName}
            </h3>
            <p style={{ margin: '0', color: 'var(--muted, #6b7280)', fontSize: '13px', fontFamily: 'var(--font-mono)' }}>
              @{user.username}
            </p>
            {user.isVerified && <span style={{ color: 'var(--accent, #1D9E75)', fontSize: '12px' }}>✅ Verificado</span>}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', padding: '16px 0' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--accent, #1D9E75)' }}>
                {user.postCount || 0}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--muted, #6b7280)' }}>Posts</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--accent, #1D9E75)' }}>
                {user.followerCount || 0}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--muted, #6b7280)' }}>Seguidores</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--accent, #1D9E75)' }}>
                {user.followingCount || 0}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--muted, #6b7280)' }}>Siguiendo</div>
            </div>
          </div>

          {user.bio && (
            <div style={{ 
              padding: '12px 0', 
              borderTop: '0.5px solid var(--border, rgba(255,255,255,0.07))', 
              fontSize: '13px', 
              color: 'var(--text, #e8eaed)'
            }}>
              <strong style={{ color: 'var(--muted2, #9ca3af)' }}>Bio:</strong><br/>{user.bio}
            </div>
          )}
        </div>
      )}

      <div className="panel-card" style={{ 
        background: 'var(--bg2, #111418)', 
        border: '0.5px solid var(--border, rgba(255,255,255,0.07))',
        borderRadius: '14px',
        padding: '14px'
      }}>
        <h2 className="panel-title">Tendencias</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--accent, #1D9E75)', cursor: 'pointer' }}>#ROS2</span>
            <span style={{ fontSize: '11px', color: 'var(--muted, #6b7280)' }}>📈 +23% hoy</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--accent, #1D9E75)', cursor: 'pointer' }}>#Arduino</span>
            <span style={{ fontSize: '11px', color: 'var(--muted, #6b7280)' }}>📈 +45% hoy</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--accent, #1D9E75)', cursor: 'pointer' }}>#IA</span>
            <span style={{ fontSize: '11px', color: 'var(--muted, #6b7280)' }}>📈 +67% hoy</span>
          </div>
        </div>
      </div>

      <div className="panel-card" style={{ 
        background: 'var(--bg2, #111418)', 
        border: '0.5px solid var(--border, rgba(255,255,255,0.07))',
        borderRadius: '14px',
        padding: '14px'
      }}>
        <div style={{ fontSize: '28px', marginBottom: '8px' }}>👑</div>
        <h3 style={{ 
          margin: '0 0 6px 0', 
          fontFamily: 'var(--font-ui)', 
          fontSize: '15px', 
          fontWeight: 700, 
          color: 'var(--text, #e8eaed)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>Mejora a Premium</h3>
        <p style={{ fontSize: '13px', color: 'var(--muted2, #9ca3af)', marginBottom: '12px', lineHeight: 1.5 }}>
          Obtén acceso a cursos exclusivos y herramientas pro.
        </p>
        <button style={{
          padding: '8px 20px',
          borderRadius: '20px',
          border: '0.5px solid var(--accent, #1D9E75)',
          background: 'var(--accent, #1D9E75)',
          color: '#fff',
          fontSize: '13px',
          fontFamily: 'var(--font-ui)',
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'all 0.15s',
          letterSpacing: '0.03em'
        }}>
          Upgrade
        </button>
      </div>

      <footer className="panel-footer">
        <a href="#terms">Términos</a>
        <a href="#privacy">Privacidad</a>
        <a href="#cookies">Cookies</a>
        <a href="#help">Ayuda</a>
      </footer>
    </aside>
  )
}