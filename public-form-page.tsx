import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckedState } from "@radix-ui/react-checkbox";

// Define form validation schema
const formSchema = z.object({
  fullName: z.string().min(3, { message: "Name must be at least 3 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().min(10, { message: "Phone number must be at least 10 digits" }),
  age: z.string().refine(val => {
    const age = parseInt(val);
    return age >= 18 && age <= 25;
  }, { message: "Age must be between 18 and 25 years" }),
  education: z.string().min(2, { message: "Please select your education level" }),
  city: z.string().min(2, { message: "City is required" }),
  state: z.string().min(2, { message: "State is required" }),
  jobType: z.string().min(2, { message: "Please select a job type" }),
  skills: z.array(z.string()).optional(),
  experience: z.string().optional(),
  availability: z.string().min(2, { message: "Please select your availability" }),
  source: z.string().min(2, { message: "Please select how you heard about us" }),
  agreeTerms: z.boolean().refine(val => val === true, {
    message: "You must agree to the terms and conditions",
  }),
});

type FormValues = z.infer<typeof formSchema>;

const educationOptions = [
  { value: "10th_pass", label: "10th Pass" },
  { value: "12th_pass", label: "12th Pass" },
  { value: "diploma", label: "Diploma" },
  { value: "undergraduate", label: "Undergraduate" },
  { value: "graduate", label: "Graduate" },
  { value: "postgraduate", label: "Post Graduate" },
];

const stateOptions = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", 
  "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", 
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", 
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", 
  "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", 
  "West Bengal"
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

const skillOptions = [
  { id: "typing", label: "Fast Typing" },
  { id: "excel", label: "MS Excel" },
  { id: "communication", label: "Communication Skills" },
  { id: "english", label: "English Proficiency" },
  { id: "writing", label: "Content Writing" },
  { id: "design", label: "Graphic Design" },
  { id: "social_media", label: "Social Media" },
];

const sourceOptions = [
  { value: "facebook", label: "Facebook" },
  { value: "instagram", label: "Instagram" },
  { value: "twitter", label: "Twitter" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "telegram", label: "Telegram" },
  { value: "website", label: "Website" },
  { value: "college", label: "College" },
  { value: "referral", label: "Referral" },
  { value: "other", label: "Other" },
];

export default function PublicFormPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      age: "",
      education: "",
      city: "",
      state: "",
      jobType: "",
      skills: [],
      experience: "",
      availability: "",
      source: "",
      agreeTerms: false,
    },
  });

  function onSubmit(values: FormValues) {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log(values);
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
              <svg className="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Application Submitted!</h2>
            <p className="mt-2 text-sm text-gray-600">
              Thank you for applying. We will review your application and contact you soon.
            </p>
          </div>
          <div className="mt-6">
            <div className="bg-blue-50 p-4 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd"></path>
                  </svg>
                </div>
                <div className="ml-3 flex-1 md:flex md:justify-between">
                  <p className="text-sm text-blue-700">
                    Expected salary range for this position is ₹15,000 - ₹20,000 per month
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6">
            <Button 
              onClick={() => setIsSuccess(false)}
              className="w-full"
            >
              Submit Another Application
            </Button>
            <div className="text-center mt-4">
              <a 
                href="#" 
                className="text-sm text-blue-600 hover:text-blue-800"
                onClick={(e) => {
                  e.preventDefault();
                  window.location.href = "/";
                }}
              >
                Return to Home
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            <span className="block">Apply for Work-From-Home & Part-Time Jobs</span>
            <span className="block text-indigo-600">For Students & Recent Graduates</span>
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Opportunities for age 18-25 with 12th pass and above qualifications.
            Earn ₹15,000 - ₹20,000 monthly with flexible hours.
          </p>
        </div>
        
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-lg leading-6 font-medium text-gray-900">Application Form</h2>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Fill in all the required fields to submit your application.</p>
          </div>
          
          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {/* Personal Information */}
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your Full Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="your.email@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="+91 9876543210" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="age"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Age (Must be 18-25)</FormLabel>
                        <FormControl>
                          <Input type="number" min="18" max="25" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="education"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Education Level</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your education level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {educationOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Minimum 12th pass required for most positions
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="sm:col-span-2 grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input placeholder="Your City" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select your state" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {stateOptions.map((state) => (
                                <SelectItem key={state} value={state.toLowerCase().replace(/\s+/g, '_')}>
                                  {state}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  {/* Job Preferences */}
                  <div className="sm:col-span-2">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Job Preferences</h3>
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="jobType"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-2">
                        <FormLabel>Preferred Job Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select job type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {jobTypeOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          All jobs offer ₹15,000-₹20,000 monthly salary range
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="skills"
                    render={() => (
                      <FormItem className="sm:col-span-2">
                        <div className="mb-4">
                          <FormLabel>Skills & Abilities</FormLabel>
                          <FormDescription>
                            Select all that apply
                          </FormDescription>
                        </div>
                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                          {skillOptions.map((skill) => (
                            <FormField
                              key={skill.id}
                              control={form.control}
                              name="skills"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={skill.id}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(skill.id)}
                                        onCheckedChange={(checked: CheckedState) => {
                                          const newValue = [...(field.value || [])];
                                          if (checked) {
                                            newValue.push(skill.id);
                                          } else {
                                            const index = newValue.indexOf(skill.id);
                                            if (index !== -1) {
                                              newValue.splice(index, 1);
                                            }
                                          }
                                          field.onChange(newValue);
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      {skill.label}
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
                  
                  <FormField
                    control={form.control}
                    name="experience"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-2">
                        <FormLabel>Relevant Experience (if any)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Briefly describe any previous work experience you have"
                            className="resize-none h-24"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          No previous experience is required for most positions
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="availability"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-2">
                        <FormLabel>Availability</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col sm:flex-row sm:space-x-4 space-y-1 sm:space-y-0"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="full_time" id="full_time" />
                              <Label htmlFor="full_time">Full-time (Work From Home)</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="part_time" id="part_time" />
                              <Label htmlFor="part_time">Part-time (10-20 hrs/week)</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="weekends" id="weekends" />
                              <Label htmlFor="weekends">Weekends Only</Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="source"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-2">
                        <FormLabel>How did you hear about us?</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select source" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {sourceOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="agreeTerms"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 sm:col-span-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            I agree to the terms and conditions
                          </FormLabel>
                          <FormDescription>
                            By checking this, you agree to our privacy policy and consent to be contacted about job opportunities.
                          </FormDescription>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="pt-5">
                  <div className="flex justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => form.reset()}
                      className="mr-3"
                    >
                      Reset Form
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Submitting..." : "Submit Application"}
                    </Button>
                  </div>
                </div>
              </form>
            </Form>
          </div>
        </div>
        
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>
            All information provided will be kept confidential and used only for recruitment purposes.
          </p>
        </div>
      </div>
    </div>
  );
}