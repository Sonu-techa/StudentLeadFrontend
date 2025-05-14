import { useState, useEffect, useCallback } from 'react';
import { 
  checkOnlineStatus, 
  getAllItems, 
  saveOfflineLead, 
  setupOfflineSync 
} from '@/lib/offlineDb';

/**
 * Hook for managing offline mode functionality
 * Provides methods for handling offline data and syncing
 */
export function useOfflineMode() {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [pendingLeads, setPendingLeads] = useState<any[]>([]);
  const [pendingCampaigns, setPendingCampaigns] = useState<any[]>([]);
  const [offlineDataLoaded, setOfflineDataLoaded] = useState<boolean>(false);

  // Initialize offline mode support
  useEffect(() => {
    // Set up service worker and sync events
    setupOfflineSync();
    
    // Set up online/offline event listeners
    const handleOnline = () => {
      setIsOnline(true);
      checkOnlineStatus();
    };
    
    const handleOffline = () => {
      setIsOnline(false);
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Load initial offline data
    loadOfflineData();
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Load data from IndexedDB
  const loadOfflineData = useCallback(async () => {
    try {
      // Load pending leads
      const leads = await getAllItems<any>('pendingLeads');
      setPendingLeads(leads);
      
      // Load pending campaigns
      const campaigns = await getAllItems<any>('pendingCampaigns');
      setPendingCampaigns(campaigns);
      
      setOfflineDataLoaded(true);
    } catch (error) {
      console.error('Error loading offline data:', error);
    }
  }, []);

  // Submit a lead in offline mode
  const submitOfflineLead = useCallback(async (leadData: any) => {
    try {
      // Save lead to IndexedDB for later sync
      const id = await saveOfflineLead(leadData);
      
      // Update local state
      setPendingLeads(prev => [...prev, { ...leadData, id, pendingSync: true }]);
      
      return { success: true, id };
    } catch (error) {
      console.error('Error saving offline lead:', error);
      return { success: false, error };
    }
  }, []);

  // Check if specific data is available offline
  const isDataAvailableOffline = useCallback(async (storeName: string, id?: number) => {
    try {
      const items = await getAllItems(storeName);
      if (id) {
        return items.some((item: any) => item.id === id);
      }
      return items.length > 0;
    } catch (error) {
      console.error(`Error checking offline data for ${storeName}:`, error);
      return false;
    }
  }, []);

  // Force data sync when back online
  const syncOfflineData = useCallback(() => {
    if (isOnline && 'serviceWorker' in navigator && 'SyncManager' in window) {
      navigator.serviceWorker.ready.then(registration => {
        registration.sync.register('sync-leads');
        registration.sync.register('sync-campaigns');
      });
    }
  }, [isOnline]);

  return {
    isOnline,
    offlineDataLoaded,
    pendingLeads,
    pendingCampaigns,
    submitOfflineLead,
    isDataAvailableOffline,
    syncOfflineData,
    loadOfflineData
  };
}