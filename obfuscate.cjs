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

// Obfuscation options
const obfuscatorOptions = {
  compact: true,
  controlFlowFlattening: true,
  controlFlowFlatteningThreshold: 0.5,
  deadCodeInjection: true,
  deadCodeInjectionThreshold: 0.2,
  debugProtection: true,
  debugProtectionInterval: 2000,
  disableConsoleOutput: true,
  identifierNamesGenerator: 'hexadecimal',
  log: false,
  numbersToExpressions: true,
  renameGlobals: false,
  selfDefending: true,
  simplify: true,
  splitStrings: true,
  splitStringsChunkLength: 10,
  stringArray: true,
  stringArrayCallsTransform: true,
  stringArrayEncoding: ['base64'],
  stringArrayIndexShift: true,
  stringArrayRotate: true,
  stringArrayShuffle: true,
  stringArrayWrappersCount: 2,
  stringArrayWrappersChainedCalls: true,
  stringArrayWrappersParametersMaxCount: 4,
  stringArrayWrappersType: 'function',
  stringArrayThreshold: 0.75,
  transformObjectKeys: true,
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
