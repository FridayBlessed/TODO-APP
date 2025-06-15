
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, ArrowLeft, Search } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-lg w-full text-center">
        <CardHeader>
          <div className="mx-auto mb-4 text-6xl font-bold text-muted-foreground">404</div>
          <CardTitle className="text-2xl">Page Not Found</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-muted-foreground space-y-2">
            <p>Sorry, we couldn't find the page you're looking for.</p>
            <p className="text-sm">
              The page at <code className="bg-muted px-2 py-1 rounded text-xs">{location.pathname}</code> doesn't exist.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Button asChild className="flex-1">
              <Link to="/todos" aria-label="Go to todos page">
                <Home className="h-4 w-4 mr-2" />
                Go to Todos
              </Link>
            </Button>
            <Button 
              variant="outline" 
              onClick={() => window.history.back()}
              className="flex-1"
              aria-label="Go back to previous page"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </div>

          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground mb-3">
              Looking for something specific?
            </p>
            <div className="space-y-2 text-sm">
              <Link 
                to="/todos" 
                className="block hover:text-primary transition-colors"
                aria-label="Browse all todos"
              >
                <Search className="h-4 w-4 inline mr-2" />
                Browse all todos
              </Link>
              <Link 
                to="/error-test" 
                className="block hover:text-primary transition-colors"
                aria-label="Test error boundary"
              >
                Test Error Boundary
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
