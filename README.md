# XpriT Robotics — Sitio web

Scaffold inicial para el sitio de XpriT Robotics.

Quick start:

1. Abrir terminal en `xprit-site`.
2. Instalar dependencias:

```powershell
npm install
```

3. Ejecutar en modo desarrollo:

```powershell
npm run dev
```

Estructura básica creada: Next.js + TypeScript + Tailwind + ejemplo de visor 3D (`model-viewer`).

## XTH - XpriT Robotics Hub

El sitio incluye el **XTH (XpriT Robotics Hub)** como una SPA (Single Page Application) completamente **frontend**. Es una red social para la comunidad de robótica que se ejecuta completamente en el navegador del usuario.

### Setup del XTH en Desarrollo Local

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Ejecutar en desarrollo:**
   ```bash
   npm run dev
   ```

3. **Acceder al XTH:**
   - `/XTH` - Landing page del hub
   - `/XTH/app` - Redirige a `/hub`
   - `/hub` - Acceso directo a la SPA del XTH

**Nota:** En desarrollo, `/hub` redirige a `http://localhost:5173` (Vite dev server) del frontend del XTH si está corriendo por separado.

### Cómo Funciona en Producción

- El **frontend React del XTH** se compila a archivos estáticos durante el build
- Los archivos se copian a `public/hub/`
- Next.js los sirve desde `/hub` sin necesidad de un servidor backend separado
- Es una **SPA completamente offline-first** que se ejecuta en el navegador del usuario

### Deployment en Railway

1. **Configurar variables de ambiente (si es necesario):**
   - `DATABASE_URL` - Para el sitio principal de Next.js (robots, noticias, etc)
   - `JWT_SECRET` - Para autenticación del panel admin
   - `CLOUDINARY_*` - Para manejo de imágenes

2. **El build automático:**
   ```bash
   npm run build
   # Esto:
   # 1. Compila Next.js
   # 2. Compila el frontend del XTH (React/Vite) a static files
   # 3. Copia los archivos a public/hub/
   ```

3. **El start automático:**
   ```bash
   npm start
   # Esto:
   # 1. Ejecuta migración de BD
   # 2. Inicia Next.js que sirve todo (main site + XTH)
   ```

### Estructura

- `/XTH` - Página landing del XTH (Next.js)
- `/XTH/app` - Punto de entrada a la SPA (redirige a `/hub`)
- `/hub` - **SPA completa del XTH** (archivos estáticos compilados)
- `public/hub/` - Archivos estáticos del XTH compilado

### Rutas

- `/XTH` - Landing page
- `/XTH/app` - Redirección a `/hub`
- `/hub` - Aplicación principal del XTH (SPA completamente frontend)

## Scripts disponibles

```bash
npm run dev        # Desarrollo (Next.js)
npm run build      # Build (Next.js + XTH Frontend)
npm run start      # Producción (ejecuta start.sh)
npm run migrate    # Migrar base de datos
npm run lint       # Lint con Next.js
```

Siguientes pasos sugeridos:
- Añadir modelos .glb en `public/demo-models/`.
- Crear contenidos para `pages/robots` y `pages/noticias`.
- Configurar CMS (Sanity / Strapi) si desean editar noticias desde UI.
- Desplegar el XTH frontend y configurar `NEXT_PUBLIC_XTH_URL` en producción.
