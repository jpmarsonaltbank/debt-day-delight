
import React from 'react';
import { Condition, TimelineAction, ConditionType } from '@/types/timeline';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';

interface ConditionEditorProps {
  condition: Condition | null;
  actions: TimelineAction[];
  onSave: (condition: Condition) => void;
  onClose: () => void;
  isNew?: boolean;
}

const ConditionEditor: React.FC<ConditionEditorProps> = ({
  condition,
  actions,
  onSave,
  onClose,
  isNew = false
}) => {
  const [type, setType] = React.useState<ConditionType>(condition?.type || 'delivered');
  const [previousActionId, setPreviousActionId] = React.useState(condition?.previousActionId || '');
  const [selectedAction, setSelectedAction] = React.useState<TimelineAction | null>(
    condition?.action || null
  );

  const handleSave = () => {
    if (!previousActionId || !selectedAction) return;

    onSave({
      id: condition?.id || `condition-${Date.now()}`,
      type,
      previousActionId,
      action: selectedAction
    });
  };

  const conditionOptions = [
    { label: 'If Email was Delivered', value: 'delivered', type: 'email' },
    { label: 'If Email was Not Delivered', value: 'not_delivered', type: 'email' },
    { label: 'If Email was Opened', value: 'opened', type: 'email' },
    { label: 'If Email was Not Opened', value: 'not_opened', type: 'email' },
    { label: 'If Link was Clicked', value: 'clicked', type: 'email' },
    { label: 'If Link was Not Clicked', value: 'not_clicked', type: 'email' },
    { label: 'If WhatsApp was Delivered', value: 'delivered', type: 'whatsapp' },
    { label: 'If WhatsApp was Not Delivered', value: 'not_delivered', type: 'whatsapp' },
    { label: 'If SMS was Delivered', value: 'delivered', type: 'sms' },
    { label: 'If SMS was Not Delivered', value: 'not_delivered', type: 'sms' },
  ];

  // Filter actions to only show email actions
  const eligiblePreviousActions = actions.filter(action => 
    (action.type === 'email' && 
     (type.includes('delivered') || type.includes('opened') || type.includes('clicked'))) ||
    (action.type === 'whatsapp' && type.includes('delivered')) ||
    (action.type === 'sms' && type.includes('delivered'))
  );

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex justify-between items-center">
          {isNew ? 'New Condition' : 'Edit Condition'}
          <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
            <X size={16} />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Condition Type</Label>
            <RadioGroup value={type} onValueChange={(v) => setType(v as ConditionType)}>
              {conditionOptions.map((option) => (
                <div key={`${option.type}-${option.value}`} className="flex items-center space-x-2">
                  <RadioGroupItem 
                    value={option.value} 
                    id={`${option.type}-${option.value}`} 
                  />
                  <Label htmlFor={`${option.type}-${option.value}`}>{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="previous-action">Previous Action</Label>
            <Select 
              value={previousActionId} 
              onValueChange={setPreviousActionId}
            >
              <SelectTrigger id="previous-action">
                <SelectValue placeholder="Select previous action" />
              </SelectTrigger>
              <SelectContent>
                {eligiblePreviousActions.map((action) => (
                  <SelectItem key={action.id} value={action.id}>
                    {action.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="then-action">Then Action</Label>
            <Select
              value={selectedAction?.id || ''}
              onValueChange={(value) => {
                const action = actions.find(a => a.id === value);
                if (action) setSelectedAction(action);
              }}
            >
              <SelectTrigger id="then-action">
                <SelectValue placeholder="Select action to perform" />
              </SelectTrigger>
              <SelectContent>
                {actions.map((action) => (
                  <SelectItem key={action.id} value={action.id}>
                    {action.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave}>Save Condition</Button>
      </CardFooter>
    </Card>
  );
};

export default ConditionEditor;
