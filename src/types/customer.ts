
export interface CustomerAddress {
  principal: boolean;
  address: string;
  number: string;
  additional_information?: string;
  neighborhood: string;
  city: string;
  state: string;
  country: string;
  status: 'active' | 'inactive';
}

export interface CustomerPhone {
  principal: boolean;
  phone_number: string;
  operational_system?: string;
  operational_system_version?: string;
  device_model?: string;
  status: 'active' | 'inactive';
}

export interface CustomerEmail {
  principal: boolean;
  email_address: string;
  status: 'active' | 'inactive';
}

export interface Customer {
  id?: string; // Local ID for database
  external_id: string;
  full_name: string;
  social_name?: string;
  best_name?: string;
  document: string;
  pep: boolean;
  gender: 'male' | 'female' | 'other' | 'not_specified';
  birthdate: string;
  status: 'normal' | 'blocked' | 'suspended';
  collection_status: 'current' | 'late' | 'defaulted';
  addresses: CustomerAddress[];
  phones: CustomerPhone[];
  emails: CustomerEmail[];
  tenant_name: string;
}
