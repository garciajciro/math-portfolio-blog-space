
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import AdminLoginCard from '@/components/admin/AdminLoginCard';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Check authentication status when user logs in
  useEffect(() => {
    const checkAuthStatus = async () => {
      if (!user) {
        setCheckingAuth(false);
        return;
      }
      
      console.log("User is logged in, redirecting to admin dashboard");
      // Update access timestamp
      localStorage.setItem('lastAuthAccess', Date.now().toString());
      // Redirect to requested path or admin dashboard
      const requestedPath = sessionStorage.getItem('requestedPath');
      if (requestedPath) {
        sessionStorage.removeItem('requestedPath');
        navigate(requestedPath, { replace: true });
      } else {
        navigate('/admin', { replace: true });
      }
    };
    
    checkAuthStatus();
  }, [user, navigate]);

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-portfolio-dark">
        <div className="animate-spin h-12 w-12 border-t-2 border-b-2 border-portfolio-orange rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-portfolio-dark px-4 relative">
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-portfolio-orange/20 to-portfolio-accent/10"></div>
      
      <Button 
        variant="outline" 
        onClick={() => navigate('/')} 
        className="absolute top-4 left-4 flex items-center gap-2 border-portfolio-orange/30 text-portfolio-orange hover:bg-portfolio-orange/10"
      >
        <ArrowLeft size={16} />
        Back to Home
      </Button>
      
      <AdminLoginCard
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        confirmPassword={confirmPassword}
        setConfirmPassword={setConfirmPassword}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
      />
    </div>
  );
};

export default AdminLogin;
