
import React from 'react';
import { Condition, TimelineAction, ConditionType } from '@/types/timeline';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Mail, MessageSquare, Phone, AlertTriangle } from 'lucide-react';

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
  const [previousActionId, setPreviousActionId] = React.useState(condition?.previousActionId || '');
  const [type, setType] = React.useState<ConditionType>(condition?.type || 'delivered');
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

  // Get the selected previous action to determine what condition types to show
  const selectedPreviousAction = actions.find(a => a.id === previousActionId);

  // Get condition options based on the selected previous action type
  const getConditionOptions = () => {
    if (!selectedPreviousAction) return [];
    
    const baseOptions = [
      { label: 'Was Delivered', value: 'delivered' },
      { label: 'Was Not Delivered', value: 'not_delivered' },
    ];
    
    if (selectedPreviousAction.type === 'email') {
      return [
        ...baseOptions,
        { label: 'Was Opened', value: 'opened' },
        { label: 'Was Not Opened', value: 'not_opened' },
        { label: 'Link Was Clicked', value: 'clicked' },
        { label: 'Link Was Not Clicked', value: 'not_clicked' },
      ];
    }
    
    return baseOptions;
  };

  // Function to render the correct icon based on action type
  const renderActionIcon = (actionType: string) => {
    switch (actionType) {
      case 'email':
        return <Mail size={16} className="text-blue-500 mr-2" />;
      case 'whatsapp':
        return <MessageSquare size={16} className="text-green-500 mr-2" />;
      case 'sms':
        return <Phone size={16} className="text-amber-500 mr-2" />;
      case 'negativar':
        return <AlertTriangle size={16} className="text-red-500 mr-2" />;
      default:
        return null;
    }
  };

  // Find the day for a specific action
  const findDayForAction = (actionId: string) => {
    // This assumes actions array has the day information as metadata
    const action = actions.find(a => a.id === actionId);
    if (action && action.dayId) {
      const dayNumber = action.dayId.replace('day-', '');
      // Convert to number before comparison
      return dayNumber === '0' ? 'Due Date' : `D${parseInt(dayNumber) > 0 ? '+' : ''}${dayNumber}`;
    }
    return 'Library';
  };

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
          {/* Step 1: Select Previous Action */}
          <div className="space-y-2">
            <Label htmlFor="previous-action">1. Previous Action</Label>
            <Select 
              value={previousActionId} 
              onValueChange={(value) => {
                setPreviousActionId(value);
                // Reset condition type when previous action changes
                setType('delivered');
              }}
            >
              <SelectTrigger id="previous-action">
                <SelectValue placeholder="Select previous action" />
              </SelectTrigger>
              <SelectContent>
                {actions.map((action) => (
                  <SelectItem key={action.id} value={action.id} className="flex items-center">
                    <div className="flex items-center">
                      {renderActionIcon(action.type)}
                      <span>{action.name || action.subject}</span>
                      <span className="ml-2 text-xs text-gray-500">
                        [{findDayForAction(action.id)}]
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Step 2: Select Condition Type - Only show if previous action is selected */}
          {previousActionId && (
            <div className="space-y-2">
              <Label>2. Condition Type</Label>
              <RadioGroup value={type} onValueChange={(v) => setType(v as ConditionType)}>
                {getConditionOptions().map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.value} id={option.value} />
                    <Label htmlFor={option.value}>{option.label}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}
          
          {/* Step 3: Select Then Action - Only show if previous steps are completed */}
          {previousActionId && type && (
            <div className="space-y-2">
              <Label htmlFor="then-action">3. Then Action</Label>
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
                    <SelectItem key={action.id} value={action.id} className="flex items-center">
                      <div className="flex items-center">
                        {renderActionIcon(action.type)}
                        <span>{action.name || action.subject}</span>
                        <span className="ml-2 text-xs text-gray-500">
                          [{findDayForAction(action.id)}]
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button 
          onClick={handleSave}
          disabled={!previousActionId || !type || !selectedAction}
        >
          Save Condition
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ConditionEditor;
