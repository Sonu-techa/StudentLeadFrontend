import { useState } from "react";
import { PageTransition } from "@/components/ui/page-transition";
import { CampaignForm } from "@/components/campaign-form";
import { Button } from "@/components/ui/button";
import { Link as WouterLink } from "wouter";
import { ArrowLeft } from "lucide-react";

export default function NewCampaignPage() {
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSuccess = () => {
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <PageTransition>
        <div className="container mx-auto py-8 px-4">
          <div className="max-w-3xl mx-auto rounded-lg bg-white p-8 shadow-sm">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
                <svg
                  className="h-10 w-10 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              </div>
              <h2 className="mt-6 text-3xl font-bold text-gray-900">
                Campaign Created Successfully!
              </h2>
              <p className="mt-2 text-gray-600">
                Your campaign has been created and saved successfully.
              </p>
            </div>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button 
                variant="outline" 
                onClick={() => setIsSuccess(false)}
              >
                Create Another Campaign
              </Button>
              <WouterLink href="/campaigns">
                <Button>View All Campaigns</Button>
              </WouterLink>
            </div>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center mb-6">
          <WouterLink href="/campaigns">
            <Button variant="ghost" size="sm" className="mr-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Campaigns
            </Button>
          </WouterLink>
          <h1 className="text-2xl font-bold">Create New Campaign</h1>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <CampaignForm onSuccess={handleSuccess} />
        </div>
      </div>
    </PageTransition>
  );
}