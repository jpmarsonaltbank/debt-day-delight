
import React, { useEffect } from 'react';
import { useForm, useFieldArray } from "react-hook-form";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { CustomerSegment, CustomerSegmentRule } from '@/types/customer-segment';
import { X, Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface CustomerSegmentFormProps {
  initialData?: CustomerSegment;
  onSubmit: (data: CustomerSegment) => void;
  onCancel: () => void;
}

const CustomerSegmentForm = ({ initialData, onSubmit, onCancel }: CustomerSegmentFormProps) => {
  const form = useForm<CustomerSegment>({
    defaultValues: initialData || {
      tenant_name: "tenant_123",
      name: "",
      description: "",
      priority: 1,
      rules: [{ collection_name: "customer", expression: "" }],
      created_by: "user_123",
    },
  });

  // Initialize useFieldArray for managing the rules array
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "rules"
  });

  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    }
  }, [initialData, form]);

  const handleSubmit = (data: CustomerSegment) => {
    try {
      onSubmit(data);
      toast({
        title: initialData ? "Segment updated" : "Segment created",
        description: initialData ? "Your segment has been updated" : "Your segment has been created",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error processing your request",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter segment name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Enter segment description" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="priority"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Priority</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  type="number" 
                  min="1" 
                  max="100" 
                  onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <FormLabel className="block mb-2">Rules</FormLabel>
          {fields.map((field, index) => (
            <Card key={field.id} className="mb-4">
              <CardContent className="pt-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-sm font-medium">Rule {index + 1}</h4>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => remove(index)}
                    disabled={fields.length === 1}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="grid gap-4">
                  <FormField
                    control={form.control}
                    name={`rules.${index}.collection_name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Collection Name</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., customer" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name={`rules.${index}.expression`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Expression</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            placeholder='e.g., status == "normal" and active == true'
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
          
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            onClick={() => append({ collection_name: "customer", expression: "" })}
            className="mt-2"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Rule
          </Button>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {initialData ? 'Update' : 'Create'} Segment
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CustomerSegmentForm;
