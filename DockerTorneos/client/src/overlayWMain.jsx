import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import OverlayW from './pages/OverlayW'

const container = document.getElementById('overlayw-root') || document.getElementById('root')

function mount() {
  try {
    const root = createRoot(container)
    root.render(
      <BrowserRouter>
        <OverlayW />
      </BrowserRouter>
    )
  } catch (err) {
    console.error('OverlayW mount error', err)
    try {
      container.innerHTML = `<div style="color:white;background:rgba(255,0,0,0.85);padding:16px;font-family:sans-serif;">OverlayW error: ${err.message}</div>`
    } catch (e) {}
  }
}

window.addEventListener('error', (ev) => {
  console.error('Window error in OverlayW', ev.error || ev.message)
})

mount()