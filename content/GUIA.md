# Guía: Cómo agregar Robots y Noticias automáticamente

## Estructura de carpetas

```
content/
├── robots/
│   ├── robot-1-nombre/
│   │   ├── metadata.json
│   │   ├── images/
│   │   │   ├── main.jpg (portada principal)
│   │   │   ├── photo-2.jpg
│   │   │   └── photo-3.jpg
│   │   └── especificaciones.json
│   │
│   └── robot-2-otro/
│       ├── metadata.json
│       ├── images/
│       └── especificaciones.json
│
└── noticias/
    ├── noticia-1-titulo/
    │   ├── metadata.json
    │   ├── content.md (contenido en Markdown)
    │   └── images/
    │       ├── main.jpg (portada)
    │       └── photo-2.jpg
    │
    └── noticia-2-titulo/
        ├── metadata.json
        ├── content.md
        └── images/
```

## Paso 1: Crear una carpeta de robot

1. Crea una carpeta en `content/robots/` con nombre único (sin espacios, guiones bajos):
   - ✅ `robot-hunter-2024`
   - ✅ `robot-gripper-v2`
   - ❌ `Robot Hunter` (no usar espacios)

2. Dentro, crea:
   - `metadata.json` — Información del robot
   - `especificaciones.json` — Datos técnicos
   - `images/` — Carpeta con fotos (JPG, PNG, WebP)

## Paso 2: Archivos requeridos para Robot

### metadata.json
```json
{
  "slug": "robot-hunter-2024",
  "name": "Robot Hunter 2024",
  "category": "Competición",
  "year": 2024,
  "description": "Descripción corta del robot (se muestra en la tarjeta)",
  "mainImage": "main.jpg"
}
```

### especificaciones.json
```json
{
  "specs": [
    { "label": "Peso", "value": "15 kg" },
    { "label": "Dimensiones", "value": "70 x 50 x 40 cm" },
    { "label": "Motor principal", "value": "BLDC 1500W" },
    { "label": "Velocidad máx.", "value": "3.2 m/s" },
    { "label": "Batería", "value": "LiPo 6S 5000mAh" }
  ],
  "description": "Descripción detallada del robot que aparecerá en la página individual."
}
```

### images/
- **main.jpg** — Portada (se muestra en tarjetas y hero)
- **photo-2.jpg**, **photo-3.jpg**, etc. — Fotos adicionales en galería

---

## Paso 3: Crear una Noticia

### metadata.json
```json
{
  "slug": "lanzamiento-robot-hunter",
  "title": "Lanzamiento del Robot Hunter 2024",
  "date": "2024-11-01",
  "category": "Lanzamientos",
  "excerpt": "Presenta nuestro nuevo robot diseñado para competiciones de alto nivel.",
  "mainImage": "main.jpg"
}
```

### content.md
```markdown
# Lanzamiento del Robot Hunter 2024

Hoy es un día especial para XpriT Robotics...

## Características principales

- Velocidad mejorada en un 40%
- Sistema de visión integrado
- Diseño modular para rápida reparación

### Rendimiento

El robot ha sido probado en...

## ¡Únete a nuestro equipo!

Estamos buscando nuevos miembros...
```

### images/
- **main.jpg** — Portada de la noticia
- Fotos adicionales (se mostrarán en galería)

---

## Cómo funciona la automatización

1. **Subes carpeta a GitHub** → `content/robots/mi-robot/` o `content/noticias/mi-noticia/`
2. **La web detecta automáticamente** los archivos JSON y Markdown
3. **Se genera la página dinámicamente** sin escribir código
4. **Las imágenes se optimizan y se muestran** automáticamente

---

## Requisitos de archivos

| Archivo | Requerido | Formato |
|---------|----------|---------|
| `metadata.json` | ✅ Sí | JSON válido |
| `especificaciones.json` (robots) | ✅ Sí | JSON válido |
| `content.md` (noticias) | ✅ Sí | Markdown |
| `images/main.jpg` | ✅ Sí | JPG/PNG/WebP |
| Otras imágenes | ❌ No | JPG/PNG/WebP |

---

## Ejemplo: Agregar un robot en 5 minutos

```
content/robots/
└── mi-robot-especial/
    ├── metadata.json
    ├── especificaciones.json
    └── images/
        ├── main.jpg
        ├── detalle1.jpg
        └── detalle2.jpg
```

Copia, pega en GitHub → ¡Listo! Aparece automáticamente en la web.

---

## Comandos locales (opcional)

Para probar antes de subir a GitHub:
```bash
npm run dev
# Abre http://localhost:3000/robots y verás los nuevos robots
```

---

## Limitaciones y notas

- Las imágenes se optimizan automáticamente a WebP
- Tamaño máximo recomendado: 5MB por imagen
- El slug debe ser único (no repetir slugs)
- Los archivos JSON deben ser válidos
