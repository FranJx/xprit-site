import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { apiFetch } from '../api'

export default function Register(){
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('user')
  const [msg, setMsg] = useState(null)
  const { login } = useAuth()
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    try {
      const data = await apiFetch('/api/auth/register', { method: 'POST', body: JSON.stringify({ username, password, role }) })
      login(data)
      setMsg('Registrado y logueado')
      navigate('/')
    } catch (err) {
      setMsg(err.message || 'Error')
    }
  }

  return (
    <div className="container mt-4" style={{ maxWidth: 520 }}>
      <div className="card shadow-sm">
        <div className="card-body p-4">
          <h4 className="mb-3">Registrarse</h4>
          <form onSubmit={submit} className="d-grid gap-3">
            <input className="form-control" placeholder='usuario' value={username} onChange={e=>setUsername(e.target.value)} />
            <input className="form-control" placeholder='password' type='password' value={password} onChange={e=>setPassword(e.target.value)} />
            <div className="form-group">
              <label className="form-label small text-muted">Tipo de Cuenta</label>
              <select className="form-select" value={role} onChange={e=>setRole(e.target.value)}>
                <option value="user">Competidor / Usuario</option>
                <option value="juez">Juez</option>
              </select>
            </div>
            <button className="btn btn-primary">Crear cuenta</button>
          </form>
          {msg && <div className="alert alert-info mt-3 mb-0">{msg}</div>}
          <div className="mt-3 small">¿Ya tenés cuenta? <Link to="/login">Ingresá</Link></div>
        </div>
      </div>
    </div>
  )
}
