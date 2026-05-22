import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AdminNavbar from './components/AdminNavbar'
import Dashboard from './pages/Dashboard'
import Tournaments from './pages/Tournaments'
import TournamentDetail from './pages/TournamentDetail'
import StreamPanel from './pages/StreamPanel'
import Register from './pages/Register'
import Login from './pages/Login'
import Overlay from './pages/Overlay'
import Overlay2 from './pages/Overlay2'
import OverlayW from './pages/OverlayW'
import { ProtectedRoute } from './components/ProtectedRoute'
import { useLocation } from 'react-router-dom'

export default function App(){
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AppShell />
    </BrowserRouter>
  )
}

function AppShell() {
  const location = useLocation()
  const isOverlayW = location.pathname.startsWith('/overlayW')
  const isOverlay = location.pathname.startsWith('/overlay')
  const isAuth = location.pathname === '/login' || location.pathname === '/register'
  const showMicroFooter = !isOverlay && !isAuth

  return (
    <>
      {!isOverlayW && <AdminNavbar />}
      <Routes>
        <Route path="/" element={<Dashboard/>} />
        <Route path="/tournaments" element={<Tournaments/>} />
        <Route path="/tournament/:id" element={<TournamentDetail/>} />
        <Route path="/stream" element={<ProtectedRoute roles={['admin', 'stream']}><StreamPanel/></ProtectedRoute>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/overlay" element={<Overlay/>} />
        <Route path="/overlay2" element={<Overlay2/>} />
        <Route path="/overlay2/:channel" element={<Overlay2/>} />
        <Route path="/overlayW" element={<OverlayW/>} />
        <Route path="/overlayW/:id" element={<OverlayW/>} />
      </Routes>
      {showMicroFooter && <div className="micro-footer">By Franco Aguirre</div>}
    </>
  )
}
