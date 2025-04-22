
import React, { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Search,
  Filter,
  Calendar,
  ArrowLeft
} from 'lucide-react';
import { Customer } from '@/types/customer';
import { getCustomers } from '@/lib/customer-db';
import CustomerTimeline from '@/components/customer/CustomerTimeline';

const CustomerTimelinePage = () => {
  const { toast } = useToast();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCustomers = async () => {
      try {
        const data = await getCustomers();
        setCustomers(data);
        setFilteredCustomers(data);
        setLoading(false);
      } catch (error) {
        console.error('Error loading customers:', error);
        toast({
          title: 'Error',
          description: 'Failed to load customers',
          variant: 'destructive',
        });
        setLoading(false);
      }
    };

    loadCustomers();
  }, [toast]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredCustomers(customers);
    } else {
      const filtered = customers.filter(
        customer =>
          customer.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.document.includes(searchTerm) ||
          (customer.external_id && customer.external_id.toLowerCase().includes(searchTerm.toLowerCase())) ||
          customer.emails.some(email => email.email_address.toLowerCase().includes(searchTerm.toLowerCase())) ||
          customer.phones.some(phone => phone.phone_number.includes(searchTerm))
      );
      setFilteredCustomers(filtered);
    }
  }, [searchTerm, customers]);

  const viewCustomerTimeline = (customer: Customer) => {
    setSelectedCustomer(customer);
  };

  const backToList = () => {
    setSelectedCustomer(null);
  };

  const getPrimaryEmail = (customer: Customer) => {
    const primaryEmail = customer.emails.find(email => email.principal);
    return primaryEmail?.email_address || customer.emails[0]?.email_address || '-';
  };

  const getPrimaryPhone = (customer: Customer) => {
    const primaryPhone = customer.phones.find(phone => phone.principal);
    return primaryPhone?.phone_number || customer.phones[0]?.phone_number || '-';
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'normal':
        return 'bg-green-100 text-green-800';
      case 'blocked':
        return 'bg-red-100 text-red-800';
      case 'suspended':
        return 'bg-yellow-100 text-yellow-800';
      case 'current':
        return 'bg-blue-100 text-blue-800';
      case 'late':
        return 'bg-orange-100 text-orange-800';
      case 'defaulted':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="w-full">
      {selectedCustomer ? (
        <>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={backToList}
                className="h-8 w-8 p-0"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <CardTitle>
                Customer Timeline: {selectedCustomer.full_name}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="space-y-2">
                <h3 className="font-medium">Basic Information</h3>
                <div className="grid grid-cols-2 gap-1 text-sm">
                  <span className="text-muted-foreground">Name:</span>
                  <span>{selectedCustomer.full_name}</span>
                  
                  <span className="text-muted-foreground">ID:</span>
                  <span>{selectedCustomer.external_id}</span>
                  
                  <span className="text-muted-foreground">Document:</span>
                  <span>{selectedCustomer.document}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium">Contact Information</h3>
                <div className="grid grid-cols-2 gap-1 text-sm">
                  <span className="text-muted-foreground">Email:</span>
                  <span>{getPrimaryEmail(selectedCustomer)}</span>
                  
                  <span className="text-muted-foreground">Phone:</span>
                  <span>{getPrimaryPhone(selectedCustomer)}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium">Status Information</h3>
                <div className="grid grid-cols-2 gap-1 text-sm">
                  <span className="text-muted-foreground">Status:</span>
                  <span className={`px-2 py-0.5 rounded text-xs inline-block w-fit ${getStatusClass(selectedCustomer.status)}`}>
                    {selectedCustomer.status.charAt(0).toUpperCase() + selectedCustomer.status.slice(1)}
                  </span>
                  
                  <span className="text-muted-foreground">Collection:</span>
                  <span className={`px-2 py-0.5 rounded text-xs inline-block w-fit ${getStatusClass(selectedCustomer.collection_status)}`}>
                    {selectedCustomer.collection_status.charAt(0).toUpperCase() + selectedCustomer.collection_status.slice(1)}
                  </span>
                </div>
              </div>
            </div>
            
            <CustomerTimeline customerId={selectedCustomer.id} />
          </CardContent>
        </>
      ) : (
        <>
          <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle className="flex gap-2 items-center">
              <Calendar className="h-5 w-5" />
              Customer Timeline
            </CardTitle>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search customers..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <p>Loading customers...</p>
              </div>
            ) : filteredCustomers.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No customers found</p>
                {searchTerm && (
                  <p className="text-sm">
                    Try adjusting your search term or{' '}
                    <Button 
                      variant="link" 
                      className="p-0" 
                      onClick={() => setSearchTerm('')}
                    >
                      clear the search
                    </Button>
                  </p>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table className="border">
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Document</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Collection</TableHead>
                      <TableHead className="w-[80px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCustomers.map((customer) => (
                      <TableRow key={customer.id}>
                        <TableCell>
                          <div className="font-medium">
                            {customer.full_name}
                          </div>
                          <div className="text-xs text-muted-foreground">ID: {customer.external_id}</div>
                        </TableCell>
                        <TableCell>{customer.document}</TableCell>
                        <TableCell>
                          <div className="text-sm">{getPrimaryEmail(customer)}</div>
                          <div className="text-sm">{getPrimaryPhone(customer)}</div>
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded text-xs inline-block ${getStatusClass(customer.status)}`}>
                            {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded text-xs inline-block ${getStatusClass(customer.collection_status)}`}>
                            {customer.collection_status.charAt(0).toUpperCase() + customer.collection_status.slice(1)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            onClick={() => viewCustomerTimeline(customer)}
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </>
      )}
    </Card>
  );
};

export default CustomerTimelinePage;
