import React, { useEffect, useMemo, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { io } from 'socket.io-client'
import { useAuth } from '../auth/AuthContext'
import { apiFetch, SERVER } from '../api'

export default function TournamentDetail(){
  const { id } = useParams()
  const [tournament, setTournament] = useState(null)
  const [matches, setMatches] = useState([])
  const [error, setError] = useState(null)
  const [teamName, setTeamName] = useState('')
  const [joinMsg, setJoinMsg] = useState(null)
  const [importText, setImportText] = useState('')
  const { user, token } = useAuth()

  useEffect(() => {
    const socket = io(SERVER + '/overlay')
    
    socket.on('connect', () => {
      // Join channels 1-4 to receive all active match updates
      socket.emit('joinChannel', '1')
      socket.emit('joinChannel', '2')
      socket.emit('joinChannel', '3')
      socket.emit('joinChannel', '4')
    })
    
    socket.on('overlayUpdate', (data) => {
      if (!data) return
      setMatches(prevMatches => prevMatches.map(m => {
        if (String(m.id) === String(data.matchId)) {
          return {
            ...m,
            team1_name: data.team1,
            team2_name: data.team2,
            score1: data.score1,
            score2: data.score2,
            status: data.status,
            winner_team_id: data.winner_team_id
          }
        }
        return m
      }))
    })

    return () => {
      socket.disconnect()
    }
  }, [id])

  useEffect(()=>{ fetchData() },[id])

  useEffect(() => {
    let timer
    if (id) {
      timer = setInterval(() => {
        fetchData().catch(err => console.error('poll tournament detail error', err))
      }, 3000)
    }
    return () => clearInterval(timer)
  }, [id])

  const fetchData = async ()=>{
    try{
      setError(null)
      const data = await apiFetch(`/api/tournaments/${id}`)
      setTournament(data)
      const ms = await apiFetch(`/api/tournaments/${id}/matches`)
      setMatches(ms)
    }catch(err){
      console.error('fetchData error', err)
      setError(err.message || 'Error al cargar datos')
    }
  }

  const registerTeam = async (e)=>{
    try{
      e.preventDefault()
      setError(null)
      await apiFetch(`/api/tournaments/${id}/register`, { method:'POST', body: JSON.stringify({ name: teamName }) })
      setTeamName('')
      setJoinMsg('Inscripción realizada')
      fetchData()
    }catch(err){
      console.error('registerTeam error', err)
      setError(err.message || 'Error al registrar equipo')
    }
  }

  const genBracket = async ()=>{
    try{
      setError(null)
      await apiFetch(`/api/tournaments/${id}/generate-bracket`, { method:'POST' })
      setJoinMsg('Llaves generadas, inscripciones cerradas')
      fetchData()
    }catch(err){
      console.error('genBracket error', err)
      setError(err.message || 'Error al generar llaves')
    }
  }

  const toggleRegistration = async () => {
    try {
      setError(null)
      const newStatus = !tournament.registration_open
      await apiFetch(`/api/tournaments/${id}/registration`, {
        method: 'PATCH',
        body: JSON.stringify({ open: newStatus })
      })
      setJoinMsg(newStatus ? 'Inscripciones abiertas' : 'Inscripciones cerradas')
      fetchData()
    } catch (err) {
      console.error('toggleRegistration error', err)
      setError(err.message || 'Error al cambiar estado de inscripción')
    }
  }

  const handleImport = async () => {
    try {
      setError(null)
      const lines = importText
        .split('\n')
        .map(l => l.trim())
        .filter(Boolean)

      if (lines.length === 0) {
        throw new Error('Por favor, ingresa al menos un participante (uno por línea).')
      }

      const res = await apiFetch(`/api/tournaments/${id}/import`, {
        method: 'POST',
        body: JSON.stringify({ participants: lines })
      })

      setImportText('')
      setJoinMsg(res.message || 'Participantes importados con éxito')
      fetchData()
    } catch (err) {
      console.error('handleImport error', err)
      setError(err.message || 'Error al importar participantes')
    }
  }

  const myTeam = useMemo(() => {
    if (!tournament?.teams || !user) return null
    return tournament.teams.find(team => team.user_id === user.id)
  }, [tournament, user])

  const renderBracket = () => {
    if (!matches.length) return <div className="text-muted">Aún no hay llaves generadas.</div>
    
    // Group matches by round
    const rounds = {}
    matches.forEach(m => {
      if (!m.team1_name && !m.team2_name) return
      if (!rounds[m.round]) {
        rounds[m.round] = []
      }
      rounds[m.round].push(m)
    })

    const roundNumbers = Object.keys(rounds).map(Number).sort((a, b) => a - b)

    return (
      <div className="bracket-rounds-container" style={{ display: 'flex', gap: '2rem', overflowX: 'auto', paddingBottom: '1rem' }}>
        {roundNumbers.map(rNum => (
          <div key={rNum} className="bracket-round-column" style={{ minWidth: '250px', flex: 1 }}>
            <h5 className="text-center border-bottom pb-2 mb-3">Ronda {rNum}</h5>
            <div className="d-flex flex-column gap-3">
              {rounds[rNum].map(match => (
                <div key={match.id} className="bracket-match card shadow-sm">
                  <div className="card-header d-flex justify-content-between align-items-center">
                    <span>Partida #{match.slot}</span>
                    <span className="badge text-bg-light text-dark">{match.status}</span>
                  </div>
                  <div className="card-body">
                    <div className="bracket-team d-flex align-items-center">
                      <span>{match.team1_name || 'Pasa'}</span>
                      <span className="ms-auto badge text-bg-dark">{match.score1}</span>
                    </div>
                    <div className="bracket-vs text-center my-1 text-muted" style={{ fontSize: '12px' }}>vs</div>
                    <div className="bracket-team d-flex align-items-center">
                      <span>{match.team2_name || 'Pasa'}</span>
                      <span className="ms-auto badge text-bg-dark">{match.score2}</span>
                    </div>
                  </div>
                  {['admin', 'juez'].includes(user?.role) && match.status !== 'finished' && (
                    <div className="card-footer p-2 text-center bg-light">
                      <a 
                        href={`/Semaforo/index.html?matchId=${match.id}&token=${token}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-sm btn-outline-danger w-100 py-1"
                        style={{ fontSize: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                      >
                        🚦 Controlar (Semáforo)
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="container mt-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <div>
          <h2 className="mb-0">{tournament?.name || `Torneo ${id}`}</h2>
          <div className="text-muted">{tournament?.registration_open ? 'Inscripciones abiertas' : 'Inscripciones cerradas'}</div>
        </div>
        {user?.role === 'admin' && matches.length === 0 && (
          <div className="d-flex gap-2">
            <button 
              className={`btn ${tournament?.registration_open ? 'btn-outline-warning' : 'btn-outline-success'}`} 
              onClick={toggleRegistration}
            >
              {tournament?.registration_open ? 'Cerrar inscripciones' : 'Abrir inscripciones'}
            </button>
            <button className="btn btn-outline-primary" onClick={genBracket}>Generar llaves y cerrar inscripciones</button>
          </div>
        )}
      </div>
      {error && <div className="alert alert-danger">{error}</div>}
      {joinMsg && <div className="alert alert-info">{joinMsg}</div>}

      <div className="row g-4">
        <div className="col-lg-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Inscripción</h5>
              {!user ? (
                <div>
                  <p className="text-muted">Tenés que iniciar sesión para inscribirte a este torneo.</p>
                  <Link className="btn btn-dark" to="/login">Iniciar sesión</Link>
                </div>
              ) : myTeam ? (
                <div>
                  <div className="alert alert-success mb-3">Ya estás inscripto como <strong>{myTeam.name}</strong>.</div>
                  <p className="text-muted mb-0">Cuando el admin cierre las inscripciones y genere las llaves, podrás verlas aquí.</p>
                </div>
              ) : tournament?.registration_open ? (
                <form className="d-grid gap-3" onSubmit={registerTeam}>
                  <input className="form-control" placeholder="Tu nombre para el torneo" value={teamName} onChange={e=>setTeamName(e.target.value)} />
                  <button className="btn btn-success">Inscribirme</button>
                </form>
              ) : (
                <div className="alert alert-secondary mb-0">Las inscripciones están cerradas.</div>
              )}
            </div>
          </div>

          {user?.role === 'admin' && tournament?.registration_open && (
            <div className="card shadow-sm mt-4">
              <div className="card-body">
                <h5 className="card-title">Importación Masiva</h5>
                <p className="text-muted small">Ingresa un nombre de participante/equipo por línea:</p>
                <textarea
                  className="form-control mb-2"
                  rows="5"
                  placeholder="Equipo A&#10;Equipo B&#10;Equipo C"
                  value={importText}
                  onChange={e => setImportText(e.target.value)}
                />
                <button
                  className="btn btn-primary w-100 btn-sm"
                  onClick={handleImport}
                  disabled={!importText.trim()}
                >
                  Importar Participantes
                </button>
              </div>
            </div>
          )}

          <div className="card shadow-sm mt-4">
            <div className="card-body">
              <h5 className="card-title">Participantes ({tournament?.teams?.length || 0})</h5>
              {tournament?.teams && tournament.teams.length > 0 ? (
                <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
                  <ul className="list-group list-group-flush">
                    {tournament.teams.map(t => (
                      <li key={t.id} className="list-group-item d-flex justify-content-between align-items-center py-2 px-1">
                        <span className="text-truncate" style={{ maxWidth: '80%' }}>{t.name}</span>
                        {t.user_id && <span className="badge bg-secondary" style={{ fontSize: '9px' }}>Web User</span>}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="text-muted small mb-0">No hay participantes registrados.</p>
              )}
            </div>
          </div>
        </div>
        <div className="col-lg-8">
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="mb-0">Llaves del torneo</h4>
                <span className="badge text-bg-dark">{matches.length} partidas</span>
              </div>
              {renderBracket()}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
