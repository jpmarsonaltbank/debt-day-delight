
import React from 'react';
import { TimelineDay as TimelineDayType, TimelineAction } from '@/types/timeline';
import TimelineActionCard from './TimelineActionCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useDrop } from 'react-dnd';
import { cn } from '@/lib/utils';

interface TimelineDayProps {
  day: TimelineDayType;
  onSelectDay: (day: TimelineDayType) => void;
  onAddAction: (dayId: string) => void;
  onDrop: (item: any, dayId: string) => void;
  isDue: boolean;
  onSelectAction?: (action: TimelineAction) => void;
}

const TimelineDay: React.FC<TimelineDayProps> = ({ 
  day, 
  onSelectDay, 
  onAddAction, 
  onDrop,
  isDue,
  onSelectAction
}) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'ACTION',
    drop: (item) => onDrop(item, day.id),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const dayLabel = day.day === 0 
    ? 'Due Date' 
    : day.day > 0 
      ? `D+${day.day}` 
      : `D${day.day}`;

  const markerClass = cn(
    'timeline-day-marker relative w-8 h-8 flex items-center justify-center rounded-full mb-2 mx-auto z-10',
    {
      'bg-red-500 text-white': isDue,
      'bg-blue-500 text-white': day.active && !isDue,
      'bg-gray-300 text-gray-600': !day.active
    }
  );

  return (
    <div ref={drop} className="timeline-day mb-8 relative">
      <div className={markerClass}>{dayLabel}</div>
      
      {day.active && (
        <Card className={cn(
          "w-64 mx-auto transition-all", 
          isOver ? "ring-2 ring-primary/50" : ""
        )}>
          <CardHeader className="p-3 pb-0">
            <CardTitle className="text-sm flex justify-between items-center">
              <span>{dayLabel}</span>
              <Button 
                size="sm" 
                variant="ghost" 
                className="h-7 w-7 p-0"
                onClick={() => onAddAction(day.id)}
              >
                <Plus size={16} />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 space-y-2">
            {day.actions.length === 0 ? (
              <div className="text-xs text-gray-400 text-center p-2">
                Drop actions here or click + to add
              </div>
            ) : (
              day.actions.map((action) => (
                <TimelineActionCard 
                  key={action.id}
                  action={action}
                  dayId={day.id}
                  onSelectAction={onSelectAction}
                />
              ))
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TimelineDay;
