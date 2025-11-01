# 🎨 INSTRUCCIONES — Logo y tipografía GangOfThree

## ✨ Cambios realizados en esta sesión

### 1. Tipografía GangOfThree integrada
- ✅ Archivo CSS: `public/fonts/gangofthree.css`
- ✅ Clases disponibles: `.gang-of-three`, `.gang-of-three-lg`, `.gang-of-three-xl`, `.gang-of-three-xxl`
- ✅ Usado en: Header, Footer, Landing Page

### 2. Logo integrado en:
- ✅ Header (próximo al nombre)
- ✅ Footer (en la sección de XpriT Robotics)
- ✅ Estructura: `public/images/logo.png` (preparado para tu logo)

---

## 📁 Carpetas creadas

```
public/
├── images/          ← Aquí va tu logo
│   └── logo.png     (DEBES AGREGAR TU LOGO AQUÍ)
│
└── fonts/           ← Tipografía GangOfThree
    ├── gangofthree.css
    ├── gangofthree.woff2  (DEBES AGREGAR ESTOS ARCHIVOS)
    ├── gangofthree.woff
    └── gangofthree.ttf
```

---

## 🚀 Cómo agregar tu logo

### Paso 1: Obtén tu archivo de logo
- Formato: PNG o SVG (recomendado PNG con fondo transparente)
- Tamaño: 40px x 40px (para Header) y 32px x 32px (para Footer)
- O simplemente carga en 256x256 y Next.js lo redimensiona automáticamente

### Paso 2: Coloca el logo en la carpeta
1. Abre: `c:\Users\Fran\Documents\WEBXPRIT\xprit-site\public\images\`
2. Coloca tu archivo: `logo.png`
3. Si tienes otro nombre, edita en Header.tsx y Footer.tsx

### Paso 3: El logo aparecerá automáticamente
- Header: Al lado del nombre en tipografía GangOfThree
- Footer: En la sección de "XpriT Robotics"

---

## 🔤 Cómo agregar tipografía GangOfThree

### Opción 1: Si tienes archivos de fuente

1. Coloca los archivos en `public/fonts/`:
   - `gangofthree.woff2` (recomendado, más ligero)
   - `gangofthree.woff` (compatibilidad)
   - `gangofthree.ttf` (compatibilidad)

2. Ya están referenciados en `public/fonts/gangofthree.css`

3. El CSS se carga automáticamente en todas las páginas

### Opción 2: Usar Google Fonts

Si GangOfThree está en Google Fonts:

1. Ve a: https://fonts.google.com
2. Busca "GangOfThree"
3. Copia el código `<link>`
4. Pégalo en `pages/_app.tsx` en el `<Head>`

---

## 🎯 Dónde se usa GangOfThree

### En el Header
```tsx
<span className="gang-of-three text-2xl ...">
  XpriT Robotics
</span>
```

### En el Footer
```tsx
<h4 className="gang-of-three text-xl ...">
  XpriT Robotics
</h4>
```

### En la Landing Page (Hero)
```tsx
<h1 className="gang-of-three-xxl ...">
  XpriT Robotics
</h1>
```

---

## 📝 Clases CSS disponibles

Todas estas clases usan GangOfThree y están disponibles en toda la web:

```css
.gang-of-three              /* Tamaño por defecto */
.gang-of-three-lg           /* font-size: 3rem */
.gang-of-three-xl           /* font-size: 4rem */
.gang-of-three-xxl          /* font-size: 5rem */
```

**Uso en cualquier página:**
```tsx
<h1 className="gang-of-three-xl text-cyan-400">Mi título</h1>
```

---

## 📂 Archivos modificados

1. **pages/_app.tsx**
   - ✅ Importa GangOfThree CSS en el `<Head>`

2. **components/Header.tsx**
   - ✅ Muestra logo image + texto con GangOfThree
   - ✅ Logo espera: `/images/logo.png`

3. **components/Footer.tsx**
   - ✅ Logo en sección de XpriT
   - ✅ Nombre con GangOfThree

4. **pages/index.tsx**
   - ✅ Hero title usa `gang-of-three-xxl`

---

## ✅ Checklist

- [ ] Copiar tu archivo de logo a `public/images/logo.png`
- [ ] Si usas fuentes custom, copiarlas a `public/fonts/`
- [ ] O usar Google Fonts (editar gangofthree.css)
- [ ] Ejecutar `npm run dev`
- [ ] Abrir http://localhost:3000
- [ ] Verificar que logo y tipografía se ven correctamente

---

## 🎨 Personalización

### Cambiar el tamaño del logo en Header
Edita `components/Header.tsx`:
```tsx
<div className="w-10 h-10">  {/* Cambiar w-10 h-10 a otro tamaño */}
  <Image src="/images/logo.png" width={40} height={40} />
</div>
```

### Cambiar estilos de GangOfThree
Edita `public/fonts/gangofthree.css`:
```css
.gang-of-three {
  font-family: 'GangOfThree', sans-serif;
  letter-spacing: 0.1em;      /* Aumenta el espacio entre letras */
  font-weight: bold;           /* Si la fuente lo soporta */
}
```

### Cambiar el tamaño en la landing
Edita `pages/index.tsx`:
```tsx
<h1 className="gang-of-three-xxl">  {/* Cambiar a XXL, XL, LG, etc */}
```

---

## 🔗 Recursos

- **Google Fonts:** https://fonts.google.com/
- **FontAwesome:** https://fontawesome.com/ (para iconos)
- **Next.js Image:** https://nextjs.org/docs/api-reference/next/image

---

## 💡 Tips

1. **Logo transparente:** Usa PNG con fondo transparente para mejor integración
2. **Fuente alternativa:** Si GangOfThree no carga, se usa sans-serif por defecto
3. **Performance:** WOFF2 es más ligero que TTF, pero TTF es más compatible

---

## 📞 Próximos pasos

1. **Agrega tu logo** a `public/images/logo.png`
2. **Agrega fuentes** a `public/fonts/` (si tienes archivos)
3. **O actualiza** `public/fonts/gangofthree.css` para usar Google Fonts
4. **Ejecuta** `npm run dev`
5. **¡Disfruta!** Tu logo y tipografía en acción

---

**¿Listo?** Carga tu logo y tipografía, y XpriT Robotics tendrá un branding profesional 🚀
