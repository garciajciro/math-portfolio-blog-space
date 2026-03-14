
import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import SectionHeader from '../components/SectionHeader';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { AboutData, Experience } from '@/types';
import { toast } from 'sonner';
import { useIsSectionVisible } from '@/hooks/useSectionVisibility';

const About = () => {
  const visible = useIsSectionVisible('about');
  const [aboutData, setAboutData] = useState<AboutData | null>(null);
  const [experienceData, setExperienceData] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  if (!visible) {
    return (
      <Layout>
        <div className="section-container text-center py-16">
          <p className="text-muted-foreground">This section is not available.</p>
        </div>
      </Layout>
    );
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch about data
        const { data: aboutResponse, error: aboutError } = await supabase
          .from('about_data')
          .select('*')
          .single();
        
        if (aboutError) throw aboutError;
        
        // Transform the education data to match our type
        const transformedEducation = aboutResponse.education as any[] || [];
        const typedEducation = transformedEducation.map(edu => ({
          institution: edu.institution || '',
          degree: edu.degree || '',
          field: edu.field || '',
          startYear: edu.startYear || 0,
          endYear: edu.endYear
        }));
        
        // Sort education by endYear (null/current ones first, then descending)
        const sortedEducation = [...typedEducation].sort((a, b) => {
          // If endYear is null, it means it's current, so it should come first
          if (a.endYear === null && b.endYear === null) return 0;
          if (a.endYear === null) return -1;
          if (b.endYear === null) return 1;
          
          // Otherwise, sort by endYear in descending order
          return b.endYear - a.endYear;
        });

        // Transform research interests if they exist
        const transformedResearchInterests = aboutResponse.research_interests as any[] || [];
        const typedResearchInterests = transformedResearchInterests.map(interest => ({
          title: interest.title || '',
          description: interest.description || ''
        }));
        
        // Create a properly typed AboutData object
        const typedAbout: AboutData = {
          id: aboutResponse.id,
          name: aboutResponse.name || '',
          title: aboutResponse.title || '',
          bio: aboutResponse.bio || '',
          image_url: aboutResponse.image_url || '',
          skills: aboutResponse.skills || [],
          education: sortedEducation,
          researchInterests: typedResearchInterests,
          email: aboutResponse.email ?? undefined,
          linkedin_url: aboutResponse.linkedin_url ?? undefined,
          github_url: aboutResponse.github_url ?? undefined,
          resume_url: aboutResponse.resume_url ?? undefined,
        };
        
        setAboutData(typedAbout);

        // Fetch experience data
        const { data: experienceResponse, error: experienceError } = await supabase
          .from('experience')
          .select('*')
          .order('start_date', { ascending: false });
        
        if (experienceError) throw experienceError;
        
        if (experienceResponse) {
          // Transform to match our Experience type
          const transformedExperience: Experience[] = experienceResponse.map(item => ({
            id: item.id,
            title: item.title,
            company: item.company,
            location: item.location || '',
            start_date: item.start_date,
            end_date: item.end_date,
            description: item.description || '',
            highlights: item.highlights || [],
            technologies: item.technologies || []
          }));
          
          setExperienceData(transformedExperience);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load page data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading || !aboutData) {
    return (
      <Layout>
        <div className="section-container">
          <SectionHeader 
            title="About Me" 
            subtitle="Loading..."
          />
          <div className="flex justify-center py-12">
            <p className="text-muted-foreground">Loading profile data...</p>
          </div>
        </div>
      </Layout>
    );
  }

  const subtitle = aboutData.title || 'Professional profile';
  const hasContact = aboutData.email || aboutData.linkedin_url || aboutData.github_url || aboutData.resume_url;

  return (
    <Layout>
      <div className="section-container">
        <SectionHeader 
          title="About Me" 
          subtitle={subtitle}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Profile Image — only show when we have a valid URL */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="rounded-xl overflow-hidden mb-6 border border-border bg-muted/30 aspect-square max-w-sm">
                {aboutData.image_url && aboutData.image_url.trim() !== '' ? (
                  <img
                    src={aboutData.image_url}
                    alt={aboutData.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                    No photo
                  </div>
                )}
              </div>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-serif font-semibold mb-4 text-foreground">Skills</h3>
                  <div className="flex flex-wrap">
                    {aboutData.skills.map((skill, index) => (
                      <span key={index} className="tag">
                        {skill}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {hasContact && (
                <Card className="mt-6">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-serif font-semibold mb-4 text-foreground">Contact</h3>
                    <div className="space-y-2">
                      {aboutData.email && (
                        <a href={`mailto:${aboutData.email}`} className="block text-muted-foreground hover:text-primary transition-colors">
                          {aboutData.email}
                        </a>
                      )}
                      {aboutData.linkedin_url && (
                        <a href={aboutData.linkedin_url} target="_blank" rel="noopener noreferrer" className="block text-muted-foreground hover:text-primary transition-colors">
                          LinkedIn
                        </a>
                      )}
                      {aboutData.github_url && (
                        <a href={aboutData.github_url} target="_blank" rel="noopener noreferrer" className="block text-muted-foreground hover:text-primary transition-colors">
                          GitHub
                        </a>
                      )}
                      {aboutData.resume_url && (
                        <a href={aboutData.resume_url} target="_blank" rel="noopener noreferrer" className="block text-muted-foreground hover:text-primary transition-colors font-medium">
                          Download Resume
                        </a>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Bio and Information */}
          <div className="lg:col-span-2">
            {/* Bio */}
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <h2 className="font-serif text-2xl font-semibold mb-6 text-foreground">Biography</h2>
              {aboutData.bio.split('\n\n').map((paragraph, idx) => (
                <p key={idx} className="mb-4 text-muted-foreground">{paragraph}</p>
              ))}
            </div>

            {/* Education */}
            <div className="mt-12">
              <h2 className="font-serif text-2xl font-semibold mb-6 text-foreground">Education</h2>
              <div className="space-y-8">
                {aboutData.education.map((edu, index) => (
                  <div key={index} className="border-l-4 border-primary pl-6">
                    <h3 className="font-serif text-xl font-semibold text-foreground">
                      {edu.degree} in {edu.field}
                    </h3>
                    <p className="text-lg font-medium mb-1">{edu.institution}</p>
                    <p className="text-muted-foreground">
                      {edu.startYear} - {edu.endYear ?? 'Present'}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Work Experience */}
            {experienceData.length > 0 && (
              <div className="mt-12">
                <h2 className="font-serif text-2xl font-semibold mb-6 text-foreground">Work Experience</h2>
                <div className="space-y-8">
                  {experienceData.map((exp) => (
                    <div key={exp.id} className="border-l-4 border-primary pl-6">
                      <h3 className="font-serif text-xl font-semibold text-foreground">
                        {exp.title}
                      </h3>
                      <p className="text-lg font-medium mb-1">{exp.company}</p>
                      <p className="text-muted-foreground mb-2">{exp.location}</p>
                      <p className="text-muted-foreground mb-3">
                        {exp.start_date} - {exp.end_date || 'Present'}
                      </p>
                      <p className="text-muted-foreground mb-3">{exp.description}</p>
                      
                      {exp.highlights && exp.highlights.length > 0 && (
                        <div className="mb-3">
                          <h4 className="font-medium text-foreground mb-2">Key Highlights:</h4>
                          <ul className="list-disc pl-5 text-muted-foreground">
                            {exp.highlights.map((highlight, idx) => (
                              <li key={idx}>{highlight}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {exp.technologies && exp.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {exp.technologies.map((tech, idx) => (
                            <span key={idx} className="tag">
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Research / Other Interests — only show when you add them in Admin */}
            {aboutData.researchInterests && aboutData.researchInterests.length > 0 && (
              <div className="mt-12">
                <h2 className="font-serif text-2xl font-semibold mb-6 text-foreground">Interests</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {aboutData.researchInterests.map((interest, index) => (
                    <Card key={index}>
                      <CardContent className="p-6">
                        <h3 className="font-serif text-lg font-semibold mb-3 text-foreground">
                          {interest.title}
                        </h3>
                        <p className="text-muted-foreground">
                          {interest.description}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;
