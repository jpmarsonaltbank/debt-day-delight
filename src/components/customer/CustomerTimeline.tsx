
import React, { useEffect, useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  CalendarClock, 
  Clock, 
  User, 
  MessageSquare, 
  Mail, 
  Phone,
  Check,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { CustomerTimelineEvent } from '@/types/timeline';
import { getCustomerEvents, addSampleTimelineEvents } from '@/lib/customer-timeline-db';
import { format } from 'date-fns';

interface CustomerTimelineProps {
  customerId?: string;
}

const CustomerTimeline: React.FC<CustomerTimelineProps> = ({ customerId }) => {
  const [events, setEvents] = useState<CustomerTimelineEvent[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      if (!customerId) return;
      
      setLoading(true);
      try {
        // Add sample data if this is the first time viewing this customer
        await addSampleTimelineEvents(customerId);
        
        // Get all events for the customer
        const customerEvents = await getCustomerEvents(customerId);
        setEvents(customerEvents);
      } catch (error) {
        console.error('Error fetching customer timeline:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [customerId]);

  const getIcon = (type: string) => {
    if (type.startsWith('email')) {
      return <Mail className="h-4 w-4 text-blue-500" />;
    } else if (type.startsWith('sms')) {
      return <MessageSquare className="h-4 w-4 text-green-500" />;
    } else if (type.startsWith('whatsapp')) {
      return <Phone className="h-4 w-4 text-green-600" />;
    } else if (type.includes('status')) {
      return <ArrowUp className="h-4 w-4 text-amber-500" />;
    } else if (type === 'data_enrichment') {
      return <CalendarClock className="h-4 w-4 text-purple-500" />;
    } else {
      return <User className="h-4 w-4 text-gray-500" />;
    }
  };

  const getBadgeColor = (type: string) => {
    if (type.includes('delivered') || type.includes('opened') || type.includes('clicked')) {
      return 'bg-green-100 text-green-800';
    } else if (type.includes('failed')) {
      return 'bg-red-100 text-red-800';
    } else if (type.includes('sent')) {
      return 'bg-blue-100 text-blue-800';
    } else if (type === 'collection_status_change') {
      return 'bg-amber-100 text-amber-800';
    } else if (type === 'customer_status_change') {
      return 'bg-purple-100 text-purple-800';
    } else {
      return 'bg-gray-100 text-gray-800';
    }
  };

  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'PPP'); // Format: Apr 22, 2025
  };

  const formatEventTime = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'p'); // Format: 10:30 AM
  };

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
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p>Loading timeline data...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center p-6 text-muted-foreground">
            No timeline events found for this customer
          </div>
        ) : (
          <ScrollArea className="h-[400px] pr-4">
            <div className="relative pl-6 border-l">
              {events.map((event) => (
                <div key={event.id} className="mb-8 relative">
                  <div className="absolute -left-[25px] p-1 bg-background border rounded-full">
                    {getIcon(event.type)}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground mb-1 gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{formatEventDate(event.date)} at {formatEventTime(event.date)}</span>
                    <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${getBadgeColor(event.type)}`}>
                      {event.type.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <h4 className="font-medium">{event.title}</h4>
                  <p className="text-sm text-muted-foreground">{event.description}</p>
                  {event.metadata && (
                    <div className="text-xs text-muted-foreground mt-1 bg-muted p-2 rounded">
                      {Object.entries(event.metadata).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="font-medium">{key}:</span>
                          <span>{value}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};

export default CustomerTimeline;
