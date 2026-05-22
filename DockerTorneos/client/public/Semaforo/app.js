// ==================== VARIABLES GLOBALES ====================
let estadoSemaforo = {
    activo: false,
    fase: null, // 'rojo', 'amarillo', 'verde', 'espera'
    cronoInicialActivo: false,
    cronoCompetenciaActivo: false,
    cronoOpcionalActivo: false,
    tiempoInicial: 0,
    tiempoCompetencia: 0,
    tiempoOpcional: 0
};

// ==================== VARIABLES DE INTEGRACIÓN ====================
const urlParams = new URLSearchParams(window.location.search);
const matchId = urlParams.get('matchId');
const token = urlParams.get('token');
const SERVER_URL = 'http://localhost:4000';
let matchDetails = null;

let puntuacion = {
    rojo: {
        puntos: 0,
        faltas: 0
    },
    azul: {
        puntos: 0,
        faltas: 0
    }
};

let tiemposFase = {
    rojo: 1.3,
    amarillo: 1.4,
    verde: 1.3
};

let ventanaCompetidorAbierta = null;
let temaActual = 'dark';
let semaforoBloqueado = false;

// ==================== INICIALIZACIÓN ====================
document.addEventListener('DOMContentLoaded', function() {
    inicializarTema();
    inicializarEventos();
    if (matchId && token) {
        cargarDatosMatch();
    }
});

function inicializarTema() {
    // Cargar tema guardado o usar dark por defecto
    const temaSaved = localStorage.getItem('tema') || 'dark';
    temaActual = temaSaved;
    document.body.className = `theme-${temaSaved}`;
    actualizarTextoBotonTema();
}

function toggleTema() {
    temaActual = temaActual === 'dark' ? 'light' : 'dark';
    document.body.className = `theme-${temaActual}`;
    localStorage.setItem('tema', temaActual);
    actualizarTextoBotonTema();
    
    // Cambiar tema en ventana del competidor
    if (ventanaCompetidorAbierta && !ventanaCompetidorAbierta.closed) {
        ventanaCompetidorAbierta.postMessage({ evento: 'cambiar_tema', tema: temaActual }, '*');
    }
}

function actualizarTextoBotonTema() {
    const btn = document.getElementById('themeToggle');
    if (btn) {
        btn.innerHTML = `<span class="theme-icon">${temaActual === 'dark' ? '☀️ Light' : '🌙 Dark'}</span>`;
    }
}

function inicializarEventos() {
    // Botones de semáforo
    document.getElementById('btnStart').addEventListener('click', iniciarSemaforo);
    document.getElementById('btnStop').addEventListener('click', detenerSemaforo);
    document.getElementById('btnCronoOpcional').addEventListener('click', toggleCronoOpcional);
    
    // Botón de tema
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTema);
    }
    
    // Ventana competidor
    document.getElementById('btnCompetidor').addEventListener('click', abrirVentanaCompetidor);
    
    // Botones de puntuación
    document.querySelectorAll('.btn-punto').forEach(btn => {
        btn.addEventListener('click', agregarPunto);
    });
    
    document.querySelectorAll('.btn-falta').forEach(btn => {
        btn.addEventListener('click', agregarFalta);
    });
    
    document.getElementById('btnResetPuntuacion')?.addEventListener('click', resetearPuntuacion);
}

async function cargarDatosMatch() {
    try {
        const res = await fetch(`${SERVER_URL}/api/tournaments/match/${matchId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!res.ok) throw new Error('No se pudo cargar la partida del servidor.');
        matchDetails = await res.json();
        
        // Actualizar nombres de equipos en tarjetas
        const cardRojoTitle = document.querySelector('.robot-rojo h3');
        const cardAzulTitle = document.querySelector('.robot-azul h3');
        if (cardRojoTitle) cardRojoTitle.textContent = matchDetails.team1_name || 'ROBOT ROJO';
        if (cardAzulTitle) cardAzulTitle.textContent = matchDetails.team2_name || 'ROBOT AZUL';
        
        // Sincronizar puntuación local con el backend
        puntuacion.rojo.puntos = matchDetails.score1 || 0;
        puntuacion.azul.puntos = matchDetails.score2 || 0;
        
        document.getElementById('puntosRojo').textContent = puntuacion.rojo.puntos;
        document.getElementById('puntosAzul').textContent = puntuacion.azul.puntos;
        
        // Si hay una ventana del competidor abierta, mandarle nombres y puntos
        if (ventanaCompetidorAbierta && !ventanaCompetidorAbierta.closed) {
            ventanaCompetidorAbierta.postMessage({
                evento: 'actualizar_nombres_equipos',
                team1_name: matchDetails.team1_name,
                team2_name: matchDetails.team2_name
            }, '*');
        }
        enviarActualizacionPuntuacion();

        await reclamarMatchParaJuez();
    } catch (err) {
        console.error(err);
        alert('Error al cargar datos del torneo: ' + err.message);
    }
}

async function reclamarMatchParaJuez() {
    if (!matchDetails || !matchId || !token) return;

    try {
        const res = await fetch(`${SERVER_URL}/api/tournaments/${matchDetails.tournament_id}/match/${matchId}/claim-overlay`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (res.status === 409) {
            semaforoBloqueado = true;
            bloquearControles('Este match ya está abierto por otro juez.');
            return;
        }

        if (!res.ok) {
            throw new Error('No se pudo reclamar el match para el overlay.');
        }
    } catch (err) {
        console.error(err);
        alert('Error al reclamar el match: ' + err.message);
    }
}

function bloquearControles(mensaje) {
    const ids = ['btnStart', 'btnStop', 'btnCronoOpcional', 'btnResetPuntuacion', 'btnCompetidor'];
    ids.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.disabled = true;
    });

    document.querySelectorAll('.btn-punto, .btn-falta').forEach(btn => {
        btn.disabled = true;
    });

    if (mensaje) {
        alert(mensaje);
    }
}

// ==================== LÓGICA DEL SEMÁFORO ====================
function iniciarSemaforo() {
    if (semaforoBloqueado) return;
    if (estadoSemaforo.activo) return;
    
    estadoSemaforo.activo = true;
    document.getElementById('btnStart').disabled = true;
    document.getElementById('btnStop').disabled = false;
    
    // Resetear cronómetros
    estadoSemaforo.tiempoInicial = 0;
    estadoSemaforo.tiempoCompetencia = 0;
    
    // Iniciar secuencia: Rojo -> Amarillo -> Verde
    secuenciaSemaforo();
}

function detenerSemaforo() {
    if (semaforoBloqueado) return;
    estadoSemaforo.activo = false;
    estadoSemaforo.cronoInicialActivo = false;
    estadoSemaforo.cronoCompetenciaActivo = false;
    
    document.getElementById('btnStart').disabled = false;
    document.getElementById('btnStop').disabled = true;
    
    // Apagar todos los LEDs
    apagarTodosLeds();
    
    // Notificar a la ventana del competidor
    if (ventanaCompetidorAbierta) {
        ventanaCompetidorAbierta.postMessage({ evento: 'semaforo_apagado' }, '*');
    }
}

function apagarTodosLeds() {
    const ledRojo = document.getElementById('ledRojo');
    const ledAmarillo = document.getElementById('ledAmarillo');
    const ledVerde = document.getElementById('ledVerde');
    
    ledRojo.classList.remove('activo');
    ledRojo.style.background = '';
    ledRojo.style.boxShadow = '';
    
    ledAmarillo.classList.remove('activo');
    ledAmarillo.style.background = '';
    ledAmarillo.style.boxShadow = '';
    
    ledVerde.classList.remove('activo');
}

function encenderLed(color) {
    apagarTodosLeds();
    document.getElementById(`led${color.charAt(0).toUpperCase() + color.slice(1)}`).classList.add('activo');
    
    // Notificar a la ventana del competidor
    if (ventanaCompetidorAbierta) {
        ventanaCompetidorAbierta.postMessage({ evento: 'led_encendido', color: color }, '*');
    }
}

function secuenciaSemaforo() {
    encenderLed('rojo');
    estadoSemaforo.fase = 'rojo';
    
    setTimeout(() => {
        if (!estadoSemaforo.activo) return;
        
        encenderLed('amarillo');
        estadoSemaforo.fase = 'amarillo';
        
        setTimeout(() => {
            if (!estadoSemaforo.activo) return;
            
            encenderLed('verde');
            estadoSemaforo.fase = 'verde';
            
            // Iniciar cronómetro inicial (5 segundos con verde encendido)
            estadoSemaforo.cronoInicialActivo = true;
            estadoSemaforo.tiempoInicial = 0;
            iniciarCronometroInicial();
            
            // Después de 5s, encender todos los LEDs en verde
            setTimeout(() => {
                if (!estadoSemaforo.activo) return;
                encenderTodosLeds('verde');
                estadoSemaforo.fase = 'espera';
                
                // Iniciar cronómetro de competencia
                estadoSemaforo.cronoCompetenciaActivo = true;
                estadoSemaforo.tiempoCompetencia = 0;
                iniciarCronometroCompetencia();
            }, 5000);
            
        }, tiemposFase.amarillo * 1000);
        
    }, tiemposFase.rojo * 1000);
}

function encenderTodosLeds(color) {
    // Apagar primero
    apagarTodosLeds();
    
    // Luego encender todos en VERDE
    const ledRojo = document.getElementById('ledRojo');
    const ledAmarillo = document.getElementById('ledAmarillo');
    const ledVerde = document.getElementById('ledVerde');
    
    // Establecer estilos diretos de verde
    ledRojo.style.background = '#00ff00';
    ledRojo.style.boxShadow = '0 0 40px rgba(76, 175, 80, 0.8)';
    ledRojo.classList.add('activo');
    
    ledAmarillo.style.background = '#00ff00';
    ledAmarillo.style.boxShadow = '0 0 40px rgba(76, 175, 80, 0.8)';
    ledAmarillo.classList.add('activo');
    
    ledVerde.classList.add('activo');
    
    console.log('✅ TODOS LOS LEDS VERDES ENCENDIDOS');
    
    if (ventanaCompetidorAbierta && !ventanaCompetidorAbierta.closed) {
        ventanaCompetidorAbierta.postMessage({ evento: 'todos_verdes' }, '*');
    }
}

function iniciarCronometroInicial() {
    let contador = 0;
    let intervalo = setInterval(() => {
        if (!estadoSemaforo.cronoInicialActivo || !estadoSemaforo.activo) {
            clearInterval(intervalo);
            return;
        }
        
        contador++;
        estadoSemaforo.tiempoInicial = contador;
        actualizarDisplayCrono('cronoInicial', contador);
        
        if (ventanaCompetidorAbierta) {
            ventanaCompetidorAbierta.postMessage({ 
                evento: 'actualizar_crono_inicial', 
                tiempo: contador 
            }, '*');
        }
    }, 100);
}

function iniciarCronometroCompetencia() {
    let contador = 0;
    let intervalo = setInterval(() => {
        if (!estadoSemaforo.cronoCompetenciaActivo || !estadoSemaforo.activo) {
            clearInterval(intervalo);
            return;
        }
        
        contador++;
        estadoSemaforo.tiempoCompetencia = contador;
        actualizarDisplayCrono('cronoCompetencia', contador);
        
        if (ventanaCompetidorAbierta) {
            ventanaCompetidorAbierta.postMessage({ 
                evento: 'actualizar_crono_competencia', 
                tiempo: contador 
            }, '*');
        }
    }, 100);
}

function toggleCronoOpcional() {
    if (estadoSemaforo.cronoOpcionalActivo) {
        // Detener y resetear
        estadoSemaforo.cronoOpcionalActivo = false;
        estadoSemaforo.tiempoOpcional = 0;
        actualizarDisplayCrono('cronoOpcional', 0);
        document.getElementById('btnCronoOpcional').classList.remove('running');
    } else {
        // Iniciar
        estadoSemaforo.cronoOpcionalActivo = true;
        document.getElementById('btnCronoOpcional').classList.add('running');
        iniciarCronoOpcional();
    }
}

function iniciarCronoOpcional() {
    let contador = 0;
    let intervalo = setInterval(() => {
        if (!estadoSemaforo.cronoOpcionalActivo) {
            clearInterval(intervalo);
            return;
        }
        
        contador++;
        estadoSemaforo.tiempoOpcional = contador;
        actualizarDisplayCrono('cronoOpcional', contador);
    }, 100);
}

function actualizarDisplayCrono(elementId, tiempoEnDecimas) {
    const segundos = Math.floor(tiempoEnDecimas / 10);
    const decimas = tiempoEnDecimas % 10;
    
    const minutos = Math.floor(segundos / 60);
    const segsRestantes = segundos % 60;
    
    const tiempo = `${String(minutos).padStart(2, '0')}:${String(segsRestantes).padStart(2, '0')}`;
    document.getElementById(elementId).textContent = tiempo;
}

// ==================== LÓGICA DE PUNTUACIÓN ====================
async function agregarPunto(evento) {
    if (semaforoBloqueado) return;
    const robot = evento.target.dataset.robot;
    
    if (matchId && token) {
        const teamNum = robot === 'rojo' ? 1 : 2;
        try {
            const res = await fetch(`${SERVER_URL}/api/tournaments/match/${matchId}/increment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ team: teamNum })
            });
            if (!res.ok) throw new Error('Error al guardar en el servidor');
            const data = await res.json();
            puntuacion.rojo.puntos = data.score1;
            puntuacion.azul.puntos = data.score2;
        } catch (err) {
            console.error(err);
            alert('No se pudo guardar la puntuación: ' + err.message);
            return;
        }
    } else {
        if (robot === 'rojo') {
            puntuacion.rojo.puntos++;
        } else if (robot === 'azul') {
            puntuacion.azul.puntos++;
        }
    }
    
    document.getElementById('puntosRojo').textContent = puntuacion.rojo.puntos;
    document.getElementById('puntosAzul').textContent = puntuacion.azul.puntos;
    
    verificarGanador();
    enviarActualizacionPuntuacion();
}

async function incrementarFaltaPunto(teamNum) {
    if (semaforoBloqueado) return;
    if (matchId && token) {
        try {
            const res = await fetch(`${SERVER_URL}/api/tournaments/match/${matchId}/increment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ team: teamNum })
            });
            if (!res.ok) throw new Error('Error al guardar en el servidor');
            const data = await res.json();
            puntuacion.rojo.puntos = data.score1;
            puntuacion.azul.puntos = data.score2;
        } catch (err) {
            console.error(err);
            alert('No se pudo guardar la puntuación por falta: ' + err.message);
        }
    } else {
        if (teamNum === 1) {
            puntuacion.rojo.puntos++;
        } else {
            puntuacion.azul.puntos++;
        }
    }
    document.getElementById('puntosRojo').textContent = puntuacion.rojo.puntos;
    document.getElementById('puntosAzul').textContent = puntuacion.azul.puntos;
}

async function agregarFalta(evento) {
    if (semaforoBloqueado) return;
    const robot = evento.target.dataset.robot;
    
    if (robot === 'rojo') {
        puntuacion.rojo.faltas++;
        document.getElementById('faltasRojo').textContent = puntuacion.rojo.faltas;
        
        // Cada 2 faltas = 1 punto al contrincante
        if (puntuacion.rojo.faltas % 2 === 0) {
            await incrementarFaltaPunto(2);
        }
    } else if (robot === 'azul') {
        puntuacion.azul.faltas++;
        document.getElementById('faltasAzul').textContent = puntuacion.azul.faltas;
        
        // Cada 2 faltas = 1 punto al contrincante
        if (puntuacion.azul.faltas % 2 === 0) {
            await incrementarFaltaPunto(1);
        }
    }
    
    verificarGanador();
    enviarActualizacionPuntuacion();
}

function verificarGanador() {
    const { rojo, azul } = puntuacion;
    
    // Al mejor de 3 (se gana con 2 puntos)
    if (rojo.puntos >= 2) {
        mostrarGanador('ROJO');
    } else if (azul.puntos >= 2) {
        mostrarGanador('AZUL');
    }
}

async function mostrarGanador(color) {
    if (semaforoBloqueado) return;
    alert(`¡GANADOR: ROBOT ${color}!`);
    if (matchId && token) {
        try {
            const res = await fetch(`${SERVER_URL}/api/tournaments/match/${matchId}/finalize`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!res.ok) throw new Error('Error al finalizar en el servidor');
            alert('La partida se ha guardado y finalizado correctamente en el torneo.');
        } catch (err) {
            console.error(err);
            alert('Error al finalizar la partida en el servidor: ' + err.message);
        }
    }
}

async function resetearPuntuacion() {
    if (semaforoBloqueado) return;
    if (matchId && token) {
        try {
            const res = await fetch(`${SERVER_URL}/api/tournaments/match/${matchId}/reset`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!res.ok) throw new Error('Error al reiniciar en el servidor');
            const data = await res.json();
            puntuacion.rojo.puntos = data.score1;
            puntuacion.azul.puntos = data.score2;
        } catch (err) {
            console.error(err);
            alert('No se pudo reiniciar la puntuación en el servidor: ' + err.message);
            return;
        }
    } else {
        puntuacion.rojo.puntos = 0;
        puntuacion.azul.puntos = 0;
    }
    
    puntuacion.rojo.faltas = 0;
    puntuacion.azul.faltas = 0;
    
    document.getElementById('puntosRojo').textContent = puntuacion.rojo.puntos;
    document.getElementById('puntosAzul').textContent = puntuacion.azul.puntos;
    document.getElementById('faltasRojo').textContent = '0';
    document.getElementById('faltasAzul').textContent = '0';
    
    enviarActualizacionPuntuacion();
}

function enviarActualizacionPuntuacion() {
    if (ventanaCompetidorAbierta) {
        ventanaCompetidorAbierta.postMessage({ 
            evento: 'actualizar_puntuacion', 
            puntuacion: puntuacion 
        }, '*');
    }
}

// ==================== VENTANA NUEVA COMPETIDOR ====================
function abrirVentanaCompetidor() {
    // Abrir nueva ventana
    if (ventanaCompetidorAbierta && !ventanaCompetidorAbierta.closed) {
        ventanaCompetidorAbierta.focus();
    } else {
        ventanaCompetidorAbierta = window.open('competitor.html', 'VentanaCompetidor', 'width=1000,height=800,left=100,top=100');
    }
}

function cerrarVentanaCompetidor() {
    if (ventanaCompetidorAbierta && !ventanaCompetidorAbierta.closed) {
        ventanaCompetidorAbierta.close();
    }
}

// Escuchar mensajes de la ventana del competidor
window.addEventListener('message', (event) => {
    const data = event.data;
    
    if (data.evento === 'ventana_cargada') {
        if (ventanaCompetidorAbierta === null) {
            ventanaCompetidorAbierta = event.source;
        }
        // Enviar nombres de equipos y puntuación inmediatamente
        if (matchDetails) {
            ventanaCompetidorAbierta.postMessage({
                evento: 'actualizar_nombres_equipos',
                team1_name: matchDetails.team1_name,
                team2_name: matchDetails.team2_name
            }, '*');
        }
        enviarActualizacionPuntuacion();
    }
});
