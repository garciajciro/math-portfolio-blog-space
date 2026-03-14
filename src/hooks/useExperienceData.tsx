
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Experience } from '@/types';
import { toast } from 'sonner';

export const useExperienceData = () => {
  const [experienceItems, setExperienceItems] = useState<Experience[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Load experience data
  useEffect(() => {
    const fetchExperienceData = async () => {
      try {
        const { data, error } = await supabase
          .from('experience')
          .select('*')
          .order('start_date', { ascending: false });
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          // Transform to match our Experience type
          const transformedData: Experience[] = data.map(item => ({
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
          
          setExperienceItems(transformedData);
        } else {
          setExperienceItems([]);
        }
      } catch (err) {
        console.error("Error fetching experience data:", err);
        toast.error("Failed to load experience data.");
        setExperienceItems([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchExperienceData();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // First collect existing IDs to determine what to delete
      const { data: existingExperiences } = await supabase
        .from('experience')
        .select('id');
      
      if (existingExperiences) {
        const existingIds = existingExperiences.map(exp => exp.id);
        const currentIds = experienceItems.map(exp => 
          exp.id.startsWith('exp-') ? null : exp.id
        ).filter(Boolean) as string[];
        
        // Find IDs that exist in the database but not in our current items (need to be deleted)
        const idsToDelete = existingIds.filter(id => !currentIds.includes(id));
        
        // Delete experiences that have been removed locally
        if (idsToDelete.length > 0) {
          const { error: deleteError } = await supabase
            .from('experience')
            .delete()
            .in('id', idsToDelete);
          
          if (deleteError) throw deleteError;
        }
      }
      
      // Process each item individually to handle new items differently from existing ones
      for (const item of experienceItems) {
        if (item.id.startsWith('exp-')) {
          // This is a new item, so we need to insert it without an ID (let Supabase generate it)
          const { error: insertError } = await supabase
            .from('experience')
            .insert({
              title: item.title,
              company: item.company,
              location: item.location,
              start_date: item.start_date,
              end_date: item.end_date,
              description: item.description,
              highlights: item.highlights,
              technologies: item.technologies
            });
            
          if (insertError) throw insertError;
        } else {
          // This is an existing item, so we update it
          const { error: updateError } = await supabase
            .from('experience')
            .update({
              title: item.title,
              company: item.company,
              location: item.location,
              start_date: item.start_date,
              end_date: item.end_date,
              description: item.description,
              highlights: item.highlights,
              technologies: item.technologies
            })
            .eq('id', item.id);
            
          if (updateError) throw updateError;
        }
      }
      
      // Refresh the data after saving
      const { data: refreshedData, error: refreshError } = await supabase
        .from('experience')
        .select('*')
        .order('start_date', { ascending: false });
      
      if (refreshError) throw refreshError;
      
      if (refreshedData) {
        // Update local state with the refreshed data
        const transformedData: Experience[] = refreshedData.map(item => ({
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
        
        setExperienceItems(transformedData);
      }
      
      toast.success("Changes saved", {
        description: "Your experience page changes have been saved successfully."
      });
    } catch (error) {
      console.error("Error saving experience data:", error);
      toast.error("Save failed", {
        description: "There was an error saving your changes. Please try again."
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddExperience = () => {
    const newExperience: Experience = {
      id: `exp-${Date.now()}`,
      title: "New Position",
      company: "Company Name",
      location: "Location",
      start_date: new Date().toISOString().slice(0, 7), // YYYY-MM format
      end_date: null,
      description: "Job description goes here",
      highlights: ["Add highlights here"],
      technologies: ["Technology 1"]
    };
    
    setExperienceItems([...experienceItems, newExperience]);
  };

  const handleRemoveExperience = (id: string) => {
    setExperienceItems(experienceItems.filter(exp => exp.id !== id));
  };

  const updateExperienceField = (id: string, field: keyof Experience, value: any) => {
    setExperienceItems(experienceItems.map(exp => {
      if (exp.id === id) {
        return { ...exp, [field]: value };
      }
      return exp;
    }));
  };

  const updateHighlights = (id: string, highlights: string[]) => {
    setExperienceItems(experienceItems.map(exp => {
      if (exp.id === id) {
        return { ...exp, highlights };
      }
      return exp;
    }));
  };

  const updateTechnologies = (id: string, technologies: string[]) => {
    setExperienceItems(experienceItems.map(exp => {
      if (exp.id === id) {
        return { ...exp, technologies };
      }
      return exp;
    }));
  };

  const addHighlight = (id: string) => {
    setExperienceItems(experienceItems.map(exp => {
      if (exp.id === id) {
        return { ...exp, highlights: [...exp.highlights, "New highlight"] };
      }
      return exp;
    }));
  };

  const removeHighlight = (id: string, index: number) => {
    setExperienceItems(experienceItems.map(exp => {
      if (exp.id === id) {
        const newHighlights = [...exp.highlights];
        newHighlights.splice(index, 1);
        return { ...exp, highlights: newHighlights };
      }
      return exp;
    }));
  };

  const addTechnology = (id: string) => {
    setExperienceItems(experienceItems.map(exp => {
      if (exp.id === id) {
        return { ...exp, technologies: [...exp.technologies, "New technology"] };
      }
      return exp;
    }));
  };

  const removeTechnology = (id: string, index: number) => {
    setExperienceItems(experienceItems.map(exp => {
      if (exp.id === id) {
        const newTechnologies = [...exp.technologies];
        newTechnologies.splice(index, 1);
        return { ...exp, technologies: newTechnologies };
      }
      return exp;
    }));
  };

  return {
    experienceItems,
    isLoading,
    isSaving,
    handleSave,
    handleAddExperience,
    handleRemoveExperience,
    updateExperienceField,
    updateHighlights,
    updateTechnologies,
    addHighlight,
    removeHighlight,
    addTechnology,
    removeTechnology
  };
};
