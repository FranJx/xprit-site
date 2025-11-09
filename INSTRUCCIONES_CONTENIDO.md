# 📋 Instrucciones para Agregar Contenido

> **Nota:** Este archivo es **solo para referencia interna**. Todas las instrucciones han sido removidas de la interfaz pública.

## 🤖 Agregar Imágenes de Robots

Las imágenes de los robots deben colocarse en la carpeta `public/content/robots/` con la siguiente estructura:

```
public/content/robots/
└── [nombre-robot]/
    └── [nombre-robot].png
```

### Ejemplo: Tokio XT
```
public/content/robots/tokio-xt/tokio-xt.png
```

### Paso a paso:
1. Ve a la carpeta `public/content/robots/[nombre-robot]/`
2. Sube tu imagen con el nombre del robot (ej: `tokio-xt.png`)
3. En el archivo `content/robots/[nombre-robot]/metadata.json`, asegúrate de que `mainImage` tenga solo el nombre del archivo:
   ```json
   "mainImage": "tokio-xt.png"
   ```

## 📰 Agregar Imágenes de Noticias

Similar a los robots, las imágenes de noticias van en:

```
public/content/noticias/
└── [slug-noticia]/
    └── [nombre-imagen].png
```

En el archivo `metadata.json` de la noticia:
```json
"mainImage": "[nombre-imagen].png"
```

## 🔧 Especificaciones y Metadatos

- **metadata.json**: Información principal (nombre, descripción, imagen principal)
- **especificaciones.json**: Detalles técnicos (peso, dimensiones, etc.)

Ambos archivos son **requeridos** para que el robot aparezca en la página.

## ✨ Cambios Realizados

Se han eliminado todos los textos de instrucciones de la interfaz pública:

- ❌ Mensaje "Sube más fotos a..." en la página de robots individuales
- ❌ Mensaje "No hay robots aún. ¡Sube uno en content/robots/!" en la galería
- ❌ Sección CTA "¿Quieres agregar un robot?" con instrucciones
- ❌ Nota "En el futuro, el contenido de las noticias se cargará desde un CMS" en noticias individuales

La página ahora es más limpia y profesional, sin exponer detalles técnicos al público.

## 🚀 Railway y Privacidad del Repo

Si quieres que el repositorio sea **privado**:

1. Ve a GitHub → Tu repositorio → Settings
2. En **Danger Zone** → haz clic en "Change repository visibility"
3. Selecciona "Make private"

**Nota:** Asegúrate de que Railway pueda acceder al repo:
- Si Railway está conectado con tu cuenta, debería tener permisos automáticamente
- En Railway, verifica que tengas la clave SSH o token de acceso configurado
- Si tienes problemas, regenera el token en GitHub → Settings → Developer settings
