
import { CustomerSegment } from '@/types/customer-segment';

// Database constants
const DB_NAME = 'customerSegmentDB';
const DB_VERSION = 1;
const SEGMENTS_STORE = 'segments';

// Initialize the database
export const initCustomerSegmentDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = (event) => {
      console.error('Error opening customer segment database:', event);
      reject('Could not open customer segment database');
    };
    
    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      resolve(db);
    };
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      // Create segments store
      if (!db.objectStoreNames.contains(SEGMENTS_STORE)) {
        const store = db.createObjectStore(SEGMENTS_STORE, { keyPath: 'id', autoIncrement: true });
        store.createIndex('name', 'name', { unique: false });
        store.createIndex('tenant_name', 'tenant_name', { unique: false });
      }
    };
  });
};

// Generate a unique ID for new segments
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

// Customer segment operations
export const getCustomerSegments = async (): Promise<CustomerSegment[]> => {
  const db = await initCustomerSegmentDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([SEGMENTS_STORE], 'readonly');
    const store = transaction.objectStore(SEGMENTS_STORE);
    const request = store.getAll();
    
    request.onsuccess = () => {
      resolve(request.result);
    };
    
    request.onerror = (event) => {
      console.error('Error getting customer segments:', event);
      reject('Could not get customer segments');
    };
  });
};

export const getCustomerSegment = async (id: string): Promise<CustomerSegment | null> => {
  const db = await initCustomerSegmentDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([SEGMENTS_STORE], 'readonly');
    const store = transaction.objectStore(SEGMENTS_STORE);
    const request = store.get(id);
    
    request.onsuccess = () => {
      resolve(request.result || null);
    };
    
    request.onerror = (event) => {
      console.error('Error getting customer segment:', event);
      reject('Could not get customer segment');
    };
  });
};

export const saveCustomerSegment = async (segment: CustomerSegment): Promise<string> => {
  const db = await initCustomerSegmentDB();
  
  // Ensure the segment has an ID
  if (!segment.id) {
    segment.id = generateId();
  }
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([SEGMENTS_STORE], 'readwrite');
    const store = transaction.objectStore(SEGMENTS_STORE);
    const request = store.put(segment);
    
    request.onsuccess = () => {
      resolve(segment.id as string);
    };
    
    request.onerror = (event) => {
      console.error('Error saving customer segment:', event);
      reject('Could not save customer segment');
    };
  });
};

export const deleteCustomerSegment = async (id: string): Promise<void> => {
  const db = await initCustomerSegmentDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([SEGMENTS_STORE], 'readwrite');
    const store = transaction.objectStore(SEGMENTS_STORE);
    const request = store.delete(id);
    
    request.onsuccess = () => {
      resolve();
    };
    
    request.onerror = (event) => {
      console.error('Error deleting customer segment:', event);
      reject('Could not delete customer segment');
    };
  });
};

// Add sample customer segment data for testing
export const addSampleCustomerSegments = async (): Promise<void> => {
  const segments = await getCustomerSegments();
  
  // Only add sample data if there are no segments
  if (segments.length === 0) {
    const sampleSegments: Omit<CustomerSegment, 'id'>[] = [
      {
        tenant_name: "tenant_123",
        name: "Delinquent Customers",
        description: "Segment for customers with overdue payments",
        priority: 1,
        rules: [
          {
            collection_name: "customer",
            expression: "status == \"normal\" and active == true"
          }
        ],
        created_by: "user_123"
      },
      {
        tenant_name: "tenant_123",
        name: "High-Value Customers",
        description: "Segment for high-value customers",
        priority: 2,
        rules: [
          {
            collection_name: "customer",
            expression: "balance > 10000 and status == \"normal\""
          }
        ],
        created_by: "user_123"
      },
      {
        tenant_name: "tenant_123",
        name: "Inactive Customers",
        description: "Segment for inactive customers",
        priority: 3,
        rules: [
          {
            collection_name: "customer",
            expression: "active == false"
          }
        ],
        created_by: "user_123"
      }
    ];
    
    for (const segment of sampleSegments) {
      await saveCustomerSegment(segment as CustomerSegment);
    }
    
    console.log('Sample customer segments added successfully');
  }
};
