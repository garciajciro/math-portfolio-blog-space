
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

interface AdminLoginFormProps {
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
}

const AdminLoginForm = ({
  email,
  setEmail,
  password,
  setPassword,
  isLoading,
  setIsLoading
}: AdminLoginFormProps) => {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please enter both email and password');
      return;
    }
    
    try {
      setIsLoading(true);
      setErrorMessage('');
      
      sessionStorage.setItem('adminLoginAttempt', 'true');
      
      const { user, session } = await signIn(email, password);
      
      console.log("Login response:", { user, session });
      
      if (!user) {
        setErrorMessage('Login failed. Please check your credentials.');
        return;
      }

      // Successfully logged in
      toast.success('Login successful', { 
        description: 'Redirecting to admin dashboard...'
      });
      
      // Update the timestamp
      localStorage.setItem('lastAuthAccess', Date.now().toString());
      
      // Redirect to the requested path or admin dashboard
      const requestedPath = sessionStorage.getItem('requestedPath');
      if (requestedPath) {
        sessionStorage.removeItem('requestedPath');
        navigate(requestedPath, { replace: true });
      } else {
        navigate('/admin', { replace: true });
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setErrorMessage(error.message || 'An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6">
      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-3 text-sm">
          {errorMessage}
        </div>
      )}
      
      <div className="space-y-2">
        <label className="block text-sm font-semibold mb-1 text-portfolio-light">
          Email
        </label>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-portfolio-dark/80 text-portfolio-light border-portfolio-orange/20 focus:border-portfolio-orange focus:ring-portfolio-orange"
          placeholder="admin@example.com"
          required
        />
      </div>
      
      <div className="space-y-2">
        <label className="block text-sm font-semibold mb-1 text-portfolio-light">
          Password
        </label>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-portfolio-dark/80 text-portfolio-light border-portfolio-orange/20 focus:border-portfolio-orange focus:ring-portfolio-orange"
          placeholder="••••••••"
          required
        />
      </div>
      
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-portfolio-orange hover:bg-portfolio-accent text-white py-3 rounded-md transition duration-200 flex justify-center items-center"
      >
        {isLoading ? (
          <div className="flex items-center">
            <div className="h-5 w-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-3"></div>
            <span>Logging in...</span>
          </div>
        ) : (
          'Login to Admin Panel'
        )}
      </Button>
    </form>
  );
};

export default AdminLoginForm;
