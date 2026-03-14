import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { 
  BookOpen,
  Briefcase,
  FileText,
  Folder,
  User,
  Edit,
  Upload,
  Image,
  UserCog
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const Admin = () => {
  const [counts, setCounts] = useState({
    experiences: 0,
    projects: 0,
    blogPosts: 0,
    personalPosts: 0,
    researchPapers: 0
  });
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        // Fetch counts from all tables
        const [experienceResult, projectsResult, blogPostsResult, personalPostsResult, researchResult] = await Promise.all([
          supabase.from('experience').select('id', { count: 'exact', head: true }),
          supabase.from('projects').select('id', { count: 'exact', head: true }),
          supabase.from('blog_posts').select('id', { count: 'exact', head: true }),
          supabase.from('personal_posts').select('id', { count: 'exact', head: true }),
          supabase.from('research_papers').select('id', { count: 'exact', head: true }),
        ]);

        setCounts({
          experiences: experienceResult.count || 0,
          projects: projectsResult.count || 0,
          blogPosts: blogPostsResult.count || 0,
          personalPosts: personalPostsResult.count || 0,
          researchPapers: researchResult.count || 0
        });
      } catch (error) {
        console.error('Error fetching counts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, []);

  // Fetch recent activity
  const [recentActivity, setRecentActivity] = useState<Array<{
    type: string;
    title: string;
    time: string;
  }>>([]);

  useEffect(() => {
    const fetchRecentActivity = async () => {
      try {
        // Get recent blog posts
        const { data: blogPosts } = await supabase
          .from('blog_posts')
          .select('title, updated_at')
          .order('updated_at', { ascending: false })
          .limit(1);

        // Get recent projects
        const { data: projects } = await supabase
          .from('projects')
          .select('title, updated_at')
          .order('updated_at', { ascending: false })
          .limit(1);

        // Get recent research papers
        const { data: papers } = await supabase
          .from('research_papers')
          .select('title, updated_at')
          .order('updated_at', { ascending: false })
          .limit(1);

        const activity = [];
        
        if (blogPosts && blogPosts.length > 0) {
          activity.push({
            type: 'Updated blog post',
            title: blogPosts[0].title,
            time: formatTimeAgo(blogPosts[0].updated_at)
          });
        }

        if (projects && projects.length > 0) {
          activity.push({
            type: 'Updated project details',
            title: projects[0].title,
            time: formatTimeAgo(projects[0].updated_at)
          });
        }

        if (papers && papers.length > 0) {
          activity.push({
            type: 'Updated research paper',
            title: papers[0].title,
            time: formatTimeAgo(papers[0].updated_at)
          });
        }

        setRecentActivity(activity);
      } catch (error) {
        console.error('Error fetching recent activity:', error);
      }
    };

    fetchRecentActivity();
  }, []);

  // Helper function to format time ago
  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const date = new Date(timestamp);
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
    if (seconds < 2592000) return `${Math.floor(seconds / 604800)} weeks ago`;
    
    return `${Math.floor(seconds / 2592000)} months ago`;
  };

  return (
    <AdminLayout title="Dashboard">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <Card className="bg-[#3E3D32] border-[#4e4d40] text-portfolio-light">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium">Experience</h3>
              <Briefcase className="h-5 w-5 text-portfolio-orange" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-portfolio-accent">
              {loading ? '...' : counts.experiences}
            </div>
            <p className="text-xs text-portfolio-comment">entries</p>
          </CardContent>
        </Card>
        
        <Card className="bg-[#3E3D32] border-[#4e4d40] text-portfolio-light">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium">Projects</h3>
              <Folder className="h-5 w-5 text-portfolio-orange" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-portfolio-accent">
              {loading ? '...' : counts.projects}
            </div>
            <p className="text-xs text-portfolio-comment">items</p>
          </CardContent>
        </Card>
        
        <Card className="bg-[#3E3D32] border-[#4e4d40] text-portfolio-light">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium">Blog Posts</h3>
              <BookOpen className="h-5 w-5 text-portfolio-orange" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-portfolio-accent">
              {loading ? '...' : counts.blogPosts}
            </div>
            <p className="text-xs text-portfolio-comment">articles</p>
          </CardContent>
        </Card>
        
        <Card className="bg-[#3E3D32] border-[#4e4d40] text-portfolio-light">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium">Personal</h3>
              <User className="h-5 w-5 text-portfolio-orange" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-portfolio-accent">
              {loading ? '...' : counts.personalPosts}
            </div>
            <p className="text-xs text-portfolio-comment">posts</p>
          </CardContent>
        </Card>
        
        <Card className="bg-[#3E3D32] border-[#4e4d40] text-portfolio-light">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium">Research</h3>
              <FileText className="h-5 w-5 text-portfolio-orange" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-portfolio-accent">
              {loading ? '...' : counts.researchPapers}
            </div>
            <p className="text-xs text-portfolio-comment">papers</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Admin Settings */}
      <h2 className="text-xl font-semibold mb-4 text-portfolio-secondary">Admin Settings</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Link to="/admin/users">
          <Card className="bg-[#3E3D32] border-[#4e4d40] text-portfolio-light hover:shadow-md transition-shadow cursor-pointer h-full">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <UserCog className="h-6 w-6 text-portfolio-accent" />
                <h3 className="font-semibold">Admin Users</h3>
              </div>
              <p className="text-portfolio-comment text-sm">
                Manage admin users and permissions for the dashboard.
              </p>
            </CardContent>
          </Card>
        </Link>
        
        <Link to="/admin/settings">
          <Card className="bg-[#3E3D32] border-[#4e4d40] text-portfolio-light hover:shadow-md transition-shadow cursor-pointer h-full">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <Edit className="h-6 w-6 text-portfolio-accent" />
                <h3 className="font-semibold">Site Settings</h3>
              </div>
              <p className="text-portfolio-comment text-sm">
                Configure global site settings and preferences.
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
      
      {/* Content Management */}
      <h2 className="text-xl font-semibold mb-4 text-portfolio-secondary">Content Management</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link to="/admin/about/edit">
          <Card className="bg-[#3E3D32] border-[#4e4d40] text-portfolio-light hover:shadow-md transition-shadow cursor-pointer h-full">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <User className="h-6 w-6 text-portfolio-accent" />
                <h3 className="font-semibold">Edit About Page</h3>
              </div>
              <p className="text-portfolio-comment text-sm">
                Update your biography, profile image, and skills.
              </p>
            </CardContent>
          </Card>
        </Link>
        
        <Link to="/admin/experience/edit">
          <Card className="bg-[#3E3D32] border-[#4e4d40] text-portfolio-light hover:shadow-md transition-shadow cursor-pointer h-full">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <Briefcase className="h-6 w-6 text-portfolio-accent" />
                <h3 className="font-semibold">Edit Experience</h3>
              </div>
              <p className="text-portfolio-comment text-sm">
                Update your work history and professional experience.
              </p>
            </CardContent>
          </Card>
        </Link>
        
        <Link to="/admin/projects/edit">
          <Card className="bg-[#3E3D32] border-[#4e4d40] text-portfolio-light hover:shadow-md transition-shadow cursor-pointer h-full">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <Folder className="h-6 w-6 text-portfolio-accent" />
                <h3 className="font-semibold">Edit Projects</h3>
              </div>
              <p className="text-portfolio-comment text-sm">
                Manage your project portfolio and showcase your work.
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
      
      {/* Media Management */}
      <h2 className="text-xl font-semibold mb-4 text-portfolio-secondary">Media Management</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="bg-[#3E3D32] border-[#4e4d40] text-portfolio-light hover:shadow-md transition-shadow cursor-pointer h-full">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <Upload className="h-6 w-6 text-portfolio-accent" />
              <h3 className="font-semibold">File Upload</h3>
            </div>
            <p className="text-portfolio-comment text-sm">
              Upload documents, PDFs, and other files to use across your site.
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-[#3E3D32] border-[#4e4d40] text-portfolio-light hover:shadow-md transition-shadow cursor-pointer h-full">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <Image className="h-6 w-6 text-portfolio-accent" />
              <h3 className="font-semibold">Media Library</h3>
            </div>
            <p className="text-portfolio-comment text-sm">
              Browse and manage your uploaded images, videos, and other media.
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Activity */}
      <div>
        <h3 className="font-semibold text-lg mb-4 text-portfolio-secondary">Recent Activity</h3>
        <div className="space-y-4">
          {recentActivity.length === 0 ? (
            <div className="bg-[#4e4d40] p-4 rounded-md">
              <p className="text-portfolio-tertiary">No recent activity found.</p>
            </div>
          ) : (
            recentActivity.map((activity, index) => (
              <div key={index} className="bg-[#4e4d40] p-4 rounded-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-portfolio-tertiary">{activity.type}</p>
                    <p className="text-sm text-portfolio-comment">"{activity.title}"</p>
                  </div>
                  <p className="text-xs text-portfolio-comment">{activity.time}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default Admin;
