
import { CustomerTimelineEvent } from '@/types/timeline';
import { generateId } from '@/lib/customer-db';

// Database constants
const DB_NAME = 'customerTimelineDB';
const DB_VERSION = 1;
const EVENTS_STORE = 'timelineEvents';

// Initialize the database
export const initCustomerTimelineDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = (event) => {
      console.error('Error opening customer timeline database:', event);
      reject('Could not open customer timeline database');
    };
    
    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      resolve(db);
    };
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      // Create events store
      if (!db.objectStoreNames.contains(EVENTS_STORE)) {
        const store = db.createObjectStore(EVENTS_STORE, { keyPath: 'id' });
        store.createIndex('customerId', 'customerId', { unique: false });
        store.createIndex('date', 'date', { unique: false });
        store.createIndex('type', 'type', { unique: false });
      }
    };
  });
};

// Customer timeline operations
export const getCustomerEvents = async (customerId: string): Promise<CustomerTimelineEvent[]> => {
  const db = await initCustomerTimelineDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([EVENTS_STORE], 'readonly');
    const store = transaction.objectStore(EVENTS_STORE);
    const index = store.index('customerId');
    const request = index.getAll(customerId);
    
    request.onsuccess = () => {
      // Sort by date, newest first
      const events = request.result.sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      resolve(events);
    };
    
    request.onerror = (event) => {
      console.error('Error getting customer events:', event);
      reject('Could not get customer events');
    };
  });
};

export const saveCustomerEvent = async (event: CustomerTimelineEvent): Promise<string> => {
  const db = await initCustomerTimelineDB();
  
  // Ensure the event has an ID
  if (!event.id) {
    event.id = generateId();
  }
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([EVENTS_STORE], 'readwrite');
    const store = transaction.objectStore(EVENTS_STORE);
    const request = store.put(event);
    
    request.onsuccess = () => {
      resolve(event.id);
    };
    
    request.onerror = (event) => {
      console.error('Error saving customer event:', event);
      reject('Could not save customer event');
    };
  });
};

// Add sample timeline events for a customer
export const addSampleTimelineEvents = async (customerId: string): Promise<void> => {
  const now = new Date();
  
  const sampleEvents: Omit<CustomerTimelineEvent, 'id'>[] = [
    {
      customerId,
      type: 'email_sent',
      date: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
      title: 'Welcome Email Sent',
      description: 'Automated welcome email was sent to the customer'
    },
    {
      customerId,
      type: 'email_opened',
      date: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 4).toISOString(), // 4 days ago
      title: 'Welcome Email Opened',
      description: 'Customer opened the welcome email'
    },
    {
      customerId,
      type: 'email_clicked',
      date: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 4).toISOString(), // 4 days ago
      title: 'Welcome Email Link Clicked',
      description: 'Customer clicked on the "Get Started" link'
    },
    {
      customerId,
      type: 'whatsapp_sent',
      date: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
      title: 'Payment Reminder WhatsApp Sent',
      description: 'Payment due reminder was sent via WhatsApp'
    },
    {
      customerId,
      type: 'whatsapp_delivered',
      date: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
      title: 'Payment Reminder WhatsApp Delivered',
      description: 'Payment reminder WhatsApp message was delivered to customer'
    },
    {
      customerId,
      type: 'collection_status_change',
      date: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
      title: 'Collection Status Changed to Late',
      description: 'Customer collection status was changed from Current to Late',
      metadata: {
        oldStatus: 'current',
        newStatus: 'late'
      }
    },
    {
      customerId,
      type: 'sms_sent',
      date: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 1).toISOString(), // 1 day ago
      title: 'Urgent Payment SMS Sent',
      description: 'Urgent payment reminder was sent via SMS'
    },
    {
      customerId,
      type: 'sms_delivered',
      date: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 1).toISOString(), // 1 day ago
      title: 'Urgent Payment SMS Delivered',
      description: 'Urgent payment reminder SMS was delivered to customer'
    },
    {
      customerId,
      type: 'data_enrichment',
      date: new Date(now.getTime() - 1000 * 60 * 60 * 12).toISOString(), // 12 hours ago
      title: 'Customer Data Enriched',
      description: 'Additional customer data was gathered from external sources'
    }
  ];
  
  for (const event of sampleEvents) {
    await saveCustomerEvent(event as CustomerTimelineEvent);
  }
  
  console.log('Sample timeline events added for customer:', customerId);
};
