import { useState, useEffect } from 'react'
import Post from './Post'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export default function Explore({ onNavigate }) {
  const [posts, setPosts] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchData()
  }, [searchQuery])

  const fetchData = async () => {
    try {
      setLoading(true)

      if (!searchQuery.trim()) {
        // Sin búsqueda: solo posts
        const postRes = await fetch(`${API_URL}/api/posts`)
        if (!postRes.ok) throw new Error('Error')
        const postData = await postRes.json()
        const formattedPosts = (postData.posts || []).map(post => ({
          ...post,
          author: post.author?.firstName + ' ' + post.author?.lastName,
          location: post.author?.location || 'Desconocida',
          time: 'hace poco',
          tags: post.hashtags?.map(h => '#' + h.name) || [],
          emoji: post.type === 'proyecto' ? '🦾' : post.type === 'remake' ? '🔁' : '📌',
          authorId: post.author?.id || post.userId,
          createdAt: post.createdAt,
        }))
        setPosts(formattedPosts)
        setUsers([])
      } else {
        // Con búsqueda: buscar usuarios Y posts
        const [userRes, postRes] = await Promise.all([
          fetch(`${API_URL}/api/users/search?q=${encodeURIComponent(searchQuery)}&limit=10`),
          fetch(`${API_URL}/api/posts/search?q=${encodeURIComponent(searchQuery)}`)
        ])

        const userData = await userRes.json()
        const postData = await postRes.json()

        setUsers(userData.users || [])
        
        const formattedPosts = (postData.posts || []).map(post => ({
          ...post,
          author: post.author?.firstName + ' ' + post.author?.lastName,
          location: post.author?.location || 'Desconocida',
          time: 'hace poco',
          tags: post.hashtags?.map(h => '#' + h.name) || [],
          emoji: post.type === 'proyecto' ? '🦾' : post.type === 'remake' ? '🔁' : '📌',
          authorId: post.author?.id || post.userId,
          createdAt: post.createdAt,
        }))
        setPosts(formattedPosts)
      }
    } catch (err) {
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <div className="feed-header">
        <h1>Explorar</h1>
        <form onSubmit={(e) => { e.preventDefault(); fetchData(); }} className="search-container" style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
          <input
            type="text"
            placeholder="Buscar usuarios, posts, hashtags..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              if (!e.target.value.trim()) fetchData()
            }}
            style={{
              flex: 1,
              padding: '10px 14px',
              border: '0.5px solid var(--border2, rgba(255,255,255,0.12))',
              borderRadius: '20px',
              fontSize: '13px',
              background: 'var(--bg2, #111418)',
              color: 'var(--text, #e8eaed)',
              outline: 'none',
              fontFamily: 'var(--font-body)',
            }}
            placeholder="Buscar usuarios o proyectos..."
          />
          <button type="submit" style={{
            padding: '10px 16px',
            border: 'none',
            borderRadius: '20px',
            background: 'var(--accent, #1D9E75)',
            color: '#fff',
            cursor: 'pointer',
            fontFamily: 'var(--font-ui)',
            fontWeight: 600,
            fontSize: '13px',
          }}>
            <i className="fa-solid fa-magnifying-glass"></i>
          </button>
        </form>
      </div>

      {loading ? (
        <div style={{ padding: '20px', textAlign: 'center', color: 'var(--muted, #6b7280)' }}>
          <p>⏳ Cargando...</p>
        </div>
      ) : (
        <>
          {/* Resultados de usuarios */}
          {users.length > 0 && (
            <div style={{ padding: '16px 20px', borderBottom: '0.5px solid var(--border, rgba(255,255,255,0.07))' }}>
              <h3 style={{ fontFamily: 'var(--font-ui)', color: 'var(--text, #e8eaed)', fontSize: '15px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
                Usuarios encontrados ({users.length})
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {users.map(user => (
                  <div
                    key={user.id}
                    onClick={() => onNavigate && onNavigate('profile', user.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      transition: 'background 0.12s',
                      background: 'var(--bg2, #111418)',
                      border: '0.5px solid var(--border, rgba(255,255,255,0.07))',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg3, #181c22)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'var(--bg2, #111418)'}
                  >
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: 'var(--accent, #1D9E75)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontSize: '14px',
                      fontWeight: 600,
                      fontFamily: 'var(--font-ui)',
                      flexShrink: 0,
                    }}>
                      {((user.firstName?.[0] || '') + (user.lastName?.[0] || '')).toUpperCase() || 'U'}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text, #e8eaed)', fontFamily: 'var(--font-ui)' }}>
                        {user.firstName} {user.lastName}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--muted, #6b7280)', fontFamily: 'var(--font-mono)' }}>
                        @{user.username} {user.location ? `· ${user.location}` : ''}
                      </div>
                    </div>
                    <span style={{ fontSize: '11px', color: 'var(--muted, #6b7280)', fontFamily: 'var(--font-mono)' }}>
                      {user.followerCount || 0} seguidores
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Posts / Proyectos */}
          <div style={{ padding: '16px 20px' }}>
            {searchQuery.trim() && (
              <h3 style={{ fontFamily: 'var(--font-ui)', color: 'var(--text, #e8eaed)', fontSize: '15px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
                Proyectos encontrados ({posts.length})
              </h3>
            )}
            
            {posts.length === 0 && users.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--muted, #6b7280)' }}>
                <p>{searchQuery ? 'No se encontraron resultados' : 'No hay posts para mostrar'}</p>
              </div>
            ) : (
              <div className="feed" style={{ padding: 0, maxWidth: '100%', gap: '16px' }}>
                {posts.map(post => (
                  <Post key={post.id} post={post} onPostUpdated={fetchData} onNavigate={onNavigate} />
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </main>
  )
}