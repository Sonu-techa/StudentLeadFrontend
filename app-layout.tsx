import { useState, ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { Menu, Search, Bell, HelpCircle, ChevronDown, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const navItems = [
    { icon: "dashboard", label: "Dashboard", path: "/" },
    { icon: "people", label: "Leads", path: "/leads" },
    { icon: "campaign", label: "Campaigns", path: "/campaigns" },
    { icon: "article", label: "Forms", path: "/forms" },
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-64 flex-col fixed inset-y-0 z-10 border-r border-gray-200 bg-white">
        <div className="flex items-center justify-center h-16 border-b border-gray-200">
          <h1 className="text-xl font-bold text-primary">StudentLeadPro</h1>
        </div>

        <div className="flex flex-col justify-between flex-1 overflow-y-auto pt-5 pb-4">
          <nav className="flex-1 px-3 space-y-2">
            {navItems.map((item) => (
              <Link key={item.path} href={item.path}>
                <a
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    location === item.path
                      ? "bg-primary-50 text-primary"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <span className="material-icons text-lg mr-3">
                    {item.icon}
                  </span>
                  {item.label}
                </a>
              </Link>
            ))}

            <div className="pt-4">
              <div className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Settings
              </div>
              <Link href="/settings">
                <a className="mt-1 group flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100">
                  <span className="material-icons text-lg mr-3">settings</span>
                  Settings
                </a>
              </Link>
            </div>
          </nav>

          <div className="px-3 pb-3">
            <div className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700">
              <img
                className="h-8 w-8 rounded-full mr-3"
                src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt="User avatar"
              />
              <div>
                <p className="font-medium">{user?.username || "User"}</p>
                <p className="text-xs text-gray-500">Admin</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="left" className="p-0">
          <div className="flex items-center justify-between h-16 border-b border-gray-200 px-4">
            <h1 className="text-xl font-bold text-primary">StudentLeadPro</h1>
          </div>
          <nav className="flex-1 px-3 space-y-2 pt-5 pb-4">
            {navItems.map((item) => (
              <Link key={item.path} href={item.path}>
                <a
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    location === item.path
                      ? "bg-primary-50 text-primary"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="material-icons text-lg mr-3">
                    {item.icon}
                  </span>
                  {item.label}
                </a>
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>

      {/* Main content */}
      <div className="flex flex-col flex-1 w-full md:pl-64">
        {/* Top navigation */}
        <header className="sticky top-0 z-10 md:z-30 bg-white border-b border-gray-200">
          <div className="px-4 py-3 sm:px-6">
            <div className="flex items-center justify-between">
              <div className="md:hidden">
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </SheetTrigger>
              </div>
              <div className="relative flex-1 md:ml-0 md:mr-6 max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2"
                  placeholder="Search leads, campaigns..."
                />
              </div>
              <div className="flex items-center">
                <Button variant="ghost" size="icon">
                  <Bell className="h-5 w-5" />
                  <span className="sr-only">Notifications</span>
                </Button>
                <Button variant="ghost" size="icon" className="ml-3">
                  <HelpCircle className="h-5 w-5" />
                  <span className="sr-only">Help</span>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="ml-3">
                      <ChevronDown className="h-5 w-5" />
                      <span className="sr-only">User menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-50">{children}</main>
      </div>
    </div>
  );
}
