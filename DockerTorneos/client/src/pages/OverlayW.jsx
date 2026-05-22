import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { apiFetch } from '../api'

function getTournamentId(paramId) {
  const query = new URLSearchParams(window.location.search)
  return paramId || query.get('tournamentId') || query.get('id') || ''
}

export default function OverlayW() {
  const { id: paramId } = useParams()
  const tournamentId = getTournamentId(paramId)
  const [podiumState, setPodiumState] = useState({ finished: false, podium: [] })
  const [enabledByStream, setEnabledByStream] = useState(false)

  useEffect(() => {
    document.body.classList.add('overlay-transparent')
    return () => {
      document.body.classList.remove('overlay-transparent')
    }
  }, [])

  useEffect(() => {
    if (!tournamentId) return

    let alive = true
    let timer

    const loadVisibility = async () => {
      try {
        const data = await apiFetch(`/api/tournaments/${tournamentId}/overlayw-visibility`)
        if (!alive) return
        setEnabledByStream(Boolean(data?.enabled))
      } catch (err) {
        console.error('overlayW visibility load error', err)
      }
    }

    const loadPodium = async () => {
      try {
        const data = await apiFetch(`/api/tournaments/${tournamentId}/podium`)
        if (!alive) return
        setPodiumState(data)
      } catch (err) {
        console.error('overlayW podium load error', err)
      }
    }

    loadVisibility()
    loadPodium()
    timer = setInterval(() => {
      loadVisibility()
      loadPodium()
    }, 3000)

    return () => {
      alive = false
      clearInterval(timer)
    }
  }, [tournamentId])

  if (!tournamentId || !enabledByStream || !podiumState.finished || podiumState.podium.length === 0) {
    return null
  }

  const podium = podiumState.podium

  return (
    <div className="overlayw-stage">
      <style>{`
        .overlayw-stage {
          position: fixed;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
          background: transparent;
        }

        .overlayw-card {
          width: min(1120px, calc(100vw - 48px));
          border-radius: 28px;
          padding: 28px;
          color: #fff;
          background:
            linear-gradient(180deg, rgba(9, 12, 23, 0.98), rgba(9, 12, 23, 0.98)),
            radial-gradient(circle at top, rgba(255, 215, 0, 0.24), transparent 36%);
          border: 1px solid rgba(255, 255, 255, 0.18);
          box-shadow: 0 24px 80px rgba(0, 0, 0, 0.58);
          backdrop-filter: blur(12px);
          animation: overlaywFadeIn 500ms ease-out;
        }

        .overlayw-title {
          text-transform: uppercase;
          letter-spacing: 0.24em;
          font-size: 12px;
          color: rgba(255, 255, 255, 0.72);
          margin-bottom: 6px;
        }

        .overlayw-main {
          display: grid;
          grid-template-columns: 1.15fr 1.4fr 1.15fr;
          gap: 18px;
          align-items: end;
          margin-top: 18px;
        }

        .podium-slot {
          border-radius: 24px;
          padding: 22px 18px 18px;
          text-align: center;
          background: rgba(255, 255, 255, 0.18);
          border: 1px solid rgba(255, 255, 255, 0.18);
          min-height: 230px;
        }

        .podium-slot.first {
          min-height: 290px;
          background: linear-gradient(180deg, rgba(255, 196, 0, 0.34), rgba(255, 255, 255, 0.12));
          border-color: rgba(255, 196, 0, 0.42);
        }

        .podium-slot.second {
          background: linear-gradient(180deg, rgba(192, 192, 192, 0.28), rgba(255, 255, 255, 0.12));
        }

        .podium-slot.third {
          background: linear-gradient(180deg, rgba(205, 127, 50, 0.28), rgba(255, 255, 255, 0.12));
        }

        .position-badge {
          width: 72px;
          height: 72px;
          margin: 0 auto 16px;
          border-radius: 22px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 34px;
          font-weight: 900;
          font-family: 'Orbitron', sans-serif;
          background: rgba(255, 255, 255, 0.22);
          border: 1px solid rgba(255, 255, 255, 0.16);
        }

        .position-badge.first { background: rgba(255, 196, 0, 0.4); }
        .position-badge.second { background: rgba(192, 192, 192, 0.34); }
        .position-badge.third { background: rgba(205, 127, 50, 0.34); }

        .team-name {
          font-size: clamp(20px, 2vw, 34px);
          font-weight: 800;
          line-height: 1.1;
          margin-bottom: 10px;
        }

        .stats {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
          margin-top: 18px;
        }

        .stat {
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.16);
          padding: 10px 12px;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.82);
        }

        .stat strong {
          display: block;
          font-size: 20px;
          color: #fff;
          margin-top: 2px;
        }

        .overlayw-footer {
          margin-top: 18px;
          text-align: center;
          font-size: 12px;
          color: rgba(255, 255, 255, 0.62);
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        @keyframes overlaywFadeIn {
          from {
            opacity: 0;
            transform: translateY(14px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @media (max-width: 900px) {
          .overlayw-main {
            grid-template-columns: 1fr;
          }

          .podium-slot.first {
            min-height: 230px;
          }
        }
      `}</style>

      <div className="overlayw-card">
        <div className="overlayw-title">Podio final</div>
        <div className="team-name" style={{ marginBottom: 0 }}>Torneo terminado</div>
        <div className="overlayw-main">
          {[
            { item: podium[1], cls: 'second', label: '2' },
            { item: podium[0], cls: 'first', label: '1' },
            { item: podium[2], cls: 'third', label: '3' },
          ].map(({ item, cls, label }) => (
            <div key={label} className={`podium-slot ${cls}`}>
              <div className={`position-badge ${cls}`}>{label}</div>
              <div className="team-name">{item?.name || 'Sin definir'}</div>
              <div className="stats">
                <div className="stat">Victorias<strong>{item?.wins ?? 0}</strong></div>
                <div className="stat">Diff<strong>{item?.scoreDiff ?? 0}</strong></div>
              </div>
            </div>
          ))}
        </div>
        <div className="overlayw-footer">Solo visible cuando el torneo está finalizado</div>
      </div>
    </div>
  )
}