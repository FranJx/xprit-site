# ✨ TIPOGRAFÍA Y LOGO — Sistema Integrado

## 🎯 Estado actual

✅ **Sistema completamente configurado y listo**

Tu web ya tiene todo integrado para usar:
- ✅ Tipografía **GangOfThree** en logo y nombre
- ✅ Logo dinámico cargable en Header y Footer
- ✅ Sistema automático de fuentes
- ✅ Importación CSS lista

---

## 📍 Lo que necesitas hacer

### Paso 1: Cargar la tipografía TTF

**Carpeta:** `c:\Users\Fran\Documents\WEBXPRIT\xprit-site\public\fonts\`

**Archivo:** Copia tu `gangofthree.ttf` aquí

Ver guía: `CARGAR_GANGOFTHREE.md`

### Paso 2: Cargar el logo (opcional)

**Carpeta:** `c:\Users\Fran\Documents\WEBXPRIT\xprit-site\public\images\`

**Archivo:** Copia tu `logo.png` aquí

Ver guía: `CARGAR_LOGO.md`

### Paso 3: Reiniciar servidor

```powershell
Ctrl + C
npm run dev
```

### Paso 4: Recarga la web

```
http://localhost:3000
```

---

## 🎨 Dónde se usa GangOfThree

### Header (Navegación)
```
🎨 Logo + "XpriT Robotics"
├── Tamaño: 2rem
├── Tipografía: GangOfThree
├── Color: Gradient Cyan → Blue
└── Ubicación: Esquina superior izquierda
```

### Footer
```
🎨 Logo + "XpriT Robotics"
├── Tamaño: 1.25rem
├── Tipografía: GangOfThree
├── Color: Cyan
└── Ubicación: Primera columna
```

### Landing Page (Hero)
```
🎨 "XpriT Robotics"
├── Tamaño: 5rem (gigante)
├── Tipografía: GangOfThree (xxl)
├── Color: Gradient Cyan → Blue
└── Ubicación: Centro de la página
```

---

## 🎨 Clases CSS disponibles

```css
/* Clase base */
.gang-of-three
{
  font-family: 'GangOfThree', sans-serif;
  font-weight: normal;
  letter-spacing: 0.05em;
}

/* Tamaños predefinidos */
.gang-of-three-lg    /* 3rem (48px) */
.gang-of-three-xl    /* 4rem (64px) */
.gang-of-three-xxl   /* 5rem (80px) */
```

---

## 🔧 Cómo está integrado en el código

### En Header (`components/Header.tsx`)
```tsx
<span className="gang-of-three text-2xl bg-gradient-to-r from-cyan-400 to-blue-400">
  XpriT Robotics
</span>
```

### En Footer (`components/Footer.tsx`)
```tsx
<h4 className="gang-of-three text-xl text-cyan-400">
  XpriT Robotics
</h4>
```

### En Landing (`pages/index.tsx`)
```tsx
<h1 className="gang-of-three-xxl mb-6 bg-gradient-to-r from-cyan-400 to-blue-400">
  XpriT Robotics
</h1>
```

---

## 📁 Estructura de archivos

```
xprit-site/
├── public/
│   ├── fonts/
│   │   ├── gangofthree.css           ✅ (sistema listo)
│   │   └── gangofthree.ttf           ⏳ (copia tu TTF aquí)
│   │
│   └── images/
│       └── logo.png                  ⏳ (copia tu logo aquí)
│
├── pages/
│   ├── _app.tsx                      ✅ (importa CSS de fonts)
│   ├── index.tsx                     ✅ (usa gang-of-three-xxl)
│   └── [otras páginas]
│
├── components/
│   ├── Header.tsx                    ✅ (usa gang-of-three)
│   ├── Footer.tsx                    ✅ (usa gang-of-three)
│   └── [otros componentes]
│
├── CARGAR_GANGOFTHREE.md             📖 (guía TTF)
├── CARGAR_LOGO.md                    📖 (guía logo)
└── [otros archivos]
```

---

## 🚀 Comandos rápidos

### Copiar TTF desde PowerShell
```powershell
Copy-Item "C:\Users\Fran\Downloads\gangofthree.ttf" "c:\Users\Fran\Documents\WEBXPRIT\xprit-site\public\fonts\gangofthree.ttf"
```

### Copiar logo desde PowerShell
```powershell
Copy-Item "C:\Users\Fran\Downloads\logo.png" "c:\Users\Fran\Documents\WEBXPRIT\xprit-site\public\images\logo.png"
```

### Verificar archivos
```powershell
ls "c:\Users\Fran\Documents\WEBXPRIT\xprit-site\public\fonts\"
ls "c:\Users\Fran\Documents\WEBXPRIT\xprit-site\public\images\"
```

---

## 📸 Vista previa

Una vez todo configurado, verás:

### En Header y Footer
```
┌──────────────────────────────────────┐
│ [🎨] XpriT Robotics                  │  ← GangOfThree + logo
│ (con gradient cyan→blue)             │
└──────────────────────────────────────┘
```

### En Landing Page
```
┌─────────────────────────────────────┐
│                                     │
│    XpriT Robotics  ← GangOfThree    │
│    (GIGANTE - 80px)                 │
│                                     │
│    Ingenio. Diseño. Competencia.    │
│                                     │
└─────────────────────────────────────┘
```

---

## ✅ Checklist

- [ ] Copiar `gangofthree.ttf` a `public/fonts/`
- [ ] Copiar `logo.png` a `public/images/`
- [ ] Reiniciar servidor: `Ctrl + C` → `npm run dev`
- [ ] Recargar web: `Ctrl + Shift + R`
- [ ] Ver GangOfThree en Header
- [ ] Ver GangOfThree en Footer
- [ ] Ver GangOfThree en Landing
- [ ] Ver logo en Header y Footer
- [ ] ¡Celebrar! 🎉

---

## 🎓 Recursos incluidos

| Archivo | Propósito |
|---------|-----------|
| `CARGAR_GANGOFTHREE.md` | Guía paso a paso para TTF |
| `CARGAR_LOGO.md` | Guía paso a paso para logo |
| `gangofthree.css` | Importación de tipografía |
| Componentes (Header, Footer, Landing) | Integración lista |

---

## 💡 Notas importantes

✅ **GangOfThree ya está integrado en:**
- Header (2rem, gradient)
- Footer (1.25rem, cyan)
- Landing Hero (5rem, gradient)

✅ **El sistema carga automáticamente:**
- Tipografía desde `/fonts/gangofthree.css`
- Logo desde `/images/logo.png`

✅ **Sin cambios de código necesarios:**
- Solo copia los archivos
- Reinicia servidor
- ¡Listo!

---

## 🔍 Troubleshooting

### La tipografía no aparece
- Verifica que `gangofthree.ttf` esté en `public/fonts/`
- Reinicia: `Ctrl + C` → `npm run dev`
- Refresh: `Ctrl + Shift + R`

### El logo no aparece
- Verifica que `logo.png` esté en `public/images/`
- Revisa que sea PNG/JPG/SVG
- Consulta `CARGAR_LOGO.md`

### Todo se ve roto
- Limpia `.next`: `rm -r .next`
- Reinstala: `npm install`
- Inicia: `npm run dev`

---

## 🎉 ¡Listo!

Tu web está lista para mostrar:
1. ✨ **Tipografía profesional GangOfThree**
2. 🎨 **Logo personalizado de XpriT**
3. 🚀 **Identidad visual única**

Solo falta que cargues los archivos. ¡Adelante!

---

**Documentación completa:** Ver `CARGAR_GANGOFTHREE.md` y `CARGAR_LOGO.md`
