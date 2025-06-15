
import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import { TodoDialog } from '@/components/TodoDialog';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { toast } from '@/components/ui/use-toast';

interface Todo {
  id: number;
  title: string;
  completed: boolean;
  userId: number;
}

const fetchTodo = async (id: string): Promise<Todo> => {
  const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch todo');
  }
  return response.json();
};

const deleteTodo = async (id: number): Promise<void> => {
  const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete todo');
  }
};

const TodoDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);

  const { data: todo, isLoading, error } = useQuery({
    queryKey: ['todo', id],
    queryFn: () => fetchTodo(id!),
    enabled: !!id,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      toast({
        title: "Success",
        description: "Todo deleted successfully",
      });
      navigate('/');
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete todo",
        variant: "destructive",
      });
    },
  });

  const handleDelete = () => {
    if (todo) {
      deleteMutation.mutate(todo.id);
    }
  };

  if (error) {
    throw error;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center py-12" role="status" aria-label="Loading todo details">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="sr-only">Loading todo details...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!todo) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Todo Not Found</h1>
            <p className="text-muted-foreground mb-6">The todo you're looking for doesn't exist.</p>
            <Button asChild>
              <Link to="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Todos
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/" aria-label="Back to todo list">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Todos
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Todo Details</h1>
              <p className="text-muted-foreground">View and manage todo item</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <div className="flex justify-between items-start gap-4">
              <CardTitle className="text-xl leading-tight">{todo.title}</CardTitle>
              <Badge variant={todo.completed ? 'default' : 'secondary'}>
                {todo.completed ? 'Completed' : 'Incomplete'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-sm text-muted-foreground mb-1">Todo ID</h3>
                <p className="text-lg">{todo.id}</p>
              </div>
              <div>
                <h3 className="font-semibold text-sm text-muted-foreground mb-1">User ID</h3>
                <p className="text-lg">{todo.userId}</p>
              </div>
              <div className="sm:col-span-2">
                <h3 className="font-semibold text-sm text-muted-foreground mb-1">Status</h3>
                <p className="text-lg">{todo.completed ? 'This task has been completed' : 'This task is still pending'}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
              <Button 
                onClick={() => setIsEditDialogOpen(true)}
                className="flex-1"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Todo
              </Button>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="flex-1">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Todo
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the todo "{todo.title}".
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleDelete}
                      disabled={deleteMutation.isPending}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>
      </main>

      <TodoDialog 
        open={isEditDialogOpen} 
        onOpenChange={setIsEditDialogOpen}
        todo={todo}
      />
    </div>
  );
};

const TodoDetailWithErrorBoundary = () => (
  <ErrorBoundary>
    <TodoDetail />
  </ErrorBoundary>
);

export default TodoDetailWithErrorBoundary;
