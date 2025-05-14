import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center bg-background">
      <div className="space-y-6 max-w-[600px]">
        <h1 className="text-6xl font-bold text-primary">404</h1>
        <h2 className="text-2xl font-semibold">Page Not Found</h2>
        <p className="text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex justify-center space-x-4">
          <Button asChild variant="gradient">
            <Link href="/">
              Go to Dashboard
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/leads">
              View Leads
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}