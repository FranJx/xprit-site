import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

const SERVER = import.meta.env.VITE_SERVER_URL || 'http://localhost:4000'

const AuthContext = createContext(null)

async function fetchMe(token) {
  const res = await fetch(SERVER + '/api/auth/me', {
    headers: { Authorization: `Bearer ${token}` }
  })
  if (!res.ok) throw new Error('Not authenticated')
  return res.json()
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token') || '')
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let mounted = true
    const restore = async () => {
      if (!token) {
        setReady(true)
        return
      }
      try {
        const data = await fetchMe(token)
        if (mounted) setUser(data.user)
      } catch (err) {
        localStorage.removeItem('token')
        if (mounted) {
          setToken('')
          setUser(null)
        }
      } finally {
        if (mounted) setReady(true)
      }
    }
    restore()
    return () => { mounted = false }
  }, [token])

  const login = ({ token: newToken, user: newUser }) => {
    localStorage.setItem('token', newToken)
    setToken(newToken)
    setUser(newUser)
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken('')
    setUser(null)
  }

  const value = useMemo(() => ({ user, token, ready, login, logout }), [user, token, ready])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
