# Configuración de Variables de Entorno - Frontend

Este documento explica cómo están configuradas las variables de entorno en el frontend de XTH.

## 📦 Estructura de Variables

### Desarrollo (.env)
El archivo `frontend/.env` se usa cuando ejecutas `npm run dev`:

```env
VITE_API_URL=http://localhost:3000
```

Este apunta al backend local en el puerto 3000.

### Producción (.env.production)
El archivo `frontend/.env.production` se usa cuando ejecutas `npm run build`:

```env
VITE_API_URL=https://api.tudominio.com
```

Puedes cambiar esta URL a tu dominio actual.

## 🔧 Cómo Usar

### Desarrollo Local
```bash
cd frontend
npm install
npm run dev
```

Esto abre la aplicación en `http://localhost:5173` y se conecta a `http://localhost:3000`.

### Build para Producción
```bash
cd frontend
npm run build
```

La carpeta `dist/` contiene los archivos optimizados listos para desplegar.

**Nota**: Antes de hacer build, asegúrate de actualizar `VITE_API_URL` en `.env.production` con tu URL real de backend.

## 📝 Archivos Afectados

Los siguientes componentes usan la variable `API_URL`:

- `src/context/AuthContext.jsx` - Login/Register
- `src/components/Feed.jsx` - Obtener posts
- `src/components/Explore.jsx` - Búsqueda de usuarios y posts
- `src/components/Community.jsx` - Listar usuarios
- `src/components/UserProfile.jsx` - Obtener perfil y posts
- `src/components/Post.jsx` - Like/Comment
- `src/components/CreatePostModal.jsx` - Crear posts
- `src/components/CreatePost.jsx` - Crear posts (alternativo)
- `src/components/EditProfileModal.jsx` - Actualizar perfil
- `src/components/RightPanel.jsx` - Búsqueda global

## 🚀 Despliegue a Producción

1. **Actualizar .env.production** con tu URL real:
   ```env
   VITE_API_URL=https://tudominio.com/api
   # o
   VITE_API_URL=https://api.tudominio.com
   ```

2. **Hacer build**:
   ```bash
   npm run build
   ```

3. **Copiar `dist/` a servidor web**:
   ```bash
   scp -r dist/* usuario@servidor:/var/www/html/xth/
   ```

4. **Verificar en navegador**: `https://tudominio.com`

## 🔍 Debugging

Para verificar qué URL usa tu aplicación en producción:

1. Abre la consola del navegador (F12)
2. En el Network tab, revisa cualquier solicitud a `/api/`
3. Debería mostrar la URL completa (ej: `https://api.tudominio.com/api/posts`)

Si ve `localhost:3000`, es que la aplicación se está ejecutando en modo desarrollo.

## 📚 Referencias

- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [¿Cómo funcionan las variables en Vite?](https://vitejs.dev/guide/env-and-mode.html#env-files)

---
**Última actualización**: 2024
