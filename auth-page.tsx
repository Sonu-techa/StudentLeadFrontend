import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Redirect, useLocation } from "wouter";
import { Loader2 } from "lucide-react";

// Handle login directly with fetch for now to debug
// We'll add back useAuth later
export default function AuthPage() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");

  // State for loading indicators
  const [isLoginPending, setIsLoginPending] = useState(false);
  const [isRegisterPending, setIsRegisterPending] = useState(false);
  const [user, setUser] = useState<null | {id: number}>(null);
  
  // Check if user is already logged in
  useEffect(() => {
    fetch('/api/user')
      .then(res => {
        if (res.ok) return res.json();
        return null;
      })
      .then(userData => {
        if (userData && userData.id) {
          setUser(userData);
        }
      })
      .catch(err => {
        console.error("Error checking auth status:", err);
      });
  }, []);
  
  // Redirect if already logged in
  if (user) {
    return <Redirect to="/" />;
  }

  // Direct login with fetch
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      return toast({
        title: "Error",
        description: "Username and password are required",
        variant: "destructive"
      });
    }

    try {
      setIsLoginPending(true);
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ username, password }),
      });
      
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        setLocation("/");
        toast({
          title: "Login successful",
          description: `Welcome back, ${userData.fullName || userData.username}!`,
        });
      } else {
        const errorData = await response.text();
        toast({
          title: "Login failed",
          description: errorData || "Invalid username or password",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsLoginPending(false);
    }
  };

  // Direct register with fetch
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password || !confirmPassword) {
      return toast({
        title: "Error",
        description: "All required fields must be filled",
        variant: "destructive"
      });
    }

    if (password !== confirmPassword) {
      return toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive"
      });
    }

    try {
      setIsRegisterPending(true);
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ 
          username, 
          password,
          fullName: fullName || undefined,
          email: email || undefined
        }),
      });
      
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        setLocation("/");
        toast({
          title: "Registration successful",
          description: `Welcome, ${userData.fullName || userData.username}!`,
        });
      } else {
        const errorData = await response.text();
        toast({
          title: "Registration failed",
          description: errorData || "Could not create account",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Registration failed",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsRegisterPending(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Form Section */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
              StudentLeadPro
            </h1>
            <p className="text-gray-600 mt-2">
              {isLogin ? "Sign in to your account" : "Create a new account"}
            </p>
          </div>

          {isLogin ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button 
                type="submit"
                className="w-full"
                disabled={isLoginPending}
              >
                {isLoginPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username <span className="text-red-500">*</span></Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Choose a username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password <span className="text-red-500">*</span></Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password <span className="text-red-500">*</span></Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <Button 
                type="submit"
                className="w-full"
                disabled={isRegisterPending}
              >
                {isRegisterPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create account"
                )}
              </Button>
            </form>
          )}

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              {isLogin
                ? "Don't have an account? Sign up"
                : "Already have an account? Sign in"}
            </button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-blue-500 to-blue-700 justify-center items-center">
        <div className="p-12 max-w-md text-white">
          <h2 className="text-3xl font-bold mb-6">
            Student Lead Management Platform
          </h2>
          <p className="mb-8">
            Track, manage, and convert student leads efficiently with our comprehensive 
            lead management platform. Automate your marketing campaigns and maximize 
            conversion rates.
          </p>
          <ul className="space-y-3">
            <li className="flex items-start">
              <svg
                className="h-6 w-6 mr-2 text-blue-200"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M5 13l4 4L19 7" />
              </svg>
              Lead scoring and prioritization
            </li>
            <li className="flex items-start">
              <svg
                className="h-6 w-6 mr-2 text-blue-200"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M5 13l4 4L19 7" />
              </svg>
              Social media campaign management
            </li>
            <li className="flex items-start">
              <svg
                className="h-6 w-6 mr-2 text-blue-200"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M5 13l4 4L19 7" />
              </svg>
              Real-time analytics and reporting
            </li>
            <li className="flex items-start">
              <svg
                className="h-6 w-6 mr-2 text-blue-200"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M5 13l4 4L19 7" />
              </svg>
              Custom lead forms and landing pages
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}