import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  MessageCircle, 
  ChevronRight,
  Edit,
  Linkedin,
  Ghost
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

type SocialPlatform = "facebook" | "instagram" | "twitter" | "whatsapp" | "telegram" | "linkedin" | "snapchat";

type CampaignCardProps = {
  id: number;
  name: string;
  status: string;
  startDate: string;
  endDate: string;
  message: string;
  platforms: SocialPlatform[];
  metrics: {
    impressions: number;
    clicks: number;
    leads: number;
    ctr: number;
    conversionRate: number;
  };
};

// Icon components mapped to platform names
const platformIcons = {
  facebook: <Facebook className="w-5 h-5 text-blue-600" />,
  instagram: <Instagram className="w-5 h-5 text-pink-500" />,
  twitter: <Twitter className="w-5 h-5 text-blue-400" />,
  whatsapp: <MessageCircle className="w-5 h-5 text-green-500" />,
  telegram: <MessageCircle className="w-5 h-5 text-blue-500" />,
  linkedin: <Linkedin className="w-5 h-5 text-blue-700" />,
  snapchat: <Ghost className="w-5 h-5 text-yellow-400" />,
};

// Helper function to format numbers
const formatNumber = (num: number): string => {
  return num >= 1000 ? `${(num / 1000).toFixed(1)}k` : num.toString();
};

// Status color mapping
const statusColors: Record<string, string> = {
  active: "bg-green-500",
  scheduled: "bg-blue-500",
  completed: "bg-gray-500",
  draft: "bg-yellow-500",
};

export function CampaignCard({
  id,
  name,
  status,
  startDate,
  endDate,
  message,
  platforms,
  metrics,
}: CampaignCardProps) {
  // Initialize state from localStorage if available
  const getSavedState = () => {
    try {
      const campaignStates = JSON.parse(localStorage.getItem('campaignStates') || '{}');
      return campaignStates[id] !== undefined ? campaignStates[id] : status.toLowerCase() === "active";
    } catch (error) {
      console.error("Error loading campaign state:", error);
      return status.toLowerCase() === "active";
    }
  };
  
  const [isActive, setIsActive] = useState(getSavedState());
  const [currentStatus, setCurrentStatus] = useState(isActive ? "active" : "draft");
  
  // Toggle campaign status with persistent storage
  const toggleCampaign = () => {
    const newStatus = isActive ? "draft" : "active";
    const newIsActive = !isActive;
    setIsActive(newIsActive);
    setCurrentStatus(newStatus);
    
    // Store campaign status in localStorage for persistence
    try {
      const campaignStates = JSON.parse(localStorage.getItem('campaignStates') || '{}');
      campaignStates[id] = newIsActive;
      localStorage.setItem('campaignStates', JSON.stringify(campaignStates));
      console.log(`Campaign ${id} status changed to ${newStatus} and saved to storage`);
    } catch (error) {
      console.error("Error saving campaign state:", error);
    }
  };
  
  const statusColor = statusColors[currentStatus] || "bg-gray-500";

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold">{name}</CardTitle>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg">
              <span className="text-xs text-slate-600 font-medium mr-1">{isActive ? "ON" : "OFF"}</span>
              <Switch 
                checked={isActive} 
                onCheckedChange={toggleCampaign}
                className="data-[state=checked]:bg-green-600 data-[state=unchecked]:bg-slate-300"
              />
            </div>
            <Badge className={`${statusColor} capitalize`}>{currentStatus}</Badge>
          </div>
        </div>
        <CardDescription>
          {new Date(startDate).toLocaleDateString()} - {new Date(endDate).toLocaleDateString()}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm text-gray-600 line-clamp-2 mb-4">{message}</p>
        
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span>Impressions</span>
            <span className="font-semibold">{formatNumber(metrics.impressions)}</span>
          </div>
          <Progress value={Math.min(metrics.impressions / 100, 100)} className="h-2" />
          
          <div className="flex justify-between text-sm">
            <span>CTR</span>
            <span className="font-semibold">{(metrics.ctr * 100).toFixed(1)}%</span>
          </div>
          <Progress value={metrics.ctr * 100} className="h-2" />
          
          <div className="flex justify-between text-sm">
            <span>Leads Captured</span>
            <span className="font-semibold">{formatNumber(metrics.leads)}</span>
          </div>
          <Progress value={Math.min(metrics.leads / 10, 100)} className="h-2" />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-2 pb-3 items-center">
        <div className="flex gap-2">
          {platforms.map((platform) => (
            <div 
              key={platform} 
              className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100"
              title={platform.charAt(0).toUpperCase() + platform.slice(1)}
            >
              {platformIcons[platform]}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 px-2">
                <Edit className="h-3.5 w-3.5 mr-1" />
                Edit
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => console.log(`Edit campaign ${id}`)}>
                Edit Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={toggleCampaign}>
                {isActive ? "Turn Off Campaign" : "Turn On Campaign"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => console.log(`Duplicate campaign ${id}`)}>
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => console.log(`Delete campaign ${id}`)} className="text-red-600">
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button variant="ghost" size="sm" className="h-8 px-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50">
            View Details
            <ChevronRight className="h-3.5 w-3.5 ml-1" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}