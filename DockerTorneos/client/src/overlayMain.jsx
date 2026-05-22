import React from 'react'
import { createRoot } from 'react-dom/client'
import Overlay from './pages/Overlay'

const container = document.getElementById('overlay-root') || document.getElementById('root')

function mount() {
	try {
		const root = createRoot(container)
		root.render(<Overlay />)
	} catch (err) {
		console.error('Overlay mount error', err)
		try {
			container.innerHTML = `<div style="color:white;background:rgba(255,0,0,0.85);padding:16px;font-family:sans-serif;">Overlay mount error: ${err.message}</div>`
		} catch (e) {}
	}
}

// global error handler to avoid blank screen
window.addEventListener('error', (ev) => {
	console.error('Window error', ev.error || ev.message)
})

mount()
