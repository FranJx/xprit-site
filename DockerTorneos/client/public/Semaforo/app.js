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

// ==================== CONFIGURACIÓN SOCKET.IO ====================
const SERVER = window.location.hostname === 'localhost' 
    ? 'http://localhost:4000'
    : `http://${window.location.hostname}:4000`;

const urlParams = new URLSearchParams(window.location.search);
const matchId = urlParams.get('matchId') || '1';
let socket = null;

function conectarAlBackend() {
    socket = io(SERVER + '/overlay', {
        query: { channel: matchId }
    });

    socket.on('connect', () => {
        console.log('✅ Semáforo conectado al backend:', socket.id);
        socket.emit('joinChannel', matchId);
    });

    socket.on('connect_error', (error) => {
        console.error('❌ Error de conexión:', error);
    });

    socket.on('disconnect', () => {
        console.log('❌ Desconectado del backend');
    });

    // Recibir cambios desde el backend (si otro cliente modifica el estado)
    socket.on('overlayUpdate', (data) => {
        console.log('📥 Actualización recibida:', data);
        if (data.puntuacion) {
            puntuacion = data.puntuacion;
            actualizarDisplayPuntuacion();
        }
    });
}

function actualizarDisplayPuntuacion() {
    document.getElementById('puntosRojo').textContent = puntuacion.rojo.puntos;
    document.getElementById('puntosAzul').textContent = puntuacion.azul.puntos;
    document.getElementById('faltasRojo').textContent = puntuacion.rojo.faltas;
    document.getElementById('faltasAzul').textContent = puntuacion.azul.faltas;
}

// ==================== INICIALIZACIÓN ====================
document.addEventListener('DOMContentLoaded', function() {
    inicializarTema();
    inicializarEventos();
    conectarAlBackend();
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

// ==================== LÓGICA DEL SEMÁFORO ====================
function iniciarSemaforo() {
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

    // Emitir al backend
    if (socket && socket.connected) {
        socket.emit('scoreUpdate', {
            matchId: matchId,
            estado: { fase: color },
            timestamp: new Date().toISOString()
        });
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
function agregarPunto(evento) {
    const robot = evento.target.dataset.robot;
    
    if (robot === 'rojo') {
        puntuacion.rojo.puntos++;
        document.getElementById('puntosRojo').textContent = puntuacion.rojo.puntos;
    } else if (robot === 'azul') {
        puntuacion.azul.puntos++;
        document.getElementById('puntosAzul').textContent = puntuacion.azul.puntos;
    }
    
    verificarGanador();
    enviarActualizacionPuntuacion();
}

function agregarFalta(evento) {
    const robot = evento.target.dataset.robot;
    
    if (robot === 'rojo') {
        puntuacion.rojo.faltas++;
        document.getElementById('faltasRojo').textContent = puntuacion.rojo.faltas;
        
        // Cada 2 faltas = 1 punto al contrincante
        if (puntuacion.rojo.faltas % 2 === 0) {
            puntuacion.azul.puntos++;
            document.getElementById('puntosAzul').textContent = puntuacion.azul.puntos;
        }
    } else if (robot === 'azul') {
        puntuacion.azul.faltas++;
        document.getElementById('faltasAzul').textContent = puntuacion.azul.faltas;
        
        // Cada 2 faltas = 1 punto al contrincante
        if (puntuacion.azul.faltas % 2 === 0) {
            puntuacion.rojo.puntos++;
            document.getElementById('puntosRojo').textContent = puntuacion.rojo.puntos;
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

function mostrarGanador(color) {
    alert(`¡GANADOR: ROBOT ${color}!`);
}

function resetearPuntuacion() {
    puntuacion.rojo = { puntos: 0, faltas: 0 };
    puntuacion.azul = { puntos: 0, faltas: 0 };
    
    document.getElementById('puntosRojo').textContent = '0';
    document.getElementById('puntosAzul').textContent = '0';
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

    // Emitir al backend para sincronizar con Overlay2
    if (socket && socket.connected) {
        socket.emit('scoreUpdate', {
            matchId: matchId,
            puntuacion: puntuacion,
            timestamp: new Date().toISOString()
        });
        console.log('📤 Puntuación enviada al backend');
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
    // Verificar origen si es necesario
    const data = event.data;
    
    if (data.evento === 'ventana_cargada') {
        if (ventanaCompetidorAbierta === null) {
            ventanaCompetidorAbierta = event.source;
        }
    }
});
