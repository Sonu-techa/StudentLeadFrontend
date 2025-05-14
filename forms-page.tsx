import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { AppLayout } from "@/components/layouts/app-layout";
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
  DialogFooter
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ColumnDef } from "@tanstack/react-table";
import { Plus, Copy, Trash, FileText, Check, X } from "lucide-react";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertFormSchema } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import type { Form as FormType } from "@shared/schema";

// Form schema with validation
const formSchema = insertFormSchema;
type FormValues = z.infer<typeof formSchema>;

export default function FormsPage() {
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [formToDelete, setFormToDelete] = useState<FormType | null>(null);
  const { toast } = useToast();

  // Fetch forms
  const { data: forms = [], isLoading } = useQuery<FormType[]>({
    queryKey: ["/api/admin/forms"],
  });

  // Form hook
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      active: true,
    },
  });

  // Create form mutation
  const createFormMutation = useMutation({
    mutationFn: async (values: FormValues) => {
      return apiRequest("POST", "/api/admin/forms", values);
    },
    onSuccess: () => {
      toast({
        title: "Form created",
        description: "The form has been created successfully",
      });
      setIsAddFormOpen(false);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/admin/forms"] });
    },
    onError: (error) => {
      toast({
        title: "Error creating form",
        description: error.message || "An error occurred while creating the form",
        variant: "destructive",
      });
    },
  });

  // Delete form mutation
  const deleteFormMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("DELETE", `/api/admin/forms/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Form deleted",
        description: "The form has been deleted successfully",
      });
      setIsDeleteDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["/api/admin/forms"] });
    },
    onError: (error) => {
      toast({
        title: "Error deleting form",
        description: error.message || "An error occurred while deleting the form",
        variant: "destructive",
      });
    },
  });

  // Toggle form active state mutation
  const toggleFormMutation = useMutation({
    mutationFn: async ({ id, active }: { id: number; active: boolean }) => {
      return apiRequest("PATCH", `/api/admin/forms/${id}`, { active });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/forms"] });
    },
    onError: (error) => {
      toast({
        title: "Error updating form",
        description: error.message || "An error occurred while updating the form",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: FormValues) => {
    createFormMutation.mutate(values);
  };

  const handleDeleteForm = (formId: number) => {
    deleteFormMutation.mutate(formId);
  };

  const handleToggleForm = (id: number, currentActive: boolean) => {
    toggleFormMutation.mutate({ id, active: !currentActive });
  };

  const handleCopyEmbedCode = (formId: number) => {
    // In a real app, this would generate an embed code for the form
    const embedCode = `<iframe src="${window.location.origin}/embed/forms/${formId}" width="100%" height="500" frameborder="0"></iframe>`;
    
    navigator.clipboard.writeText(embedCode).then(() => {
      toast({
        title: "Embed code copied",
        description: "The form embed code has been copied to your clipboard",
      });
    }).catch(err => {
      console.error("Could not copy text: ", err);
      toast({
        title: "Failed to copy",
        description: "Could not copy the embed code to clipboard",
        variant: "destructive",
      });
    });
  };

  const columns: ColumnDef<FormType>[] = [
    {
      accessorKey: "name",
      header: "Form Name",
      cell: ({ row }) => {
        const form = row.original;
        return (
          <div>
            <div className="font-medium">{form.name}</div>
            <div className="text-sm text-muted-foreground truncate max-w-[300px]">
              {form.description}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "active",
      header: "Status",
      cell: ({ row }) => {
        const form = row.original;
        return (
          <Badge
            variant="outline"
            className={form.active ? "bg-green-100 text-green-800 hover:bg-green-100" : "bg-gray-100 text-gray-800 hover:bg-gray-100"}
          >
            {form.active ? "Active" : "Inactive"}
          </Badge>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) => {
        const form = row.original;
        return format(new Date(form.createdAt), "MMM d, yyyy");
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const form = row.original;
        return (
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleCopyEmbedCode(form.id)}
            >
              <Copy className="mr-2 h-4 w-4" />
              Copy Embed
            </Button>
            
            <Button 
              variant={form.active ? "destructive" : "outline"}
              size="sm"
              onClick={() => handleToggleForm(form.id, form.active)}
            >
              {form.active ? (
                <>
                  <X className="mr-2 h-4 w-4" />
                  Deactivate
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Activate
                </>
              )}
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => {
                setFormToDelete(form);
                setIsDeleteDialogOpen(true);
              }}
            >
              <Trash className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <AppLayout>
      <div>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Forms</h1>
            <p className="mt-1 text-sm text-gray-500">
              Create and manage your lead capture forms
            </p>
          </div>
          
          <Dialog open={isAddFormOpen} onOpenChange={setIsAddFormOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Form
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Create New Form</DialogTitle>
                <DialogDescription>
                  Create a new lead capture form. You can embed this form on your website or landing pages.
                </DialogDescription>
              </DialogHeader>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Form Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Summer Internship Form" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Brief description of the form's purpose"
                            {...field}
                            rows={3}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="active"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel>Active Status</FormLabel>
                          <div className="text-sm text-muted-foreground">
                            Activate this form to start collecting leads
                          </div>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <DialogFooter>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsAddFormOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit"
                      disabled={createFormMutation.isPending}
                    >
                      {createFormMutation.isPending ? "Creating..." : "Create Form"}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="mt-6">
          {isLoading ? (
            <div className="flex justify-center p-8">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : forms.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 border border-dashed rounded-lg">
              <FileText className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No forms yet</h3>
              <p className="text-gray-500 mb-4">Create your first form to start capturing leads</p>
              <Button onClick={() => setIsAddFormOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create First Form
              </Button>
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={forms}
              searchColumn="name"
              searchPlaceholder="Search forms..."
            />
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the form "{formToDelete?.name}"? This action cannot be undone.
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
              onClick={() => formToDelete && handleDeleteForm(formToDelete.id)}
              disabled={deleteFormMutation.isPending}
            >
              {deleteFormMutation.isPending ? "Deleting..." : "Delete Form"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
