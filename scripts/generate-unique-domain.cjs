#!/usr/bin/env node
/**
 * Generate unique domain name with hodldog prefix
 * Format: hodldog[xx].github.io where xx = 2 random letters
 */

const https = require('https');

const chars = 'abcdefghijklmnopqrstuvwxyz';

function generateRandomSuffix() {
  return chars[Math.floor(Math.random() * 26)] + chars[Math.floor(Math.random() * 26)];
}

function checkGitHubRepoExists(repoName) {
  return new Promise((resolve) => {
    const req = https.request(
      {
        hostname: 'github.com',
        path: `/${repoName}`,
        method: 'HEAD',
        timeout: 5000,
      },
      (res) => {
        resolve(res.statusCode === 200);
      }
    );
    req.on('error', () => resolve(false));
    req.on('timeout', () => {
      req.destroy();
      resolve(false);
    });
    req.end();
  });
}

async function findUniqueDomain() {
  console.log('🔍 Finding unique domain...\n');
  
  // Try base name first
  const baseName = 'hodldog';
  console.log(`Checking: ${baseName}.github.io`);
  
  const baseExists = await checkGitHubRepoExists(baseName);
  if (!baseExists) {
    console.log('✅ Base domain available!');
    return baseName;
  }
  
  console.log('❌ Base domain taken, trying with suffix...\n');
  
  // Try with random suffixes
  for (let i = 0; i < 100; i++) {
    const suffix = generateRandomSuffix();
    const candidate = `${baseName}${suffix}`;
    
    process.stdout.write(`Checking: ${candidate}.github.io ... `);
    
    const exists = await checkGitHubRepoExists(candidate);
    if (!exists) {
      console.log('✅ AVAILABLE!');
      return candidate;
    }
    
    console.log('taken');
  }
  
  throw new Error('Could not find available domain after 100 attempts');
}

async function main() {
  try {
    const domain = await findUniqueDomain();
    
    console.log('\n' + '='.repeat(60));
    console.log('✅ UNIQUE DOMAIN FOUND');
    console.log('='.repeat(60));
    console.log(`Domain: ${domain}.github.io`);
    console.log(`Full URL: https://${domain}.github.io/stealthguard-rescue`);
    console.log('='.repeat(60));
    
    // Save to file
    const fs = require('fs');
    const config = {
      domain: `${domain}.github.io`,
      repoName: domain,
      generatedAt: new Date().toISOString(),
    };
    
    fs.writeFileSync('./domain-config.json', JSON.stringify(config, null, 2));
    console.log('\n💾 Configuration saved to: domain-config.json');
    
    console.log('\n📋 Next steps:');
    console.log('1. Create GitHub repo named:', domain);
    console.log('2. Push code to main branch');
    console.log('3. Enable GitHub Pages in Settings');
    console.log('4. Update src/config/domains.ts with new domain');
    
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

main();
