
import React from 'react';
import { TimelineAction } from '@/types/timeline';
import { useDrag } from 'react-dnd';
import { cn } from '@/lib/utils';
import { Mail, MessageSquare, Phone, GitBranch } from 'lucide-react';

interface TimelineActionCardProps {
  action: TimelineAction;
  dayId: string;
  onSelectAction?: (action: TimelineAction) => void;
}

const TimelineActionCard: React.FC<TimelineActionCardProps> = ({ 
  action, 
  dayId,
  onSelectAction 
}) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'ACTION',
    item: { action, dayId },
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
      default:
        return null;
    }
  };

  const handleClick = () => {
    if (onSelectAction) {
      onSelectAction(action);
    }
  };

  return (
    <div
      ref={drag}
      className={cn(
        "timeline-action p-2 bg-white rounded-md border shadow-sm cursor-move",
        isDragging ? "opacity-50" : "",
        action.conditions.length > 0 ? "border-dashed border-primary/50" : ""
      )}
      onClick={handleClick}
    >
      <div className="flex items-center gap-2">
        {renderIcon()}
        <span className="text-sm font-medium">{action.title}</span>
      </div>
      
      {action.description && (
        <div className="text-xs text-gray-500 mt-1">{action.description}</div>
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
