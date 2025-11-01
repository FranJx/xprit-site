# 📂 UBICACIONES EXACTAS — Carpetas para archivos

## 🎯 Resumen rápido

Tienes **2 carpetas** donde copiar tus archivos:

### 1️⃣ Tipografía TTF
```
c:\Users\Fran\Documents\WEBXPRIT\xprit-site\public\fonts\
```
Copia aquí: `gangofthree.ttf`

### 2️⃣ Logo
```
c:\Users\Fran\Documents\WEBXPRIT\xprit-site\public\images\
```
Copia aquí: `logo.png`

---

## 🚀 Forma más fácil: Copiar rutas

### Para abrir carpeta de fuentes

Copia esta ruta en el Explorador:
```
c:\Users\Fran\Documents\WEBXPRIT\xprit-site\public\fonts\
```

**Pasos:**
1. Abre Explorador (Windows + E)
2. En la barra de direcciones, pega la ruta
3. Presiona Enter
4. ¡Carpeta abierta!

### Para abrir carpeta de imágenes

Copia esta ruta en el Explorador:
```
c:\Users\Fran\Documents\WEBXPRIT\xprit-site\public\images\
```

**Pasos:**
1. Abre Explorador (Windows + E)
2. En la barra de direcciones, pega la ruta
3. Presiona Enter
4. ¡Carpeta abierta!

---

## 🖱️ Paso a paso visual

### Opción A: Explorador de archivos

1. **Abre Windows + E**
   ```
   Se abre el Explorador de archivos
   ```

2. **En la barra de direcciones:**
   ```
   C:\Users\Fran\Documents\WEBXPRIT\xprit-site\public\fonts\
   ```

3. **Presiona Enter**
   ```
   Se abre la carpeta fonts
   ```

4. **Pega tu archivo TTF aquí**
   ```
   Click derecho → Pegar
   ```

5. **Repite para la carpeta images:**
   ```
   C:\Users\Fran\Documents\WEBXPRIT\xprit-site\public\images\
   ```

---

## 📱 También desde PowerShell

### Abrir carpeta desde PowerShell

```powershell
# Para ver la carpeta fonts
explorer "c:\Users\Fran\Documents\WEBXPRIT\xprit-site\public\fonts\"
```

```powershell
# Para ver la carpeta images
explorer "c:\Users\Fran\Documents\WEBXPRIT\xprit-site\public\images\"
```

---

## 📂 Vista en árbol

Tu estructura debe verse así:

```
c:\Users\Fran\Documents\WEBXPRIT\xprit-site\
│
├── public/
│   ├── fonts/
│   │   ├── gangofthree.css        ← Ya existe
│   │   └── gangofthree.ttf        ← COPIA TU TTF AQUÍ
│   │
│   └── images/
│       └── logo.png               ← COPIA TU LOGO AQUÍ
│
└── [resto del proyecto...]
```

---

## ✅ Verificación

Después de copiar, deberías ver:

### En `public/fonts/`
```
gangofthree.css
gangofthree.ttf          ✅ (tu archivo)
```

### En `public/images/`
```
logo.png                 ✅ (tu archivo)
```

---

## 🔗 Rutas directas para copiar

### Copiar con un clic

**Copia la ruta de la carpeta fonts:**
```
c:\Users\Fran\Documents\WEBXPRIT\xprit-site\public\fonts\
```

**Copia la ruta de la carpeta images:**
```
c:\Users\Fran\Documents\WEBXPRIT\xprit-site\public\images\
```

---

## 🎯 Flujo completo

1. **Busca tu archivo TTF**
   - Ubicación: Descargas, Documentos, etc.
   - Copia la ruta

2. **Abre Explorador**
   - Windows + E

3. **Ve a fonts**
   - Pega: `c:\Users\Fran\Documents\WEBXPRIT\xprit-site\public\fonts\`
   - Enter

4. **Copia el TTF aquí**
   - Click derecho → Pegar
   - Espera a que termine

5. **Repite para logo**
   - Ve a images
   - Copia el logo PNG

6. **Reinicia servidor**
   - PowerShell: `Ctrl + C`
   - `npm run dev`

7. **¡Listo!**
   - Abre http://localhost:3000
   - Recarga: Ctrl + Shift + R

---

## 🆘 Si necesitas ayuda

### Problema: "No encuentro la carpeta"

**Solución:**
1. Abre Explorador (Windows + E)
2. En la barra de direcciones, pega EXACTAMENTE:
   ```
   C:\Users\Fran\Documents\WEBXPRIT\xprit-site\public
   ```
3. Presiona Enter
4. Deberías ver dos carpetas: `fonts` y `images`

### Problema: "No sé dónde está mi archivo TTF"

**Solución:**
1. Busca el archivo:
   - Explorador → Buscar (Ctrl + F)
   - Escribe: `gangofthree.ttf`
   - Windows lo encontrará

2. Una vez localizado:
   - Click derecho → Copiar
   - Ve a la carpeta fonts (arriba)
   - Click derecho → Pegar

---

## 📝 Comandos útiles

### Listar archivos en carpeta fonts
```powershell
ls "c:\Users\Fran\Documents\WEBXPRIT\xprit-site\public\fonts\"
```

### Listar archivos en carpeta images
```powershell
ls "c:\Users\Fran\Documents\WEBXPRIT\xprit-site\public\images\"
```

### Ir directamente a fonts
```powershell
cd "c:\Users\Fran\Documents\WEBXPRIT\xprit-site\public\fonts\"
```

### Ver contenido
```powershell
dir
```

---

## 🎨 Una vez que los archivos estén en su lugar

1. **Reinicia servidor**
   ```powershell
   Ctrl + C
   npm run dev
   ```

2. **Recarga navegador**
   ```
   http://localhost:3000
   Ctrl + Shift + R
   ```

3. **Verifica:**
   - ¿Ves GangOfThree en el logo?
   - ¿Ves tu logo en el header?
   - ¿Ves tu logo en el footer?

¡Si todo se ve correcto, ¡misión cumplida! 🎉

---

## 💡 Pro tips

✅ Usa drag & drop: Arrastra los archivos directamente a la carpeta
✅ Copia la ruta completa para evitar errores
✅ Verifica que sea `logo.png` (minúsculas)
✅ TTF debe ser exactamente `gangofthree.ttf`

¡Eso es todo! Super simple. 🚀
