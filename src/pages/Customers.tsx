
import React, { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { 
  User, 
  UserPlus, 
  Edit, 
  Trash2, 
  Search,
  Mail,
  Phone,
  MapPin,
  Info
} from 'lucide-react';
import { Customer } from '@/types/customer';
import { 
  getCustomers, 
  saveCustomer, 
  deleteCustomer, 
  addSampleCustomers 
} from '@/lib/customer-db';
import CustomerForm from '@/components/customer/CustomerForm';

const Customers = () => {
  const { toast } = useToast();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | undefined>();
  const [customerToDelete, setCustomerToDelete] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Load customers on component mount
  useEffect(() => {
    const loadCustomers = async () => {
      try {
        await addSampleCustomers(); // Add sample data if none exists
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

  // Filter customers when search term changes
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredCustomers(customers);
    } else {
      const filtered = customers.filter(
        customer =>
          customer.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.document.includes(searchTerm) ||
          customer.external_id.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCustomers(filtered);
    }
  }, [searchTerm, customers]);

  // Handle save customer
  const handleSaveCustomer = async (customer: Customer) => {
    try {
      await saveCustomer(customer);
      
      // Refresh customer list
      const updatedCustomers = await getCustomers();
      setCustomers(updatedCustomers);
      
      toast({
        title: 'Success',
        description: customer.id 
          ? 'Customer updated successfully' 
          : 'Customer created successfully',
      });
    } catch (error) {
      console.error('Error saving customer:', error);
      toast({
        title: 'Error',
        description: 'Failed to save customer',
        variant: 'destructive',
      });
    }
  };

  // Handle delete customer
  const handleDeleteCustomer = async () => {
    if (!customerToDelete) return;
    
    try {
      await deleteCustomer(customerToDelete);
      
      // Refresh customer list
      const updatedCustomers = await getCustomers();
      setCustomers(updatedCustomers);
      
      toast({
        title: 'Success',
        description: 'Customer deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting customer:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete customer',
        variant: 'destructive',
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setCustomerToDelete(null);
    }
  };

  // Open edit form with selected customer
  const openEditForm = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsFormOpen(true);
  };

  // Open confirm delete dialog
  const openDeleteDialog = (id: string) => {
    setCustomerToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  // Get primary contact information
  const getPrimaryEmail = (customer: Customer) => {
    const primaryEmail = customer.emails.find(email => email.principal);
    return primaryEmail?.email_address || customer.emails[0]?.email_address || '-';
  };

  const getPrimaryPhone = (customer: Customer) => {
    const primaryPhone = customer.phones.find(phone => phone.principal);
    return primaryPhone?.phone_number || customer.phones[0]?.phone_number || '-';
  };

  const getPrimaryAddress = (customer: Customer) => {
    const primaryAddress = customer.addresses.find(address => address.principal);
    if (!primaryAddress && customer.addresses.length === 0) return '-';
    
    const address = primaryAddress || customer.addresses[0];
    return `${address.address}, ${address.number}, ${address.city}`;
  };

  // Get status badge classname
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
      <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <CardTitle className="flex gap-2 items-center">
          <User className="h-6 w-6" />
          Customers
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
          <Button 
            onClick={() => {
              setSelectedCustomer(undefined);
              setIsFormOpen(true);
            }}
            className="flex gap-1"
          >
            <UserPlus className="h-4 w-4" />
            Add Customer
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
                  <TableHead>Contact Info</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>
                      <div className="font-medium">{customer.full_name}</div>
                      <div className="text-xs text-muted-foreground">ID: {customer.external_id}</div>
                    </TableCell>
                    <TableCell>{customer.document}</TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                          {getPrimaryEmail(customer)}
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                          {getPrimaryPhone(customer)}
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                          {getPrimaryAddress(customer)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <span className={`px-2 py-1 rounded text-xs inline-block text-center w-min whitespace-nowrap ${getStatusClass(customer.status)}`}>
                          {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs inline-block text-center w-min whitespace-nowrap ${getStatusClass(customer.collection_status)}`}>
                          {customer.collection_status.charAt(0).toUpperCase() + customer.collection_status.slice(1)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditForm(customer)}
                          title="Edit customer"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => openDeleteDialog(customer.id as string)}
                          title="Delete customer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Customer form modal */}
        <CustomerForm
          customer={selectedCustomer}
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSave={handleSaveCustomer}
        />

        {/* Delete confirmation dialog */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                customer and all associated data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDeleteCustomer}
                className="bg-red-500 hover:bg-red-600"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
};

export default Customers;
