const VITE_URL = import.meta.env.VITE_SERVER_URL;
export const SERVER = VITE_URL !== undefined && VITE_URL !== null && VITE_URL !== ""
  ? VITE_URL
  : (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:4000');

export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem('token')
  const headers = { ...(options.headers || {}) }
  if (token) headers.Authorization = `Bearer ${token}`
  if (options.body && !headers['Content-Type']) headers['Content-Type'] = 'application/json'

  const res = await fetch(SERVER + path, { ...options, headers })
  const contentType = res.headers.get('content-type') || ''
  const data = contentType.includes('application/json') ? await res.json() : await res.text()
  if (!res.ok) {
    const message = data?.error || data?.message || `HTTP ${res.status}`
    throw new Error(message)
  }
  return data
}
