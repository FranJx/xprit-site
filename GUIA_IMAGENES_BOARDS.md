# 🎨 GUÍA DE IMÁGENES - Boards Landing Page

## RESUMEN RÁPIDO

Necesitas diseñar **8 imágenes totales**:

```
1 × Hero image (grande)
6 × Cards (3 robots × 2 estados c/u)
1 × Board specifications (grande)
```

---

## 1️⃣ HERO IMAGE (Placa Principal)

### Propósito
Aparece en el hero section junto al tagline **"Una placa. Infinidad de robots."**
Se anima con rotación suave (0° → 18°) al scrollear.

### Especificaciones
- **Dimensiones:** 1920 × 1080 px
- **Formato:** WebP (recomendado) + AVIF
- **Peso máximo:** ≤800 KB
- **Aspecto:** 16:9 (landscape)
- **Nombre archivo:** `board-hero.webp`

### Descripción visual
- Foto profesional de la placa desde ángulo frontal/isométrico (45°)
- Fondo studio o gradiente limpio (preferiblemente negro/gris oscuro)
- Buena iluminación que resalte los componentes
- Sombra suave debajo para profundidad
- Opcional: halo/glow azul cian para efecto futurista

### Referencia de ubicación
```
┌──────────────────────────────────────────┐
│                                          │
│  [TAGLINE TEXTO]    [PLACA HERO IMAGE]  │
│                                          │
│  Una placa.                              │
│  Infinidad de robots.                    │
│                                          │
└──────────────────────────────────────────┘
```

---

## 2️⃣ ROBOT CONFIGURATION CARDS (3 Robots × 2 Estados)

### Total: 6 imágenes

#### A) MINISUMO PRO

**Estado 1: CLOSED (Cerrada/Armada) - ESTADO POR DEFECTO**
- **Dimensiones:** 480 × 360 px
- **Nombre:** `minisumo-closed.webp`
- **Peso máximo:** ≤150 KB
- **Descripción:** Robot Sumo completo/armado, vista general clara
- **Mostrado en:** Card inicial (antes de hover/tap)

**Estado 2: OPEN (Abierta/Explotada) - AL HOVER/TAP**
- **Dimensiones:** 480 × 360 px
- **Nombre:** `minisumo-open.webp`
- **Peso máximo:** ≤150 KB
- **Descripción:** Vista explotada del robot mostrando:
  - Placa en el centro (destacada)
  - Componentes alrededor separados (sensores, ruedas, etc.)
  - Líneas o flechas indicando conexiones
- **Mostrado en:** Card al hacer hover (desktop) o tap (mobile)

#### B) VELOCISTA PRO

**Estado 1: CLOSED (Cerrada/Armada) - ESTADO POR DEFECTO**
- **Dimensiones:** 480 × 360 px
- **Nombre:** `velocista-closed.webp`
- **Peso máximo:** ≤150 KB
- **Descripción:** Robot de velocidad completo, diseño aerodinámico
- **Mostrado en:** Card inicial

**Estado 2: OPEN (Abierta/Explotada) - AL HOVER/TAP**
- **Dimensiones:** 480 × 360 px
- **Nombre:** `velocista-open.webp`
- **Peso máximo:** ≤150 KB
- **Descripción:** Vista explotada del Velocista
- **Mostrado en:** Card al hacer hover/tap

#### C) LABERINTO PRO

**Estado 1: CLOSED (Cerrada/Armada) - ESTADO POR DEFECTO**
- **Dimensiones:** 480 × 360 px
- **Nombre:** `laberinto-closed.webp`
- **Peso máximo:** ≤150 KB
- **Descripción:** Robot laberinto completo
- **Mostrado en:** Card inicial

**Estado 2: OPEN (Abierta/Explotada) - AL HOVER/TAP**
- **Dimensiones:** 480 × 360 px
- **Nombre:** `laberinto-open.webp`
- **Peso máximo:** ≤150 KB
- **Descripción:** Vista explotada del Laberinto
- **Mostrado en:** Card al hacer hover/tap

### Tips de diseño para Cards
✅ Usa colores consistentes:
   - Placa = Cian/Azul (#00d4ff aprox)
   - Componentes = Plata/Gris

✅ Estado abierto debe tener:
   - Placa en centro destacada
   - Componentes separados alrededor
   - Perspectiva/sombras para profundidad
   - Líneas conectoras opcionales

✅ Usa fondo transparente (PNG) para máxima flexibilidad

✅ Mantén el mismo ángulo/escala en ambas versiones del mismo robot

✅ Transición entre estados: fade 400ms (en código)

### Diagrama de comportamiento
```
[USER INTERACTION]
    ↓
┌─────────────────────────────────────┐
│  DESKTOP: HOVER SOBRE CARD          │
│  MOBILE:  TAP EN CARD               │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│  IMAGE FADE OUT (200ms)             │
│  minisumo-closed.webp → OPACIDAD 0  │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│  IMAGE FADE IN (200ms)              │
│  minisumo-open.webp → OPACIDAD 1    │
└─────────────────────────────────────┘
    ↓
[MOSTRAR ESPECIFICACIONES TÉCNICAS EN CARD]
```

---

## 3️⃣ BOARD SPECIFICATIONS IMAGE (Placa con hotspots)

### Propósito
Imagen interactiva en sección "Especificaciones Técnicas"
Tendrá 5 hotspots (puntos clickeables) que muestran info de componentes

### Especificaciones
- **Dimensiones:** 1600 × 900 px
- **Formato:** WebP + AVIF
- **Peso máximo:** ≤700 KB
- **Aspecto:** 16:9 (landscape)
- **Nombre archivo:** `board-specs.webp`

### Descripción visual
- Foto profesional de la placa vista desde arriba o isométrica
- Todos los componentes principales visibles y etiquetados
- Buena iluminación que destaque cada componente
- Fondo limpio (blanco o gris claro para contrastar)

### Hotspots interactivos (5 puntos)

Estos NO están dibujados en la imagen - se agregan dinámicamente en código.
Las posiciones son coordenadas % dentro del contenedor:

```
1. PROCESADOR PRINCIPAL
   - Posición: X=15%, Y=25%
   - Info: "ARM Cortex-M4 @ 168MHz"
   - Specs: "192 KB RAM, 1 MB Flash"

2. REGULADOR DE POTENCIA
   - Posición: X=45%, Y=20%
   - Info: "Entrada 5V-12V"
   - Specs: "Salida 3.3V/2A, Protección BEC"

3. CONECTOR CAN
   - Posición: X=75%, Y=30%
   - Info: "Bus de comunicación"
   - Specs: "250 kbps - 1 Mbps"

4. PINES GPIO
   - Posición: X=30%, Y=70%
   - Info: "16 salidas PWM"
   - Specs: "16-bit, hasta 2 MHz"

5. CONECTOR DE DEPURACIÓN
   - Posición: X=70%, Y=75%
   - Info: "SWD/JTAG"
   - Specs: "Para programación y debugging"
```

### Cómo funcionan los hotspots
```
[USUARIO HACE HOVER O CLICK SOBRE HOTSPOT]
    ↓
┌──────────────────────────────────┐
│  APARECE TOOLTIP (animated)      │
│                                  │
│  Procesador Principal            │
│  ARM Cortex-M4 @ 168MHz          │
│  192 KB RAM, 1 MB Flash          │
└──────────────────────────────────┘
    ↓
[TOOLTIP DESAPARECE CUANDO SALE DEL HOTSPOT]
```

---

## 📊 TABLA RESUMEN

| Imagen                 | Dimensiones      | Peso Máx. | Formato        |
|------------------------|------------------|-----------|-----------------|
| board-hero.webp        | 1920 × 1080      | 800 KB    | WebP + AVIF    |
| minisumo-closed.webp   | 480 × 360        | 150 KB    | WebP + AVIF    |
| minisumo-open.webp     | 480 × 360        | 150 KB    | WebP + AVIF    |
| velocista-closed.webp  | 480 × 360        | 150 KB    | WebP + AVIF    |
| velocista-open.webp    | 480 × 360        | 150 KB    | WebP + AVIF    |
| laberinto-closed.webp  | 480 × 360        | 150 KB    | WebP + AVIF    |
| laberinto-open.webp    | 480 × 360        | 150 KB    | WebP + AVIF    |
| board-specs.webp       | 1600 × 900       | 700 KB    | WebP + AVIF    |

**TOTAL: 8 imágenes**

---

## 🎨 RECOMENDACIONES DE DISEÑO

### Estilo Visual General
- Paleta: Azul/Cian (#00d4ff) + Grises oscuros + Fondos negros
- Iluminación: Studio/profesional con sombras suaves
- Enfoque: Claridad + Componentes destacados
- Efecto: Futurista pero realista

### Fondo para Cards
- Opción 1: Fondo transparente (PNG) - mejor opción
- Opción 2: Gradiente sutil (negro → gris oscuro)
- Opción 3: Fondo blanco/gris claro (para contraste máximo)

### Vistas explotadas
- Mantener la placa como elemento central
- Separar componentes claramente
- Usar perspectiva/3D si es posible
- Incluir líneas conectoras opcionales
- Colores: Placa = Cian, Componentes = Plata/Gris

### Calidad
- Resolución nativa en las dimensiones especificadas
- Sin upscaling (mantener crisp/sharp)
- Exportar en WebP con calidad 80-85
- AVIF opcional pero recomendado (mejor compresión)

---

## 📁 ESTRUCTURA DE CARPETAS

```
xprit-site/
├── public/
│   └── images/
│       ├── board-hero.webp
│       ├── board-hero.avif (opcional)
│       ├── minisumo-closed.webp
│       ├── minisumo-closed.avif (opcional)
│       ├── minisumo-open.webp
│       ├── minisumo-open.avif (opcional)
│       ├── velocista-closed.webp
│       ├── velocista-closed.avif (opcional)
│       ├── velocista-open.webp
│       ├── velocista-open.avif (opcional)
│       ├── laberinto-closed.webp
│       ├── laberinto-closed.avif (opcional)
│       ├── laberinto-open.webp
│       ├── laberinto-open.avif (opcional)
│       ├── board-specs.webp
│       └── board-specs.avif (opcional)
```

---

## 🚀 PRÓXIMOS PASOS

1. **Diseña/renderiza** las 8 imágenes con las especificaciones arriba
2. **Exporta en WebP** (y AVIF si quieres mejor compresión)
3. **Verifica los pesos** (no deben exceder los máximos)
4. **Coloca en** `/public/images/`
5. **Actualiza** `pages/boards.tsx` reemplazando las rutas de `/images/default.jpg`
6. **Ejecuta** `npm run build` para verificar
7. **Commit + Push** a Railway
8. **Prueba** en mobile y desktop

---

## 💡 NOTAS IMPORTANTES

✅ Las imágenes se cargan usando `next/image` de Next.js
   - Optimización automática
   - Lazy loading automático
   - Responsive automático

✅ Los hotspots NO se dibujan en la imagen
   - Son elementos HTML superpuestos dinámicamente
   - Tú solo proporciona la foto de la placa

✅ Las transiciones entre estados (closed ↔ open)
   - Son fade 400ms automático en código
   - Tú solo proporciona ambas imágenes

✅ Accesibilidad
   - `prefers-reduced-motion` desactiva animaciones automáticamente
   - Alt text agregado automáticamente
   - Contraste WCAG AA en tooltips

---

## 📞 SOPORTE

Si tienes dudas sobre:
- **Dimensiones:** Usa exactamente lo especificado
- **Ángulos:** Isométrico 45° para hero + board, frontal para cards
- **Colores:** Cian #00d4ff es el color principal
- **Pesos:** Comprime bien en WebP, máx 800KB para imágenes grandes

¡Listo para comenzar el diseño! 🎨
