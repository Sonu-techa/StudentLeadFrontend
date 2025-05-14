import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { Redirect, Route } from "wouter";

/**
 * Protected route component that redirects to login if user is not authenticated
 * 
 * @param path Route path
 * @param component Component to render if authenticated
 */
export function ProtectedRoute({
  path,
  component: Component,
}: {
  path: string;
  component: React.ComponentType<any>;
}) {
  const { user, isLoading } = useAuth();

  return (
    <Route path={path}>
      {(params) => {
        // If authentication is still loading, show a spinner
        if (isLoading) {
          return (
            <div className="flex items-center justify-center min-h-screen">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
          );
        }

        // If not authenticated, redirect to auth page
        if (!user) {
          return <Redirect to="/auth" />;
        }

        // Otherwise, render the protected component with params
        return <Component {...params} />;
      }}
    </Route>
  );
}