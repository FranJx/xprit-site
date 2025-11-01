# 📁 INSTRUCCIONES EXACTAS — Dónde cargar archivos

Guía específica de rutas y ubicaciones.

---

## 🎯 TU LOGO

### Ubicación exacta:
```
c:\Users\Fran\Documents\WEBXPRIT\xprit-site\public\images\logo.png
```

### Pasos:
1. Abre **Explorador de archivos** (Windows + E)
2. Navega a: `C:\Users\Fran\Documents\WEBXPRIT\xprit-site\public\images\`
3. Si no existe `images/`, crea la carpeta
4. Coloca tu archivo de logo aquí
5. **Asegúrate de que se llama:** `logo.png`

### Alternativas de nombre:
- ✅ `logo.png` (recomendado)
- ✅ `xprit-logo.png` (si editas componentes)
- ❌ `Logo.png` (cuidado con mayúsculas)

### Verificación:
Deberías ver:
```
📁 public
  └─ 📁 images
     └─ 🖼️ logo.png ✅
```

---

## 🔤 TIPOGRAFÍA GANGOFTHREE

### Opción A: Archivos de fuente (recomendado)

#### Ubicación exacta:
```
c:\Users\Fran\Documents\WEBXPRIT\xprit-site\public\fonts\
```

#### Coloca estos archivos:
```
📁 public
  └─ 📁 fonts
     ├─ gangofthree.css          ✅ (ya existe)
     ├─ gangofthree.woff2        ← CARGA AQUÍ
     ├─ gangofthree.woff         ← CARGA AQUÍ
     └─ gangofthree.ttf          ← CARGA AQUÍ
```

#### Pasos:
1. Abre **Explorador de archivos**
2. Navega a: `C:\Users\Fran\Documents\WEBXPRIT\xprit-site\public\fonts\`
3. Coloca los archivos de fuente aquí
4. Los nombres deben ser **exactos**:
   - `gangofthree.woff2`
   - `gangofthree.woff`
   - `gangofthree.ttf`

#### Cuál usar:
- **WOFF2**: Más ligero (mejor para web)
- **WOFF**: Alternativa compatible
- **TTF**: Respaldo universal

#### Si tienes solo uno:
- Usa WOFF2 (mejor)
- O usa WOFF
- O usa TTF

### Opción B: Google Fonts (alternativa)

Si NO tienes archivos de fuente:

1. Ve a: https://fonts.google.com
2. Busca: "GangOfThree"
3. Si existe, copia el código `<link>`
4. Abre: `public/fonts/gangofthree.css`
5. Reemplaza el contenido con el import de Google

Ejemplo:
```css
/* En lugar del @font-face, usa: */
@import url('https://fonts.googleapis.com/css2?family=GangOfThree&display=swap');

/* Mantén las clases: */
.gang-of-three {
  font-family: 'GangOfThree', sans-serif;
  letter-spacing: 0.05em;
}

.gang-of-three-lg {
  font-family: 'GangOfThree', sans-serif;
  font-size: 3rem;
}

/* ... etc ... */
```

---

## 📋 Checklist de archivos

### Antes de ejecutar npm run dev

- [ ] `public/images/logo.png` existe
- [ ] `public/fonts/gangofthree.css` existe ✅
- [ ] Tipografía en `public/fonts/`:
  - [ ] `gangofthree.woff2` O
  - [ ] `gangofthree.woff` O
  - [ ] `gangofthree.ttf` O
  - [ ] Google Fonts link en CSS

### Verificación en la carpeta

```
public/
├── images/
│   └── logo.png              ← ¿Existe?
└── fonts/
    ├── gangofthree.css       ← ✅ (ya existe)
    ├── gangofthree.woff2     ← ¿Existe? (opcional)
    ├── gangofthree.woff      ← ¿Existe? (opcional)
    └── gangofthree.ttf       ← ¿Existe? (opcional)
```

---

## 🔍 Verificación de rutas exactas

### Para Windows, abre PowerShell y ejecuta:

```powershell
# Verificar que logo existe
Test-Path "C:\Users\Fran\Documents\WEBXPRIT\xprit-site\public\images\logo.png"

# Verificar que tipografía existe
Test-Path "C:\Users\Fran\Documents\WEBXPRIT\xprit-site\public\fonts\gangofthree.woff2"

# Ver contenido de la carpeta
ls "C:\Users\Fran\Documents\WEBXPRIT\xprit-site\public\images\"
ls "C:\Users\Fran\Documents\WEBXPRIT\xprit-site\public\fonts\"
```

Si ves `True`, ¡significa que el archivo existe! ✅

---

## ⚠️ Problemas comunes

### Logo no aparece

**Verificación:**
1. ¿El archivo se llama exactamente `logo.png`?
   - `logo.PNG` ❌ (mayúsculas pueden fallar)
   - `Logo.png` ❌ (mayúsculas pueden fallar)
   - `logo.png` ✅ (correcto)

2. ¿Está en la carpeta correcta?
   - `public/images/logo.png` ✅
   - `public/logo.png` ❌
   - `images/logo.png` ❌

3. ¿Reiniciaste el servidor?
   - Detén: `Ctrl + C`
   - Ejecuta: `npm run dev`

### Tipografía no se ve

**Verificación:**
1. ¿Los archivos existen?
   - Abre: `public/fonts/`
   - ¿Ves los archivos de fuente?

2. ¿Los nombres son exactos?
   - `gangofthree.woff2` ✅
   - `gangofthree.WOFF2` ❌
   - `gang-of-three.woff2` ❌

3. ¿Reiniciaste el servidor?
   - Detén: `Ctrl + C`
   - Ejecuta: `npm run dev`

4. ¿Borraste el cache?
   - `Ctrl + Shift + Delete`
   - O `Ctrl + Shift + R` (refresh duro)

---

## 🎯 Estructura final esperada

Una vez cargado todo, deberías tener:

```
xprit-site/
│
└── public/
    ├── images/
    │   └── logo.png                    ✅ TU LOGO
    │
    ├── fonts/
    │   ├── gangofthree.css             ✅ (ya existe)
    │   ├── gangofthree.woff2           ✅ TU TIPOGRAFÍA
    │   ├── gangofthree.woff            ✅ TU TIPOGRAFÍA
    │   └── gangofthree.ttf             ✅ TU TIPOGRAFÍA
    │
    └── [otros archivos públicos]
```

---

## ✅ Paso final

Una vez que hayas copiado:
1. Logo a `public/images/logo.png`
2. Tipografía a `public/fonts/`

**Ejecuta:**
```powershell
cd "C:\Users\Fran\Documents\WEBXPRIT\xprit-site"
npm run dev
```

**Abre:**
```
http://localhost:3000
```

**Verifica:**
- ✅ Logo visible en Header
- ✅ Logo visible en Footer
- ✅ Tipografía GangOfThree diferente
- ✅ Sin errores en consola (F12)

---

## 📞 Rutas para copiar-pegar

### En Windows (PowerShell):
```powershell
# Ir a la carpeta de imágenes
cd "C:\Users\Fran\Documents\WEBXPRIT\xprit-site\public\images"

# Ver archivos
ls

# Ir a la carpeta de fuentes
cd "C:\Users\Fran\Documents\WEBXPRIT\xprit-site\public\fonts"

# Ver archivos
ls
```

### En Explorador de archivos:
Copia y pega en la dirección:
```
C:\Users\Fran\Documents\WEBXPRIT\xprit-site\public\images
C:\Users\Fran\Documents\WEBXPRIT\xprit-site\public\fonts
```

---

## 🎉 ¡Listo!

Cuando hayas copiado los archivos en las ubicaciones correctas:
1. Reinicia el servidor
2. Abre http://localhost:3000
3. ¡Verás tu logo y tipografía en acción!

**¡Eso es todo lo que necesitas!** ✨
