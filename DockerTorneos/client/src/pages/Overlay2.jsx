import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { io } from 'socket.io-client'

import { SERVER } from '../api'

export default function Overlay2() {
  const { channel: paramChannel } = useParams()
  const queryParams = new URLSearchParams(window.location.search)
  const channel = paramChannel || queryParams.get('channel') || '1'

  const [data, setData] = useState({
    team1: 'Robot Rojo',
    team2: 'Robot Azul',
    score1: 0,
    score2: 0,
    status: 'pending',
    winner_team_id: null
  })

  useEffect(() => {
    const socket = io(SERVER + '/overlay', {
      query: { channel }
    })
    console.log(`Connecting to overlay socket on: ${SERVER}/overlay for channel ${channel}`)
    
    socket.on('connect', () => {
      console.log(`Overlay2 connected successfully to channel ${channel}. Socket ID:`, socket.id)
    })
    
    socket.on('overlayUpdate', d => {
      console.log(`Overlay2 (Channel ${channel}) received update:`, d)
      if (!d) return
      setData(prev => ({ ...prev, ...d }))
    })
    
    return () => {
      socket.disconnect()
    }
  }, [channel])

  if (!data || data.status === 'empty' || !data.matchId) {
    return null
  }

  // Check if match is finished
  const isFinished = data.status === 'finished'
  const winner = isFinished
    ? (data.score1 > data.score2 ? 'red' : 'blue')
    : null

  return (
    <div className="overlay-container">
      <style>{`
        .overlay-container {
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .score-bar {
          position: relative;
          width: 100vw;
          max-width: 1920px;
          height: 134px; /* 10% less tall than 148px */
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(15, 15, 15, 0.6);
          backdrop-filter: blur(8px);
          transition: border-color 0.8s ease;
        }

        .bg-side {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 50%;
          height: 100%;
          z-index: 1;
          transition: width 0.8s cubic-bezier(0.77, 0, 0.175, 1), opacity 0.8s ease, clip-path 0.8s ease;
        }

        .bg-red {
          left: 0;
          background: linear-gradient(135deg, rgba(220, 38, 38, 0.85) 0%, rgba(153, 27, 27, 0.85) 100%);
          clip-path: polygon(0 0, 100% 0, 93% 100%, 0 100%);
        }

        .bg-blue {
          right: 0;
          background: linear-gradient(135deg, rgba(30, 64, 175, 0.85) 0%, rgba(29, 78, 216, 0.85) 100%);
          clip-path: polygon(7% 0, 100% 0, 100% 100%, 0 100%);
        }

        /* Winner backgrounds expansion styles */
        .winner-red .bg-red {
          width: 100%;
          clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
          background: linear-gradient(135deg, rgba(220, 38, 38, 0.95) 0%, rgba(153, 27, 27, 0.95) 100%);
        }
        
        .winner-red .bg-blue {
          width: 0%;
          opacity: 0;
        }

        .winner-blue .bg-blue {
          width: 100%;
          clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
          background: linear-gradient(135deg, rgba(30, 64, 175, 0.95) 0%, rgba(29, 78, 216, 0.95) 100%);
        }
        
        .winner-blue .bg-red {
          width: 0%;
          opacity: 0;
        }

        .winner-red {
          border-color: rgba(220, 38, 38, 0.6);
          box-shadow: 0 8px 32px rgba(220, 38, 38, 0.3), 0 0 15px rgba(220, 38, 38, 0.2);
        }

        .winner-blue {
          border-color: rgba(30, 64, 175, 0.6);
          box-shadow: 0 8px 32px rgba(30, 64, 175, 0.3), 0 0 15px rgba(30, 64, 175, 0.2);
        }

        .team-container {
          position: relative;
          z-index: 2;
          width: 38%;
          display: flex;
          align-items: center;
          transition: opacity 0.5s cubic-bezier(0.77, 0, 0.175, 1), transform 0.5s cubic-bezier(0.77, 0, 0.175, 1);
        }

        .team-left {
          justify-content: flex-start;
          padding-left: 24px;
        }

        .team-right {
          justify-content: flex-end;
          padding-right: 24px;
        }

        .team-name {
          font-family: 'Orbitron', sans-serif;
          font-size: 36px; /* 10% smaller */
          font-weight: 700;
          color: #ffffff;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .center-score-badge {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          background: rgba(10, 10, 10, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 10px 30px;
          border-radius: 12px;
          min-width: 234px; /* ~10% smaller */
          height: 101px; /* ~10% smaller */
          transition: opacity 0.5s cubic-bezier(0.77, 0, 0.175, 1), transform 0.5s cubic-bezier(0.77, 0, 0.175, 1);
        }

        .judge-info {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          bottom: 8px;
          z-index: 4;
          color: #ddd;
          font-family: 'Inter', sans-serif;
          font-size: 14px;
          background: rgba(0,0,0,0.45);
          padding: 6px 12px;
          border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.05);
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .score-num {
          font-family: 'Orbitron', sans-serif;
          font-size: 50px; /* ~10% smaller */
          font-weight: 900;
          color: #ffffff;
          min-width: 30px;
          text-align: center;
        }

        .score-red {
          color: #ff4d4d;
          text-shadow: 0 0 10px rgba(255, 77, 77, 0.6);
        }

        .score-blue {
          color: #4da6ff;
          text-shadow: 0 0 10px rgba(77, 166, 255, 0.6);
        }

        .score-divider {
          font-size: 14px;
          font-weight: 800;
          color: #888;
          letter-spacing: 1px;
        }

        /* Winner configurations */
        .winner-red .center-score-badge,
        .winner-blue .center-score-badge {
          opacity: 0;
          transform: translate(-50%, -150%) scale(0.7);
          pointer-events: none;
        }

        .winner-red .team-left,
        .winner-red .team-right,
        .winner-blue .team-left,
        .winner-blue .team-right {
          opacity: 0;
          pointer-events: none;
        }

        .winner-red .team-right {
          transform: translateX(50px);
        }

        .winner-red .team-left {
          transform: translateX(-50px);
        }

        .winner-blue .team-left {
          transform: translateX(-50px);
        }

        .winner-blue .team-right {
          transform: translateX(50px);
        }

        .winner-banner {
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
          z-index: 3;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
          animation: bannerFadeIn 0.8s cubic-bezier(0.77, 0, 0.175, 1) forwards;
        }

        @keyframes bannerFadeIn {
          0% {
            opacity: 0;
            transform: translateY(20px) scale(0.9);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .winner-label {
          font-size: 16px;
          font-weight: 800;
          color: #ffeb3b;
          letter-spacing: 4px;
          text-transform: uppercase;
          margin-bottom: 2px;
          text-shadow: 0 2px 4px rgba(0,0,0,0.5);
          animation: pulseOpacity 2s ease-in-out infinite;
        }

        .winner-team-name {
          font-family: 'Orbitron', sans-serif;
          font-size: 47px; /* ~10% smaller */
          font-weight: 900;
          color: #ffffff;
          text-shadow: 0 0 15px rgba(255, 255, 255, 0.5), 0 2px 8px rgba(0,0,0,0.8);
          text-transform: uppercase;
          text-align: center;
          padding: 0 20px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 90%;
        }

        @keyframes pulseOpacity {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
      `}</style>
      
      <div className={`score-bar ${winner ? `winner-${winner}` : ''}`}>
        {/* Background color divisions */}
        <div className="bg-side bg-red" />
        <div className="bg-side bg-blue" />
        
        {/* Left Team (Red side) */}
        <div className="team-container team-left">
          <span className="team-name">{data.team1}</span>
        </div>
        
        {/* Central Score Badge */}
        <div className="center-score-badge">
          <span className="score-num score-red">{data.score1}</span>
          <span className="score-divider">VS</span>
          <span className="score-num score-blue">{data.score2}</span>
        </div>
        
        {/* Right Team (Blue side) */}
        <div className="team-container team-right">
          <span className="team-name">{data.team2}</span>
        </div>
        
        {/* Winner Banner */}
        {winner && (
          <div className="winner-banner">
            <span className="winner-label">🏆 GANADOR 🏆</span>
            <span className="winner-team-name">
              {winner === 'red' ? data.team1 : data.team2}
            </span>
          </div>
        )}
        {/* Judge / Claim info */}
        <div className="judge-info">
          {data.claimedBy && <span>Juez (abrió): {data.claimedBy}</span>}
          {data.lastUpdatedBy && <span>Última actualización: {data.lastUpdatedBy}</span>}
        </div>
      </div>
    </div>
  )
}
