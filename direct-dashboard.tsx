import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Loader2, User, LogOut, BarChart3, FileSpreadsheet, Layout, Download, Share2 } from "lucide-react";
import { exportToCsv, shareFile, generateSampleLeads } from "@/lib/exportUtils";

export default function DirectDashboardPage() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  // Get the current tab from URL if present
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, []);

  useEffect(() => {
    // Fetch current user data
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/user");
        
        if (!res.ok) {
          // Redirect to login if unauthorized
          if (res.status === 401) {
            setLocation("/direct-login");
            return;
          }
          throw new Error("Failed to fetch user data");
        }
        
        const userData = await res.json();
        setCurrentUser(userData);
      } catch (error) {
        console.error("Error fetching user:", error);
        toast({
          title: "Error",
          description: "Failed to load user data. Please log in again.",
          variant: "destructive",
        });
        setLocation("/direct-login");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUser();
  }, [setLocation, toast]);

  const handleLogout = async () => {
    try {
      await apiRequest("POST", "/api/logout");
      toast({
        title: "Logged out",
        description: "You have been logged out successfully.",
      });
      setLocation("/direct-login");
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!currentUser) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col">
      {/* Navigation */}
      <nav className="bg-gradient-to-r from-gray-800 to-gray-900 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <a onClick={() => setActiveTab("dashboard")} className="font-bold text-lg cursor-pointer">StudentLeadPro</a>
          <ul className="flex space-x-6">
            <li>
              <a onClick={() => setActiveTab("dashboard")} className={`hover:text-blue-300 transition-colors duration-300 flex items-center gap-1 cursor-pointer ${activeTab === "dashboard" ? "text-blue-300" : ""}`}>
                <Layout className="w-4 h-4" />
                Dashboard
              </a>
            </li>
            <li>
              <a onClick={() => setActiveTab("campaigns")} className={`hover:text-blue-300 transition-colors duration-300 flex items-center gap-1 cursor-pointer ${activeTab === "campaigns" ? "text-blue-300" : ""}`}>
                <FileSpreadsheet className="w-4 h-4" />
                Campaigns
              </a>
            </li>
            <li>
              <a onClick={() => setActiveTab("analytics")} className={`hover:text-blue-300 transition-colors duration-300 flex items-center gap-1 cursor-pointer ${activeTab === "analytics" ? "text-blue-300" : ""}`}>
                <BarChart3 className="w-4 h-4" />
                Analytics
              </a>
            </li>
            <li>
              <a onClick={() => setActiveTab("profile")} className={`hover:text-blue-300 transition-colors duration-300 flex items-center gap-1 cursor-pointer ${activeTab === "profile" ? "text-blue-300" : ""}`}>
                <User className="w-4 h-4" />
                Profile
              </a>
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
      
      {/* Main content */}
      <div className="container mx-auto py-8 px-4 flex-grow">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-6 border-b">
            <h1 className="text-2xl font-bold mb-4">
              {activeTab === "dashboard" && "Dashboard"}
              {activeTab === "campaigns" && "Campaigns"}
              {activeTab === "leads" && "Leads Management"}
              {activeTab === "analytics" && "Analytics & Reporting"}
              {activeTab === "profile" && "Profile Settings"}
            </h1>
            <p className="text-gray-600">
              {activeTab === "dashboard" && `Welcome back, ${currentUser.fullName || currentUser.username}! Manage your leads and campaigns from here.`}
              {activeTab === "campaigns" && "Create and manage your job campaigns to attract potential leads."}
              {activeTab === "leads" && "View, filter, and manage student applications and contact details."}
              {activeTab === "analytics" && "Track campaign performance, lead sources, and conversion metrics."}
              {activeTab === "profile" && "Update your account details and preferences."}
            </p>
          </div>
          
          {/* Dashboard Content */}
          {activeTab === "dashboard" && (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-indigo-50 border-indigo-100">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-indigo-700">Campaigns</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">Manage your work-from-home job campaigns</p>
                    <Button className="w-full" onClick={() => setActiveTab("campaigns")}>View Campaigns</Button>
                  </CardContent>
                </Card>
                
                <Card className="bg-green-50 border-green-100">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-green-700">Leads</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">Manage student applications and leads</p>
                    <Button variant="secondary" className="w-full bg-green-600 hover:bg-green-700 text-white" onClick={() => setActiveTab("leads")}>View Leads</Button>
                  </CardContent>
                </Card>
                
                <Card className="bg-purple-50 border-purple-100">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-purple-700">Analytics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">Track campaign performance and metrics</p>
                    <Button variant="outline" className="w-full border-purple-500 text-purple-600 hover:bg-purple-50" onClick={() => setActiveTab("analytics")}>View Analytics</Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
          
          {/* Campaigns Content */}
          {activeTab === "campaigns" && (
            <div className="p-6">
              <div className="mb-6 flex justify-between items-center">
                <h2 className="text-xl font-semibold">Active Campaigns</h2>
                <Button>Create New Campaign</Button>
              </div>
              
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-gray-50 p-4 border-b">
                  <p className="text-center text-gray-500">Work From Home Job Campaign - Active</p>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold mb-2">Campaign Details</h3>
                      <p className="text-gray-600 mb-4">Part-time & work-from-home opportunities for students</p>
                      <p className="text-sm text-gray-500">Target: Students aged 18-25 with 12th pass qualifications</p>
                      <p className="text-sm text-gray-500">Salary: ₹15,000 - ₹20,000 per month</p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Performance Summary</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <p className="text-sm text-gray-500">Total Impressions</p>
                          <p className="text-xl font-semibold">2,450</p>
                        </div>
                        <div className="bg-green-50 p-3 rounded-lg">
                          <p className="text-sm text-gray-500">Leads Generated</p>
                          <p className="text-xl font-semibold">37</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Leads Content */}
          {activeTab === "leads" && (
            <div className="p-6">
              <div className="mb-6 flex justify-between items-center">
                <h2 className="text-xl font-semibold">Recent Leads</h2>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    className="flex items-center gap-2"
                    onClick={() => {
                      const leadsData = generateSampleLeads(20);
                      exportToCsv(leadsData, `student-leads-${new Date().toISOString().split('T')[0]}`);
                      toast({
                        title: "Leads exported",
                        description: "The leads have been exported to CSV successfully.",
                      });
                    }}
                  >
                    <Download className="w-4 h-4" />
                    Download CSV
                  </Button>
                  <Button 
                    variant="secondary"
                    className="flex items-center gap-2"
                    onClick={async () => {
                      const leadsData = generateSampleLeads(20);
                      const result = await shareFile(
                        leadsData, 
                        `student-leads-${new Date().toISOString().split('T')[0]}`,
                        "StudentLeadPro - Exported Leads"
                      );
                      
                      if (result) {
                        toast({
                          title: "Share successful",
                          description: "The leads file has been shared or downloaded.",
                        });
                      } else {
                        toast({
                          title: "Share failed",
                          description: "Unable to share. File has been downloaded instead.",
                          variant: "destructive",
                        });
                      }
                    }}
                  >
                    <Share2 className="w-4 h-4" />
                    Share
                  </Button>
                </div>
              </div>
              
              <div className="border rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {generateSampleLeads(5).map((lead, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap">{lead.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{lead.phone}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{lead.city}, {lead.state}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            lead.status === 'qualified' ? 'bg-green-100 text-green-800' :
                            lead.status === 'new' ? 'bg-blue-100 text-blue-800' : 
                            lead.status === 'contacted' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {lead.status.charAt(0).toUpperCase() + lead.status.slice(1).replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">{lead.score}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {/* Analytics Content */}
          {activeTab === "analytics" && (
            <div className="p-6">
              <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Total Leads</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">127</p>
                    <p className="text-sm text-green-600">+12% from last month</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Conversion Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">24.8%</p>
                    <p className="text-sm text-green-600">+3.2% from last month</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Active Campaigns</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">2</p>
                    <p className="text-sm text-gray-500">1 pending approval</p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="border rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold">Lead Sources</h3>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex items-center gap-1 text-xs"
                    onClick={() => {
                      const sourceData = [
                        { source: 'Facebook', count: 53, percentage: 42 },
                        { source: 'Instagram', count: 34, percentage: 27 },
                        { source: 'Twitter', count: 15, percentage: 12 },
                        { source: 'WhatsApp', count: 19, percentage: 15 },
                        { source: 'Others', count: 5, percentage: 4 }
                      ];
                      exportToCsv(sourceData, `lead-sources-${new Date().toISOString().split('T')[0]}`);
                      toast({
                        title: "Lead sources exported",
                        description: "The lead sources data has been exported to CSV successfully.",
                      });
                    }}
                  >
                    <Download className="w-3 h-3" />
                    Export
                  </Button>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  <div className="h-24 bg-blue-100 rounded-lg flex flex-col items-center justify-center">
                    <p className="text-sm font-medium">Facebook</p>
                    <p className="text-lg font-bold">42%</p>
                  </div>
                  <div className="h-24 bg-pink-100 rounded-lg flex flex-col items-center justify-center">
                    <p className="text-sm font-medium">Instagram</p>
                    <p className="text-lg font-bold">27%</p>
                  </div>
                  <div className="h-24 bg-sky-100 rounded-lg flex flex-col items-center justify-center">
                    <p className="text-sm font-medium">Twitter</p>
                    <p className="text-lg font-bold">12%</p>
                  </div>
                  <div className="h-24 bg-green-100 rounded-lg flex flex-col items-center justify-center">
                    <p className="text-sm font-medium">WhatsApp</p>
                    <p className="text-lg font-bold">15%</p>
                  </div>
                  <div className="h-24 bg-indigo-100 rounded-lg flex flex-col items-center justify-center">
                    <p className="text-sm font-medium">Others</p>
                    <p className="text-lg font-bold">4%</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Profile Content */}
          {activeTab === "profile" && (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-4">Account Information</h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Username</label>
                        <input type="text" value="admin" readOnly className="mt-1 p-2 block w-full rounded-md border border-gray-300 bg-gray-50" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Full Name</label>
                        <input type="text" value="Admin User" className="mt-1 p-2 block w-full rounded-md border border-gray-300" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input type="email" value="admin@example.com" className="mt-1 p-2 block w-full rounded-md border border-gray-300" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-4">Change Password</h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Current Password</label>
                        <input type="password" className="mt-1 p-2 block w-full rounded-md border border-gray-300" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">New Password</label>
                        <input type="password" className="mt-1 p-2 block w-full rounded-md border border-gray-300" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                        <input type="password" className="mt-1 p-2 block w-full rounded-md border border-gray-300" />
                      </div>
                    </div>
                  </div>
                  
                  <Button className="w-full">Save Changes</Button>
                </div>

                <div>
                  <h2 className="text-xl font-semibold mb-4">Export History</h2>
                  <div className="border rounded-lg overflow-hidden">
                    <div className="bg-gray-50 border-b px-4 py-3 flex justify-between items-center">
                      <p className="font-medium">Recent Exports</p>
                      <p className="text-xs text-gray-500">Last 5 exports shown</p>
                    </div>
                    <div>
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">File Name</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {localStorage.getItem('exportHistory') ? (
                            JSON.parse(localStorage.getItem('exportHistory') || '[]').map((export_: any, index: number) => (
                              <tr key={index}>
                                <td className="px-4 py-2">{export_.filename}</td>
                                <td className="px-4 py-2 text-sm text-gray-500">{new Date(export_.date).toLocaleString()}</td>
                                <td className="px-4 py-2">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-8 text-xs"
                                    onClick={() => {
                                      const data = JSON.parse(export_.data);
                                      exportToCsv(data, export_.filename.replace('.csv', ''));
                                      toast({
                                        title: "Re-downloaded",
                                        description: `Exported ${export_.filename} successfully.`,
                                      });
                                    }}
                                  >
                                    <Download className="w-3 h-3 mr-1" />
                                    Download
                                  </Button>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={3} className="px-4 py-4 text-sm text-center text-gray-500">
                                No export history found. Export some data to see it here.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h3 className="font-medium mb-2">Download Location</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      Files are typically saved to your browser's default download location. For Chrome, this is usually:
                    </p>
                    <div className="bg-gray-50 p-3 rounded border text-sm">
                      <p className="font-mono">Windows: C:\Users\YourName\Downloads</p>
                      <p className="font-mono">Mac: /Users/YourName/Downloads</p>
                      <p className="font-mono">Android: /storage/emulated/0/Download</p>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      You can change this location in your browser settings.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-gray-800 text-white text-center p-4 mt-auto">
        <p className="text-sm">&copy; {new Date().getFullYear()} StudentLeadPro. All rights reserved.</p>
      </footer>
    </div>
  );
}