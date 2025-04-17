
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarClock, Clock, User, MessageSquare } from 'lucide-react';

interface CustomerTimelineProps {
  customerId?: string;
}

const CustomerTimeline: React.FC<CustomerTimelineProps> = ({ customerId }) => {
  // This is a placeholder component - in a real app, you would fetch actual timeline data
  const timelineItems = [
    { 
      id: '1', 
      date: '2025-04-15', 
      time: '10:30', 
      type: 'email', 
      title: 'Welcome Email Sent', 
      description: 'Automated welcome email sent to customer' 
    },
    { 
      id: '2', 
      date: '2025-04-16', 
      time: '14:45', 
      type: 'message', 
      title: 'Customer Service Chat', 
      description: 'Customer inquired about services' 
    },
    { 
      id: '3', 
      date: '2025-04-17', 
      time: '09:15', 
      type: 'account', 
      title: 'Profile Updated', 
      description: 'Customer updated their profile information' 
    }
  ];

  if (!customerId) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center p-6 text-muted-foreground">
            Save the customer first to view timeline data
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Activity Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="relative pl-6 border-l">
            {timelineItems.map((item, index) => (
              <div key={item.id} className="mb-8 relative">
                <div className="absolute -left-[25px] p-1 bg-background border rounded-full">
                  {item.type === 'email' && <MessageSquare className="h-4 w-4 text-blue-500" />}
                  {item.type === 'message' && <User className="h-4 w-4 text-green-500" />}
                  {item.type === 'account' && <CalendarClock className="h-4 w-4 text-purple-500" />}
                </div>
                <div className="flex items-center text-sm text-muted-foreground mb-1">
                  <Clock className="mr-1 h-3 w-3" />
                  <span>{item.date} at {item.time}</span>
                </div>
                <h4 className="font-medium">{item.title}</h4>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default CustomerTimeline;
