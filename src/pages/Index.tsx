import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import SectionHeader from '../components/SectionHeader';
import { supabase } from '@/integrations/supabase/client';
import { AboutData, Experience, Project, ResearchPaper } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

const Index = () => {
  const [about, setAbout] = useState<AboutData | null>(null);
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const [featuredExperience, setFeaturedExperience] = useState<Experience[]>([]);
  const [recentPapers, setRecentPapers] = useState<ResearchPaper[]>([]);
  const [loading, setLoading] = useState(true);
  const [emailInput, setEmailInput] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch about data
        const { data: aboutData } = await supabase
          .from('about_data')
          .select('*')
          .single();
        
        // Fetch featured projects
        const { data: projectsData } = await supabase
          .from('projects')
          .select('*')
          .eq('featured', true)
          .limit(3);
        
        // Fetch featured experience (latest 3)
        const { data: experienceData } = await supabase
          .from('experience')
          .select('*')
          .order('start_date', { ascending: false })
          .limit(3);

        // Fetch recent published research papers
        const { data: papersData } = await supabase
          .from('research_papers')
          .select('*')
          .eq('status', 'published')
          .order('date', { ascending: false })
          .limit(3);

        if (experienceData && experienceData.length > 0) {
          const transformed: Experience[] = experienceData.map((item: any) => ({
            id: item.id,
            title: item.title,
            company: item.company,
            location: item.location || '',
            start_date: item.start_date,
            end_date: item.end_date,
            description: item.description || '',
            highlights: item.highlights || [],
            technologies: item.technologies || [],
          }));
          setFeaturedExperience(transformed);
        }

        if (aboutData) {
          // Transform the education data to match our type
          const transformedEducation = aboutData.education as any[] || [];
          const typedEducation = transformedEducation.map(edu => ({
            institution: (edu as any).institution || '',
            degree: (edu as any).degree || '',
            field: (edu as any).field || '',
            startYear: (edu as any).startYear || 0,
            endYear: (edu as any).endYear || null
          }));
          
          // Create a properly typed AboutData object
          const typedAbout: AboutData = {
            id: aboutData.id,
            name: aboutData.name || '',
            title: aboutData.title || '',
            bio: aboutData.bio || '',
            image_url: aboutData.image_url || '',
            skills: aboutData.skills || [],
            education: typedEducation
          };
          
          setAbout(typedAbout);
        }
        
        // Transform projects data
        const transformedProjects = (projectsData || []).map((project: any) => ({
          id: project.id,
          title: project.title,
          description: project.description,
          technologies: project.technologies || [],
          image: project.image || '/placeholder.svg',
          link: project.link,
          github: project.github,
          featured: project.featured,
          category: project.category || 'other'
        }));
        
        setFeaturedProjects(transformedProjects as Project[]);
        
        // Transform research papers to handle missing properties
        const transformedPapers = (papersData || []).map((paper: any) => ({
          ...paper,
          excerpt: paper.abstract ? paper.abstract.substring(0, 150) + '...' : '',
          slug: paper.id // Use ID as slug if there's no slug
        }));
        
        setRecentPapers(transformedPapers as ResearchPaper[]);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load page data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Layout>
      {/* Hero Section — name, title, and bio from CMS (Admin → About) */}
      <section className="relative min-h-[85vh] flex items-center">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-muted/30 z-0" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,hsl(var(--primary)/0.12),transparent)] z-0" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl">
            <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-normal tracking-tight mb-4 text-foreground animate-fade-in">
              {about?.name || 'Juan Garcia'}
            </h1>
            <p className="font-serif text-xl md:text-2xl text-muted-foreground mb-6 animate-fade-in animate-delay-100">
              {about?.title || 'Software Engineer'}
            </p>
            <p className="text-lg text-muted-foreground max-w-xl mb-10 animate-fade-in animate-delay-200">
              {about?.bio?.split('\n\n')[0] || 'Building software and solving problems with code. Open to new opportunities.'}
            </p>
            <div className="flex flex-wrap gap-3 animate-fade-in animate-delay-300">
              <Link to="/about">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg">
                  About Me
                </Button>
              </Link>
              <Link to="/experience">
                <Button variant="outline" className="rounded-lg">
                  Experience
                </Button>
              </Link>
              <Link to="/projects">
                <Button variant="outline" className="rounded-lg">
                  Projects
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-8 left-0 right-0 flex justify-center">
          <a 
            href="#featured" 
            className="rounded-full bg-muted p-3 hover:bg-muted/80 transition-colors"
            aria-label="Scroll down"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 5L12 19M12 19L18 13M12 19L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>
      </section>

      {/* Featured Experience — from CMS (Admin → Experience) */}
      {featuredExperience.length > 0 && (
        <section id="experience" className="section-container bg-muted/30 dark:bg-muted/10">
          <h2 className="section-title">Recent Experience</h2>
          <p className="section-subtitle">Latest roles — add or edit in Admin without re-deploying</p>
          <div className="space-y-6">
            {featuredExperience.map((exp) => (
              <Card key={exp.id} className="card">
                <CardContent className="p-6">
                  <h3 className="text-xl font-serif font-normal text-foreground">
                    {exp.title} · {exp.company}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {exp.location} · {exp.start_date} – {exp.end_date || 'Present'}
                  </p>
                  <p className="text-muted-foreground mt-3">{exp.description}</p>
                  {exp.highlights && exp.highlights.length > 0 && (
                    <ul className="list-disc pl-5 text-muted-foreground mt-2 space-y-1">
                      {exp.highlights.slice(0, 2).map((h, i) => (
                        <li key={i}>{h}</li>
                      ))}
                    </ul>
                  )}
                  <Link to="/experience" className="inline-flex items-center gap-1 mt-3 text-primary hover:underline text-sm font-medium">
                    View all experience <ArrowRight size={14} />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Featured Projects Section */}
      <section id="featured" className="section-container">
        <h2 className="section-title">Featured Projects</h2>
        <p className="section-subtitle">Selected work — manage in Admin → Projects</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {featuredProjects.map((project) => (
            <Card key={project.id} className="card overflow-hidden">
              <div className="w-full h-48 overflow-hidden">
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-serif font-normal mb-3 text-foreground">
                  {project.title}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {project.description}
                </p>
                <div className="flex flex-wrap mb-4">
                  {project.technologies?.map((tech, index) => (
                    <span key={index} className="tag mr-2 mb-2">{tech}</span>
                  ))}
                </div>
                <div className="mt-4">
                  <Link to={`/projects#${project.id}`}>
                    <Button 
                      variant="link" 
                      className="p-0 text-primary hover:underline flex items-center gap-1"
                    >
                      View Details <ArrowRight size={16} />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-10 text-center">
          <Link to="/projects">
            <Button>View All Projects</Button>
          </Link>
        </div>
      </section>

      {/* Recent Articles / Research — only show when you add items in Admin */}
      {recentPapers.length > 0 && (
        <section className="section-container bg-muted/30 dark:bg-muted/10">
          <h2 className="section-title">Recent Articles & Research</h2>
          <p className="section-subtitle">Writing and publications — add in Admin</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {recentPapers.map((paper) => (
              <Card key={paper.id} className="card">
                <CardContent className="p-6">
                  <h3 className="text-xl font-serif font-normal mb-2 text-foreground">
                    {paper.title}
                  </h3>
                  <p className="text-sm mb-3 text-muted-foreground">
                    {paper.authors?.join(', ')} · {new Date(paper.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long'
                    })}
                  </p>
                  <p className="text-muted-foreground mb-4">
                    {(paper as any).excerpt || paper.abstract?.substring(0, 150) + '...'}
                  </p>
                  <Link to={`/research#${paper.id}`}>
                    <Button 
                      variant="link" 
                      className="p-0 text-primary hover:underline flex items-center gap-1"
                    >
                      View Details <ArrowRight size={16} />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link to="/research">
              <Button>Explore All Research</Button>
            </Link>
          </div>
        </section>
      )}

      {/* Get in touch */}
      <section className="section-container bg-muted/50 dark:bg-muted/30 rounded-2xl mx-4 md:mx-auto max-w-5xl border border-border/50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-normal tracking-tight mb-4 text-foreground">Get in Touch</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Open to new opportunities. Reach out via the contact links on my About page.
          </p>
          <Link to="/about">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg">
              View Contact & About
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
