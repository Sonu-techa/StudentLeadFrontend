import { ReactNode } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  iconBgColor: string;
  trend?: {
    value: string;
    positive: boolean;
  };
  footerLink?: {
    text: string;
    href: string;
  };
}

export function StatsCard({
  title,
  value,
  icon,
  iconBgColor,
  trend,
  footerLink,
}: StatsCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-5">
        <div className="flex items-center">
          <div className={`flex-shrink-0 ${iconBgColor} rounded-md p-3`}>
            {icon}
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd className="flex items-baseline">
                <div className="text-2xl font-semibold text-gray-900">{value}</div>
                {trend && (
                  <div className={`ml-2 flex items-baseline text-sm font-semibold ${trend.positive ? 'text-green-600' : 'text-red-600'}`}>
                    {trend.positive ? (
                      <ArrowUpRight className="h-4 w-4" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4" />
                    )}
                    <span className="sr-only">{trend.positive ? 'Increased by' : 'Decreased by'}</span>
                    {trend.value}
                  </div>
                )}
              </dd>
            </dl>
          </div>
        </div>
      </CardContent>
      {footerLink && (
        <CardFooter className="bg-gray-50 px-5 py-3">
          <div className="text-sm">
            <a href={footerLink.href} className="font-medium text-primary-600 hover:text-primary-900">
              {footerLink.text}
            </a>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
