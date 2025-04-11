
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
