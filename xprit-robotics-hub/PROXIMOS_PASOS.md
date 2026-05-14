# 🎯 Próximos Pasos - Instrucciones para el Usuario

## Hola 👋

Has completado la preparación de XTH para producción. Aquí está lo que necesitas hacer ahora:

## 📍 Tu Situación Actual

✅ **Completado:**
- Código frontend con URLs dinámicas (variables de entorno)
- Código backend con CORS configurable
- Documentación completa de despliegue
- Archivos de configuración listos

❌ **Falta:**
- Acceso a tu servidor web (hosting)
- Dominio configurado
- Base de datos PostgreSQL (opcional pero recomendado)

## 🚀 Pasos para Desplegar

### Paso 1: Preparar tu Servidor

1. **Accede a tu hosting/servidor por SSH**
   ```bash
   ssh usuario@tuservidor.com
   ```

2. **Crea una carpeta para el proyecto**
   ```bash
   mkdir -p /var/www/xth
   cd /var/www/xth
   ```

3. **Descarga o sube la carpeta `xprit-robotics-hub`**
   ```bash
   # Opción 1: Con Git
   git clone <tu-repo-url>
   
   # Opción 2: Con SCP
   scp -r /ruta/local/xprit-robotics-hub usuario@servidor:/var/www/xth/
   ```

### Paso 2: Configurar Backend

```bash
cd /var/www/xth/backend

# 1. Instalar dependencias
npm install

# 2. Crear archivo .env para producción
cat > .env << 'EOF'
PORT=3000
NODE_ENV=production
DATABASE_URL=sqlite:./xth.db
JWT_SECRET=TU_SECRETO_LARGO_Y_ALEATORIO_AQUI_123!@#$%^&*
ALLOWED_ORIGINS=https://tudominio.com,https://www.tudominio.com
EOF

# 3. Llenar base de datos (si es la primera vez)
npm run seed

# 4. Iniciar con PM2
npm install -g pm2
pm2 start npm --name "xth-backend" -- start
pm2 save
```

### Paso 3: Configurar Frontend

```bash
cd /var/www/xth/frontend

# 1. Instalar dependencias
npm install

# 2. Actualizar .env.production con tu URL
cat > .env.production << 'EOF'
VITE_API_URL=https://api.tudominio.com
# O si el backend está en el mismo servidor:
# VITE_API_URL=https://tudominio.com/api
EOF

# 3. Build para producción
npm run build

# 4. Copiar a servidor web (Apache/Nginx)
# Para Apache:
cp -r dist/* /var/www/html/xth/

# Para Nginx:
cp -r dist/* /usr/share/nginx/html/xth/
```

### Paso 4: Configurar Servidor Web

#### Para Nginx:

```bash
# Crear archivo de configuración
sudo nano /etc/nginx/sites-available/xth

# Pegar esta configuración:
```

```nginx
server {
    listen 443 ssl http2;
    server_name tudominio.com www.tudominio.com;

    # Certificados SSL
    ssl_certificate /etc/ssl/certs/cert.crt;
    ssl_certificate_key /etc/ssl/private/key.key;

    # Frontend SPA
    location / {
        root /usr/share/nginx/html/xth;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:3000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Redirigir HTTP a HTTPS
server {
    listen 80;
    server_name tudominio.com www.tudominio.com;
    return 301 https://$server_name$request_uri;
}
```

```bash
# Habilitar sitio
sudo ln -s /etc/nginx/sites-available/xth /etc/nginx/sites-enabled/
sudo nginx -t  # Verificar configuración
sudo systemctl restart nginx
```

#### Para Apache:

```bash
# Crear archivo de configuración
sudo nano /etc/apache2/sites-available/xth.conf
```

```apache
<VirtualHost *:443>
    ServerName tudominio.com
    ServerAlias www.tudominio.com
    
    DocumentRoot /var/www/html/xth
    
    SSLEngine on
    SSLCertificateFile /etc/ssl/certs/cert.crt
    SSLCertificateKeyFile /etc/ssl/private/key.key
    
    <Directory /var/www/html/xth>
        RewriteEngine On
        RewriteBase /
        RewriteRule ^index\.html$ - [L]
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule . /index.html [L]
    </Directory>
    
    ProxyPass /api/ http://localhost:3000/api/
    ProxyPassReverse /api/ http://localhost:3000/api/
</VirtualHost>

<VirtualHost *:80>
    ServerName tudominio.com
    ServerAlias www.tudominio.com
    Redirect / https://tudominio.com/
</VirtualHost>
```

```bash
# Habilitar sitio y módulos
sudo a2enmod rewrite
sudo a2enmod proxy
sudo a2enmod proxy_http
sudo a2ensite xth
sudo apache2ctl configtest
sudo systemctl restart apache2
```

### Paso 5: SSL/HTTPS

```bash
# Instalar Certbot (Let's Encrypt - GRATUITO)
sudo apt-get install certbot python3-certbot-nginx
# o para Apache:
sudo apt-get install certbot python3-certbot-apache

# Generar certificado
sudo certbot certonly --nginx -d tudominio.com -d www.tudominio.com
# o para Apache:
sudo certbot certonly --apache -d tudominio.com -d www.tudominio.com

# Auto-renovación
sudo systemctl enable certbot.timer
```

## ✅ Verificación

Una vez todo está deployado, verifica:

```bash
# 1. Backend responde
curl https://tudominio.com/api/posts

# 2. Frontend carga (en navegador)
# Abre: https://tudominio.com

# 3. Login funciona
# Intenta login con: lena@example.com / password123

# 4. Backend logs
pm2 logs xth-backend
```

## 🆘 Problemas Comunes

### Error 404 en API
- ✅ Verificar que backend está corriendo: `pm2 status`
- ✅ Verificar ALLOWED_ORIGINS en backend/.env
- ✅ Ver logs: `pm2 logs xth-backend`

### CORS Error en navegador
- ✅ Actualizar ALLOWED_ORIGINS con tu dominio exacto
- ✅ Reiniciar backend: `pm2 restart xth-backend`

### Frontend carga pero no funciona
- ✅ Abre F12 → Console
- ✅ Revisar errores de red
- ✅ Verificar que VITE_API_URL está correcto en .env.production

### SSL Certificate Error
- ✅ Verificar ruta de certificados
- ✅ Asegurar que los permisos son correctos
- ✅ `sudo certbot renew --dry-run`

## 📞 Cuando Necesites Ayuda

Una vez que hayas:
1. ✅ Subido la carpeta a tu servidor
2. ✅ Configurado .env files
3. ✅ Deployado frontend y backend
4. ✅ Configurado el servidor web (Nginx/Apache)

**Llámame desde la pestaña de producción** y te ayudaré con:
- Debugging de errores específicos
- Optimizaciones
- Mejoras de performance
- Nuevas features

## 📚 Documentación Referencia

- [PRODUCTION_DEPLOYMENT.md](./PRODUCTION_DEPLOYMENT.md) - Guía detallada completa
- [PRODUCTION_CHECKLIST.md](./PRODUCTION_CHECKLIST.md) - Verificaciones antes de ir live
- [frontend/ENV_CONFIG.md](./frontend/ENV_CONFIG.md) - Variables de entorno
- [README.md](./README.md) - Descripción general del proyecto

## 🎉 ¡Lo Hiciste!

Tu aplicación XTH está lista para producción. 

**Recordar:**
- El código funciona tanto en desarrollo como en producción
- Cambiar `JWT_SECRET` es importante por seguridad
- Hacer backups de la BD regularmente
- Monitorear logs

---

**¿Listo para desplegar?** 🚀

Cuando termines de seguir estos pasos y encuentres problemas, **llámame desde tu navegador en la URL de producción** (https://tudominio.com) y te ayudaré a resolver cualquier inconveniente.

**¡Mucho éxito! 🎊**
