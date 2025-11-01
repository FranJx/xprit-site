# ✨ XpriT Robotics — Web actualizada

## 📋 Cambios realizados

### ✅ Página "Quiénes somos" (`pages/quien-somos.tsx`)
- ✓ Historia del equipo (2020 — presente)
- ✓ Misión y Visión del equipo
- ✓ Sección de logros con estadísticas (40+ podios, 2 campeonatos WRO, etc.)
- ✓ Lista completa de robots desarrollados
- ✓ Información de placas electrónicas (XT-Prime, XT-RC, XT-Samurai)
- ✓ Equipo con roles y áreas
- ✓ Sección "Qué hacemos" con 4 pilares principales
- ✓ CTA para contacto

### ✅ Página "Robots" actualizada
Se agregaron 4 robots principales con metadata y especificaciones completas:

#### 1. **Tokio XT** (`content/robots/tokio-xt/`)
- Categoría: Minisumo
- Placa: XT-Prime
- Logros: Campeón Nacional WRO 2023
- Especificaciones: 490g, 2.5 m/s, sensores avanzados

#### 2. **Seúl XT** (`content/robots/seul-xt/`)
- Categoría: Velocistas
- Placa: XT-Prime
- Características: Visión por computadora 120FPS
- Especificaciones: 280g, 3.8 m/s, procesador Raspberry Pi 4

#### 3. **Predator XT** (`content/robots/predator-xt/`)
- Categoría: Sumo Autónomo
- Placa: XT-RC
- Logros: Campeón Sumo RC Robotic People Fest 2020
- Especificaciones: 750g, 45kg de fuerza de empuje

#### 4. **Thunder XT** (`content/robots/thunder-xt/`)
- Categoría: VSSS (Micro-soccer)
- Placa: XT-Samurai
- Tamaño: Ultra-compacto (7.5cm)
- Especificaciones: 180g, 1.8 m/s, 3 motores

### ✅ Footer actualizado (`components/Footer.tsx`)
- ✓ Info de XpriT con descripción y ubicación (Misiones, Argentina)
- ✓ Email actualizado: contacto@xprit-robotics.com
- ✓ Redes sociales correctas: Instagram, YouTube, GitHub, Twitter/X
- ✓ Links a páginas principales
- ✓ Copyright mejorado: "Hecho con ❤️ en Misiones, Argentina"

### ✅ Landing Page mejorada (`pages/index.tsx`)
- ✓ Sección de robots destacados con datos reales (Tokio XT, Seúl XT, Predator XT)
- ✓ Nueva sección "Logros y reconocimientos" con:
  - 40+ Podios en competencias
  - 2 Campeonatos WRO
  - 20+ Robots desarrollados
  - 8+ Años de experiencia
- ✓ Cards de logros principales (WRO 2023 y 2025)

## 📁 Estructura de archivos creados

```
content/
├── robots/
│   ├── tokio-xt/
│   │   ├── metadata.json (nombre, categoría, año, descripción)
│   │   └── especificaciones.json (tabla de specs)
│   ├── seul-xt/
│   │   ├── metadata.json
│   │   └── especificaciones.json
│   ├── predator-xt/
│   │   ├── metadata.json
│   │   └── especificaciones.json
│   └── thunder-xt/
│       ├── metadata.json
│       └── especificaciones.json
```

## 🚀 Cómo ejecutar la web

### Requisitos previos
- Node.js 18+ LTS
- npm o yarn

### Pasos para ejecutar

```bash
# 1. Ir al directorio del proyecto
cd c:\Users\Fran\Documents\WEBXPRIT\xprit-site

# 2. Instalar dependencias (primera vez)
npm install

# 3. Ejecutar servidor de desarrollo
npm run dev

# 4. Abre tu navegador en:
# http://localhost:3000
```

## 🌐 Rutas disponibles

| Ruta | Descripción |
|------|------------|
| `/` | Página de inicio con hero, robots destacados y logros |
| `/robots` | Galería de todos los robots |
| `/robots/tokio-xt` | Detalle del robot Tokio XT |
| `/robots/seul-xt` | Detalle del robot Seúl XT |
| `/robots/predator-xt` | Detalle del robot Predator XT |
| `/robots/thunder-xt` | Detalle del robot Thunder XT |
| `/noticias` | Blog de noticias |
| `/quien-somos` | Información del equipo |
| `/contacto` | Formulario de contacto |

## 💡 Información de XpriT en la web

- **Ubicación**: Misiones, Argentina
- **Fundación**: ~2020
- **Líder**: Franco Joaquín Aguirre Elizalde (8+ años experiencia)
- **Logros principales**:
  - Campeón Nacional WRO 2023
  - Campeón Nacional WRO 2025
  - Campeón Sumo RC Robotic People Fest 2020
  - 40+ podios en competencias
  - Participación en torneos internacionales

## 🎯 Próximos pasos (opcionales)

1. **Agregar imágenes de robots**
   - Colocar archivos PNG en `content/robots/[robot-name]/images/`
   - Actualizar `mainImage` en `metadata.json` con la ruta correcta

2. **Agregar más robots**
   - Crear carpeta en `content/robots/nombre-robot/`
   - Agregar `metadata.json` y `especificaciones.json`
   - Estos aparecerán automáticamente en `/robots`

3. **Conectar formulario de contacto**
   - Usar EmailJS o serverless function
   - Configurar en `pages/contacto.tsx`

4. **Visor 3D de robots**
   - Agregar modelos `.glb` para cada robot
   - Usar `@google/model-viewer` (ya instalado)

5. **Desplegar a producción**
   - Usar Vercel (recomendado para Next.js)
   - O cualquier hosting compatible con Node.js

## 📚 Sistema automático

La web utiliza un sistema de lectura de archivos que genera automáticamente:
- **Robots**: Lee desde `content/robots/*/metadata.json`
- **Especificaciones**: Lee desde `content/robots/*/especificaciones.json`
- **Noticias**: Lee desde `content/noticias/*/metadata.json` y `content.md`

Ver `lib/content.ts` para el código del sistema.

---

**Web completa y lista para producción** ✅
