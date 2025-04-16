
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
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
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { Search, Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { CustomerSegment } from '@/types/customer-segment';
import { 
  getCustomerSegments, 
  saveCustomerSegment, 
  deleteCustomerSegment, 
  addSampleCustomerSegments 
} from '@/lib/customer-segment-db';
import CustomerSegmentForm from '@/components/customer-segment/CustomerSegmentForm';

const CustomerSegments = () => {
  const [segments, setSegments] = useState<CustomerSegment[]>([]);
  const [filteredSegments, setFilteredSegments] = useState<CustomerSegment[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentSegment, setCurrentSegment] = useState<CustomerSegment | undefined>(undefined);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [segmentToDelete, setSegmentToDelete] = useState<string | undefined>(undefined);

  // Load segments on mount
  useEffect(() => {
    const loadSegments = async () => {
      try {
        await addSampleCustomerSegments();
        const loadedSegments = await getCustomerSegments();
        // Sort segments by priority (ascending)
        const sortedSegments = loadedSegments.sort((a, b) => a.priority - b.priority);
        setSegments(sortedSegments);
        setFilteredSegments(sortedSegments);
      } catch (error) {
        console.error('Error loading segments:', error);
        toast({
          title: 'Error',
          description: 'Failed to load customer segments',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadSegments();
  }, []);

  // Filter segments when search query changes
  useEffect(() => {
    if (searchQuery) {
      const filtered = segments.filter(segment => 
        segment.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        segment.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredSegments(filtered);
    } else {
      setFilteredSegments(segments);
    }
  }, [searchQuery, segments]);

  // Get existing priorities except for the current segment being edited
  const getExistingPriorities = (): number[] => {
    if (!currentSegment) {
      return segments.map(segment => segment.priority);
    }
    return segments
      .filter(segment => segment.id !== currentSegment.id)
      .map(segment => segment.priority);
  };

  // Handle segment form submission
  const handleSubmitForm = async (data: CustomerSegment) => {
    setIsLoading(true);
    try {
      await saveCustomerSegment(data);
      const updatedSegments = await getCustomerSegments();
      // Sort segments by priority (ascending)
      const sortedSegments = updatedSegments.sort((a, b) => a.priority - b.priority);
      setSegments(sortedSegments);
      setIsFormOpen(false);
      setCurrentSegment(undefined);
    } catch (error) {
      console.error('Error saving segment:', error);
      toast({
        title: 'Error',
        description: 'Failed to save customer segment',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    if (!segmentToDelete) return;
    
    setIsLoading(true);
    try {
      await deleteCustomerSegment(segmentToDelete);
      const updatedSegments = await getCustomerSegments();
      // Sort segments by priority (ascending)
      const sortedSegments = updatedSegments.sort((a, b) => a.priority - b.priority);
      setSegments(sortedSegments);
      toast({
        title: 'Segment deleted',
        description: 'The customer segment has been deleted',
      });
    } catch (error) {
      console.error('Error deleting segment:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete customer segment',
        variant: 'destructive',
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setSegmentToDelete(undefined);
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Customer Segments</CardTitle>
            <CardDescription>Manage your customer segments</CardDescription>
          </div>
          <Button 
            onClick={() => {
              setCurrentSegment(undefined);
              setIsFormOpen(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            New Segment
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search segments..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <p>Loading segments...</p>
          </div>
        ) : filteredSegments.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No segments found.</p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Priority</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Rules</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSegments.map((segment) => (
                  <TableRow key={segment.id}>
                    <TableCell>{segment.priority}</TableCell>
                    <TableCell className="font-medium">{segment.name}</TableCell>
                    <TableCell>{segment.description}</TableCell>
                    <TableCell>{segment.rules.length}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setCurrentSegment(segment);
                            setIsFormOpen(true);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSegmentToDelete(segment.id);
                            setIsDeleteDialogOpen(true);
                          }}
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

        {/* Create/Edit Segment Dialog */}
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                {currentSegment ? 'Edit Segment' : 'Create New Segment'}
              </DialogTitle>
              <DialogDescription>
                Customer segments help you target specific groups based on criteria.
              </DialogDescription>
            </DialogHeader>
            <CustomerSegmentForm
              initialData={currentSegment}
              onSubmit={handleSubmitForm}
              onCancel={() => setIsFormOpen(false)}
              existingPriorities={getExistingPriorities()}
            />
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog 
          open={isDeleteDialogOpen} 
          onOpenChange={setIsDeleteDialogOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                customer segment.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteConfirm}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
};

export default CustomerSegments;
