/**
 * Real deployment functionality for GitHub Pages and Cloudflare
 * Requires API tokens from admin panel
 */

(function() {
  'use strict';

  // GitHub Deployment
  window.DeployGitHub = {
    async createRepo(token, name, isPrivate = true) {
      const response = await fetch('https://api.github.com/user/repos', {
        method: 'POST',
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name,
          private: isPrivate,
          auto_init: true,
          gitignore_template: 'Node'
        })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create repo');
      }
      
      return await response.json();
    },

    async enablePages(token, owner, repo) {
      // Enable GitHub Pages
      const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/pages`, {
        method: 'POST',
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          source: {
            branch: 'main',
            path: '/'
          }
        })
      });
      
      // Pages might already be enabled
      if (!response.ok && response.status !== 409) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to enable Pages');
      }
      
      return true;
    },

    async uploadFiles(token, owner, repo, files) {
      // Get latest commit SHA
      const refRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/ref/heads/main`, {
        headers: { 'Authorization': `token ${token}` }
      });
      
      if (!refRes.ok) throw new Error('Failed to get ref');
      const ref = await refRes.json();
      const baseSha = ref.object.sha;

      // Get base tree
      const commitRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/commits/${baseSha}`, {
        headers: { 'Authorization': `token ${token}` }
      });
      const commit = await commitRes.json();
      const baseTree = commit.tree.sha;

      // Create blobs for files
      const tree = [];
      for (const [path, content] of Object.entries(files)) {
        const blobRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/blobs`, {
          method: 'POST',
          headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            content: btoa(unescape(encodeURIComponent(content))), // Base64
            encoding: 'base64'
          })
        });
        const blob = await blobRes.json();
        
        tree.push({
          path: path,
          mode: '100644',
          type: 'blob',
          sha: blob.sha
        });
      }

      // Create new tree
      const treeRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/trees`, {
        method: 'POST',
        headers: {
          'Authorization': `token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          base_tree: baseTree,
          tree: tree
        })
      });
      const newTree = await treeRes.json();

      // Create commit
      const newCommitRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/commits`, {
        method: 'POST',
        headers: {
          'Authorization': `token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: 'Deploy HODL Dog from Admin Panel',
          tree: newTree.sha,
          parents: [baseSha]
        })
      });
      const newCommit = await newCommitRes.json();

      // Update ref
      await fetch(`https://api.github.com/repos/${owner}/${repo}/git/refs/heads/main`, {
        method: 'PATCH',
        headers: {
          'Authorization': `token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sha: newCommit.sha,
          force: false
        })
      });

      return newCommit.sha;
    },

    async deploy(token, subdomain) {
      const username = await this.getUsername(token);
      const repoName = subdomain.replace('.github.io', '');
      
      // Check if repo exists
      const exists = await this.repoExists(token, username, repoName);
      
      if (!exists) {
        await this.createRepo(token, repoName, true);
        await new Promise(r => setTimeout(r, 2000)); // Wait for repo creation
      }
      
      // Enable Pages
      await this.enablePages(token, username, repoName);
      
      // Get game files
      const files = await this.getGameFiles();
      
      // Upload
      const commitSha = await this.uploadFiles(token, username, repoName, files);
      
      return {
        url: `https://${username}.github.io/${repoName}`,
        commit: commitSha
      };
    },

    async getUsername(token) {
      const res = await fetch('https://api.github.com/user', {
        headers: { 'Authorization': `token ${token}` }
      });
      if (!res.ok) throw new Error('Invalid token');
      const data = await res.json();
      return data.login;
    },

    async repoExists(token, owner, repo) {
      const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
        headers: { 'Authorization': `token ${token}` }
      });
      return res.ok;
    },

    async getGameFiles() {
      // Collect all game files
      const files = {};
      
      // Main HTML
      const html = document.documentElement.outerHTML;
      files['index.html'] = html;
      
      // CSS files
      const cssLinks = document.querySelectorAll('link[rel="stylesheet"]');
      for (const link of cssLinks) {
        if (link.href.includes(window.location.origin)) {
          try {
            const res = await fetch(link.href);
            const text = await res.text();
            const path = link.href.replace(window.location.origin + '/', '');
            files[path] = text;
          } catch(e) {}
        }
      }
      
      // JS files
      const scripts = document.querySelectorAll('script[src]');
      for (const script of scripts) {
        if (script.src.includes(window.location.origin) && 
            !script.src.includes('admin.js') && // Skip admin in production
            !script.src.includes('admin-deploy.js')) {
          try {
            const res = await fetch(script.src);
            const text = await res.text();
            const path = script.src.replace(window.location.origin + '/', '');
            files[path] = text;
          } catch(e) {}
        }
      }
      
      return files;
    }
  };

  // Cloudflare Deployment (via Wrangler or Direct Upload)
  window.DeployCloudflare = {
    async deploy(token, accountId, projectName, subdomain) {
      // For Cloudflare Pages, we use Direct Upload API
      // First, get the files
      const files = await window.DeployGitHub.getGameFiles();
      
      // Create deployment
      const formData = new FormData();
      
      // Add each file
      for (const [path, content] of Object.entries(files)) {
        const blob = new Blob([content], { type: 'text/plain' });
        formData.append('file', blob, path);
      }
      
      const response = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${accountId}/pages/projects/${projectName}/deployments`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData
        }
      );
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.errors?.[0]?.message || 'Deploy failed');
      }
      
      const result = await response.json();
      
      return {
        url: `https://${subdomain}.pages.dev`,
        id: result.result.id
      };
    },

    async createProject(token, accountId, name) {
      const response = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${accountId}/pages/projects`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: name,
            production_branch: 'main'
          })
        }
      );
      
      if (!response.ok) {
        const error = await response.json();
        // Project might already exist
        if (!error.errors?.some(e => e.message.includes('already exists'))) {
          throw new Error(error.errors?.[0]?.message || 'Failed to create project');
        }
      }
      
      return true;
    },

    async listAccounts(token) {
      const res = await fetch('https://api.cloudflare.com/client/v4/accounts', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!res.ok) throw new Error('Invalid token');
      const data = await res.json();
      return data.result;
    }
  };

  // Export for admin.js
  window.DeployEngine = {
    async deploy(platform, config) {
      const { githubToken, cfToken, cfAccountId, subdomain } = config;
      
      const results = {};
      
      if (platform === 'github' || platform === 'both') {
        try {
          Admin.addLog('Starting GitHub deployment...', 'info');
          const ghResult = await window.DeployGitHub.deploy(githubToken, subdomain);
          results.github = ghResult;
          Admin.addLog(`GitHub deployed: ${ghResult.url}`, 'success');
        } catch (err) {
          Admin.addLog(`GitHub error: ${err.message}`, 'error');
          throw err;
        }
      }
      
      if (platform === 'cloudflare' || platform === 'both') {
        try {
          Admin.addLog('Starting Cloudflare deployment...', 'info');
          const cfResult = await window.DeployCloudflare.deploy(
            cfToken, cfAccountId, subdomain.replace(/[^a-z0-9-]/g, '-'), subdomain
          );
          results.cloudflare = cfResult;
          Admin.addLog(`Cloudflare deployed: ${cfResult.url}`, 'success');
        } catch (err) {
          Admin.addLog(`Cloudflare error: ${err.message}`, 'error');
          throw err;
        }
      }
      
      return results;
    }
  };

})();
