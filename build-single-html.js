#!/usr/bin/env node
/**
 * Build single HTML file for easy deployment
 */

const fs = require('fs');
const path = require('path');

const DIST_DIR = './dist';
const OUTPUT_FILE = './dist/stealthguard.html';

async function buildSingleHtml() {
  console.log('Building single HTML...');

  if (!fs.existsSync(DIST_DIR)) {
    console.error('Dist directory not found. Run `vite build` first.');
    process.exit(1);
  }

  // Read index.html
  let indexHtml = fs.readFileSync(`${DIST_DIR}/index.html`, 'utf-8');

  // Inline CSS
  const cssFiles = fs.readdirSync(`${DIST_DIR}/assets`).filter((f) => f.endsWith('.css'));
  let inlinedCss = '';
  for (const cssFile of cssFiles) {
    const css = fs.readFileSync(`${DIST_DIR}/assets/${cssFile}`, 'utf-8');
    inlinedCss += css;
  }

  // Inline JS
  const jsFiles = fs.readdirSync(`${DIST_DIR}/assets`).filter((f) => f.endsWith('.js'));
  let inlinedJs = '';
  for (const jsFile of jsFiles) {
    const js = fs.readFileSync(`${DIST_DIR}/assets/${jsFile}`, 'utf-8');
    inlinedJs += js + '\n';
  }

  // Create single HTML
  const singleHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>StealthGuard</title>
  <style>${inlinedCss}</style>
</head>
<body>
  <div id="root"></div>
  <script>${inlinedJs}</script>
</body>
</html>`;

  fs.writeFileSync(OUTPUT_FILE, singleHtml);

  const sizeKB = Math.round(fs.statSync(OUTPUT_FILE).size / 1024);
  console.log(`✅ Built: ${OUTPUT_FILE} (${sizeKB} KB)`);
}

buildSingleHtml().catch((err) => {
  console.error('Build failed:', err);
  process.exit(1);
});
