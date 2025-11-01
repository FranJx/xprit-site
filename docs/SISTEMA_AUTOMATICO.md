# 🚀 XpriT Robotics — Sistema Automático Completado

## ¿Qué hemos construido?

Un **sistema 100% automatizado** donde:
1. **Subes carpetas a GitHub** con fotos y textos
2. **La web se actualiza sola** sin tocar código
3. **Todo está listo para producción** con Next.js + TypeScript + Tailwind

---

## 📋 Estructura final

```
xprit-site/
├── pages/
│   ├── index.tsx           (Landing épica)
│   ├── robots.tsx          (Listado dinámico de robots)
│   ├── robots/[slug].tsx   (Página individual de robot)
│   ├── noticias.tsx        (Listado de noticias)
│   ├── noticias-new/[slug].tsx (Página de noticia)
│   ├── quien-somos.tsx     (Sobre el equipo)
│   ├── contacto.tsx        (Formulario + info)
│   └── _app.tsx            (Layout global)
│
├── lib/
│   └── content.ts          ⭐ Motor de automatización
│
├── content/                ⭐ TU CONTENIDO VA AQUÍ
│   ├── robots/
│   │   └── hunter-v1/      (Ejemplo: Robot)
│   │       ├── metadata.json
│   │       ├── especificaciones.json
│   │       └── images/
│   │           └── main.jpg
│   │
│   └── noticias/
│       └── lanzamiento-hunter/  (Ejemplo: Noticia)
│           ├── metadata.json
│           ├── content.md
│           └── images/
│               └── main.jpg
│
└── components/
    ├── Header.tsx          (Sticky, navegación)
    └── Footer.tsx          (Links, redes, año)
```

---

## ⚡ Cómo agregar contenido (SIN CÓDIGO)

### Paso 1: Crear un Robot

1. Abre `content/robots/`
2. Crea una carpeta: `content/robots/mi-robot-nombre/`
3. Añade 3 archivos:

**metadata.json**
```json
{
  "slug": "mi-robot-nombre",
  "name": "Mi Robot Increíble",
  "category": "Competición",
  "year": 2024,
  "description": "Descripción corta que aparece en tarjetas",
  "mainImage": "main.jpg"
}
```

**especificaciones.json**
```json
{
  "specs": [
    { "label": "Peso", "value": "15 kg" },
    { "label": "Velocidad", "value": "3.5 m/s" }
  ],
  "description": "Descripción larga que aparece en la página del robot"
}
```

**images/main.jpg** — La foto portada

✅ **¡LISTO!** Aparecerá automáticamente en /robots

---

### Paso 2: Crear una Noticia

1. Abre `content/noticias/`
2. Crea una carpeta: `content/noticias/mi-noticia-titulo/`
3. Añade 3 archivos:

**metadata.json**
```json
{
  "slug": "mi-noticia-titulo",
  "title": "Título de mi noticia",
  "date": "2024-11-01",
  "category": "Lanzamientos",
  "excerpt": "Resumen corto que aparece en el listado",
  "mainImage": "main.jpg"
}
```

**content.md** — Tu noticia en Markdown
```markdown
# Título

Párrafo 1...

## Subtítulo

- Punto 1
- Punto 2

Más texto aquí...
```

**images/main.jpg** — Foto portada

✅ **¡LISTO!** Aparecerá automáticamente en /noticias

---

## 🔄 Flujo: GitHub → Web (100% automático)

```
TÚ subes carpeta a GitHub
        ↓
Vercel detecta cambios
        ↓
`getStaticProps()` lee `content/`
        ↓
Genera páginas dinámicamente
        ↓
Imágenes se optimizan automáticamente
        ↓
Web se actualiza (sin recargar código)
```

---

## 🛠️ Cómo ejecutar localmente

```bash
# 1. Entrar en carpeta
cd C:\Users\Fran\Documents\WEBXPRIT\xprit-site

# 2. Instalar dependencias (si no lo hizo)
npm.cmd install

# 3. Ejecutar en desarrollo
npm run dev

# 4. Abrir en navegador
# http://localhost:3000
```

Para ver los cambios:
- Edita archivos en `content/robots/` o `content/noticias/`
- La página se refresca automáticamente (sin rebuild)

---

## 📁 Ejemplo completo (listo ahora)

Ya hay un ejemplo funcionando:
- Robot: `content/robots/hunter-v1/`
- Noticia: `content/noticias/lanzamiento-hunter/`

Abre http://localhost:3000 → Robots → "Hunter v1" para verlo.

---

## 🎯 Siguientes pasos opcionales

- **A) Deploy en Vercel** — Tu web en vivo (1 click)
- **B) EmailJS** — Formulario de contacto funcional
- **C) Visor 3D** — Modelos glTF interactivos
- **D) SEO** — Sitemap, RSS, Analytics
- **E) Personalización** — Colores, fuentes, temas

---

## 📝 Notas técnicas

- **Revalidación**: Cada 60 segundos (`revalidate: 60`)
- **Imágenes**: Next.js/Image las optimiza automáticamente
- **Markdown**: Se renderiza como texto plano (sin HTML avanzado por ahora)
- **TypeScript**: Todo tipado para evitar errores

---

## 🎨 Personalización rápida

Si quieres cambiar colores/diseño:
- **Colores**: Edita `styles/globals.css` o `tailwind.config.js`
- **Tipografía**: Cambia en `styles/globals.css`
- **Layout**: Modifica componentes en `components/`

---

## ❓ Preguntas frecuentes

**P: ¿Tengo que escribir código cada vez que agrego una noticia?**  
R: NO. Solo creas carpeta + JSONs + Markdown en `content/`. La web actualiza automáticamente.

**P: ¿Cómo subo fotos del robot que elijo mejor?**  
R: Metes varias en `images/` (photo-1.jpg, photo-2.jpg, etc.). La primera se usa como portada.

**P: ¿Puedo editar desde GitHub directamente?**  
R: SÍ. GitHub tiene editor online. Editas JSON/MD ahí → Web actualiza automáticamente.

**P: ¿Qué pasa si me equivoco en un JSON?**  
R: La web muestra error de compilación. Arreglas el JSON → se actualiza.

---

## 🚀 Para ir a producción

```bash
# Build para producción
npm run build

# Deploy en Vercel (recomendado)
# 1. Sube proyecto a GitHub
# 2. Conecta en vercel.com
# 3. ¡Listo! Cada push = web actualizada
```

---

**¿Dudas? Necesitas más funcionalidades? ¡Dímelo y lo armamos!** 🎯
