import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PageTransition } from "@/components/ui/page-transition";
import { Button } from "@/components/ui/button";
import { Download, Share2, Trash2, RefreshCw, FileText, FileSpreadsheet, File } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { formatFileSize, getFileIcon, shareExport } from "@/lib/exportUtils";
import { apiRequest } from "@/lib/queryClient";
import { toast } from "@/hooks/use-toast";
import type { LeadExport } from "@shared/schema";

export default function ExportsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['/api/exports/leads', { page: currentPage, perPage: pageSize }],
    queryFn: async () => {
      const res = await fetch(`/api/exports/leads?page=${currentPage}&perPage=${pageSize}`);
      if (!res.ok) {
        throw new Error('Failed to fetch export history');
      }
      return res.json();
    }
  });

  const handleDelete = async (id: number) => {
    try {
      const res = await apiRequest('DELETE', `/api/exports/${id}`);
      
      if (!res.ok) {
        throw new Error('Failed to delete export');
      }
      
      toast({
        title: "Export deleted",
        description: "The export has been deleted successfully",
        variant: "default",
      });
      
      refetch();
    } catch (error) {
      console.error('Error deleting export:', error);
      toast({
        title: "Error",
        description: "Failed to delete export",
        variant: "destructive",
      });
    }
  };

  const handleDownload = async (id: number, fileName: string) => {
    try {
      const link = document.createElement('a');
      link.href = `/api/exports/download/${id}`;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Track download
      await apiRequest('POST', `/api/exports/${id}/track-download`, {});
      
      toast({
        title: "Download started",
        description: "Your file download has started",
        variant: "default",
      });
    } catch (error) {
      console.error('Error downloading file:', error);
      toast({
        title: "Error",
        description: "Failed to download file",
        variant: "destructive",
      });
    }
  };

  const handleShare = async (id: number) => {
    try {
      const success = await shareExport(id);
      
      if (success) {
        toast({
          title: "File shared",
          description: "The export link has been shared successfully",
          variant: "default",
        });
      } else {
        toast({
          title: "Share unavailable",
          description: "Sharing is not available on this device",
          variant: "default",
        });
      }
    } catch (error) {
      console.error('Error sharing file:', error);
      toast({
        title: "Error",
        description: "Failed to share file",
        variant: "destructive",
      });
    }
  };

  if (error) {
    return (
      <PageTransition>
        <div className="container mx-auto py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Error Loading Exports</h1>
            <p className="text-gray-600 mb-4">Failed to load export history. Please try again.</p>
            <Button variant="outline" onClick={() => refetch()}>
              <RefreshCw className="w-4 h-4 mr-2" /> Try Again
            </Button>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="container mx-auto py-6 px-4 md:px-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Export History</h1>
          <Button variant="outline" onClick={() => refetch()} disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} /> Refresh
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <RefreshCw className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        ) : (
          <>
            {data?.data?.length === 0 ? (
              <div className="bg-white shadow rounded-lg p-8 text-center">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">No exports found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  You haven't exported any leads yet. Go to the Leads page to create your first export.
                </p>
              </div>
            ) : (
              <div className="bg-white shadow overflow-hidden rounded-lg">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          File
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Created
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Size
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Leads
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Downloads
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {data?.data?.map((exportItem: LeadExport) => (
                        <tr key={exportItem.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-gray-100 rounded">
                                {exportItem.fileType === 'csv' ? (
                                  <FileText className="h-5 w-5 text-gray-600" />
                                ) : exportItem.fileType === 'excel' ? (
                                  <FileSpreadsheet className="h-5 w-5 text-green-600" />
                                ) : (
                                  <File className="h-5 w-5 text-gray-600" />
                                )}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {exportItem.fileName}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {exportItem.fileType.toUpperCase()}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {formatDistanceToNow(new Date(exportItem.createdAt), { addSuffix: true })}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatFileSize(exportItem.fileSize)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {exportItem.leadCount}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {exportItem.downloadCount}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDownload(exportItem.id, exportItem.fileName)}
                                title="Download"
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleShare(exportItem.id)}
                                title="Share"
                              >
                                <Share2 className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(exportItem.id)}
                                title="Delete"
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* Pagination */}
                {data?.meta?.totalPages > 1 && (
                  <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                    <div className="flex-1 flex justify-between sm:hidden">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(page => Math.max(page - 1, 1))}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(page => Math.min(page + 1, data.meta.totalPages))}
                        disabled={currentPage === data.meta.totalPages}
                      >
                        Next
                      </Button>
                    </div>
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm text-gray-700">
                          Showing <span className="font-medium">{((currentPage - 1) * pageSize) + 1}</span> to{' '}
                          <span className="font-medium">
                            {Math.min(currentPage * pageSize, data.meta.totalItems)}
                          </span>{' '}
                          of <span className="font-medium">{data.meta.totalItems}</span> results
                        </p>
                      </div>
                      <div>
                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                          <Button
                            variant="outline"
                            size="sm"
                            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                            onClick={() => setCurrentPage(page => Math.max(page - 1, 1))}
                            disabled={currentPage === 1}
                          >
                            <span className="sr-only">Previous</span>
                            &larr;
                          </Button>
                          {Array.from({ length: data.meta.totalPages }, (_, i) => i + 1).map(page => (
                            <Button
                              key={page}
                              variant={currentPage === page ? "default" : "outline"}
                              size="sm"
                              className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium hover:bg-gray-50"
                              onClick={() => setCurrentPage(page)}
                            >
                              {page}
                            </Button>
                          ))}
                          <Button
                            variant="outline"
                            size="sm"
                            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                            onClick={() => setCurrentPage(page => Math.min(page + 1, data.meta.totalPages))}
                            disabled={currentPage === data.meta.totalPages}
                          >
                            <span className="sr-only">Next</span>
                            &rarr;
                          </Button>
                        </nav>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </PageTransition>
  );
}