
import { Customer } from '@/types/customer';

// Database constants
const DB_NAME = 'customerDB';
const DB_VERSION = 1;
const CUSTOMERS_STORE = 'customers';

// Initialize the database
export const initCustomerDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = (event) => {
      console.error('Error opening customer database:', event);
      reject('Could not open customer database');
    };
    
    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      resolve(db);
    };
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      // Create customers store
      if (!db.objectStoreNames.contains(CUSTOMERS_STORE)) {
        const store = db.createObjectStore(CUSTOMERS_STORE, { keyPath: 'id', autoIncrement: true });
        store.createIndex('external_id', 'external_id', { unique: true });
        store.createIndex('full_name', 'full_name', { unique: false });
        store.createIndex('document', 'document', { unique: true });
      }
    };
  });
};

// Generate a unique ID for new customers
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

// Customer operations
export const getCustomers = async (): Promise<Customer[]> => {
  const db = await initCustomerDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([CUSTOMERS_STORE], 'readonly');
    const store = transaction.objectStore(CUSTOMERS_STORE);
    const request = store.getAll();
    
    request.onsuccess = () => {
      resolve(request.result);
    };
    
    request.onerror = (event) => {
      console.error('Error getting customers:', event);
      reject('Could not get customers');
    };
  });
};

export const getCustomer = async (id: string): Promise<Customer | null> => {
  const db = await initCustomerDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([CUSTOMERS_STORE], 'readonly');
    const store = transaction.objectStore(CUSTOMERS_STORE);
    const request = store.get(id);
    
    request.onsuccess = () => {
      resolve(request.result || null);
    };
    
    request.onerror = (event) => {
      console.error('Error getting customer:', event);
      reject('Could not get customer');
    };
  });
};

export const saveCustomer = async (customer: Customer): Promise<string> => {
  const db = await initCustomerDB();
  
  // Ensure the customer has an ID
  if (!customer.id) {
    customer.id = generateId();
  }
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([CUSTOMERS_STORE], 'readwrite');
    const store = transaction.objectStore(CUSTOMERS_STORE);
    const request = store.put(customer);
    
    request.onsuccess = () => {
      resolve(customer.id as string);
    };
    
    request.onerror = (event) => {
      console.error('Error saving customer:', event);
      reject('Could not save customer');
    };
  });
};

export const deleteCustomer = async (id: string): Promise<void> => {
  const db = await initCustomerDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([CUSTOMERS_STORE], 'readwrite');
    const store = transaction.objectStore(CUSTOMERS_STORE);
    const request = store.delete(id);
    
    request.onsuccess = () => {
      resolve();
    };
    
    request.onerror = (event) => {
      console.error('Error deleting customer:', event);
      reject('Could not delete customer');
    };
  });
};

// Add sample customer data for testing
export const addSampleCustomers = async (): Promise<void> => {
  const customers = await getCustomers();
  
  // Only add sample data if there are no customers
  if (customers.length === 0) {
    const sampleCustomers: Omit<Customer, 'id'>[] = [
      {
        external_id: "abc123",
        full_name: "John Doe",
        social_name: "Johnny Doe",
        best_name: "John",
        document: "12345678900",
        pep: false,
        gender: "male",
        birthdate: "2000-01-01",
        status: "normal",
        collection_status: "current",
        addresses: [
          {
            principal: true,
            address: "Flower Street",
            number: "123",
            additional_information: "Apt 101",
            neighborhood: "Downtown",
            city: "São Paulo",
            state: "SP",
            country: "Brazil",
            status: "active"
          }
        ],
        phones: [
          {
            principal: true,
            phone_number: "11999999999",
            operational_system: "Android",
            operational_system_version: "12.0",
            device_model: "iPhone 13",
            status: "active"
          }
        ],
        emails: [
          {
            principal: true,
            email_address: "john@email.com",
            status: "active"
          }
        ],
        tenant_name: "tenant123"
      },
      {
        external_id: "def456",
        full_name: "Jane Smith",
        social_name: "Jane Smith",
        best_name: "Jane",
        document: "98765432100",
        pep: true,
        gender: "female",
        birthdate: "1995-05-15",
        status: "normal",
        collection_status: "late",
        addresses: [
          {
            principal: true,
            address: "Oak Avenue",
            number: "456",
            neighborhood: "Central",
            city: "Rio de Janeiro",
            state: "RJ",
            country: "Brazil",
            status: "active"
          }
        ],
        phones: [
          {
            principal: true,
            phone_number: "21888888888",
            operational_system: "iOS",
            operational_system_version: "16.0",
            device_model: "iPhone 14",
            status: "active"
          }
        ],
        emails: [
          {
            principal: true,
            email_address: "jane@email.com",
            status: "active"
          }
        ],
        tenant_name: "tenant123"
      }
    ];
    
    for (const customer of sampleCustomers) {
      await saveCustomer(customer as Customer);
    }
    
    console.log('Sample customers added successfully');
  }
};
