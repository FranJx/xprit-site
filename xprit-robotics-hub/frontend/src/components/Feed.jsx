import { useState, useEffect } from 'react'
import Post from './Post'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export default function Feed({ onNavigate }) {
  const [activeTab, setActiveTab] = useState('parati')
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_URL}/api/posts`)
      if (!response.ok) throw new Error('Error al obtener posts')
      
      const data = await response.json()
      console.log('Posts desde API:', data)
      
      // Transformar formato de API al formato del componente
      const formattedPosts = (data.posts || []).map(post => ({
        ...post,
        author: post.author?.firstName + ' ' + post.author?.lastName,
        location: post.author?.location || 'Desconocida',
        time: 'hace poco',
        tags: post.hashtags?.map(h => '#' + h.name) || [],
        emoji: post.type === 'proyecto' ? '🦾' : post.type === 'remake' ? '🔁' : '📌',
        avatar: post.author?.avatar || '',
        authorId: post.author?.id || post.userId,
        createdAt: post.createdAt,
      }))
      
      setPosts(formattedPosts)
      setError(null)
    } catch (err) {
      console.error('Error:', err)
      setError(err.message)
      setPosts([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="main-content">
      <header className="feed-header">
        <h1>Feed</h1>
        <div className="feed-tabs">
          <button className={`ftab ${activeTab === 'parati' ? 'active' : ''}`} onClick={() => setActiveTab('parati')}>Para ti</button>
          <button className={`ftab ${activeTab === 'siguiendo' ? 'active' : ''}`} onClick={() => setActiveTab('siguiendo')}>Siguiendo</button>
          <button className={`ftab ${activeTab === 'remakes' ? 'active' : ''}`} onClick={() => setActiveTab('remakes')}>Remakes</button>
          <button className={`ftab ${activeTab === 'cursos' ? 'active' : ''}`} onClick={() => setActiveTab('cursos')}>Cursos</button>
        </div>
      </header>

      <div className="feed" id="feed">
        {loading && (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--muted, #6b7280)' }}>
            <div style={{ fontSize: '24px', marginBottom: '10px' }}>⏳</div>
            <p>Cargando posts...</p>
          </div>
        )}

        {error && (
          <div style={{
            padding: '15px',
            backgroundColor: 'rgba(255, 0, 0, 0.1)',
            border: '1px solid rgba(255, 0, 0, 0.3)',
            borderRadius: '8px',
            color: '#f87171',
            margin: '10px'
          }}>
            ❌ Error: {error}
          </div>
        )}

        {!loading && !error && posts.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--muted, #6b7280)' }}>
            <p>No hay posts aún</p>
          </div>
        )}

        {!loading && !error && posts.length > 0 && posts.map(post => <Post key={post.id} post={post} onNavigate={onNavigate} />)}
      </div>
    </main>
  )
}
