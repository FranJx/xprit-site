# XpriT Robotics Hub - Guía de Implementación en Producción

Este documento proporciona los pasos necesarios para desplegar XTH (XpriT Robotics Hub) en un servidor de producción.

## 📋 Requisitos Previos

- Node.js 18 LTS o superior
- PostgreSQL 13 o superior (opcional, para mejor rendimiento que SQLite)
- npm o yarn
- Acceso a un servidor web (Apache, Nginx, etc.)
- Terminal/CLI access

## 🚀 Pasos de Implementación

### 1. Preparar el Servidor

1. Copiar la carpeta `xprit-robotics-hub` completa a tu servidor web
2. Navegar al directorio raíz del proyecto

```bash
cd /ruta/del/servidor/xprit-robotics-hub
```

### 2. Backend - Configuración

#### 2.1 Instalar dependencias
```bash
cd backend
npm install
```

#### 2.2 Crear archivo .env
En `backend/.env`, configurar las variables de entorno:

```env
# Base de datos
DATABASE_URL=postgresql://usuario:contraseña@localhost:5432/xth_produccion
# O para SQLite en producción (no recomendado):
# DATABASE_URL=sqlite:./xth_prod.db

# JWT
JWT_SECRET=tu_secreto_jwt_muy_largo_y_seguro_aqui

# NODE_ENV
NODE_ENV=production

# CORS
ALLOWED_ORIGINS=https://tudominio.com,https://www.tudominio.com

# Puerto
PORT=3000
```

#### 2.3 Inicializar base de datos
```bash
npm run migrate
# o si usas seed:
npm run seed
```

#### 2.4 Iniciar servidor
```bash
npm start
# o para modo producción:
NODE_ENV=production npm start
```

El backend debe estar corriendo en `http://localhost:3000` en el servidor.

### 3. Frontend - Configuración

#### 3.1 Instalar dependencias
```bash
cd ../frontend
npm install
```

#### 3.2 Crear archivo .env.production
En `frontend/.env.production`, configurar:

```env
VITE_API_URL=https://tudominio.com/api
# o si el backend está en un puerto específico:
VITE_API_URL=https://api.tudominio.com
```

#### 3.3 Construir para producción
```bash
npm run build
```

Esto genera una carpeta `dist/` con los archivos optimizados.

#### 3.4 Desplegar los archivos
Copiar el contenido de `frontend/dist/` a la carpeta pública del servidor web (ej: `/var/www/html/xth/` en Apache o `/usr/share/nginx/html/xth/` en Nginx).

### 4. Configuración del Servidor Web

#### Apache (.htaccess)
Crear archivo `.htaccess` en la raíz del frontend:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /xth/
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /xth/index.html [L]
</IfModule>
```

#### Nginx (server block)
```nginx
server {
    listen 443 ssl http2;
    server_name tudominio.com www.tudominio.com;

    ssl_certificate /ruta/a/certificado.crt;
    ssl_certificate_key /ruta/a/clave.key;

    # Frontend
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
        
        # CORS headers
        add_header 'Access-Control-Allow-Origin' 'https://tudominio.com';
        add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS';
        add_header 'Access-Control-Allow-Headers' 'Content-Type, Authorization';
    }

    # Redirect HTTP to HTTPS
    error_page 497 https://$server_name$request_uri;
}

server {
    listen 80;
    server_name tudominio.com www.tudominio.com;
    return 301 https://$server_name$request_uri;
}
```

### 5. SSL/HTTPS

#### Opción A: Let's Encrypt con Certbot
```bash
sudo apt-get install certbot python3-certbot-apache
sudo certbot certonly --apache -d tudominio.com -d www.tudominio.com
```

#### Opción B: Certificado manual
Copiar el certificado y clave privada a `/etc/ssl/certs/` y configurar en Apache/Nginx.

### 6. Variables de Entorno en Backend

Asegurar que el archivo `backend/.env` tenga:

```env
# CORS - Permitir solo tu dominio
ALLOWED_ORIGINS=https://tudominio.com,https://www.tudominio.com

# Base de datos - Usar PostgreSQL en producción
DATABASE_URL=postgresql://usuario:contraseña@localhost:5432/xth_db

# Seguridad
JWT_SECRET=GenerarContraseñaMuySeguraAqui123!@#
JWT_EXPIRE=7d

NODE_ENV=production
PORT=3000
```

### 7. Process Manager (PM2)

Para mantener el backend corriendo en segundo plano:

```bash
# Instalar PM2 globalmente
npm install -g pm2

# En backend/:
pm2 start npm --name "xth-backend" -- start

# Ver logs
pm2 logs xth-backend

# Configurar para que inicie al arrancar
pm2 startup
pm2 save
```

### 8. Verificación

1. **Backend**: 
   ```bash
   curl https://tudominio.com/api/posts
   ```
   Debe retornar un JSON con posts.

2. **Frontend**: 
   Abrir `https://tudominio.com` en el navegador.

3. **Logs**: 
   ```bash
   tail -f /var/log/apache2/access.log
   # o para Nginx:
   tail -f /var/log/nginx/access.log
   ```

## 🔐 Checklist de Seguridad

- [ ] JWT_SECRET es una contraseña fuerte y aleatoria
- [ ] ALLOWED_ORIGINS está configurado solo con tu dominio
- [ ] SSL/HTTPS está habilitado
- [ ] Firewall solo permite puertos 80, 443, y SSH
- [ ] Cambiar contraseña de usuario del servidor
- [ ] Respaldar base de datos regularmente
- [ ] Monitorear archivos de log

## 🆘 Solución de Problemas

### El frontend no carga
- Verificar que `frontend/.env.production` tiene la URL correcta
- Confirmar que `npm run build` se ejecutó
- Ver console del navegador para errores de CORS

### El backend no responde
- Verificar que `npm start` está corriendo
- Ver logs: `npm logs`
- Confirmar que el puerto 3000 está abierto

### Error de conexión a base de datos
- Verificar DATABASE_URL en `.env`
- Confirmar que PostgreSQL está corriendo
- Respetar los permisos de usuario/contraseña

## 📞 Contacto y Soporte

Para más información, consulta la documentación en el archivo `README.md`.

---
**Última actualización**: 2024
**Versión XTH**: 1.0.0
