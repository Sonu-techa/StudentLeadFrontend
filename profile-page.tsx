import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PageTransition } from "@/components/ui/page-transition";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

// Schema for password update
const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Schema for username update
const usernameSchema = z.object({
  newUsername: z.string().min(3, "Username must be at least 3 characters"),
});

type PasswordFormValues = z.infer<typeof passwordSchema>;
type UsernameFormValues = z.infer<typeof usernameSchema>;

export default function ProfilePage() {
  const { toast } = useToast();
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [isUpdatingUsername, setIsUpdatingUsername] = useState(false);

  // Password form
  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Username form
  const usernameForm = useForm<UsernameFormValues>({
    resolver: zodResolver(usernameSchema),
    defaultValues: {
      newUsername: "",
    },
  });

  // Handle password update
  const onPasswordSubmit = async (values: PasswordFormValues) => {
    setIsUpdatingPassword(true);
    
    try {
      // Simulating API call - in a real implementation, this would be a call to your backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Success handling
      toast({
        title: "Password updated",
        description: "Your password has been successfully updated.",
      });
      
      // Reset form
      passwordForm.reset();
    } catch (error) {
      toast({
        title: "Error updating password",
        description: "There was a problem updating your password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  // Handle username update
  const onUsernameSubmit = async (values: UsernameFormValues) => {
    setIsUpdatingUsername(true);
    
    try {
      // Simulating API call - in a real implementation, this would be a call to your backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Success handling
      toast({
        title: "Username updated",
        description: "Your username has been successfully updated.",
      });
      
      // Reset form
      usernameForm.reset();
    } catch (error) {
      toast({
        title: "Error updating username",
        description: "There was a problem updating your username. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingUsername(false);
    }
  };

  return (
    <PageTransition>
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <h1 className="text-2xl font-bold mb-6">Account Settings</h1>
        
        <Tabs defaultValue="username" className="w-full">
          <TabsList className="grid grid-cols-2 w-full max-w-md mb-6">
            <TabsTrigger value="username">Username</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
          </TabsList>
          
          <TabsContent value="username">
            <Card>
              <CardHeader>
                <CardTitle>Change Username</CardTitle>
                <CardDescription>
                  Update your username. This will be used to log in to your account.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...usernameForm}>
                  <form onSubmit={usernameForm.handleSubmit(onUsernameSubmit)} className="space-y-6">
                    <FormField
                      control={usernameForm.control}
                      name="newUsername"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>New Username</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter new username" 
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            Your new username must be at least 3 characters long.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button 
                      type="submit" 
                      disabled={isUpdatingUsername}
                      className="w-full"
                    >
                      {isUpdatingUsername ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        "Update Username"
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="password">
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>
                  Update your password to keep your account secure.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...passwordForm}>
                  <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6">
                    <FormField
                      control={passwordForm.control}
                      name="currentPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Current Password</FormLabel>
                          <FormControl>
                            <Input 
                              type="password" 
                              placeholder="Enter current password" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={passwordForm.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>New Password</FormLabel>
                          <FormControl>
                            <Input 
                              type="password" 
                              placeholder="Enter new password" 
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            Your password must be at least 6 characters long.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={passwordForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm Password</FormLabel>
                          <FormControl>
                            <Input 
                              type="password" 
                              placeholder="Confirm new password" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      disabled={isUpdatingPassword}
                      className="w-full"
                    >
                      {isUpdatingPassword ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        "Update Password"
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageTransition>
  );
}