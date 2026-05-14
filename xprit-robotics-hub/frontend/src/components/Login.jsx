import { useState, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import '../styles/auth.css'

export default function Login({ onSwitchToRegister }) {
  const { login } = useContext(AuthContext)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await login(email, password)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>🚀 XTH</h1>
          <p>Inicia sesión en tu cuenta</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" disabled={loading} className="auth-btn">
            {loading ? 'Iniciando...' : 'Iniciar sesión'}
          </button>
        </form>

        <div className="auth-footer">
          <p>¿No tienes cuenta? <button onClick={onSwitchToRegister} className="link-btn">Regístrate</button></p>
        </div>

        <div className="demo-accounts">
          <p style={{ fontSize: '12px', color: '#666', marginTop: '20px' }}>
            <strong>Cuentas demo:</strong><br/>
            lenak@example.com<br/>
            matias@example.com<br/>
            <strong>Contraseña:</strong> password123
          </p>
        </div>
      </div>
    </div>
  )
}
