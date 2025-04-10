
import React from 'react';
import { TimelineAction, ActionType } from '@/types/timeline';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Mail, MessageSquare, Phone, X } from 'lucide-react';

interface ActionEditorProps {
  action: TimelineAction | null;
  onSave: (action: TimelineAction) => void;
  onClose: () => void;
  isNew?: boolean;
}

const ActionEditor: React.FC<ActionEditorProps> = ({ 
  action, 
  onSave, 
  onClose,
  isNew = false
}) => {
  const [title, setTitle] = React.useState(action?.title || '');
  const [description, setDescription] = React.useState(action?.description || '');
  const [type, setType] = React.useState<ActionType>(action?.type || 'email');

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
          
          {/* Additional fields based on action type could be added here */}
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
