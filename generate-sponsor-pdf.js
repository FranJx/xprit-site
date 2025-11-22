const generatePdf = require('html-pdf-node');
const fs = require('fs');
const path = require('path');

const options = {
  format: 'A4',
  margin: { top: '10mm', bottom: '10mm', left: '10mm', right: '10mm' },
  printBackground: true,
  displayHeaderFooter: true,
  headerTemplate: '<div></div>',
  footerTemplate: '<div style="font-size: 10px; margin: 0 10mm; width: 100%; text-align: center; color: #666;"><span class="pageNumber"></span> de <span class="totalPages"></span></div>',
};

const htmlFile = path.join(__dirname, 'public', 'sponsorship2025.html');
const outputFile = path.join(__dirname, 'docs', 'sponsors', 'PROGRAMA_SPONSORS_2025.pdf');

// Leer el archivo HTML
const html = fs.readFileSync(htmlFile, 'utf8');

// Generar PDF
generatePdf.generatePdf({ content: html }, options).then(pdfBuffer => {
  fs.writeFileSync(outputFile, pdfBuffer);
  console.log(`✅ PDF generado exitosamente en: ${outputFile}`);
}).catch(err => {
  console.error('❌ Error al generar PDF:', err);
  process.exit(1);
});
