import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Action } from '@/types/timeline';

const actionSchema = z.object({
  id: z.string().optional(),
  nome: z.string().min(1, "Name is required"),
  tipo: z.enum(["email", "whatsapp", "sms"]),
  tenant_id: z.string().optional(),
  horario_envio: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Format must be HH:MM"),
  conteudo_mensagem: z.string().min(1, "Message content is required"),
  assunto_email: z.string().optional()
    .refine(val => !val || val.length > 0, "Email subject cannot be empty")
    .refine(
      (val) => {
        // This signature matches what Zod expects
        return true;
      },
      {
        message: "Email subject is required for email type",
        path: ["assunto_email"]
      }
    ),
});

type ActionFormValues = z.infer<typeof actionSchema>;

interface ActionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (action: Action) => void;
  action: Action | null;
}

const ActionForm: React.FC<ActionFormProps> = ({ isOpen, onClose, onSave, action }) => {
  const form = useForm<ActionFormValues>({
    resolver: zodResolver(actionSchema),
    defaultValues: {
      id: '',
      nome: '',
      tipo: 'email' as const,
      tenant_id: '',
      horario_envio: '',
      conteudo_mensagem: '',
      assunto_email: '',
    },
  });

  React.useEffect(() => {
    if (action) {
      form.reset({
        id: action.id,
        nome: action.nome,
        tipo: action.tipo,
        tenant_id: action.tenant_id || '',
        horario_envio: action.horario_envio,
        conteudo_mensagem: action.conteudo_mensagem,
        assunto_email: action.assunto_email || '',
      });
    } else {
      form.reset({
        id: '',
        nome: '',
        tipo: 'email' as const,
        tenant_id: '',
        horario_envio: '',
        conteudo_mensagem: '',
        assunto_email: '',
      });
    }
  }, [action, form]);

  const handleSubmit = (values: ActionFormValues) => {
    const actionData: Action = {
      id: values.id || `action-${Date.now()}`,
      nome: values.nome,
      tipo: values.tipo,
      tenant_id: values.tenant_id || '',
      horario_envio: values.horario_envio,
      conteudo_mensagem: values.conteudo_mensagem,
      assunto_email: values.assunto_email,
      type: values.tipo as ActionType,
      name: values.nome,
      subject: values.assunto_email || '',
      message: values.conteudo_mensagem,
      conditions: [],
    };
    
    onSave(actionData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{action ? 'Edit Action' : 'Create New Action'}</DialogTitle>
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
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="sms">SMS</SelectItem>
                      <SelectItem value="whatsapp">WhatsApp</SelectItem>
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
                  <FormLabel>Send Time (HH:MM)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. 14:30" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
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
            
            {form.watch("tipo") === "email" && (
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
            
            <input type="hidden" {...form.register("tenant_id")} value="default-tenant" />
            
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                Save
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ActionForm;
