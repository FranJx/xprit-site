import { useState, useEffect, useContext, useCallback } from 'react'
import { AuthContext } from '../context/AuthContext'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export default function Community({ onNavigate }) {
  const { user } = useContext(AuthContext)
  const [users, setUsers] = useState([])
  const [following, setFollowing] = useState(new Set())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_URL}/api/users`)
      if (!response.ok) throw new Error('Error')
      const data = await response.json()
      // Filtrar usuario actual
      const filtered = (data.users || []).filter(u => u.id !== user?.id)
      setUsers(filtered)
      
      // Verificar a quién ya sigo
      if (user) {
        const res = await fetch(`${API_URL}/api/follows/following/${user.id}`)
        if (res.ok) {
          const data2 = await res.json()
          const followingIds = new Set((data2.following || []).map(f => f.id))
          setFollowing(followingIds)
        }
      }
    } catch (err) {
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleFollow = async (userId) => {
    if (!user) return
    const isFollowing = following.has(userId)
    const endpoint = isFollowing ? '/unfollow' : '/follow'

    try {
      const response = await fetch(`${API_URL}/api/follows${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ followerId: user.id, followingId: userId })
      })
      if (response.ok) {
        const newFollowing = new Set(following)
        if (isFollowing) newFollowing.delete(userId)
        else newFollowing.add(userId)
        setFollowing(newFollowing)
      }
    } catch (err) {
      console.error('Error:', err)
    }
  }

  return (
    <main className="main-content">
      <div className="feed-header">
        <h1>Comunidad</h1>
      </div>

      <div style={{ padding: '16px 20px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--muted, #6b7280)' }}>
            <p>⏳ Cargando usuarios...</p>
          </div>
        ) : users.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--muted, #6b7280)' }}>
            <p>No hay usuarios para mostrar</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {users.map(u => {
              const isFollowing = following.has(u.id)
              return (
                <div
                  key={u.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    padding: '14px 16px',
                    background: 'var(--bg2, #111418)',
                    border: '0.5px solid var(--border, rgba(255,255,255,0.07))',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    transition: 'background 0.12s',
                  }}
                  onClick={() => onNavigate && onNavigate('profile', u.id)}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg3, #181c22)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'var(--bg2, #111418)'}
                >
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: 'var(--accent, #1D9E75)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontSize: '16px',
                    fontWeight: 600,
                    fontFamily: 'var(--font-ui)',
                    flexShrink: 0,
                  }}>
                    {(u.firstName?.[0] + u.lastName?.[0] || 'U').toUpperCase()}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text, #e8eaed)', fontFamily: 'var(--font-ui)' }}>
                      {u.firstName} {u.lastName}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--muted, #6b7280)', fontFamily: 'var(--font-mono)' }}>
                      @{u.username} {u.location ? `· ${u.location}` : ''}
                    </div>
                    {u.bio && (
                      <div style={{ fontSize: '12px', color: 'var(--muted2, #9ca3af)', marginTop: '4px', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {u.bio}
                      </div>
                    )}
                    <div style={{ display: 'flex', gap: '12px', marginTop: '6px', fontSize: '11px', color: 'var(--muted, #6b7280)' }}>
                      <span><strong style={{ color: 'var(--accent, #1D9E75)' }}>{u.postCount || 0}</strong> posts</span>
                      <span><strong style={{ color: 'var(--accent, #1D9E75)' }}>{u.followerCount || 0}</strong> seguidores</span>
                    </div>
                  </div>
                  {user && user.id !== u.id && (
                    <button
                      onClick={(e) => { e.stopPropagation(); handleFollow(u.id) }}
                      style={{
                        padding: '8px 18px',
                        borderRadius: '20px',
                        border: isFollowing ? '0.5px solid var(--border2, rgba(255,255,255,0.12))' : 'none',
                        background: isFollowing ? 'transparent' : 'var(--accent, #1D9E75)',
                        color: isFollowing ? 'var(--text, #e8eaed)' : '#fff',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontFamily: 'var(--font-ui)',
                        fontWeight: 600,
                        whiteSpace: 'nowrap',
                        flexShrink: 0,
                      }}
                    >
                      {isFollowing ? 'Siguiendo' : 'Seguir'}
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}