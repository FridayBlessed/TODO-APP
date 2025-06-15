
import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, Trash2, CheckCircle2, Circle, User, Hash } from 'lucide-react';
import { TodoDialog } from '@/components/TodoDialog';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { toast } from '@/components/ui/use-toast';

const fetchTodo = async (id) => {
  const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch todo');
  }
  return response.json();
};

const deleteTodo = async (id) => {
  const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete todo');
  }
};

const TodoDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);

  const { data: todo, isLoading, error } = useQuery({
    queryKey: ['todo', id],
    queryFn: () => fetchTodo(id),
    enabled: !!id,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      toast({
        title: "🗑️ Deleted!",
        description: "Todo deleted successfully",
        className: "bg-red-50 border-red-200 text-red-800",
      });
      navigate('/');
    },
    onError: () => {
      toast({
        title: "❌ Error",
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center py-12" role="status" aria-label="Loading todo details">
            <div className="relative">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
              <div className="absolute inset-0 rounded-full bg-blue-50 opacity-20"></div>
            </div>
            <span className="sr-only">Loading todo details...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!todo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-sm max-w-md mx-auto">
              <Circle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h1 className="text-2xl font-bold mb-4 text-gray-800">Todo Not Found</h1>
              <p className="text-gray-600 mb-6">The todo you're looking for doesn't exist.</p>
              <Button asChild className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                <Link to="/">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Todos
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <header className="bg-white/80 backdrop-blur-md border-b border-white/20 shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild className="hover:bg-white/60">
              <Link to="/" aria-label="Back to todo list">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Todos
              </Link>
            </Button>
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-xl">
                {todo.completed ? (
                  <CheckCircle2 className="h-5 w-5 text-white" />
                ) : (
                  <Circle className="h-5 w-5 text-white" />
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Todo Details
                </h1>
                <p className="text-gray-600">Manage your task</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto bg-white/70 backdrop-blur-sm border-white/50 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
            <div className="flex justify-between items-start gap-4">
              <CardTitle className="text-xl leading-tight flex items-start gap-3">
                {todo.completed ? (
                  <CheckCircle2 className="h-6 w-6 text-green-500 mt-0.5 flex-shrink-0" />
                ) : (
                  <Circle className="h-6 w-6 text-gray-400 mt-0.5 flex-shrink-0" />
                )}
                <span className="text-gray-800">{todo.title}</span>
              </CardTitle>
              <Badge 
                variant={todo.completed ? 'default' : 'secondary'}
                className={`${todo.completed ? 'bg-green-100 text-green-800 border-green-200' : 'bg-amber-100 text-amber-800 border-amber-200'} px-3 py-1`}
              >
                {todo.completed ? '✅ Completed' : '⏳ Pending'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                  <Hash className="h-4 w-4 text-gray-500" />
                  <h3 className="font-semibold text-sm text-gray-600 uppercase tracking-wide">Todo ID</h3>
                </div>
                <p className="text-xl font-mono text-gray-800">{todo.id}</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <div className="flex items-center gap-2 mb-2">
                  <User className="h-4 w-4 text-blue-500" />
                  <h3 className="font-semibold text-sm text-blue-600 uppercase tracking-wide">User ID</h3>
                </div>
                <p className="text-xl font-mono text-blue-800">{todo.userId}</p>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg border border-indigo-100">
              <h3 className="font-semibold text-sm text-indigo-600 uppercase tracking-wide mb-2">Status Description</h3>
              <p className="text-lg text-gray-700">
                {todo.completed 
                  ? '🎉 This task has been completed successfully!' 
                  : '🚀 This task is still pending and awaiting completion.'}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100">
              <Button 
                onClick={() => setIsEditDialogOpen(true)}
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Todo
              </Button>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-md">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Todo
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-white/95 backdrop-blur-md border-white/50">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-xl">Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription className="text-gray-600">
                      This action cannot be undone. This will permanently delete the todo 
                      <span className="font-semibold text-gray-800"> "{todo.title}"</span>.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="bg-white/80 hover:bg-white">Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleDelete}
                      disabled={deleteMutation.isPending}
                      className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
                    >
                      {deleteMutation.isPending ? 'Deleting...' : 'Delete Forever'}
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
