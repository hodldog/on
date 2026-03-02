#!/usr/bin/env node
/**
 * StealthGuard JavaScript Obfuscator
 * Post-build obfuscation for production
 */

const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

const DIST_DIR = './dist';
const OBFUSCATE = process.env.NODE_ENV === 'production' || process.env.OBFUSCATE === 'true';

// Obfuscation options (optimized for speed while maintaining protection)
const obfuscatorOptions = {
  compact: true,
  controlFlowFlattening: false,
  deadCodeInjection: false,
  debugProtection: false,
  disableConsoleOutput: false,
  identifierNamesGenerator: 'hexadecimal',
  log: false,
  numbersToExpressions: false,
  renameGlobals: false,
  selfDefending: false,
  simplify: true,
  splitStrings: false,
  stringArray: true,
  stringArrayCallsTransform: false,
  stringArrayEncoding: [],
  stringArrayIndexShift: true,
  stringArrayRotate: true,
  stringArrayShuffle: true,
  stringArrayWrappersCount: 1,
  stringArrayWrappersChainedCalls: true,
  stringArrayThreshold: 0.5,
  transformObjectKeys: false,
  unicodeEscapeSequence: false,
};

async function obfuscate() {
  if (!OBFUSCATE) {
    console.log('Obfuscation skipped (not production)');
    return;
  }

  try {
    const JavaScriptObfuscator = require('javascript-obfuscator');
    
    console.log('Obfuscating JavaScript files...');

    const jsFiles = await glob(`${DIST_DIR}/assets/*.js`);

    for (const file of jsFiles) {
      try {
        const code = fs.readFileSync(file, 'utf-8');

        // Skip very large files
        if (code.length > 5_000_000) {
          console.log(`  Skipping large file: ${path.basename(file)}`);
          continue;
        }

        const obfuscated = JavaScriptObfuscator.obfuscate(code, obfuscatorOptions);

        fs.writeFileSync(file, obfuscated.getObfuscatedCode());
        console.log(`  ✓ Obfuscated: ${path.basename(file)}`);
      } catch (err) {
        console.error(`  ✗ Failed: ${path.basename(file)} - ${err.message}`);
      }
    }

    console.log('Obfuscation complete');
  } catch (err) {
    if (err.code === 'MODULE_NOT_FOUND') {
      console.log('javascript-obfuscator not installed, skipping obfuscation');
      return;
    }
    console.error('Obfuscation failed:', err);
    process.exit(1);
  }
}

obfuscate().catch((err) => {
  console.error('Obfuscation failed:', err);
  process.exit(1);
});
