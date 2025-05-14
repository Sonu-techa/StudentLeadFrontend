import { useState } from "react";
import { PageTransition } from "@/components/ui/page-transition";

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  age: string;
  education: string;
  city: string;
  state: string;
  source: string;
  jobType: string;
}

interface LeadFormProps {
  campaignId?: number;
  source?: string;
  onSubmit?: (data: FormData) => void;
  inline?: boolean;
}

const educationOptions = [
  "12th Pass",
  "Diploma",
  "Undergraduate",
  "Graduate",
  "Post-Graduate",
  "Others"
];

const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", 
  "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", 
  "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", 
  "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", 
  "Delhi", "Lakshadweep", "Puducherry"
];

const jobTypeOptions = [
  "Work From Home - Data Entry",
  "Work From Home - Customer Support",
  "Work From Home - Content Writing",
  "Work From Home - Digital Marketing",
  "Part Time - Sales",
  "Part Time - Marketing",
  "Part Time - Administrative",
  "Part Time - Teaching/Tutoring"
];

export default function LeadForm({ campaignId, source = "website", onSubmit, inline = false }: LeadFormProps) {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phone: "",
    age: "",
    education: "",
    city: "",
    state: "",
    source: source,
    jobType: "",
  });
  
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is changed
    if (errors[name as keyof FormData]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name as keyof FormData];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    
    // Required fields
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = "Invalid email format";
    
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    else if (!/^(\+91[\-\s]?)?[0]?(91)?[6789]\d{9}$/.test(formData.phone)) 
      newErrors.phone = "Enter a valid Indian phone number";
    
    if (!formData.age.trim()) newErrors.age = "Age is required";
    else {
      const age = parseInt(formData.age);
      if (isNaN(age) || age < 18 || age > 25) newErrors.age = "Age must be between 18-25";
    }
    
    if (!formData.education) newErrors.education = "Education is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.state) newErrors.state = "State is required";
    if (!formData.jobType) newErrors.jobType = "Job type preference is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Here you would typically submit to your API
      console.log("Form data submitted:", formData);
      
      if (onSubmit) {
        onSubmit(formData);
      }
      
      // Reset form and show success message
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        age: "",
        education: "",
        city: "",
        state: "",
        source: source,
        jobType: "",
      });
      
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 5000);
    }
  };

  const formContent = (
    <form onSubmit={handleSubmit} className={inline ? "" : "max-w-md mx-auto p-6 bg-white rounded-lg shadow-md"}>
      {!inline && <h2 className="text-2xl font-bold mb-6 text-center">Apply for Work-From-Home Jobs</h2>}
      
      <div className="space-y-4">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name *
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md ${errors.fullName ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Enter your full name"
          />
          {errors.fullName && <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>}
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Enter your email"
          />
          {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
        </div>
        
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number *
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Enter your phone number"
          />
          {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
        </div>
        
        <div>
          <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
            Age * (18-25 only)
          </label>
          <input
            type="number"
            id="age"
            name="age"
            min="18"
            max="25"
            value={formData.age}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md ${errors.age ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Enter your age"
          />
          {errors.age && <p className="mt-1 text-sm text-red-500">{errors.age}</p>}
        </div>
        
        <div>
          <label htmlFor="education" className="block text-sm font-medium text-gray-700 mb-1">
            Education Qualification *
          </label>
          <select
            id="education"
            name="education"
            value={formData.education}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md ${errors.education ? 'border-red-500' : 'border-gray-300'}`}
          >
            <option value="">Select your education</option>
            {educationOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
          {errors.education && <p className="mt-1 text-sm text-red-500">{errors.education}</p>}
        </div>
        
        <div>
          <label htmlFor="jobType" className="block text-sm font-medium text-gray-700 mb-1">
            Job Type Preference *
          </label>
          <select
            id="jobType"
            name="jobType"
            value={formData.jobType}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md ${errors.jobType ? 'border-red-500' : 'border-gray-300'}`}
          >
            <option value="">Select job type</option>
            {jobTypeOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
          {errors.jobType && <p className="mt-1 text-sm text-red-500">{errors.jobType}</p>}
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
              City *
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md ${errors.city ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Enter your city"
            />
            {errors.city && <p className="mt-1 text-sm text-red-500">{errors.city}</p>}
          </div>
          
          <div>
            <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
              State *
            </label>
            <select
              id="state"
              name="state"
              value={formData.state}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md ${errors.state ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value="">Select state</option>
              {indianStates.map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
            {errors.state && <p className="mt-1 text-sm text-red-500">{errors.state}</p>}
          </div>
        </div>
        
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-2 px-4 rounded-md hover:opacity-90 transition-opacity"
        >
          Submit Application
        </button>
        
        {submitted && (
          <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-md">
            Your application has been submitted successfully! We'll contact you soon.
          </div>
        )}
        
        <p className="text-xs text-gray-500 mt-4">
          * By submitting this form, you agree to our terms and conditions and privacy policy.
          Your information will be used only for job application purposes and won't be shared with third parties.
        </p>
      </div>
    </form>
  );

  if (inline) {
    return formContent;
  }

  return (
    <PageTransition>
      <div className="container mx-auto py-8 px-4">
        {formContent}
      </div>
    </PageTransition>
  );
}