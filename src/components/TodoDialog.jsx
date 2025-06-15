
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
import { Sparkles, Save } from 'lucide-react';

const createTodo = async (todoData) => {
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
  
  const newTodo = await response.json();
  // JSONPlaceholder returns a new ID, but for demo purposes we'll generate a unique one
  return { ...newTodo, id: Date.now() + Math.random() };
};

const updateTodo = async (id, todoData) => {
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

export const TodoDialog = ({ open, onOpenChange, todo }) => {
  const queryClient = useQueryClient();
  const isEditing = !!todo;

  const form = useForm({
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
      queryClient.setQueryData(['todos'], (oldTodos = []) => [newTodo, ...oldTodos]);
      toast({
        title: "✨ Success!",
        description: "Todo created successfully",
        className: "bg-green-50 border-green-200 text-green-800",
      });
      onOpenChange(false);
      form.reset();
    },
    onError: () => {
      toast({
        title: "❌ Error",
        description: "Failed to create todo",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateTodo(id, data),
    onSuccess: (updatedTodo) => {
      queryClient.setQueryData(['todos'], (oldTodos = []) =>
        oldTodos.map(t => t.id === updatedTodo.id ? updatedTodo : t)
      );
      queryClient.setQueryData(['todo', updatedTodo.id.toString()], updatedTodo);
      toast({
        title: "✨ Success!",
        description: "Todo updated successfully",
        className: "bg-blue-50 border-blue-200 text-blue-800",
      });
      onOpenChange(false);
    },
    onError: () => {
      toast({
        title: "❌ Error",
        description: "Failed to update todo",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data) => {
    if (isEditing && todo) {
      updateMutation.mutate({ id: todo.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-white to-blue-50/30 backdrop-blur-md border-white/50" aria-describedby="todo-dialog-description">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
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
                  <FormLabel className="text-gray-700 font-medium">Title</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter todo title..." 
                      {...field}
                      className="bg-white/80 border-white/50 focus:border-blue-300 focus:ring-blue-500/20"
                      aria-describedby="title-error"
                    />
                  </FormControl>
                  <FormMessage id="title-error" className="text-red-600" />
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
                  <FormLabel className="text-gray-700 font-medium">User ID</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="Enter user ID..." 
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                      className="bg-white/80 border-white/50 focus:border-blue-300 focus:ring-blue-500/20"
                      aria-describedby="userId-error"
                    />
                  </FormControl>
                  <FormMessage id="userId-error" className="text-red-600" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="completed"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 bg-white/40 p-4 rounded-lg border border-white/50">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                      aria-describedby="completed-description"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-gray-700 font-medium">Mark as completed</FormLabel>
                    <p className="text-sm text-gray-600" id="completed-description">
                      Check this box if the todo is already completed
                    </p>
                  </div>
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
                className="bg-white/80 hover:bg-white border-gray-200"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md"
                aria-describedby="submit-status"
              >
                <Save className="h-4 w-4 mr-2" />
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
