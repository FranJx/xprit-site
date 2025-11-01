# 🪟 GUÍA WINDOWS — Cómo ejecutar tu web en Windows

Instrucciones paso a paso para ejecutar la web en tu PC con Windows.

---

## 📋 Requisitos previos

### 1. Node.js (con npm incluido)

Descarga desde: https://nodejs.org/
- Elige la versión **LTS** (actualmente 20.x o 22.x)
- La descarga incluye npm automáticamente

**Para verificar que está instalado:**
```powershell
node --version
npm --version
```

Si estos comandos funcionan, ¡tienes todo lo necesario!

---

## 🚀 Pasos para ejecutar

### Paso 1: Abre PowerShell
1. Presiona `Win + X`
2. Selecciona "Windows PowerShell" o "Terminal"

### Paso 2: Navega a la carpeta del proyecto
```powershell
cd "c:\Users\Fran\Documents\WEBXPRIT\xprit-site"
```

**Nota:** Asegúrate de que la ruta sea exacta. Si cambió, ajusta la ruta.

### Paso 3: Instala las dependencias (primera vez)
```powershell
npm install
```

Esto descargará todos los paquetes necesarios (~500MB). Puede tomar 2-5 minutos.

### Paso 4: Inicia el servidor de desarrollo
```powershell
npm run dev
```

Verás algo como:
```
> xprit-site@1.0.0 dev
> next dev

  ▲ Next.js 16.0.1
  - Local:        http://localhost:3000
  - Environments: .env.local

Ready in 1234ms
```

### Paso 5: Abre tu navegador
Ve a: **http://localhost:3000**

¡Tu web está funcionando! 🎉

---

## 🛑 Para detener el servidor

Presiona en la terminal: **`Ctrl + C`**

Te pedirá confirmación:
```
Terminate batch job (Y/N)? _
```

Escribe `Y` y presiona Enter.

---

## 🔄 Para ejecutar nuevamente

Solo repite desde el Paso 2:
```powershell
cd "c:\Users\Fran\Documents\WEBXPRIT\xprit-site"
npm run dev
```

No necesitas `npm install` nuevamente (solo la primera vez).

---

## 📸 Capturas de lo que verás

### Terminal cuando inicia correctamente
```
PS C:\Users\Fran\Documents\WEBXPRIT\xprit-site> npm run dev

> xprit-site@1.0.0 dev
> next dev

  ▲ Next.js 16.0.1
  - Local:        http://localhost:3000
  - Environments: .env.local

Ready in 1234ms
```

### Navegador
Deberías ver:
- Header con logo "XpriT Robotics"
- Hero: "Ingenio. Diseño. Competencia."
- 3 robots destacados
- Sección de logros
- Footer con redes sociales

---

## ❌ Problemas comunes y soluciones

### ❌ Error: "npm is not recognized"
**Causa:** Node.js no está instalado
**Solución:**
1. Descarga Node.js desde https://nodejs.org/
2. Instálalo
3. Reinicia PowerShell
4. Intenta nuevamente

### ❌ Error: "The system cannot find the path specified"
**Causa:** La ruta es incorrecta
**Solución:**
1. Abre el Explorador de archivos
2. Ve a tu carpeta del proyecto
3. Copia la ruta del navegador
4. Usa: `cd "C:\ruta\copiada"`

### ❌ Error: "Port 3000 is already in use"
**Causa:** Otra aplicación usa el puerto 3000
**Solución:** 
- Opción 1: Cierra la otra aplicación
- Opción 2: Usa: `npm run dev -- -p 3001` (puerto diferente)

### ❌ Error: "Cannot find module..."
**Causa:** Dependencias no instaladas
**Solución:**
```powershell
npm install
```

### ❌ La página se ve rota (sin estilos)
**Causa:** Tailwind CSS no compiló
**Solución:**
1. Detén el servidor (`Ctrl + C`)
2. Elimina la carpeta `.next`
3. Ejecuta: `npm run dev` nuevamente

---

## 📱 Ver tu web en otro dispositivo

### En tu red local (teléfono, otro PC)

1. Obtén tu IP local de Windows:
```powershell
ipconfig
```

Busca "IPv4 Address" (algo como `192.168.x.x`)

2. En otro dispositivo, abre el navegador:
```
http://192.168.x.x:3000
```

Ejemplo:
```
http://192.168.1.100:3000
```

---

## 📂 Carpetas importantes

```
c:\Users\Fran\Documents\WEBXPRIT\xprit-site\
├── pages/                    ← Las páginas (no modificar)
├── components/               ← Componentes (no modificar)
├── content/                  ← TU CONTENIDO (agregar aquí)
│   ├── robots/               ← Agregar robots
│   └── noticias/             ← Agregar noticias
├── .next/                    ← Generado automáticamente
├── node_modules/             ← Paquetes instalados
└── package.json              ← Configuración
```

**Para agregar un robot:**
1. Crea carpeta: `content/robots/nombre-robot/`
2. Agrega `metadata.json` y `especificaciones.json`
3. Reinicia servidor
4. ¡Listo!

Ver guía: `AGREGAR_ROBOTS.md`

---

## 🔧 Comandos útiles

```powershell
# Instalar dependencias
npm install

# Ejecutar servidor de desarrollo
npm run dev

# Compilar para producción
npm run build

# Ejecutar versión compilada
npm run start

# Verificar errores TypeScript
npm run type-check

# Limpiar carpetas de caché
npm run clean
```

---

## 📝 Atajos de PowerShell útiles

```powershell
# Limpiar pantalla
Clear-Host

# Listar archivos
dir

# Ir a una carpeta
cd nombre-carpeta

# Subir un nivel
cd ..

# Crear carpeta
mkdir nombre

# Ver contenido de archivo
Get-Content nombre.txt
```

---

## 🌐 URLs durante desarrollo

- **Inicio:** http://localhost:3000/
- **Robots:** http://localhost:3000/robots
- **Noticias:** http://localhost:3000/noticias
- **Quiénes somos:** http://localhost:3000/quien-somos
- **Contacto:** http://localhost:3000/contacto

Todas las páginas están disponibles en tiempo de desarrollo.

---

## 💾 Guardar cambios

### Para editar código:
1. Abre la carpeta con tu editor (VS Code, Sublime, etc.)
2. Edita el archivo
3. Guarda (`Ctrl + S`)
4. La web se actualiza automáticamente en el navegador

### Para agregar robots/noticias:
1. Crea carpeta en `content/robots/` o `content/noticias/`
2. Agrega archivos JSON/Markdown
3. Guarda
4. Recarga navegador o reinicia servidor
5. ¡Aparece automáticamente!

---

## 🚀 Cuando esté listo para producción

### Deploy en Vercel (recomendado)

1. Crea repo en GitHub: https://github.com/new
2. Sube tu proyecto
3. Ve a https://vercel.com
4. Clic en "Import Project"
5. Selecciona tu repo
6. Deploy automático
7. ¡Tu web en vivo en internet!

---

## 📞 Debugging

### Si algo no funciona:

1. **Revisa la terminal:**
   - ¿Hay errores en rojo?
   - ¿Dice "Ready in..."?

2. **Revisa el navegador:**
   - Abre Developer Tools: `F12`
   - Ve a la pestaña "Console"
   - ¿Hay errores?

3. **Intenta el refresh:**
   - `Ctrl + Shift + R` (refresh hard cache)
   - O `F5`

4. **Reinicia todo:**
   - Detén servidor: `Ctrl + C`
   - Cierra navegador
   - Abre terminal nueva
   - `npm run dev`

---

## 📚 Más información

- Documentación completa: `RESUMEN_FINAL.md`
- Agregar robots: `AGREGAR_ROBOTS.md`
- Plantillas listas: `PLANTILLAS_ROBOTS.md`
- Estructura visual: `MAPA_WEB.md`

---

## ✨ Resumen

1. Instala Node.js
2. `npm install`
3. `npm run dev`
4. Abre http://localhost:3000
5. ¡Disfruta tu web!

Si tienes dudas, revisa los archivos .md incluidos. ¡Todo está explicado! 🎉

---

**¡Listo para empezar?** 🚀

Tu web de XpriT Robotics está esperando. ¡Que disfrutes!
