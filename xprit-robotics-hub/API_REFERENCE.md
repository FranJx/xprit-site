# 🚀 XTH Backend - Documentación de APIs

**Backend corriendo en:** `http://localhost:3000`  
**Frontend corriendo en:** `http://localhost:5174`

---

## 📊 Modelos de Base de Datos

### **Users**
- `username` - Nombre único de usuario
- `email` - Email único
- `firstName`, `lastName` - Nombre completo
- `password` - Hasheada con bcrypt
- `bio` - Biografía
- `avatar` - URL de imagen
- `coverImage` - Imagen de portada
- `location` - Ubicación
- `website` - Sitio web
- `isVerified` - ✅ Cuenta verificada
- `followerCount`, `followingCount`, `postCount` - Contadores

### **Posts**
- `userId` - Autor del post
- `title` - Título
- `description` - Descripción
- `image` - Imagen principal
- `images` - Array de imágenes adicionales
- `type` - `proyecto | remake | tip | tutorial | noticia`
- `remakeOf` - ID del post original (si es remake)
- `likeCount`, `commentCount`, `shareCount` - Contadores
- `visibility` - `public | private | followers`

### **Hashtags**
- `name` - Nombre del hashtag (ej: "ROS2")
- `usageCount` - Cuántas veces se usó

### **Relationships**
- **Follow** - Usuario sigue a usuario (con timestamps)
- **Like** - Usuario da like a post
- **Comment** - Comentarios en posts (con respuestas anidadas)
- **PostHashtag** - Relación muchos-a-muchos entre posts y hashtags

---

## 🔑 Endpoints de Usuarios

### Registrar Usuario
```bash
POST /api/users/register
{
  "username": "lenak",
  "email": "lena@example.com",
  "password": "password123",
  "firstName": "Lena",
  "lastName": "Kovač"
}
```

### Login
```bash
POST /api/users/login
{
  "email": "lena@example.com",
  "password": "password123"
}
```

### Obtener Perfil
```bash
GET /api/users/:id
```

### Actualizar Perfil
```bash
PUT /api/users/:id
{
  "firstName": "Lena",
  "lastName": "Kovač",
  "bio": "Ingeniera robótica",
  "location": "Eslovenia",
  "avatar": "https://..."
}
```

### Verificar Usuario (Admin)
```bash
PATCH /api/users/:id/verify
```

### Buscar Usuarios
```bash
GET /api/users/search?q=lena&limit=20&offset=0
```

---

## 📝 Endpoints de Posts

### Crear Post
```bash
POST /api/posts/:userId
{
  "title": "Mi primer proyecto robotico",
  "description": "Descripción detallada...",
  "image": "https://...",
  "images": ["https://...", "https://..."],
  "type": "proyecto",
  "hashtags": ["ROS2", "Python", "Impresión3D"],
  "remakeOf": null
}
```

### Obtener Posts (Feed)
```bash
GET /api/posts?limit=20&offset=0&type=proyecto&hashtag=ROS2
```

### Obtener Posts de un Usuario
```bash
GET /api/posts/user/:userId?limit=20&offset=0
```

### Obtener Post por ID
```bash
GET /api/posts/post/:postId
```

### Actualizar Post
```bash
PUT /api/posts/post/:postId
{
  "title": "Título actualizado",
  "description": "...",
  "hashtags": ["ROS2", "Python"]
}
```

### Eliminar Post
```bash
DELETE /api/posts/post/:postId
```

### Buscar por Hashtag
```bash
GET /api/posts/hashtag/ROS2?limit=20&offset=0
```

---

## 👥 Endpoints de Seguimiento

### Seguir Usuario
```bash
POST /api/follows/follow
{
  "followerId": 1,
  "followingId": 2
}
```

### Dejar de Seguir
```bash
POST /api/follows/unfollow
{
  "followerId": 1,
  "followingId": 2
}
```

### Obtener Seguidores
```bash
GET /api/follows/followers/:userId?limit=20&offset=0
```

### Obtener Usuarios que Sigue
```bash
GET /api/follows/following/:userId?limit=20&offset=0
```

### Verificar si Sigue
```bash
GET /api/follows/check?followerId=1&followingId=2
```

---

## 👍 Endpoints de Likes

### Dar Like
```bash
POST /api/likes/like
{
  "userId": 1,
  "postId": 1
}
```

### Remover Like
```bash
POST /api/likes/unlike
{
  "userId": 1,
  "postId": 1
}
```

### Obtener Likes de un Post
```bash
GET /api/likes/post/:postId?limit=20&offset=0
```

### Verificar si Usuario Dio Like
```bash
GET /api/likes/check?userId=1&postId=1
```

### Obtener Posts que el Usuario Likeó
```bash
GET /api/likes/user/:userId?limit=20&offset=0
```

---

## 💬 Endpoints de Comentarios

### Crear Comentario
```bash
POST /api/comments
{
  "userId": 1,
  "postId": 1,
  "content": "¡Excelente proyecto!",
  "parentCommentId": null
}
```

### Obtener Comentarios de un Post
```bash
GET /api/comments/post/:postId?limit=20&offset=0&parentOnly=true
```

### Obtener Comentario por ID
```bash
GET /api/comments/:commentId
```

### Actualizar Comentario
```bash
PUT /api/comments/:commentId
{
  "content": "Contenido actualizado"
}
```

### Eliminar Comentario
```bash
DELETE /api/comments/:commentId
```

### Like a Comentario
```bash
POST /api/comments/:commentId/like
```

### Obtener Comentarios de un Usuario
```bash
GET /api/comments/user/:userId?limit=20&offset=0
```

---

## 📦 Datos de Prueba

Ejecutar para llenar la BD con datos de ejemplo:
```bash
npm run seed
```

**Usuarios de prueba:**
- `lenak` / `lena@example.com` (Verificado ✅)
- `matias_rios` / `matias@example.com`
- `carlos_tech` / `carlos@example.com` (Verificado ✅)
- `sofia_hernandez` / `sofia@example.com`

**Contraseña:** `password123` (para todos)

---

## 🔧 Comandos Útiles

```bash
# Backend
npm run dev      # Iniciar servidor con hot-reload
npm run start    # Producción
npm run seed     # Poblar BD con datos de prueba

# Frontend (en la carpeta frontend/)
npm run dev      # Iniciar dev server
npm run build    # Compilar para producción
```

---

## 📋 Notas de Implementación

✅ **Completo:**
- 7 modelos Sequelize con relaciones
- 30+ endpoints CRUD
- Autenticación (JWT-ready)
- Contadores automáticos
- Validaciones básicas
- Hashtags dinámicos
- Comentarios anidados
- SQLite para desarrollo local

⏳ **Siguiente:**
- Middleware de autenticación JWT
- Multer para subida de imágenes
- ImageKit o similar para CDN
- Socket.io para tiempo real
- Tests unitarios

---

## 🚀 Deployment a Railway

Para deployar a Railway (cuando estés listo):

```bash
git init
git add .
git commit -m "Initial commit with all models"
git remote add origin [tu-repo]
git push -u origin main
```

En Railway:
- Usar PostgreSQL en lugar de SQLite
- Configurar variables de entorno (.env)
- Conectar a tu dominio xprit-robotics.com

---

**¿Necesitas ayuda con:** 
- [ ] Conectar frontend a backend
- [ ] Subir imágenes
- [ ] WebSockets para tiempo real
- [ ] Autenticación JWT
- [ ] Algo más?
