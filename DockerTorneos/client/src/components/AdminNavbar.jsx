import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

export default function AdminNavbar(){
  const { user, logout } = useAuth()
  const location = useLocation()

  if (location.pathname.startsWith('/overlay')) {
    return null
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">COPAS Torneo</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navMain" aria-controls="navMain" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navMain">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item"><Link className="nav-link" to="/">Inicio</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/tournaments">Torneos</Link></li>
            {user && ['admin', 'stream'].includes(user.role) && (
              <>
                <li className="nav-item"><Link className="nav-link" to="/stream">Stream</Link></li>
              </>
            )}
            {user && user.role === 'admin' && (
              <li className="nav-item"><Link className="nav-link" to="/admin/users">Usuarios</Link></li>
            )}
          </ul>
          <div className="d-flex">
            {!user ? (
              <>
                <Link className="btn btn-outline-light me-2" to="/login">Login</Link>
                <Link className="btn btn-primary" to="/register">Registrarse</Link>
              </>
            ) : (
              <>
                <span className="navbar-text text-white me-3">{user.username} ({user.role})</span>
                <button className="btn btn-outline-warning" onClick={logout}>Salir</button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
