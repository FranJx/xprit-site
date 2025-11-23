# 🔒 Guía de Seguridad - Panel de Equipo

## Datos Sensibles ¿Dónde Guardarlos?

### ✅ SEGURO (En `.env.local` - NO se sube a GitHub)
```
.env.local ← Nunca subir a GitHub
├── JWT_SECRET
├── DATABASE_URL
├── CLOUDINARY credenciales
└── TEAM_USERS_JSON (contraseñas)
```

### ❌ NUNCA EN CÓDIGO
```
❌ Hardcodear credenciales en archivos .ts/.js
❌ Subir .env.local a GitHub
❌ Poner secretos en logs
❌ Exposer datos en URLs públicas
```

## Configuración Segura

### 1. Variables de Ambiente
Todas las credenciales van en `.env.local`:

```env
# Cloudinary (credenciales limitadas de upload)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx

# JWT (cambiar en producción)
JWT_SECRET=algo-muy-seguro-y-largo

# Database (contraseña de Railway)
DATABASE_URL=postgresql://user:password@host:port/db

# Usuarios del equipo (JSON)
TEAM_USERS_JSON=[{"username":"fran","password":"xxx","isAdmin":true}]
```

### 2. Archivo `.env.example` (SÍ se sube a GitHub)
```env
# Plantilla para que otros clonen
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=tu-cloud-name
CLOUDINARY_API_KEY=tu-api-key
# ... etc
```

### 3. `.gitignore` (protege archivos locales)
```
.env                          ← NO subir
.env.local                    ← NO subir
.env.*.local                  ← NO subir
.env.production               ← NO subir
public/content/robots/submissions/  ← NO subir (imágenes temporales)
```

## Credenciales por Servicio

### Cloudinary
- **API Key:** Pública (se puede exponer)
- **API Secret:** PRIVADA (nunca exponer)
- **Upload Preset:** Se puede dejar público si es de "upload only"
- **Ubicación:** `.env.local` ✅

### Railway (PostgreSQL)
- **DATABASE_URL:** PRIVADA (contiene contraseña)
- **Ubicación:** `.env.local` ✅
- **En Dashboard:** Generar nueva conexión si se expone

### JWT
- **JWT_SECRET:** PRIVADA (firmar tokens)
- **Ubicación:** `.env.local` ✅
- **En Producción:** Cambiar a un valor único y seguro

### Contraseñas de Equipo
- **TEAM_USERS_JSON:** PRIVADA (usuarios y contraseñas)
- **Ubicación:** `.env.local` SOLO ✅
- **Nunca:** Hardcodear en código

## Proceso Seguro de Deployment

### En Local (Desarrollo)
```
1. Clonar repo
2. Copiar .env.example → .env.local
3. Completar con valores reales (locales)
4. npm install
5. npm run dev
```

### En Railway/Producción
```
1. NO usar .env.local
2. Configurar variables en Railway Dashboard:
   - JWT_SECRET
   - DATABASE_URL (Railway lo genera)
   - TEAM_USERS_JSON
   - CLOUDINARY_*
3. Railway automáticamente usa variables
4. No subir código con secretos
```

## Auditoría de Seguridad

### Checkear antes de hacer commit:
```bash
# Ver qué archivos se van a subir
git status

# Buscar contraseñas en el código
grep -r "password" --include="*.ts" --include="*.js"
grep -r "secret" --include="*.ts" --include="*.js"

# Confirmar .env.local NO aparece
cat .gitignore | grep ".env"
```

### Si accidentalmente subes credenciales:
```bash
# 1. INMEDIATAMENTE: Cambiar todas las credenciales
# 2. En GitHub: Settings → Secrets (revocar tokens)
# 3. En Railway: Resetear DATABASE_URL
# 4. En Cloudinary: Revocar API keys
# 5. Hacer clean history en Git
```

## Checklist de Seguridad ✓

- [ ] `.env.local` está en `.gitignore`
- [ ] No hay credenciales hardcodeadas en `*.ts` o `*.js`
- [ ] Contraseñas vienen solo de `TEAM_USERS_JSON`
- [ ] JWT_SECRET está en `.env.local`
- [ ] DATABASE_URL está en `.env.local`
- [ ] Cloudinary secrets están en `.env.local`
- [ ] `.env.example` NO tiene valores reales
- [ ] No hay logs mostrando secretos
- [ ] URLs públicas NO exponen credenciales

## En Caso de Exposición

Si se expone una credencial:

1. **JWT_SECRET expuesto:**
   - Cambiar en `.env.local`
   - Todos los tokens antiguos se invalidan
   - Los usuarios deben re-hacer login

2. **DATABASE_URL expuesto:**
   - Ir a Railway → PostgreSQL → generar nueva URL
   - Actualizar en `.env.local`
   - Redeploy en Railway

3. **Cloudinary Secret expuesto:**
   - Dashboard → API Keys → Regenerate
   - Actualizar en `.env.local`

4. **TEAM_USERS_JSON expuesto:**
   - Cambiar contraseñas en `.env.local`
   - Todos deben hacer re-login

---

**Última revisión:** 22 de Noviembre de 2025
**Responsable:** Fran (Admin)
