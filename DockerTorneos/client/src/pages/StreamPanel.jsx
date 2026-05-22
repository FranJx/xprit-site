import React, { useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client'
import { apiFetch, SERVER } from '../api'

export default function StreamPanel(){
  const [tournaments, setTournaments] = useState([])
  const [selectedT, setSelectedT] = useState(null)
  const [matches, setMatches] = useState([])
  const [error, setError] = useState(null)
  const socketRef = useRef(null)
  const [overlayAssignments, setOverlayAssignments] = useState([])
  const [overlayWEnabled, setOverlayWEnabled] = useState(false)
  
  // Manage state of all 4 overlays
  const [activeMatches, setActiveMatches] = useState({
    '1': null,
    '2': null,
    '3': null,
    '4': null
  })

  const refreshOverlayAssignments = async (tournamentId) => {
    const data = await apiFetch(`/api/tournaments/${tournamentId}/overlay-assignments`)
    setOverlayAssignments(data)
    return data
  }

  useEffect(()=>{
    const load = async ()=>{
      try{
        setError(null)
        const data = await apiFetch('/api/tournaments')
        setTournaments(data)
      }catch(err){
        console.error('load tournaments error', err)
        setError(err.message || 'Error al cargar torneos')
      }
    }
    load()
  },[])

  useEffect(()=>{
    const loadMatches = async ()=>{
      if(!selectedT) return
      try{
        setError(null)
        const data = await apiFetch(`/api/tournaments/${selectedT}/matches`)
        setMatches(data)
      }catch(err){
        console.error('loadMatches error', err)
        setError(err.message || 'Error al cargar matches')
      }
    }
    loadMatches()
  },[selectedT])

  useEffect(() => {
    const loadOverlayWVisibility = async () => {
      if (!selectedT) {
        setOverlayWEnabled(false)
        return
      }
      try {
        const data = await apiFetch(`/api/tournaments/${selectedT}/overlayw-visibility`)
        setOverlayWEnabled(Boolean(data?.enabled))
      } catch (err) {
        console.error('loadOverlayWVisibility error', err)
      }
    }

    loadOverlayWVisibility()
  }, [selectedT])

  useEffect(() => {
    const loadAssignments = async () => {
      if (!selectedT) return
      try {
        setError(null)
        await refreshOverlayAssignments(selectedT)
      } catch (err) {
        console.error('loadAssignments error', err)
        setError(err.message || 'Error al cargar asignaciones de overlay')
      }
    }

    loadAssignments()
  }, [selectedT])

  // Keep judge active-match claims in sync while StreamPanel is open.
  useEffect(() => {
    let timer
    if (selectedT) {
      timer = setInterval(async () => {
        try {
          await refreshOverlayAssignments(selectedT)
        } catch (err) {
          console.error('overlay assignments poll error', err)
        }
      }, 1500)
    }
    return () => clearInterval(timer)
  }, [selectedT])

  useEffect(()=>{
    try{
      const socket = io(SERVER + '/overlay')
      socketRef.current = socket
      
      socket.on('connect', () => {
        console.log('Stream panel connected to socket namespace /overlay')
        // Join all 4 channels to listen for updates
        socket.emit('joinChannel', '1')
        socket.emit('joinChannel', '2')
        socket.emit('joinChannel', '3')
        socket.emit('joinChannel', '4')
      })

      socket.on('overlayUpdate', d => {
        console.log('Received overlayUpdate in panel:', d)
        if (!d) return
        const ch = d.channel || '1'
        setActiveMatches(prev => ({
          ...prev,
          [ch]: d
        }))
      })

      return () => {
        socket.disconnect()
      }
    }catch(err){
      console.error('socket init error', err)
      setError('No se pudo conectar al socket')
    }
  }, [])

  // Periodic polling for match updates from DB to keep score/status synced
  useEffect(() => {
    let timer;
    if (selectedT) {
      timer = setInterval(async () => {
        try {
          const data = await apiFetch(`/api/tournaments/${selectedT}/matches`)
          setMatches(data)
        } catch (e) {
          console.error('Interval poll error', e)
        }
      }, 3000)
    }
    return () => clearInterval(timer)
  }, [selectedT])

  const sendToOverlay = (m, channel) => {
    try {
      setError(null)
      socketRef.current?.emit('setMatch', {
        matchId: m.id,
        team1: m.team1_name || 'Pasa',
        team2: m.team2_name || 'Pasa',
        score1: m.score1 ?? 0,
        score2: m.score2 ?? 0,
        status: m.status || 'pending',
        winner_team_id: m.winner_team_id,
        channel: String(channel)
      })
    } catch(err) {
      console.error('sendToOverlay error', err)
      setError(`No se pudo enviar la partida al Overlay ${channel}`)
    }
  }

  const saveOverlayAssignment = async (judgeUserId, overlayChannel) => {
    if (!selectedT) return
    try {
      setError(null)
      await apiFetch(`/api/tournaments/${selectedT}/overlay-assignments`, {
        method: 'POST',
        body: JSON.stringify({
          judgeUserId,
          overlayChannel: overlayChannel === '' ? null : Number(overlayChannel)
        })
      })

      const data = await refreshOverlayAssignments(selectedT)
      return data
    } catch (err) {
      console.error('saveOverlayAssignment error', err)
      setError(err.message || 'No se pudo guardar la asignación del overlay')
      throw err
    }
  }

  const autoAssignJudges = async () => {
    if (!selectedT) return
    try {
      setError(null)
      // assign first up to 4 judges to OL 1..4 in the order they appear
      const promises = []
      for (let i = 0; i < overlayAssignments.length && i < 4; i++) {
        const judge = overlayAssignments[i]
        const channel = i + 1
        promises.push(saveOverlayAssignment(judge.judge_user_id, channel))
      }
      await Promise.all(promises)
      // refresh assignments
      await refreshOverlayAssignments(selectedT)
    } catch (err) {
      console.error('autoAssignJudges error', err)
      setError('No se pudo asignar automáticamente los jueces')
    }
  }

  const unassignAllJudges = async () => {
    if (!selectedT) return
    try {
      setError(null)
      const promises = overlayAssignments.map(j => saveOverlayAssignment(j.judge_user_id, null))
      await Promise.all(promises)
      await refreshOverlayAssignments(selectedT)
    } catch (err) {
      console.error('unassignAllJudges error', err)
      setError('No se pudo desasignar los jueces')
    }
  }

  const saveOverlayWVisibility = async (enabled) => {
    if (!selectedT) return
    try {
      setError(null)
      const data = await apiFetch(`/api/tournaments/${selectedT}/overlayw-visibility`, {
        method: 'POST',
        body: JSON.stringify({ enabled: Boolean(enabled) })
      })
      setOverlayWEnabled(Boolean(data?.enabled))
    } catch (err) {
      console.error('saveOverlayWVisibility error', err)
      setError(err.message || 'No se pudo actualizar OverlayW')
    }
  }

  // Find which channel (if any) currently shows this match
  const getAssignedChannels = (matchId) => {
    const channels = []
    for (const ch in activeMatches) {
      if (activeMatches[ch] && String(activeMatches[ch].matchId) === String(matchId)) {
        channels.push(ch)
      }
    }
    return channels
  }

  return (
    <div className="container mt-4">
      <h3>Panel de Transmisión (Stream Panel)</h3>
      {error && <div className="alert alert-danger">{error}</div>}
      
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <label className="form-label fw-bold">Seleccionar Torneo</label>
          <select className="form-select" onChange={e=>setSelectedT(e.target.value)} value={selectedT||''}>
            <option value=''>-- seleccionar --</option>
            {tournaments.map(t=> <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </div>
      </div>

      {selectedT && (
        <div>
          <div className="card shadow-sm mb-4">
            <div className="card-body d-flex align-items-center justify-content-between">
              <div>
                <h5 className="mb-1">OverlayW (Podio Final)</h5>
                <div className="text-muted" style={{ fontSize: '13px' }}>
                  Se mostrará solo si está encendido y el torneo terminó.
                </div>
              </div>
              <div className="form-check form-switch m-0">
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  id="overlaywSwitch"
                  checked={overlayWEnabled}
                  onChange={(e) => saveOverlayWVisibility(e.target.checked)}
                />
                <label className="form-check-label ms-2" htmlFor="overlaywSwitch">
                  {overlayWEnabled ? 'Encendido' : 'Apagado'}
                </label>
              </div>
            </div>
          </div>

          <h5 className="mb-3">Asignación de OL por juez</h5>
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <div className="d-flex justify-content-end mb-2">
                <button className="btn btn-sm btn-outline-secondary me-2" onClick={autoAssignJudges}>Auto-asignar OL</button>
                <button className="btn btn-sm btn-outline-danger" onClick={unassignAllJudges}>Desasignar todo</button>
              </div>
              {overlayAssignments.length === 0 ? (
                <div className="text-muted">No hay jueces cargados para este torneo.</div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-sm align-middle mb-0">
                    <thead>
                      <tr>
                        <th>Juez</th>
                        <th>ID</th>
                        <th>OL asignado</th>
                        <th>Match activo</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {overlayAssignments.map(judge => (
                        <tr key={judge.judge_user_id}>
                          <td className="fw-semibold">{judge.username}</td>
                          <td>{judge.judge_user_id}</td>
                          <td style={{ minWidth: 220 }}>
                            <select
                              className="form-select form-select-sm"
                              value={judge.overlay_channel ?? ''}
                              onChange={(e) => {
                                const nextValue = e.target.value
                                saveOverlayAssignment(judge.judge_user_id, nextValue)
                              }}
                            >
                              <option value="">Sin asignar (Stream)</option>
                              {['1', '2', '3', '4'].map(ch => (
                                <option key={ch} value={ch}>OL {ch}</option>
                              ))}
                            </select>
                          </td>
                          <td>
                            {judge.match_id ? (
                              <span className="badge bg-info text-dark">
                                Match #{judge.match_id} {judge.team1_name || 'TBD'} vs {judge.team2_name || 'TBD'}
                              </span>
                            ) : (
                              <span className="text-muted">Sin match activo</span>
                            )}
                          </td>
                          <td className="text-end">
                            <span className={`badge ${judge.overlay_channel ? 'bg-primary' : 'bg-secondary'}`}>
                              {judge.overlay_channel ? `OL ${judge.overlay_channel}` : 'Stream'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Overlays Monitor */}
          <h5 className="mb-3">Monitores de Overlays</h5>
          <div className="row g-3 mb-4">
            {['1', '2', '3', '4'].map(ch => {
              const active = activeMatches[ch]
              const hasWinner = active && active.status === 'finished'
              return (
                <div className="col-md-3" key={ch}>
                  <div className={`card h-100 shadow-sm border-${hasWinner ? 'success' : 'primary'}`}>
                    <div className={`card-header text-white py-1 px-2 d-flex justify-content-between align-items-center ${hasWinner ? 'bg-success' : 'bg-primary'}`} style={{ fontSize: '12px' }}>
                      <span className="fw-bold">OVERLAY {ch}</span>
                      {hasWinner && <span className="badge bg-warning text-dark" style={{ fontSize: '9px' }}>Ganador</span>}
                    </div>
                    <div className="card-body p-2 d-flex flex-column justify-content-center" style={{ minHeight: '60px' }}>
                      {active ? (
                        <>
                          <div className="fw-bold text-truncate" style={{ fontSize: '13px' }}>
                            {active.team1} vs {active.team2}
                          </div>
                          <div className="d-flex justify-content-between align-items-center mt-1" style={{ fontSize: '12px' }}>
                            <span className="badge bg-light text-dark">
                              Score: {active.score1} - {active.score2}
                            </span>
                            {active.status && (
                              <span className={`badge ${active.status === 'finished' ? 'bg-success' : 'bg-secondary'}`} style={{ fontSize: '9px' }}>
                                {active.status}
                              </span>
                            )}
                          </div>
                        </>
                      ) : (
                        <span className="text-muted small italic text-center">Vacío - Sin asignar</span>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <h4 className="mb-3">Partidas (Matches)</h4>
          <div className="list-group shadow-sm">
            {matches.length === 0 ? (
              <div className="list-group-item text-muted text-center py-4">No hay partidas generadas para este torneo.</div>
            ) : (
              matches.filter(m => m.team1_name || m.team2_name).map(m => {
                const assignedChannels = getAssignedChannels(m.id)
                return (
                  <div key={m.id} className="list-group-item d-flex flex-wrap justify-content-between align-items-center py-3">
                    <div className="mb-2 mb-md-0">
                      <strong className="text-primary">Partida #{m.slot}</strong>
                      <span className="mx-2">|</span>
                      <span className="fw-semibold">{m.team1_name || 'Pasa'}</span>
                      <span className="badge bg-dark mx-2">{m.score1}</span>
                      <span className="text-muted">vs</span>
                      <span className="badge bg-dark mx-2">{m.score2}</span>
                      <span className="fw-semibold">{m.team2_name || 'Pasa'}</span>
                      
                      {assignedChannels.map(ch => (
                        <span key={ch} className="badge bg-info text-dark ms-2" style={{ fontSize: '10px' }}>
                          Enviado a OL {ch}
                        </span>
                      ))}

                      {m.status === 'finished' && (
                        <span className="badge bg-success ms-2" style={{ fontSize: '10px' }}>
                          Finalizado
                        </span>
                      )}
                    </div>
                    
                    <div className="d-flex gap-1">
                      {['1', '2', '3', '4'].map(ch => {
                        const isCurrentlyAssigned = assignedChannels.includes(ch)
                        return (
                          <button
                            key={ch}
                            className={`btn btn-xs ${isCurrentlyAssigned ? 'btn-primary' : 'btn-outline-primary'}`}
                            style={{ fontSize: '11px', padding: '4px 10px' }}
                            onClick={() => sendToOverlay(m, ch)}
                          >
                            OL {ch}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      )}
    </div>
  )
}
