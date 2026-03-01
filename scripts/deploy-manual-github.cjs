#!/usr/bin/env node
/**
 * Manual deployment to GitHub Pages using token
 * Usage: GITHUB_TOKEN=ghp_xxx node scripts/deploy-manual-github.cjs
 */

const fs = require('fs');
const { execSync } = require('child_process');
const https = require('https');

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_USERNAME = process.env.GITHUB_USERNAME || 'yourname';
const REPO_NAME = process.env.REPO_NAME || 'stealthguard-rescue';

if (!GITHUB_TOKEN) {
  console.error('❌ GITHUB_TOKEN not set');
  console.error('Usage: GITHUB_TOKEN=ghp_xxx node scripts/deploy-manual-github.cjs');
  process.exit(1);
}

async function createRepoIfNotExists() {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      name: REPO_NAME,
      private: false,
      auto_init: true,
    });

    const req = https.request(
      {
        hostname: 'api.github.com',
        path: '/user/repos',
        method: 'POST',
        headers: {
          'Authorization': `token ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
          'User-Agent': 'StealthGuard-Deploy',
        },
      },
      (res) => {
        let body = '';
        res.on('data', (chunk) => body += chunk);
        res.on('end', () => {
          const response = JSON.parse(body);
          if (res.statusCode === 201) {
            console.log('✅ Repository created:', response.html_url);
            resolve(true);
          } else if (response.message?.includes('already exists')) {
            console.log('ℹ️ Repository already exists');
            resolve(false);
          } else {
            reject(new Error(response.message || 'Failed to create repo'));
          }
        });
      }
    );

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function enableGitHubPages() {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      source: {
        branch: 'main',
        path: '/',
      },
    });

    const req = https.request(
      {
        hostname: 'api.github.com',
        path: `/repos/${GITHUB_USERNAME}/${REPO_NAME}/pages`,
        method: 'POST',
        headers: {
          'Authorization': `token ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
          'User-Agent': 'StealthGuard-Deploy',
        },
      },
      (res) => {
        let body = '';
        res.on('data', (chunk) => body += chunk);
        res.on('end', () => {
          if (res.statusCode === 201 || res.statusCode === 204) {
            console.log('✅ GitHub Pages enabled');
            resolve(true);
          } else {
            const response = JSON.parse(body);
            if (response.message?.includes('already enabled')) {
              console.log('ℹ️ GitHub Pages already enabled');
              resolve(false);
            } else {
              reject(new Error(response.message || 'Failed to enable Pages'));
            }
          }
        });
      }
    );

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function main() {
  console.log('🚀 GitHub Pages Manual Deployment\n');
  console.log(`Username: ${GITHUB_USERNAME}`);
  console.log(`Repository: ${REPO_NAME}`);
  console.log('');

  try {
    // Step 1: Create repository
    console.log('📦 Step 1: Creating repository...');
    await createRepoIfNotExists();

    // Step 2: Build
    console.log('\n🔨 Step 2: Building...');
    execSync('npm run build', { stdio: 'inherit' });

    // Step 3: Enable GitHub Pages
    console.log('\n🌐 Step 3: Enabling GitHub Pages...');
    await enableGitHubPages();

    // Step 4: Upload files
    console.log('\n📤 Step 4: Uploading files...');
    // This would require git operations with token
    console.log('Please run the following commands manually:');
    console.log('');
    console.log(`git remote add origin https://${GITHUB_TOKEN}@github.com/${GITHUB_USERNAME}/${REPO_NAME}.git`);
    console.log('git add dist/');
    console.log('git commit -m "Deploy to GitHub Pages"');
    console.log('git push origin main');
    console.log('');

    console.log('='.repeat(60));
    console.log('✅ DEPLOYMENT CONFIGURED');
    console.log('='.repeat(60));
    console.log(`URL: https://${GITHUB_USERNAME}.github.io/${REPO_NAME}`);
    console.log('='.repeat(60));

  } catch (err) {
    console.error('\n❌ Error:', err.message);
    process.exit(1);
  }
}

main();
