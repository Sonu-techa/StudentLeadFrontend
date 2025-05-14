import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  UserPlus, 
  FileText, 
  Megaphone, 
  ArrowRight,
  BarChart4,
  Activity,
  UserCheck
} from "lucide-react";

export default function HomePage() {
  const { user, logoutMutation } = useAuth();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
            StudentLeadPro
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              Welcome, {user?.fullName || user?.username}
            </span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Dashboard</h2>
          <p className="text-gray-600">
            Manage your student leads and marketing campaigns from one place.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-100">
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 p-3 rounded-full mr-4">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">Total Leads</h3>
            </div>
            <div className="flex items-end justify-between">
              <p className="text-3xl font-bold text-gray-900">521</p>
              <div className="flex items-center text-green-600 text-sm">
                <Activity className="h-4 w-4 mr-1" />
                <span>+12% this week</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-100">
            <div className="flex items-center mb-4">
              <div className="bg-green-100 p-3 rounded-full mr-4">
                <UserCheck className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">Conversion Rate</h3>
            </div>
            <div className="flex items-end justify-between">
              <p className="text-3xl font-bold text-gray-900">15.7%</p>
              <div className="flex items-center text-green-600 text-sm">
                <Activity className="h-4 w-4 mr-1" />
                <span>+2.3% this month</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-100">
            <div className="flex items-center mb-4">
              <div className="bg-purple-100 p-3 rounded-full mr-4">
                <BarChart4 className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">Active Campaigns</h3>
            </div>
            <div className="flex items-end justify-between">
              <p className="text-3xl font-bold text-gray-900">3</p>
              <div className="flex items-center text-blue-600 text-sm">
                <Activity className="h-4 w-4 mr-1" />
                <span>2 pending approval</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link href="/leads">
            <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-100 hover:shadow-md transition-shadow duration-200 cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Manage Leads</h3>
              <p className="text-gray-600 text-sm">
                View, filter, and manage your student lead database.
              </p>
            </div>
          </Link>
          
          <Link href="/leads/new">
            <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-100 hover:shadow-md transition-shadow duration-200 cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <UserPlus className="h-6 w-6 text-green-600" />
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Add New Lead</h3>
              <p className="text-gray-600 text-sm">
                Create a new student lead record manually.
              </p>
            </div>
          </Link>
          
          <Link href="/forms">
            <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-100 hover:shadow-md transition-shadow duration-200 cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-yellow-100 p-3 rounded-full">
                  <FileText className="h-6 w-6 text-yellow-600" />
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Lead Forms</h3>
              <p className="text-gray-600 text-sm">
                Create and manage forms to capture new leads.
              </p>
            </div>
          </Link>
          
          <Link href="/campaigns">
            <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-100 hover:shadow-md transition-shadow duration-200 cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-purple-100 p-3 rounded-full">
                  <Megaphone className="h-6 w-6 text-purple-600" />
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Campaigns</h3>
              <p className="text-gray-600 text-sm">
                Create and monitor social media marketing campaigns.
              </p>
            </div>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-sm text-gray-600 text-center">
            &copy; {new Date().getFullYear()} StudentLeadPro | All rights reserved
          </p>
        </div>
      </footer>
    </div>
  );
}