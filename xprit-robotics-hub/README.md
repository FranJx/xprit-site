# XpriT Robotics Hub (XTH) 🤖

Una red social estilo Instagram para la comunidad de robótica, donde los usuarios pueden compartir proyectos, remakes, tutoriales y conectar con otros entusiastas.

## 🎯 Características Principales

✅ **Autenticación Completa**
- Registro con validación
- Login seguro con bcrypt + JWT
- Tokens con expiración

✅ **Gestión de Posts**
- Crear posts con título, descripción y tipo
- Soporte de hashtags
- Subida de imágenes
- Editar y eliminar posts

✅ **Interacciones Sociales**
- Like/Unlike posts
- Comentarios en tiempo real
- Perfiles de usuarios
- Seguir/Dejar de seguir usuarios

✅ **Búsqueda y Descubrimiento**
- Búsqueda global de usuarios y posts
- Explorar comunidad
- Feed personalizado

✅ **Interfaz Responsiva**
- Diseño moderno con Tailwind CSS
- Navegación intuitiva
- Compatible con móviles

## 🛠 Stack Tecnológico

### Frontend
- React 18 + Vite 8 (HMR rápido)
- Tailwind CSS
- Context API (gestión de estado)
- Fetch API para HTTP

### Backend
- Node.js 18 LTS
- Express.js
- Sequelize 6.35 ORM
- SQLite (desarrollo) / PostgreSQL (producción)
- JWT + bcrypt

## 📁 Estructura del Proyecto

```
xprit-robotics-hub/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Feed.jsx
│   │   │   ├── Post.jsx
│   │   │   ├── CreatePostModal.jsx
│   │   │   ├── Explore.jsx
│   │   │   ├── Community.jsx
│   │   │   ├── UserProfile.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── RightPanel.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env (desarrollo)
│   └── .env.production
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── config/
│   │   └── server.js
│   ├── seed.js
│   ├── .env
│   └── package.json
│
├── PRODUCTION_DEPLOYMENT.md
└── README.md
```

## 🚀 Quick Start - Desarrollo Local

### Prerequisites
- Node.js 18 LTS+
- npm/yarn
- Terminal

### Instalación

#### 1. Backend Setup
```bash
cd backend
npm install
npm run seed        # Llenar DB con datos de ejemplo
npm start          # Inicia en http://localhost:3000
```

#### 2. Frontend Setup (nueva terminal)
```bash
cd frontend
npm install
npm run dev        # Inicia en http://localhost:5173
```

#### 3. Acceder
```
Abre http://localhost:5173 en tu navegador
```

### 🔐 Credenciales de Prueba
- **Email**: lena@example.com
- **Contraseña**: password123

O registrate creando un nuevo usuario.

## 📝 Comandos Disponibles

### Backend
```bash
npm start          # Iniciar servidor
npm run seed       # Llenar BD con datos de ejemplo
```

### Frontend
```bash
npm run dev        # Desarrollo con HMR
npm run build      # Build para producción
npm run preview    # Ver build generado
```

## 🌍 Variables de Entorno

### Frontend

**`.env` (Desarrollo)**
```env
VITE_API_URL=http://localhost:3000
```

**`.env.production` (Producción)**
```env
VITE_API_URL=https://api.tudominio.com
```

### Backend

**`.env`**
```env
PORT=3000
NODE_ENV=development
DATABASE_URL=sqlite:./xth.db
JWT_SECRET=dev_secret_change_in_production
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

## 📡 Arquitectura de API

### Autenticación
- `POST /api/users/register` - Registrar
- `POST /api/users/login` - Iniciar sesión

### Posts
- `GET /api/posts` - Obtener posts
- `POST /api/posts/:userId` - Crear post
- `GET /api/posts/search` - Buscar posts
- `DELETE /api/posts/:postId` - Eliminar

### Usuarios
- `GET /api/users` - Listar usuarios
- `GET /api/users/:id` - Ver perfil
- `GET /api/users/search` - Buscar usuarios
- `PUT /api/users/:id` - Actualizar perfil

### Interacciones
- `POST /api/likes/like` - Like
- `POST /api/comments` - Comentar
- `POST /api/follows/follow` - Seguir

## 🔐 Seguridad

✅ Implementado:
- Contraseñas hasheadas con bcrypt
- JWT tokens
- CORS protegido
- Validación de entrada
- Rutas protegidas

⚠️ Para Producción:
- Cambiar JWT_SECRET
- Usar HTTPS
- Configurar ALLOWED_ORIGINS
- Usar PostgreSQL
- Implementar rate limiting

## 🌐 Despliegue a Producción

Ver [PRODUCTION_DEPLOYMENT.md](./PRODUCTION_DEPLOYMENT.md) para instrucciones completas.

**Pasos rápidos:**
1. Actualizar `.env.production` con URL real
2. `npm run build` en frontend
3. Configurar backend `.env` con PostgreSQL
4. Desplegar en servidor
5. Usar PM2/systemd para mantener backend activo

## 📚 Documentación Adicional

- [Variables de Entorno Frontend](./frontend/ENV_CONFIG.md)
- [Guía Completa de Despliegue](./PRODUCTION_DEPLOYMENT.md)

## 🐛 Troubleshooting

| Problema | Solución |
|----------|----------|
| Frontend no se conecta | Verificar backend en `http://localhost:3000` |
| CORS error | Revisar `ALLOWED_ORIGINS` en backend/.env |
| Error de BD | Verificar permisos y DATABASE_URL |
| Contraseña inválida | Usar credenciales de ejemplo arriba |

## 🎓 Características de Aprendizaje

Este proyecto es perfecto para aprender:
- ✅ React hooks y Context API
- ✅ Autenticación JWT + bcrypt
- ✅ CRUD operations con API REST
- ✅ Comunicación Frontend-Backend
- ✅ Validación de formularios
- ✅ Manejo de errores
- ✅ Variables de entorno

## 📊 Base de Datos

- **Users**: Autenticación y perfiles
- **Posts**: Contenido principal
- **Comments**: Interacciones en posts
- **Likes**: Reacciones a posts
- **Follows**: Relaciones entre usuarios
- **Hashtags**: Etiquetas de posts

## 🤝 Contribuir

1. Fork el repo
2. Crear rama (`git checkout -b feature/feature-name`)
3. Commit cambios (`git commit -m 'Add feature'`)
4. Push (`git push origin feature/feature-name`)
5. Open Pull Request

## 📞 Soporte

¿Problemas?
- Revisa la sección de Troubleshooting
- Lee los archivos de documentación
- Verifica los logs del terminal

---

**Estado**: ✅ Listo para producción  
**Versión**: 1.0.0  
**Última actualización**: 2024

### 1️⃣ Instalar dependencias

```bash
# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install
```

### 2️⃣ Correr en local

**Terminal 1: Backend**
```bash
cd backend
npm run dev
# Escucha en http://localhost:3000
```

**Terminal 2: Frontend**
```bash
cd frontend
npm run dev
# Escucha en http://localhost:5173
```

Abre **http://localhost:5173** en el navegador.

## 🎨 Design System

Los estilos están en `frontend/src/styles/`:
- `main.css` - Estilos globales, tema oscuro, componentes
- `comentarios.css` - Estilos del hilo de comentarios

**Colores principales:**
- `--bg: #0a0c0f` (fondo oscuro)
- `--accent: #1D9E75` (verde robotics)
- `--text: #e8eaed` (texto claro)

## 📡 API Endpoints (Backend)

### Health check
```
GET /api/health
```

### Posts
```
GET /api/posts              # Obtener todos los posts
POST /api/posts             # Crear post
POST /api/posts/:id/like    # Like a un post
```

### Users
```
GET /api/users/:id          # Obtener perfil usuario
```

## 🔧 Próximos pasos (Fases 2-4)

**Fase 2:** Conectar React al backend
- [ ] useEffect + fetch en Feed.jsx
- [ ] Tomar datos de `/api/posts`
- [ ] Actualizar likes con POST

**Fase 3:** Setup PostgreSQL local
- [ ] Docker Compose con PostgreSQL
- [ ] Sequelize ORM
- [ ] Models: User, Post, Like, Comment

**Fase 4:** Deploy a Railway
- [ ] GitHub repo
- [ ] Railway connection
- [ ] Dominio xprit-robotics.com

## 📚 Documentación relacionada

Ver en `c:\Users\Fran\Documents\XTH\`:
- `MIGRACION_DISEÑO_A_REACT.md` - Plan detallado de Fases 1-4
- `RAILWAY_OPTIMIZADO.md` - Deployment a producción
- `CONFIGURACION_TECNICA.md` - Stack completo

## 💡 Notas

- El backend usa **fake database** (arrays en memoria) por ahora
- Frontend usa **CSS estático** copiado del diseño HTML original
- Ambos pueden iniciar en cualquier orden
- CORS está habilitado para desarrollo local

---

**Status:** ✅ Fase 1 completa (Estructura + Diseño copiado)  
**Siguiente:** Fase 2 (Conectar React al Backend)

