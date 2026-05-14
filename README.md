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

### Configuración de XTH

Para que el XTH funcione correctamente, necesitas configurar la variable de ambiente:

```env
NEXT_PUBLIC_XTH_URL=http://localhost:5173
```

- **Desarrollo**: Usa `http://localhost:5173` (puerto por defecto de Vite)
- **Producción**: Configura la URL donde esté hosteado el XTH frontend

Agrega esta variable a tu archivo `.env.local`:

```
NEXT_PUBLIC_XTH_URL=http://localhost:5173
```

### Rutas del XTH

- `/XTH` - Página de inicio y descripción del hub
- `/XTH/app` - Aplicación principal del hub (requiere `NEXT_PUBLIC_XTH_URL` configurado)

Siguientes pasos sugeridos:
- Añadir modelos .glb en `public/demo-models/`.
- Crear contenidos para `pages/robots` y `pages/noticias`.
- Configurar CMS (Sanity / Strapi) si desean editar noticias desde UI.
- Desplegar el XTH frontend y configurar `NEXT_PUBLIC_XTH_URL` en producción.
