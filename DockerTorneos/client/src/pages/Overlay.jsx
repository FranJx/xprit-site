import React, { useEffect, useState } from 'react'
import { io } from 'socket.io-client'

import { SERVER } from '../api'

export default function Overlay({ small=false }){
  const [data, setData] = useState({ team1: 'Equipo 1', team2: 'Equipo 2', score1: 0, score2: 0, status: 'pending' })

  useEffect(()=>{
    const socket = io(SERVER + '/overlay');
    socket.on('connect', ()=>console.log('Overlay connected', socket.id))
    socket.on('overlayUpdate', d => {
      if (!d) return;
      setData(prev => ({ ...prev, ...d }))
    })
    return ()=> socket.disconnect();
  },[])

  if (!data || data.status === 'empty' || !data.matchId) {
    return null
  }

  return (
    <div className="overlay-root" style={{ width: '100%' }}>
      <div className="panel d-flex align-items-center gap-4">
        <div className="d-flex flex-column text-start" style={{ minWidth: 220 }}>
          <div className="team team-small shadow-text">Equipo</div>
          <div className="team shadow-text" style={{ fontSize: 28 }}>{data.team1}</div>
        </div>
        <div className="d-flex flex-column align-items-center">
          <div className="score shadow-text">{data.score1}</div>
          <div style={{ height:8 }} />
          <div className="score shadow-text">{data.score2}</div>
        </div>
        <div className="d-flex flex-column text-end" style={{ minWidth: 220 }}>
          <div className="team team-small shadow-text">Equipo</div>
          <div className="team shadow-text" style={{ fontSize: 28 }}>{data.team2}</div>
        </div>
      </div>
    </div>
  )
}
