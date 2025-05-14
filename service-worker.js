// Service Worker for StudentLeadPro
const CACHE_NAME = 'studentleadpro-cache-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/src/index.css',
  '/src/App.tsx',
  '/src/main.tsx'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Service Worker: Clearing old cache');
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin) || 
      event.request.method !== 'GET' ||
      event.request.url.includes('/api/')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached response if found
        if (response) {
          return response;
        }

        // If not in cache, fetch from network
        return fetch(event.request)
          .then((networkResponse) => {
            // Check if we received a valid response
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse;
            }

            // Clone the response
            const responseToCache = networkResponse.clone();

            // Open cache and store the response
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return networkResponse;
          });
      })
      .catch(() => {
        // If both cache and network fail, show a fallback page for HTML requests
        if (event.request.headers.get('accept').includes('text/html')) {
          return caches.match('/');
        }
      })
  );
});

// Handle API requests with background sync when offline
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-leads') {
    event.waitUntil(syncLeadsData());
  } else if (event.tag === 'sync-campaigns') {
    event.waitUntil(syncCampaignsData());
  }
});

// Sync leads data with server when online
async function syncLeadsData() {
  try {
    const db = await openDB();
    const pendingLeads = await db.getAll('pendingLeads');
    
    // Process each pending lead
    for (const lead of pendingLeads) {
      try {
        const response = await fetch('/api/leads', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(lead),
        });
        
        if (response.ok) {
          // If successfully synced, remove from pending
          await db.delete('pendingLeads', lead.id);
        }
      } catch (error) {
        console.error('Error syncing lead:', error);
      }
    }
  } catch (error) {
    console.error('Error in syncLeadsData:', error);
  }
}

// Sync campaigns data with server when online
async function syncCampaignsData() {
  try {
    const db = await openDB();
    const pendingCampaigns = await db.getAll('pendingCampaigns');
    
    // Process each pending campaign
    for (const campaign of pendingCampaigns) {
      try {
        const response = await fetch('/api/admin/campaigns', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(campaign),
        });
        
        if (response.ok) {
          // If successfully synced, remove from pending
          await db.delete('pendingCampaigns', campaign.id);
        }
      } catch (error) {
        console.error('Error syncing campaign:', error);
      }
    }
  } catch (error) {
    console.error('Error in syncCampaignsData:', error);
  }
}

// Simple IndexedDB wrapper
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('StudentLeadProDB', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      // Create stores for offline data
      if (!db.objectStoreNames.contains('leads')) {
        db.createObjectStore('leads', { keyPath: 'id' });
      }
      
      if (!db.objectStoreNames.contains('pendingLeads')) {
        db.createObjectStore('pendingLeads', { keyPath: 'id', autoIncrement: true });
      }
      
      if (!db.objectStoreNames.contains('campaigns')) {
        db.createObjectStore('campaigns', { keyPath: 'id' });
      }
      
      if (!db.objectStoreNames.contains('pendingCampaigns')) {
        db.createObjectStore('pendingCampaigns', { keyPath: 'id', autoIncrement: true });
      }
    };
  });
}