# 📁 Cómo cargar tu archivo TTF de GangOfThree

## 🎯 Objetivo
Colocar tu archivo `gangofthree.ttf` en la carpeta correcta para que se use en el logo y nombre de XpriT Robotics.

---

## 📍 Ubicación de la carpeta

```
c:\Users\Fran\Documents\WEBXPRIT\xprit-site\public\fonts\
```

Esta carpeta ya existe y está lista.

---

## 📋 Pasos para agregar el archivo TTF

### Opción 1: Copiar y pegar (más fácil)

1. **Abre el Explorador de archivos** (Windows + E)

2. **Ve a la carpeta donde tienes el archivo TTF**
   - Ejemplo: Descargas, Documentos, etc.

3. **Copia el archivo `gangofthree.ttf`**
   - Click derecho → Copiar

4. **Ve a la carpeta del proyecto**
   - Ruta: `c:\Users\Fran\Documents\WEBXPRIT\xprit-site\public\fonts\`

5. **Pega el archivo**
   - Click derecho → Pegar

6. **Verifica que esté ahí**
   - Deberías ver `gangofthree.ttf` en la carpeta

### Opción 2: Desde PowerShell (más rápido)

Si tienes el archivo en descargas:

```powershell
# Reemplaza la ruta si tu archivo está en otro lado
Copy-Item "C:\Users\Fran\Downloads\gangofthree.ttf" "c:\Users\Fran\Documents\WEBXPRIT\xprit-site\public\fonts\gangofthree.ttf"
```

Luego verifica:
```powershell
ls "c:\Users\Fran\Documents\WEBXPRIT\xprit-site\public\fonts\"
```

Deberías ver `gangofthree.ttf` listado.

---

## ✅ Verificación

Después de copiar el archivo, tu carpeta debería verse así:

```
public/fonts/
├── gangofthree.css          ✅
└── gangofthree.ttf          ✅ (tu archivo)
```

---

## 🎨 Una vez que el archivo esté en su lugar

La tipografía se usará automáticamente en:

1. **Header** - Logo y nombre "XpriT Robotics"
2. **Landing page** - Texto principal "Ingenio. Diseño. Competencia."
3. **Footer** - Logo en el pie de página

Solo necesitas:
1. Copiar el archivo TTF
2. Reiniciar el servidor: `Ctrl + C` y `npm run dev`
3. Recarga la web

¡La tipografía GangOfThree aparecerá automáticamente!

---

## 🔍 Solución de problemas

### Si la tipografía no aparece:

1. **Verifica que el archivo esté en la carpeta correcta**
   - Ruta: `c:\Users\Fran\Documents\WEBXPRIT\xprit-site\public\fonts\gangofthree.ttf`

2. **Reinicia el servidor**
   - Detén: `Ctrl + C`
   - Inicia: `npm run dev`

3. **Limpia el navegador**
   - Presiona: `Ctrl + Shift + R` (hard refresh)

4. **Verifica en Developer Tools**
   - Abre: `F12`
   - Ve a "Network"
   - Recarga
   - Busca `gangofthree.ttf`
   - ¿Devuelve 200 (OK)? → Archivo cargado correctamente

---

## 📦 Estructura final

```
xprit-site/
└── public/
    └── fonts/
        ├── gangofthree.css       (ya existe)
        └── gangofthree.ttf       (coloca aquí tu archivo)
```

---

## 🚀 Próximo paso

1. ✅ Copiar `gangofthree.ttf` a `public/fonts/`
2. ✅ Reiniciar servidor
3. ✅ Ver tipografía en el logo
4. ✅ (Opcional) Cargar imagen del logo en `public/logo/` si lo tienes

¡Es así de fácil! 🎉
