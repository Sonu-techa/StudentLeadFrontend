import { useState } from "react";
import { PageTransition } from "@/components/ui/page-transition";
import { CampaignCard } from "@/components/ui/campaign-card";
import { exportToCSV, exportToExcel, formatFileSize, shareExport } from "@/lib/exportUtils";
import { useToast } from "@/hooks/use-toast";
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  MessageCircle, 
  Filter, 
  Plus,
  Search,
  Download,
  FileSpreadsheet,
  Linkedin,
  Ghost,
  Share2,
  Trash2,
  RefreshCw
} from "lucide-react";

// Types
type SocialPlatform = "facebook" | "instagram" | "twitter" | "whatsapp" | "telegram" | "linkedin" | "snapchat";
type CampaignStatus = "active" | "scheduled" | "completed" | "draft";

interface Campaign {
  id: number;
  name: string;
  status: CampaignStatus;
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
}

// Sample campaign data - focused on work-from-home and part-time jobs for 18-25 age group
const campaignData: Campaign[] = [
  {
    id: 1,
    name: "Work From Home - Data Entry Jobs",
    status: "active",
    startDate: "2025-05-01",
    endDate: "2025-06-30",
    message: "Earn ₹15,000-₹25,000 per month with flexible work-from-home data entry jobs. Only for age 18-25, 12th pass or above. Apply now to start your career from home!",
    platforms: ["facebook", "instagram", "whatsapp"],
    metrics: {
      impressions: 12542,
      clicks: 862,
      leads: 127,
      ctr: 0.069,
      conversionRate: 0.147,
    },
  },
  {
    id: 2,
    name: "Part-Time Digital Marketing Assistants",
    status: "active",
    startDate: "2025-04-15",
    endDate: "2025-07-15",
    message: "Looking for part-time work? Become a Digital Marketing Assistant and earn ₹8,000-₹15,000 for just 3-4 hours daily. Perfect for students aged 18-25. 12th pass required. Apply now!",
    platforms: ["facebook", "instagram", "twitter"],
    metrics: {
      impressions: 9560,
      clicks: 712,
      leads: 98,
      ctr: 0.074,
      conversionRate: 0.138,
    },
  },
  {
    id: 3,
    name: "Work-From-Home Customer Support",
    status: "active",
    startDate: "2025-04-10",
    endDate: "2025-05-30",
    message: "Join our customer support team and work from the comfort of your home. Earn ₹18,000-₹28,000 monthly. Age 18-25, graduates preferred. Training provided. Apply today!",
    platforms: ["facebook", "whatsapp", "telegram"],
    metrics: {
      impressions: 8245,
      clicks: 549,
      leads: 82,
      ctr: 0.067,
      conversionRate: 0.149,
    },
  },
  {
    id: 4,
    name: "Part-Time Content Writers",
    status: "scheduled",
    startDate: "2025-05-15",
    endDate: "2025-06-15",
    message: "Are you good with words? Join as a Part-Time Content Writer and earn ₹10,000-₹20,000 monthly. Work from anywhere, anytime! For age 18-25, 12th pass with good English skills.",
    platforms: ["instagram", "facebook", "twitter"],
    metrics: {
      impressions: 0,
      clicks: 0,
      leads: 0,
      ctr: 0,
      conversionRate: 0,
    },
  },
  {
    id: 5,
    name: "Weekend Part-Time Jobs",
    status: "draft",
    startDate: "2025-06-01",
    endDate: "2025-07-31",
    message: "Want to earn while studying? Weekend part-time jobs available across India. Earn ₹6,000-₹12,000 per month working only on weekends. For age 18-25, minimum 12th pass qualification.",
    platforms: ["facebook", "instagram", "whatsapp", "telegram"],
    metrics: {
      impressions: 0,
      clicks: 0,
      leads: 0,
      ctr: 0,
      conversionRate: 0,
    },
  },
  {
    id: 6,
    name: "Social Media Marketing Internship",
    status: "scheduled",
    startDate: "2025-05-20",
    endDate: "2025-08-20",
    message: "Learn social media marketing while earning! Join our 3-month internship program. Stipend: ₹10,000-₹15,000/month. For students aged 18-25 with good communication skills. Apply now!",
    platforms: ["linkedin", "snapchat", "instagram", "facebook"],
    metrics: {
      impressions: 0,
      clicks: 0,
      leads: 0,
      ctr: 0,
      conversionRate: 0,
    },
  },
];

// Lead data
interface Lead {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  age: number;
  education: string;
  city: string;
  state: string;
  source: SocialPlatform | "website" | "referral";
  jobType: string;
  createdAt: string;
  status: "new" | "contacted" | "qualified" | "not_qualified";
  score: number;
}

const leadsData: Lead[] = [
  {
    id: 1,
    fullName: "Ananya Sharma",
    email: "ananya.sharma@example.com",
    phone: "+91 98765 43210",
    age: 22,
    education: "Graduate",
    city: "Delhi",
    state: "Delhi",
    source: "facebook",
    jobType: "Work From Home - Data Entry",
    createdAt: "2025-05-02T09:30:00",
    status: "new",
    score: 85,
  },
  {
    id: 2,
    fullName: "Rajesh Kumar",
    email: "rajesh.kumar@example.com",
    phone: "+91 87654 32109",
    age: 19,
    education: "12th Pass",
    city: "Mumbai",
    state: "Maharashtra",
    source: "instagram",
    jobType: "Part Time - Digital Marketing",
    createdAt: "2025-05-03T14:15:00",
    status: "contacted",
    score: 72,
  },
  {
    id: 3,
    fullName: "Priya Patel",
    email: "priya.patel@example.com",
    phone: "+91 76543 21098",
    age: 21,
    education: "Graduate",
    city: "Ahmedabad",
    state: "Gujarat",
    source: "website",
    jobType: "Work From Home - Customer Support",
    createdAt: "2025-05-03T11:45:00",
    status: "qualified",
    score: 91,
  },
  {
    id: 4,
    fullName: "Amit Singh",
    email: "amit.singh@example.com",
    phone: "+91 65432 10987",
    age: 18,
    education: "12th Pass",
    city: "Jaipur",
    state: "Rajasthan",
    source: "twitter",
    jobType: "Part Time - Sales",
    createdAt: "2025-05-04T10:20:00",
    status: "new",
    score: 68,
  },
  {
    id: 5,
    fullName: "Neha Gupta",
    email: "neha.gupta@example.com",
    phone: "+91 54321 09876",
    age: 23,
    education: "Graduate",
    city: "Bengaluru",
    state: "Karnataka",
    source: "whatsapp",
    jobType: "Work From Home - Content Writing",
    createdAt: "2025-05-04T16:30:00",
    status: "contacted",
    score: 77,
  },
  {
    id: 6,
    fullName: "Vijay Reddy",
    email: "vijay.reddy@example.com",
    phone: "+91 43210 98765",
    age: 25,
    education: "12th Pass",
    city: "Hyderabad",
    state: "Telangana",
    source: "referral",
    jobType: "Part Time - Administrative",
    createdAt: "2025-05-05T09:15:00",
    status: "not_qualified",
    score: 45,
  },
  {
    id: 7,
    fullName: "Sneha Joshi",
    email: "sneha.joshi@example.com",
    phone: "+91 32109 87654",
    age: 20,
    education: "Diploma",
    city: "Pune",
    state: "Maharashtra",
    source: "facebook",
    jobType: "Work From Home - Digital Marketing",
    createdAt: "2025-05-05T13:45:00",
    status: "qualified",
    score: 88,
  },
  {
    id: 8,
    fullName: "Karan Verma",
    email: "karan.verma@example.com",
    phone: "+91 76543 87651",
    age: 22,
    education: "12th Pass",
    city: "Chandigarh",
    state: "Punjab",
    source: "instagram",
    jobType: "Part Time - Teaching/Tutoring",
    createdAt: "2025-05-05T15:30:00",
    status: "new",
    score: 75,
  },
  {
    id: 9,
    fullName: "Shreya Kapoor",
    email: "shreya.kapoor@example.com",
    phone: "+91 87654 12398",
    age: 19,
    education: "12th Pass",
    city: "Lucknow",
    state: "Uttar Pradesh",
    source: "whatsapp",
    jobType: "Work From Home - Data Entry",
    createdAt: "2025-05-06T10:15:00",
    status: "contacted",
    score: 82,
  },
  {
    id: 10,
    fullName: "Rohit Mehra",
    email: "rohit.mehra@example.com",
    phone: "+91 98234 56781",
    age: 24,
    education: "Graduate",
    city: "Chennai",
    state: "Tamil Nadu",
    source: "linkedin",
    jobType: "Work From Home - Digital Marketing",
    createdAt: "2025-05-06T11:30:00",
    status: "new",
    score: 78,
  },
  {
    id: 11,
    fullName: "Pooja Malhotra",
    email: "pooja.malhotra@example.com",
    phone: "+91 76598 23415",
    age: 20,
    education: "12th Pass",
    city: "Indore",
    state: "Madhya Pradesh",
    source: "snapchat",
    jobType: "Part Time - Content Creator",
    createdAt: "2025-05-06T14:20:00",
    status: "contacted",
    score: 69,
  },
];

// Platform stats
interface PlatformStat {
  name: SocialPlatform;
  impressions: number;
  clicks: number;
  leads: number;
  ctr: number;
  conversionRate: number;
  color: string;
  icon: JSX.Element;
}

const platformStats: PlatformStat[] = [
  {
    name: "facebook",
    impressions: 15200,
    clicks: 825,
    leads: 112,
    ctr: 0.054,
    conversionRate: 0.136,
    color: "bg-blue-600",
    icon: <Facebook className="w-5 h-5 text-blue-600" />,
  },
  {
    name: "instagram",
    impressions: 12450,
    clicks: 780,
    leads: 95,
    ctr: 0.063,
    conversionRate: 0.122,
    color: "bg-pink-500",
    icon: <Instagram className="w-5 h-5 text-pink-500" />,
  },
  {
    name: "twitter",
    impressions: 8320,
    clicks: 410,
    leads: 68,
    ctr: 0.049,
    conversionRate: 0.166,
    color: "bg-blue-400",
    icon: <Twitter className="w-5 h-5 text-blue-400" />,
  },
  {
    name: "whatsapp",
    impressions: 6540,
    clicks: 385,
    leads: 72,
    ctr: 0.059,
    conversionRate: 0.187,
    color: "bg-green-500",
    icon: <MessageCircle className="w-5 h-5 text-green-500" />,
  },
  {
    name: "telegram",
    impressions: 4210,
    clicks: 215,
    leads: 38,
    ctr: 0.051,
    conversionRate: 0.177,
    color: "bg-blue-500",
    icon: <MessageCircle className="w-5 h-5 text-blue-500" />,
  },
  {
    name: "linkedin",
    impressions: 5620,
    clicks: 315,
    leads: 45,
    ctr: 0.056,
    conversionRate: 0.143,
    color: "bg-blue-700",
    icon: <Linkedin className="w-5 h-5 text-blue-700" />,
  },
  {
    name: "snapchat",
    impressions: 3850,
    clicks: 190,
    leads: 25,
    ctr: 0.049,
    conversionRate: 0.132,
    color: "bg-yellow-400",
    icon: <Ghost className="w-5 h-5 text-yellow-400" />,
  },
];

// Export interface
interface LeadExport {
  id: number;
  fileName: string;
  filePath: string;
  fileType: string;
  createdAt: string;
  createdBy: number;
  downloadCount: number;
  fileSize: number;
  leadCount: number;
  filters: Record<string, any>;
}

// Sample export data
const exportData: LeadExport[] = [
  {
    id: 1,
    fileName: "leads-export-2025-05-06.csv",
    filePath: "/exports/leads/leads-export-2025-05-06.csv",
    fileType: "csv",
    createdAt: "2025-05-06T09:30:00",
    createdBy: 1,
    downloadCount: 3,
    fileSize: 24580,
    leadCount: 52,
    filters: { status: "all" }
  },
  {
    id: 2,
    fileName: "qualified-leads-2025-05-05.xlsx",
    filePath: "/exports/leads/qualified-leads-2025-05-05.xlsx",
    fileType: "excel",
    createdAt: "2025-05-05T14:15:00",
    createdBy: 1,
    downloadCount: 5,
    fileSize: 42310,
    leadCount: 34,
    filters: { status: "qualified" }
  },
  {
    id: 3,
    fileName: "facebook-leads-2025-05-04.csv",
    filePath: "/exports/leads/facebook-leads-2025-05-04.csv",
    fileType: "csv",
    createdAt: "2025-05-04T11:45:00",
    createdBy: 1,
    downloadCount: 2,
    fileSize: 18450,
    leadCount: 28,
    filters: { source: "facebook" }
  }
];

// Main component
export default function CampaignsPage() {
  const [activeTab, setActiveTab] = useState<"campaigns" | "leads" | "analytics" | "exports">("campaigns");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const { toast } = useToast();
  
  // Filter campaigns based on status
  const filteredCampaigns = filterStatus === "all" 
    ? campaignData 
    : campaignData.filter(campaign => campaign.status === filterStatus);

  return (
    <PageTransition>
      <div className="container mx-auto py-6 px-4 md:px-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Campaign Management</h1>
          <button className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-2 px-4 rounded-md hover:opacity-90 transition-opacity flex items-center gap-2">
            <Plus className="w-4 h-4" /> New Campaign
          </button>
        </div>
        
        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <ul className="flex flex-wrap -mb-px text-sm font-medium text-center">
            <li className="mr-2">
              <button 
                className={`inline-block p-4 rounded-t-lg ${activeTab === "campaigns" ? "border-b-2 border-indigo-500 text-indigo-600" : "hover:text-gray-600 hover:border-gray-300"}`}
                onClick={() => setActiveTab("campaigns")}
              >
                Campaigns
              </button>
            </li>
            <li className="mr-2">
              <button 
                className={`inline-block p-4 rounded-t-lg ${activeTab === "leads" ? "border-b-2 border-indigo-500 text-indigo-600" : "hover:text-gray-600 hover:border-gray-300"}`}
                onClick={() => setActiveTab("leads")}
              >
                Leads
              </button>
            </li>
            <li className="mr-2">
              <button 
                className={`inline-block p-4 rounded-t-lg ${activeTab === "analytics" ? "border-b-2 border-indigo-500 text-indigo-600" : "hover:text-gray-600 hover:border-gray-300"}`}
                onClick={() => setActiveTab("analytics")}
              >
                Analytics
              </button>
            </li>
            <li className="mr-2">
              <button 
                className={`inline-block p-4 rounded-t-lg ${activeTab === "exports" ? "border-b-2 border-indigo-500 text-indigo-600" : "hover:text-gray-600 hover:border-gray-300"}`}
                onClick={() => setActiveTab("exports")}
              >
                Exports
              </button>
            </li>
          </ul>
        </div>
        
        {/* Campaigns Tab Content */}
        {activeTab === "campaigns" && (
          <>
            <div className="flex justify-between items-center mb-6">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="w-4 h-4 text-gray-500" />
                </div>
                <input 
                  type="text" 
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
                  placeholder="Search campaigns"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <select 
                  className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="completed">Completed</option>
                  <option value="draft">Draft</option>
                </select>
                <button className="flex items-center gap-2 py-2.5 px-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200">
                  <Filter className="w-4 h-4" /> More Filters
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCampaigns.map((campaign) => (
                <CampaignCard
                  key={campaign.id}
                  id={campaign.id}
                  name={campaign.name}
                  status={campaign.status}
                  startDate={campaign.startDate}
                  endDate={campaign.endDate}
                  message={campaign.message}
                  platforms={campaign.platforms}
                  metrics={campaign.metrics}
                />
              ))}
            </div>
          </>
        )}
        
        {/* Leads Tab Content */}
        {activeTab === "leads" && (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-4 flex justify-between items-center border-b">
              <h2 className="text-lg font-semibold">Latest Leads</h2>
              <div className="flex items-center gap-2">
                <select className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2">
                  <option value="all">All Sources</option>
                  <option value="facebook">Facebook</option>
                  <option value="instagram">Instagram</option>
                  <option value="twitter">Twitter</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="telegram">Telegram</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="snapchat">Snapchat</option>
                  <option value="website">Website</option>
                  <option value="referral">Referral</option>
                </select>
                <div className="relative">
                  <div className="dropdown">
                    <button 
                      className="py-2 px-4 text-sm font-medium text-white bg-indigo-500 rounded-lg hover:bg-indigo-600 flex items-center gap-2"
                      onClick={(e) => {
                        e.preventDefault();
                        const dropdown = e.currentTarget.nextElementSibling;
                        if (dropdown) {
                          dropdown.classList.toggle('hidden');
                        }
                      }}
                      type="button"
                    >
                      <Download className="w-4 h-4" /> Export Leads
                    </button>
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg hidden z-20">
                      <div className="py-1">
                        <button 
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                          onClick={(e) => {
                            e.preventDefault();
                            exportToCSV(leadsData);
                            (e.currentTarget.parentElement?.parentElement as HTMLElement)?.classList.add('hidden');
                          }}
                          type="button"
                        >
                          <Download className="w-4 h-4" /> Export as CSV
                        </button>
                        <button 
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                          onClick={(e) => {
                            e.preventDefault();
                            exportToExcel(leadsData);
                            (e.currentTarget.parentElement?.parentElement as HTMLElement)?.classList.add('hidden');
                          }}
                          type="button"
                        >
                          <FileSpreadsheet className="w-4 h-4" /> Export as Excel
                        </button>
                        <div className="border-t border-gray-100 my-1"></div>
                        <div className="px-4 py-1 text-xs text-gray-500">After export:</div>
                        <div className="text-center px-4 py-1 text-xs text-gray-600">
                          You'll be able to open or share the file directly from the export notification.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <button 
                  className="py-2 px-4 text-sm font-medium text-indigo-600 bg-white border border-indigo-500 rounded-lg hover:bg-indigo-50 flex items-center gap-2"
                  onClick={() => window.open("#/new-lead", "_blank")}
                >
                  <Plus className="w-4 h-4" /> Add Lead
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age/Education</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Type</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {leadsData.map((lead) => (
                    <tr key={lead.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{lead.fullName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{lead.email}</div>
                        <div className="text-sm text-gray-500">{lead.phone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{lead.age} years</div>
                        <div className="text-sm text-gray-500">{lead.education}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          lead.source === 'facebook' ? 'bg-blue-100 text-blue-800' :
                          lead.source === 'instagram' ? 'bg-pink-100 text-pink-800' :
                          lead.source === 'twitter' ? 'bg-blue-100 text-blue-800' :
                          lead.source === 'whatsapp' ? 'bg-green-100 text-green-800' :
                          lead.source === 'telegram' ? 'bg-blue-100 text-blue-800' :
                          lead.source === 'linkedin' ? 'bg-blue-200 text-blue-900' :
                          lead.source === 'snapchat' ? 'bg-yellow-100 text-yellow-800' :
                          lead.source === 'website' ? 'bg-purple-100 text-purple-800' :
                          'bg-orange-100 text-orange-800'
                        }`}>
                          {lead.source.charAt(0).toUpperCase() + lead.source.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {lead.jobType}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          lead.status === 'new' ? 'bg-blue-100 text-blue-800' :
                          lead.status === 'contacted' ? 'bg-yellow-100 text-yellow-800' :
                          lead.status === 'qualified' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm font-medium ${
                          lead.score >= 80 ? 'text-green-600' :
                          lead.score >= 60 ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {lead.score}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {/* Exports Tab Content */}
        {activeTab === "exports" && (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-4 flex justify-between items-center border-b">
              <h2 className="text-lg font-semibold">Lead Exports</h2>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <div className="dropdown">
                    <button 
                      className="py-2 px-4 text-sm font-medium text-white bg-indigo-500 rounded-lg hover:bg-indigo-600 flex items-center gap-2"
                      onClick={(e) => {
                        const dropdown = e.currentTarget.nextElementSibling;
                        if (dropdown) {
                          dropdown.classList.toggle('hidden');
                        }
                      }}
                    >
                      <Download className="w-4 h-4" /> New Export
                    </button>
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg hidden z-20">
                      <div className="py-1">
                        <button 
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                          onClick={() => {
                            exportToCSV(leadsData);
                            toast({
                              title: "Export started",
                              description: "Your CSV export is being generated",
                            });
                          }}
                        >
                          <Download className="w-4 h-4" /> Export as CSV
                        </button>
                        <button 
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                          onClick={() => {
                            exportToExcel(leadsData);
                            toast({
                              title: "Export started",
                              description: "Your Excel export is being generated",
                            });
                          }}
                        >
                          <FileSpreadsheet className="w-4 h-4" /> Export as Excel
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <button 
                  className="flex items-center gap-2 py-2 px-4 text-sm font-medium border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50"
                  onClick={() => {
                    toast({
                      title: "Refreshing exports",
                      description: "Getting the latest export data",
                    });
                  }}
                >
                  <RefreshCw className="w-4 h-4" /> Refresh
                </button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">File Name</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Leads</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Downloads</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {exportData.map((exportItem) => (
                    <tr key={exportItem.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{exportItem.fileName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          exportItem.fileType === 'csv' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {exportItem.fileType.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(exportItem.createdAt).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(exportItem.createdAt).toLocaleTimeString()}
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
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              window.open(`/api/exports/download/${exportItem.id}`, '_blank');
                              toast({
                                title: "Download started",
                                description: `Downloading ${exportItem.fileName}`,
                              });
                            }}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              shareExport(exportItem.id);
                              toast({
                                title: "Share enabled",
                                description: "Export link copied to clipboard",
                              });
                            }}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Share2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm('Are you sure you want to delete this export?')) {
                                toast({
                                  title: "Export deleted",
                                  description: `${exportItem.fileName} has been deleted`,
                                });
                              }
                            }}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {/* Analytics Tab Content */}
        {activeTab === "analytics" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="text-sm font-medium text-gray-500 mb-1">Total Impressions</div>
                <div className="text-3xl font-bold">46,720</div>
                <div className="text-sm text-green-600 mt-2">+12.8% from last month</div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="text-sm font-medium text-gray-500 mb-1">Total Clicks</div>
                <div className="text-3xl font-bold">2,615</div>
                <div className="text-sm text-green-600 mt-2">+8.4% from last month</div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="text-sm font-medium text-gray-500 mb-1">Total Leads</div>
                <div className="text-3xl font-bold">385</div>
                <div className="text-sm text-green-600 mt-2">+15.2% from last month</div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="text-sm font-medium text-gray-500 mb-1">Conversion Rate</div>
                <div className="text-3xl font-bold">14.7%</div>
                <div className="text-sm text-green-600 mt-2">+2.3% from last month</div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold">Platform Performance</h3>
                <p className="text-sm text-gray-500 mt-1">
                  All campaigns are free of cost to run. No ad spend is required.
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Platform</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Impressions</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clicks</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CTR</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Leads</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Conv. Rate</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {platformStats.map((platform) => (
                      <tr key={platform.name} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center bg-gray-100">
                              {platform.icon}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {platform.name.charAt(0).toUpperCase() + platform.name.slice(1)}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {platform.impressions.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {platform.clicks.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {(platform.ctr * 100).toFixed(2)}%
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {platform.leads.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {(platform.conversionRate * 100).toFixed(2)}%
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Active
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  );
}