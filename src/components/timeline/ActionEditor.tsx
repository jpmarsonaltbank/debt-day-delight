
import React, { useState } from 'react';
import { TimelineAction, ActionType, Condition } from '@/types/timeline';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Mail, MessageSquare, Phone, X, Plus, AlertCircle, Trash2 } from 'lucide-react';
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import ConditionEditor from './ConditionEditor';
import { Checkbox } from '@/components/ui/checkbox';

interface ActionEditorProps {
  action: TimelineAction | null;
  onSave: (action: TimelineAction) => void;
  onClose: () => void;
  isNew?: boolean;
  allActions?: TimelineAction[];
  onAddCondition?: (actionId: string) => void;
  onEditCondition?: (actionId: string, conditionId: string) => void;
}

const ActionEditor: React.FC<ActionEditorProps> = ({ 
  action, 
  onSave, 
  onClose,
  isNew = false,
  allActions = [],
  onAddCondition,
  onEditCondition
}) => {
  const [title, setTitle] = useState(action?.title || '');
  const [description, setDescription] = useState(action?.description || '');
  const [type, setType] = useState<ActionType>(action?.type || 'email');
  const [conditions, setConditions] = useState<Condition[]>(action?.conditions || []);
  const [isConditionsOpen, setIsConditionsOpen] = useState(false);
  const [addingCondition, setAddingCondition] = useState(false);
  const [editingConditionId, setEditingConditionId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'details' | 'conditions'>('details');

  const handleSave = () => {
    if (!title.trim()) return;
    
    onSave({
      id: action?.id || `action-${Date.now()}`,
      title,
      description,
      type,
      conditions
    });
  };

  const handleAddCondition = () => {
    if (isNew) {
      // If this is a new action being created, we open the condition editor directly
      setAddingCondition(true);
    } else if (onAddCondition && action) {
      // If this is an existing action, we use the parent component's handler
      onAddCondition(action.id);
    }
  };

  const handleEditCondition = (conditionId: string) => {
    if (isNew) {
      // If this is a new action being created, we open the condition editor directly
      setEditingConditionId(conditionId);
      setAddingCondition(true);
    } else if (onEditCondition && action) {
      // If this is an existing action, we use the parent component's handler
      onEditCondition(action.id, conditionId);
    }
  };

  const handleSaveCondition = (condition: Condition) => {
    const existingIndex = conditions.findIndex(c => c.id === condition.id);
    
    if (existingIndex >= 0) {
      // Update existing condition
      const updatedConditions = [...conditions];
      updatedConditions[existingIndex] = condition;
      setConditions(updatedConditions);
    } else {
      // Add new condition
      setConditions([...conditions, condition]);
    }
    
    setAddingCondition(false);
    setEditingConditionId(null);
  };

  const handleDeleteCondition = (conditionId: string) => {
    setConditions(conditions.filter(c => c.id !== conditionId));
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

    // For new actions being created, we need to look up the previous action from allActions
    // Since it might not have been saved yet
    let previousAction;
    if (isNew) {
      previousAction = allActions.find(a => a.id === condition.previousActionId);
    } else {
      previousAction = action?.conditions.find(c => c.previousActionId === condition.previousActionId)?.action;
    }
    
    return (
      <div className="text-sm">
        If <span className="font-medium">{previousAction?.title || 'Previous Action'}</span> {conditionTypeMap[condition.type]}, 
        then <span className="font-medium">{condition.action.title}</span>
      </div>
    );
  };

  // All actions available for conditions, including this one if it's already saved
  const availableActions = isNew 
    ? allActions
    : [...allActions.filter(a => a.id !== action?.id), ...(action ? [action] : [])];

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
      
      <Tabs defaultValue="details" value={activeTab} onValueChange={(value) => setActiveTab(value as 'details' | 'conditions')}>
        <div className="px-6">
          <TabsList className="w-full">
            <TabsTrigger value="details" className="flex-1">Details</TabsTrigger>
            <TabsTrigger value="conditions" className="flex-1">
              Conditions {conditions.length > 0 && `(${conditions.length})`}
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="details" className="pt-2">
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
            </div>
          </CardContent>
        </TabsContent>
        
        <TabsContent value="conditions" className="pt-2">
          <CardContent>
            <div className="space-y-4">
              {conditions.length === 0 ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground p-2">
                  <AlertCircle size={14} />
                  No conditions defined yet
                </div>
              ) : (
                <div className="space-y-2">
                  {conditions.map((condition) => (
                    <div 
                      key={condition.id} 
                      className="border rounded p-2 bg-muted/20 hover:bg-muted/50 cursor-pointer flex justify-between items-center"
                    >
                      <div className="flex-1" onClick={() => handleEditCondition(condition.id)}>
                        {renderConditionSummary(condition)}
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDeleteCondition(condition.id)} 
                        className="h-8 w-8 p-0"
                      >
                        <Trash2 size={16} className="text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="pt-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full flex items-center justify-center gap-1"
                  onClick={handleAddCondition}
                >
                  <Plus size={14} />
                  Add Condition
                </Button>
              </div>
            </div>
          </CardContent>
        </TabsContent>
      </Tabs>
      
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} disabled={!title.trim()}>Save Action</Button>
      </CardFooter>
      
      {/* Condition Editor Modal for New Actions */}
      {addingCondition && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-md">
            <ConditionEditor
              condition={editingConditionId ? conditions.find(c => c.id === editingConditionId) || null : null}
              actions={availableActions}
              onSave={handleSaveCondition}
              onClose={() => {
                setAddingCondition(false);
                setEditingConditionId(null);
              }}
              isNew={!editingConditionId}
            />
          </div>
        </div>
      )}
    </Card>
  );
};

export default ActionEditor;
