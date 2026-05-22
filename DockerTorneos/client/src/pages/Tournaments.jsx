import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { apiFetch } from '../api'

export default function Tournaments(){
  const [name, setName] = useState('')
  const [list, setList] = useState([])
  const [error, setError] = useState(null)
  const { user } = useAuth()

  useEffect(()=>{ fetchList() },[])

  const fetchList = async ()=>{
    try{
      setError(null)
      const data = await apiFetch('/api/tournaments')
      setList(data)
    }catch(err){
      console.error('fetchList error', err)
      setError(err.message || 'Error al cargar torneos')
    }
  }

  const create = async (e)=>{
    try{
      e.preventDefault()
      setError(null)
      await apiFetch('/api/tournaments', { method:'POST', body: JSON.stringify({ name }) })
      setName('')
      fetchList()
    }catch(err){
      console.error('create tournament error', err)
      setError(err.message || 'Error al crear torneo')
    }
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h2 className="mb-0">Torneos</h2>
          <div className="text-muted">Revisá torneos abiertos y las llaves cuando el admin las publique.</div>
        </div>
        {user?.role === 'admin' && <span className="badge text-bg-dark">Admin</span>}
      </div>
      {error && <div className="alert alert-danger">{error}</div>}
      {user?.role === 'admin' && (
        <form className="d-flex gap-2 mb-4" onSubmit={create}>
          <input className="form-control" placeholder="Nombre del torneo" value={name} onChange={e=>setName(e.target.value)} />
          <button className="btn btn-primary">Crear torneo</button>
        </form>
      )}
      <div className="row g-3">
        {list.map(t=> (
          <div key={t.id} className="col-lg-4 col-md-6">
            <div className="card h-100 shadow-sm tournament-card">
              <div className="card-body d-flex flex-column">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <h5 className="card-title mb-0">{t.name}</h5>
                  {t.registration_open ? <span className="badge text-bg-success">Inscripciones abiertas</span> : <span className="badge text-bg-secondary">Cerrado</span>}
                </div>
                <p className="text-muted small mb-3">Participantes: {t.team_count || 0}</p>
                <div className="mt-auto d-flex gap-2">
                  <Link className="btn btn-dark flex-grow-1" to={`/tournament/${t.id}`}>Ver llaves</Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
