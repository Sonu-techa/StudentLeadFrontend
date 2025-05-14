import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { AppLayout } from "@/components/layouts/app-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip
} from "recharts";
import { ChevronLeft, Edit, Trash2 } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

// Define colors for the score breakdown chart
const COLORS = ['#3b82f6', '#10b981', '#8b5cf6', '#f97316', '#6b7280', '#ec4899', '#a855f7', '#06b6d4'];

export default function LeadDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [leadData, setLeadData] = useState<any>(null);

  // Get lead details
  const { data: lead, isLoading } = useQuery({
    queryKey: [`/api/leads/${id}`],
    onSuccess: (data) => {
      setLeadData(data);
    },
  });

  // Lead status options
  const statusOptions = [
    { value: "new", label: "New" },
    { value: "contacted", label: "Contacted" },
    { value: "qualified", label: "Qualified" },
    { value: "not_qualified", label: "Not Qualified" },
  ];

  // Update lead mutation
  const updateLeadMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("PATCH", `/api/admin/leads/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/leads/${id}`] });
      setIsEditMode(false);
      toast({
        title: "Lead updated",
        description: "The lead information has been updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Update failed",
        description: error.message || "Failed to update lead information",
        variant: "destructive",
      });
    },
  });

  // Delete lead mutation
  const deleteLeadMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("DELETE", `/api/admin/leads/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Lead deleted",
        description: "The lead has been deleted successfully",
      });
      navigate("/leads");
    },
    onError: (error) => {
      toast({
        title: "Delete failed",
        description: error.message || "Failed to delete the lead",
        variant: "destructive",
      });
      setIsDeleteDialogOpen(false);
    },
  });

  // Handle input changes for edit mode
  const handleInputChange = (field: string, value: string) => {
    setLeadData({
      ...leadData,
      [field]: value,
    });
  };

  // Handle save changes
  const handleSaveChanges = () => {
    const { name, email, phone, status, notes } = leadData;
    updateLeadMutation.mutate({ name, email, phone, status, notes });
  };

  // Handle delete
  const handleDelete = () => {
    deleteLeadMutation.mutate();
  };

  // Prepare score breakdown data for chart
  const scoreBreakdownData = lead?.scoreBreakdown ? 
    Object.entries(lead.scoreBreakdown).map(([name, value]) => ({
      name,
      value: Number(value),
    })) : [];

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-full">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </AppLayout>
    );
  }

  if (!lead) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center h-full">
          <h2 className="text-xl font-semibold">Lead not found</h2>
          <p className="text-gray-500 mt-2">The lead you're looking for doesn't exist or has been deleted.</p>
          <Button className="mt-4" onClick={() => navigate("/leads")}>
            Back to Leads
          </Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div>
        {/* Header with actions */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="sm" 
              className="mr-4"
              onClick={() => navigate("/leads")}
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Back
            </Button>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Lead Details</h1>
              <p className="text-sm text-gray-500">View and manage lead information</p>
            </div>
          </div>
          <div className="flex space-x-3">
            {!isEditMode ? (
              <Button 
                variant="outline" 
                onClick={() => setIsEditMode(true)}
              >
                <Edit className="h-4 w-4 mr-2" /> Edit Lead
              </Button>
            ) : (
              <Button 
                variant="outline" 
                onClick={() => {
                  setLeadData(lead);
                  setIsEditMode(false);
                }}
              >
                Cancel
              </Button>
            )}
            
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="h-4 w-4 mr-2" /> Delete
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Confirm Deletion</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete this lead? This action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsDeleteDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    variant="destructive" 
                    onClick={handleDelete}
                    disabled={deleteLeadMutation.isPending}
                  >
                    {deleteLeadMutation.isPending ? "Deleting..." : "Delete Lead"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            {isEditMode && (
              <Button 
                onClick={handleSaveChanges}
                disabled={updateLeadMutation.isPending}
              >
                {updateLeadMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            )}
          </div>
        </div>

        {/* Lead details content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Lead info card */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Lead Information</CardTitle>
              <CardDescription>Basic details about the lead</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Name</label>
                  {isEditMode ? (
                    <Input 
                      value={leadData.name} 
                      onChange={(e) => handleInputChange('name', e.target.value)} 
                    />
                  ) : (
                    <p className="text-base">{lead.name}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  {isEditMode ? (
                    <Input 
                      type="email" 
                      value={leadData.email} 
                      onChange={(e) => handleInputChange('email', e.target.value)} 
                    />
                  ) : (
                    <p className="text-base">{lead.email}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Phone</label>
                  {isEditMode ? (
                    <Input 
                      value={leadData.phone} 
                      onChange={(e) => handleInputChange('phone', e.target.value)} 
                    />
                  ) : (
                    <p className="text-base">{lead.phone}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Age</label>
                  <p className="text-base">{lead.age} years</p>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Education</label>
                  <p className="text-base">{lead.education}</p>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">College/Institution</label>
                  <p className="text-base">{lead.college || "Not specified"}</p>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">State</label>
                  <p className="text-base">{lead.state}</p>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">City</label>
                  <p className="text-base">{lead.city}</p>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Lead Source</label>
                  <p className="text-base">{lead.source.charAt(0).toUpperCase() + lead.source.slice(1).replace('_', ' ')}</p>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Status</label>
                  {isEditMode ? (
                    <Select 
                      value={leadData.status} 
                      onValueChange={(value) => handleInputChange('status', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Badge
                      variant="outline"
                      className={`
                        ${lead.status === 'qualified' ? 'bg-green-100 text-green-800 hover:bg-green-100' : ''}
                        ${lead.status === 'contacted' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100' : ''}
                        ${lead.status === 'new' ? 'bg-blue-100 text-blue-800 hover:bg-blue-100' : ''}
                        ${lead.status === 'not_qualified' ? 'bg-gray-100 text-gray-800 hover:bg-gray-100' : ''}
                      `}
                    >
                      {lead.status.charAt(0).toUpperCase() + lead.status.slice(1).replace('_', ' ')}
                    </Badge>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Created Date</label>
                  <p className="text-base">{format(new Date(lead.createdAt), "PPP")}</p>
                </div>
              </div>
              
              <div className="mt-6 space-y-2">
                <label className="text-sm font-medium text-gray-700">Notes</label>
                {isEditMode ? (
                  <Textarea 
                    value={leadData.notes || ''} 
                    onChange={(e) => handleInputChange('notes', e.target.value)} 
                    placeholder="Add notes about this lead..."
                    rows={4}
                  />
                ) : (
                  <p className="text-base">{lead.notes || "No notes available"}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Score and analytics card */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Lead Score</CardTitle>
                <CardDescription>Quality and engagement metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center mb-4">
                  <div className={`
                    w-24 h-24 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-2
                    ${lead.scoreLabel === 'Hot' ? 'bg-green-500' : ''}
                    ${lead.scoreLabel === 'Warm' ? 'bg-yellow-500' : ''}
                    ${lead.scoreLabel === 'Cool' ? 'bg-blue-500' : ''}
                    ${lead.scoreLabel === 'Cold' ? 'bg-gray-500' : ''}
                  `}>
                    {lead.score}
                  </div>
                  <Badge className={`text-sm px-3 py-1
                    ${lead.scoreLabel === 'Hot' ? 'bg-green-100 text-green-800' : ''}
                    ${lead.scoreLabel === 'Warm' ? 'bg-yellow-100 text-yellow-800' : ''}
                    ${lead.scoreLabel === 'Cool' ? 'bg-blue-100 text-blue-800' : ''}
                    ${lead.scoreLabel === 'Cold' ? 'bg-gray-100 text-gray-800' : ''}
                  `}>
                    {lead.scoreLabel}
                  </Badge>
                </div>

                <h4 className="text-sm font-medium text-gray-700 mt-6 mb-3">Score Breakdown</h4>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={scoreBreakdownData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={60}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {scoreBreakdownData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} points`, '']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-4 space-y-2">
                  {scoreBreakdownData.map((factor, index) => (
                    <div key={factor.name} className="flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <span 
                          className="w-3 h-3 rounded-full mr-2" 
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        ></span>
                        <span>{factor.name}</span>
                      </div>
                      <span className="font-medium">{factor.value} pts</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Activity Timeline</CardTitle>
                <CardDescription>Recent interactions and updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex">
                    <div className="mr-4">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <p className="font-medium">Lead created</p>
                      <p className="text-sm text-gray-500">{format(new Date(lead.createdAt), "PPP p")}</p>
                    </div>
                  </div>
                  {lead.status !== 'new' && (
                    <div className="flex">
                      <div className="mr-4">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100 text-green-600">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                      </div>
                      <div>
                        <p className="font-medium">Status updated to {lead.status.charAt(0).toUpperCase() + lead.status.slice(1).replace('_', ' ')}</p>
                        <p className="text-sm text-gray-500">{format(new Date(lead.updatedAt), "PPP p")}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
