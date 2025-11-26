#!/usr/bin/env node

/**
 * Script para convertir SVGs a PNG/WebP usando Sharp
 * Uso: node convert-svg-webp.js
 */

const fs = require('fs');
const path = require('path');

// Check if sharp is available
let sharp;
try {
  sharp = require('sharp');
} catch (e) {
  console.error('❌ Sharp no está instalado. Ejecuta: npm install sharp');
  process.exit(1);
}

const imagesDir = path.join(__dirname, 'public', 'images');

// Configuración de conversión por archivo
const conversions = [
  {
    name: 'board-hero.svg',
    width: 1920,
    height: 1080,
    output: 'board-hero.webp'
  },
  {
    name: 'minisumo-closed.svg',
    width: 480,
    height: 360,
    output: 'minisumo-closed.webp'
  },
  {
    name: 'minisumo-open.svg',
    width: 480,
    height: 360,
    output: 'minisumo-open.webp'
  },
  {
    name: 'velocista-closed.svg',
    width: 480,
    height: 360,
    output: 'velocista-closed.webp'
  },
  {
    name: 'velocista-open.svg',
    width: 480,
    height: 360,
    output: 'velocista-open.webp'
  },
  {
    name: 'laberinto-closed.svg',
    width: 480,
    height: 360,
    output: 'laberinto-closed.webp'
  },
  {
    name: 'laberinto-open.svg',
    width: 480,
    height: 360,
    output: 'laberinto-open.webp'
  },
  {
    name: 'board-specs.svg',
    width: 1600,
    height: 900,
    output: 'board-specs.webp'
  }
];

async function convertSVGtoWebP() {
  console.log('🎨 Iniciando conversión de SVG a WebP...\n');

  let successCount = 0;
  let errorCount = 0;

  for (const conversion of conversions) {
    const inputPath = path.join(imagesDir, conversion.name);
    const outputPath = path.join(imagesDir, conversion.output);

    if (!fs.existsSync(inputPath)) {
      console.error(`❌ No encontrado: ${conversion.name}`);
      errorCount++;
      continue;
    }

    try {
      console.log(`⏳ Convirtiendo: ${conversion.name} → ${conversion.output}`);
      
      // Leer SVG y convertir
      const svgBuffer = fs.readFileSync(inputPath);
      await sharp(svgBuffer, { density: 150 })
        .resize(conversion.width, conversion.height, {
          fit: 'fill',
          withoutEnlargement: false
        })
        .webp({ quality: 85 })
        .toFile(outputPath);

      const stats = fs.statSync(outputPath);
      const sizeKB = (stats.size / 1024).toFixed(2);
      console.log(`✅ ${conversion.output} (${sizeKB} KB)\n`);
      successCount++;
    } catch (error) {
      console.error(`❌ Error convirtiendo ${conversion.name}:`);
      console.error(error.message);
      errorCount++;
    }
  }

  console.log(`\n🎉 Conversión completada!`);
  console.log(`✅ Exitosas: ${successCount}`);
  console.log(`❌ Errores: ${errorCount}`);
}

convertSVGtoWebP().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
