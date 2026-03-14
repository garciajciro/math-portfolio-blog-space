
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CardContent, CardFooter } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface AdminSignupFormProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  confirmPassword: string;
  setConfirmPassword: (confirmPassword: string) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
}

const AdminSignupForm = ({
  email,
  setEmail,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  isLoading,
  setIsLoading
}: AdminSignupFormProps) => {
  const { signUp } = useAuth();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !confirmPassword) {
      toast.error("Missing fields", {
        description: "Please fill in all required fields."
      });
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Password mismatch", {
        description: "Passwords do not match. Please try again."
      });
      return;
    }
    
    try {
      setIsLoading(true);
      const data = await signUp(email, password);
      setIsLoading(false);
    } catch (error) {
      // Error is handled in signUp function
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignUp}>
      <CardContent className="space-y-4 pt-5">
        <div className="space-y-2">
          <Label htmlFor="email-signup">Email</Label>
          <Input
            id="email-signup"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-card/50 border-primary/20 focus:border-primary"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password-signup">Password</Label>
          <Input
            id="password-signup"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="bg-card/50 border-primary/20 focus:border-primary"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirm-password">Confirm Password</Label>
          <Input
            id="confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="bg-card/50 border-primary/20 focus:border-primary"
          />
        </div>
      </CardContent>
      <CardFooter>
        {/* <Button 
          type="submit" 
          className="w-full bg-primary text-white hover:bg-secondary transition-all" 
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating account...
            </>
          ) : (
            'Register'
          )}
        </Button> */}
      </CardFooter>
    </form>
  );
};

export default AdminSignupForm;
