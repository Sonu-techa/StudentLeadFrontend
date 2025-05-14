import { useEffect } from "react";
import { Route, Switch, useLocation, Link, useRoute, Redirect } from "wouter";
import { AnimatePresence } from "framer-motion";
import { PageTransition } from "@/components/ui/page-transition";
import { Toaster } from "@/components/ui/toaster";
import { Loader2, User, LogOut, BarChart3, FileSpreadsheet, Layout } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

// Page imports
import CampaignsPage from "@/pages/campaigns-page";
import NewCampaignPage from "@/pages/new-campaign-page";
import PublicFormPage from "@/pages/public-form-page";
import AuthPage from "@/pages/auth-page";
import ProfilePage from "@/pages/profile-page";
import NotFound from "@/pages/not-found";

// Protected route component
function ProtectedRoute({ component: Component, ...rest }: { component: React.ComponentType, path: string }) {
  const { user, isLoading } = useAuth();
  const [isRoute] = useRoute(rest.path);
  const [, navigate] = useLocation();
  
  useEffect(() => {
    // If authenticated route but no user, redirect
    if (isRoute && !isLoading && !user) {
      navigate("/auth");
    }
  }, [isRoute, navigate, user, isLoading]);
  
  if (isLoading) {
    // Still checking authentication
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }
  
  if (!user) {
    return null; // Will redirect in useEffect
  }
  
  return <Component />;
}

// Dashboard component (for authenticated users)
const DashboardPage = () => {
  const { toast } = useToast();
  const { logoutMutation } = useAuth();
  const [, navigate] = useLocation();
  
  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      navigate("/auth");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };
  
  return (
    <PageTransition>
      <div className="container mx-auto py-8 px-4">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-6 border-b">
            <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
            <p className="text-gray-600">
              Welcome to StudentLeadPro Dashboard. Manage your leads and campaigns from here.
            </p>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
              <div className="bg-indigo-50 p-6 rounded-lg shadow-sm border border-indigo-100">
                <h3 className="text-lg font-semibold text-indigo-700 mb-2">Campaigns</h3>
                <p className="text-gray-600 mb-4">Manage your work-from-home job campaigns</p>
                <Link href="/campaigns">
                  <Button className="w-full">View Campaigns</Button>
                </Link>
              </div>
              
              <div className="bg-green-50 p-6 rounded-lg shadow-sm border border-green-100">
                <h3 className="text-lg font-semibold text-green-700 mb-2">Leads</h3>
                <p className="text-gray-600 mb-4">Manage student applications and leads</p>
                <Link href="/campaigns?tab=leads">
                  <Button variant="secondary" className="w-full bg-green-600 hover:bg-green-700 text-white">View Leads</Button>
                </Link>
              </div>
              
              <div className="bg-purple-50 p-6 rounded-lg shadow-sm border border-purple-100">
                <h3 className="text-lg font-semibold text-purple-700 mb-2">Analytics</h3>
                <p className="text-gray-600 mb-4">Track campaign performance and metrics</p>
                <Link href="/campaigns?tab=analytics">
                  <Button variant="outline" className="w-full border-purple-500 text-purple-600 hover:bg-purple-50">View Analytics</Button>
                </Link>
              </div>
              
              <div className="bg-amber-50 p-6 rounded-lg shadow-sm border border-amber-100">
                <h3 className="text-lg font-semibold text-amber-700 mb-2">Exports</h3>
                <p className="text-gray-600 mb-4">Export and manage lead data in CSV/Excel</p>
                <Link href="/campaigns?tab=exports">
                  <Button variant="outline" className="w-full border-amber-500 text-amber-600 hover:bg-amber-50">Export Leads</Button>
                </Link>
              </div>
              
              <div className="bg-blue-50 p-6 rounded-lg shadow-sm border border-blue-100">
                <h3 className="text-lg font-semibold text-blue-700 mb-2">Profile</h3>
                <p className="text-gray-600 mb-4">Manage your account settings</p>
                <Link href="/profile">
                  <Button variant="outline" className="w-full border-blue-500 text-blue-600 hover:bg-blue-50">Account Settings</Button>
                </Link>
              </div>
            </div>
            
            <div className="mt-8 flex justify-between">
              <Link href="/profile">
                <Button variant="outline" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Manage Profile
                </Button>
              </Link>
              <Button variant="destructive" onClick={handleLogout} className="flex items-center gap-2">
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

// Navbar component for authenticated users
const AuthenticatedNav = () => {
  const [, navigate] = useLocation();
  const { logoutMutation } = useAuth();
  
  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      navigate("/auth");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };
  
  return (
    <nav className="bg-gradient-to-r from-gray-800 to-gray-900 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/dashboard" className="font-bold text-lg">StudentLeadPro</Link>
        <ul className="flex space-x-6">
          <li>
            <Link href="/dashboard" className="hover:text-blue-300 transition-colors duration-300 flex items-center gap-1">
              <Layout className="w-4 h-4" />
              Dashboard
            </Link>
          </li>
          <li>
            <Link href="/campaigns" className="hover:text-blue-300 transition-colors duration-300 flex items-center gap-1">
              <FileSpreadsheet className="w-4 h-4" />
              Campaigns
            </Link>
          </li>
          <li>
            <Link href="/new-campaign" className="hover:text-blue-300 transition-colors duration-300 flex items-center gap-1">
              <BarChart3 className="w-4 h-4" />
              New Campaign
            </Link>
          </li>

          <li>
            <Link href="/profile" className="hover:text-blue-300 transition-colors duration-300 flex items-center gap-1">
              <User className="w-4 h-4" />
              Profile
            </Link>
          </li>
          <li>
            <button 
              onClick={handleLogout}
              className="hover:text-red-300 transition-colors duration-300 flex items-center gap-1"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

/**
 * Simple Nav for public pages
 */
const PublicNav = () => {
  return (
    <nav className="bg-gradient-to-r from-gray-800 to-gray-900 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <a href="/auth" className="font-bold text-lg">StudentLeadPro</a>
        <ul className="flex space-x-6">
          <li>
            <a href="/auth" className="hover:text-blue-300 transition-colors duration-300">
              Sign In
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

/**
 * Routes Component - separated to handle auth provider context properly
 */
const AppRoutes = () => {
  const [location] = useLocation();
  const [isFormPage] = useRoute("/apply");
  // It's now safe to use auth here since this component is only rendered within the AuthProvider
  const { user, isLoading } = useAuth();
  
  return (
    <AnimatePresence mode="wait">
      <Switch key={location}>
        {/* Public routes that anyone can access */}
        <Route path="/apply" component={PublicFormPage} />
        <Route path="/auth">
          {() => {
            if (user && !isLoading) {
              return <Redirect to="/" />;
            }
            return <AuthPage />;
          }}
        </Route>
        
        {/* Protected routes that require authentication */}
        <Route path="/">
          {() => {
            // Check authentication
            if (isLoading) {
              return (
                <div className="flex items-center justify-center min-h-screen">
                  <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                </div>
              );
            }
            
            if (!user) {
              return <Redirect to="/auth" />;
            }
            
            return (
              <>
                {!isFormPage && <AuthenticatedNav />}
                <DashboardPage />
              </>
            );
          }}
        </Route>
        
        <Route path="/dashboard">
          {() => {
            if (isLoading) {
              return (
                <div className="flex items-center justify-center min-h-screen">
                  <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                </div>
              );
            }
            
            if (!user) {
              return <Redirect to="/auth" />;
            }
            
            return (
              <>
                {!isFormPage && <AuthenticatedNav />}
                <DashboardPage />
              </>
            );
          }}
        </Route>
        
        <Route path="/campaigns">
          {() => {
            if (isLoading) {
              return (
                <div className="flex items-center justify-center min-h-screen">
                  <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                </div>
              );
            }
            
            if (!user) {
              return <Redirect to="/auth" />;
            }
            
            return (
              <>
                {!isFormPage && <AuthenticatedNav />}
                <CampaignsPage />
              </>
            );
          }}
        </Route>
        
        <Route path="/new-campaign">
          {() => {
            if (isLoading) {
              return (
                <div className="flex items-center justify-center min-h-screen">
                  <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                </div>
              );
            }
            
            if (!user) {
              return <Redirect to="/auth" />;
            }
            
            return (
              <>
                {!isFormPage && <AuthenticatedNav />}
                <NewCampaignPage />
              </>
            );
          }}
        </Route>
        
        <Route path="/profile">
          {() => {
            if (isLoading) {
              return (
                <div className="flex items-center justify-center min-h-screen">
                  <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                </div>
              );
            }
            
            if (!user) {
              return <Redirect to="/auth" />;
            }
            
            return (
              <>
                {!isFormPage && <AuthenticatedNav />}
                <ProfilePage />
              </>
            );
          }}
        </Route>
        
        {/* 404 page */}
        <Route>
          <NotFound />
        </Route>
      </Switch>
    </AnimatePresence>
  );
};

/**
 * Main App component
 */
function App() {
  const [isFormPage] = useRoute("/apply");
  
  return (
    <div className="app min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col">      
      <main className="flex-grow">
        <AppRoutes />
      </main>
      
      {/* Only show footer if not on form page */}
      {!isFormPage && (
        <footer className="bg-gray-800 text-white text-center p-4 mt-auto">
          <p className="text-sm">&copy; {new Date().getFullYear()} StudentLeadPro. All rights reserved.</p>
        </footer>
      )}
      
      <Toaster />
    </div>
  );
}

export default App;