
import { ReactNode } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

interface AdminLayoutProps {
  title: string;
  children: ReactNode;
}

const AdminLayout = ({ title, children }: AdminLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  
  // Determine which sidebar item is active
  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  // Handle navigation to different admin sections
  const handleNavigate = (path: string) => {
    navigate(path);
  };

  // Handle exit admin - sign out the user
  const handleExitAdmin = async () => {
    try {
      await signOut();
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
    }
  };
  
  return (
    <div className="min-h-screen bg-portfolio-dark text-portfolio-light">
      {/* Admin Header */}
      <header className="bg-portfolio-primary text-portfolio-light py-4 px-6 flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-xl font-semibold">Admin Dashboard</h1>
        </div>
        <Button 
          onClick={handleExitAdmin}
          variant="outline" 
          size="sm" 
          className="border-portfolio-light text-portfolio-light hover:bg-white/20"
        >
          Exit Admin
        </Button>
      </header>
      
      {/* Admin Content */}
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-[#3E3D32] min-h-[calc(100vh-4rem)] p-6 hidden md:block">
          <nav className="space-y-2">
            <div 
              className={`p-3 rounded-md cursor-pointer ${isActive('/admin') && !isActive('/admin/') ? 'bg-portfolio-primary text-portfolio-light' : 'hover:bg-[#4e4d40]'}`}
              onClick={() => handleNavigate('/admin')}
            >
              Dashboard
            </div>
            <div 
              className={`p-3 rounded-md cursor-pointer ${isActive('/admin/about') ? 'bg-portfolio-primary text-portfolio-light' : 'hover:bg-[#4e4d40]'}`}
              onClick={() => handleNavigate('/admin/about/edit')}
            >
              About
            </div>
            <div 
              className={`p-3 rounded-md cursor-pointer ${isActive('/admin/experience') ? 'bg-portfolio-primary text-portfolio-light' : 'hover:bg-[#4e4d40]'}`}
              onClick={() => handleNavigate('/admin/experience/edit')}
            >
              Experience
            </div>
            <div 
              className={`p-3 rounded-md cursor-pointer ${isActive('/admin/projects') ? 'bg-portfolio-primary text-portfolio-light' : 'hover:bg-[#4e4d40]'}`}
              onClick={() => handleNavigate('/admin/projects/edit')}
            >
              Projects
            </div>
            <div 
              className={`p-3 rounded-md cursor-pointer ${isActive('/admin/blog') ? 'bg-portfolio-primary text-portfolio-light' : 'hover:bg-[#4e4d40]'}`}
              onClick={() => handleNavigate('/admin/blog/edit')}
            >
              Blog
            </div>
            <div 
              className={`p-3 rounded-md cursor-pointer ${isActive('/admin/personal') ? 'bg-portfolio-primary text-portfolio-light' : 'hover:bg-[#4e4d40]'}`}
              onClick={() => handleNavigate('/admin/personal/edit')}
            >
              Personal Posts
            </div>
            <div 
              className={`p-3 rounded-md cursor-pointer ${isActive('/admin/research') ? 'bg-portfolio-primary text-portfolio-light' : 'hover:bg-[#4e4d40]'}`}
              onClick={() => handleNavigate('/admin/research/edit')}
            >
              Research Papers
            </div>
            <div 
              className={`p-3 rounded-md cursor-pointer ${isActive('/admin/settings') ? 'bg-portfolio-primary text-portfolio-light' : 'hover:bg-[#4e4d40]'}`}
              onClick={() => handleNavigate('/admin/settings')}
            >
              Settings
            </div>
          </nav>
        </aside>
        
        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/admin" className="md:hidden">
                <Button variant="outline" size="icon">
                  <ArrowLeft size={18} />
                </Button>
              </Link>
              <h2 className="text-2xl font-serif font-semibold">{title}</h2>
            </div>
          </div>
          
          {/* Admin Content */}
          <div className="monokai-card p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
