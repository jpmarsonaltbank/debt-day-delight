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
import { Search, Plus, Pencil, Trash2, GripVertical } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { CustomerSegment } from '@/types/customer-segment';
import { 
  getCustomerSegments, 
  saveCustomerSegment, 
  deleteCustomerSegment, 
  addSampleCustomerSegments 
} from '@/lib/customer-segment-db';
import CustomerSegmentForm from '@/components/customer-segment/CustomerSegmentForm';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';

const SortableTableRow = ({ segment, onEdit, onDelete }: { 
  segment: CustomerSegment, 
  onEdit: (segment: CustomerSegment) => void, 
  onDelete: (id: string) => void 
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: segment.id as string,
  });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1 : 0,
    position: 'relative' as const,
  };
  
  return (
    <TableRow ref={setNodeRef} style={style} className={isDragging ? 'bg-muted' : ''}>
      <TableCell>
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            className="cursor-grab mr-2" 
            {...attributes} 
            {...listeners}
          >
            <GripVertical className="h-4 w-4" />
          </Button>
          {segment.priority}
        </div>
      </TableCell>
      <TableCell className="font-medium">{segment.name}</TableCell>
      <TableCell>{segment.description}</TableCell>
      <TableCell>{segment.rules.length}</TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(segment)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(segment.id as string)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

const CustomerSegments = () => {
  const [segments, setSegments] = useState<CustomerSegment[]>([]);
  const [filteredSegments, setFilteredSegments] = useState<CustomerSegment[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentSegment, setCurrentSegment] = useState<CustomerSegment | undefined>(undefined);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [segmentToDelete, setSegmentToDelete] = useState<string | undefined>(undefined);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor)
  );

  useEffect(() => {
    const loadSegments = async () => {
      try {
        await addSampleCustomerSegments();
        const loadedSegments = await getCustomerSegments();
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

  const getExistingPriorities = (): number[] => {
    if (!currentSegment) {
      return segments.map(segment => segment.priority);
    }
    return segments
      .filter(segment => segment.id !== currentSegment.id)
      .map(segment => segment.priority);
  };

  const handleSubmitForm = async (data: CustomerSegment) => {
    setIsLoading(true);
    try {
      await saveCustomerSegment(data);
      const updatedSegments = await getCustomerSegments();
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

  const handleDeleteConfirm = async () => {
    if (!segmentToDelete) return;
    
    setIsLoading(true);
    try {
      await deleteCustomerSegment(segmentToDelete);
      const updatedSegments = await getCustomerSegments();
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

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = segments.findIndex(segment => segment.id === active.id);
      const newIndex = segments.findIndex(segment => segment.id === over.id);
      
      if (oldIndex !== -1 && newIndex !== -1) {
        setIsLoading(true);
        
        try {
          const reorderedSegments = [...segments];
          const [movedSegment] = reorderedSegments.splice(oldIndex, 1);
          reorderedSegments.splice(newIndex, 0, movedSegment);
          
          const updatedSegments = reorderedSegments.map((segment, index) => ({
            ...segment,
            priority: index + 1,
          }));
          
          for (const segment of updatedSegments) {
            await saveCustomerSegment(segment);
          }
          
          setSegments(updatedSegments);
          toast({
            title: 'Priorities updated',
            description: 'Segment priorities have been successfully updated',
          });
        } catch (error) {
          console.error('Error updating segment priorities:', error);
          toast({
            title: 'Error',
            description: 'Failed to update segment priorities',
            variant: 'destructive',
          });
        } finally {
          setIsLoading(false);
        }
      }
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
            <DndContext 
              sensors={sensors} 
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
              modifiers={[restrictToVerticalAxis]}
            >
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
                  <SortableContext 
                    items={filteredSegments.map(segment => segment.id as string)} 
                    strategy={verticalListSortingStrategy}
                  >
                    {filteredSegments.map((segment) => (
                      <SortableTableRow 
                        key={segment.id}
                        segment={segment}
                        onEdit={(segment) => {
                          setCurrentSegment(segment);
                          setIsFormOpen(true);
                        }}
                        onDelete={(id) => {
                          setSegmentToDelete(id);
                          setIsDeleteDialogOpen(true);
                        }}
                      />
                    ))}
                  </SortableContext>
                </TableBody>
              </Table>
            </DndContext>
          </div>
        )}

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
