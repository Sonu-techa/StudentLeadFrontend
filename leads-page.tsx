import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AppLayout } from "@/components/layouts/app-layout";
import { LeadFilters } from "@/components/leads/lead-filters";
import { LeadForm } from "@/components/leads/lead-form";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
} from "@/components/ui/dialog";
import { ColumnDef } from "@tanstack/react-table";
import { Link } from "wouter";
import { Download, Plus, Eye, Edit, Trash2 } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { PaginatedResponse } from "@shared/types";
import type { Lead } from "@shared/schema";

interface LeadWithScore extends Lead {
  score: number;
  scoreLabel: string;
}

export default function LeadsPage() {
  const [isAddLeadOpen, setIsAddLeadOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({});
  const { toast } = useToast();

  const {
    data: leadsResponse,
    isLoading,
  } = useQuery<PaginatedResponse<LeadWithScore>>({
    queryKey: ["/api/admin/leads", { page: currentPage, ...filters }],
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleFilter = (newFilters: any) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleExportLeads = async () => {
    try {
      // Construct the query parameters for the export
      const params = new URLSearchParams();
      if (filters?.search) params.append('search', filters.search);
      if (filters?.source) params.append('source', filters.source);
      if (filters?.status) params.append('status', filters.status);
      if (filters?.dateRange?.from) params.append('fromDate', filters.dateRange.from);
      if (filters?.dateRange?.to) params.append('toDate', filters.dateRange.to);
      
      // Initiate download
      window.location.href = `/api/admin/leads/export?${params.toString()}`;
      
      toast({
        title: "Export started",
        description: "Your leads export has started downloading",
      });
    } catch (error) {
      console.error("Export error:", error);
      toast({
        title: "Export failed",
        description: "There was an error exporting your leads",
        variant: "destructive",
      });
    }
  };

  const handleDeleteLead = async (id: number) => {
    try {
      await apiRequest("DELETE", `/api/admin/leads/${id}`);
      
      toast({
        title: "Lead deleted",
        description: "The lead has been successfully deleted",
      });
      
      // Refresh the leads list
      queryClient.invalidateQueries({ queryKey: ["/api/admin/leads"] });
    } catch (error) {
      console.error("Delete error:", error);
      toast({
        title: "Delete failed",
        description: "There was an error deleting the lead",
        variant: "destructive",
      });
    }
  };

  const columns: ColumnDef<LeadWithScore>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
        const lead = row.original;
        return (
          <div>
            <div className="font-medium">{lead.name}</div>
            <div className="text-sm text-muted-foreground">{lead.email}</div>
          </div>
        );
      },
    },
    {
      accessorKey: "phone",
      header: "Contact",
      cell: ({ row }) => {
        const lead = row.original;
        return (
          <div className="text-sm">{lead.phone}</div>
        );
      },
    },
    {
      accessorKey: "education",
      header: "Education",
      cell: ({ row }) => {
        const lead = row.original;
        return (
          <div className="text-sm">
            <div>{lead.education}</div>
            {lead.college && <div className="text-muted-foreground">{lead.college}</div>}
          </div>
        );
      },
    },
    {
      accessorKey: "source",
      header: "Source",
      cell: ({ row }) => {
        const lead = row.original;
        return lead.source.charAt(0).toUpperCase() + lead.source.slice(1).replace('_', ' ');
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const lead = row.original;
        return (
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
        );
      },
    },
    {
      accessorKey: "score",
      header: "Score",
      cell: ({ row }) => {
        const lead = row.original;
        return (
          <div className="flex items-center">
            <span className="font-medium">{lead.score}</span>
            {lead.scoreLabel && (
              <Badge
                variant="outline"
                className={`ml-2 
                  ${lead.scoreLabel === 'Hot' ? 'bg-green-100 text-green-800 hover:bg-green-100' : ''}
                  ${lead.scoreLabel === 'Warm' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100' : ''}
                  ${lead.scoreLabel === 'Cool' ? 'bg-blue-100 text-blue-800 hover:bg-blue-100' : ''}
                  ${lead.scoreLabel === 'Cold' ? 'bg-gray-100 text-gray-800 hover:bg-gray-100' : ''}
                `}
              >
                {lead.scoreLabel}
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const lead = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="1" />
                  <circle cx="19" cy="12" r="1" />
                  <circle cx="5" cy="12" r="1" />
                </svg>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <Link href={`/leads/${lead.id}`}>
                  <Eye className="mr-2 h-4 w-4" /> View details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/leads/${lead.id}/edit`}>
                  <Edit className="mr-2 h-4 w-4" /> Edit lead
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => handleDeleteLead(lead.id)}
                className="text-red-600 focus:text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" /> Delete lead
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <AppLayout>
      <div>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Leads</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage and track all your student leads
            </p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" onClick={handleExportLeads}>
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
            <Dialog open={isAddLeadOpen} onOpenChange={setIsAddLeadOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Lead
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Add New Lead</DialogTitle>
                  <DialogDescription>
                    Fill in the lead information below. Click submit when you're done.
                  </DialogDescription>
                </DialogHeader>
                <LeadForm onSuccess={() => {
                  setIsAddLeadOpen(false);
                  queryClient.invalidateQueries({ queryKey: ["/api/admin/leads"] });
                }} />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="mt-6 space-y-6">
          <LeadFilters onFilter={handleFilter} />
          
          <DataTable
            columns={columns}
            data={leadsResponse?.data || []}
            searchColumn="name"
            searchPlaceholder="Search leads..."
            pagination={leadsResponse?.meta && {
              pageSize: leadsResponse.meta.itemsPerPage,
              pageIndex: leadsResponse.meta.currentPage - 1,
              pageCount: leadsResponse.meta.totalPages,
              onPageChange: handlePageChange,
            }}
          />
        </div>
      </div>
    </AppLayout>
  );
}
