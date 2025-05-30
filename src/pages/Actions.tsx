import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Plus, Trash2, FileEdit } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
import { Action, TimelineAction } from '@/types/timeline';
import ActionForm from '@/components/actions/ActionForm';
import { getLibraryActions, saveLibraryAction, deleteLibraryAction } from '@/lib/db';

function convertTimelineActionsToActions(timelineActions: TimelineAction[]): Action[] {
  return timelineActions.map(ta => ({
    id: ta.id,
    nome: ta.nome || ta.name,
    tipo: (ta.tipo || ta.type) as 'email' | 'whatsapp' | 'sms',
    tenant_id: ta.tenant_id,
    horario_envio: ta.horario_envio || '00:00',
    conteudo_mensagem: ta.conteudo_mensagem || ta.message,
    assunto_email: ta.assunto_email || ta.subject,
    type: ta.type,
    name: ta.name,
    subject: ta.subject,
    message: ta.message,
    conditions: ta.conditions || [],
  }));
}

function convertActionToTimelineAction(action: Action): TimelineAction {
  return {
    id: action.id,
    type: action.type || action.tipo as 'email' | 'whatsapp' | 'sms' | 'negativar',
    name: action.name || action.nome,
    subject: action.subject || action.assunto_email || '',
    message: action.message || action.conteudo_mensagem,
    conditions: action.conditions || [],
    nome: action.nome,
    tipo: action.tipo,
    tenant_id: action.tenant_id,
    horario_envio: action.horario_envio,
    conteudo_mensagem: action.conteudo_mensagem,
    assunto_email: action.assunto_email,
  };
}

const Actions = () => {
  const { toast } = useToast();
  const [actions, setActions] = useState<Action[]>([]);
  const [selectedAction, setSelectedAction] = useState<Action | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [actionToDelete, setActionToDelete] = useState<string | null>(null);

  useEffect(() => {
    loadActions();
  }, []);

  const loadActions = async () => {
    try {
      const data = await getLibraryActions();
      setActions(convertTimelineActionsToActions(data));
    } catch (error) {
      console.error('Error loading actions:', error);
      toast({
        title: "Error",
        description: "Failed to load actions",
        variant: "destructive",
      });
    }
  };

  const handleSave = async (action: Action) => {
    try {
      const timelineAction = convertActionToTimelineAction(action);
      await saveLibraryAction(timelineAction);
      await loadActions();
      setIsFormOpen(false);
      toast({
        description: `Action ${action.id ? 'updated' : 'created'} successfully`,
      });
    } catch (error) {
      console.error('Error saving action:', error);
      toast({
        title: "Error",
        description: "Failed to save action",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!actionToDelete) return;

    try {
      await deleteLibraryAction(actionToDelete);
      await loadActions();
      setActionToDelete(null);
      toast({
        description: "Action deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting action:', error);
      toast({
        title: "Error",
        description: "Failed to delete action",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Actions Library</CardTitle>
          <Button onClick={() => {
            setSelectedAction(null);
            setIsFormOpen(true);
          }}>
            <Plus className="mr-2 h-4 w-4" />
            New Action
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Send Time</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {actions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                    No actions found. Create your first action.
                  </TableCell>
                </TableRow>
              ) : (
                actions.map((action) => (
                  <TableRow key={action.id}>
                    <TableCell>{action.nome}</TableCell>
                    <TableCell className="capitalize">{action.tipo}</TableCell>
                    <TableCell>{action.horario_envio}</TableCell>
                    <TableCell className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedAction(action);
                          setIsFormOpen(true);
                        }}
                      >
                        <FileEdit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setActionToDelete(action.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <ActionForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSave}
        action={selectedAction}
      />

      <AlertDialog open={!!actionToDelete} onOpenChange={() => setActionToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Action</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this action? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Actions;
