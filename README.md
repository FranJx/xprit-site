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

El sitio incluye el **XTH (XpriT Robotics Hub)** como una subpágina en la ruta `/XTH`. Este es un hub social para la comunidad de robótica.

### Setup del XTH en Desarrollo Local

1. **Instalar dependencias del backend XTH:**
   ```bash
   cd xprit-robotics-hub/backend
   npm install
   cd ../..
   ```

2. **En una terminal separada, iniciar el XTH Backend:**
   ```bash
   cd xprit-robotics-hub/backend
   npm run dev
   ```
   El backend estará en `http://localhost:5000`

3. **Ejecutar Next.js:**
   ```bash
   npm run dev
   ```

4. **Acceder al XTH:**
   - `/XTH` - Landing page del hub
   - `/XTH/app` - Redirige a `/hub` que hace proxy a `http://localhost:5000`
   - `/hub` - Acceso directo al XTH (proxy interno)

### Cómo Funciona el Proxy

- **En desarrollo:** `next.config.js` redirige `/hub/*` a `http://localhost:5000/*`
- **En producción:** Usa `XTH_BACKEND_URL` environment variable
- El usuario siempre ve `xprit-robotics.com/hub` sin que cambie la URL

### Configuración en Railway

Para desplegar en Railway:

1. **Configurar variables de ambiente:**
   - `DATABASE_URL` - PostgreSQL en Railway
   - `JWT_SECRET` - Secreto para JWT
   - `CLOUDINARY_*` - Variables de Cloudinary
   - `XTH_BACKEND_URL=http://localhost:5000` - (opcional, valor por defecto)

2. **El deployment automático:**
   - Railway ejecuta `sh start.sh` que:
     1. Ejecuta migración de BD
     2. Inicia XTH Backend en puerto 5000 (background)
     3. Inicia Next.js en puerto 3000 (foreground)

3. **Rutas en producción:**
   - `https://xprit-robotics.com/XTH` - Landing page
   - `https://xprit-robotics.com/XTH/app` - Redirige a `/hub`
   - `https://xprit-robotics.com/hub` - Acceso al XTH (internamente proxeado a `:5000`)

### Rutas del XTH

- `/XTH` - Página de inicio y descripción del hub
- `/XTH/app` - Aplicación principal del hub (redirige a `/hub`)
- `/hub` - Acceso directo al XTH

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
