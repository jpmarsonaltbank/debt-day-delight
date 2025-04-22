
export type ActionType = 'email' | 'whatsapp' | 'sms' | 'negativar';

export type ConditionType = 'delivered' | 'not_delivered' | 'opened' | 'not_opened' | 'clicked' | 'not_clicked';

export interface Condition {
  id: string;
  type: ConditionType;
  previousActionId: string;
  action: TimelineAction;
}

export interface TimelineAction {
  id: string;
  type: ActionType;
  name: string;
  subject: string;
  message: string;
  conditions: Condition[];
  dayId?: string;
  title?: string; // Adding optional title property for backward compatibility
}

export interface TimelineDay {
  id: string;
  day: number;
  actions: TimelineAction[];
  active: boolean;
}

export interface Timeline {
  id: string;
  name: string;
  days: TimelineDay[];
  libraryActions: TimelineAction[];
  createdAt: string;
}

export interface TimelineState {
  days: TimelineDay[];
  selectedDay: TimelineDay | null;
  selectedAction: TimelineAction | null;
  timelineName: string;
}

export interface Action {
  id: string;
  nome: string;
  tipo: 'email' | 'whatsapp' | 'sms';
  tenant_id?: string;
  horario_envio: string;
  conteudo_mensagem: string;
  assunto_email?: string;
}

// Customer Timeline Types
export type CustomerEventType = 
  | 'email_sent' 
  | 'email_delivered' 
  | 'email_opened' 
  | 'email_clicked' 
  | 'email_failed'
  | 'sms_sent' 
  | 'sms_delivered' 
  | 'sms_failed'
  | 'whatsapp_sent' 
  | 'whatsapp_delivered' 
  | 'whatsapp_failed'
  | 'collection_status_change'
  | 'customer_status_change'
  | 'data_enrichment';

export interface CustomerTimelineEvent {
  id: string;
  customerId: string;
  type: CustomerEventType;
  date: string; // ISO format date
  title: string;
  description: string;
  metadata?: Record<string, any>;
}
