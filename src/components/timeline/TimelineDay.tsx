
import React from 'react';
import { TimelineDay, TimelineAction } from '@/types/timeline';
import { Button } from '@/components/ui/button';
import { useDrop } from 'react-dnd';
import TimelineActionCard from './TimelineActionCard';
import { Plus } from 'lucide-react';

interface TimelineDayProps {
  day: TimelineDay;
  onSelectDay: (day: TimelineDay) => void;
  onAddAction: (dayId: string) => void;
  onDrop: (item: any, targetDayId: string) => void;
  isDue?: boolean;
  onSelectAction?: (action: TimelineAction) => void;
  onCloneAction?: (action: TimelineAction) => void;
}

const TimelineDay: React.FC<TimelineDayProps> = ({
  day,
  onSelectDay,
  onAddAction,
  onDrop,
  isDue = false,
  onSelectAction,
  onCloneAction
}) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'ACTION',
    drop: (item: any) => {
      onDrop(item, day.id);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const handleAddAction = () => {
    onAddAction(day.id);
  };

  return (
    <div className="relative mb-8">
      <div className="flex items-center justify-center mb-4">
        <div className="bg-primary text-white rounded-full px-4 py-1 text-sm font-medium">
          {isDue ? 'Due Date' : day.day > 0 ? `D+${day.day}` : `D${day.day}`}
        </div>
      </div>
      
      <div 
        ref={drop}
        className={`p-4 border rounded-lg transition-colors ${isOver ? 'bg-primary/10' : 'bg-background'}`}
      >
        {day.actions.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">
            <p className="mb-2">No actions for this day</p>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleAddAction}
              className="flex items-center mx-auto gap-1"
            >
              <Plus size={14} />
              Add Action
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {day.actions.map((action) => (
              <TimelineActionCard 
                key={action.id} 
                action={action} 
                dayId={day.id}
                onSelectAction={onSelectAction}
                onCloneAction={onCloneAction}
              />
            ))}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleAddAction}
              className="w-full text-muted-foreground mt-2 flex items-center justify-center gap-1 border border-dashed"
            >
              <Plus size={14} />
              Add Another Action
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimelineDay;
