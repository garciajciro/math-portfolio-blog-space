import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import SectionHeader from '../components/SectionHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Github, ExternalLink } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Project } from '../types';
import { toast } from 'sonner';
import { useIsSectionVisible } from '@/hooks/useSectionVisibility';

const Projects = () => {
  const visible = useIsSectionVisible('projects');
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .order('title');
          
        if (error) throw error;
        
        const transformedData: Project[] = (data || []).map(project => ({
          id: project.id,
          title: project.title,
          description: project.description || '',
          category: (project.category || 'other') as Project['category'],
          technologies: project.technologies || [],
          image: project.image || '/placeholder.svg',
          github: project.github || undefined,
          link: project.link || undefined,
          featured: project.featured || false
        }));
        
        setProjects(transformedData);
      } catch (error) {
        console.error('Error fetching projects:', error);
        toast.error('Failed to load projects');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProjects();
  }, []);

  if (!visible) {
    return (
      <Layout>
        <div className="section-container text-center py-16">
          <p className="text-muted-foreground">This section is not available.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="section-container">
        <SectionHeader 
          title="My Projects" 
          subtitle="Showcasing my work and research contributions"
        />

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">Loading projects...</p>
          </div>
        )}

        {/* Projects Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <Card key={project.id} id={project.id} className="card overflow-hidden h-full flex flex-col">
                <div className="aspect-video overflow-hidden">
                  <img 
                    src={project.image} 
                    alt={project.title} 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <CardContent className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-serif font-semibold mb-3 text-portfolio-blue dark:text-white">
                    {project.title}
                  </h3>
                  <p className="text-muted-foreground mb-4 flex-grow">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap mb-4">
                    {project.technologies.map((tech, index) => (
                      <span key={index} className="tag">{tech}</span>
                    ))}
                  </div>
                  <div className="mt-auto flex flex-wrap gap-2">
                    {project.link && (
                      <a href={project.link} target="_blank" rel="noopener noreferrer">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex items-center gap-2"
                        >
                          <ExternalLink size={16} />
                          Visit Site
                        </Button>
                      </a>
                    )}
                    {project.github && (
                      <a href={project.github} target="_blank" rel="noopener noreferrer">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex items-center gap-2"
                        >
                          <Github size={16} />
                          View Code
                        </Button>
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && projects.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">No projects yet</h3>
            <p className="text-muted-foreground">Projects will appear here when added.</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Projects;
