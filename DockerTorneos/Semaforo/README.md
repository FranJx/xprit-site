# 🚦 Sistema de Semáforo para Competencia de Robots

**Plug and Play - Sin instalaciones, solo abre en el navegador**

## 📋 Características

### Ventana de Admin/Árbitro
- **Semáforo LED**: Rojo → Amarillo → Verde (secuencia automática de 4 segundos)
- **Cronómetro Inicial**: Cuenta 5 segundos después del verde
- **Cronómetro de Competencia**: Inicia después del cronómetro inicial
- **Cronómetro Opcional**: Switch que corre/resetea al tocarlo
- **Sistema de Puntuación**: Para Robot Rojo y Robot Azul
- **Sistema de Faltas**: 2 faltas = 1 punto al contrincante
- **Condiciones de Victoria**: 3-0 o 2-1
- **Pantalla Competidor**: Botón para abrir en ventana flotante

### Ventana del Competidor
- Muestra en tiempo real el estado del semáforo
- Visualiza ambos cronómetros
- Muestra puntuación actualizada
- Solo lectura, sin controles

## 🚀 Cómo Usar

### Opción 1: Abrir directamente
1. Descarga todos los archivos en una carpeta
2. Haz doble clic en `index.html`
3. ¡Listo! El sistema se abrirá en tu navegador

### Opción 2: Desde navegador
1. Abre tu navegador (Chrome, Firefox, Edge, Safari, etc.)
2. Presiona `Ctrl+O` (o `Cmd+O` en Mac)
3. Selecciona `index.html`
4. ¡Empieza a usar!

## 🎮 Controles de Admin

### Botones de Semáforo
- **INICIAR**: Comienza la secuencia Rojo → Amarillo → Verde
- **DETENER**: Detiene todo y apaga los LEDs

### Sistema de Puntuación
- **+Punto**: Suma un punto al equipo
- **+Falta**: Suma una falta (cada 2 faltas = 1 punto al contrincante)
- **Limpiar Puntuación**: Resetea todo a 0

### Cronómetro Opcional
- Tócalo una vez para iniciar
- Tócalo de nuevo para detener y resetear

### Pantalla Competidor
- **Abrir Pantalla**: Abre la ventana flotante con la vista del competidor

## 📊 Tiempos

- **Rojo**: 1.3 segundos
- **Amarillo**: 1.4 segundos
- **Verde**: 1.3 segundos
- **Espera (todos verdes)**: 5 segundos
- **Total inicio a todos verdes**: 4 segundos

## 🎨 Diseño

- Interfaz oscura y moderna
- Colores distintos para cada sección
- LEDs con efectos de brillo realistas
- Cronómetros con fuente monoespaciada para precisión
- Responsive (funciona en pantallas de cualquier tamaño)

## 📱 Compatibilidad

✅ Windows, Mac, Linux
✅ Chrome, Firefox, Edge, Safari
✅ Funciona sin conexión a internet
✅ Sin dependencias externas

## 🔧 Archivos Incluidos

- `index.html` - Interfaz de admin (ABRIR ESTE ARCHIVO)
- `competitor.html` - Interfaz del competidor
- `styles.css` - Estilos (compartido)
- `app.js` - Lógica de la app
- `README.md` - Este archivo

## 💡 Tips

1. Para mejor experiencia, usa pantalla completa (F11)
2. La ventana del competidor puede abrirse en otra pantalla
3. Los cronómetros son precisos (actualizan cada 100ms)
4. Todos los datos se guardan durante la sesión

## 🐛 Troubleshooting

**Los botones no responden**
- Asegúrate de que los archivos estén en la misma carpeta
- Intenta refrescar la página (F5)

**La ventana flotante no aparece**
- Verifica que JavaScript esté habilitado
- Intenta abrir desde una carpeta local, no desde un ZIP

**Los tiempos no son exactos**
- Usa un navegador moderno (Chrome, Firefox, Edge)
- Cierra otras aplicaciones que usen muchos recursos

## 📝 Versión

v1.0 - Primera versión

---

**¡Disfruta tu competencia! 🏆**
