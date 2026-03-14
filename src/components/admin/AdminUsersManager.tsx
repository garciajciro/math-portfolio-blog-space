
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { grantAdminAccess, revokeAdminAccess } from '@/utils/adminUtils';
import { Loader2, UserPlus, UserX } from 'lucide-react';

interface AdminUsersManagerProps {
  onUserChange?: () => void; // Callback for when admin users are updated
}

const AdminUsersManager = ({ onUserChange }: AdminUsersManagerProps) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGrantAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address.');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const result = await grantAdminAccess(email);
      
      if (result.success) {
        toast.success(result.message);
        setEmail('');
        // Call the onUserChange callback if provided
        if (onUserChange) {
          onUserChange();
        }
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Error granting admin access:', error);
      toast.error('Failed to grant admin access. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRevokeAccess = async () => {
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address.');
      return;
    }
    
    if (!window.confirm(`Are you sure you want to revoke admin access from ${email}?`)) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const result = await revokeAdminAccess(email);
      
      if (result.success) {
        toast.success(result.message);
        setEmail('');
        // Call the onUserChange callback if provided
        if (onUserChange) {
          onUserChange();
        }
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Error revoking admin access:', error);
      toast.error('Failed to revoke admin access. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-[#3E3D32] border-[#4e4d40] text-portfolio-light">
      <CardHeader>
        <CardTitle className="text-portfolio-orange">Manage Admin Users</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleGrantAccess} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium">
              User Email Address
            </label>
            <Input
              id="email"
              type="email"
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-portfolio-dark/80 text-portfolio-light border-portfolio-orange/20 focus:border-portfolio-orange focus:ring-portfolio-orange"
            />
            <p className="text-xs text-portfolio-comment">
              Enter the email address of the user you want to grant or revoke admin access.
              The user must already have an account in the system.
            </p>
          </div>
          
          <div className="flex gap-3">
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-portfolio-orange hover:bg-portfolio-accent text-white"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Grant Admin Access
                </>
              )}
            </Button>
            
            <Button
              type="button"
              onClick={handleRevokeAccess}
              disabled={isLoading}
              variant="destructive"
              className="bg-red-600 hover:bg-red-700"
            >
              <UserX className="mr-2 h-4 w-4" />
              Revoke Admin Access
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AdminUsersManager;
