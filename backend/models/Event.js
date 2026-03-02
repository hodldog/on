const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../data');
const EVENTS_FILE = path.join(DATA_DIR, 'events.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// File-based Event storage
class Event {
  static async create(data) {
    const events = this.loadEvents();
    const event = {
      _id: Date.now().toString(36) + Math.random().toString(36).substr(2),
      ...data,
      timestamp: new Date(),
      createdAt: new Date()
    };
    events.push(event);
    this.saveEvents(events);
    return event;
  }

  static async insertMany(dataArray) {
    const events = this.loadEvents();
    const newEvents = dataArray.map(data => ({
      _id: Date.now().toString(36) + Math.random().toString(36).substr(2),
      ...data,
      timestamp: new Date(),
      createdAt: new Date()
    }));
    events.push(...newEvents);
    this.saveEvents(events);
    return newEvents;
  }

  static loadEvents() {
    try {
      if (fs.existsSync(EVENTS_FILE)) {
        return JSON.parse(fs.readFileSync(EVENTS_FILE, 'utf8'));
      }
    } catch (e) {
      console.error('Error loading events:', e.message);
    }
    return [];
  }

  static saveEvents(events) {
    try {
      // Keep only last 10000 events
      if (events.length > 10000) {
        events = events.slice(-10000);
      }
      fs.writeFileSync(EVENTS_FILE, JSON.stringify(events, null, 2));
    } catch (e) {
      console.error('Error saving events:', e.message);
    }
  }

  static async countDocuments(filter = {}) {
    const events = this.loadEvents();
    return events.filter(e => this.matchesFilter(e, filter)).length;
  }

  static async find(filter = {}, options = {}) {
    const events = this.loadEvents();
    let result = events.filter(e => this.matchesFilter(e, filter));
    
    if (options.sort) {
      const [field, order] = Object.entries(options.sort)[0];
      result.sort((a, b) => {
        const aVal = a[field] || 0;
        const bVal = b[field] || 0;
        return order === -1 ? (bVal > aVal ? 1 : -1) : (aVal > bVal ? 1 : -1);
      });
    }
    
    if (options.limit) {
      result = result.slice(0, options.limit);
    }
    
    return result;
  }

  static async aggregate(pipeline) {
    const events = this.loadEvents();
    let result = [...events];
    
    for (const stage of pipeline) {
      if (stage.$match) {
        result = result.filter(e => this.matchesFilter(e, stage.$match));
      }
      else if (stage.$group) {
        const { _id, ...accumulators } = stage.$group;
        const groups = {};
        
        for (const event of result) {
          const key = typeof _id === 'string' ? event[_id] : 'all';
          if (!groups[key]) groups[key] = { _id: key };
          
          for (const [field, expr] of Object.entries(accumulators)) {
            if (expr.$sum === 1) {
              groups[key][field] = (groups[key][field] || 0) + 1;
            } else if (expr.$sum && typeof expr.$sum === 'string') {
              const val = parseFloat(event[expr.$sum]) || 0;
              groups[key][field] = (groups[key][field] || 0) + val;
            } else if (expr.$first) {
              if (!groups[key][field]) groups[key][field] = event[expr.$first];
            }
          }
        }
        result = Object.values(groups);
      }
      else if (stage.$sort) {
        const [field, order] = Object.entries(stage.$sort)[0];
        result.sort((a, b) => {
          const aVal = a[field] || 0;
          const bVal = b[field] || 0;
          return order === -1 ? (bVal > aVal ? 1 : -1) : (aVal > bVal ? 1 : -1);
        });
      }
      else if (stage.$limit) {
        result = result.slice(0, stage.$limit);
      }
    }
    
    return result;
  }

  static matchesFilter(event, filter) {
    for (const [key, value] of Object.entries(filter)) {
      if (key === '$or') {
        return value.some(cond => this.matchesFilter(event, cond));
      }
      if (key === '$gte' && typeof value === 'object') {
        const [field, minVal] = Object.entries(value)[0];
        if (!(event[field] >= minVal)) return false;
      }
      else if (key === '$lt' && typeof value === 'object') {
        const [field, maxVal] = Object.entries(value)[0];
        if (!(event[field] < maxVal)) return false;
      }
      else if (event[key] !== value) {
        return false;
      }
    }
    return true;
  }
}

module.exports = { Event };
