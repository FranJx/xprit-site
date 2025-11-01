# 🎨 Cómo cargar tu Logo de XpriT Robotics

## 📍 Ubicación de la carpeta

```
c:\Users\Fran\Documents\WEBXPRIT\xprit-site\public\images\
```

La carpeta ya está lista para recibir tu logo.

---

## 📋 Pasos para agregar el logo

### Opción 1: Copiar y pegar (recomendado)

1. **Busca tu archivo de logo**
   - Formatos soportados: PNG, JPG, SVG, WEBP
   - Nombre sugerido: `logo.png`

2. **Copia el archivo**
   - Click derecho → Copiar

3. **Ve a la carpeta**
   - Ruta: `c:\Users\Fran\Documents\WEBXPRIT\xprit-site\public\images\`

4. **Pega el archivo**
   - Click derecho → Pegar

5. **Renómbralo a `logo.png`** (si tiene otro nombre)
   - Click derecho → Renombrar

### Opción 2: Desde PowerShell

Si tu logo está en Descargas:

```powershell
# Ajusta la ruta si es diferente
Copy-Item "C:\Users\Fran\Downloads\logo.png" "c:\Users\Fran\Documents\WEBXPRIT\xprit-site\public\images\logo.png"
```

Verifica:
```powershell
ls "c:\Users\Fran\Documents\WEBXPRIT\xprit-site\public\images\"
```

---

## 🖼️ Formatos soportados

| Formato | Ventajas | Desventajas |
|---------|----------|------------|
| **PNG** | Transparencia, calidad | Más pesado |
| **JPG** | Más ligero | Sin transparencia |
| **SVG** | Escalable, vectorial | Requiere editor |
| **WEBP** | Moderno, optimizado | No todos los navegadores |

**Recomendación:** PNG si tiene fondo transparente, JPG si es fotografía.

---

## 📐 Tamaño recomendado

- **Ancho mínimo:** 200px
- **Ancho ideal:** 300-400px
- **Formato:** Cuadrado o rectangular

---

## ✅ Verificación

Después de copiar, tu carpeta debería verse:

```
public/images/
└── logo.png          ✅ (tu logo aquí)
```

---

## 🎯 Dónde aparecerá tu logo

Una vez cargado, se mostrará en:

1. **Header (navegación superior)**
   - Logo de 40x40px junto al nombre
   - Aparece en todas las páginas

2. **Footer (pie de página)**
   - Logo de 32x32px al inicio
   - En la sección de "Sobre XpriT"

3. **Landing Page (inicio)**
   - Puedes agregarlo en el hero si lo deseas

---

## 🚀 Próximos pasos

1. ✅ Copiar `gangofthree.ttf` a `public/fonts/`
2. ✅ Copiar `logo.png` a `public/images/`
3. ✅ Reiniciar servidor: `Ctrl + C` → `npm run dev`
4. ✅ Recarga la web: `Ctrl + Shift + R`
5. ✅ ¡Ver el logo y tipografía en vivo!

---

## 🎨 Estructura final

```
xprit-site/
├── public/
│   ├── fonts/
│   │   ├── gangofthree.css      (ya existe)
│   │   └── gangofthree.ttf      (coloca tu TTF aquí)
│   │
│   └── images/
│       └── logo.png             (coloca tu logo aquí)
│
└── [resto del proyecto]
```

---

## 🔍 Si el logo no aparece

1. **Verifica que el archivo esté en la ruta correcta**
   - `c:\Users\Fran\Documents\WEBXPRIT\xprit-site\public\images\logo.png`

2. **Reinicia el servidor**
   - Detén: `Ctrl + C`
   - Inicia: `npm run dev`

3. **Limpia el navegador**
   - Presiona: `Ctrl + Shift + R`

4. **Verifica la consola**
   - Abre: `F12`
   - ¿Hay errores 404?

5. **Comprueba el nombre del archivo**
   - Debe ser exactamente: `logo.png`
   - (Mayúsculas importan en servidor)

---

## 💡 Tips

- Usa PNG con fondo transparente para mejor visualización
- El logo se escalará automáticamente en mobile
- Si cambias el logo, solo reinicia el servidor

¡Tu logo está a un paso de estar en vivo! 🎉
