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

3. **Acceder al XTH:**
   - Abre `http://localhost:3000/XTH` en tu navegador
   - Haz clic en "Entrar al Hub" que te redirigirá a `http://localhost:5000`

### Configuración en Railway

Para desplegar en Railway con el XTH integrado:

1. **Configurar variables de ambiente en Railway:**
   - `DATABASE_URL` - PostgreSQL en Railway
   - `JWT_SECRET` - Secreto para JWT
   - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` - Para manejo de imágenes

2. **El deployment automático:**
   - Railway detectará `railway.json`
   - Ejecutará `sh start.sh` que:
     - Inicia el XTH Backend en puerto 5000
     - Inicia Next.js en puerto 3000

3. **URL en producción:**
   - Sitio principal: `https://xprit-robotics.com`
   - XTH landing page: `https://xprit-robotics.com/XTH`
   - XTH aplicación: `https://xprit-robotics.com/XTH/app` → redirige a `https://xprit-robotics.com:5000`

### Rutas del XTH

- `/XTH` - Página de inicio y descripción del hub
- `/XTH/app` - Aplicación principal del hub (redirige al backend en puerto 5000)

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
