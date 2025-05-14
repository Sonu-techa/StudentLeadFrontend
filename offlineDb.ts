/**
 * Offline Database utility using IndexedDB
 * Handles caching and syncing for offline mode operation
 */

// Database name and version
const DB_NAME = 'StudentLeadProDB';
const DB_VERSION = 1;

// Store names
const STORES = {
  LEADS: 'leads',
  PENDING_LEADS: 'pendingLeads',
  CAMPAIGNS: 'campaigns',
  PENDING_CAMPAIGNS: 'pendingCampaigns',
  FORMS: 'forms',
  SETTINGS: 'settings',
};

/**
 * Opens the IndexedDB database
 * @returns Promise with IDBDatabase
 */
export async function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(new Error('Failed to open database'));
    request.onsuccess = () => resolve(request.result);

    // Handle database upgrades/creation
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      // Create object stores if they don't exist
      if (!db.objectStoreNames.contains(STORES.LEADS)) {
        db.createObjectStore(STORES.LEADS, { keyPath: 'id' });
      }
      
      if (!db.objectStoreNames.contains(STORES.PENDING_LEADS)) {
        db.createObjectStore(STORES.PENDING_LEADS, { keyPath: 'id', autoIncrement: true });
      }
      
      if (!db.objectStoreNames.contains(STORES.CAMPAIGNS)) {
        db.createObjectStore(STORES.CAMPAIGNS, { keyPath: 'id' });
      }
      
      if (!db.objectStoreNames.contains(STORES.PENDING_CAMPAIGNS)) {
        db.createObjectStore(STORES.PENDING_CAMPAIGNS, { keyPath: 'id', autoIncrement: true });
      }
      
      if (!db.objectStoreNames.contains(STORES.FORMS)) {
        db.createObjectStore(STORES.FORMS, { keyPath: 'id' });
      }
      
      if (!db.objectStoreNames.contains(STORES.SETTINGS)) {
        db.createObjectStore(STORES.SETTINGS, { keyPath: 'key' });
      }
    };
  });
}

/**
 * Add or update an item in a store
 * @param storeName Name of the object store
 * @param item Item to add/update
 * @returns Promise resolving to item ID
 */
export async function saveItem<T>(storeName: string, item: T): Promise<IDBValidKey> {
  const db = await openDatabase();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.put(item);
    
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    
    transaction.oncomplete = () => db.close();
  });
}

/**
 * Get an item by ID from a store
 * @param storeName Name of the object store
 * @param id Item ID to retrieve
 * @returns Promise resolving to the item or undefined
 */
export async function getItem<T>(storeName: string, id: IDBValidKey): Promise<T | undefined> {
  const db = await openDatabase();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.get(id);
    
    request.onsuccess = () => resolve(request.result as T);
    request.onerror = () => reject(request.error);
    
    transaction.oncomplete = () => db.close();
  });
}

/**
 * Get all items from a store
 * @param storeName Name of the object store
 * @returns Promise resolving to an array of items
 */
export async function getAllItems<T>(storeName: string): Promise<T[]> {
  const db = await openDatabase();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.getAll();
    
    request.onsuccess = () => resolve(request.result as T[]);
    request.onerror = () => reject(request.error);
    
    transaction.oncomplete = () => db.close();
  });
}

/**
 * Delete an item from a store
 * @param storeName Name of the object store
 * @param id Item ID to delete
 * @returns Promise resolving when item is deleted
 */
export async function deleteItem(storeName: string, id: IDBValidKey): Promise<void> {
  const db = await openDatabase();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.delete(id);
    
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
    
    transaction.oncomplete = () => db.close();
  });
}

/**
 * Clear all items from a store
 * @param storeName Name of the object store
 * @returns Promise resolving when store is cleared
 */
export async function clearStore(storeName: string): Promise<void> {
  const db = await openDatabase();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.clear();
    
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
    
    transaction.oncomplete = () => db.close();
  });
}

/**
 * Check online status and trigger background sync if needed
 */
export function checkOnlineStatus() {
  if (navigator.onLine) {
    // Attempt to sync pending data when back online
    if ('serviceWorker' in navigator && 'SyncManager' in window) {
      navigator.serviceWorker.ready
        .then(registration => {
          registration.sync.register('sync-leads');
          registration.sync.register('sync-campaigns');
        })
        .catch(err => console.error('Background sync registration failed:', err));
    }
  }
}

/**
 * Save a lead when offline
 * @param lead Lead data to save
 * @returns Promise resolving to temporary lead ID
 */
export async function saveOfflineLead(lead: any): Promise<IDBValidKey> {
  // Store in pending leads for sync later
  return saveItem(STORES.PENDING_LEADS, {
    ...lead,
    createdAt: new Date().toISOString(),
    pendingSync: true,
  });
}

/**
 * Save app settings
 * @param key Setting key
 * @param value Setting value
 * @returns Promise resolving when setting is saved
 */
export async function saveSetting(key: string, value: any): Promise<IDBValidKey> {
  return saveItem(STORES.SETTINGS, { key, value });
}

/**
 * Get a specific setting
 * @param key Setting key
 * @returns Promise resolving to setting value or undefined
 */
export async function getSetting(key: string): Promise<any> {
  const setting = await getItem(STORES.SETTINGS, key);
  return setting ? (setting as any).value : undefined;
}

// Setup event listeners for online/offline status
export function setupOfflineSync() {
  window.addEventListener('online', checkOnlineStatus);
  
  // Register service worker for offline support
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js')
        .then(registration => {
          console.log('ServiceWorker registration successful with scope:', registration.scope);
        })
        .catch(err => {
          console.error('ServiceWorker registration failed:', err);
        });
    });
  }
}