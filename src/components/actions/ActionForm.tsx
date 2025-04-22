
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Action } from '@/types/timeline';

const actionFormSchema = z.object({
  nome: z.string().min(1, 'Name is required'),
  tipo: z.enum(['email', 'whatsapp', 'sms']),
  horario_envio: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:mm)'),
  conteudo_mensagem: z.string().min(1, 'Message content is required'),
  assunto_email: z.string().optional().refine((val) => {
    if (val === undefined) return true;
    return val.length > 0;
  }, 'Subject is required for email actions'),
});

interface ActionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (action: Action) => void;
  action: Action | null;
}

const ActionForm: React.FC<ActionFormProps> = ({
  isOpen,
  onClose,
  onSave,
  action,
}) => {
  const form = useForm<z.infer<typeof actionFormSchema>>({
    resolver: zodResolver(actionFormSchema),
    defaultValues: {
      nome: action?.nome || '',
      tipo: action?.tipo || 'email',
      horario_envio: action?.horario_envio || '09:00',
      conteudo_mensagem: action?.conteudo_mensagem || '',
      assunto_email: action?.assunto_email || '',
    },
  });

  const handleSubmit = (values: z.infer<typeof actionFormSchema>) => {
    onSave({
      id: action?.id || `action-${Date.now()}`,
      ...values,
      tenant_id: action?.tenant_id || undefined,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{action ? 'Edit Action' : 'Create Action'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Action name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tipo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select action type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="whatsapp">WhatsApp</SelectItem>
                      <SelectItem value="sms">SMS</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="horario_envio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Send Time (HH:mm)</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.watch('tipo') === 'email' && (
              <FormField
                control={form.control}
                name="assunto_email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Subject</FormLabel>
                    <FormControl>
                      <Input placeholder="Email subject" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="conteudo_mensagem"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message Content</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter message content"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button variant="outline" type="button" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ActionForm;
