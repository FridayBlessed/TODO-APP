
import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Plus, Search, Filter, CheckCircle2, Circle, Star } from 'lucide-react';
import { TodoDialog } from '@/components/TodoDialog';
import { ErrorBoundary } from '@/components/ErrorBoundary';

const fetchTodos = async () => {
  const response = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=50');
  if (!response.ok) {
    throw new Error('Failed to fetch todos');
  }
  return response.json();
};

const Todos = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const itemsPerPage = 10;

  const { data: todos = [], isLoading, error } = useQuery({
    queryKey: ['todos'],
    queryFn: fetchTodos,
  });

  const filteredTodos = useMemo(() => {
    return todos.filter(todo => {
      const matchesSearch = todo.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || 
        (statusFilter === 'completed' && todo.completed) ||
        (statusFilter === 'incomplete' && !todo.completed);
      return matchesSearch && matchesStatus;
    });
  }, [todos, searchTerm, statusFilter]);

  const totalPages = Math.ceil(filteredTodos.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTodos = filteredTodos.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (error) {
    throw error;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <header className="bg-white/80 backdrop-blur-md border-b border-white/20 shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-xl">
                <CheckCircle2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Todo Management
                </h1>
                <p className="text-gray-600 mt-1">Organize your tasks beautifully</p>
              </div>
            </div>
            <Button 
              onClick={() => setIsDialogOpen(true)} 
              className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all duration-200"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Todo
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <section className="mb-8" aria-label="Search and filter controls">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" aria-hidden="true" />
              <Input
                type="search"
                placeholder="Search todos by title..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10 bg-white/80 backdrop-blur-sm border-white/30 focus:border-blue-300 shadow-sm"
                aria-label="Search todos by title"
              />
            </div>
            <div className="w-full sm:w-48">
              <Select 
                value={statusFilter} 
                onValueChange={(value) => {
                  setStatusFilter(value);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="bg-white/80 backdrop-blur-sm border-white/30 focus:border-blue-300 shadow-sm" aria-label="Filter by completion status">
                  <Filter className="h-4 w-4 mr-2" aria-hidden="true" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white/95 backdrop-blur-md">
                  <SelectItem value="all">All Todos</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="incomplete">Incomplete</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-gray-600 bg-white/60 px-3 py-1 rounded-full" aria-live="polite">
            Showing {paginatedTodos.length} of {filteredTodos.length} todos
            {searchTerm && ` matching "${searchTerm}"`}
            {statusFilter !== 'all' && ` (${statusFilter})`}
          </p>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Star className="h-4 w-4 text-yellow-500 fill-current" />
            <span>{filteredTodos.filter(t => t.completed).length} completed</span>
          </div>
        </div>

        {isLoading && (
          <div className="flex justify-center items-center py-12" role="status" aria-label="Loading todos">
            <div className="relative">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
              <div className="absolute inset-0 rounded-full bg-blue-50 opacity-20"></div>
            </div>
            <span className="sr-only">Loading todos...</span>
          </div>
        )}

        {!isLoading && (
          <section aria-label="Todo list">
            {paginatedTodos.length === 0 ? (
              <div className="text-center py-16">
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-sm">
                  <Circle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-xl text-gray-600 mb-4">
                    {filteredTodos.length === 0 && todos.length > 0 
                      ? 'No todos match your search criteria.' 
                      : 'No todos found. Create your first one!'}
                  </p>
                  {filteredTodos.length === 0 && todos.length > 0 && (
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setSearchTerm('');
                        setStatusFilter('all');
                        setCurrentPage(1);
                      }}
                      className="bg-white/80 hover:bg-white"
                    >
                      Clear Filters
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <div className="grid gap-4 mb-8">
                {paginatedTodos.map((todo) => (
                  <Card key={todo.id} className="group bg-white/70 backdrop-blur-sm border-white/50 hover:bg-white/80 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start gap-4">
                        <CardTitle className="text-lg leading-tight flex items-start gap-3">
                          {todo.completed ? (
                            <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          ) : (
                            <Circle className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                          )}
                          <Link 
                            to={`/todos/${todo.id}`}
                            className="hover:text-blue-600 focus:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded transition-colors"
                            aria-describedby={`todo-${todo.id}-status`}
                          >
                            {todo.title}
                          </Link>
                        </CardTitle>
                        <Badge 
                          variant={todo.completed ? 'default' : 'secondary'}
                          className={todo.completed ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-amber-100 text-amber-800 hover:bg-amber-200'}
                          id={`todo-${todo.id}-status`}
                        >
                          {todo.completed ? 'Completed' : 'Pending'}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex justify-between items-center text-sm text-gray-500">
                        <span className="bg-gray-100 px-2 py-1 rounded-md">ID: {todo.id}</span>
                        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-md">User: {todo.userId}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <nav aria-label="Todo pagination" className="flex justify-center">
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-2 shadow-sm">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                          className={currentPage <= 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer hover:bg-blue-50'}
                          aria-disabled={currentPage <= 1}
                        />
                      </PaginationItem>
                      
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <PaginationItem key={page}>
                          <PaginationLink
                            onClick={() => handlePageChange(page)}
                            isActive={currentPage === page}
                            className={`cursor-pointer ${currentPage === page ? 'bg-blue-600 text-white hover:bg-blue-700' : 'hover:bg-blue-50'}`}
                            aria-label={`Go to page ${page}`}
                            aria-current={currentPage === page ? 'page' : undefined}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      
                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                          className={currentPage >= totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer hover:bg-blue-50'}
                          aria-disabled={currentPage >= totalPages}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              </nav>
            )}
          </section>
        )}
      </main>

      <TodoDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen}
      />
    </div>
  );
};

const TodosWithErrorBoundary = () => (
  <ErrorBoundary>
    <Todos />
  </ErrorBoundary>
);

export default TodosWithErrorBoundary;
