import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Timeline } from '@/types/timeline';
import { Plus, Trash2, FileEdit, Copy } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { getTimelines, saveTimeline, deleteTimeline, migrateFromLocalStorage } from '@/lib/db';
import { BarChart as ChartBar } from "lucide-react";

const TimelineList = () => {
  const { toast } = useToast();
  const [timelines, setTimelines] = useState<Timeline[]>([]);
  const [newTimelineName, setNewTimelineName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTimelines = async () => {
      try {
        await migrateFromLocalStorage();
        const loadedTimelines = await getTimelines();
        setTimelines(loadedTimelines);
      } catch (error) {
        console.error('Error loading timelines:', error);
        toast({
          title: "Error Loading Timelines",
          description: "There was a problem loading your timelines. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadTimelines();
  }, []);

  const handleCreateTimeline = async () => {
    if (!newTimelineName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a name for the timeline",
        variant: "destructive",
      });
      return;
    }

    try {
      const newTimeline: Timeline = {
        id: `timeline-${Date.now()}`,
        name: newTimelineName,
        days: [],
        libraryActions: [],
        createdAt: new Date().toISOString()
      };

      await saveTimeline(newTimeline);
      setTimelines([...timelines, newTimeline]);
      setNewTimelineName('');
      setIsCreating(false);

      toast({
        title: "Timeline Created",
        description: `"${newTimelineName}" has been created successfully`,
      });
    } catch (error) {
      console.error('Error creating timeline:', error);
      toast({
        title: "Error Creating Timeline",
        description: "There was a problem creating your timeline. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTimeline = async (id: string) => {
    try {
      await deleteTimeline(id);
      setTimelines(timelines.filter(timeline => timeline.id !== id));
      
      toast({
        title: "Timeline Deleted",
        description: "The timeline has been deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting timeline:', error);
      toast({
        title: "Error Deleting Timeline",
        description: "There was a problem deleting your timeline. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDuplicateTimeline = async (timeline: Timeline) => {
    try {
      const duplicatedTimeline: Timeline = {
        ...JSON.parse(JSON.stringify(timeline)),
        id: `timeline-${Date.now()}`,
        name: `${timeline.name} (Copy)`,
        createdAt: new Date().toISOString()
      };

      await saveTimeline(duplicatedTimeline);
      setTimelines([...timelines, duplicatedTimeline]);
      
      toast({
        title: "Timeline Duplicated",
        description: `"${timeline.name}" has been duplicated successfully`,
      });
    } catch (error) {
      console.error('Error duplicating timeline:', error);
      toast({
        title: "Error Duplicating Timeline",
        description: "There was a problem duplicating your timeline. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Credit Card Collection Timelines</h1>
        <div className="flex gap-2">
          <Button 
            asChild
            variant="outline"
            className="flex items-center gap-2"
          >
            <Link to="/collection-timeline-performance">
              <ChartBar className="w-5 h-5 mr-1" />
              Compare Performance
            </Link>
          </Button>
          <Button 
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-2"
          >
            <Plus size={16} />
            New Timeline
          </Button>
        </div>
      </div>

      {isCreating && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Create New Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Input
                placeholder="Enter timeline name"
                value={newTimelineName}
                onChange={(e) => setNewTimelineName(e.target.value)}
              />
              <Button onClick={handleCreateTimeline}>Create</Button>
              <Button variant="outline" onClick={() => setIsCreating(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div className="col-span-full text-center py-12 bg-muted/30 rounded-lg">
          <p className="text-muted-foreground">Loading timelines...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {timelines.length === 0 ? (
            <div className="col-span-full text-center py-12 bg-muted/30 rounded-lg">
              <p className="text-muted-foreground mb-4">No timelines created yet</p>
              <Button onClick={() => setIsCreating(true)} className="flex mx-auto items-center gap-2">
                <Plus size={16} />
                Create your first timeline
              </Button>
            </div>
          ) : (
            timelines.map((timeline) => (
              <Card key={timeline.id}>
                <CardHeader>
                  <CardTitle>{timeline.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Created: {new Date(timeline.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-sm mt-2">
                    {timeline.days.filter(d => d.active).length} active days
                  </p>
                  <p className="text-sm">
                    {timeline.days.reduce((total, day) => total + day.actions.length, 0)} actions
                  </p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="flex gap-2">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm" className="gap-1">
                          <Trash2 size={14} />
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Timeline</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{timeline.name}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteTimeline(timeline.id)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="gap-1"
                      onClick={() => handleDuplicateTimeline(timeline)}
                    >
                      <Copy size={14} />
                      Clone
                    </Button>
                  </div>
                  
                  <Button asChild size="sm" className="gap-1">
                    <Link to={`/timeline/${timeline.id}`}>
                      <FileEdit size={14} />
                      Edit
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default TimelineList;
