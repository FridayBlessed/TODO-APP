
import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from '@/components/ui/use-toast';

interface Todo {
  id: number;
  title: string;
  completed: boolean;
  userId: number;
}

interface TodoFormData {
  title: string;
  completed: boolean;
  userId: number;
}

interface TodoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  todo?: Todo;
}

const createTodo = async (todoData: Omit<TodoFormData, 'id'>): Promise<Todo> => {
  const response = await fetch('https://jsonplaceholder.typicode.com/todos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(todoData),
  });
  
  if (!response.ok) {
    throw new Error('Failed to create todo');
  }
  
  return response.json();
};

const updateTodo = async (id: number, todoData: TodoFormData): Promise<Todo> => {
  const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ...todoData, id }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to update todo');
  }
  
  return response.json();
};

export const TodoDialog: React.FC<TodoDialogProps> = ({ open, onOpenChange, todo }) => {
  const queryClient = useQueryClient();
  const isEditing = !!todo;

  const form = useForm<TodoFormData>({
    defaultValues: {
      title: todo?.title || '',
      completed: todo?.completed || false,
      userId: todo?.userId || 1,
    },
  });

  React.useEffect(() => {
    if (todo) {
      form.reset({
        title: todo.title,
        completed: todo.completed,
        userId: todo.userId,
      });
    } else {
      form.reset({
        title: '',
        completed: false,
        userId: 1,
      });
    }
  }, [todo, form]);

  const createMutation = useMutation({
    mutationFn: createTodo,
    onSuccess: (newTodo) => {
      queryClient.setQueryData(['todos'], (oldTodos: Todo[] = []) => [newTodo, ...oldTodos]);
      toast({
        title: "Success",
        description: "Todo created successfully",
      });
      onOpenChange(false);
      form.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create todo",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: TodoFormData }) => updateTodo(id, data),
    onSuccess: (updatedTodo) => {
      queryClient.setQueryData(['todos'], (oldTodos: Todo[] = []) =>
        oldTodos.map(t => t.id === updatedTodo.id ? updatedTodo : t)
      );
      queryClient.setQueryData(['todo', updatedTodo.id.toString()], updatedTodo);
      toast({
        title: "Success",
        description: "Todo updated successfully",
      });
      onOpenChange(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update todo",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: TodoFormData) => {
    if (isEditing && todo) {
      updateMutation.mutate({ id: todo.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" aria-describedby="todo-dialog-description">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edit Todo' : 'Create New Todo'}
          </DialogTitle>
        </DialogHeader>
        
        <div id="todo-dialog-description" className="sr-only">
          {isEditing ? 'Edit the todo item details below' : 'Create a new todo item by filling out the form below'}
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              rules={{ 
                required: 'Title is required',
                minLength: { value: 1, message: 'Title must not be empty' }
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter todo title..." 
                      {...field}
                      aria-describedby="title-error"
                    />
                  </FormControl>
                  <FormMessage id="title-error" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="userId"
              rules={{ 
                required: 'User ID is required',
                min: { value: 1, message: 'User ID must be at least 1' }
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>User ID</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="Enter user ID..." 
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                      aria-describedby="userId-error"
                    />
                  </FormControl>
                  <FormMessage id="userId-error" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="completed"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      aria-describedby="completed-description"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Mark as completed</FormLabel>
                    <p className="text-sm text-muted-foreground" id="completed-description">
                      Check this box if the todo is already completed
                    </p>
                  </div>
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading}
                aria-describedby="submit-status"
              >
                {isLoading ? 'Saving...' : (isEditing ? 'Update Todo' : 'Create Todo')}
              </Button>
              <div id="submit-status" className="sr-only" aria-live="polite">
                {isLoading ? 'Saving todo, please wait...' : ''}
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
