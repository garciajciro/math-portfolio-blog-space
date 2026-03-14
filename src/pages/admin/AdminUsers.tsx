
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/AdminLayout';
import AdminUsersManager from '@/components/admin/AdminUsersManager';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getAdminUsers } from '@/utils/adminUtils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

type AdminUser = {
  user_id: string;
  profiles?: {
    full_name: string | null;
    avatar_url: string | null;
  } | null;
};

const AdminUsers = () => {
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchAdminUsers = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { success, admins, message } = await getAdminUsers();
      
      if (success && Array.isArray(admins)) {
        setAdminUsers(admins as AdminUser[]);
        if (admins.length === 0) {
          toast.info("No admin users found. You can add one using the form above.");
        }
      } else {
        setError(message || "An error occurred while fetching admin users");
        toast.error("Failed to load admin users");
      }
    } catch (err) {
      console.error('Error fetching admin users:', err);
      setError('Failed to load admin users. Please try again later.');
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminUsers();
  }, []);

  // Get initials from name or use "U" for unknown
  const getInitials = (name: string | null): string => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <AdminLayout title="Admin Users">
      <div className="space-y-8">
        <AdminUsersManager onUserChange={fetchAdminUsers} />
        
        <Card className="bg-[#3E3D32] border-[#4e4d40] text-portfolio-light">
          <CardHeader>
            <CardTitle className="text-portfolio-orange flex items-center justify-between">
              <span>Current Admin Users</span>
              <Button 
                onClick={fetchAdminUsers}
                variant="outline"
                size="sm"
                className="text-sm bg-portfolio-dark/50 hover:bg-portfolio-dark text-portfolio-light"
              >
                <RefreshCw className="h-4 w-4 mr-2" /> Refresh
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[250px]" />
                      <Skeleton className="h-4 w-[200px]" />
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="bg-red-500/10 p-4 rounded-md flex items-center text-red-500">
                <AlertCircle className="h-5 w-5 mr-2" />
                {error}
              </div>
            ) : adminUsers.length === 0 ? (
              <div className="text-center py-6 text-portfolio-comment">
                No admin users found.
              </div>
            ) : (
              <div className="space-y-4">
                {adminUsers.map((admin) => (
                  <div key={admin.user_id} className="flex items-center p-3 rounded-md bg-portfolio-dark/40">
                    <Avatar className="h-10 w-10 mr-4">
                      {admin.profiles?.avatar_url ? (
                        <AvatarImage src={admin.profiles.avatar_url} alt="Admin avatar" />
                      ) : (
                        <AvatarFallback className="bg-portfolio-accent/80 text-white">
                          {getInitials(admin.profiles?.full_name)}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div>
                      <div className="font-medium">
                        {admin.profiles?.full_name || 'Unnamed Admin'}
                      </div>
                      <div className="text-sm text-portfolio-comment">
                        User ID: {admin.user_id}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;
