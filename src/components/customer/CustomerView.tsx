
import React from 'react';
import { Customer } from '@/types/customer';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CustomerForm from './CustomerForm';
import CustomerTimeline from './CustomerTimeline';

interface CustomerViewProps {
  customer?: Customer;
  onSave: (customer: Customer) => void;
  onBack: () => void;
}

const CustomerView: React.FC<CustomerViewProps> = ({ 
  customer, 
  onSave, 
  onBack
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onBack} 
          className="flex items-center gap-1"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to list
        </Button>
        <h2 className="text-xl font-bold">
          {customer?.id ? 'Edit Customer' : 'Add New Customer'}
        </h2>
      </div>

      <Tabs defaultValue="details" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="details">Customer Details</TabsTrigger>
          <TabsTrigger value="timeline">Customer Timeline</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details" className="mt-4">
          <CustomerForm 
            customer={customer} 
            onSave={onSave}
            embedded={true}
          />
        </TabsContent>
        
        <TabsContent value="timeline" className="mt-4">
          <CustomerTimeline customerId={customer?.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CustomerView;
