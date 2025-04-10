
import React from 'react';
import { TimelineAction } from '@/types/timeline';
import { useDrag } from 'react-dnd';
import { cn } from '@/lib/utils';
import { Mail, MessageSquare, Phone } from 'lucide-react';

interface TimelineActionCardProps {
  action: TimelineAction;
  dayId: string;
}

const TimelineActionCard: React.FC<TimelineActionCardProps> = ({ action, dayId }) => {
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

  return (
    <div
      ref={drag}
      className={cn(
        `timeline-action ${action.type}`,
        isDragging ? 'opacity-50' : '',
        action.conditions.length > 0 ? 'border-dashed' : ''
      )}
    >
      <div className="flex items-center gap-2">
        {renderIcon()}
        <span className="text-sm font-medium">{action.title}</span>
      </div>
      {action.description && (
        <div className="text-xs text-gray-500 mt-1">{action.description}</div>
      )}
      {action.conditions.length > 0 && (
        <div className="text-xs bg-gray-50 px-2 py-1 mt-2 rounded">
          {action.conditions.length} condition{action.conditions.length > 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
};

export default TimelineActionCard;
