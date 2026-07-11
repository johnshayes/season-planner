const C='season-planner-v2';
const ASSETS=['./','./index.html','./manifest.webmanifest','./icon.png'];
self.addEventListener('install',e=>{
  e.waitUntil(caches.open(C).then(c=>c.addAll(ASSETS)));
  self.skipWaiting();
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))));
  self.clients.claim();
});
// Network-first so updates arrive; cache fallback for offline.
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  e.respondWith(
    fetch(e.request).then(r=>{
      const cp=r.clone();
      caches.open(C).then(c=>c.put(e.request,cp));
      return r;
    }).catch(()=>caches.match(e.request,{ignoreSearch:true}))
  );
});
