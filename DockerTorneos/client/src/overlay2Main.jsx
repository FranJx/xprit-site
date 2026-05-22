import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import Overlay2 from './pages/Overlay2'

const container = document.getElementById('overlay2-root')

function mount() {
	try {
		const root = createRoot(container)
		root.render(
			<BrowserRouter>
				<Overlay2 />
			</BrowserRouter>
		)
	} catch (err) {
		console.error('Overlay2 mount error', err)
		try {
			container.innerHTML = `<div style="color:white;background:rgba(255,0,0,0.85);padding:16px;font-family:sans-serif;">Overlay mount error: ${err.message}</div>`
		} catch (e) {}
	}
}

// global error handler to avoid blank screen
window.addEventListener('error', (ev) => {
	console.error('Window error in Overlay2', ev.error || ev.message)
})

mount()
