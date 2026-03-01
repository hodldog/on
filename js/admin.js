/**
 * HODL Dog Admin Panel
 * Access: Press Ctrl+Shift+A or type 'admin777888' in console
 * Features: Domain monitoring, deployment, statistics
 */

(function() {
  'use strict';

  const ADMIN_PASSWORD = '777888';
  
  // Domain configuration
  const DOMAINS = [
    { name: 'GitHub Pages', priority: 1, type: 'primary', score: 10 },
    { name: 'Cloudflare Pages', priority: 2, type: 'secondary', score: 15 },
    { name: 'Vercel', priority: 3, type: 'secondary', score: 20 },
    { name: 'IP Fallback', priority: 99, type: 'fallback', score: 80 },
  ];

  // State
  let isOpen = false;
  let activeTab = 'domains';
  let deploymentLog = [];

  // Generate hodldog subdomain
  function generateSubdomain() {
    const base = 'hodldog';
    const chars = 'abcdefghijklmnopqrstuvwxyz';
    let suffix = '';
    
    // Try base first, then add 2 random letters
    for (let attempt = 0; attempt < 100; attempt++) {
      const candidate = attempt === 0 ? base : base + suffix;
      // In real implementation, check availability via API
      // For now, return with random suffix
      if (attempt > 0) {
        suffix = chars[Math.floor(Math.random() * 26)] + chars[Math.floor(Math.random() * 26)];
        return base + suffix;
      }
    }
    return base + 'xx';
  }

  // Create admin panel HTML
  function createAdminPanel() {
    const panel = document.createElement('div');
    panel.id = 'admin-panel';
    panel.innerHTML = `
      <div class="admin-overlay">
        <div class="admin-modal">
          <div class="admin-header">
            <h2>🎮 HODL Dog Admin</h2>
            <button class="admin-close" onclick="Admin.close()">✕</button>
          </div>
          
          <div class="admin-tabs">
            <button class="admin-tab ${activeTab === 'domains' ? 'active' : ''}" onclick="Admin.switchTab('domains')">
              🌐 Domains
            </button>
            <button class="admin-tab ${activeTab === 'deploy' ? 'active' : ''}" onclick="Admin.switchTab('deploy')">
              🚀 Deploy
            </button>
            <button class="admin-tab ${activeTab === 'stats' ? 'active' : ''}" onclick="Admin.switchTab('stats')">
              📊 Stats
            </button>
            <button class="admin-tab ${activeTab === 'logs' ? 'active' : ''}" onclick="Admin.switchTab('logs')">
              📝 Logs
            </button>
          </div>
          
          <div class="admin-content" id="admin-content">
            ${renderContent()}
          </div>
        </div>
      </div>
    `;
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
      .admin-overlay {
        position: fixed;
        top: 0; left: 0; right: 0; bottom: 0;
        background: rgba(0,0,0,0.9);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: system-ui, -apple-system, sans-serif;
      }
      .admin-modal {
        background: #1a1a2e;
        border-radius: 16px;
        width: 90%;
        max-width: 800px;
        max-height: 90vh;
        overflow: hidden;
        border: 1px solid #333;
        box-shadow: 0 25px 50px rgba(0,0,0,0.5);
      }
      .admin-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
      }
      .admin-header h2 {
        margin: 0;
        font-size: 20px;
      }
      .admin-close {
        background: none;
        border: none;
        color: white;
        font-size: 24px;
        cursor: pointer;
        padding: 0;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 8px;
        transition: background 0.2s;
      }
      .admin-close:hover {
        background: rgba(255,255,255,0.2);
      }
      .admin-tabs {
        display: flex;
        background: #16162a;
        border-bottom: 1px solid #333;
      }
      .admin-tab {
        flex: 1;
        padding: 16px;
        background: none;
        border: none;
        color: #888;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
        transition: all 0.2s;
        border-bottom: 2px solid transparent;
      }
      .admin-tab:hover {
        color: #fff;
        background: rgba(255,255,255,0.05);
      }
      .admin-tab.active {
        color: #667eea;
        border-bottom-color: #667eea;
        background: rgba(102,126,234,0.1);
      }
      .admin-content {
        padding: 24px;
        overflow-y: auto;
        max-height: 60vh;
      }
      
      /* Domain Monitor Styles */
      .domain-list {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      .domain-item {
        background: #252540;
        border-radius: 12px;
        padding: 16px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border: 1px solid #333;
      }
      .domain-item.online {
        border-left: 4px solid #00d26a;
      }
      .domain-item.offline {
        border-left: 4px solid #ff4757;
      }
      .domain-item.unknown {
        border-left: 4px solid #ffa502;
      }
      .domain-info h4 {
        margin: 0 0 4px 0;
        color: #fff;
        font-size: 16px;
      }
      .domain-url {
        color: #888;
        font-size: 12px;
        font-family: monospace;
      }
      .domain-status {
        display: flex;
        align-items: center;
        gap: 12px;
      }
      .trust-score {
        padding: 4px 12px;
        border-radius: 20px;
        font-size: 12px;
        font-weight: 600;
      }
      .trust-score.good {
        background: rgba(0,210,106,0.2);
        color: #00d26a;
      }
      .trust-score.medium {
        background: rgba(255,165,2,0.2);
        color: #ffa502;
      }
      .trust-score.bad {
        background: rgba(255,71,87,0.2);
        color: #ff4757;
      }
      .status-badge {
        padding: 6px 12px;
        border-radius: 6px;
        font-size: 12px;
        font-weight: 600;
      }
      .status-badge.online {
        background: #00d26a;
        color: #000;
      }
      .status-badge.offline {
        background: #ff4757;
        color: #fff;
      }
      .domain-actions {
        display: flex;
        gap: 8px;
        margin-top: 16px;
      }
      .admin-btn {
        padding: 10px 20px;
        border-radius: 8px;
        border: none;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
      }
      .admin-btn.primary {
        background: #667eea;
        color: white;
      }
      .admin-btn.primary:hover {
        background: #5a6fd6;
      }
      .admin-btn.secondary {
        background: #333;
        color: #fff;
      }
      .admin-btn.secondary:hover {
        background: #444;
      }
      
      /* Deploy Form */
      .deploy-form {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      .form-group {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .form-group label {
        color: #888;
        font-size: 14px;
      }
      .form-group input, .form-group select {
        padding: 12px;
        border-radius: 8px;
        border: 1px solid #333;
        background: #252540;
        color: #fff;
        font-size: 14px;
      }
      .form-group input:focus, .form-group select:focus {
        outline: none;
        border-color: #667eea;
      }
      .generated-name {
        background: rgba(102,126,234,0.1);
        padding: 16px;
        border-radius: 8px;
        text-align: center;
        font-family: monospace;
        font-size: 18px;
        color: #667eea;
        border: 1px dashed #667eea;
      }
      
      /* Stats Grid */
      .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 16px;
      }
      .stat-card {
        background: #252540;
        padding: 20px;
        border-radius: 12px;
        text-align: center;
      }
      .stat-value {
        font-size: 32px;
        font-weight: bold;
        color: #667eea;
        margin-bottom: 8px;
      }
      .stat-label {
        color: #888;
        font-size: 12px;
        text-transform: uppercase;
      }
      
      /* Logs */
      .log-container {
        background: #0f0f1a;
        border-radius: 8px;
        padding: 16px;
        font-family: monospace;
        font-size: 12px;
        max-height: 300px;
        overflow-y: auto;
      }
      .log-entry {
        margin-bottom: 8px;
        padding: 8px;
        border-radius: 4px;
      }
      .log-entry.success {
        background: rgba(0,210,106,0.1);
        color: #00d26a;
      }
      .log-entry.error {
        background: rgba(255,71,87,0.1);
        color: #ff4757;
      }
      .log-entry.info {
        background: rgba(102,126,234,0.1);
        color: #667eea;
      }
      .log-time {
        color: #666;
        margin-right: 8px;
      }
      
      /* Password Modal */
      .password-modal {
        position: fixed;
        top: 0; left: 0; right: 0; bottom: 0;
        background: rgba(0,0,0,0.95);
        z-index: 10001;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .password-box {
        background: #1a1a2e;
        padding: 40px;
        border-radius: 16px;
        text-align: center;
        border: 1px solid #333;
      }
      .password-box h3 {
        margin: 0 0 20px 0;
        color: #fff;
      }
      .password-box input {
        padding: 16px;
        font-size: 24px;
        width: 200px;
        text-align: center;
        border-radius: 8px;
        border: 1px solid #333;
        background: #252540;
        color: #fff;
        margin-bottom: 16px;
      }
      .password-box input:focus {
        outline: none;
        border-color: #667eea;
      }
    `;
    document.head.appendChild(style);
    
    return panel;
  }

  function renderContent() {
    switch(activeTab) {
      case 'domains': return renderDomains();
      case 'deploy': return renderDeploy();
      case 'stats': return renderStats();
      case 'logs': return renderLogs();
      default: return renderDomains();
    }
  }

  function renderDomains() {
    return `
      <div class="domain-list" id="domain-list">
        ${DOMAINS.map(d => `
          <div class="domain-item unknown" data-domain="${d.name}">
            <div class="domain-info">
              <h4>${d.name}</h4>
              <div class="domain-url">Checking...</div>
            </div>
            <div class="domain-status">
              <span class="trust-score ${d.score <= 15 ? 'good' : d.score <= 30 ? 'medium' : 'bad'}">
                Trust: ${100 - d.score}/100
              </span>
              <span class="status-badge offline">Checking</span>
            </div>
          </div>
        `).join('')}
      </div>
      <div class="domain-actions">
        <button class="admin-btn primary" onclick="Admin.checkAllDomains()">
          🔄 Check All
        </button>
        <button class="admin-btn secondary" onclick="Admin.autoSelectBest()">
          ✨ Auto-Select Best
        </button>
      </div>
    `;
  }

  function renderDeploy() {
    const suggestedName = generateSubdomain();
    return `
      <div class="deploy-form">
        <div class="form-group">
          <label>Platform</label>
          <select id="deploy-platform" onchange="Admin.onPlatformChange(this.value)">
            <option value="github">GitHub Pages</option>
            <option value="cloudflare">Cloudflare Pages</option>
            <option value="both">Both (Recommended)</option>
          </select>
        </div>
        
        <div class="form-group">
          <label>Subdomain Name</label>
          <div class="generated-name" id="subdomain-name">${suggestedName}.github.io</div>
          <button class="admin-btn secondary" style="margin-top:8px" onclick="Admin.regenerateName()">
            🎲 Generate New
          </button>
        </div>
        
        <div class="form-group" id="github-token-group">
          <label>GitHub Token (Classic)</label>
          <input type="password" id="github-token" placeholder="ghp_xxxxxxxxxxxx">
          <small style="color:#666">Create at: Settings → Developer → Personal access tokens → Classic</small>
        </div>
        
        <div class="form-group" id="cf-token-group" style="display:none">
          <label>Cloudflare API Token</label>
          <input type="password" id="cf-token" placeholder="Your Cloudflare API Token">
          <small style="color:#666">Create at: dash.cloudflare.com → My Profile → API Tokens</small>
        </div>
        
        <div class="form-group" id="cf-account-group" style="display:none">
          <label>Cloudflare Account ID</label>
          <input type="text" id="cf-account" placeholder="Your Account ID">
          <button class="admin-btn secondary" style="margin-top:8px" onclick="Admin.fetchCFAccounts()">
            🔍 Fetch from Token
          </button>
        </div>
        
        <div class="form-group">
          <label>
            <input type="checkbox" id="use-custom-domain"> Use Custom Domain
          </label>
        </div>
        
        <div class="form-group" id="custom-domain-group" style="display:none">
          <label>Custom Domain</label>
          <input type="text" id="custom-domain" placeholder="game.yourdomain.com">
        </div>
        
        <button class="admin-btn primary" onclick="Admin.deploy()" style="margin-top:8px">
          🚀 Deploy Now
        </button>
        
        <div id="deploy-status" style="margin-top:16px"></div>
      </div>
    `;
  }

  function renderStats() {
    // Get stats from localStorage or defaults
    const gameStats = JSON.parse(localStorage.getItem('hodldog_stats') || '{}');
    return `
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-value">${gameStats.players || '0'}</div>
          <div class="stat-label">Total Players</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${gameStats.wallets || '0'}</div>
          <div class="stat-label">Wallets</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${gameStats.completions || '0'}</div>
          <div class="stat-label">Completions</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${gameStats.earnings || '0'}</div>
          <div class="stat-label">DOGE Sent</div>
        </div>
      </div>
      
      <div style="margin-top:24px">
        <h4 style="color:#888;margin-bottom:12px">Recent Connections</h4>
        <div class="log-container" id="connections-log">
          <div class="log-entry info">
            <span class="log-time">${new Date().toLocaleTimeString()}</span>
            Admin panel opened
          </div>
        </div>
      </div>
    `;
  }

  function renderLogs() {
    return `
      <div class="log-container" id="admin-logs">
        ${deploymentLog.length === 0 ? 
          '<div class="log-entry info"><span class="log-time">--:--:--</span> No logs yet</div>' :
          deploymentLog.map(log => `
            <div class="log-entry ${log.type}">
              <span class="log-time">${log.time}</span>
              ${log.message}
            </div>
          `).join('')
        }
      </div>
      <div class="domain-actions">
        <button class="admin-btn secondary" onclick="Admin.clearLogs()">Clear</button>
        <button class="admin-btn secondary" onclick="Admin.exportLogs()">Export</button>
      </div>
    `;
  }

  // Check domain health
  async function checkDomain(domain) {
    // Simulate check - in real implementation, fetch domain
    await new Promise(r => setTimeout(r, 500 + Math.random() * 1000));
    return Math.random() > 0.3; // 70% online for demo
  }

  // Public API
  window.Admin = {
    open: function() {
      if (isOpen) return;
      
      // Show password modal first
      const pwdModal = document.createElement('div');
      pwdModal.className = 'password-modal';
      pwdModal.innerHTML = `
        <div class="password-box">
          <h3>🔐 Enter Admin Password</h3>
          <input type="password" id="admin-pwd" maxlength="6" placeholder="******">
          <br>
          <button class="admin-btn primary" onclick="Admin.verifyPassword()">Enter</button>
        </div>
      `;
      document.body.appendChild(pwdModal);
      
      document.getElementById('admin-pwd').focus();
      document.getElementById('admin-pwd').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') Admin.verifyPassword();
      });
      
      window._pwdModal = pwdModal;
    },
    
    verifyPassword: function() {
      const input = document.getElementById('admin-pwd').value;
      if (input === ADMIN_PASSWORD) {
        window._pwdModal.remove();
        delete window._pwdModal;
        
        const panel = createAdminPanel();
        document.body.appendChild(panel);
        isOpen = true;
        
        // Auto-check domains
        setTimeout(() => this.checkAllDomains(), 500);
        
        this.addLog('Admin panel accessed', 'success');
      } else {
        const input = document.getElementById('admin-pwd');
        input.style.borderColor = '#ff4757';
        input.value = '';
        input.placeholder = 'Wrong!';
        setTimeout(() => {
          input.style.borderColor = '';
          input.placeholder = '******';
        }, 1000);
      }
    },
    
    close: function() {
      const panel = document.getElementById('admin-panel');
      if (panel) {
        panel.remove();
        isOpen = false;
      }
    },
    
    switchTab: function(tab) {
      activeTab = tab;
      document.getElementById('admin-content').innerHTML = renderContent();
      
      // Update tab buttons
      document.querySelectorAll('.admin-tab').forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent.toLowerCase().includes(tab)) {
          btn.classList.add('active');
        }
      });
      
      if (tab === 'domains') {
        setTimeout(() => this.checkAllDomains(), 100);
      }
    },
    
    checkAllDomains: async function() {
      const items = document.querySelectorAll('.domain-item');
      
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const domain = DOMAINS[i];
        const statusBadge = item.querySelector('.status-badge');
        
        statusBadge.textContent = 'Checking...';
        item.className = 'domain-item unknown';
        
        const isOnline = await checkDomain(domain);
        
        item.classList.remove('unknown', 'online', 'offline');
        item.classList.add(isOnline ? 'online' : 'offline');
        
        statusBadge.className = 'status-badge ' + (isOnline ? 'online' : 'offline');
        statusBadge.textContent = isOnline ? 'ONLINE' : 'OFFLINE';
      }
      
      this.addLog('Domain check completed', 'info');
    },
    
    autoSelectBest: function() {
      // Sort by score and select best online domain
      const best = DOMAINS.filter(d => d.score <= 20)[0];
      if (best) {
        this.addLog(`Auto-selected: ${best.name}`, 'success');
        alert(`Best domain selected: ${best.name}\nTrust Score: ${100 - best.score}/100`);
      }
    },
    
    regenerateName: function() {
      const newName = generateSubdomain();
      const platform = document.getElementById('deploy-platform').value;
      const suffix = platform === 'cloudflare' ? '.pages.dev' : 
                     platform === 'github' ? '.github.io' : '.github.io';
      document.getElementById('subdomain-name').textContent = newName + suffix;
    },
    
    deploy: async function() {
      const platform = document.getElementById('deploy-platform').value;
      const subdomain = document.getElementById('subdomain-name').textContent.replace('.github.io', '').replace('.pages.dev', '');
      const githubToken = document.getElementById('github-token')?.value;
      const cfToken = document.getElementById('cf-token')?.value;
      const cfAccount = document.getElementById('cf-account')?.value;
      
      if ((platform === 'github' || platform === 'both') && !githubToken) {
        alert('Please enter GitHub token');
        return;
      }
      
      if ((platform === 'cloudflare' || platform === 'both') && (!cfToken || !cfAccount)) {
        alert('Please enter Cloudflare token and account ID');
        return;
      }
      
      const status = document.getElementById('deploy-status');
      status.innerHTML = '<div style="color:#667eea">🚀 Deploying... This may take 30-60 seconds</div>';
      
      try {
        const results = await window.DeployEngine.deploy(platform, {
          githubToken,
          cfToken,
          cfAccountId: cfAccount,
          subdomain
        });
        
        let html = '<div style="background:rgba(0,210,106,0.1);color:#00d26a;padding:16px;border-radius:8px">';
        html += '✅ Deployed successfully!<br><br>';
        
        if (results.github) {
          html += `<small>🐙 GitHub: <a href="${results.github.url}" target="_blank" style="color:#00d26a">${results.github.url}</a></small><br>`;
        }
        if (results.cloudflare) {
          html += `<small>☁️ Cloudflare: <a href="${results.cloudflare.url}" target="_blank" style="color:#00d26a">${results.cloudflare.url}</a></small>`;
        }
        
        html += '</div>';
        status.innerHTML = html;
        
        this.addLog(`Deployed ${platform}: ${subdomain}`, 'success');
      } catch (err) {
        status.innerHTML = `
          <div style="background:rgba(255,71,87,0.1);color:#ff4757;padding:16px;border-radius:8px">
            ❌ Deployment failed: ${err.message}
          </div>
        `;
        this.addLog(`Deploy failed: ${err.message}`, 'error');
      }
    },
    
    fetchCFAccounts: async function() {
      const token = document.getElementById('cf-token').value;
      if (!token) {
        alert('Please enter Cloudflare token first');
        return;
      }
      
      try {
        const accounts = await window.DeployCloudflare.listAccounts(token);
        if (accounts.length === 1) {
          document.getElementById('cf-account').value = accounts[0].id;
          this.addLog(`Auto-filled Account ID: ${accounts[0].name}`, 'success');
        } else if (accounts.length > 1) {
          const id = prompt(`Multiple accounts found. Enter ID:\n${accounts.map(a => `${a.name}: ${a.id}`).join('\n')}`);
          if (id) document.getElementById('cf-account').value = id;
        } else {
          alert('No accounts found with this token');
        }
      } catch (err) {
        alert('Failed to fetch accounts: ' + err.message);
      }
    },
    
    onPlatformChange: function(platform) {
      const ghGroup = document.getElementById('github-token-group');
      const cfGroup = document.getElementById('cf-token-group');
      const cfAccountGroup = document.getElementById('cf-account-group');
      
      if (platform === 'github') {
        ghGroup.style.display = 'block';
        cfGroup.style.display = 'none';
        cfAccountGroup.style.display = 'none';
      } else if (platform === 'cloudflare') {
        ghGroup.style.display = 'none';
        cfGroup.style.display = 'block';
        cfAccountGroup.style.display = 'block';
      } else {
        ghGroup.style.display = 'block';
        cfGroup.style.display = 'block';
        cfAccountGroup.style.display = 'block';
      }
      
      // Update subdomain suffix
      const suffix = platform === 'cloudflare' ? '.pages.dev' : '.github.io';
      const nameEl = document.getElementById('subdomain-name');
      const currentName = nameEl.textContent.split('.')[0];
      nameEl.textContent = currentName + suffix;
    },
    
    addLog: function(message, type = 'info') {
      deploymentLog.unshift({
        time: new Date().toLocaleTimeString(),
        message,
        type
      });
      if (deploymentLog.length > 100) deploymentLog.pop();
      
      if (activeTab === 'logs') {
        this.switchTab('logs');
      }
    },
    
    clearLogs: function() {
      deploymentLog = [];
      this.switchTab('logs');
    },
    
    exportLogs: function() {
      const data = JSON.stringify(deploymentLog, null, 2);
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `hodldog-logs-${Date.now()}.json`;
      a.click();
    }
  };

  // Keyboard shortcut: Ctrl+Shift+A
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key === 'A') {
      e.preventDefault();
      Admin.open();
    }
  });

  // Console access: type admin777888
  Object.defineProperty(window, 'admin777888', {
    get: function() {
      Admin.open();
      return 'Opening admin panel...';
    }
  });

  console.log('%c🔧 HODL Dog Admin', 'color:#667eea;font-size:16px;font-weight:bold');
  console.log('Access: Ctrl+Shift+A or type %cadmin777888', 'color:#00d26a');

})();
