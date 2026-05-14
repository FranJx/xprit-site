# ✅ Pre-Production Checklist

Antes de desplegar XTH a producción, verifica este checklist:

## 🔐 Seguridad

- [ ] JWT_SECRET en backend/.env es fuerte y único
- [ ] Cambiar NODE_ENV a "production" en backend/.env
- [ ] ALLOWED_ORIGINS solo incluye tu dominio
- [ ] No hay credenciales en código (verificar .gitignore)
- [ ] HTTPS/SSL está configurado
- [ ] Firewall solo permite puertos 80, 443, SSH

## 📦 Frontend

- [ ] `npm run build` se ejecuta sin errores
- [ ] `.env.production` tiene URL correcta del backend
- [ ] Carpeta `dist/` generada y lista para deploy
- [ ] Todos los links internos funcionan
- [ ] No hay console.error en dev tools

## 🔧 Backend

- [ ] `npm start` inicia sin errores
- [ ] Base de datos (PostgreSQL) está configurada
- [ ] DATABASE_URL apunta a BD de producción
- [ ] Seed ejecutado correctamente (si es necesario)
- [ ] Todos los endpoints responden correctamente

## 🌍 Servidor Web

- [ ] Nginx/Apache está instalado y configurado
- [ ] Rewrites están configurados para SPA
- [ ] CORS está habilitado correctamente
- [ ] Certificado SSL/TLS está instalado
- [ ] Headers de seguridad están configurados

## 📋 Verificación Final

### 1. Backend
```bash
curl https://tudominio.com/api/posts
# Debe retornar JSON válido
```

### 2. Frontend
```bash
# Abrir en navegador:
https://tudominio.com
# Debe cargar sin errores de CORS
```

### 3. Autenticación
```bash
# Intentar login
curl -X POST https://tudominio.com/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}'
# Debe retornar token JWT
```

## 🚨 Común Errores

| Error | Causa | Solución |
|-------|-------|----------|
| 404 Not Found | CORS misconfigured | Verificar ALLOWED_ORIGINS |
| Mixed Content | HTTP/HTTPS mixtos | Usar HTTPS en todo |
| 502 Bad Gateway | Backend no responde | Verificar PM2 status |
| Database error | Conexión fallida | Verificar DATABASE_URL |
| Empty page | Build no generado | Ejecutar npm run build |

## 📊 Performance

- [ ] Frontend minificado (revisar dist/ size)
- [ ] Imágenes optimizadas
- [ ] Cache headers configurados
- [ ] Gzip compression habilitado
- [ ] CDN configurado (opcional)

## 📝 Documentación

- [ ] README.md actualizado
- [ ] PRODUCTION_DEPLOYMENT.md completo
- [ ] Instrucciones de backup de BD
- [ ] Plan de rollback documentado
- [ ] Contacto de soporte definido

## 🔄 Monitoreo Continuo

Después del deployment:

- [ ] Monitorear logs diariamente
- [ ] Backups de BD cada 24 horas
- [ ] Actualizar dependencias mensualmente
- [ ] Revisar logs de error semanalmente
- [ ] Probar login/posts regularmente

## ✨ Optimizaciones Opcionales

- [ ] Implementar caching (Redis)
- [ ] CDN para imágenes (Cloudinary, etc.)
- [ ] Rate limiting
- [ ] Compresión de imágenes
- [ ] Lazy loading

---

**Estado**: Usar como template antes de cada deployment  
**Última revisión**: 2024
