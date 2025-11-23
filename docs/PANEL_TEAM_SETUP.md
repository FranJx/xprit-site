# Team Panel Setup - Completado

## Estado Actual ✓

El panel de equipo ha sido completamente implementado con los siguientes componentes:

### 1. **Autenticación**
- **Archivo:** `pages/team/login.tsx`
- Página de login para miembros del equipo
- Almacena token JWT en localStorage
- Redirige a `/team/panel` después del login

**Usuarios disponibles:**
- `fran` (admin) - password: fran
- `miembro1` - password: pass1
- `miembro2` - password: pass2
- `miembro3` - password: pass3
- `miembro4` - password: pass4
- `miembro5` - password: pass5

### 2. **Panel de Envío** (Para miembros del equipo)
- **Archivo:** `pages/team/panel.tsx`
- Formulario completo para enviar datos de robots
- Campos:
  - Nombre del robot (requerido)
  - Slug (auto-generado del nombre)
  - Categoría (requerida)
  - Batería, Motores, Año de creación
  - Descripción
  - Imagen principal (requerida) - carga a Cloudinary
  - Fotos adicionales (hasta 10)

### 3. **Panel de Administración** (Solo para Fran)
- **Archivo:** `pages/team/admin.tsx`
- Acceso solo para usuario `fran`
- Ver todos los envíos (pendientes, aprobados, rechazados)
- Filtrar por estado
- Vista detallada de cada robot
- Aprobar o rechazar envíos con comentarios

### 4. **APIs**

#### `/api/auth/login.ts`
- POST: Autenticar usuario y generar JWT token
- Token expira en 30 días
- Marca si el usuario es admin

#### `/api/robots/submit.ts`
- POST: Enviar nuevo robot
- Requiere: token JWT válido
- Guarda en PostgreSQL con estado "pending"

#### `/api/robots/pending.ts`
- GET: Obtener todos los robots
- Requiere: token JWT válido y usuario admin
- Retorna: Todos los robots (pendientes, aprobados, rechazados)

#### `/api/robots/approve.ts`
- POST: Aprobar un robot
- Requiere: token JWT válido y usuario admin
- Marca el robot como "approved"
- Próximo paso: Auto-commit a GitHub (TODO)

#### `/api/robots/reject.ts`
- POST: Rechazar un robot
- Requiere: token JWT válido y usuario admin
- Marca el robot como "rejected"

### 5. **Base de Datos**

**PostgreSQL en Railway:**
- Host: `postgres.railway.internal`
- Puerto: 5432
- Base de datos: `railway`
- Usuario: `postgres`

**Tabla: `RobotSubmission`**
```sql
- id: String (cuid) - PK
- name: String
- slug: String (UNIQUE)
- battery: String
- category: String
- motors: String
- yearCreated: Int
- description: Text
- mainImage: String (URL Cloudinary)
- photos: String[] (URLs Cloudinary)
- status: String (pending/approved/rejected)
- comments: Text
- submittedBy: String
- submittedAt: DateTime
- reviewedAt: DateTime
- reviewedBy: String
- createdAt: DateTime
- updatedAt: DateTime
```

### 6. **Almacenamiento de Imágenes**

**Cloudinary:**
- Cloud: `tu-cloud-name` (configurar en `.env.local`)
- Folder: `xprit_robots/submissions`
- Max size: 20MB por imagen
- Limite gratis: 25GB/mes

## Próximas Acciones

### A. Completar Migración de Base de Datos
Cuando estés en una conexión estable a Railway, ejecutar:
```bash
npx prisma db push
```

### B. Configurar Upload Preset en Cloudinary
1. Ve a [Cloudinary Dashboard](https://cloudinary.com/console/settings/upload)
2. En "Upload presets", crea uno llamado `xprit_robots`
3. Settings:
   - Folder: `xprit_robots/submissions`
   - Auto-tag: robots
   - Signed: No (para uso frontend)

### C. Integración de GitHub Auto-Commit
Cuando un robot sea aprobado:
1. Crear archivo `metadata.json` en `/content/robots/[slug]/`
2. Guardar metadata del robot
3. Eliminar imágenes principales de `/public/images/` (mantener las de Cloudinary)
4. Hacer commit automático

**Requiere:**
- GitHub Personal Access Token
- Guardar en `.env.local` como `GITHUB_TOKEN`

### D. Interfaz de Usuario
- Login: `http://localhost:3000/team/login`
- Panel: `http://localhost:3000/team/panel` (solo después de login)
- Admin: `http://localhost:3000/team/admin` (solo para fran)

## Ambiente (.env.local)

⚠️ **IMPORTANTE:** Este archivo NO debe subirse a GitHub

```
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=tu-cloud-name
CLOUDINARY_API_KEY=tu-api-key
CLOUDINARY_API_SECRET=tu-api-secret
JWT_SECRET=tu-jwt-secret-seguro
DATABASE_URL=postgresql://user:password@host:port/database
TEAM_USERS_JSON=[{"username":"fran","password":"tu-password","isAdmin":true},...]
```

Configurar correctamente con tus valores en `.env.local` (no en GitHub)

## Notas de Seguridad

⚠️ **CRÍTICO:**
1. **NUNCA subir `.env.local` a GitHub** (ya está en .gitignore)
2. **Cambiar todas las credenciales** de las plantillas por valores únicos
3. **Credentials de Cloudinary:** La API Key es pública, pero el Secret NO
4. **JWT_SECRET:** En producción, usar un valor único y muy seguro
5. **Contraseñas del equipo:** Solo en `.env.local`, nunca en código
6. **DATABASE_URL:** Contiene contraseña, mantener privada

Ver `docs/SECURITY.md` para más detalles sobre protección de datos sensibles.

## Estructura de Carpetas Creadas

```
pages/
├── team/
│   ├── login.tsx       ← Login page
│   ├── panel.tsx       ← Envío de robots
│   └── admin.tsx       ← Panel admin
└── api/
    └── robots/
        ├── submit.ts   ← Guardar envío
        ├── pending.ts  ← Obtener robots
        ├── approve.ts  ← Aprobar robot
        └── reject.ts   ← Rechazar robot

lib/
└── prisma.ts          ← Cliente Prisma singleton

prisma/
└── schema.prisma      ← Esquema de BD

.env                   ← Variables para Prisma CLI
.env.local             ← Variables para Next.js
```

## Troubleshooting

### Error: "Can't reach database server"
- Verifica que Railway PostgreSQL esté corriendo
- Confirma la URL en `.env` y `.env.local`
- Prueba conexión desde psql o Postico

### Error: "Invalid token"
- Asegúrate de que el token JWT no ha expirado (30 días)
- Vuelve a hacer login

### Las imágenes no cargan en Cloudinary
- Confirma que creaste el Upload Preset `xprit_robots`
- Verifica las credenciales en `.env.local`
- Revisa la consola del navegador para errores

### admin.tsx no carga
- Solo usuario `fran` puede acceder
- Verifica que estés logueado como `fran`
- Revisa localStorage en DevTools

## Flujo Completo

1. **Team Member:**
   - Visita `/team/login`
   - Login con sus credenciales
   - Completa formulario en `/team/panel`
   - Sube imágenes a Cloudinary
   - Envía datos a PostgreSQL

2. **Admin (fran):**
   - Visita `/team/admin`
   - Ve lista de robots pendientes
   - Selecciona robot para revisar
   - Aprueba o rechaza con comentarios
   - ✓ Aprobado → Guardar en GitHub + eliminar de PostgreSQL
   - ✗ Rechazado → Eliminar de PostgreSQL

3. **Public Site:**
   - Robot aprobado aparece en `/robots`
   - Muestra galería de imágenes de Cloudinary
   - Metadatos desde `/content/robots/[slug]/metadata.json`

---

**Última actualización:** 22 de Noviembre de 2025
