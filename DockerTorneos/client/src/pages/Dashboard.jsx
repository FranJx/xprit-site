import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

export default function Dashboard(){
  const { user } = useAuth()

  return (
    <div className="container mt-4">
      <div className="landing-hero p-4 p-md-5 mb-4 rounded-4 shadow-lg">
        <div className="col-lg-8 px-0">
          <h1 className="display-6 fw-bold">Gestión Torneo COPAS</h1>
          <p className="lead my-3">Inscribite, revisá llaves visuales y seguí el torneo en tiempo real. El panel de Stream queda reservado para administración y transmisión.</p>
          <div className="d-flex gap-2 flex-wrap">
            <Link className="btn btn-warning btn-lg" to="/tournaments">Ver torneos</Link>
            {!user && <Link className="btn btn-outline-light btn-lg" to="/register">Crear cuenta</Link>}
            {user && ['admin', 'stream'].includes(user.role) && <Link className="btn btn-outline-info btn-lg" to="/stream">Abrir Stream</Link>}
          </div>
        </div>
      </div>

      <div className="row g-3">
        <div className="col-md-4">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Inscripción</h5>
              <p className="card-text">Usuarios logueados se inscriben a torneos con su nombre.</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Llaves visuales</h5>
              <p className="card-text">Las llaves se muestran con diseño claro y no como una tabla plana.</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Overlay en vivo</h5>
              <p className="card-text">El stream controla una partida activa y envía cambios al overlay OBS.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
