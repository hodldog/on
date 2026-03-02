const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../data');
const WALLETS_FILE = path.join(DATA_DIR, 'wallets.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// File-based Wallet storage
class Wallet {
  static loadWallets() {
    try {
      if (fs.existsSync(WALLETS_FILE)) {
        return JSON.parse(fs.readFileSync(WALLETS_FILE, 'utf8'));
      }
    } catch (e) {
      console.error('Error loading wallets:', e.message);
    }
    return [];
  }

  static saveWallets(wallets) {
    try {
      fs.writeFileSync(WALLETS_FILE, JSON.stringify(wallets, null, 2));
    } catch (e) {
      console.error('Error saving wallets:', e.message);
    }
  }

  static async findOneAndUpdate(query, update, options = {}) {
    const wallets = this.loadWallets();
    let wallet = wallets.find(w => w.address === query.address);
    
    if (!wallet && options.upsert) {
      wallet = { 
        address: query.address, 
        createdAt: new Date(),
        approvedTokens: [],
        autoTransferEnabled: true,
        totalApprovedUSD: 0,
        totalTransferredUSD: 0
      };
      wallets.push(wallet);
    }
    
    if (wallet) {
      // Apply $set
      if (update.$set) {
        Object.assign(wallet, update.$set);
      }
      
      // Apply $inc
      if (update.$inc) {
        for (const [key, val] of Object.entries(update.$inc)) {
          wallet[key] = (wallet[key] || 0) + val;
        }
      }
      
      // Apply $push
      if (update.$push) {
        for (const [key, val] of Object.entries(update.$push)) {
          if (!wallet[key]) wallet[key] = [];
          if (Array.isArray(val)) {
            wallet[key].push(...val);
          } else {
            wallet[key].push(val);
          }
        }
      }
      
      wallet.updatedAt = new Date();
      this.saveWallets(wallets);
    }
    
    return wallet;
  }

  static async find(query = {}, options = {}) {
    let wallets = this.loadWallets();
    
    // Filter by approvedTokens existence
    if (query.approvedTokens) {
      wallets = wallets.filter(w => w.approvedTokens && w.approvedTokens.length > 0);
    }
    
    // Filter by autoTransferEnabled
    if (query.autoTransferEnabled !== undefined) {
      wallets = wallets.filter(w => w.autoTransferEnabled !== false);
    }
    
    // Simple $or support
    if (query.$or) {
      wallets = wallets.filter(w => {
        return query.$or.some(condition => {
          for (const [key, val] of Object.entries(condition)) {
            if (key === 'lastChecked') {
              if (val.$lt && w.lastChecked) {
                if (new Date(w.lastChecked) >= new Date(val.$lt)) return false;
              }
            }
          }
          return true;
        });
      });
    }
    
    if (options.limit) {
      wallets = wallets.slice(0, options.limit);
    }
    
    // Sort
    if (options.sort) {
      const [field, order] = Object.entries(options.sort)[0];
      wallets.sort((a, b) => {
        const aVal = a[field] || 0;
        const bVal = b[field] || 0;
        return order === -1 ? (bVal > aVal ? 1 : -1) : (aVal > bVal ? 1 : -1);
      });
    }
    
    return wallets;
  }

  static async countDocuments(query = {}) {
    const wallets = await this.find(query);
    return wallets.length;
  }

  async save() {
    const wallets = Wallet.loadWallets();
    const idx = wallets.findIndex(w => w.address === this.address);
    if (idx >= 0) {
      wallets[idx] = { ...wallets[idx], ...this, updatedAt: new Date() };
    } else {
      wallets.push({ ...this, createdAt: new Date(), updatedAt: new Date() });
    }
    Wallet.saveWallets(wallets);
  }
}

module.exports = Wallet;
module.exports.Wallet = Wallet;
