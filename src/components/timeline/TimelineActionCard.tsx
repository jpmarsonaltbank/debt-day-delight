
import React from 'react';
import { TimelineAction } from '@/types/timeline';
import { useDrag } from 'react-dnd';
import { cn } from '@/lib/utils';
import { Mail, MessageSquare, Phone, GitBranch, AlertTriangle, Trash2, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TimelineActionCardProps {
  action: TimelineAction;
  dayId: string;
  onSelectAction?: (action: TimelineAction) => void;
  onCloneAction?: (action: TimelineAction) => void;
  onDeleteAction?: (action: TimelineAction) => void;
}

const TimelineActionCard: React.FC<TimelineActionCardProps> = ({ 
  action, 
  dayId,
  onSelectAction,
  onCloneAction,
  onDeleteAction
}) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'ACTION',
    item: { action, sourceDayId: dayId },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const renderIcon = () => {
    switch (action.type) {
      case 'email':
        return <Mail size={16} className="text-blue-500" />;
      case 'whatsapp':
        return <MessageSquare size={16} className="text-green-500" />;
      case 'sms':
        return <Phone size={16} className="text-amber-500" />;
      case 'negativar':
        return <AlertTriangle size={16} className="text-red-500" />;
      default:
        return null;
    }
  };

  const handleClick = () => {
    if (onSelectAction) {
      onSelectAction({...action, dayId});
    }
  };
  
  const handleClone = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the card click event
    if (onCloneAction) {
      onCloneAction({...action, dayId});
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the card click event
    if (onDeleteAction) {
      onDeleteAction({...action, dayId});
    }
  };

  return (
    <div
      ref={drag}
      className={cn(
        "timeline-action p-2 bg-white rounded-md border shadow-sm cursor-move relative",
        isDragging ? "opacity-50" : "",
        action.conditions.length > 0 ? "border-dashed border-primary/50" : ""
      )}
      onClick={handleClick}
    >
      <div className="flex items-center gap-2">
        {renderIcon()}
        <span className="text-sm font-medium">{action.name || action.subject}</span>
        
        <div className="ml-auto flex items-center">
          {onCloneAction && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 w-6 p-0"
              onClick={handleClone}
              title="Clone action"
            >
              <Copy size={14} />
            </Button>
          )}
          
          {onDeleteAction && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
              onClick={handleDelete}
              title="Delete action"
            >
              <Trash2 size={14} />
            </Button>
          )}
        </div>
      </div>
      
      {action.subject && (
        <div className="text-xs font-medium mt-1">{action.subject}</div>
      )}
      
      {action.message && (
        <div className="text-xs text-gray-500 mt-1">{action.message}</div>
      )}
      
      {action.conditions.length > 0 && (
        <div className="flex items-center gap-1 text-xs bg-muted/30 px-2 py-1 mt-2 rounded">
          <GitBranch size={12} className="text-primary" />
          <span>{action.conditions.length} condition{action.conditions.length > 1 ? 's' : ''}</span>
        </div>
      )}
    </div>
  );
};

export default TimelineActionCard;
