
import React from 'react';
import { TimelineAction } from '@/types/timeline';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import TimelineActionCard from './TimelineActionCard';
import { useDrag } from 'react-dnd';

interface ActionLibraryProps {
  actions: TimelineAction[];
  onAddAction: () => void;
  onSelectAction: (action: TimelineAction) => void;
  onCloneAction?: (action: TimelineAction) => void;
}

const ActionLibrary: React.FC<ActionLibraryProps> = ({ 
  actions, 
  onAddAction, 
  onSelectAction,
  onCloneAction
}) => {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex justify-between items-center">
          Action Library
          <Button 
            size="sm" 
            onClick={onAddAction}
            className="flex items-center gap-1"
          >
            <Plus size={16} /> Add Action
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="overflow-auto max-h-[calc(100vh-220px)]">
        {actions.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <p>No actions created yet</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2"
              onClick={onAddAction}
            >
              Create your first action
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            {actions.map((action) => (
              <div 
                key={action.id}
              >
                <TimelineActionCard 
                  action={action}
                  dayId=""
                  onSelectAction={onSelectAction}
                  onCloneAction={onCloneAction}
                />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ActionLibrary;
