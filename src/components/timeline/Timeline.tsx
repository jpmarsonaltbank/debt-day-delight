
import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TimelineDay as TimelineDayType, TimelineAction, Condition } from '@/types/timeline';
import TimelineDay from './TimelineDay';
import ActionEditor from './ActionEditor';
import ConditionEditor from './ConditionEditor';
import ActionLibrary from './ActionLibrary';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const Timeline: React.FC = () => {
  const { toast } = useToast();
  // Generate days from D-10 to D+90
  const generateInitialDays = (): TimelineDayType[] => {
    const days: TimelineDayType[] = [];
    
    for (let i = -10; i <= 90; i++) {
      days.push({
        id: `day-${i}`,
        day: i,
        actions: [],
        active: i === 0 // Only due date is active by default
      });
    }
    
    return days;
  };

  const [days, setDays] = useState<TimelineDayType[]>(generateInitialDays());
  const [libraryActions, setLibraryActions] = useState<TimelineAction[]>([]);
  const [selectedDay, setSelectedDay] = useState<TimelineDayType | null>(null);
  const [selectedAction, setSelectedAction] = useState<TimelineAction | null>(null);
  const [selectedCondition, setSelectedCondition] = useState<Condition | null>(null);
  const [editMode, setEditMode] = useState<'action' | 'condition' | null>(null);
  const [isNewItem, setIsNewItem] = useState(false);

  // Handle adding a new action to a day
  const handleAddAction = (dayId: string) => {
    setEditMode('action');
    setSelectedAction(null);
    setIsNewItem(true);
    setSelectedDay(days.find(d => d.id === dayId) || null);
  };

  // Handle creating a new library action
  const handleAddLibraryAction = () => {
    setEditMode('action');
    setSelectedAction(null);
    setIsNewItem(true);
    setSelectedDay(null);
  };

  // Handle selecting an action for editing
  const handleSelectAction = (action: TimelineAction) => {
    setEditMode('action');
    setSelectedAction(action);
    setIsNewItem(false);
  };

  // Handle saving an action
  const handleSaveAction = (action: TimelineAction) => {
    if (selectedDay) {
      // Adding/updating action to a specific day
      setDays(days.map(day => {
        if (day.id === selectedDay.id) {
          const existingActionIndex = day.actions.findIndex(a => a.id === action.id);
          
          if (existingActionIndex >= 0) {
            // Update existing action
            const updatedActions = [...day.actions];
            updatedActions[existingActionIndex] = action;
            return { ...day, actions: updatedActions };
          } else {
            // Add new action
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
      // Adding/updating action to library
      const existingActionIndex = libraryActions.findIndex(a => a.id === action.id);
      
      if (existingActionIndex >= 0) {
        // Update existing action
        const updatedActions = [...libraryActions];
        updatedActions[existingActionIndex] = action;
        setLibraryActions(updatedActions);
      } else {
        // Add new action
        setLibraryActions([...libraryActions, action]);
      }
      
      toast({
        title: isNewItem ? "Library Action Added" : "Library Action Updated",
        description: `Successfully ${isNewItem ? 'added' : 'updated'} action in library`,
      });
    }
    
    // Reset state
    setEditMode(null);
    setSelectedAction(null);
    setIsNewItem(false);
  };

  // Handle adding a condition to an action
  const handleAddCondition = (actionId: string) => {
    // Find the action
    let action: TimelineAction | null = null;
    
    // Look in all days
    for (const day of days) {
      const foundAction = day.actions.find(a => a.id === actionId);
      if (foundAction) {
        action = foundAction;
        break;
      }
    }
    
    // Look in library if not found
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

  // Handle editing a condition
  const handleEditCondition = (actionId: string, conditionId: string) => {
    // Find the action
    let action: TimelineAction | null = null;
    
    // Look in all days
    for (const day of days) {
      const foundAction = day.actions.find(a => a.id === actionId);
      if (foundAction) {
        action = foundAction;
        break;
      }
    }
    
    // Look in library if not found
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

  // Handle saving a condition
  const handleSaveCondition = (condition: Condition) => {
    if (!selectedAction) return;
    
    const updateActionWithCondition = (action: TimelineAction): TimelineAction => {
      const existingConditionIndex = action.conditions.findIndex(c => c.id === condition.id);
      
      if (existingConditionIndex >= 0) {
        // Update existing condition
        const updatedConditions = [...action.conditions];
        updatedConditions[existingConditionIndex] = condition;
        return { ...action, conditions: updatedConditions };
      } else {
        // Add new condition
        return { ...action, conditions: [...action.conditions, condition] };
      }
    };
    
    // Update in days
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
    
    // Update in library if not found in days
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
      description: `Successfully ${isNewItem ? 'added' : 'updated'} condition for ${selectedAction?.title}`,
    });
    
    // Reset state
    setEditMode(null);
    setSelectedAction(null);
    setSelectedCondition(null);
    setIsNewItem(false);
  };

  // Handle toggling a day's active state
  const handleToggleDayActive = (dayId: string) => {
    setDays(days.map(day => {
      if (day.id === dayId) {
        return { ...day, active: !day.active };
      }
      return day;
    }));
  };

  // Handle dropping an action onto a day
  const handleDropAction = (item: any, targetDayId: string) => {
    const { action, dayId: sourceDayId } = item;
    
    // If dropping in the same day, do nothing
    if (sourceDayId === targetDayId) return;
    
    // If it's from the library, create a new copy
    if (!sourceDayId) {
      setDays(days.map(day => {
        if (day.id === targetDayId) {
          // Create a copy with a new ID
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
    
    // Move action between days
    setDays(days.map(day => {
      if (day.id === sourceDayId) {
        return { ...day, actions: day.actions.filter(a => a.id !== action.id) };
      }
      if (day.id === targetDayId) {
        return { ...day, actions: [...day.actions, action] };
      }
      return day;
    }));
    
    toast({
      title: "Action Moved",
      description: `Moved action to different day`,
    });
  };

  // Get all actions from all days
  const getAllActions = () => {
    const allActions: TimelineAction[] = [];
    days.forEach(day => {
      day.actions.forEach(action => {
        allActions.push(action);
      });
    });
    return [...allActions, ...libraryActions];
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">Credit Card Collection Timeline</h1>
        
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
                          {day.day === 0 ? 'Due Date' : day.day > 0 ? `D+${day.day}` : `D${day.day}`}
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
            />
          </div>
        </div>
        
        {editMode === 'action' && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="w-full max-w-md">
              <ActionEditor
                action={selectedAction}
                onSave={handleSaveAction}
                onClose={() => setEditMode(null)}
                isNew={isNewItem}
                onAddCondition={handleAddCondition}
                onEditCondition={handleEditCondition}
              />
            </div>
          </div>
        )}
        
        {editMode === 'condition' && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="w-full max-w-md">
              <ConditionEditor
                condition={selectedCondition}
                actions={getAllActions()}
                onSave={handleSaveCondition}
                onClose={() => setEditMode(null)}
                isNew={isNewItem}
              />
            </div>
          </div>
        )}
      </div>
    </DndProvider>
  );
};

export default Timeline;
