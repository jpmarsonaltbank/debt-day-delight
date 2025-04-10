
export type ActionType = 'email' | 'whatsapp' | 'sms';
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
  title: string;
  description: string;
  conditions: Condition[];
}

export interface TimelineDay {
  id: string;
  day: number;
  actions: TimelineAction[];
  active: boolean;
}

export interface TimelineState {
  days: TimelineDay[];
  selectedDay: TimelineDay | null;
  selectedAction: TimelineAction | null;
}
