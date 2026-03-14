
import { ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { appConfig } from '@/config/appConfig';
import { toast } from 'sonner';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, isLoading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // If authentication bypass is enabled, render children directly
    if (appConfig.bypassAdminAuth) {
      console.log("Auth bypassed due to config setting");
      setIsLoading(false);
      setHasAccess(true);
      return;
    }
    
    // If auth is still loading, wait
    if (authLoading) {
      return;
    }
    
    // If no user is logged in, redirect to login
    if (!user) {
      console.log("No user logged in, redirecting to login");
      // Store the requested path to redirect back after login
      sessionStorage.setItem('requestedPath', window.location.pathname);
      navigate('/admin/login', { replace: true });
      return;
    }
    
    // Check if user has recent authentication (within last 5 minutes for admin access)
    const lastAuthAccess = localStorage.getItem('lastAuthAccess');
    const now = Date.now();
    const fiveMinutes = 5 * 60 * 1000; // 5 minutes in milliseconds
    
    if (!lastAuthAccess || (now - parseInt(lastAuthAccess)) > fiveMinutes) {
      console.log("Authentication expired or missing, requiring re-login");
      // Clear old access timestamp
      localStorage.removeItem('lastAuthAccess');
      // Store the requested path to redirect back after login
      sessionStorage.setItem('requestedPath', window.location.pathname);
      toast.info("Please sign in again to access admin area");
      navigate('/admin/login', { replace: true });
      return;
    }
    
    // User is authenticated and has recent access, grant access
    console.log("User is authenticated with recent access, granting access");
    // Update the access timestamp
    localStorage.setItem('lastAuthAccess', Date.now().toString());
    setHasAccess(true);
    setIsLoading(false);
  }, [user, navigate, authLoading]);

  // Listen for page visibility changes to check auth when user returns to tab
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && user && !appConfig.bypassAdminAuth) {
        // When user returns to the tab, check if auth is still fresh
        const lastAuthAccess = localStorage.getItem('lastAuthAccess');
        const now = Date.now();
        const fiveMinutes = 5 * 60 * 1000;
        
        if (!lastAuthAccess || (now - parseInt(lastAuthAccess)) > fiveMinutes) {
          console.log("Auth expired while tab was hidden, requiring re-login");
          localStorage.removeItem('lastAuthAccess');
          sessionStorage.setItem('requestedPath', window.location.pathname);
          toast.info("Session expired. Please sign in again.");
          navigate('/admin/login', { replace: true });
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [user, navigate]);
  
  // Show loading state or render children if user is authenticated
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-portfolio-dark">
        <div className="animate-spin h-12 w-12 border-t-2 border-b-2 border-portfolio-orange rounded-full"></div>
      </div>
    );
  }

  return hasAccess || appConfig.bypassAdminAuth ? <>{children}</> : null;
};

export default ProtectedRoute;
