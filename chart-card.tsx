import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ChartCardProps {
  title: string;
  children: ReactNode;
  timeRangeOptions?: string[];
  onTimeRangeChange?: (value: string) => void;
  defaultTimeRange?: string;
  footer?: ReactNode;
}

export function ChartCard({
  title,
  children,
  timeRangeOptions,
  onTimeRangeChange,
  defaultTimeRange,
  footer,
}: ChartCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="px-5 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium leading-6 text-gray-900">{title}</CardTitle>
          {timeRangeOptions && onTimeRangeChange && (
            <div className="relative">
              <Select defaultValue={defaultTimeRange} onValueChange={onTimeRangeChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select time range" />
                </SelectTrigger>
                <SelectContent>
                  {timeRangeOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="px-5 py-3">
        <div className="chart-container min-h-[240px]">
          {children}
        </div>
      </CardContent>
      {footer && (
        <div className="border-t border-gray-200 px-5 py-3">
          {footer}
        </div>
      )}
    </Card>
  );
}
