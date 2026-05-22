# Gestión Torneo COPAS — Scaffolding

Este repositorio contiene un scaffolding inicial para la plataforma de gestión de torneos.

Backend (Express + Socket.IO + PostgreSQL)

- Carpeta: `server`
- Variables de entorno: copiar `server/.env.example` a `server/.env` y ajustar `DATABASE_URL` y `JWT_SECRET`.
- Para levantar PostgreSQL localmente se incluye `docker-compose.yml`.

Frontend (React + Vite)

- Carpeta: `client`

Instrucciones rápidas (Windows / PowerShell):

1. Levantar la base de datos:

```powershell
docker-compose up -d
```

2. Backend (en otra terminal):

```powershell
cd "c:\Users\Fran\Documents\gestion Torneo COPAS\server"
npm install
cp .env.example .env
# editar .env si hace falta
npm run dev
```

3. Frontend:

```powershell
cd "c:\Users\Fran\Documents\gestion Torneo COPAS\client"
npm install
npm run dev
```

4. Inicializar la base de datos (ejecutar migraciones):

```powershell
cd "c:\Users\Fran\Documents\gestion Torneo COPAS\server"
npm install
node init-db.js
```

Próximos pasos: ya hay endpoints para registrar equipos, generar llaves, controlar puntajes y una interfaz de Stream básica. Falta pulir roles/permiso y agregar pruebas.

Overlay (para OBS)
- Hay una página dedicada `client/overlay.html` pensada para usarse como Browser Source en OBS.
- URL durante desarrollo: `http://localhost:5173/overlay.html` (asumiendo `vite` en `5173`).

Consejos para OBS (evitar que el frame "desaparezca"):
- En la escena de OBS, añade una fuente de tipo "Browser" → `Create new`.
- En `URL` pega `http://localhost:5173/overlay.html`.
- Ajusta `Width`/`Height` según la resolución del stream (ej. 1920x1080).
- Important: desactiva `Shutdown source when not visible` (o `Unload when not visible`) para que la página no se cierre automáticamente al cambiar escenas.
- Desactiva `Refresh browser when scene becomes active` si querés mantener el estado entre cambios de escena.

Si la página queda en blanco o "desaparece":
- Verificá que `npm run dev` del cliente esté corriendo y accessible en `localhost:5173`.
- Asegurate de usar la URL HTTP correcta, no un `file://` local.

