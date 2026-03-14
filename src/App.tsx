
import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ensureStorageBucketsExist } from './config/storage';
import ThemeProvider from './components/ThemeProvider';

// Import your pages
import Index from './pages/Index';
import About from './pages/About';
import Projects from './pages/Projects';
import Experience from './pages/Experience';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Personal from './pages/Personal';
import PersonalPost from './pages/PersonalPost';
import Research from './pages/Research';
import Admin from './pages/Admin';
import AdminLogin from './pages/AdminLogin';
import AdminUnauthorized from './pages/AdminUnauthorized';
import EditAbout from './pages/admin/EditAbout';
import EditExperience from './pages/admin/EditExperience';
import EditProjects from './pages/admin/EditProjects';
import EditBlog from './pages/admin/EditBlog';
import EditPersonal from './pages/admin/EditPersonal';
import EditResearch from './pages/admin/EditResearch';
import NotFound from './pages/NotFound';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from '@/components/ui/sonner';
import ProtectedRoute from './components/ProtectedRoute';
import AdminSettings from './pages/admin/AdminSettings';
import AdminUsers from './pages/admin/AdminUsers';
import { Analytics } from '@vercel/analytics/react';

// Alias Index component as Home
const Home = Index;

function App() {
  useEffect(() => {
    // Initialize storage buckets when the app starts
    ensureStorageBucketsExist();
  }, []);

  return (
    <main>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/experience" element={<Experience />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/personal" element={<Personal />} />
              <Route path="/personal/:id" element={<PersonalPost />} />
              <Route path="/research" element={<Research />} />
              
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/unauthorized" element={<AdminUnauthorized />} />
              
              <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
              <Route path="/admin/users" element={<ProtectedRoute><AdminUsers /></ProtectedRoute>} />
              <Route path="/admin/about/edit" element={<ProtectedRoute><EditAbout /></ProtectedRoute>} />
              <Route path="/admin/experience/edit" element={<ProtectedRoute><EditExperience /></ProtectedRoute>} />
              <Route path="/admin/projects/edit" element={<ProtectedRoute><EditProjects /></ProtectedRoute>} />
              <Route path="/admin/blog/edit" element={<ProtectedRoute><EditBlog /></ProtectedRoute>} />
              <Route path="/admin/personal/edit" element={<ProtectedRoute><EditPersonal /></ProtectedRoute>} />
              <Route path="/admin/research/edit" element={<ProtectedRoute><EditResearch /></ProtectedRoute>} />
              <Route path="/admin/settings" element={<ProtectedRoute><AdminSettings /></ProtectedRoute>} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
          <Toaster position="top-right" richColors />
        </AuthProvider>
      </ThemeProvider>
      <Analytics />
    </main>
  );
}

export default App;
