
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShieldAlert } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const AdminUnauthorized = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-portfolio-dark/30 px-4">
      <ShieldAlert className="text-portfolio-orange h-16 w-16 mb-6" />
      <h1 className="text-3xl font-bold mb-2">Access Denied</h1>
      
      {user ? (
        <p className="text-muted-foreground mb-6 text-center max-w-md">
          Your account doesn't have permission to access this area.
        </p>
      ) : (
        <p className="text-muted-foreground mb-6 text-center max-w-md">
          You need to be signed in to access this area. Please log in to continue.
        </p>
      )}

      <div className="flex gap-4">
        <Button asChild variant="outline">
          <Link to="/">Return to Home</Link>
        </Button>
        <Button asChild className="bg-portfolio-orange hover:bg-portfolio-accent">
          <Link to="/admin/login">Login</Link>
        </Button>
      </div>
    </div>
  );
};

export default AdminUnauthorized;
