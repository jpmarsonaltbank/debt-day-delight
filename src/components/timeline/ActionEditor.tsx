
import React from 'react';
import { TimelineAction, ActionType, Condition } from '@/types/timeline';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Mail, MessageSquare, Phone, X, Plus, AlertCircle } from 'lucide-react';
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface ActionEditorProps {
  action: TimelineAction | null;
  onSave: (action: TimelineAction) => void;
  onClose: () => void;
  isNew?: boolean;
  onAddCondition?: (actionId: string) => void;
  onEditCondition?: (actionId: string, conditionId: string) => void;
}

const ActionEditor: React.FC<ActionEditorProps> = ({ 
  action, 
  onSave, 
  onClose,
  isNew = false,
  onAddCondition,
  onEditCondition
}) => {
  const [title, setTitle] = React.useState(action?.title || '');
  const [description, setDescription] = React.useState(action?.description || '');
  const [type, setType] = React.useState<ActionType>(action?.type || 'email');
  const [isConditionsOpen, setIsConditionsOpen] = React.useState(false);

  const handleSave = () => {
    if (!title.trim()) return;
    
    onSave({
      id: action?.id || `action-${Date.now()}`,
      title,
      description,
      type,
      conditions: action?.conditions || []
    });
  };

  const renderConditionSummary = (condition: Condition) => {
    const conditionTypeMap = {
      'delivered': 'was delivered',
      'not_delivered': 'was not delivered',
      'opened': 'was opened',
      'not_opened': 'was not opened',
      'clicked': 'was clicked',
      'not_clicked': 'was not clicked'
    };

    const previousAction = action?.conditions.find(c => c.previousActionId === condition.previousActionId)?.action;
    
    return (
      <div className="text-sm">
        If <span className="font-medium">{previousAction?.title || 'Previous Action'}</span> {conditionTypeMap[condition.type]}, 
        then <span className="font-medium">{condition.action.title}</span>
      </div>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex justify-between items-center">
          {isNew ? 'New Action' : 'Edit Action'}
          <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
            <X size={16} />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="action-title">Title</Label>
            <Input
              id="action-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Action title"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="action-description">Description</Label>
            <Textarea
              id="action-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description (optional)"
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Action Type</Label>
            <Tabs defaultValue={type} onValueChange={(v) => setType(v as ActionType)}>
              <TabsList className="grid grid-cols-3">
                <TabsTrigger value="email" className="flex items-center gap-2">
                  <Mail size={16} /> Email
                </TabsTrigger>
                <TabsTrigger value="whatsapp" className="flex items-center gap-2">
                  <MessageSquare size={16} /> WhatsApp
                </TabsTrigger>
                <TabsTrigger value="sms" className="flex items-center gap-2">
                  <Phone size={16} /> SMS
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          {!isNew && action && (
            <Collapsible 
              open={isConditionsOpen} 
              onOpenChange={setIsConditionsOpen}
              className="border rounded-md p-2"
            >
              <div className="flex items-center justify-between">
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center gap-2 p-2">
                    <span>Conditions ({action.conditions.length})</span>
                    {isConditionsOpen ? (
                      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4">
                        <path d="M3.13523 6.15803C3.3241 5.95657 3.64052 5.94637 3.84197 6.13523L7.5 9.56464L11.158 6.13523C11.3595 5.94637 11.6759 5.95657 11.8648 6.15803C12.0536 6.35949 12.0434 6.67591 11.842 6.86477L7.84197 10.6148C7.64964 10.7951 7.35036 10.7951 7.15803 10.6148L3.15803 6.86477C2.95657 6.67591 2.94637 6.35949 3.13523 6.15803Z" fill="currentColor"></path>
                      </svg>
                    ) : (
                      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4">
                        <path d="M6.1584 3.13508C6.35985 2.94621 6.67627 2.95642 6.86514 3.15788L10.6151 7.15788C10.7954 7.3502 10.7954 7.64949 10.6151 7.84182L6.86514 11.8418C6.67627 12.0433 6.35985 12.0535 6.1584 11.8646C5.95694 11.6757 5.94673 11.3593 6.1356 11.1579L9.565 7.49985L6.1356 3.84182C5.94673 3.64036 5.95694 3.32394 6.1584 3.13508Z" fill="currentColor"></path>
                      </svg>
                    )}
                  </Button>
                </CollapsibleTrigger>
                {onAddCondition && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center gap-1"
                    onClick={() => onAddCondition(action.id)}
                  >
                    <Plus size={14} />
                    Add
                  </Button>
                )}
              </div>
              
              <CollapsibleContent className="mt-2 space-y-2">
                {action.conditions.length === 0 ? (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground p-2">
                    <AlertCircle size={14} />
                    No conditions defined yet
                  </div>
                ) : (
                  action.conditions.map((condition) => (
                    <div 
                      key={condition.id} 
                      className="border rounded p-2 bg-muted/20 hover:bg-muted/50 cursor-pointer"
                      onClick={() => onEditCondition && onEditCondition(action.id, condition.id)}
                    >
                      {renderConditionSummary(condition)}
                    </div>
                  ))
                )}
              </CollapsibleContent>
            </Collapsible>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave}>Save Action</Button>
      </CardFooter>
    </Card>
  );
};

export default ActionEditor;
