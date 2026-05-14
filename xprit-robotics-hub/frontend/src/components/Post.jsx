import { useState, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

function formatTime(dateString) {
  if (!dateString) return 'hace un momento'
  
  const now = new Date()
  const date = new Date(dateString)
  const diffMs = now - date
  const diffSec = Math.floor(diffMs / 1000)
  
  if (diffSec < 60) return 'hace unos segundos'
  
  const diffMin = Math.floor(diffSec / 60)
  if (diffMin < 60) return `hace ${diffMin} min`
  
  const diffHour = Math.floor(diffMin / 60)
  if (diffHour < 24) return `hace ${diffHour}h`
  
  const diffDay = Math.floor(diffHour / 24)
  if (diffDay < 7) return `hace ${diffDay}d`
  
  const options = { day: 'numeric', month: 'short' }
  return date.toLocaleDateString('es-AR', options)
}

export default function Post({ post, onPostUpdated, onNavigate }) {
  const authContext = useContext(AuthContext)
  const user = authContext?.user
  const [liked, setLiked] = useState(false)
  const [likes, setLikes] = useState(post.likeCount || post.likes || 0)
  const [showComments, setShowComments] = useState(false)
  const [comments, setComments] = useState([])
  const [loadingComments, setLoadingComments] = useState(false)
  const [newComment, setNewComment] = useState('')
  const [loadingComment, setLoadingComment] = useState(false)
  const [loadingLike, setLoadingLike] = useState(false)
  const [reposts, setReposts] = useState(post.reposts || post.shareCount || 0)
  const [commentError, setCommentError] = useState('')

  const handleLike = async () => {
    if (!user) {
      alert('Por favor inicia sesión')
      return
    }

    setLoadingLike(true)
    try {
      const endpoint = liked ? '/unlike' : '/like'
      const response = await fetch(`${API_URL}/api/likes${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, postId: post.id })
      })

      if (!response.ok) throw new Error('Error')

      setLiked(!liked)
      setLikes(liked ? likes - 1 : likes + 1)
    } catch (err) {
      console.error('Error:', err)
      alert('Error al dar like')
    } finally {
      setLoadingLike(false)
    }
  }

  const handleRepost = () => {
    if (!user) {
      alert('Por favor inicia sesión')
      return
    }
    setReposts(reposts + 1)
  }

  const fetchComments = async () => {
    setLoadingComments(true)
    try {
      const res = await fetch(`${API_URL}/api/comments/post/${post.id}`)
      if (!res.ok) throw new Error('Error')
      const data = await res.json()
      setComments(data.comments || [])
    } catch (err) {
      console.error('Error fetching comments:', err)
      setCommentError('Error al cargar comentarios')
    } finally {
      setLoadingComments(false)
    }
  }

  const toggleComments = () => {
    if (!showComments && comments.length === 0) {
      fetchComments()
    }
    setShowComments(!showComments)
  }

  const handleAddComment = async (e) => {
    e.preventDefault()
    if (!user || !newComment.trim()) return

    setLoadingComment(true)
    setCommentError('')
    try {
      const response = await fetch(`${API_URL}/api/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          postId: post.id,
          content: newComment
        })
      })

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}))
        throw new Error(errData.error || 'Error al comentar')
      }

      setNewComment('')
      fetchComments() // Recargar comentarios
      if (onPostUpdated) {
        onPostUpdated()
      }
    } catch (err) {
      console.error('Error:', err)
      setCommentError(err.message)
    } finally {
      setLoadingComment(false)
    }
  }

  const handleGoToProfile = () => {
    if (onNavigate && post.authorId) {
      onNavigate('profile', post.authorId)
    }
  }

  const badgeClass = post.type === 'proyecto' ? 'badge-proyecto' : post.type === 'remake' ? 'badge-remake' : post.type === 'curso' ? 'badge-curso' : post.type === 'avance' ? 'badge-remake' : 'badge-archivo'
  const badgeText = post.type === 'proyecto' ? 'Proyecto' : post.type === 'remake' ? 'Remake' : post.type === 'curso' ? 'Curso' : post.type === 'avance' ? '📈 Avance' : 'Archivo'

  const imageTags = post.imageTags || []
  const tags = post.tags || []
  const timeDisplay = formatTime(post.createdAt)

  return (
    <article className="post-card" data-type={post.type}>
      <div className="post-head" style={{ cursor: 'pointer' }} onClick={handleGoToProfile}>
        <div className="avatar" style={{ "--ac": "#0F6E56", "--ab": "#E1F5EE", cursor: 'pointer' }}>
          {post.avatar || (post.author?.[0] || 'U')}
        </div>
        <div className="post-meta">
          <span className="post-user" style={{ cursor: 'pointer' }}>
            {post.author} <span className="post-loc">· {post.location}</span>
          </span>
          <span className="post-time">{timeDisplay}</span>
        </div>
        <span className={`badge ${badgeClass}`}>{badgeText}</span>
        <button className="btn-icon post-more" onClick={(e) => e.stopPropagation()}><i className="fa-solid fa-ellipsis"></i></button>
      </div>

      {post.remakeOf && (
        <div className="remake-ref">
          <i className="fa-solid fa-repeat"></i>
          Remake de <strong>{post.remakeOf}</strong>
        </div>
      )}

      <div className="post-img" style={post.image ? { height: 'auto', minHeight: '150px' } : {}}>
        {post.image ? (
          <img 
            src={post.image} 
            alt={post.title}
            style={{
              width: '100%',
              height: 'auto',
              maxHeight: '350px',
              objectFit: 'contain',
              display: 'block',
              background: 'var(--bg, #0a0c0f)',
            }}
          />
        ) : (
          <>
            <div className="circuit-bg"></div>
            <span className="post-emoji">{post.emoji}</span>
          </>
        )}
        <div className="post-img-tags">
          {imageTags.map((tag, i) => <span key={i} className="img-tag">{tag}</span>)}
        </div>
      </div>

      <div className="post-body">
        <h2 className="post-title">{post.title}</h2>
        <p className="post-desc">{post.description}</p>
        <div className="post-tags">
          {tags.map((tag, i) => <span key={i} className="tag">{tag}</span>)}
        </div>
      </div>

      <div className="post-actions">
        <button 
          className={`action-btn like-btn ${liked ? 'liked' : ''}`} 
          onClick={handleLike}
          disabled={loadingLike}
          data-count={likes}
        >
          <i className={`fa-${liked ? 'solid' : 'regular'} fa-heart`}></i><span>{likes}</span>
        </button>
        <button 
          className="action-btn repost-btn" 
          onClick={handleRepost}
          data-count={reposts}
        >
          <i className="fa-solid fa-repeat"></i><span>{reposts}</span>
        </button>
        <button 
          className="action-btn comment-btn"
          onClick={toggleComments}
          data-count={post.commentCount || 0}
        >
          <i className="fa-regular fa-comment"></i><span>{post.commentCount || 0}</span>
        </button>
        {(post.downloads || 0) > 0 && (
          <button className="action-btn download-btn" data-count={post.downloads}>
            <i className="fa-solid fa-download"></i><span>{post.downloads}</span>
          </button>
        )}
        <div className="action-spacer"></div>
        <button className="action-btn share-btn"><i className="fa-solid fa-share-nodes"></i></button>
      </div>

      {showComments && (
        <div className="post-comments-section" style={{ 
          borderTop: '0.5px solid var(--border, rgba(255,255,255,0.07))', 
          padding: '12px 15px'
        }}>
          {/* Scroll container for comments */}
          <div style={{
            maxHeight: '250px',
            overflowY: 'auto',
            marginBottom: '12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}>
            {loadingComments ? (
              <div style={{ textAlign: 'center', padding: '12px', color: 'var(--muted, #6b7280)', fontSize: '12px' }}>
                ⏳ Cargando comentarios...
              </div>
            ) : comments.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '12px', color: 'var(--muted, #6b7280)', fontSize: '12px' }}>
                No hay comentarios aún. ¡Sé el primero!
              </div>
            ) : (
              comments.map((comment, i) => (
                <div key={comment.id || i} style={{
                  display: 'flex',
                  gap: '10px',
                  padding: '10px',
                  background: 'var(--bg3, #181c22)',
                  borderRadius: '8px',
                  border: '0.5px solid var(--border, rgba(255,255,255,0.07))',
                }}>
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: 'var(--accent, #1D9E75)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontSize: '10px',
                    fontWeight: 600,
                    fontFamily: 'var(--font-ui)',
                    flexShrink: 0,
                  }}>
                    {comment.author ? ((comment.author.firstName?.[0] || '') + (comment.author.lastName?.[0] || '')).toUpperCase() : 'U'}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text, #e8eaed)', fontFamily: 'var(--font-ui)', marginBottom: '2px' }}>
                      {comment.author ? `${comment.author.firstName || ''} ${comment.author.lastName || ''}` : 'Usuario'}
                      <span style={{ color: 'var(--muted, #6b7280)', fontWeight: 400, marginLeft: '6px' }}>
                        {formatTime(comment.createdAt)}
                      </span>
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--muted2, #9ca3af)', lineHeight: 1.5, wordBreak: 'break-word' }}>
                      {comment.content}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Error */}
          {commentError && (
            <div style={{ fontSize: '11px', color: '#f87171', marginBottom: '8px' }}>
              ❌ {commentError}
            </div>
          )}

          {/* New comment form */}
          <form onSubmit={handleAddComment}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                placeholder="Escribe un comentario..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                style={{
                  flex: 1,
                  padding: '8px 10px',
                  border: '0.5px solid var(--border2, rgba(255,255,255,0.12))',
                  borderRadius: '6px',
                  fontSize: '12px',
                  background: 'var(--bg3, #181c22)',
                  color: 'var(--text, #e8eaed)',
                  outline: 'none',
                  fontFamily: 'var(--font-body)'
                }}
              />
              <button
                type="submit"
                disabled={loadingComment || !newComment.trim()}
                style={{
                  padding: '8px 14px',
                  background: 'var(--accent, #1D9E75)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: loadingComment || !newComment.trim() ? 'not-allowed' : 'pointer',
                  fontSize: '12px',
                  fontWeight: 600,
                  opacity: loadingComment || !newComment.trim() ? 0.6 : 1,
                  fontFamily: 'var(--font-ui)',
                  whiteSpace: 'nowrap',
                }}
              >
                {loadingComment ? '...' : 'Comentar'}
              </button>
            </div>
          </form>
        </div>
      )}
    </article>
  )
}