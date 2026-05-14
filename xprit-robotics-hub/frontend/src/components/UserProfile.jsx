import { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import Post from './Post'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export default function UserProfile({ userId }) {
  const { user: currentUser } = useContext(AuthContext)
  const [profile, setProfile] = useState(null)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [following, setFollowing] = useState(false)

  const isOwnProfile = currentUser?.id === parseInt(userId)

  useEffect(() => {
    if (userId) {
      fetchProfile()
      fetchUserPosts()
      checkFollowing()
    }
  }, [userId])

  const checkFollowing = async () => {
    if (!currentUser || currentUser.id === parseInt(userId)) return
    try {
      const res = await fetch(`${API_URL}/api/follows/check?followerId=${currentUser.id}&followingId=${userId}`)
      const data = await res.json()
      setFollowing(data.isFollowing)
    } catch (err) {
      console.error('Error checking follow:', err)
    }
  }

  const fetchProfile = async () => {
    try {
      const response = await fetch(`${API_URL}/api/users/${userId}`)
      if (!response.ok) throw new Error('Error')
      const data = await response.json()
      setProfile(data)
    } catch (err) {
      console.error('Error:', err)
    }
  }

  const fetchUserPosts = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_URL}/api/posts?userId=${userId}`)
      if (!response.ok) throw new Error('Error')
      const data = await response.json()
      const formattedPosts = (data.posts || []).map(post => ({
        ...post,
        author: post.author?.firstName + ' ' + post.author?.lastName,
        location: post.author?.location || 'Desconocida',
        time: 'hace poco',
        tags: post.hashtags?.map(h => '#' + h.name) || [],
        emoji: post.type === 'proyecto' ? '🦾' : post.type === 'remake' ? '🔁' : '📌',
      }))
      setPosts(formattedPosts)
    } catch (err) {
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleFollow = async () => {
    try {
      const endpoint = following ? '/unfollow' : '/follow'
      const response = await fetch(`${API_URL}/api/follows${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ followerId: currentUser.id, followingId: userId })
      })
      if (response.ok) {
        setFollowing(!following)
        fetchProfile()
      }
    } catch (err) {
      console.error('Error:', err)
    }
  }

  if (!profile) {
    return <main style={{ flex: 1, padding: '20px', textAlign: 'center', color: 'var(--text)' }}>⏳ Cargando perfil...</main>
  }

  return (
    <main style={{ flex: 1 }}>
      {/* Portada */}
      <div style={{
        height: '200px',
        background: 'var(--accent-glow, rgba(29,158,117,0.15))',
        borderBottom: '0.5px solid var(--border, rgba(255,255,255,0.07))',
        marginBottom: '50px'
      }} />

      <div style={{ padding: '0 20px 20px' }}>
        {/* Info del perfil */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '30px',
          marginTop: '-60px',
          position: 'relative',
          zIndex: 10
        }}>
          <div style={{ display: 'flex', gap: '20px' }}>
            <div style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              background: 'var(--accent, #1D9E75)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '48px',
              fontWeight: 'bold',
              border: '4px solid var(--bg, #0a0c0f)',
              fontFamily: 'var(--font-ui)'
            }}>
              {(profile.firstName?.[0] + profile.lastName?.[0] || 'U').toUpperCase()}
            </div>
            <div style={{ paddingTop: '40px' }}>
              <h1 style={{ margin: '0 0 4px 0', fontSize: '24px', fontWeight: 700, color: 'var(--text, #e8eaed)', fontFamily: 'var(--font-ui)' }}>
                {profile.firstName} {profile.lastName}
              </h1>
              <p style={{ margin: '0 0 8px 0', color: 'var(--muted, #6b7280)', fontFamily: 'var(--font-mono)' }}>
                @{profile.username}
              </p>
              {profile.bio && (
                <p style={{ margin: '0', color: 'var(--text, #e8eaed)', maxWidth: '400px', lineHeight: 1.5 }}>
                  {profile.bio}
                </p>
              )}
            </div>
          </div>

          {!isOwnProfile && (
            <button
              onClick={handleFollow}
              style={{
                padding: '10px 24px',
                background: following ? 'var(--bg3, #181c22)' : 'var(--accent, #1D9E75)',
                color: following ? 'var(--text, #e8eaed)' : 'white',
                border: following ? '0.5px solid var(--border2, rgba(255,255,255,0.12))' : 'none',
                borderRadius: '24px',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '14px',
                fontFamily: 'var(--font-ui)',
                letterSpacing: '0.03em'
              }}
            >
              {following ? 'Siguiendo' : 'Seguir'}
            </button>
          )}
        </div>

        {/* Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '20px',
          marginBottom: '30px',
          paddingBottom: '20px',
          borderBottom: '0.5px solid var(--border, rgba(255,255,255,0.07))'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--accent, #1D9E75)' }}>
              {profile.postCount || 0}
            </div>
            <div style={{ color: 'var(--muted, #6b7280)', fontSize: '13px' }}>Posts</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--accent, #1D9E75)' }}>
              {profile.followerCount || 0}
            </div>
            <div style={{ color: 'var(--muted, #6b7280)', fontSize: '13px' }}>Seguidores</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--accent, #1D9E75)' }}>
              {profile.followingCount || 0}
            </div>
            <div style={{ color: 'var(--muted, #6b7280)', fontSize: '13px' }}>Siguiendo</div>
          </div>
        </div>

        {/* Posts del usuario */}
        <div>
          <h2 style={{ marginBottom: '20px', fontFamily: 'var(--font-ui)', color: 'var(--text, #e8eaed)' }}>Publicaciones</h2>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <p style={{ color: 'var(--text, #e8eaed)' }}>⏳ Cargando posts...</p>
            </div>
          ) : posts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px', color: 'var(--muted, #6b7280)' }}>
              <p>No hay posts de este usuario</p>
            </div>
          ) : (
            <div className="posts-container">
              {posts.map(post => (
                <Post key={post.id} post={post} onPostUpdated={fetchUserPosts} />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}