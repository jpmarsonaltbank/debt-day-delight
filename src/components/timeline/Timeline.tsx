import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TimelineDay as TimelineDayType, TimelineAction, Condition, Timeline as TimelineType } from '@/types/timeline';
import TimelineDay from './TimelineDay';
import ActionEditor from './ActionEditor';
import ConditionEditor from './ConditionEditor';
import ActionLibrary from './ActionLibrary';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Download, ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { Dialog } from '@/components/ui/dialog';

const Timeline: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { id: timelineId } = useParams<{ id: string }>();
  
  const generateInitialDays = (): TimelineDayType[] => {
    const days: TimelineDayType[] = [];
    
    for (let i = -10; i <= 90; i++) {
      days.push({
        id: `day-${i}`,
        day: i,
        actions: [],
        active: i === 0
      });
    }
    
    return days;
  };

  const [days, setDays] = useState<TimelineDayType[]>(generateInitialDays());
  const [timelineName, setTimelineName] = useState<string>('Untitled Timeline');
  const [libraryActions, setLibraryActions] = useState<TimelineAction[]>([]);
  const [selectedDay, setSelectedDay] = useState<TimelineDayType | null>(null);
  const [selectedAction, setSelectedAction] = useState<TimelineAction | null>(null);
  const [selectedCondition, setSelectedCondition] = useState<Condition | null>(null);
  const [editMode, setEditMode] = useState<'action' | 'condition' | null>(null);
  const [isNewItem, setIsNewItem] = useState(false);

  const formatDayLabel = (day: TimelineDayType | null): string => {
    if (!day) return '';
    
    if (day.day === 0) return 'Due Date';
    return day.day > 0 ? `D+${day.day}` : `D${day.day}`;
  };

  useEffect(() => {
    const savedLibraryActions = localStorage.getItem('credit-card-shared-library');
    if (savedLibraryActions) {
      try {
        const actions: TimelineAction[] = JSON.parse(savedLibraryActions);
        setLibraryActions(actions);
      } catch (error) {
        console.error("Error loading shared library actions:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (timelineId) {
      const savedTimelines = localStorage.getItem('credit-card-timelines');
      if (savedTimelines) {
        try {
          const timelines: TimelineType[] = JSON.parse(savedTimelines);
          const timeline = timelines.find(t => t.id === timelineId);
          
          if (timeline) {
            setTimelineName(timeline.name);
            setDays(timeline.days.length > 0 ? timeline.days : generateInitialDays());
          } else {
            navigate('/');
            toast({
              title: "Timeline Not Found",
              description: "The timeline you're trying to edit could not be found",
              variant: "destructive",
            });
          }
        } catch (error) {
          console.error("Error loading timeline:", error);
        }
      }
    }
  }, [timelineId, navigate]);

  const getAllActions = () => {
    const allActions: TimelineAction[] = [];
    days.forEach(day => {
      day.actions.forEach(action => {
        allActions.push({ ...action, dayId: day.id });
      });
    });
    return [...allActions, ...libraryActions];
  };

  const handleAddAction = (dayId: string) => {
    setEditMode('action');
    setSelectedAction(null);
    setIsNewItem(true);
    setSelectedDay(days.find(d => d.id === dayId) || null);
  };

  const handleAddLibraryAction = () => {
    setEditMode('action');
    setSelectedAction(null);
    setIsNewItem(true);
    setSelectedDay(null);
  };

  const handleSelectAction = (action: TimelineAction) => {
    setEditMode('action');
    setSelectedAction(action);
    setIsNewItem(false);
  };

  const handleCloneAction = (action: TimelineAction) => {
    const clonedAction: TimelineAction = {
      ...action,
      id: `action-${Date.now()}`,
      name: `${action.name || action.subject} (Copy)`,
      conditions: []
    };
    
    if (action.dayId) {
      setDays(days.map(day => {
        if (day.id === action.dayId) {
          return { ...day, actions: [...day.actions, clonedAction] };
        }
        return day;
      }));
      
      toast({
        title: "Action Cloned",
        description: `Successfully cloned action within the day`,
      });
    } else {
      setLibraryActions([...libraryActions, clonedAction]);
      
      localStorage.setItem('credit-card-shared-library', JSON.stringify([...libraryActions, clonedAction]));
      
      toast({
        title: "Library Action Cloned",
        description: `Successfully cloned action in library`,
      });
    }
  };

  const handleSaveAction = (action: TimelineAction) => {
    if (selectedDay) {
      setDays(days.map(day => {
        if (day.id === selectedDay.id) {
          const existingActionIndex = day.actions.findIndex(a => a.id === action.id);
          
          if (existingActionIndex >= 0) {
            const updatedActions = [...day.actions];
            updatedActions[existingActionIndex] = action;
            return { ...day, actions: updatedActions };
          } else {
            return { ...day, actions: [...day.actions, action] };
          }
        }
        return day;
      }));
      
      toast({
        title: isNewItem ? "Action Added" : "Action Updated",
        description: `Successfully ${isNewItem ? 'added' : 'updated'} action for day ${selectedDay.day === 0 ? 'Due Date' : selectedDay.day > 0 ? `D+${selectedDay.day}` : `D${selectedDay.day}`}`,
      });
    } else {
      const existingActionIndex = libraryActions.findIndex(a => a.id === action.id);
      
      if (existingActionIndex >= 0) {
        const updatedActions = [...libraryActions];
        updatedActions[existingActionIndex] = action;
        setLibraryActions(updatedActions);
        
        localStorage.setItem('credit-card-shared-library', JSON.stringify(updatedActions));
      } else {
        setLibraryActions([...libraryActions, action]);
        
        localStorage.setItem('credit-card-shared-library', JSON.stringify([...libraryActions, action]));
      }
      
      toast({
        title: isNewItem ? "Library Action Added" : "Library Action Updated",
        description: `Successfully ${isNewItem ? 'added' : 'updated'} action in library`,
      });
    }
    
    setEditMode(null);
    setSelectedAction(null);
    setIsNewItem(false);
  };

  const handleAddCondition = (actionId: string) => {
    let action: TimelineAction | null = null;
    
    for (const day of days) {
      const foundAction = day.actions.find(a => a.id === actionId);
      if (foundAction) {
        action = foundAction;
        break;
      }
    }
    
    if (!action) {
      action = libraryActions.find(a => a.id === actionId) || null;
    }
    
    if (action) {
      setSelectedAction(action);
      setSelectedCondition(null);
      setEditMode('condition');
      setIsNewItem(true);
    }
  };

  const handleEditCondition = (actionId: string, conditionId: string) => {
    let action: TimelineAction | null = null;
    
    for (const day of days) {
      const foundAction = day.actions.find(a => a.id === actionId);
      if (foundAction) {
        action = foundAction;
        break;
      }
    }
    
    if (!action) {
      action = libraryActions.find(a => a.id === actionId) || null;
    }
    
    if (action) {
      const condition = action.conditions.find(c => c.id === conditionId) || null;
      setSelectedAction(action);
      setSelectedCondition(condition);
      setEditMode('condition');
      setIsNewItem(false);
    }
  };

  const handleSaveCondition = (condition: Condition) => {
    if (!selectedAction) return;
    
    const updateActionWithCondition = (action: TimelineAction): TimelineAction => {
      const existingConditionIndex = action.conditions.findIndex(c => c.id === condition.id);
      
      if (existingConditionIndex >= 0) {
        const updatedConditions = [...action.conditions];
        updatedConditions[existingConditionIndex] = condition;
        return { ...action, conditions: updatedConditions };
      } else {
        return { ...action, conditions: [...action.conditions, condition] };
      }
    };
    
    let actionUpdated = false;
    setDays(days.map(day => {
      const actionIndex = day.actions.findIndex(a => a.id === selectedAction?.id);
      if (actionIndex >= 0) {
        actionUpdated = true;
        const updatedActions = [...day.actions];
        updatedActions[actionIndex] = updateActionWithCondition(day.actions[actionIndex]);
        return { ...day, actions: updatedActions };
      }
      return day;
    }));
    
    if (!actionUpdated) {
      setLibraryActions(libraryActions.map(action => {
        if (action.id === selectedAction?.id) {
          return updateActionWithCondition(action);
        }
        return action;
      }));
    }
    
    toast({
      title: isNewItem ? "Condition Added" : "Condition Updated",
      description: `Successfully ${isNewItem ? 'added' : 'updated'} condition for ${selectedAction?.name || selectedAction?.subject}`,
    });
    
    setEditMode(null);
    setSelectedAction(null);
    setSelectedCondition(null);
    setIsNewItem(false);
  };

  const handleToggleDayActive = (dayId: string) => {
    setDays(days.map(day => {
      if (day.id === dayId) {
        return { ...day, active: !day.active };
      }
      return day;
    }));
  };

  const handleDropAction = (item: any, targetDayId: string) => {
    const { action, dayId: sourceDayId } = item;
    
    if (sourceDayId === targetDayId) return;
    
    if (!sourceDayId) {
      setDays(days.map(day => {
        if (day.id === targetDayId) {
          const newAction = {
            ...action,
            id: `${action.id}-copy-${Date.now()}`
          };
          return { ...day, actions: [...day.actions, newAction] };
        }
        return day;
      }));
      
      toast({
        title: "Action Added",
        description: `Added action from library to timeline`,
      });
      return;
    }
    
    const actionToMove = days.find(d => d.id === sourceDayId)?.actions.find(a => a.id === action.id);
    
    if (!actionToMove) {
      console.error("Action not found for moving");
      return;
    }
    
    setDays(days.map(day => {
      if (day.id === targetDayId) {
        return { ...day, actions: [...day.actions, actionToMove] };
      }
      if (day.id === sourceDayId) {
        return { ...day, actions: day.actions.filter(a => a.id !== action.id) };
      }
      return day;
    }));
    
    toast({
      title: "Action Moved",
      description: `Moved action to different day`,
    });
  };

  const saveTimeline = () => {
    if (!timelineId) return;
    
    const savedTimelines = localStorage.getItem('credit-card-timelines');
    let timelines: TimelineType[] = [];
    
    if (savedTimelines) {
      try {
        timelines = JSON.parse(savedTimelines);
      } catch (error) {
        console.error("Error parsing timelines:", error);
      }
    }
    
    const updatedTimeline: TimelineType = {
      id: timelineId,
      name: timelineName,
      days,
      libraryActions: [],
      createdAt: new Date().toISOString()
    };
    
    const existingIndex = timelines.findIndex(t => t.id === timelineId);
    
    if (existingIndex >= 0) {
      timelines[existingIndex] = updatedTimeline;
    } else {
      timelines.push(updatedTimeline);
    }
    
    localStorage.setItem('credit-card-timelines', JSON.stringify(timelines));
    
    toast({
      title: "Timeline Saved",
      description: "Your timeline has been saved successfully",
    });
  };

  useEffect(() => {
    if (timelineId) {
      const debounce = setTimeout(() => {
        saveTimeline();
      }, 1000);
      
      return () => clearTimeout(debounce);
    }
  }, [days, libraryActions, timelineName]);

  const handleExportConfig = () => {
    try {
      const timelineConfig = {
        name: timelineName,
        days: days.filter(day => day.active),
        libraryActions
      };
      
      const jsonString = JSON.stringify(timelineConfig, null, 2);
      
      const blob = new Blob([jsonString], { type: 'application/json' });
      
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `${timelineName.replace(/\s+/g, '-').toLowerCase()}.json`;
      
      document.body.appendChild(a);
      a.click();
      
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Export Successful",
        description: "Timeline configuration has been exported to JSON file",
      });
    } catch (error) {
      console.error("Error exporting timeline:", error);
      toast({
        title: "Export Failed",
        description: "Failed to export timeline configuration",
        variant: "destructive",
      });
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/')}
              className="flex items-center gap-1"
            >
              <ArrowLeft size={16} />
              Back to list
            </Button>
            
            <h1 className="text-3xl font-bold">Credit Card Collection Timeline</h1>
          </div>
          <Button 
            onClick={handleExportConfig}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Download size={16} />
            Export Config
          </Button>
        </div>
        
        <div className="mb-6">
          <Label htmlFor="timeline-name">Timeline Name</Label>
          <Input 
            id="timeline-name" 
            value={timelineName} 
            onChange={(e) => setTimelineName(e.target.value)} 
            className="max-w-md"
            placeholder="Enter timeline name"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="md:col-span-3">
            <Tabs defaultValue="timeline">
              <TabsList>
                <TabsTrigger value="timeline">Timeline View</TabsTrigger>
                <TabsTrigger value="days">Day Management</TabsTrigger>
              </TabsList>
              
              <TabsContent value="timeline" className="pt-4">
                <div className="bg-white rounded-lg p-6 border min-h-[600px] overflow-auto">
                  <div className="relative pb-16">
                    <div className="timeline-connector absolute top-4 bottom-0 left-1/2 w-px bg-gray-200 -translate-x-1/2 z-0"></div>
                    {days.filter(day => day.active).map((day) => (
                      <TimelineDay
                        key={day.id}
                        day={day}
                        onSelectDay={setSelectedDay}
                        onAddAction={handleAddAction}
                        onDrop={handleDropAction}
                        isDue={day.day === 0}
                        onSelectAction={handleSelectAction}
                        onCloneAction={handleCloneAction}
                      />
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="days" className="pt-4">
                <div className="bg-white rounded-lg p-6 border">
                  <h2 className="text-lg font-medium mb-4">Active Days</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {days.map((day) => (
                      <div key={day.id} className="flex items-center space-x-2">
                        <Switch 
                          id={`day-${day.id}`}
                          checked={day.active}
                          onCheckedChange={() => handleToggleDayActive(day.id)}
                        />
                        <Label htmlFor={`day-${day.id}`}>
                          {formatDayLabel(day)}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          <div>
            <ActionLibrary 
              actions={libraryActions}
              onAddAction={handleAddLibraryAction}
              onSelectAction={handleSelectAction}
              onCloneAction={handleCloneAction}
            />
          </div>
        </div>
        
        {editMode === 'action' && (
          <Dialog open={editMode === 'action'} onOpenChange={() => setEditMode(null)}>
            <ActionEditor
              action={selectedAction}
              onSave={handleSaveAction}
              onClose={() => setEditMode(null)}
              isNew={isNewItem}
              onAddCondition={handleAddCondition}
              onEditCondition={handleEditCondition}
              allActions={getAllActions()}
              dayLabel={formatDayLabel(selectedDay)}
            />
          </Dialog>
        )}
        
        {editMode === 'condition' && (
          <Dialog open={editMode === 'condition'} onOpenChange={() => setEditMode(null)}>
            <ActionEditor
              action={selectedAction}
              onSave={handleSaveAction}
              onClose={() => setEditMode(null)}
              isNew={isNewItem}
              onAddCondition={handleAddCondition}
              onEditCondition={handleEditCondition}
              allActions={getAllActions()}
            />
            <div className="w-full max-w-md">
              <ConditionEditor
                condition={selectedCondition}
                actions={getAllActions()}
                onSave={handleSaveCondition}
                onClose={() => setEditMode(null)}
                isNew={isNewItem}
              />
            </div>
          </Dialog>
        )}
      </div>
    </DndProvider>
  );
};

export default Timeline;
