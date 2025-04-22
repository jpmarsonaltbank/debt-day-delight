import { Timeline, TimelineAction, Action } from '@/types/timeline';

// Database constants
const DB_NAME = 'timelineDB';
const DB_VERSION = 1;
const TIMELINES_STORE = 'timelines';
const LIBRARY_STORE = 'library';

// Initialize the database
export const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = (event) => {
      console.error('Error opening database:', event);
      reject('Could not open database');
    };
    
    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      resolve(db);
    };
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      // Create timelines store
      if (!db.objectStoreNames.contains(TIMELINES_STORE)) {
        const timelineStore = db.createObjectStore(TIMELINES_STORE, { keyPath: 'id' });
        timelineStore.createIndex('name', 'name', { unique: false });
        timelineStore.createIndex('createdAt', 'createdAt', { unique: false });
      }
      
      // Create library store
      if (!db.objectStoreNames.contains(LIBRARY_STORE)) {
        db.createObjectStore(LIBRARY_STORE, { keyPath: 'id' });
      }
    };
  });
};

// Timeline operations
export const getTimelines = async (): Promise<Timeline[]> => {
  const db = await initDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([TIMELINES_STORE], 'readonly');
    const store = transaction.objectStore(TIMELINES_STORE);
    const request = store.getAll();
    
    request.onsuccess = () => {
      resolve(request.result);
    };
    
    request.onerror = (event) => {
      console.error('Error getting timelines:', event);
      reject('Could not get timelines');
    };
  });
};

export const getTimeline = async (id: string): Promise<Timeline | null> => {
  const db = await initDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([TIMELINES_STORE], 'readonly');
    const store = transaction.objectStore(TIMELINES_STORE);
    const request = store.get(id);
    
    request.onsuccess = () => {
      resolve(request.result || null);
    };
    
    request.onerror = (event) => {
      console.error('Error getting timeline:', event);
      reject('Could not get timeline');
    };
  });
};

export const saveTimeline = async (timeline: Timeline): Promise<string> => {
  const db = await initDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([TIMELINES_STORE], 'readwrite');
    const store = transaction.objectStore(TIMELINES_STORE);
    const request = store.put(timeline);
    
    request.onsuccess = () => {
      resolve(timeline.id);
    };
    
    request.onerror = (event) => {
      console.error('Error saving timeline:', event);
      reject('Could not save timeline');
    };
  });
};

export const deleteTimeline = async (id: string): Promise<void> => {
  const db = await initDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([TIMELINES_STORE], 'readwrite');
    const store = transaction.objectStore(TIMELINES_STORE);
    const request = store.delete(id);
    
    request.onsuccess = () => {
      resolve();
    };
    
    request.onerror = (event) => {
      console.error('Error deleting timeline:', event);
      reject('Could not delete timeline');
    };
  });
};

// Library actions operations
export const getLibraryActions = async (): Promise<TimelineAction[]> => {
  const db = await initDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([LIBRARY_STORE], 'readonly');
    const store = transaction.objectStore(LIBRARY_STORE);
    const request = store.getAll();
    
    request.onsuccess = () => {
      resolve(request.result);
    };
    
    request.onerror = (event) => {
      console.error('Error getting library actions:', event);
      reject('Could not get library actions');
    };
  });
};

export const saveLibraryAction = async (action: TimelineAction): Promise<string> => {
  const db = await initDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([LIBRARY_STORE], 'readwrite');
    const store = transaction.objectStore(LIBRARY_STORE);
    
    // Ensure the action has all required fields for a TimelineAction
    const actionToSave: TimelineAction = {
      ...action,
      type: action.type || (action.tipo as any),
      name: action.name || action.nome || '',
      subject: action.subject || action.assunto_email || '',
      message: action.message || action.conteudo_mensagem || '',
      conditions: action.conditions || []
    };
    
    const request = store.put(actionToSave);
    
    request.onsuccess = () => {
      resolve(action.id);
    };
    
    request.onerror = (event) => {
      console.error('Error saving library action:', event);
      reject('Could not save library action');
    };
  });
};

// Helper function to save multiple library actions
export const saveLibraryActions = async (actions: TimelineAction[]): Promise<void> => {
  const db = await initDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([LIBRARY_STORE], 'readwrite');
    const store = transaction.objectStore(LIBRARY_STORE);
    
    let completed = 0;
    
    actions.forEach(action => {
      const request = store.put(action);
      
      request.onsuccess = () => {
        completed++;
        if (completed === actions.length) {
          resolve();
        }
      };
      
      request.onerror = (event) => {
        console.error('Error saving library action:', event);
        reject('Could not save library actions');
      };
    });
    
    if (actions.length === 0) {
      resolve();
    }
  });
};

// Migration from localStorage
export const migrateFromLocalStorage = async (): Promise<void> => {
  try {
    // Migrate timelines
    const savedTimelines = localStorage.getItem('credit-card-timelines');
    if (savedTimelines) {
      const timelines: Timeline[] = JSON.parse(savedTimelines);
      const db = await initDB();
      const transaction = db.transaction([TIMELINES_STORE], 'readwrite');
      const store = transaction.objectStore(TIMELINES_STORE);
      
      for (const timeline of timelines) {
        store.put(timeline);
      }
    }
    
    // Migrate library actions
    const savedLibraryActions = localStorage.getItem('credit-card-shared-library');
    if (savedLibraryActions) {
      const actions: TimelineAction[] = JSON.parse(savedLibraryActions);
      const db = await initDB();
      const transaction = db.transaction([LIBRARY_STORE], 'readwrite');
      const store = transaction.objectStore(LIBRARY_STORE);
      
      for (const action of actions) {
        store.put(action);
      }
    }
    
    console.log('Migration from localStorage completed successfully');
  } catch (error) {
    console.error('Error migrating from localStorage:', error);
  }
};
