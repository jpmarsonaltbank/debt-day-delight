import React from 'react';
import { useForm } from 'react-hook-form';
import { Customer } from '@/types/customer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface CustomerFormProps {
  customer?: Customer;
  isOpen?: boolean;
  onClose?: () => void;
  onSave: (customer: Customer) => void;
  embedded?: boolean;
}

const defaultCustomer: Customer = {
  external_id: '',
  full_name: '',
  social_name: '',
  best_name: '',
  document: '',
  pep: false,
  gender: 'not_specified',
  birthdate: '',
  status: 'normal',
  collection_status: 'current',
  addresses: [
    {
      principal: true,
      address: '',
      number: '',
      additional_information: '',
      neighborhood: '',
      city: '',
      state: '',
      country: 'Brazil',
      status: 'active'
    }
  ],
  phones: [
    {
      principal: true,
      phone_number: '',
      status: 'active'
    }
  ],
  emails: [
    {
      principal: true,
      email_address: '',
      status: 'active'
    }
  ],
  tenant_name: 'tenant123'
};

const CustomerForm: React.FC<CustomerFormProps> = ({ 
  customer = defaultCustomer, 
  isOpen, 
  onClose, 
  onSave,
  embedded = false
}) => {
  const form = useForm<Customer>({
    defaultValues: customer
  });

  const handleSubmit = (data: Customer) => {
    onSave(data);
    if (onClose) onClose();
  };

  const formContent = (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <ScrollArea className={embedded ? "h-[calc(100vh-280px)]" : "max-h-[70vh]"}>
          <div className="pr-4 pb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Basic Information */}
              <FormField
                control={form.control}
                name="full_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name*</FormLabel>
                    <FormControl>
                      <Input placeholder="Full Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="social_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Social Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Social Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="best_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Best Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Best Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="external_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>External ID*</FormLabel>
                    <FormControl>
                      <Input placeholder="External ID" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="document"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Document*</FormLabel>
                    <FormControl>
                      <Input placeholder="Document" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="birthdate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Birthdate*</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                        <SelectItem value="not_specified">Not Specified</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="blocked">Blocked</SelectItem>
                        <SelectItem value="suspended">Suspended</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="collection_status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Collection Status</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select collection status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="current">Current</SelectItem>
                        <SelectItem value="late">Late</SelectItem>
                        <SelectItem value="defaulted">Defaulted</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="pep"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-4">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                        className="h-4 w-4 mt-1"
                      />
                    </FormControl>
                    <FormLabel>Politically Exposed Person (PEP)</FormLabel>
                  </FormItem>
                )}
              />
            </div>
            
            {/* Contact Information */}
            <div className="space-y-4 mt-6">
              <h3 className="text-lg font-medium">Contact Information</h3>
              
              {/* Email */}
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  placeholder="Email Address"
                  value={form.watch('emails.0.email_address')}
                  onChange={(e) => form.setValue('emails.0.email_address', e.target.value)}
                />
              </div>
              
              {/* Phone */}
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input
                  placeholder="Phone Number"
                  value={form.watch('phones.0.phone_number')}
                  onChange={(e) => form.setValue('phones.0.phone_number', e.target.value)}
                />
              </div>
              
              {/* Address */}
              <div className="space-y-2">
                <h4 className="font-medium">Address</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Street</Label>
                    <Input
                      placeholder="Street"
                      value={form.watch('addresses.0.address')}
                      onChange={(e) => form.setValue('addresses.0.address', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Number</Label>
                    <Input
                      placeholder="Number"
                      value={form.watch('addresses.0.number')}
                      onChange={(e) => form.setValue('addresses.0.number', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Additional Info</Label>
                    <Input
                      placeholder="Additional Information"
                      value={form.watch('addresses.0.additional_information') || ''}
                      onChange={(e) => form.setValue('addresses.0.additional_information', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Neighborhood</Label>
                    <Input
                      placeholder="Neighborhood"
                      value={form.watch('addresses.0.neighborhood')}
                      onChange={(e) => form.setValue('addresses.0.neighborhood', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>City</Label>
                    <Input
                      placeholder="City"
                      value={form.watch('addresses.0.city')}
                      onChange={(e) => form.setValue('addresses.0.city', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>State</Label>
                    <Input
                      placeholder="State"
                      value={form.watch('addresses.0.state')}
                      onChange={(e) => form.setValue('addresses.0.state', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Country</Label>
                    <Input
                      placeholder="Country"
                      value={form.watch('addresses.0.country')}
                      onChange={(e) => form.setValue('addresses.0.country', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
        
        <div className="flex justify-end space-x-4 pt-4 border-t mt-4">
          {!embedded && onClose && (
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          )}
          <Button type="submit">
            {customer.id ? 'Update' : 'Create'} Customer
          </Button>
        </div>
      </form>
    </Form>
  );

  if (embedded) {
    return (
      <Card>
        <CardContent className="pt-6">
          {formContent}
        </CardContent>
      </Card>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{customer.id ? 'Edit Customer' : 'Add New Customer'}</DialogTitle>
        </DialogHeader>
        {formContent}
      </DialogContent>
    </Dialog>
  );
};

export default CustomerForm;
