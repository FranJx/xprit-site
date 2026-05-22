import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { apiFetch } from '../api'

export default function Login(){
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState(null)
  const { login } = useAuth()
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    try {
      const data = await apiFetch('/api/auth/login', { method: 'POST', body: JSON.stringify({ username, password }) })
      login(data)
      setMsg('Logueado')
      navigate('/')
    } catch (err) {
      setMsg(err.message || 'Error')
    }
  }

  return (
    <div className="container mt-4" style={{ maxWidth: 520 }}>
      <div className="card shadow-sm">
        <div className="card-body p-4">
          <h4 className="mb-3">Iniciar Sesión</h4>
          <form onSubmit={submit} className="d-grid gap-3">
            <input className="form-control" placeholder='usuario' value={username} onChange={e=>setUsername(e.target.value)} />
            <input className="form-control" placeholder='password' type='password' value={password} onChange={e=>setPassword(e.target.value)} />
            <button className="btn btn-dark">Entrar</button>
          </form>
          {msg && <div className="alert alert-info mt-3 mb-0">{msg}</div>}
          <div className="mt-3 small">¿No tenés cuenta? <Link to="/register">Registrate</Link></div>
        </div>
      </div>
    </div>
  )
}
