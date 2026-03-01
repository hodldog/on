const CACHE='hodl-dog-v1';
const ASSETS=['/','/index.html','/css/style.css','/js/game.js','/js/i18n.js','/js/wallet.js','/js/audio.js'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(res=>{if(res.status===200){const c=res.clone();caches.open(CACHE).then(ca=>ca.put(e.request,c))}return res}).catch(()=>caches.match('/index.html'))))});
