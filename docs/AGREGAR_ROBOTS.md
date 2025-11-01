# 🤖 Guía para agregar más robots a XpriT Robotics

## Quick Start

Para agregar un nuevo robot a la web, solo necesitas crear 2 archivos JSON en una carpeta.

## Pasos

### 1. Crea la carpeta del robot

```
content/robots/nombre-del-robot/
```

**Ejemplo:** `content/robots/boltbot-xt/`

### 2. Crea `metadata.json`

Este archivo contiene la información básica del robot que aparece en la galería.

```json
{
  "slug": "boltbot-xt",
  "name": "BoltBot XT",
  "category": "Minisumo",
  "year": 2024,
  "description": "Robot de ultra-alto rendimiento optimizado para minisumo de competición profesional.",
  "mainImage": "/content/robots/boltbot-xt/boltbot-xt.png",
  "features": [
    "Placa XT-Prime multisensores",
    "Motor de giro ultra-rápido",
    "Chasís de titanio aligerado",
    "Sensores de línea de última generación"
  ]
}
```

**Campos obligatorios:**
- `slug`: Identificador único (sin espacios, usar guiones)
- `name`: Nombre del robot (visible en la web)
- `category`: Categoría (Minisumo, Velocistas, Sumo, VSSS, etc.)
- `year`: Año de diseño
- `description`: Descripción corta (máx 150 caracteres)
- `mainImage`: Ruta a la imagen principal

**Campos opcionales:**
- `features`: Array de características destacadas

### 3. Crea `especificaciones.json`

Este archivo contiene las especificaciones técnicas que se muestran en una tabla.

```json
[
  {
    "label": "Categoría",
    "value": "Minisumo"
  },
  {
    "label": "Placa electrónica",
    "value": "XT-Prime"
  },
  {
    "label": "Peso",
    "value": "480g"
  },
  {
    "label": "Dimensiones",
    "value": "10cm x 10cm x 8cm"
  },
  {
    "label": "Velocidad máxima",
    "value": "2.8 m/s"
  },
  {
    "label": "Sensores",
    "value": "Infrarrojos, acelerómetro, giroscopio"
  },
  {
    "label": "Autonomía",
    "value": "50 minutos"
  },
  {
    "label": "Logros",
    "value": "3.er puesto Minisumo Pro 2023"
  }
]
```

### 4. (Opcional) Agregar imágenes

Copia una imagen PNG del robot a:
```
content/robots/boltbot-xt/boltbot-xt.png
```

Y actualiza `mainImage` en `metadata.json` a:
```json
"mainImage": "/content/robots/boltbot-xt/boltbot-xt.png"
```

## ¿Qué sucede automáticamente?

Una vez que creas la carpeta y los archivos JSON:

1. ✅ El robot aparece en `/robots` (galería)
2. ✅ Obtiene su propia página en `/robots/boltbot-xt`
3. ✅ Las especificaciones se muestran en una tabla
4. ✅ La descripción aparece en la tarjeta

## Ejemplo completo

### Carpeta creada
```
content/robots/winner-xt/
├── metadata.json
└── especificaciones.json
```

### Contenido de `metadata.json`
```json
{
  "slug": "winner-xt",
  "name": "Winner XT",
  "category": "Velocistas",
  "year": 2024,
  "description": "Robot velocista con algoritmo de seguimiento avanzado y visión 240FPS.",
  "mainImage": "/content/robots/winner-xt/winner-xt.png",
  "features": [
    "Cámara 240FPS de ultra-alta velocidad",
    "Procesador dedicado para IA",
    "Peso reducido: 260g",
    "Suspensión adaptativa"
  ]
}
```

### Contenido de `especificaciones.json`
```json
[
  {"label": "Categoría", "value": "Velocistas"},
  {"label": "Placa electrónica", "value": "XT-Prime"},
  {"label": "Peso", "value": "260g"},
  {"label": "Velocidad máxima", "value": "4.2 m/s"},
  {"label": "Sensores", "value": "Cámara 240FPS, encoders, acelerómetro"},
  {"label": "Autonomía", "value": "70 minutos"},
  {"label": "Año", "value": "2024"}
]
```

## Lista de robots para agregar

Basado en tu lista, aquí están los robots ya creados:
- ✅ Tokio XT
- ✅ Seúl XT
- ✅ Predator XT
- ✅ Thunder XT

**Aún por crear:**
- IkarI XT
- BoltBot XT
- Snorlax XT
- ElTitán XT
- Sharp XT
- Winner XT
- Mike XT
- Speedy Be XT
- Speedy Be Turbo XT

## 💡 Tips

- Usa el mismo formato y estructura para consistencia
- Mantén los nombres de slug en minúsculas y con guiones
- Las imágenes deben ser PNG o JPG, máximo 2MB
- Las descripciones claras y cortas funcionan mejor

¿Necesitas agregar un robot? Solo copia esta estructura y cambia los valores. ¡Así de simple!
