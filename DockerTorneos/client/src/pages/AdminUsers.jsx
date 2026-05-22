import { useState } from 'react'
import { apiFetch } from '../api'

export default function AdminUsers() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('juez')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [users, setUsers] = useState([])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!username || !password) {
      setMessage('Usuario y contraseña requeridos')
      return
    }

    setLoading(true)
    try {
      const result = await apiFetch('/api/auth/admin/create-user', {
        method: 'POST',
        body: JSON.stringify({ username, password, role })
      })
      
      setMessage(`✅ Usuario ${result.user.username} creado exitosamente`)
      setUsers([...users, result.user])
      setUsername('')
      setPassword('')
      setRole('juez')
    } catch (err) {
      setMessage(`❌ Error: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-lg-6">
          <h2>Crear Nuevo Usuario</h2>
          
          <form onSubmit={handleSubmit} className="mb-4">
            <div className="mb-3">
              <label className="form-label">Usuario</label>
              <input
                type="text"
                className="form-control"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="nombre_usuario"
                disabled={loading}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Contraseña</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="•••••••••"
                disabled={loading}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Rol</label>
              <select
                className="form-select"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                disabled={loading}
              >
                <option value="juez">Juez</option>
                <option value="user">Participante</option>
              </select>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={loading}
            >
              {loading ? 'Creando...' : 'Crear Usuario'}
            </button>
          </form>

          {message && (
            <div className={`alert ${message.includes('✅') ? 'alert-success' : 'alert-danger'}`}>
              {message}
            </div>
          )}
        </div>

        <div className="col-lg-6">
          <h2>Usuarios Creados</h2>
          {users.length === 0 ? (
            <p className="text-muted">Sin usuarios creados en esta sesión</p>
          ) : (
            <div className="list-group">
              {users.map((u, i) => (
                <div key={i} className="list-group-item">
                  <h5 className="mb-1">{u.username}</h5>
                  <p className="mb-0">
                    <span className="badge text-bg-info">{u.role}</span>
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
