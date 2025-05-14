import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Info } from "lucide-react";
import { CheckedState } from "@radix-ui/react-checkbox";
import { cn } from "@/lib/utils";

// Define form validation schema
const formSchema = z.object({
  name: z.string().min(5, { message: "Campaign name must be at least 5 characters" }),
  message: z.string().min(50, { message: "Message must be at least 50 characters" }).max(280, { message: "Message must not exceed 280 characters" }),
  startDate: z.date({
    required_error: "Start date is required",
  }),
  endDate: z.date({
    required_error: "End date is required",
  }),
  platforms: z.array(z.string()).min(1, { message: "Select at least one platform" }),
  isActive: z.boolean().default(false),
  targetAge: z.string().min(1, { message: "Target age is required" }),
  targetEducation: z.string().min(1, { message: "Target education is required" }),
  targetLocation: z.string().min(1, { message: "Target location is required" }),
  jobType: z.string().min(1, { message: "Job type is required" }),
  salary: z.string().min(1, { message: "Salary range is required" }),
});

type FormValues = z.infer<typeof formSchema>;

interface CampaignFormProps {
  onSuccess?: () => void;
  initialData?: Partial<FormValues>;
}

const platformOptions = [
  { id: "facebook", label: "Facebook" },
  { id: "instagram", label: "Instagram" },
  { id: "twitter", label: "Twitter (X)" },
  { id: "whatsapp", label: "WhatsApp" },
  { id: "telegram", label: "Telegram" },
];

const jobTypeOptions = [
  { value: "data_entry", label: "Work From Home - Data Entry" },
  { value: "customer_support", label: "Work From Home - Customer Support" },
  { value: "content_writing", label: "Work From Home - Content Writing" },
  { value: "digital_marketing", label: "Part Time - Digital Marketing" },
  { value: "teaching", label: "Part Time - Teaching/Tutoring" },
  { value: "sales", label: "Part Time - Sales" },
  { value: "admin", label: "Part Time - Administrative" },
];

const educationOptions = [
  { value: "12th_pass", label: "12th Pass & Above" },
  { value: "graduate", label: "Graduate & Above" },
  { value: "any", label: "Any Education (Min. 12th Pass)" },
];

const locationOptions = [
  { value: "all_india", label: "All India" },
  { value: "metro_cities", label: "Metro Cities Only" },
  { value: "tier_1", label: "Tier 1 Cities" },
  { value: "tier_2", label: "Tier 2 Cities" },
  { value: "custom", label: "Custom (Specify in message)" },
];

export function CampaignForm({ onSuccess, initialData }: CampaignFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Set default dates if not provided
  const today = new Date();
  const oneMonthLater = new Date();
  oneMonthLater.setMonth(today.getMonth() + 1);
  
  // Initialize form with default values or initial data
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      message: initialData?.message || "",
      startDate: initialData?.startDate || today,
      endDate: initialData?.endDate || oneMonthLater,
      platforms: initialData?.platforms || [],
      isActive: initialData?.isActive || false,
      targetAge: initialData?.targetAge || "18-25",
      targetEducation: initialData?.targetEducation || "12th_pass",
      targetLocation: initialData?.targetLocation || "all_india",
      jobType: initialData?.jobType || "data_entry",
      salary: initialData?.salary || "₹15,000 - ₹20,000 monthly",
    },
  });

  function onSubmit(values: FormValues) {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log(values);
      setIsSubmitting(false);
      if (onSuccess) {
        onSuccess();
      }
    }, 1500);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Campaign Information</h2>
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2 space-y-0">
                  <div className="space-y-0.5">
                    <FormLabel className="text-sm">Active</FormLabel>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="data-[state=checked]:bg-green-600"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Campaign Name</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="E.g., Work From Home - Data Entry Jobs (May 2025)" 
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  Give your campaign a clear and descriptive name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Start Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>End Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => 
                          date < new Date() || 
                          (form.getValues("startDate") && date < form.getValues("startDate"))
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="platforms"
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel>Platforms</FormLabel>
                  <FormDescription>
                    Select platforms to post this campaign
                  </FormDescription>
                </div>
                <div className="grid grid-cols-2 gap-2 md:grid-cols-5">
                  {platformOptions.map((platform) => (
                    <FormField
                      key={platform.id}
                      control={form.control}
                      name="platforms"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={platform.id}
                            className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(platform.id)}
                                onCheckedChange={(checked: CheckedState) => {
                                  const newValue = [...(field.value || [])];
                                  if (checked) {
                                    newValue.push(platform.id);
                                  } else {
                                    const index = newValue.indexOf(platform.id);
                                    if (index !== -1) {
                                      newValue.splice(index, 1);
                                    }
                                  }
                                  field.onChange(newValue);
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {platform.label}
                            </FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Job & Target Audience</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="jobType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Type</FormLabel>
                  <FormControl>
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      {...field}
                    >
                      {jobTypeOptions.map((option) => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="salary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Salary Range</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="₹15,000 - ₹20,000 monthly"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Recommended range: ₹15,000 - ₹20,000 monthly
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="targetAge"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target Age Group</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="18-25"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    The target audience should be 18-25 years old
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="targetEducation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target Education</FormLabel>
                  <FormControl>
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      {...field}
                    >
                      {educationOptions.map((option) => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="targetLocation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target Location</FormLabel>
                  <FormControl>
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      {...field}
                    >
                      {locationOptions.map((option) => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Campaign Message</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Earn ₹15,000-₹20,000 per month with flexible work-from-home data entry jobs. Only for age 18-25, 12th pass or above. Apply now to start your career!"
                    className="min-h-32 resize-none"
                    {...field}
                  />
                </FormControl>
                <FormDescription className="flex items-center justify-between">
                  <span>Write a compelling message (50-280 characters)</span>
                  <span className={`text-sm font-medium ${
                    field.value.length > 280 ? 'text-red-500' : 
                    field.value.length > 240 ? 'text-amber-500' : 
                    'text-gray-500'
                  }`}>
                    {field.value.length}/280
                  </span>
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="flex items-center p-4 bg-blue-50 rounded-md border border-blue-100">
          <Info className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0" />
          <p className="text-sm text-blue-700">
            All campaigns are <strong>free of cost</strong> to run. No ad spend is required to promote your jobs to potential candidates.
          </p>
        </div>
        
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Reset
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Campaign"}
          </Button>
        </div>
      </form>
    </Form>
  );
}