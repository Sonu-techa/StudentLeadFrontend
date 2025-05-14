import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Filter, Search, X } from "lucide-react";
import { format } from "date-fns";

interface LeadFiltersProps {
  onFilter: (filters: {
    search?: string;
    source?: string;
    status?: string;
    dateRange?: {
      from?: string;
      to?: string;
    };
  }) => void;
}

const sourceOptions = [
  { label: "All Sources", value: "all" },
  { label: "Website", value: "website" },
  { label: "Landing Page", value: "landing_page" },
  { label: "Facebook", value: "facebook" },
  { label: "Instagram", value: "instagram" },
  { label: "Twitter", value: "twitter" },
  { label: "WhatsApp", value: "whatsapp" },
  { label: "Telegram", value: "telegram" },
  { label: "College", value: "college" },
  { label: "Referral", value: "referral" },
  { label: "Other", value: "other" },
];

const statusOptions = [
  { label: "All Statuses", value: "all" },
  { label: "New", value: "new" },
  { label: "Contacted", value: "contacted" },
  { label: "Qualified", value: "qualified" },
  { label: "Not Qualified", value: "not_qualified" },
];

export function LeadFilters({ onFilter }: LeadFiltersProps) {
  const [search, setSearch] = useState("");
  const [source, setSource] = useState("all");
  const [status, setStatus] = useState("all");
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined);
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleSourceChange = (value: string) => {
    setSource(value);
  };

  const handleStatusChange = (value: string) => {
    setStatus(value);
  };

  const handleDateChange = (range: { from?: Date; to?: Date }) => {
    setDateFrom(range.from);
    setDateTo(range.to);
  };

  const handleClearFilters = () => {
    setSearch("");
    setSource("all");
    setStatus("all");
    setDateFrom(undefined);
    setDateTo(undefined);
    
    onFilter({});
  };

  const handleApplyFilters = () => {
    onFilter({
      search: search || undefined,
      source: source !== "all" ? source : undefined,
      status: status !== "all" ? status : undefined,
      dateRange: {
        from: dateFrom ? format(dateFrom, "yyyy-MM-dd") : undefined,
        to: dateTo ? format(dateTo, "yyyy-MM-dd") : undefined,
      },
    });
    
    setIsDatePickerOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search leads..."
            className="pl-8 w-full sm:w-[300px]"
            value={search}
            onChange={handleSearchChange}
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Select value={source} onValueChange={handleSourceChange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Source" />
            </SelectTrigger>
            <SelectContent>
              {sourceOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={status} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[140px] justify-start text-left font-normal">
                <Filter className="mr-2 h-4 w-4" />
                {dateFrom && dateTo ? (
                  <span>
                    {format(dateFrom, "MMM d")} - {format(dateTo, "MMM d")}
                  </span>
                ) : (
                  <span>Date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <div className="p-3 border-b">
                <Label className="text-xs font-medium">Date Range</Label>
                <div className="flex gap-2 mt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const today = new Date();
                      const weekAgo = new Date();
                      weekAgo.setDate(today.getDate() - 7);
                      setDateFrom(weekAgo);
                      setDateTo(today);
                    }}
                  >
                    Last 7 days
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const today = new Date();
                      const monthAgo = new Date();
                      monthAgo.setMonth(today.getMonth() - 1);
                      setDateFrom(monthAgo);
                      setDateTo(today);
                    }}
                  >
                    Last 30 days
                  </Button>
                </div>
              </div>
              <Calendar
                mode="range"
                selected={{
                  from: dateFrom,
                  to: dateTo,
                }}
                onSelect={handleDateChange}
                numberOfMonths={2}
                className="p-3"
              />
              <div className="flex items-center justify-end gap-2 p-3 border-t">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setDateFrom(undefined);
                    setDateTo(undefined);
                  }}
                >
                  Clear
                </Button>
                <Button size="sm" onClick={handleApplyFilters}>
                  Apply
                </Button>
              </div>
            </PopoverContent>
          </Popover>
          
          <Button variant="ghost" onClick={handleClearFilters}>
            <X className="h-4 w-4 mr-2" />
            Clear Filters
          </Button>
          
          <Button onClick={handleApplyFilters}>Apply Filters</Button>
        </div>
      </div>
    </div>
  );
}
