# 🎨 EJEMPLOS — Cómo usar GangOfThree en tu web

Ejemplos prácticos de uso de la tipografía GangOfThree en diferentes contextos.

---

## 📌 Ubicaciones actuales

### ✅ Header - Logo y nombre
```tsx
<span className="gang-of-three text-2xl bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
  XpriT Robotics
</span>
```

### ✅ Footer - Logo y nombre
```tsx
<h4 className="gang-of-three text-xl text-cyan-400">XpriT Robotics</h4>
```

### ✅ Landing Page - Hero Title
```tsx
<h1 className="gang-of-three-xxl mb-6 bg-gradient-to-r from-cyan-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent">
  XpriT Robotics
</h1>
```

---

## 💡 Ejemplos para usar en otras páginas

### Ejemplo 1: Títulos de secciones principales

```tsx
<h2 className="gang-of-three-xl text-cyan-300">
  Nuestros Robots
</h2>
```

### Ejemplo 2: Títulos de páginas

```tsx
<h1 className="gang-of-three-xl text-white mb-6">
  Quiénes Somos
</h1>
```

### Ejemplo 3: Nombres de categorías

```tsx
<div className="p-4">
  <h3 className="gang-of-three-lg text-cyan-400 mb-2">
    Minisumo
  </h3>
  <p className="text-gray-400">Robots de combate directo</p>
</div>
```

### Ejemplo 4: Tarjetas destacadas

```tsx
<div className="p-6 bg-gray-800 rounded-lg">
  <h4 className="gang-of-three text-xl text-cyan-300 mb-4">
    Tokio XT
  </h4>
  <p className="text-gray-400">Campeón Nacional WRO 2023</p>
</div>
```

### Ejemplo 5: Badges o etiquetas

```tsx
<span className="gang-of-three px-4 py-2 bg-cyan-900 text-cyan-300 rounded-full text-sm">
  ROBOT DESTACADO
</span>
```

### Ejemplo 6: Encabezados de artículos

```tsx
<article>
  <h1 className="gang-of-three-lg text-white mb-2">
    Lanzamiento Hunter V1
  </h1>
  <p className="text-gray-500 text-sm">15 de enero, 2025</p>
  <p className="text-gray-300 mt-6">Contenido del artículo...</p>
</article>
```

---

## 🎯 Casos de uso por tamaño

### `.gang-of-three` (Pequeño)
- Subtítulos en el header
- Etiquetas y badges
- Nombres en listings

**Ejemplo:**
```tsx
<p className="gang-of-three text-sm">XPRIT</p>
```

### `.gang-of-three-lg` (Grande)
- Títulos de secciones
- Nombres de robots
- Encabezados secundarios

**Ejemplo:**
```tsx
<h2 className="gang-of-three-lg text-cyan-300">
  Sharp XT
</h2>
```

### `.gang-of-three-xl` (Muy Grande)
- Títulos de páginas
- Títulos principales de artículos
- Secciones principales

**Ejemplo:**
```tsx
<h1 className="gang-of-three-xl text-white">
  Nuestros Robots
</h1>
```

### `.gang-of-three-xxl` (Gigante)
- Hero titles en landing
- Títulos épicos
- Elementos super destacados

**Ejemplo:**
```tsx
<h1 className="gang-of-three-xxl text-cyan-400">
  XpriT Robotics
</h1>
```

---

## 🎨 Combinaciones de color

### Con gradiente cyan-blue
```tsx
<h1 className="gang-of-three-xl bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
  Mi título
</h1>
```

### Con color sólido cyan
```tsx
<h2 className="gang-of-three-lg text-cyan-300">
  Mi título
</h2>
```

### Con color sólido blanco
```tsx
<h3 className="gang-of-three text-white">
  Mi título
</h3>
```

### Con color sólido gris
```tsx
<p className="gang-of-three text-gray-400">
  Mi texto
</p>
```

---

## 📱 Responsive

La tipografía GangOfThree funciona bien con Tailwind responsive:

```tsx
<h1 className="gang-of-three-lg md:gang-of-three-xl lg:gang-of-three-xxl text-cyan-300">
  Título que cambia de tamaño
</h1>
```

O simplemente usar clases base:
```tsx
<h1 className="gang-of-three text-sm md:text-lg lg:text-2xl text-cyan-300">
  Título flexible
</h1>
```

---

## ✨ Efectos y animaciones

### Con hover
```tsx
<button className="gang-of-three text-cyan-400 hover:text-cyan-300 transition-colors">
  Haz clic
</button>
```

### Con animación de escala
```tsx
<h2 className="gang-of-three-lg text-cyan-300 hover:scale-105 transition-transform">
  Título interactivo
</h2>
```

### Con sombra
```tsx
<h1 className="gang-of-three-xl text-white drop-shadow-lg">
  Título con sombra
</h1>
```

---

## 🔧 Cómo agregar a nuevas páginas

### Paso 1: Copia la clase
```tsx
className="gang-of-three-xl"
```

### Paso 2: Agrégala a tu elemento
```tsx
<h1 className="gang-of-three-xl text-cyan-300">
  Mi título
</h1>
```

### Paso 3: Personaliza color y tamaño
```tsx
<h2 className="gang-of-three-lg text-white hover:text-cyan-300 transition-colors">
  Mi título
</h2>
```

---

## 📝 Código para copiar-pegar

### Header decorativo
```tsx
<div className="border-b border-gray-800 p-6">
  <h1 className="gang-of-three-lg text-cyan-400 mb-2">
    XpriT Robotics
  </h1>
  <p className="text-gray-400">Robótica argentina de nivel internacional</p>
</div>
```

### Tarjeta con título GangOfThree
```tsx
<div className="p-6 bg-gray-800 border border-gray-700 rounded-lg">
  <h3 className="gang-of-three text-xl text-cyan-300 mb-4">
    Tokio XT
  </h3>
  <p className="text-gray-400 text-sm mb-2">Minisumo - Campeón WRO 2023</p>
  <button className="text-cyan-400 hover:text-cyan-300 transition-colors">
    Ver detalles →
  </button>
</div>
```

### Sección de logros
```tsx
<section className="py-12">
  <h2 className="gang-of-three-lg text-white text-center mb-8">
    Nuestros Logros
  </h2>
  <div className="grid md:grid-cols-4 gap-4">
    <div className="text-center">
      <p className="gang-of-three text-2xl text-cyan-400">40+</p>
      <p className="text-gray-400">Podios</p>
    </div>
    {/* más items */}
  </div>
</section>
```

### Entrada de blog
```tsx
<article className="p-6 bg-gray-800 border border-gray-700 rounded-lg">
  <h2 className="gang-of-three-lg text-white mb-2">
    Lanzamiento de nuevo robot
  </h2>
  <p className="text-gray-500 text-sm mb-4">15 de enero, 2025</p>
  <p className="text-gray-400 leading-relaxed">
    Contenido del artículo...
  </p>
  <button className="mt-4 text-cyan-400 hover:text-cyan-300 transition-colors">
    Leer más →
  </button>
</article>
```

---

## 🎯 Resumen de clases

| Clase | Tamaño | Uso |
|-------|--------|-----|
| `gang-of-three` | Base | Badges, subtítulos, textos pequeños |
| `gang-of-three-lg` | 3rem | Títulos de secciones, robots |
| `gang-of-three-xl` | 4rem | Títulos de páginas |
| `gang-of-three-xxl` | 5rem | Hero titles, elementos principales |

---

## 🚀 Siguiente paso

Usa estos ejemplos para:
1. Actualizar títulos de otras páginas
2. Mejorar visuales de tarjetas
3. Hacer más impactantes tus secciones
4. Consistencia de branding

**¡Tu web con GangOfThree será profesional y coherente!** ✨
