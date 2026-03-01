#!/usr/bin/env node
/**
 * Deploy with automatic fallback to multiple hosting providers
 * Usage: node scripts/deploy-with-fallback.cjs
 */

const { execSync } = require('child_process');
const fs = require('fs');

const DEPLOYMENT_CONFIG = {
  primary: {
    name: 'GitHub Pages',
    type: 'github',
    url: 'https://yourname.github.io/stealthguard-rescue',
    checkUrl: 'https://yourname.github.io/stealthguard-rescue',
    score: 10, // Trust score
  },
  secondary: {
    name: 'Cloudflare Pages',
    type: 'cloudflare',
    url: 'https://stealthguard-rescue.pages.dev',
    checkUrl: 'https://stealthguard-rescue.pages.dev',
    score: 15,
  },
  fallback: {
    name: 'IP Direct',
    type: 'ip',
    url: 'http://194.60.133.152:8888',
    checkUrl: 'http://194.60.133.152:8888',
    score: 80,
  },
};

async function checkDomainHealth(url) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    
    const response = await fetch(url, {
      method: 'HEAD',
      signal: controller.signal,
    });
    
    clearTimeout(timeout);
    return response.ok;
  } catch {
    return false;
  }
}

async function deployToGitHub() {
  console.log('🚀 Deploying to GitHub Pages...');
  try {
    // Push to trigger GitHub Actions
    execSync('git push origin main', { stdio: 'inherit' });
    console.log('✅ GitHub Pages deployment triggered');
    return true;
  } catch (err) {
    console.error('❌ GitHub deployment failed:', err.message);
    return false;
  }
}

async function deployToCloudflare() {
  console.log('🚀 Deploying to Cloudflare Pages...');
  try {
    execSync('wrangler pages deploy dist --project-name=stealthguard-rescue', {
      stdio: 'inherit',
    });
    console.log('✅ Cloudflare Pages deployed');
    return true;
  } catch (err) {
    console.error('❌ Cloudflare deployment failed:', err.message);
    return false;
  }
}

async function main() {
  console.log('🔄 Starting deployment with fallback...\n');

  // Check current health of all domains
  console.log('📊 Checking domain health...');
  for (const [key, config] of Object.entries(DEPLOYMENT_CONFIG)) {
    const isHealthy = await checkDomainHealth(config.checkUrl);
    console.log(`  ${config.name}: ${isHealthy ? '✅ Healthy' : '❌ Down'}`);
  }

  // Try primary (GitHub Pages)
  console.log('\n🎯 Trying primary deployment (GitHub Pages)...');
  if (await deployToGitHub()) {
    console.log('\n✅ Primary deployment successful');
    console.log(`🔗 URL: ${DEPLOYMENT_CONFIG.primary.url}`);
    
    // Also deploy to secondary for redundancy
    console.log('\n🔄 Deploying to secondary (Cloudflare) for redundancy...');
    await deployToCloudflare();
    
    return;
  }

  // Fallback to Cloudflare
  console.log('\n⚠️ Primary failed, trying secondary (Cloudflare)...');
  if (await deployToCloudflare()) {
    console.log('\n✅ Secondary deployment successful');
    console.log(`🔗 URL: ${DEPLOYMENT_CONFIG.secondary.url}`);
    return;
  }

  // Last resort - keep IP
  console.log('\n⚠️ All deployments failed');
  console.log(`🔄 Falling back to IP: ${DEPLOYMENT_CONFIG.fallback.url}`);
  console.log('⚠️ Warning: IP has high suspicion score (80/100)');
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Deployment failed:', err);
    process.exit(1);
  });
