
export interface CustomerSegmentRule {
  collection_name: string;
  expression: string;
}

export interface CustomerSegment {
  id?: string; // Local ID for database
  tenant_name: string;
  name: string;
  description: string;
  priority: number;
  rules: CustomerSegmentRule[];
  created_by: string;
}
