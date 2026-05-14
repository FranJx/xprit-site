import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

export default function Sidebar({ user, currentPage, onNavigate, onCreatePost, onEditProfile }) {
  const { logout } = useContext(AuthContext)

  const handleLogout = () => {
    if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
      logout()
    }
  }

  const initials = user ? (user.firstName?.[0] + user.lastName?.[0] || 'U').toUpperCase() : 'U'

  const isActive = (page) => currentPage === page ? 'active' : ''

  return (
    <aside className="sidebar">
      <div className="logo">
        <span className="logo-x">X</span>
        <span className="logo-th">TH</span>
        <span className="logo-full">XpriT Robotics Hub</span>
      </div>
      <nav className="sidenav">
        <button 
          onClick={() => onNavigate('feed')} 
          className={`nav-item ${isActive('feed')}`}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', width: '100%', textAlign: 'left' }}
        >
          <i className="fa-solid fa-house-chimney"></i>
          <span>Feed</span>
        </button>
        <button 
          onClick={() => onNavigate('explore')} 
          className={`nav-item ${isActive('explore')}`}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', width: '100%', textAlign: 'left' }}
        >
          <i className="fa-solid fa-compass"></i>
          <span>Explorar</span>
        </button>
        <button 
          onClick={onCreatePost} 
          className="nav-item nav-crear"
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', width: '100%', textAlign: 'left' }}
        >
          <i className="fa-solid fa-plus"></i>
          <span>Publicar</span>
        </button>
        <button 
          onClick={() => onNavigate('community')} 
          className={`nav-item ${isActive('community')}`}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', width: '100%', textAlign: 'left' }}
        >
          <i className="fa-solid fa-robot"></i>
          <span>Comunidad</span>
        </button>
        <button 
          onClick={() => onNavigate('profile')} 
          className={`nav-item ${isActive('profile')}`}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', width: '100%', textAlign: 'left' }}
        >
          <i className="fa-solid fa-user-astronaut"></i>
          <span>Perfil</span>
        </button>
      </nav>
      <div className="sidebar-footer">
        {user && (
          <div className="user-chip" style={{ cursor: 'pointer', position: 'relative' }}>
            <div className="avatar av-sm" style={{ "--ac": "#1D9E75", "--ab": "#E1F5EE" }}>
              {initials}
            </div>
            <div className="user-chip-info">
              <span className="user-chip-name">{user.firstName} {user.lastName}</span>
              <span className="user-chip-handle">@{user.username}</span>
            </div>
            <div style={{ display: 'flex', gap: '4px', marginLeft: 'auto' }}>
              <button
                onClick={onEditProfile}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--muted)',
                  cursor: 'pointer',
                  fontSize: '14px',
                  padding: '4px'
                }}
                title="Editar perfil"
              >
                <i className="fa-solid fa-pen-to-square"></i>
              </button>
              <button
                onClick={handleLogout}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--muted)',
                  cursor: 'pointer',
                  fontSize: '18px',
                  padding: '4px'
                }}
                title="Cerrar sesión"
              >
                <i className="fa-solid fa-sign-out-alt"></i>
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}
