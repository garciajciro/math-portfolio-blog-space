import React from 'react';
import Layout from '../components/Layout';
import SectionHeader from '../components/SectionHeader';
import { supabase } from '@/integrations/supabase/client';
import { Experience as ExperienceType } from '@/types';
import { toast } from 'sonner';
import ExperienceItem from '@/components/experience/ExperienceItem';
import { useQuery } from '@tanstack/react-query';
import { useIsSectionVisible } from '@/hooks/useSectionVisibility';

const fetchExperiences = async () => {
  const { data, error } = await supabase
    .from('experience')
    .select('*')
    .order('start_date', { ascending: false });
    
  if (error) {
    console.error('Error fetching experiences:', error);
    throw error;
  }
  
  return data as ExperienceType[] || [];
};

const Experience = () => {
  const visible = useIsSectionVisible('experience');
  const { data: experiences = [], isLoading, error } = useQuery({
    queryKey: ['experiences'],
    queryFn: fetchExperiences
  });
  
  // Show error toast if there's an error
  React.useEffect(() => {
    if (error) {
      toast.error('Failed to load experience data. Please try again later.');
    }
  }, [error]);

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
          title="Experience"
          subtitle="Work history — add or edit entries in Admin without re-deploying"
        />
        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">Loading experience...</div>
        ) : (
          <div className="space-y-6">
            {experiences.map((exp) => (
              <ExperienceItem key={exp.id} experience={exp} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Experience;
