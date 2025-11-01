# 🎨 PASO A PASO — Carga tu logo y tipografía

Guía visual y paso a paso para completar la integración.

---

## 📋 Resumen rápido

Tu web ya está lista para recibir:
1. **Logo** - Imagen PNG/SVG
2. **Tipografía GangOfThree** - Archivos de fuente

Solo necesitas agregar 2 cosas y ¡listo!

---

## 🎯 PASO 1: Prepara tu logo

### Requisitos
- Formato: PNG o SVG (PNG recomendado)
- Fondo: Transparente (opcional)
- Tamaño: 256x256px o mayor (Next.js lo redimensiona)
- Peso: Menos de 1MB idealmente

### Si no tienes logo
- Opción 1: Diseña uno en Canva (canva.com)
- Opción 2: Usa generador de logos (looka.com)
- Opción 3: Contrata diseñador (fiverr.com)

---

## 📁 PASO 2: Carga el logo en la carpeta

### Ubicación
```
c:\Users\Fran\Documents\WEBXPRIT\xprit-site\public\images\
```

### Acción
1. Abre el Explorador de archivos
2. Navega a `xprit-site\public\images\`
3. Coloca tu archivo de logo
4. **Renómbralo a:** `logo.png`

### Verificación
Deberías ver:
```
public/images/
└── logo.png  ✅
```

---

## 🔤 PASO 3: Prepara la tipografía GangOfThree

### Opción A: Si tienes archivos de fuente

**Requisitos:**
- Archivos de fuente de GangOfThree
- Formatos: WOFF2, WOFF, o TTF

**Acción:**
1. Descarga los archivos de fuente
2. Colócalos en: `public/fonts/`
3. Los archivos esperados:
   - `gangofthree.woff2` (mejor: más ligero)
   - `gangofthree.woff` (alternativa)
   - `gangofthree.ttf` (respaldo)

**Verificación:**
```
public/fonts/
├── gangofthree.css   ✅ (ya existe)
├── gangofthree.woff2 ✅
├── gangofthree.woff  ✅
└── gangofthree.ttf   ✅
```

### Opción B: Si NO tienes archivos (usa Google Fonts)

1. Ve a: https://fonts.google.com
2. Busca "GangOfThree"
3. Si existe, copia el código `<link>`
4. Edita `public/fonts/gangofthree.css`:
   ```css
   /* Reemplaza el @font-face con: */
   @import url('https://fonts.googleapis.com/css2?family=GangOfThree&display=swap');
   ```

---

## ✅ PASO 4: Verifica que todo funciona

### Comando
```powershell
cd "c:\Users\Fran\Documents\WEBXPRIT\xprit-site"
npm run dev
```

### Abre el navegador
```
http://localhost:3000
```

### Qué deberías ver

**En el Header (arriba):**
- ✅ Tu logo en la izquierda
- ✅ "XpriT Robotics" al lado del logo
- ✅ Tipografía: más impactante que antes

**En el Footer (abajo):**
- ✅ Tu logo pequeñito
- ✅ "XpriT Robotics" con la tipografía

**En la Landing Page (centro):**
- ✅ Título "XpriT Robotics" gigante
- ✅ Tipografía GangOfThree distinguida

---

## 🎨 PASO 5: Personalización (Opcional)

### Si quieres cambiar el tamaño del logo en Header

1. Abre: `components/Header.tsx`
2. Busca esta línea:
   ```tsx
   <div className="w-10 h-10">
   ```
3. Cambia `w-10 h-10` a:
   - `w-12 h-12` (más grande)
   - `w-8 h-8` (más pequeño)

### Si quieres cambiar el espaciado de letras

1. Abre: `public/fonts/gangofthree.css`
2. Busca: `letter-spacing: 0.05em;`
3. Cambia el valor:
   - `0.1em` (más espaciado)
   - `0.02em` (menos espaciado)

### Si quieres más sombra al logo

1. Edita: `components/Header.tsx`
2. Agrega a la etiqueta `<Image>`:
   ```tsx
   className="group-hover:opacity-80 transition-opacity drop-shadow-lg"
   ```

---

## 🔍 Pruebas de verificación

### Test 1: Logo visible
- [ ] Logo aparece en el Header
- [ ] Logo aparece en el Footer
- [ ] Logo no se ve pixelado

### Test 2: Tipografía
- [ ] "XpriT Robotics" en Header se ve diferente
- [ ] "XpriT Robotics" en Footer se ve diferente
- [ ] Título hero es más grande

### Test 3: Responsive
- [ ] Abre en móvil (F12 → dispositivo)
- [ ] Logo es visible
- [ ] Texto no se corta

### Test 4: Carga
- [ ] Página carga rápido
- [ ] Logo aparece inmediatamente
- [ ] Sin errores en consola (F12 → Console)

---

## ⚠️ Troubleshooting (Si algo no funciona)

### Logo no aparece

**Solución:**
1. Verifica que está en `public/images/logo.png`
2. Verifica que se llama exactamente `logo.png`
3. Reinicia el servidor: `npm run dev`
4. Limpia cache: `Ctrl + Shift + Delete`

### Tipografía no se ve diferente

**Solución:**
1. Verifica archivos de fuente en `public/fonts/`
2. O copia Google Fonts link
3. Reinicia servidor
4. Abre DevTools (F12) y verifica que `.gang-of-three` tiene la fuente correcta

### Página carga lenta

**Solución:**
1. Comprime la imagen del logo
2. Usa formato WOFF2 (más ligero que TTF)
3. Limpia `node_modules`: `rm -r node_modules` y `npm install`

### Errores en la consola (F12)

**Común:** "Failed to load font"
- Verifica que los archivos existen
- Revisa rutas en `gangofthree.css`

---

## 📱 Verificación en diferentes dispositivos

### Desktop (computadora)
- Abre: http://localhost:3000
- Verifica: Logo, tipografía, todo visible

### Mobile (teléfono)
- Copia tu IP local (en PowerShell: `ipconfig`)
- Abre: `http://[tu-ip]:3000` desde el teléfono
- Verifica: Logo, tipografía, responsive

### Tablet (opcional)
- Igual que mobile
- Verifica en orientación horizontal y vertical

---

## 🎯 Checklist final

- [ ] Logo copiado a `public/images/logo.png`
- [ ] Tipografía en `public/fonts/` o Google Fonts
- [ ] Servidor ejecutándose (`npm run dev`)
- [ ] Logo visible en Header
- [ ] Logo visible en Footer
- [ ] Tipografía GangOfThree visible
- [ ] Sin errores en consola
- [ ] Responsive en mobile
- [ ] Tests de verificación pasados

---

## 🎉 ¡Listo!

Una vez completados estos pasos, tu web XpriT Robotics tendrá:

✨ **Logo profesional**
✨ **Tipografía distinguida**
✨ **Branding coherente**
✨ **Listo para mostrar al mundo**

---

## 📞 Próximas mejoras (opcionales)

Después de esto, puedes:

1. Usar GangOfThree en más títulos
2. Agregar más imágenes de robots
3. Conectar formulario de contacto
4. Desplegar a Vercel
5. Agregar más robots y noticias

---

## 🚀 ¡A por ello!

Tu web está casi lista. Solo falta:
1. Tu logo
2. Tu tipografía

¡Adelante! 🎨✨
