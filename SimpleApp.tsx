import { Route, Switch, useLocation } from "wouter";
import { AnimatePresence } from "framer-motion";
import { Toaster } from "@/components/ui/toaster";
import DirectLoginPage from "@/pages/direct-login";
import DirectDashboardPage from "@/pages/direct-dashboard";
import PublicFormPage from "@/pages/public-form-page";
import NotFound from "@/pages/not-found";

/**
 * Simple App component without complex auth provider structure
 */
function SimpleApp() {
  const [location] = useLocation();
  
  return (
    <div className="app min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col">      
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <Switch key={location}>
            {/* Public routes that anyone can access */}
            <Route path="/apply" component={PublicFormPage} />
            <Route path="/direct-login" component={DirectLoginPage} />
            <Route path="/" component={DirectDashboardPage} />
            <Route path="/direct-dashboard" component={DirectDashboardPage} />
            
            {/* 404 page */}
            <Route component={NotFound} />
          </Switch>
        </AnimatePresence>
      </main>
      
      <Toaster />
    </div>
  );
}

export default SimpleApp;